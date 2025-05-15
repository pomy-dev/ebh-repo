import React from 'react';
import { AuthProvider } from './auth-context';


const GlobalContextProvider = ({ children }) => {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
};

export default GlobalContextProvider;
