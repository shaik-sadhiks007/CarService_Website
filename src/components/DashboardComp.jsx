import React, { useState } from "react";
import axios from "axios";
import "./new.css";
import Logout from "./Logout";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CarRegistration from "./CarRegistration";

function DashboardComp({ apiUrl, showOffcanvas, setShowOffcanvas, userRole }) {

  const [carPlate, setCarPlate] = useState("");
 
  const [found , setFound] = useState(false);

  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const toggleOffcanvas = () => {
    setShowOffcanvas(!showOffcanvas);
  };

  const handleSearch = async () => {
    if (!carPlate.trim()) {
      toast.error("Car registration number cannot be empty.");
      return;
    }
    setLoading(true);

    try {
      const response = await axios.get(
        `${apiUrl}/api/v1/carService/getCustomerDetails`,
        {
          params: { vehicleRegNo: carPlate },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data !== "No Customer Information Found") {
        toast.success("Customer information found!");
      } else {
        toast.error("No data found for the provided registration number.");
      }
    } catch (err) {
      toast.error("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
  };




  return (
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
          <h1 className="text-white">Car Service Entry</h1>
        </div>
        <Logout />
      </div>

      <div
        className="text-white w-100 p-4 rounded-2"
        style={{ backgroundColor: "#212632" }}
      >
        <div className="mb-4">
          <label htmlFor="carPlate" className="form-label">
            Car Registration Number
          </label>
          <div className="col-12 col-md-9 col-lg-6 d-flex">
            <input
              id="carPlate"
              type="text"
              className="form-control input-dashboard text-white placeholder-white"
              placeholder="Enter Car registration number"
              value={carPlate}
              onChange={(e) => setCarPlate(e.target.value)}
            />
            <button
              className="btn btn-outline-warning text-white py-2 ms-3"
              onClick={handleSearch}
              disabled={loading}
            >
              Search
            </button>
          </div>
        </div>
      </div>

      <CarRegistration carPlate = {carPlate} setFound={setFound} />
    </div>
  );
}

export default DashboardComp;
