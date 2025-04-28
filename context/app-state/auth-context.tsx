import React, { useState, createContext, useContext, useEffect } from 'react';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { jwtDecode } from 'jwt-decode';

interface AuthProps {
  authState?: { token: string | null; authenticated: boolean | null; user?: { name: string; email: string } };
  onRegister?: (name: string, email: string, password1: string, password2: string) => Promise<any>;
  onLogin?: (email: string, password: string) => Promise<any>;
  onLogout?: () => Promise<any>;
  onUpdateUser?: (name: string | null, email: string | null) => Promise<any>;
}

const TOKEN_KEY = 'my-jwt-token';
const API_URL = 'https://api.developbetterapps.com';
const AuthContext = createContext<AuthProps>({});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({ token: null, authenticated: null, user: null });

  const register = async (name: string, email: string, password: string) => {
    try {

      await axios.post(`${API_URL}/users`, { name, email, password });
      return { error: false, msg: 'Registration successful!' };

    } catch (e: any) {
      if (e.response?.status === 409) {
        return { error: true, msg: 'Email is already registered' };
      }

      return { error: true, msg: e.message || 'Something went wrong' };
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const result = await axios.post(`${API_URL}/auth`, { email, password })
      const token = result.data.token;
      console.log('Login successful:', result.data);

      const decoded: any = jwtDecode(result.data.token);

      const user = {
        name: decoded.name,
        email: decoded.email
      };

      setAuthState({ token: result.data.token, authenticated: true, user });
      axios.defaults.headers.common['Authorization'] = `Bearer ${result.data.token}`;
      await SecureStore.setItemAsync(TOKEN_KEY, result.data.token);

      return result.data;

    } catch (e: any) {
      console.log('Login error:', e.message);
      return {
        error: true,
        msg: e.response?.data?.msg || e.message || "Something went wrong"
      };
    }
  }

  const logout = async () => {
    // delete token from storage
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    // remove token from axios headers
    axios.defaults.headers.common['Authorization'] = '';

    // Reset auth state
    setAuthState({ token: null, authenticated: false, user: null });
    console.log('Logged out successfully');
  }

  const updateUser = async (name: string, email: string) => {
    try {
      const res = await axios.put(`${API_URL}/users/update`, { name, email });
      return res.data;
    } catch (e: any) {
      return { error: true, msg: e.message };
    }
  };

  const value = {
    onRegister: register,
    onLogin: login,
    onLogout: logout,
    onUpdateUser: updateUser,
    authState
  };

  useEffect(() => {
    const loadToken = async () => {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const decoded: any = jwtDecode(token);
        const user = {
          name: decoded.name,
          email: decoded.email
        };
        setAuthState({ token, authenticated: true, user });
      }
    };
    loadToken();
  }, []);


  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;