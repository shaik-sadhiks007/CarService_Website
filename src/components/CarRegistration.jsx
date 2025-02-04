import React, { useContext, useEffect, useState } from "react";
import "./new.css";
import { CarDataContext } from "./CarDataContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import HistoryTable from "../subcomponents/HistoryTable";
import { useTranslation } from "react-i18next";
import Logout from "./Logout";
import { useNavigate } from "react-router-dom";

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
  historyData
}) {
  const { apiUrl, userRole, mechanics, services, setServices, logout } =
    useContext(CarDataContext);

  const navigate = useNavigate()
  const { t } = useTranslation();

  const [availableServices, setAvailableServices] = useState([]);


  const [images, setImages] = useState({
    fuelLevelImage: null,
    carImage: null,
  });

  const labels = {
    // Customer Info
    custName: t('customerInfo.custName'),
    custContactNo: t('customerInfo.custContactNo'),
    email: t('customerInfo.email'),
    address: t('customerInfo.address'),
    vehicleModel: t('customerInfo.vehicleModel'),
    manufactureYear: t('customerInfo.manufactureYear'),
    vehicleColor: t('customerInfo.vehicleColor'),
    engineNo: t('customerInfo.engineNo'),
    chasisNo: t('customerInfo.chasisNo'),

    // Car Service Info
    dateIn: t('carServiceInfo.dateIn'),
    entryType: t('carServiceInfo.entryType'),
    mileage: t('carServiceInfo.mileage'),
    fuelLevel: t('carServiceInfo.fuelLevel'),
    fuelLevelImage: t('carServiceInfo.fuelLevelImage'),
    carImage: t('carServiceInfo.carImage'),
    remarks: t('carServiceInfo.remarks'),
    technitionName: t('carServiceInfo.technitionName'),
    managerName: t('carServiceInfo.managerName'),
    serviceTypes: t('carServiceInfo.serviceTypes'),
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

        logout()
        navigate('/')

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

      const activeServices = response.data.filter((s) => s.active === true);
      setServices(activeServices);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };


  useEffect(() => {

    fetchServices();

    const handleOnline = async () => {
      await syncOfflineData();
    };

    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("online", handleOnline);
    };
  }, []);



  useEffect(() => {
    setAvailableServices(services.filter((service) => service.active));
  }, [services]);

  const handleSave = async () => {
    try {
      const mandatoryCustomerFields = [
        "custName",
        "custContactNo",
        "email",
        "address",
        "vehicleModel",
        "manufactureYear",
        "vehicleColor",
        "engineNo",
      ];

      const mandatoryCarServiceFields = [
        "dateIn",
        "entryType",
        "mileage",
        "fuelLevel",
        "remarks",
        "status",
        "serviceTypes",
      ];

      const isCustomerInfoValid = mandatoryCustomerFields.every(
        (field) => customerInfo[field] && customerInfo[field].trim() !== ""
      );

      const isCarServiceInfoValid = mandatoryCarServiceFields.every((field) => {
        if (field === "serviceTypes") {
          return carServiceInfo[field] && carServiceInfo[field].length > 0;
        }
        return carServiceInfo[field] && carServiceInfo[field].trim() !== "";
      });

      if (!isCustomerInfoValid || !isCarServiceInfoValid) {
        toast.error("Please fill all mandatory fields.");
        return;
      }

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

      if (!navigator.onLine) {
        // Store data in localStorage if offline
        const pendingRequests =
          JSON.parse(localStorage.getItem("pendingRequests")) || [];
        pendingRequests.push(data);
        localStorage.setItem("pendingRequests", JSON.stringify(pendingRequests));
        toast.info("You are offline. Data saved locally and will sync when online.");
        setCarServiceInfo(carInfo);
        setCustomerInfo(customerInfo)
        return;
      }

      // If online, proceed with API call
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authorization token is missing.");
        return;
      }

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

  const syncOfflineData = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    if (navigator.onLine) {
      let pendingRequests =
        JSON.parse(localStorage.getItem("pendingRequests")) || [];

      if (pendingRequests.length > 0) {
        for (let i = 0; i < pendingRequests.length; i++) {
          try {
            let data = pendingRequests[i];
            const vehicleRegNo = data.custInformation.vehicleRegNo;

            const customerResponse = await axios.get(
              `http://localhost:8080/CarServiceMaintenance/api/v1/carService/getCustomerDetails?vehicleRegNo=${vehicleRegNo}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }
            );

            if (customerResponse.status === 200 && customerResponse.data) {
              data.custInformation = { ...customerResponse.data };
              data.custInformation.modifiedBy = userRole.username;
              data.custInformation.modifiedDate = new Date().toISOString();
            }

            // Save the updated data
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

            // Remove the synced item from local storage
            pendingRequests.splice(i, 1);
            localStorage.setItem("pendingRequests", JSON.stringify(pendingRequests));

            // Adjust loop index to prevent skipping
            i--;
          } catch (error) {
            console.error("Error syncing data:", error);
          }
        }

        // If all data is synced, clear local storage
        if (pendingRequests.length === 0) {
          localStorage.removeItem("pendingRequests");
          toast.success("Offline data synced successfully!");
        }
      }
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
              <h4>{t('customerInformation')}</h4>
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
              <h4>{t("carServiceInformation")}</h4>
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
                {t('save')}
              </button>
            </div>

            {found && <HistoryTable historyData={historyData} />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CarRegistration;
