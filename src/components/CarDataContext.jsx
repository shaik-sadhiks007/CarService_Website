import axios from "axios";
import { jwtDecode } from "jwt-decode";
import React, { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";


export const CarDataContext = createContext();

export const CarDataProvider = ({ children }) => {
  const [carData, setCarData] = useState([]);

  const apiUrl = import.meta.env.VITE_API_URL;

  const [userRole, setUserRole] = useState({});

  const [mechanics, setMechanics] = useState([]);

  const [showOffcanvas, setShowOffcanvas] = useState(false);

  const [services, setServices] = useState([]);

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
      logout();
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
        setServices,
        services,
      }}
    >
      {children}
    </CarDataContext.Provider>
  );
};
