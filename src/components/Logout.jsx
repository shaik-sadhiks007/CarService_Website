import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CarDataContext } from "./CarDataContext";
import { useTranslation } from "react-i18next";

function Logout() {

  const navigate = useNavigate();

  const { t } = useTranslation();

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
        <span className="fw-semibold">{t('logout')}</span>
      </button>
    </>
  );
}

export default Logout;
