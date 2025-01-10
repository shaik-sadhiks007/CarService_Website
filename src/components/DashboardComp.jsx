import React, { useState } from "react";
import "./new.css";
import Logout from "./Logout";

function DashboardComp() {
  const sampleData = {
    custInformation: {
      vehicleRegNo: "SLW3355K",
      custName: "John Paul",
      custContactNo: "98456345",
      email: "john.paul@mail.com",
      address: "BLK-135,#05-254, Tampines Street 12, Singapore - 521135",
      vehicleModel: "BMW-X3",
      manufactureYear: "2020",
      vehicleColor: "Silver",
      engineNo: "ALK56533HJE",
      chasisNo: "TUBBEF65733MGF56YK",
    },
    carServiceInfromation: {
      vehicleRegNo: "SLW3355K",
      dateIn: "2025-01-01T13:39:50.000+08:00",
      entryType: "Customer Dropped",
      mileage: "01034224",
      fuelLevel: "0.25 Tank",
      fuelLevelImage: "image",
      remarks: "Service completed.",
      status: "D",
      technitionName: "Joshua How",
      managerName: null,
    },
  };

  const [carPlate, setCarPlate] = useState("");
  const [matchedData, setMatchedData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedData, setEditedData] = useState({});

  const handleSearch = () => {
    if (carPlate.toLowerCase() === sampleData.custInformation.vehicleRegNo.toLowerCase()) {
      setMatchedData(sampleData);
      setEditedData(sampleData);
    } else {
      setMatchedData(null);
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
            >
              Search
            </button>
          </div>
        </div>

        {matchedData && (
          <div className="row mt-4">
            {/* Customer Information Table */}
            <div className="col-md-6">
              <h4>Customer Information</h4>
              <table className="table table-bordered">
                <tbody>
                  {Object.entries(matchedData.custInformation).map(([key, value]) => (
                    <tr key={key}>
                      <th>{key}</th>
                      <td>
                        {editMode ? (
                          <input
                            type="text"
                            value={editedData.custInformation[key] || ""}
                            onChange={(e) => handleChange("custInformation", key, e.target.value)}
                          />
                        ) : (
                          value || "N/A"
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Car Service Information Table */}
            <div className="col-md-6">
              <h4>Car Service Information</h4>
              <table className="table table-bordered">
                <tbody>
                  {Object.entries(matchedData.carServiceInfromation).map(([key, value]) => (
                    <tr key={key}>
                      <th>{key}</th>
                      <td>
                        {editMode ? (
                          <input
                            type="text"
                            value={editedData.carServiceInfromation[key] || ""}
                            onChange={(e) => handleChange("carServiceInfromation", key, e.target.value)}
                          />
                        ) : (
                          value || "N/A"
                        )}
                      </td>
                    </tr>
                  ))}
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
