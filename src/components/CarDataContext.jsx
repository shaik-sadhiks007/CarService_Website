import axios from "axios";
import { jwtDecode } from "jwt-decode";
import React, { createContext, useEffect, useState } from "react";

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


  const apiUrl = import.meta.env.VITE_API_URL;


  const [userRole, setUserRole] = useState(null);

  const [mechanics,setMechanics] = useState(null);

  useEffect(() => {
    const initializeUser = async () => {
      console.log("initialize")
      const token = localStorage.getItem("token");
    
      try {
        console.log("2")

        const decodedToken = jwtDecode(token);
        if (decodedToken.exp * 1000 < Date.now()) {
          logout();
          return;
        }
  
        const response = await axios.get(`${apiUrl}/api/v1/carService/getUserInfo`, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        console.log("yes")
  
        const user = response.data.find((user) => user.username === decodedToken.sub);
        const mechanicsData = response.data.filter((user) => user.userRole === "user");
  
        if (user) {
          setUserRole(user);
          setMechanics(mechanicsData);
        } else {
          logout();
        }
      } catch (err) {
        console.log('3')
        console.error("Error fetching user info:", err);
        logout();
      }
    };

    initializeUser();

  }, []);

  console.log(userRole,'user')
  console.log(mechanics,'mic')

  const logout = () => {
    setUserRole(null);
    setMechanics(null);
    localStorage.removeItem("token"); 
  };

  return (
    <CarDataContext.Provider value={{ carData, setCarData, userRole, setUserRole, logout, apiUrl, mechanics, setMechanics }}>
      {children}
    </CarDataContext.Provider>
  );
};
