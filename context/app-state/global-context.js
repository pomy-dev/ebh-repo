import React from 'react';
import { AuthProvider } from './auth-context';
// import { PaymentProvider } from "../appstate/PaymentContext";
import { PaymentProvider } from "./PaymentContext";


const GlobalContextProvider = ({ children }) => {
  return (
    <AuthProvider>
      <PaymentProvider>{children}</PaymentProvider>
    </AuthProvider>
  );
};

export default GlobalContextProvider;


