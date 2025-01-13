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


  const [userRole, setUserRole] = useState({});

  const [mechanics,setMechanics] = useState([]);

  const [showOffcanvas, setShowOffcanvas] = useState(false);
  
  const initializeUser = async () => {
    const token = localStorage.getItem("token");

    if(!token){
      return;
    }
  
    try {

      const decodedToken = jwtDecode(token);
      if (decodedToken.exp * 1000 < Date.now()) {
        logout();
        return;
      }

      const response = await axios.get(`${apiUrl}/api/v1/carService/getUserInfo`, {
        headers: { Authorization: `Bearer ${token}` },
      });


      const user = response.data.find((user) => user.username === decodedToken.sub);
      const mechanicsData = response.data.filter((user) => user.userRole === "user");

      if (user) {
        setUserRole(user);
        setMechanics(mechanicsData);
      } else {
        logout();
      }
    } catch (err) {
      console.error("Error fetching user info:", err);
      logout();
    }
  };

  useEffect(() => {

    initializeUser();


  }, []);

  console.log(userRole,'user')
  console.log(mechanics,'mic')

  const logout = () => {
    setUserRole({});
    setMechanics([]);
    localStorage.removeItem("token"); 
  };

  return (
    <CarDataContext.Provider value={{ carData, setCarData, userRole, setUserRole, logout, apiUrl, mechanics, setMechanics ,showOffcanvas, setShowOffcanvas }}>
      {children}
    </CarDataContext.Provider>
  );
};
