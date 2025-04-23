import React from 'react';
import { AuthProvider } from '../appstate/AuthContext';


const GlobalContextProvider = ({ children }) => {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
};

export default GlobalContextProvider;
