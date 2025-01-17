import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { CarDataContext } from "./CarDataContext";
import "./style.css";
import { toast } from "react-toastify";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const { userRole, logout, apiUrl, initializeUser } =
    useContext(CarDataContext);

  const isTokenExpired = (token) => {
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp < currentTime;
    } catch (err) {
      return true;
    }
  };

  useEffect(() => {
    const handleInitialization = async () => {
      const token = localStorage.getItem("token");
      if (!token || isTokenExpired(token)) {
        logout();
        navigate("/");
      } else {
        try {
          await initializeUser();
          console.log("loginedddddd");
          toast.success("Login successful!");
          navigate("/dashboard");
        } catch (error) {
          console.error("Error initializing user:", error);
          toast.error("Failed to initialize user. Please try again.");
          logout();
          navigate("/");
        }
      }
    };

    handleInitialization();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${apiUrl}/api/auth/login`, {
        username,
        password,
      });

      if (response.data && response.data.jwt) {
        const token = response.data.jwt;
        localStorage.setItem("token", token);
        await initializeUser();
        console.log("dfadfasfasdf");
        toast.success("Login successful!");
        navigate("/dashboard");
      }
    } catch (err) {
      toast.error("Invalid credentials or server error");
    }
  };

  return (
    <div className="container-fluid login-container d-flex align-items-center justify-content-center">
      <form className="form-box" onSubmit={handleSubmit}>
        <h3 className="text-center mb-4">Login</h3>
        <div className="mb-3">
          <input
            type="text"
            name="username"
            className="form-control input-box rounded-pill px-3 py-2 fs-5"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <input
            type="password"
            name="password"
            className="form-control input-box rounded-pill px-3 py-2 fs-5"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="btn btn-warning w-100 rounded-pill px-3 py-2 fs-5 text-white"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
