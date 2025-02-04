import React, { useState } from "react";
import axios from "axios";
import "./new.css";
import Logout from "./Logout";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CarRegistration from "./CarRegistration";
import { useTranslation } from "react-i18next";

function DashboardComp({ apiUrl, showOffcanvas, setShowOffcanvas, userRole }) {
  const [carPlate, setCarPlate] = useState("");

  const [found, setFound] = useState(false);

  const [loading, setLoading] = useState(false);

  const [cId, setCId] = useState(null);

  const [historyData, setHistoryData] = useState([])

  const customerData = {
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
    createdBy: null,
    createdDate: null,
    modifiedBy: null,
    modifiedDate: null,
  };

  const carInfo = {
    vehicleRegNo: "",
    dateIn: new Date().toISOString().slice(0, 16),
    entryType: "",
    mileage: "",
    fuelLevel: "",
    // fuelLevelImage: null,
    // carImage: null,
    remarks: "",
    status: "P",
    technitionName: "",
    managerName: null,
    createdBy: "",
    createdDate: new Date().toISOString(),
    modifiedBy: null,
    modifiedDate: null,
    serviceTypes: []
  };
  const { t } = useTranslation();


  const [customerInfo, setCustomerInfo] = useState(customerData);

  const [carServiceInfo, setCarServiceInfo] = useState(carInfo);

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
        setCustomerInfo({
          ...customerInfo,
          vehicleRegNo: response.data.vehicleRegNo,
          custName: response.data.custName,
          custContactNo: response.data.custContactNo,
          email: response.data.email,
          address: response.data.address,
          vehicleModel: response.data.vehicleModel,
          manufactureYear: response.data.manufactureYear,
          vehicleColor: response.data.vehicleColor,
          engineNo: response.data.engineNo,
          chasisNo: response.data.chasisNo,
          createdBy: response.data.createdBy,
          createdDate: response.data.createdDate,
          modifiedBy: response.data.modifiedBy,
          modifiedDate: response.data.modifiedDate,
        });

        toast.success("Customer information found!");

        const historyResponse = await axios.get(
          `${apiUrl}/api/v1/carService/getCompletedHistory`,
          {
            params: { carRegNo: carPlate },
            headers: {
              Authorization: `Bearer ${token}`,
            }
          }
        );

        if (historyResponse.data) {
          toast.success("Car History found!");
          setFound(true);
          setHistoryData(historyResponse.data);
        } else {
          setHistoryData([]);
        }
        setCId(response.data.customerId);

      } else {
        setFound(false);
        setCustomerInfo(customerData);
        setCId(null);
        toast.error("No data found for the provided registration number.");
      }
    } catch (err) {
      setFound(false);
      setCId(null);
      toast.error("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
  };



  console.log(historyData, "hd")
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
          <h1 className="text-white">{t("menu.carServiceEntry")}</h1>
        </div>
        <Logout />
      </div>

      <div
        className="text-white w-100 p-4 rounded-2"
        style={{ backgroundColor: "#212632" }}
      >
        <div className="mb-4">
          <label htmlFor="carPlate" className="form-label">
            {t("carRegNo")}
          </label>
          <div className="col-12 col-md-9 col-lg-6 d-flex">
            <input
              id="carPlate"
              type="text"
              className="form-control input-dashboard text-white placeholder-white"
              placeholder={t("carRegNo")}
              value={carPlate}
              onChange={(e) => setCarPlate(e.target.value)}
            />
            <button
              className="btn btn-outline-warning text-white py-2 ms-3"
              onClick={handleSearch}
              disabled={loading}
            >
              {t("search")}
            </button>
          </div>
        </div>
      </div>

      <CarRegistration
        carPlate={carPlate}
        setFound={setFound}
        found={found}
        carServiceInfo={carServiceInfo}
        customerInfo={customerInfo}
        setCarServiceInfo={setCarServiceInfo}
        setCustomerInfo={setCustomerInfo}
        cId={cId}
        carInfo={customerData}
        customerData={customerData}
        setCarPlate={setCarPlate}
        historyData={historyData}
      />
    </div>
  );
}

export default DashboardComp;
