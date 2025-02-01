import axios from "axios";
import { jwtDecode } from "jwt-decode";
import React, { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import pending from "../json/pending.json";
import accepted from "../json/accepted.json";

export const CarDataContext = createContext();

export const CarDataProvider = ({ children }) => {
  const [carData, setCarData] = useState([]);

  // const [carData, setCarData] = useState(pending);
  // const [carData, setCarData] = useState(accepted);

  const calculateItemsPerPage = () => {
    const screenHeight = window.innerHeight;
    const screenWidth = window.innerWidth;

    if (screenWidth > 1200 && screenHeight > 900) {
      return 12;
    }
    if (screenWidth > 900 && screenHeight > 600) {
      return 10;
    }
    if (screenWidth > 600 && screenHeight > 400) {
      return 8;
    }

    return 5;
  };

  const apiUrl = import.meta.env.VITE_API_URL;

  const [userRole, setUserRole] = useState({});

  const [mechanics, setMechanics] = useState([]);

  const [showOffcanvas, setShowOffcanvas] = useState(false);

  const [services, setServices] = useState([]);

  const [dashboard, setDashboard] = useState({
    pending: 0,
    completed: 0,
    underProcess: 0
  })

  const fetchMechanics = async () => {
    const token = localStorage.getItem("token");

    try {
      const url = `${apiUrl}/api/v1/carService/getAllUserInfo`;

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const mech = response.data.filter((user) => user.userRole === "user");
      setMechanics(mech);
    } catch (error) {
      console.error("Error fetching mechanics:", error);
    }
  };

  const initializeUser = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      if (decodedToken.exp * 1000 < Date.now()) {
        logout();
        return;
      }
      const response = await axios.get(
        `${apiUrl}/api/v1/carService/getUserInfo`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { username: decodedToken.sub },
        }
      );


      setUserRole(response.data);
    } catch (err) {
      console.error("Error fetching user info:", err);
      toast.error("Error fetching user info");
      // logout();
    }
  };

  useEffect(() => {
    initializeUser();
    fetchMechanics();
  }, []);

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
        fetchMechanics,
        calculateItemsPerPage,
        setServices,
        services,
        dashboard,
        setDashboard
      }}
    >
      {children}
    </CarDataContext.Provider>
  );
};
