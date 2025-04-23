import React, { useState, createContext, useContext, useEffect } from 'react';
// import { supabase } from '../../utils/supabaseClient';
import { useRouter } from 'expo-router';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  // const [currentUser, setCurrentUser] = useState(null);
  // const [isAuthenticated, setIsAuthenticated] = useState(false);
  // const [isLoading, setIsLoading] = useState(true);
  // const [emailContext, setEmailContext] = useState(null);
  // const router = useRouter();

  // Fetch user session on mount and on auth state changes
  // useEffect(() => {
  //   const fetchSession = async () => {
  //     const { data: { session } } = await supabase.auth.getSession();
  //     if (session) {
  //       // Log and store the user details from the session
  //       console.log('Session user:', session.user);
  //       setCurrentUser(session.user);
  //       setIsAuthenticated(true);
  //     } else {
  //       setCurrentUser(null);
  //       setIsAuthenticated(false);
  //     }
  //     setIsLoading(false);
  //   };

  //   fetchSession();

  //   // Listen for auth state changes
  //   // const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
  //   //   if (session?.user) {
  //   //     console.log('Auth state changed. New session user:', session.user);
  //   //     setCurrentUser(session.user);
  //   //     setIsAuthenticated(true);
  //   //   } else {
  //   //     setCurrentUser(null);
  //   //     setIsAuthenticated(false);
  //   //   }
  //   // });

  //   return () => {
  //     authListener.subscription.unsubscribe();
  //   };
  // }, []);

  // Logout function
  // const logout = async () => {
  //   await supabase.auth.signOut();
  //   setCurrentUser(null);
  //   setIsAuthenticated(false);
  //   router.push('/(auth)/sign-in');
  // };


  // Update user data
  // const updateUser = async (updatedData) => {

  // Attempt to update user data in Supabase
  // await supabase.auth.updateUser({
  //   email: updatedData.email,
  //   data: { name: updatedData.name },
  // });


  // };


  // return (
  // <AuthContext.Provider value={{ currentUser, isAuthenticated, isLoading, logout, updateUser, emailContext, setEmailContext }}>
  { children }
  // </AuthContext.Provider>
  // );
};

export default AuthContext;