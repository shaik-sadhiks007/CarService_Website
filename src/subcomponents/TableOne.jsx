import dayjs from "dayjs";
import React, { useContext, useEffect, useState } from "react";
import { CarDataContext } from "../components/CarDataContext";
import axios from "axios";
import { toast } from "react-toastify";
import moment from "moment-timezone";
import { useTranslation } from "react-i18next";

function TableOne({ historyData, edit, setClicked, fullData, refresh }) {
  const [isEditing, setIsEditing] = useState(false);

  const { t } = useTranslation()

  const [editableData, setEditableData] = useState({
    vehicleRegNo: historyData?.vehicleRegNo || "",
    custName: historyData?.custName || "",
    custContactNo: historyData?.custContactNo || "",
    email: historyData?.email || "",
    vehicleModel: historyData?.vehicleModel || "",
    fuelLevel: historyData?.fuelLevel || "",
    status: historyData?.status || "",
    technitionName: historyData?.technitionName || "",
    customerComplaints: historyData?.customerComplaints || "",
    dateIn: historyData?.dateIn || "",
    remarks: historyData?.remarks || "",
    serviceTypes: historyData?.serviceTypes || "",
    paymentStatus: historyData?.paymentStatus || "",

  });

  const { services, setServices, apiUrl, userRole } =
    useContext(CarDataContext);

  const [availableServices, setAvailableServices] = useState([]);

  const keyMapping = {
    // Customer Info
    customerId: t("TableMapping.customerId"),
    custName: t("TableMapping.custName"),
    vehicleRegNo: t("TableMapping.vehicleRegNo"),
    dateIn: t("TableMapping.dateIn"),
    custContactNo: t("TableMapping.custContactNo"),
    email: t("TableMapping.email"),
    // address: t("TableMapping.address"),
    vehicleModel: t("TableMapping.vehicleModel"),
    // manufactureYear: t("TableMapping.manufactureYear"),
    // vehicleColor: t("TableMapping.vehicleColor"),
    // engineNo: t("TableMapping.engineNo"),
    // chasisNo: t("TableMapping.chasisNo"),

    // Car Service Info
    // entryType: t("TableMapping.entryType"),
    // mileage: t("TableMapping.mileage"),
    // fuelLevel: t("TableMapping.fuelLevel"),
    // fuelLevelImage: t("TableMapping.fuelLevelImage"),
    // carImage: t("TableMapping.carImage"),
    // technitionName: t("TableMapping.technitionName"),
    // managerName: t("TableMapping.managerName"),
    serviceTypes: t("TableMapping.serviceTypes"),
    paymentStatus: t("account_admin.paymentStatus"),
    customerComplaints: t("TableMapping.customerComplaints"),
    remarks: t("TableMapping.remarks"),

    // createdBy: t("TableMapping.createdBy"),
    // createdDate: t("TableMapping.createdDate"),
    // modifiedBy: t("TableMapping.modifiedBy"),
    // modifiedDate: t("TableMapping.modifiedDate"),
  };

  const handleServiceChange = (e) => {
    const selectedValue = e.target.value;

    // if (!editableData.serviceTypes.includes(selectedValue)) {
    //   setEditableData({
    //     ...editableData,
    //     serviceTypes: [...editableData.serviceTypes, selectedValue],
    //   });
    //   setAvailableServices(
    //     availableServices.filter(
    //       (service) => service.serviceCategory !== selectedValue
    //     )
    //   );
    // }


    setEditableData({
      ...editableData,
      serviceTypes: selectedValue,
    });

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


    if (
      isEditing &&
      userRole.userRole === "super_admin" &&
      ["vehicleRegNo", "custName", "customerComplaints", "custContactNo", "vehicleModel", "fuelLevel", "email"].includes(key)
    ) {
      return (
        <input
          type="text"
          name={key}
          value={editableData[key] || ""}
          onChange={handleInputChange}
          className="form-control placeholder-white"
        />
      );
    }

    if (isEditing && (userRole?.userRole == "super_admin") && key === "dateIn") {
      return (
        <>
          <input
            type="datetime-local"
            name="dateIn"
            className="form-control placeholder-white py-2"
            value={editableData["dateIn"] || ""}
            max={new Date().toISOString().slice(0, 16)}
            onChange={handleInputChange}
          />
        </>
      )
    }

    // if (isEditing && (userRole?.userRole == "super_admin") && key === "technitionName") {
    //   return (
    //     <>
         
    //     </>
    //   )
    // }
    if (isEditing && (userRole?.userRole == "mechanic" || userRole?.userRole == "super_admin") && key === "remarks") {
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

    if (isEditing && (userRole?.userRole == "mechanic" || userRole?.userRole == "super_admin") && key === "serviceTypes") {
      return (
        <>
          <select
            className="form-control mb-2 placeholder-white py-2"
            value={editableData.serviceTypes}
            onChange={handleServiceChange}
          >
            <option value="" disabled>
              Select Services
            </option>
            {services.map((service) => (
              <option key={service.id} value={service.serviceCategory}>
                {service.serviceCategory}
              </option>
            ))}
          </select>
          {/* <div className="mb-2">
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
          </div> */}
        </>
      );
    }

    if (isEditing && (userRole?.userRole == "account_admin" || userRole?.userRole == "super_admin") && key === "paymentStatus") {

      return (
        <select
          className="form-select"
          name="paymentStatus"
          value={editableData.paymentStatus}
          onChange={handleInputChange}
        >
          <option value="P">Pending Payment</option>
          <option value="C">Completed</option>
          <option value="L">Pay Later</option>
        </select>
      )

    }

    // Display full payment status descriptions when not editing
    if (key === "paymentStatus" && !isEditing) {
      const statusMap = {
        "P": { label: "Pending Payment", className: "bg-primary" },
        "C": { label: "Completed", className: "bg-success" },
        "L": { label: "Pay Later", className: "bg-warning text-dark" }
      };
      const status = statusMap[value];
      if (status) {
        return <span className={`badge ${status.className}`}>{status.label}</span>;
      }
      return value || "N/A";
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
    if (userRole == 'mechanic') {
      toast.success("you can edit Remarks and Services now.");
    } else {
      toast.success("you can edit Payment Status now.");
    }
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
        paymentStatus: editableData.paymentStatus,
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
      custInformation: {
        ...cuInfo,
        vehicleRegNo: editableData.vehicleRegNo,
        custName: editableData.custName,
        custContactNo: editableData.custContactNo,
        email: editableData.email,
        vehicleModel: editableData.vehicleModel,
        modifiedBy: userRole.username,
        modifiedDate: moment().tz("Asia/Singapore").toISOString(),

      },
      carServiceInfromation: {
        ...carInfo,
        vehicleRegNo: editableData.vehicleRegNo,
        remarks: editableData.remarks,
        serviceTypes: serviceString,
        paymentStatus: editableData.paymentStatus,
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
          <span className="fw-semibold">{t("back")}</span>
        </button>
        {edit && (
          <>
            {isEditing ? (
              <button
                className="btn btn-outline-success text-white ms-5"
                onClick={() => saveChanges(historyData.vehicleRegNo)}
              >
                <span className="fw-semibold">{t("save")}</span>
              </button>
            ) : (
              <button
                className="btn btn-outline-warning text-white ms-5"
                onClick={handleEditButton}
              >
                <span className="fw-semibold">{t("edit")}</span>
              </button>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default TableOne;
