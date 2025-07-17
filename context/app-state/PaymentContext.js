// PaymentContext.js
import React, { createContext, useContext, useState } from "react";

// 1. Create the context
const PaymentContext = createContext(undefined);

// 2. Create the provider
export const PaymentProvider = ({ children }) => {
  const [paymentData, setPaymentData] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [tenantID, setTennantID] = useState({ id: '', aptId: '' });

  const storePaymentData = (data) => setPaymentData(data);
  const changeTab = (tab) => setActiveTab(tab);
  const setId = (data) => setTennantID(data);

  return (
    <PaymentContext.Provider value={{
      tenantID,
      setId,
      paymentData,
      storePaymentData,
      activeTab,
      changeTab
    }}>
      {children}
    </PaymentContext.Provider>
  );
};

// 3. Create a hook that checks for undefined
export const usePaymentContext = () => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error("usePaymentContext must be used within a PaymentProvider");
  }
  return context;
};
