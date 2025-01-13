import React, { useContext } from "react";
import Sidebar from "./Sidebar";
import DashboardComp from "./DashboardComp";
import { CarDataContext } from "./CarDataContext";

function Dashboard() {
  const { apiUrl, showOffcanvas, setShowOffcanvas,userRole } =
    useContext(CarDataContext);

  return (
    <div className="container-fluid">
      <div className="row">
        <div
          className={`col-2 col-md-3 col-lg-2 p-3 ${
            showOffcanvas ? "d-block" : "d-none d-md-block"
          }`}
          style={{
            height: "auto",
            minHeight: "100vh",
            backgroundColor: "#212632",
          }}
        >
          {/* Sidebar component */}
          <Sidebar />
        </div>
        <div className="col-12 col-md-9 col-lg-10 p-3">
          {/* Main content */}
          <DashboardComp
            apiUrl={apiUrl}
            setShowOffcanvas={setShowOffcanvas}
            showOffcanvas={showOffcanvas}
            userRole = {userRole}
          />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
