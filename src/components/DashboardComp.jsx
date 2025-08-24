import React, { useState } from "react";
import axios from "axios";
import "./new.css";
import Logout from "./Logout";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CarRegistration from "./CarRegistration";
import { useTranslation } from "react-i18next";
import RightSidebar from "../sidebar/RightSidebar";
import VirtualKeyboard from "./VirtualKeyboard";
import { FaKeyboard } from "react-icons/fa";

function DashboardComp({ apiUrl, showOffcanvas, setShowOffcanvas, userRole, role = "mechanic" }) {
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
    // entryType: "",
    // mileage: "",
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
    serviceTypes: "",
    paymentStatus: "P",
  };
  const { t } = useTranslation();


  const [customerInfo, setCustomerInfo] = useState(customerData);

  const [carServiceInfo, setCarServiceInfo] = useState(carInfo);

  const token = localStorage.getItem("token");

  const [showKeyboard, setShowKeyboard] = useState(false);
  const [keyboardInput, setKeyboardInput] = useState("");
  const [activeInput, setActiveInput] = useState(null);
  const [activeInputRef, setActiveInputRef] = useState(null);


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
          setHistoryData(historyResponse.data);
        } else {
          setHistoryData([]);
        }

        setFound(true);
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

  const handleKeyboardInput = (input) => {
    setKeyboardInput(input);
    if (activeInput === "carPlate") setCarPlate(input);
    if (activeInput && typeof activeInput === "object" && activeInput.section && activeInput.key) {
      if (activeInput.section === "customerInfo") {
        setCustomerInfo((prev) => ({ ...prev, [activeInput.key]: input }));
      } else if (activeInput.section === "carServiceInfo") {
        setCarServiceInfo((prev) => ({ ...prev, [activeInput.key]: input }));
      }
    }
  };

  const openKeyboard = (inputName, ref = null, value = "") => {
    setActiveInput(inputName);
    setShowKeyboard(true);
    setKeyboardInput(value);
    if (ref) setActiveInputRef(ref);
  };

  const closeKeyboard = () => {
    setShowKeyboard(false);
    setActiveInput(null);
    if (activeInputRef && activeInputRef.current) activeInputRef.current.blur();
  };

  const handleEnter = () => {
    if (activeInput === "carPlate") {
      handleSearch();
    } else if (activeInput && typeof activeInput === "object" && activeInput.section && activeInput.key) {
      // For form fields, just close the keyboard when Enter is pressed
      closeKeyboard();
    }
  };

  // Function to handle when form inputs are focused
  const handleFormInputFocus = (section, key, currentValue) => {
    setActiveInput({ section, key });
    setKeyboardInput(currentValue || "");
  };


  return (
    <div className="container-fluid">

      <RightSidebar />

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="text-white">{t("menu.carServiceEntry")}</h1>
        <div className="d-flex justify-content-end">
          <div
            onClick={() => setShowKeyboard(!showKeyboard)}
            style={{ cursor: 'pointer' }}
            title="Open Virtual Keyboard"
          >
            <FaKeyboard size={20} className="text-warning" />
          </div>
        </div>
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
              onFocus={() => setActiveInput("carPlate")}
              // readOnly={showKeyboard}
            />
            {["admin", "super_admin", "mechanic"].includes((userRole?.userRole || "").toLowerCase()) && (
              <button
                className="bg-warning border-0 border-warning rounded text-white px-3 py-2 ms-3"
                onClick={handleSearch}
                disabled={loading}
              >
                {t("search")}
              </button>
            )}
          </div>
        </div>
      </div>

      {showKeyboard && activeInput && (
        <VirtualKeyboard
          input={keyboardInput}
          onChange={handleKeyboardInput}
          onClose={closeKeyboard}
          onEnter={handleEnter}
        />
      )}

      <CarRegistration
        carPlate={carPlate}
        setFound={setFound}
        found={found}
        carServiceInfo={carServiceInfo}
        customerInfo={customerInfo}
        setCarServiceInfo={setCarServiceInfo}
        setCustomerInfo={setCustomerInfo}
        cId={cId}
        carInfo={carInfo}
        customerData={customerData}
        setCarPlate={setCarPlate}
        historyData={historyData}
        role={role}
        showKeyboard={showKeyboard}
        setShowKeyboard={setShowKeyboard}
        keyboardInput={keyboardInput}
        setKeyboardInput={setKeyboardInput}
        activeInput={activeInput}
        setActiveInput={setActiveInput}
        handleKeyboardInput={handleKeyboardInput}
        openKeyboard={openKeyboard}
        closeKeyboard={closeKeyboard}
        handleFormInputFocus={handleFormInputFocus}
        showHistory={['admin', 'super_admin', 'mechanic'].includes((userRole?.userRole || '').toLowerCase())}
      />
    </div>
  );
}

export default DashboardComp;
