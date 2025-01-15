import React, { useContext, useState } from "react";
import "./new.css";
import { CarDataContext } from "./CarDataContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import HistoryTable from "../subcomponents/HistoryTable";

function CarRegistration({
  carPlate,
  setFound,
  customerInfo,
  carServiceInfo,
  setCustomerInfo,
  setCarServiceInfo,
  found,
  cId,
  customerData,
  carInfo,
  setCarPlate
}) {
  console.log(carPlate, "carplate");
  const { apiUrl, userRole, mechanics } = useContext(CarDataContext);

  const [images, setImages] = useState({
    fuelLevelImage: null,
    carImage: null,
  });

  const labels = {
    // Customer Info
    custName: "Customer Name",
    custContactNo: "Phone Number",
    email: "Email",
    address: "Address",
    vehicleModel: "Vehicle Model",
    manufactureYear: "Manufacture Year",
    vehicleColor: "Velhicle Color",
    engineNo: "Engine No.",
    chasisNo: "Chasis No.",

    // Car Service Info
    dateIn: "Date In",
    entryType: "Entry Type",
    mileage: "Milege",
    fuelLevel: "Fuel Level",
    fuelLevelImage: "Fuel Level Image",
    carImage: "Car Image",
    remarks: "Remarks",
    technitionName: "Technition Name",
    managerName: "Manager Name",
  };


  const handleSave = async () => {
    try {

      const formattedDateIn = carServiceInfo.dateIn + "+00:00"; 

      const data = {
        custInformation: {
          ...customerInfo,
          vehicleRegNo: carPlate,
          ...(found
            ? {
                modifiedBy: userRole.username,
                modifiedDate: new Date().toISOString(),
                customerId: cId, 
              }
            : {
                createdBy: userRole.username,
                createdDate: new Date().toISOString(),

              }),
        },
        carServiceInfromation: {
          ...carServiceInfo,
          fuelLevelImage: images.fuelLevelImage,
          carImage: images.carImage,
          vehicleRegNo: carPlate,
          ...(found
            ? {
                modifiedBy: userRole.username,
                modifiedDate: new Date().toISOString(),
                dateIn : formattedDateIn 

              }
            : {
                createdBy: userRole.username,
                createdDate: new Date().toISOString(),
                dateIn : formattedDateIn 

              }),
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
      setFound(false);
      setCarServiceInfo(carInfo);
      setCustomerInfo(customerData);
      setCarPlate('')
      setCarp
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
        const base64String = reader.result.split(",")[1];
        // const base64String = reader.result;
        // const cleanedBase64 = base64String.replace(/^data:/, "");
        setImages((prevState) => ({
          ...prevState,
          [key]: base64String,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="row px-0">
      <div className="col-12">
        <div className="container-fluid px-0">
          <div
            className="text-white w-100 p-4 rounded-2 mt-4"
            style={{ backgroundColor: "#212632" }}
          >
            {/* Customer Information */}
            <div className="mb-4">
              <h4>Customer Information</h4>
              <div className="row">
                {Object.keys(customerInfo).map(
                  (key) =>
                    labels[key] && (
                      <div className="col-12 col-md-6 mb-3" key={key}>
                        <label className="form-label">{labels[key]}</label>
                        <input
                          type="text"
                          name={key}
                          className="form-control placeholder-white py-2"
                          placeholder={labels[key]}
                          value={customerInfo[key] || ""}
                          onChange={(e) =>
                            setCustomerInfo({
                              ...customerInfo,
                              [key]: e.target.value,
                            })
                          }
                          disabled={
                            userRole.userRole === "user" ? found : false
                          }
                        />
                      </div>
                    )
                )}
              </div>
            </div>
          </div>
          <div
            className="text-white w-100 p-4 rounded-2 mt-4"
            style={{ backgroundColor: "#212632" }}
          >
            {/* Car Service Information */}
            <div className="mb-4">
              <h4>Car Service Information</h4>
              <div className="row">
                {Object.keys(carServiceInfo).map((key) =>
                  labels[key] &&
                  key !== "remarks" &&
                  !(
                    key === "technitionName" && userRole.userRole !== "admin"
                  ) ? (
                    <div className="col-12 col-md-6 mb-3" key={key}>
                      <label className="form-label">{labels[key]}</label>
                      {key === "fuelLevelImage" || key === "carImage" ? (
                        <input
                          type="file"
                          name={key}
                          className="form-control placeholder-white py-2"
                          onChange={(e) => handleFileChange(e, key)}
                        />
                      ) : key === "dateIn" ? (
                        <input
                          type="datetime-local"
                          name={key}
                          className="form-control placeholder-white py-2"
                          value={carServiceInfo[key] || ""}
                          onChange={(e) =>
                            setCarServiceInfo({
                              ...carServiceInfo,
                              [key]: e.target.value,
                            })
                          }
                        />
                      ) : key === "technitionName" &&
                        userRole.userRole === "admin" ? (
                        <select
                          name={key}
                          className="form-control placeholder-white py-2"
                          value={carServiceInfo[key] || ""}
                          onChange={(e) =>
                            setCarServiceInfo({
                              ...carServiceInfo,
                              [key]: e.target.value,
                            })
                          }
                        >
                          <option value="">Select Mechanic</option>
                          {mechanics.map((mechanic, index) => (
                            <option key={index} value={mechanic.username}>
                              {mechanic.username}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="text"
                          className="form-control placeholder-white py-2"
                          placeholder={labels[key]}
                          value={carServiceInfo[key] || ""}
                          onChange={(e) =>
                            setCarServiceInfo({
                              ...carServiceInfo,
                              [key]: e.target.value,
                            })
                          }
                        />
                      )}
                    </div>
                  ) : null
                )}

                {/* Display remarks field at the end */}
                {labels["remarks"] && (
                  <div className="col-12 mb-3">
                    <label className="form-label">{labels["remarks"]}</label>
                    <textarea
                      className="form-control placeholder-white py-2"
                      rows="4"
                      placeholder={labels["remarks"]}
                      value={carServiceInfo["remarks"] || ""}
                      onChange={(e) =>
                        setCarServiceInfo({
                          ...carServiceInfo,
                          remarks: e.target.value,
                        })
                      }
                    ></textarea>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4">
              <button
                type="button"
                className="btn btn-outline-warning text-white"
                onClick={handleSave}
              >
                Save
              </button>
            </div>

            { found && <HistoryTable/>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CarRegistration;
