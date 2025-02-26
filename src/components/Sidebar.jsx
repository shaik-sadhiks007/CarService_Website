import React, { useContext, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { CarDataContext } from "./CarDataContext";
import { useTranslation } from 'react-i18next';
import DataDownload from "../adminComponents/DataDownload";
import LanguageSwitcher from "../settings/LanguageSwitcher";

function Sidebar() {
  const location = useLocation();
  const { showOffcanvas, setShowOffcanvas, userRole } =
    useContext(CarDataContext);
  const { t, i18n } = useTranslation();



  const menuItems = [
    {
      path: "/car-service-entry",
      iconclassName: "bi bi-car-front",
      label: t("menu.carServiceEntry"),
    },
    { path: "/pending", iconclassName: "bi bi-hourglass-split", label: t("menu.pending") },
    { path: "/accepted", iconclassName: "bi bi-gear-fill", label: t("menu.accepted") },
    {
      path: "/completed",
      iconclassName: "bi bi-check-circle-fill",
      label: t("menu.completed"),
    },
    {
      path: "/ready-to-deliver",
      iconclassName: "bi bi-check-circle-fill",
      label: t("account_admin.readyToDeliver"),
    },
  ];

  const adminItems = [
    { path: "/register", iconclassName: "bi bi-person-plus-fill", label: t("admin.register") },
    // { path: "/services", iconclassName: "bi bi-tools", label: t("admin.addServices") },
  ];

  const accountantItems = [
    { path: "/payment-pending", iconclassName: "bi bi-person-plus-fill", label: t("account_admin.paymentPending") },
    {
      path: "/ready-to-deliver",
      iconclassName: "bi bi-check-circle-fill",
      label: t("account_admin.readyToDeliver"),
    },
  ];

  const guestItems = [
    { path: "/guest", iconclassName: "bi bi-person-plus-fill", label: t("guest.guest") },
  ];



  const toggleOffcanvas = () => {

    setShowOffcanvas(!showOffcanvas);
  };

  const switchLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };



  return (
    <>
      {/* Button to toggle offcanvas */}
      <button
        className="btn btn-primary d-md-none mb-3"
        type="button"
        onClick={toggleOffcanvas}
      >
        <i className="bi bi-list"></i>
      </button>

      {/* Offcanvas Sidebar */}
      <div
        className={`offcanvas offcanvas-start ${showOffcanvas ? "show" : ""}`}
        style={{
          visibility: showOffcanvas ? "visible" : "hidden",
          backgroundColor: "#2E3543",
          color: "#fff",
        }}
        tabIndex="-1"
        onClick={toggleOffcanvas}
      >
        <div className="offcanvas-header">

          <div onClick={(e) => e.stopPropagation()}>
            <LanguageSwitcher switchLanguage={switchLanguage} />
          </div>
          <button
            type="button"
            className="btn-close btn-close-white text-reset"
            onClick={toggleOffcanvas}
          ></button>
        </div>
        <div className="offcanvas-body p-3">
          <div className="profile mb-4 d-flex align-items-center">
            <img
              src="./assets/man.png"
              alt="profile"
              className="rounded-circle me-2"
              width="40px"
              height="40px"
            />
            <span className="text-white fs-5 mb-0 text-capitalize">
              {t('greeting', { username: userRole.username })}
            </span>
          </div>

          <ul className="nav nav-pills flex-column mb-auto">
            {/* {userRole && userRole.userRole && userRole.userRole.toLowerCase() === 'super_admin' && (
              <li
                className={`nav-item my-2 rounded-2 ${location.pathname === '/dashboard' ? "active" : ""}`}
                style={{
                  backgroundColor: location.pathname === '/dashboard' ? "#FFC107" : "#2E3543",
                  color: location.pathname === '/dashboard' ? "#000" : "#fff",
                }}
              >

                <Link
                  to='/dashboard'
                  element={<DataDownload />}
                  className="nav-link d-flex align-items-center"
                  style={{ color: "inherit" }}>

                  <i className={"bi bi-grid-1x2-fill  me-2"}></i>
                  <span className="fw-semibold">
                    {t("menu.dashboard")}
                  </span>
                </Link>

              </li>
            )} */}

            {userRole && userRole.userRole && (userRole.userRole.toLowerCase() === 'mechanic' || userRole.userRole.toLowerCase() === 'super_admin') && menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li
                  key={item.path}
                  className={`nav-item my-2 rounded-2 ${isActive ? "active" : ""}`}
                  style={{
                    backgroundColor: isActive ? "#FFC107" : "#2E3543",
                    color: isActive ? "#000" : "#fff",
                  }}
                >
                  <Link
                    to={item.path}
                    className="nav-link d-flex align-items-center"
                    style={{ color: "inherit" }}
                    onClick={toggleOffcanvas}
                  >
                    <i className={`${item.iconclassName} me-2`}></i>
                    <span className="fw-semibold">{item.label}</span>
                  </Link>
                </li>
              );
            })}

            {userRole && userRole.userRole && userRole.userRole.toLowerCase() === 'super_admin' && (
              <div>
                <hr className="text-white" />

                <li className="fw-semibold mb-2" style={{ color: "white" }}>
                  {t("menus.administrator")}
                </li>

                <ul className="nav flex-column">
                  {adminItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                      <li
                        key={item.path}
                        className={`nav-item my-2 rounded-2 ${isActive ? "active" : ""}`}
                        style={{
                          backgroundColor: isActive ? "#FFC107" : "#2E3543",
                          color: isActive ? "#000" : "#fff",
                        }}
                      >
                        <Link
                          to={item.path}
                          className="nav-link d-flex align-items-center"
                          style={{ color: "inherit" }}
                        >
                          <i className={`${item.iconclassName} me-2`}></i>
                          <span className="fw-semibold">{item.label}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>

              </div>
            )}

            {userRole && userRole.userRole && userRole.userRole.toLowerCase() === 'account_admin' && (
              <div>

                <ul className="nav flex-column">
                  {accountantItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                      <li
                        key={item.path}
                        className={`nav-item my-2 rounded-2 ${isActive ? "active" : ""}`}
                        style={{
                          backgroundColor: isActive ? "#FFC107" : "#2E3543",
                          color: isActive ? "#000" : "#fff",
                        }}
                      >
                        <Link
                          to={item.path}
                          className="nav-link d-flex align-items-center"
                          style={{ color: "inherit" }}
                        >
                          <i className={`${item.iconclassName} me-2`}></i>
                          <span className="fw-semibold">{item.label}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>

              </div>
            )}

            {userRole && userRole.userRole && userRole.userRole.toLowerCase() === 'guest' && (
              <div>

                <ul className="nav flex-column">
                  {guestItems.map((item) => {
                    const isActive = true;
                    return (
                      <li
                        key={item.path}
                        className={`nav-item my-2 rounded-2 ${isActive ? "active" : ""}`}
                        style={{
                          backgroundColor: isActive ? "#FFC107" : "#2E3543",
                          color: isActive ? "#000" : "#fff",
                        }}
                      >
                        <Link
                          to={item.path}
                          className="nav-link d-flex align-items-center"
                          style={{ color: "inherit" }}
                        >
                          <i className={`${item.iconclassName} me-2`}></i>
                          <span className="fw-semibold">{item.label}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>

              </div>
            )}
          </ul>
        </div>
      </div>


      {/* Regular Sidebar for Desktop */}
      <div className="d-none d-md-block" style={{ overflow: "hidden" }}>
        <div className="mb-3">
          <LanguageSwitcher switchLanguage={switchLanguage} />
        </div>
        <div className="profile mb-4 d-flex align-items-center">
          <img
            src="./assets/man.png"
            alt="profile"
            className="rounded-circle me-2"
            width="40px"
            height="40px"
          />
          <span className="text-white fs-4 mb-0 text-capitalize">
            {t('greeting', { username: userRole.username })}
          </span>
        </div>

        <ul className="nav nav-pills flex-column mb-auto" style={{ overflowY: "hidden" }}>
          {/* {userRole && userRole.userRole && userRole.userRole.toLowerCase() === 'super_admin' && (
            <li
              className={`nav-item my-2 rounded-2 ${location.pathname === '/dashboard' ? "active" : ""}`}
              style={{
                backgroundColor: location.pathname === '/dashboard' ? "#FFC107" : "#2E3543",
                color: location.pathname === '/dashboard' ? "#000" : "#fff",
              }}
            >

              <Link
                to='/dashboard'
                element={<DataDownload />}
                className="nav-link d-flex align-items-center"
                style={{ color: "inherit" }}>

                <i className={"bi bi-grid-1x2-fill  me-2"}></i>
                <span className="fw-semibold">
                  {t("menu.dashboard")}
                </span>
              </Link>

            </li>
          )} */}

          {userRole && userRole.userRole && (userRole.userRole.toLowerCase() === 'mechanic' || userRole.userRole.toLowerCase() === 'super_admin') && menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li
                key={item.path}
                className={`nav-item my-2 rounded-2 ${isActive ? "active" : ""}`}
                style={{
                  backgroundColor: isActive ? "#FFC107" : "#2E3543",
                  color: isActive ? "#000" : "#fff",
                }}
              >
                <Link
                  to={item.path}
                  className="nav-link d-flex align-items-center"
                  style={{ color: "inherit" }}
                >
                  <i className={`${item.iconclassName} me-2`}></i>
                  <span className="fw-semibold">{item.label}</span>
                </Link>
              </li>
            );
          })}

          {/* Admin Menu */}
          {userRole && userRole.userRole && userRole.userRole.toLowerCase() === 'super_admin' && (

            <div>
              <hr className="text-white" />
              <li className="fw-semibold mb-2" style={{ color: "white" }}>
                {t("menus.administrator")}
              </li>
              <ul className="nav flex-column">
                {adminItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <li
                      key={item.path}
                      className={`nav-item my-2 rounded-2 ${isActive ? "active" : ""}`}
                      style={{
                        backgroundColor: isActive ? "#FFC107" : "#2E3543",
                        color: isActive ? "#000" : "#fff",
                      }}
                    >
                      <Link
                        to={item.path}
                        className="nav-link d-flex align-items-center"
                        style={{ color: "inherit" }}
                      >
                        <i className={`${item.iconclassName} me-2`}></i>
                        <span className="fw-semibold">{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>

            </div>

          )}

          {userRole && userRole.userRole && userRole.userRole.toLowerCase() === 'account_admin' && (

            <div>
              <ul className="nav flex-column">
                {accountantItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <li
                      key={item.path}
                      className={`nav-item my-2 rounded-2 ${isActive ? "active" : ""}`}
                      style={{
                        backgroundColor: isActive ? "#FFC107" : "#2E3543",
                        color: isActive ? "#000" : "#fff",
                      }}
                    >
                      <Link
                        to={item.path}
                        className="nav-link d-flex align-items-center"
                        style={{ color: "inherit" }}
                      >
                        <i className={`${item.iconclassName} me-2`}></i>
                        <span className="fw-semibold">{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>

            </div>

          )}

          {userRole && userRole.userRole && userRole.userRole.toLowerCase() === 'guest' && (

            <div>
              <ul className="nav flex-column">
                {guestItems.map((item) => {
                  const isActive = true;
                  return (
                    <li
                      key={item.path}
                      className={`nav-item my-2 rounded-2 ${isActive ? "active" : ""}`}
                      style={{
                        backgroundColor: isActive ? "#FFC107" : "#2E3543",
                        color: isActive ? "#000" : "#fff",
                      }}
                    >
                      <Link
                        to={item.path}
                        className="nav-link d-flex align-items-center"
                        style={{ color: "inherit" }}
                      >
                        <i className={`${item.iconclassName} me-2`}></i>
                        <span className="fw-semibold">{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>

            </div>

          )}
        </ul>
      </div>
    </>
  );
}

export default Sidebar;
