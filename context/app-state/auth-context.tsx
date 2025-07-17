import * as SecureStore from 'expo-secure-store';
import { jwtDecode } from 'jwt-decode';
import { View, ActivityIndicator } from 'react-native';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../../utils/supabase-client';

interface AuthProps {
  authState?: { token: string | null; authenticated: boolean | null; user?: { id: string, name: string; email: string; user_number?: number | null, tenant_id?: string | null } };
  onRegister?: (name: string, email: string, user_number: number, password: string) => Promise<any>;
  onLogin?: (email: string, password: string) => Promise<any>;
  onLogout?: () => Promise<{ error: boolean; msg?: string }>;
  onUpdateUser?: (name: string | null, email: string | null) => Promise<any>;
}

const TOKEN_KEY = 'dksopadmopamIOOADHSNKLndsdlkamisandioewqjeew8jdoaifna989r3u8rh9pq32h3np89PH9EWNLwnuiph98pry34879rhq3lfdnLHFRLWFNEWLNEUIHD398RH3WALNlufl';
const AuthContext = createContext<AuthProps>({});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authState, setAuthState] = useState<{
    token: string | null;
    authenticated: boolean | null;
    user?: { id: string; name: string; email: string; user_number?: number | null; tenant_id?: string | null };
  }>({ token: null, authenticated: null, user: undefined });
  const [loading, setLoading] = useState(true);

  const loadUser = async () => {
    setLoading(true);
    try {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      if (!token) {
        setAuthState({ token: null, authenticated: false, user: undefined });
        return;
      }

      const decoded: any = jwtDecode(token);
      const { data: userRow, error } = await supabase
        .from('users')
        .select('id, name, email, user_number, tenant_id')
        .eq('id', decoded.sub)
        .single();

      if (error || !userRow) {
        console.error('Failed to fetch user:', error?.message);
        setAuthState({ token: null, authenticated: false, user: undefined });
        return;
      }

      setAuthState({
        token,
        authenticated: true,
        user: {
          id: userRow.id || decoded.sub,
          name: userRow.name || '',
          email: userRow.email || '',
          user_number: userRow.user_number || null,
          tenant_id: userRow.tenant_id || null,
        },
      });
    } catch (err) {
      console.error('Failed to restore session:', err);
      setAuthState({ token: null, authenticated: false, user: undefined });
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, user_number: number, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        return { error: true, msg: error.message };
      }

      if (data.user) {
        const userId = data.user.id;
        const { error: insertError } = await supabase
          .from('users')
          .insert([{ id: userId, name, email, user_number, tenant_id: null }]);

        if (insertError) {
          console.error('Error inserting user:', insertError.message);
          return { error: true, msg: insertError.message || 'Failed to create user profile' };
        }

        return { error: false, msg: 'Registration successful!' };
      }

      return { error: false, msg: 'Check your email to complete registration.' };
    } catch (err: any) {
      return { error: true, msg: err.message || 'Something went wrong' };
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error || !data.session) {
        return { error: true, msg: error?.message || 'Login failed' };
      }

      const token = data.session.access_token;
      await SecureStore.setItemAsync(TOKEN_KEY, token);
      const decoded: any = jwtDecode(token);

      const { data: userRow, error: userError } = await supabase
        .from('users')
        .select('id, name, email, user_number, tenant_id')
        .eq('id', decoded.sub)
        .single();

      if (userError || !userRow) {
        return { error: true, msg: 'User not found. Consider registering!' };
      }

      setAuthState({
        token,
        authenticated: true,
        user: {
          id: userRow.id,
          name: userRow.name || '',
          email: userRow.email || '',
          user_number: userRow.user_number || null,
          tenant_id: userRow.tenant_id || null,
        },
      });

      return { error: false, user: userRow };
    } catch (err: any) {
      return { error: true, msg: err.message || 'Something went wrong' };
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      setAuthState({ token: null, authenticated: false, user: undefined });
      return { error: false, msg: 'Logged out successfully' };
    } catch (err: any) {
      console.error('Logout failed:', err);
      return { error: true, msg: err.message || 'Logout failed' };
    }
  };

  const updateUser = async (name: string | null, email: string | null) => {
    try {
      // Placeholder for user update logic
      return { error: true, msg: 'Update user not implemented' };
    } catch (err: any) {
      return { error: true, msg: err.message || 'Something went wrong' };
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <AuthContext.Provider value={{ authState, onRegister: register, onLogin: login, onLogout: logout, onUpdateUser: updateUser }}>
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#2563EB" />
        </View>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export default AuthContext;