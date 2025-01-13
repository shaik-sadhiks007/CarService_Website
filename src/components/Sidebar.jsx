import React, { useContext} from "react";
import { Link, useLocation } from "react-router-dom";
import { CarDataContext } from "./CarDataContext";

function Sidebar() {
  const location = useLocation();

  const {showOffcanvas, setShowOffcanvas,userRole} = useContext(CarDataContext);
  
  const menuItems = [
    { path: "/dashboard", iconClass: "bi bi-grid-1x2-fill", label: "Car Service Entry" },
    { path: "/pending", iconClass: "bi bi-hourglass-split", label: "Pending" },
    { path: "/completed", iconClass: "bi bi-check-circle-fill", label: "Completed" },
    { path: "/accepted", iconClass: "bi bi-gear-fill", label: "Accepted" },
  ];

  const toggleOffcanvas = () => {
    setShowOffcanvas(!showOffcanvas);
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
          <h5 className="offcanvas-title text-white">Menu</h5>
          <button
            type="button"
            className="btn-close btn-close-white text-reset"
            onClick={toggleOffcanvas}
          ></button>
        </div>
        <div className="offcanvas-body p-3">
          <div className="profile mb-4 d-flex align-items-center">
            <img
              src="https://via.placeholder.com/40"
              alt="profile"
              className="rounded-circle me-2"
            />
            <span className="text-white fs-5 mb-0 text-capitalize">Hi {userRole.username}</span>
          </div>

          <ul className="nav nav-pills flex-column mb-auto">
            {menuItems.map((item) => {
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
                    <i className={`${item.iconClass} me-2`}></i>
                    <span className="fw-semibold">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Regular Sidebar for Desktop */}
      <div className="d-none d-md-block"  style={{ overflow: "hidden" }}>
        <div className="profile mb-4 d-flex align-items-center">
          <img
            src="https://via.placeholder.com/40"
            alt="profile"
            className="rounded-circle me-2"
          />
          <span className="text-white fs-4 mb-0 text-capitalize">Hi {userRole.username}</span>
        </div>

        <ul className="nav nav-pills flex-column mb-auto" style={{ overflowY: "hidden"}}>
          {menuItems.map((item) => {
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
                  <i className={`${item.iconClass} me-2`}></i>
                  <span className="fw-semibold">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}

export default Sidebar;
