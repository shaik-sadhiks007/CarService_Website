import React, { useContext, useState } from "react";
import Sidebar from "./Sidebar";
import "./new.css";
import { CarDataContext } from "./CarDataContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import Logout from "./Logout";

function CarRegistration() {
  const { apiUrl, showOffcanvas, setShowOffcanvas } =
    useContext(CarDataContext);

  const toggleOffcanvas = () => {
    setShowOffcanvas(!showOffcanvas);
  };
  const [customerInfo, setCustomerInfo] = useState({
    vehicleRegNo: "",
    custName: "",
    custContactNo: "",
    email: "",
    address: "",
    vehicleModel: "",
    manufactureYear: "",
    vehicleColor: "",
    engineNo: "",
    chasisNo: "",
    createdBy: "Rajesh",
    createdDate: new Date().toISOString(),
  });

  const [carServiceInfo, setCarServiceInfo] = useState({
    vehicleRegNo: "",
    dateIn: new Date().toISOString(),
    entryType: "",
    mileage: "",
    fuelLevel: "",
    fuelLevelImage: null,
    carImage: null,
    remarks: "",
    status: "D",
    technitionName: "",
    managerName: null,
    createdBy: "Rajesh",
    createdDate: new Date().toISOString(),
    modifiedBy: null,
    modifiedDate: null,
  });

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("fuelLevelImage", carServiceInfo.fuelLevelImage);
      formData.append("carImage", carServiceInfo.carImage);
      formData.append(
        "data",
        JSON.stringify({
          custInformation: customerInfo,
          carServiceInfromation: carServiceInfo,
        })
      );

      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authorization token is missing.");
        return;
      }

      await axios.post(
        `${apiUrl}/api/v1/carService/saveServiceInformation`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Car Service Information saved successfully!");
    } catch (error) {
      toast.error("Failed to save Car Service Information.");
      console.error("Error saving data:", error);
    }
  };

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
          <Sidebar />
        </div>
        <div className="col-12 col-md-9 col-lg-10 p-3">
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
                <h1 className="text-white">Car Registration</h1>
              </div>
              <Logout />
            </div>
            <div
              className="text-white w-100 p-4 rounded-2"
              style={{ backgroundColor: "#212632" }}
            >
              {/* Customer Information */}
              <div className="mb-4">
                <h4>Customer Information</h4>
                {Object.keys(customerInfo).map(
                  (key) =>
                    key !== "createdBy" &&
                    key !== "createdDate" && (
                      <input
                        key={key}
                        type="text"
                        className="form-control mb-2 rounded-pill placeholder-white py-2"
                        placeholder={key}
                        value={customerInfo[key]}
                        onChange={(e) =>
                          setCustomerInfo({
                            ...customerInfo,
                            [key]: e.target.value,
                          })
                        }
                      />
                    )
                )}
              </div>

              {/* Car Service Information */}
              <div className="mb-4">
                <h4>Car Service Information</h4>
                {Object.keys(carServiceInfo).map((key) =>
                  ["fuelLevelImage", "carImage"].includes(key) ? (
                    <input
                      key={key}
                      type="file"
                      className="form-control mb-2 rounded-pill placeholder-white py-2"
                      onChange={(e) =>
                        setCarServiceInfo({
                          ...carServiceInfo,
                          [key]: e.target.files[0],
                        })
                      }
                    />
                  ) : key !== "createdBy" &&
                    key !== "createdDate" &&
                    key !== "modifiedBy" &&
                    key !== "modifiedDate" ? (
                    <input
                      key={key}
                      type="text"
                      className="form-control mb-2 rounded-pill placeholder-white py-2"
                      placeholder={key}
                      value={carServiceInfo[key]}
                      onChange={(e) =>
                        setCarServiceInfo({
                          ...carServiceInfo,
                          [key]: e.target.value,
                        })
                      }
                    />
                  ) : null
                )}
              </div>

              <div className="mt-4">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSave}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CarRegistration;
