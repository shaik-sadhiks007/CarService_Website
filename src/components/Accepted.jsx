import React from "react";
import Sidebar from "./Sidebar";

function Accepted({ carData, setCarData }) {
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
          <Sidebar />
        </div>
        <div className="col-10">
          <div className="container-fluid">
            <h1 className="text-white">Accepted</h1>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Accepted;
