import dayjs from "dayjs";
import React, { useContext, useEffect, useState } from "react";
import { CarDataContext } from "../components/CarDataContext";
import axios from "axios";
import { toast } from "react-toastify";
import moment from "moment-timezone";

function TableOne({ historyData, edit, setClicked, fullData,refresh }) {
  const [isEditing, setIsEditing] = useState(false);

  const [editableData, setEditableData] = useState({
    remarks: historyData?.remarks || "",
    serviceTypes: historyData?.serviceTypes || "",
  });

  const { services, setServices, apiUrl, userRole } =
    useContext(CarDataContext);

  const [availableServices, setAvailableServices] = useState([]);

  const keyMapping = {
    // Customer Info
    customerId: "Customer Id",
    custName: "Customer Name",
    vehicleRegNo: "Vehicle No.",
    dateIn: "Date In",
    custContactNo: "Phone Number",
    email: "Email",
    address: "Address",
    vehicleModel: "Vehicle Model",
    manufactureYear: "Manufacture Year",
    vehicleColor: "Vehicle Color",
    engineNo: "Engine No.",
    chasisNo: "Chasis No.",

    // Car Service Info
    entryType: "Entry Type",
    mileage: "Mileage",
    fuelLevel: "Fuel Level",
    fuelLevelImage: "Fuel Level Image",
    carImage: "Car Image",
    technitionName: "Technician Name",
    managerName: "Manager Name",
    remarks: "Remarks",
    serviceTypes: "Service Types",
    createdBy: "Created By",
    createdDate: "Created Date",
    modifiedBy: "Modified By",
    modifiedDate: "Modified Date",
  };

  const handleServiceChange = (e) => {
    const selectedValue = e.target.value;

    if (!editableData.serviceTypes.includes(selectedValue)) {
      setEditableData({
        ...editableData,
        serviceTypes: [...editableData.serviceTypes, selectedValue],
      });
      setAvailableServices(
        availableServices.filter(
          (service) => service.serviceCategory !== selectedValue
        )
      );
    }
  };

  const handleRemoveService = (service) => {
    setEditableData((prev) => ({
      ...prev,
      serviceTypes: prev.serviceTypes.filter((s) => s !== service),
    }));

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
    if (services.length === 0) {
      fetchServices();
    }

    if (services.length > 0 && typeof editableData.serviceTypes === "string") {
      const parsedServiceTypes = editableData.serviceTypes
        .split(",")
        .map((s) => s.trim());

      const validServices = parsedServiceTypes.filter((service) => {
        const isValid = services.some((s) => {
          const match =
            s.serviceCategory.trim().toLowerCase() ===
            service.trim().toLowerCase();
          return match;
        });
        return isValid;
      });

      const availServices = services.filter(
        (service) =>
          !parsedServiceTypes.some(
            (type) =>
              type.trim().toLowerCase() ===
              service.serviceCategory.trim().toLowerCase()
          )
      );

      setAvailableServices(availServices);
      setEditableData((prev) => ({
        ...prev,
        serviceTypes: validServices,
      }));
    }
  }, [isEditing, services]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return dayjs(dateString).format("DD-MM-YYYY HH:mm:ss");
  };

  const getMimeType = (base64String) => {
    if (base64String.startsWith("/9j/")) return "image/jpeg";
    if (base64String.startsWith("iVBORw0KGgo")) return "image/png";
    if (
      base64String.startsWith("R0lGODdh") ||
      base64String.startsWith("R0lGODlh")
    )
      return "image/gif";
    return "image/*";
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableData((prev) => ({ ...prev, [name]: value }));
  };

  const renderValue = (key, value) => {
    if (isEditing && key === "remarks") {
      return (
        <input
          type="text"
          name="remarks"
          value={editableData.remarks}
          onChange={handleInputChange}
          className="form-control placeholder-white"
        />
      );
    }

    if (isEditing && key === "serviceTypes") {
      return (
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
              <option key={service.id} value={service.serviceCategory}>
                {service.serviceCategory}
              </option>
            ))}
          </select>
          <div className="mb-2">
            {editableData.serviceTypes.map((service, index) => (
              <span
                key={index}
                className="badge bg-warning me-2 p-2 rounded-pill mb-2"
                style={{ cursor: "pointer" }}
                onClick={() => handleRemoveService(service)}
              >
                {service} &times;
              </span>
            ))}
          </div>
        </>
      );
    }

    if (key === "createdDate" || key === "modifiedDate" || key === "dateIn") {
      return formatDate(value);
    }
    if ((key === "fuelLevelImage" || key === "carImage") && value) {
      const mimeType = getMimeType(value);
      return (
        <img
          src={`data:${mimeType};base64,${value}`}
          alt={key}
          style={{
            maxWidth: "150px",
            maxHeight: "100px",
            objectFit: "contain",
          }}
        />
      );
    }
    return value || "N/A";
  };

  const handleEditButton = () => {
    setIsEditing(true);
    toast.success("you can edit Remarks and Services now.");
  };

  const saveChanges = async (vehicle) => {
    const token = localStorage.getItem('token');
    const serviceString = editableData.serviceTypes.join(", ");

    setClicked({
      click: true,
      data: {
        ...historyData,
        remarks: editableData.remarks,
        serviceTypes: serviceString,
        modifiedBy: userRole.username,
        modifiedDate: moment().tz("Asia/Singapore").toISOString(),
      },
    });

    const cuInfo = fullData.custInformationList.find(
      (item) => item.vehicleRegNo === vehicle
    );
    const carInfo = fullData.carServiceInfromationList.find(
      (item) => item.vehicleRegNo === vehicle
    );

    const data = {
      custInformation: cuInfo,
      carServiceInfromation: {
        ...carInfo,
        remarks: editableData.remarks,
        serviceTypes: serviceString,
        modifiedBy: userRole.username,
        modifiedDate: moment().tz("Asia/Singapore").toISOString(),
      },
    };


    try {
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
      toast.success("Edited successfully!");
    } catch (error) {
      toast.error("Failed to Edit. Please try again.");
      console.error(error);
    }

    refresh()

    setIsEditing(false);
  };

  return (
    <>
      <div className="mt-3" style={{ overflowX: "auto" }}>
        <table className="table table-bordered">
          <tbody>
            {historyData &&
              Object.keys(keyMapping).map((key, index) => (
                <tr key={index}>
                  <td style={{ width: "150px" }}>
                    <span className="fw-bold">{keyMapping[key]}</span>
                  </td>
                  <td>{renderValue(key, historyData[key])}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <div className="d-flex">
        <button
          className="btn btn-outline-warning text-white"
          onClick={() => setClicked({ click: false, data: {} })}
        >
          <span className="fw-semibold">Back</span>
        </button>
        {edit && (
          <>
            {isEditing ? (
              <button
                className="btn btn-outline-success text-white ms-5"
                onClick={() => saveChanges(historyData.vehicleRegNo)}
              >
                <span className="fw-semibold">Save</span>
              </button>
            ) : (
              <button
                className="btn btn-outline-warning text-white ms-5"
                onClick={handleEditButton}
              >
                <span className="fw-semibold">Edit</span>
              </button>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default TableOne;
