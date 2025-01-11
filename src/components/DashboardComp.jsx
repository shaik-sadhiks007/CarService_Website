import React, { useContext, useState } from "react";
import axios from "axios";
import "./new.css";
import Logout from "./Logout";
import { CarDataContext } from "./CarDataContext";

function DashboardComp() {
  const [carPlate, setCarPlate] = useState("");
  const [matchedData, setMatchedData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedData, setEditedData] = useState({
    custInformation: {},
    carServiceInfromation: {},
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");
  const { apiUrl } = useContext(CarDataContext);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    setMatchedData(null);

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

      if (response.data) {
        const data = {
          ...response.data,
          custInformation: response.data.custInformation || {}, 
          carServiceInfromation: response.data.carServiceInfromation || {},
        };
        setMatchedData(data);
        setEditedData(data);
      } else {
        setError("No data found for the provided registration number.");
      }
    } catch (err) {
      setError("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleSave = () => {
    setEditMode(false);
    setMatchedData(editedData);
  };

  const handleChange = (section, key, value) => {
    setEditedData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  };


  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-3 mt-2">
        <h1 className="text-white">Car Service Entry</h1>
        <Logout />
      </div>

      <div
        className="text-white w-100 p-4 rounded-2"
        style={{ backgroundColor: "#212632" }}
      >
        <div className="mb-4">
          <p>Car registration number</p>
        </div>

        <div className="col-6">
          <div className="d-flex justify-content-between">
            <input
              type="text"
              className="form-control input-dashboard text-white placeholder-white"
              placeholder="Enter Car registration number"
              value={carPlate}
              onChange={(e) => setCarPlate(e.target.value)}
            />
            <button
              className="btn btn-warning py-2 ms-3 text-white"
              onClick={handleSearch}
              disabled={loading}
            >
              {loading ? "Loading..." : "Search"}
            </button>
          </div>
          {error && <p className="text-danger mt-3">{error}</p>}
        </div>

        {matchedData && (
          <div className="row mt-4">
            {/* Customer Information Table */}
            <div className="col-md-6">
              <h4>Customer Information</h4>
              <table className="table table-bordered">
                <tbody>
                  {Object.entries(matchedData.custInformation || {}).map(
                    ([key, value]) => (
                      <tr key={key}>
                        <th>{key}</th>
                        <td>
                          {editMode ? (
                            <input
                              type="text"
                              value={editedData.custInformation[key] || ""}
                              onChange={(e) =>
                                handleChange(
                                  "custInformation",
                                  key,
                                  e.target.value
                                )
                              }
                            />
                          ) : (
                            value || "N/A"
                          )}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>

            {/* Car Service Information Table */}
            <div className="col-md-6">
              <h4>Car Service Information</h4>
              <table className="table table-bordered">
                <tbody>
                  {Object.entries(matchedData.carServiceInfromation || {}).map(
                    ([key, value]) => (
                      <tr key={key}>
                        <th>{key}</th>
                        <td>
                          {editMode ? (
                            <input
                              type="text"
                              value={
                                editedData.carServiceInfromation[key] || ""
                              }
                              onChange={(e) =>
                                handleChange(
                                  "carServiceInfromation",
                                  key,
                                  e.target.value
                                )
                              }
                            />
                          ) : (
                            value || "N/A"
                          )}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-3">
              {editMode ? (
                <button className="btn btn-success me-2" onClick={handleSave}>
                  Save
                </button>
              ) : (
                <button className="btn btn-primary" onClick={handleEdit}>
                  Edit
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardComp;
