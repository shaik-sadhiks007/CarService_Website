import React, { useContext, useState } from 'react';
import axios from 'axios';
import './style.css';
import Sidebar from "./Sidebar";
import { CarDataContext } from './CarDataContext';
import { toast } from "react-toastify";
import Logout from './Logout';
import { useTranslation } from 'react-i18next';

const Signup = () => {
  const { showOffcanvas, setShowOffcanvas, apiUrl } = useContext(CarDataContext);

  const { t } = useTranslation()
  // State to manage form fields
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userRole, setUserRole] = useState('user');

  // Token for Authorization header (use your actual token)
  const token = localStorage.getItem("token");

  // Form validation and API call
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!username || !password || !userRole) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const response = await axios.post(
        `https://carservice.rasiminnalai.com/CarServiceMaintenance/api/register/new-user`,
        {
          username,
          password,
          userRole, // Include userRole in the request body
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add the token here
          },
        }
      );

      setPassword("");
      setUsername("");

      toast.success("User registered successfully");
    } catch (err) {
      toast.error('Registration failed. Please try again.');
      console.error('Error registering user:', err);
    }
  };

  const toggleOffcanvas = () => {
    setShowOffcanvas(!showOffcanvas);
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div
          className={`col-2 col-md-3 col-lg-2 p-3 ${showOffcanvas ? "d-block" : "d-none d-md-block"
            }`}
          style={{
            height: "auto",
            minHeight: "100vh",
            backgroundColor: "#212632",
          }}
        >
          <Sidebar />
        </div>

        <div className="col-12 col-md-9 col-lg-10 p-3">
          <div className="container-fluid">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="d-flex">
                <div
                  className="d-md-none me-2"
                  onClick={toggleOffcanvas}
                  style={{ cursor: "pointer" }}
                >
                  <i className="bi bi-list text-light fs-2"></i>
                </div>
                <h1 className="text-white">{t("menus.userRegistration")}</h1>
              </div>
              <Logout />
            </div>

            <div className="text-white w-50 p-4 rounded-2"
              style={{ backgroundColor: "#212632" }}
            >
              <form className="" onSubmit={handleSubmit}>
                <h3 className="text-center mb-4">{t("signup.signup")}</h3>

                {/* Username input with label */}
                <div className="mb-3">
                  <label htmlFor="username" className="form-label text-white">{t("signup.username")}</label>
                  <input
                    type="text"
                    className="form-control input-dashboard text-white placeholder-white"
                    id="username"
                    placeholder={t("signup.username")}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>

                {/* Password input with label */}
                <div className="mb-3">
                  <label htmlFor="password" className="form-label text-white">{t("signup.password")}</label>
                  <input
                    type="password"
                    className="form-control input-dashboard text-white placeholder-white"
                    id="password"
                    placeholder={t("signup.password")}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                {/* User Role input with label */}
                <div className="mb-3">
                  <label htmlFor="userRole" className="form-label text-white">{t("signup.userRole")}</label>
                  <select
                    className="form-control input-dashboard text-white placeholder-white"
                    id="userRole"
                    value={userRole}
                    onChange={(e) => setUserRole(e.target.value)}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <button type="submit" className="btn btn-outline-warning text-white py-2">
                  {t("signup.submit")}
                </button>
              </form>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
