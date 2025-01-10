import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { CarDataContext } from "./CarDataContext";
import "./style.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { setUserRole,logout } = useContext(CarDataContext);

  // Function to check if token is expired
  const isTokenExpired = (token) => {
    try {
      const decoded = jwtDecode(token);
      console.log(decoded,'de')
      const currentTime = Date.now() / 1000;
      return decoded.exp < currentTime;
    } catch (err) {
      return true;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || isTokenExpired(token)) {
      logout(); 
    } else {
      navigate('/dashboard');
    }
  }, [navigate]);
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8080/CarServiceMaintenance/api/auth/login",
        {
          username,
          password,
        }
      );

      if (response.data && response.data.jwt) {
        localStorage.setItem("token", response.data.jwt);
        setUserRole(response.data.userRole);
        navigate("/dashboard");
      }
    } catch (err) {
      setError("Invalid credentials or server error.");
    }
  };

  return (
    <div className="container-fluid login-container d-flex align-items-center justify-content-center">
      <form className="form-box" onSubmit={handleSubmit}>
        <h3 className="text-center mb-4">Login</h3>
        {error && <div className="alert alert-danger">{error}</div>}
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
