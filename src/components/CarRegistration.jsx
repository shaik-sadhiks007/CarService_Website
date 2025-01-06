import React, { useState } from "react";
import Sidebar from "./Sidebar";

function CarRegistration({carData,setCarData}) {
  const services = [
    {
      id: 1,
      serviceCategory: "Brake system",
      active: true,
    },
    {
      id: 2,
      serviceCategory: "Hand Break",
      active: true,
    },
    {
      id: 3,
      serviceCategory: "test1",
      active: false, 
    },
    {
      id: 4,
      serviceCategory: "test2",
      active: true,
    },
    {
      id: 5,
      serviceCategory: "test3",
      active: true,
    },
    {
      id: 6,
      serviceCategory: "test4",
      active: false, 
    },
  ];

  const activeServices = services.filter((service) => service.active);

  const [newData, setNewData] = useState({
    custName: "",
    custContactNo: "",
    email: "",
    address: "",
    remarks: "",
    paymentDetails: "",
    invoiceNo: "",
    dateTime: new Date().toISOString().slice(0, 16),
    status: "Pending",
    selectedServices: [],
  });

  // Handle adding selected services
  const handleServiceChange = (e) => {
    const selectedValue = e.target.value;

    if (!newData.selectedServices.includes(selectedValue)) {
      setNewData({
        ...newData,
        selectedServices: [...newData.selectedServices, selectedValue],
      });
    }
  };

  // Handle removing services
  const handleRemoveService = (service) => {
    setNewData({
      ...newData,
      selectedServices: newData.selectedServices.filter((s) => s !== service),
    });
  };

  const handleSave = () => {
    setCarData((prevData) => [...prevData, newData]);
    console.log("New Data Saved:", newData);
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div
          className="col-2 p-3"
          style={{ height: "auto", minHeight: "100vh", backgroundColor: "#212632" }}
        >
          <Sidebar />
        </div>
        <div className="col-10">
          <div className="container-fluid">
            <h1 className="text-white">Car Registration</h1>
            <div className="text-white w-100 p-4 rounded-2" style={{ backgroundColor: "#212632" }}>
              <div className="mb-4">
                <p>New Car Registration</p>
              </div>

              <div className="col-6">
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Customer Name"
                  value={newData.custName}
                  onChange={(e) => setNewData({ ...newData, custName: e.target.value })}
                />
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Contact No"
                  value={newData.custContactNo}
                  onChange={(e) => setNewData({ ...newData, custContactNo: e.target.value })}
                />
                <input
                  type="email"
                  className="form-control mb-2"
                  placeholder="Email"
                  value={newData.email}
                  onChange={(e) => setNewData({ ...newData, email: e.target.value })}
                />
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Address"
                  value={newData.address}
                  onChange={(e) => setNewData({ ...newData, address: e.target.value })}
                />
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Remarks"
                  value={newData.remarks}
                  onChange={(e) => setNewData({ ...newData, remarks: e.target.value })}
                />
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Payment Details"
                  value={newData.paymentDetails}
                  onChange={(e) => setNewData({ ...newData, paymentDetails: e.target.value })}
                />
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Invoice No"
                  value={newData.invoiceNo}
                  onChange={(e) => setNewData({ ...newData, invoiceNo: e.target.value })}
                />
                <input
                  type="datetime-local"
                  className="form-control mb-2"
                  value={newData.dateTime}
                  onChange={(e) => setNewData({ ...newData, dateTime: e.target.value })}
                />

                {/* Multi-Select Dropdown */}
                <select
                  className="form-control mb-2"
                  value=""
                  onChange={handleServiceChange}
                >
                  <option value="" disabled>
                    Select Services
                  </option>
                  {activeServices.map((service) => (
                    <option key={service.id} value={service.serviceCategory}>
                      {service.serviceCategory}
                    </option>
                  ))}
                </select>

                {/* Display Selected Services as Chips */}
                <div className="mb-2">
                  {newData.selectedServices.map((service, index) => (
                    <span
                      key={index}
                      className="badge bg-primary me-2 p-2 rounded-pill"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleRemoveService(service)}
                    >
                      {service} &times;
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <button type="button" className="btn btn-primary" onClick={handleSave}>
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
