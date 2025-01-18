import React, { useContext, useEffect, useState } from "react";
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
  setCarPlate,
}) {
  const { apiUrl, userRole, mechanics, services, setServices } =
    useContext(CarDataContext);

  const [availableServices, setAvailableServices] = useState([]);

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
    serviceTypes: "Service Types",
  };

  const handleServiceChange = (e) => {
    const selectedValue = e.target.value;
    if (!carServiceInfo.serviceTypes.includes(selectedValue)) {
      setCarServiceInfo({
        ...carServiceInfo,
        serviceTypes: [...carServiceInfo.serviceTypes, selectedValue],
      });
      setAvailableServices(
        availableServices.filter(
          (service) => service.serviceCategory !== selectedValue
        )
      );
    }
  };

  const handleRemoveService = (service) => {
    setCarServiceInfo({
      ...carServiceInfo,
      serviceTypes: carServiceInfo.serviceTypes.filter((s) => s !== service),
    });
    const removedService = services.find((s) => s.serviceCategory === service);
    if (removedService) {
      setAvailableServices([...availableServices, removedService]);
    }
  };

  const fetchServices = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Authorization token not found");
        return;
      }
      const response = await axios.get(
        `${apiUrl}/api/v1/carService/getServiceTypes`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const activeServices = response.data.filter((s) => s.avtive === true);
      setServices(activeServices);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    setAvailableServices(services.filter((service) => service.avtive));
  }, [services]);

  const handleSave = async () => {
    try {
      const formattedDateIn = carServiceInfo.dateIn + "+00:00";
      const serviceString = carServiceInfo.serviceTypes.join(", ");
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
          serviceTypes: serviceString,
          ...(found
            ? {
                modifiedBy: userRole.username,
                modifiedDate: new Date().toISOString(),
                dateIn: formattedDateIn,
              }
            : {
                createdBy: userRole.username,
                createdDate: new Date().toISOString(),
                dateIn: formattedDateIn,
              }),
        },
      };

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
      setCarPlate("");
      toast.success("Car Service Information saved successfully!");
    } catch (error) {
      toast.error("Failed to save Car Service Information.");
      console.error("Error saving data:", error);
    }
  };

  const handleFileChange = (e, key) => {
    const file = e.target.files[0];

    if (file) {
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Only JPG, JPEG, and PNG files are allowed.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result.split(",")[1];
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
                          max={new Date().toISOString().slice(0, 16)}
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
                      ) : key === "serviceTypes" ? (
                        <>
                          <select
                            className="form-control mb-2 placeholder-white py-2"
                            value=""
                            onChange={handleServiceChange}
                          >
                            <option value="" disabled>
                              Select Services
                            </option>
                            {availableServices.map((service) => (
                              <option
                                key={service.id}
                                value={service.serviceCategory}
                              >
                                {service.serviceCategory}
                              </option>
                            ))}
                          </select>
                          <div className="mb-2">
                            {carServiceInfo.serviceTypes.map(
                              (service, index) => (
                                <span
                                  key={index}
                                  className="badge bg-warning me-2 p-2 rounded-pill mb-2"
                                  style={{ cursor: "pointer" }}
                                  onClick={() => handleRemoveService(service)}
                                >
                                  {service} &times;
                                </span>
                              )
                            )}
                          </div>
                        </>
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

            {found && <HistoryTable />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CarRegistration;
