import axios from "axios";
import { jwtDecode } from "jwt-decode";
import React, { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

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

  const [mechanics, setMechanics] = useState([]);

  const [showOffcanvas, setShowOffcanvas] = useState(false);

  const initializeUser = async () => {
    const token = localStorage.getItem("token");
    console.log(token, "token");

    if (!token) {
      console.log("there is no token");
      return;
    }

    try {
      const decodedToken = jwtDecode(token);

      console.log("1");
      if (decodedToken.exp * 1000 < Date.now()) {
        logout();
        return;
      }

      console.log("2");
      const response = await axios.get(
        `${apiUrl}/api/v1/carService/getUserInfo`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { username: decodedToken.sub },
        }
      );

      console.log("3");

      console.log(response.data,"data")

      setUserRole(response.data);
      
    } catch (err) {
      console.error("Error fetching user info:", err);
      toast.error("Error fetching user info")
      // logout();
    }
  };

  useEffect(() => {
    initializeUser();
  }, []);

  console.log(userRole, "user");
  console.log(mechanics, "mic");

  const logout = () => {
    setUserRole({});
    setMechanics([]);
    localStorage.removeItem("token");
  };

  return (
    <CarDataContext.Provider
      value={{
        carData,
        setCarData,
        userRole,
        setUserRole,
        logout,
        apiUrl,
        mechanics,
        setMechanics,
        showOffcanvas,
        setShowOffcanvas,
        initializeUser,
      }}
    >
      {children}
    </CarDataContext.Provider>
  );
};
