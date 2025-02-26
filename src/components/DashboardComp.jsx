import React, { useState } from "react";
import axios from "axios";
import "./new.css";
import Logout from "./Logout";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CarRegistration from "./CarRegistration";
import { useTranslation } from "react-i18next";
import RightSidebar from "../sidebar/RightSidebar";

function DashboardComp({ apiUrl, showOffcanvas, setShowOffcanvas, userRole, role = "customer" }) {
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
    // address: "",
    vehicleModel: "",
    // manufactureYear: "",
    // vehicleColor: "",
    // engineNo: "",
    // chasisNo: "",
    custType: "c",
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
    // managerName: null,
    customerComplaints: "",
    createdBy: "",
    createdDate: new Date().toISOString(),
    modifiedBy: null,
    modifiedDate: null,
    serviceTypes: [],
    paymentStatus: "pending",
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

      if (response.data.custInformationList.length > 0) {

        console.log(response.data.custInformationList[0], "data found")
        setCustomerInfo({
          ...customerInfo,
          vehicleRegNo: response.data.custInformationList[0].vehicleRegNo,
          custName: response.data.custInformationList[0].custName,
          custContactNo: response.data.custInformationList[0].custContactNo,
          email: response.data.custInformationList[0].email,
          // address: response.data.custInformationList[0].address,
          vehicleModel: response.data.custInformationList[0].vehicleModel,
          // manufactureYear: response.data.custInformationList[0].manufactureYear,
          // vehicleColor: response.data.custInformationList[0].vehicleColor,
          // engineNo: response.data.custInformationList[0].engineNo,
          // chasisNo: response.data.custInformationList[0].chasisNo,
          createdBy: response.data.custInformationList[0].createdBy,
          createdDate: response.data.custInformationList[0].createdDate,
          modifiedBy: response.data.custInformationList[0].modifiedBy,
          modifiedDate: response.data.custInformationList[0].modifiedDate,
        });

        setCarServiceInfo({
          ...carServiceInfo,
          vehicleRegNo: response.data.carServiceInfromationList[0].vehicleRegNo,
          dateIn: response.data.carServiceInfromationList[0].dateIn,
          entryType: response.data.carServiceInfromationList[0].entryType,
          mileage: response.data.carServiceInfromationList[0].mileage,
          serviceTypes: response.data.carServiceInfromationList[0].serviceTypes
            ? response.data.carServiceInfromationList[0].serviceTypes.split(',')
            : [],
          paymentStatus: response.data.carServiceInfromationList[0].paymentStatus,
          customerComplaints: response.data.carServiceInfromationList[0].customerComplaints,
          createdBy: response.data.carServiceInfromationList[0].createdBy,
          createdDate: response.data.carServiceInfromationList[0].createdDate,
          modifiedBy: response.data.carServiceInfromationList[0].modifiedBy,
          modifiedDate: response.data.carServiceInfromationList[0].modifiedDate,
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

        if (historyResponse.data.length > 0) {
          toast.success("Car History found!");
          setFound(true);
          setHistoryData(historyResponse.data);
        } else {
          setHistoryData([]);
        }
        setCId(response.data.custInformationList[0].customerId);

      } else {
        setFound(false);
        setCustomerInfo(customerData);
        setCId(null);
      }
    } catch (err) {
      setFound(false);
      setCId(null);
      toast.error("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
  };




  return (
    <div className="container-fluid">

      <RightSidebar />

      <div>
        <h1 className="text-white mb-4">{t("menu.carServiceEntry")}</h1>
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
        role={role}
      />
    </div>
  );
}

export default DashboardComp;
