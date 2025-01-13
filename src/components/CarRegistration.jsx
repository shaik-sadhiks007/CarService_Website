import React, { useContext, useState } from "react";
import Sidebar from "./Sidebar";
import "./new.css";
import { CarDataContext } from "./CarDataContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import Logout from "./Logout";

function CarRegistration({ carPlate,setFound, }) {

  console.log(carPlate, "carplate");
  const { apiUrl, userRole } = useContext(CarDataContext);

  const [images, setImages] = useState({
    fuelLevelImage: null,
    carImage: null,
  });

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
    status: "P",
    technitionName: "",
    managerName: null,
    createdBy: "Rajesh",
    createdDate: new Date().toISOString(),
    modifiedBy: null,
    modifiedDate: null,
  });

  const handleSave = async () => {
    try {
      const data = {
        custInformation: {
          ...customerInfo,
          vehicleRegNo: carPlate,
          createdBy: userRole.username,
        },
        carServiceInfromation: {
          ...carServiceInfo,
          fuelLevelImage: images.fuelLevelImage,
          carImage: images.carImage,
          vehicleRegNo: carPlate,
          createdBy: userRole.username,
        },
      };

      console.log(data, "dataincar");

      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authorization token is missing.");
        return;
      }

      // Send JSON data instead of FormData
      await axios.post(
        `${apiUrl}/api/v1/carService/saveServiceInformation`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Car Service Information saved successfully!");
    } catch (error) {
      toast.error("Failed to save Car Service Information.");
      console.error("Error saving data:", error);
    }
  };

  const handleFileChange = (e, key) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // const base64String = reader.result.split(",")[1];
        const base64String = reader.result;
        const cleanedBase64 = base64String.replace(/^data:/, '');
        setImages((prevState) => ({
          ...prevState,
          [key]: cleanedBase64,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="row px-0">
      <div className="col-12 py-3">
        <div className="container-fluid px-0">
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
                  key !== "createdDate" &&
                  key !== "vehicleRegNo" && (
                    <input
                      key={key}
                      type="text"
                      className="form-control mb-2 rounded-pill placeholder-white py-2"
                      placeholder={key}
                      value={customerInfo[key] || ""}
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
                    onChange={(e) => handleFileChange(e, key)}
                  />
                ) : key !== "createdBy" &&
                  key !== "createdDate" &&
                  key !== "modifiedBy" &&
                  key !== "modifiedDate" &&
                  key !== "vehicleRegNo" ? (
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

            {images.fuelLevelImage && (
              <img src={`data:${images.fuelLevelImage}`} alt="Fuel Level" width="200px" />
            )}
            {images.carImage && (
              <img src={`data:${images.carImage}`} alt="Car" width="200px" />
            )}

            <div className="mt-4">
              <button
                type="button"
                className="btn btn-outline-warning text-white"
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CarRegistration;
