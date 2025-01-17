import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CarDataContext } from "./CarDataContext";

function Logout() {
  const navigate = useNavigate();

  const { logout } = useContext(CarDataContext);

  const handleLogout = () => {
    navigate("/");
    logout();
  };

  return (
    <>
      <button
        className="btn btn-outline-warning text-white"
        onClick={() => handleLogout()}
      >
        <span className="fw-semibold">Logout</span>
      </button>
    </>
  );
}

export default Logout;
