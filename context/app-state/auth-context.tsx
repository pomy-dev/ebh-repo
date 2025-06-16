import * as SecureStore from 'expo-secure-store';
import { jwtDecode } from 'jwt-decode';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../../utils/supabase-client';

interface AuthProps {
  authState?: { token: string | null; authenticated: boolean | null; user?: { id: string, name: string; email: string; user_number?: number | null } };
  onRegister?: (name: string, email: string, user_number: number, password1: string, password2: string) => Promise<any>;
  onLogin?: (email: string, password: string) => Promise<any>;
  onLogout?: () => Promise<any>;
  onUpdateUser?: (name: string | null, email: string | null) => Promise<any>;
}

// const TOKEN_KEY = 'my-jwt-token';
const TOKEN_KEY = 'dksopadmopamIOOADHSNKLndsdlkamisandioewqjeew8jdoaifna989r3u8rh9pq32h3np89PH9EWNLwnuiph98pry34879rhq3lfdnLHFRLWFNEWLNEUIHD398RH3WALNlufl';
const AuthContext = createContext<AuthProps>({});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authState, setAuthState] = useState<{ token: string | null; authenticated: boolean | null; user?: { id: string; name: string; email: string; user_number?: number | null, apartment_id?: string | null } }>({ token: null, authenticated: null, user: undefined });
  const [paymentData, setPaymentData] = useState(null);




  // 👇 Restore user session on app startup
  const loadUser = async () => {
    const token = await SecureStore.getItemAsync(TOKEN_KEY);

    if (!token) return;

    try {
      const decoded: any = jwtDecode(token);

      const { data: userRow, error } = await supabase
        .from('users')
        .select('id, name, email, user_number, apartment_id')
        .eq('id', decoded.sub)
        .single();

      if (!error && userRow) {
        setAuthState({
          token,
          authenticated: true,
          user: {
            id: userRow.id || decoded.sub,
            name: userRow.name || null,
            email: userRow.email || null,
            user_number: userRow.user_number || null,
            apartment_id: userRow.apartment_id || null
          },
        });
      }
    } catch (err) {
      console.log('Failed to restore session:', err);
    }
  };

  const register = async (name: string, email: string, user_number: number, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      });

      if (error) {
        return { error: true, msg: error.message };
      }

      if (data.user) {
        const userId = data.user.id;

        const { error: insertError } = await supabase
          .from('users')
          .insert([{ id: userId, name, email, user_number, apartment_id: null }]);

        if (insertError) {
          console.error('Error inserting user:', insertError.message)
          return { error: true, msg: insertError.details || insertError.message };
        }

        return { error: false, msg: 'Registration successful!' };
      } else {
        return {
          error: false,
          msg: 'Check your email to complete registration.',
        };
      }
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

      const { data: userRow } = await supabase
        .from('users')
        .select('id, name, email, user_number, apartment_id')
        .eq('id', decoded.sub)
        .single();

      setAuthState({
        token,
        authenticated: true,
        user: {
          id: userRow?.id || decoded.sub || '',
          name: userRow?.name || '',
          email,
          user_number: userRow?.user_number || '',
          apartment_id: userRow?.apartment_id || null
        },
      });

      return { error: false, msg: 'Login successful' };
    } catch (err: any) {
      return { error: true, msg: err.message || 'Something went wrong' };
    }
  }

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      setAuthState({ token: null, authenticated: false, user: undefined });
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  const updateUser = async (name: string | null, email: string | null) => {
    try {
      // const res = await axios.put(`${API_URL}/users/update`, { name, email });
      // return res.data;
    } catch (e: any) {
      return { error: true, msg: e.message };
    }
  };

  const value = {
    authState,
    setAuthState,
    onRegister: register,
    onLogin: login,
    onLogout: logout,
    onUpdateUser: updateUser,
  };

  useEffect(() => {
    const loadToken = async () => {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      if (token) {
        try {
          const decoded: any = jwtDecode(token);
          const { data: userRow } = await supabase
            .from('users')
            .select('id, name, email, user_number, apartment_id')
            .eq('id', decoded.sub)
            .single();

          if (userRow) {
            setAuthState({
              token,
              authenticated: true,
              user: {
                id: userRow.id,
                name: userRow.name,
                email: userRow.email,
                user_number: userRow.user_number,
                apartment_id: userRow.apartment_id || null
              },
            });
          }
        } catch (err) {
          console.error('Token decode failed:', err);
        }
      }
    };
    loadUser();
    loadToken();
  }, []);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;