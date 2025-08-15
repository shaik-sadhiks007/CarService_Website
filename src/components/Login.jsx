import React, { useEffect, useState, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { CarDataContext } from "./CarDataContext";
import "./style.css";
import { toast } from "react-toastify";
import VirtualKeyboard from "./VirtualKeyboard";
import { FaKeyboard } from "react-icons/fa";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const { userRole, logout, apiUrl, initializeUser, initializeUser2 } =
    useContext(CarDataContext);

  const [showKeyboard, setShowKeyboard] = useState(false);
  const [activeInput, setActiveInput] = useState(null); // "username" or "password"

  console.log(activeInput, "activeInput")

  const formRef = useRef();

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

          const userData = await initializeUser2();

          if (!userData) {
            logout();
            navigate("/");
            return;
          }


          toast.success("Login successful!");
          console.log(userData.userRole, "login user useEffect")
          if (userData.userRole === "super_admin") {
            // navigate("/dashboard");
            navigate("/car-service-entry")


          } else if (userData.userRole == "mechanic") {

            navigate("/car-service-entry")

          } else if (userData.userRole == "account_admin") {

            navigate("/payment-pending")

          } else {
            navigate('/guest')
          }
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
        const userData = await initializeUser2();

        if (!userData) {
          logout();
          navigate("/");
          return;
        }

        toast.success("Login successful!");
        if (userData.userRole === "super_admin") {

          // navigate("/dashboard");
          navigate("/car-service-entry")


        } else if (userData.userRole == "mechanic") {

          navigate("/car-service-entry")

        } else if (userData.userRole == "account_admin") {

          navigate("/payment-pending")

        }
        else {
          navigate('/guest')
        }
        console.log(userData.userRole, "login user submit")

      }
    } catch (err) {
      toast.error("Invalid credentials or server error");
    }
  };

  const handleKeyboardInput = (input) => {
    if (activeInput === "username") setUsername(input);
    if (activeInput === "password") setPassword(input);
  };

  const openKeyboard = (inputName) => {
    setActiveInput(inputName);
    setShowKeyboard(true);
  };

  const closeKeyboard = () => {
    setShowKeyboard(false);
    setActiveInput(null);
  };

  const handleEnter = () => {
    if (formRef.current) {
      formRef.current.requestSubmit();
    }
  };

  return (
    <div className="container-fluid login-container d-flex align-items-center justify-content-center">
      <form className="form-box" onSubmit={handleSubmit} ref={formRef} style={{ position: 'relative' }}>
        <div onClick={() => setShowKeyboard(!showKeyboard)} style={{ position: 'absolute', top: 15, right: 25, cursor: 'pointer' }}>
          <FaKeyboard size={24} />
        </div>
        <h3 className="text-center mb-4">Login</h3>
        <div className="mb-3" style={{ position: "relative" }}>
          <input
            type="text"
            name="username"
            className="form-control input-box rounded-pill px-3 py-2 fs-5"
            placeholder="Username"
            value={username}
            onFocus={() => setActiveInput("username")}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
        </div>
        <div className="mb-3" style={{ position: "relative" }}>
          <input
            type="password"
            name="password"
            className="form-control input-box rounded-pill px-3 py-2 fs-5"
            placeholder="Password"
            value={password}
            onFocus={() => setActiveInput("password")}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </div>
        <button
          type="submit"
          className="btn btn-warning w-100 rounded-pill px-3 py-2 fs-5 text-white"
        >
          Login
        </button>
      </form>
      {showKeyboard && activeInput && (
        <VirtualKeyboard
          key={activeInput}
          input={activeInput === "username" ? username : password}
          onChange={handleKeyboardInput}
          onClose={closeKeyboard}
          onEnter={handleEnter}
        />
      )}
    </div>
  );
};

export default Login;
