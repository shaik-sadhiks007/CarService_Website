import React, { createContext, useState } from "react";

export const CarDataContext = createContext();

export const CarDataProvider = ({ children }) => {
  const [carData, setCarData] = useState([
    {
      address: "",
      custContactNo: "",
      custName: "testing",
      dateTime: "2025-01-08T02:41",
      email: "",
      invoiceNo: "",
      paymentDetails: "",
      remarks: "",
      selectedServices: [],
      status: "D",
      AssignedMechanicID: [],
    },
  ]);

  const [userRole, setUserRole] = useState(null);

  const logout = () => {
    setUserRole(null); 
    localStorage.removeItem("token"); 
  };

  return (
    <CarDataContext.Provider value={{ carData, setCarData, userRole, setUserRole, logout }}>
      {children}
    </CarDataContext.Provider>
  );
};
