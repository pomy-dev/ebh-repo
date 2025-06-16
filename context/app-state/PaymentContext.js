import React, { createContext, useContext, useState } from "react";

const PaymentContext = createContext();

export const PaymentProvider = ({ children }) => {
  const [paymentData, setPaymentData] = useState([]);
  const [activeTab, setActiveTab] = useState("all");

  const storePaymentData = (data) => setPaymentData(data);
  const changeTab = (tab) => setActiveTab(tab);

  return (
    <PaymentContext.Provider value={{ paymentData, storePaymentData, activeTab, changeTab }}>
      {children}
    </PaymentContext.Provider>
  );
};

export const usePaymentContext = () => useContext(PaymentContext);
