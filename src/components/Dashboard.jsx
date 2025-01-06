import React from "react";
import Sidebar from "./Sidebar";
import DashboardComp from "./DashboardComp";

function Dashboard() {
  return (
    <div className="container-fluid">
      <div className="row">
        <div
          className="col-2 p-3"
          style={{
            height: "auto",
            minHeight: "100vh",
            backgroundColor: "#212632",
          }}
        
        >
          {/* Sidebar component */}
          <Sidebar />

        </div>
        <div className="col-10">

          {/* Main content */}
          <DashboardComp />
          
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
