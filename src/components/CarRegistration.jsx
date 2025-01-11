import React, { useContext, useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import "./new.css";
import { CarDataContext } from "./CarDataContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

function CarRegistration() {
  // const services = [
  //   { id: 1, serviceCategory: "Brake system", active: true },
  //   { id: 2, serviceCategory: "Hand Break", active: true },
  //   { id: 3, serviceCategory: "test1", active: false },
  //   { id: 4, serviceCategory: "test2", active: true },
  //   { id: 5, serviceCategory: "test3", active: true },
  //   { id: 6, serviceCategory: "test4", active: false },
  // ];

  const [services, setServices] = useState([]);

  const { setCarData, apiUrl } = useContext(CarDataContext);

  const [newData, setNewData] = useState({
    custName: "",
    custContactNo: "",
    email: "",
    address: "",
    remarks: "",
    paymentDetails: "",
    invoiceNo: "",
    dateTime: new Date().toISOString().slice(0, 16),
    status: "P",
    selectedServices: [],
  });

  const [availableServices, setAvailableServices] = useState([]);

  const handleServiceChange = (e) => {
    const selectedValue = e.target.value;
    if (!newData.selectedServices.includes(selectedValue)) {
      setNewData({
        ...newData,
        selectedServices: [...newData.selectedServices, selectedValue],
      });
      setAvailableServices(
        availableServices.filter(
          (service) => service.serviceCategory !== selectedValue
        )
      );
    }
  };

  const handleRemoveService = (service) => {
    setNewData({
      ...newData,
      selectedServices: newData.selectedServices.filter((s) => s !== service),
    });
    const removedService = services.find((s) => s.serviceCategory === service);
    if (removedService) {
      setAvailableServices([...availableServices, removedService]);
    }
  };

  const handleSave = () => {
    setCarData((prevData) => [...prevData, newData]);
    ("New Data Saved:", newData);

    toast.success("Car Registration Successful!");

    setNewData({
      custName: "",
      custContactNo: "",
      email: "",
      address: "",
      remarks: "",
      paymentDetails: "",
      invoiceNo: "",
      dateTime: new Date().toISOString().slice(0, 16),
      status: "P",
      selectedServices: [],
    });

    setAvailableServices(services.filter((service) => service.avtive));
  };

  useEffect(() => {
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

        setServices(response.data);

      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetchServices();
  }, []);

  useEffect(() => {
    setAvailableServices(services.filter((service) => service.avtive));

  },[services])


  return (
    <div className="container-fluid">
      <div className="row">
        <div
          className="col-2 p-3"
          style={{
            height: "auto",
            minHeight: "100vh",
            backgroundColor: "#212632",
          }}
        >
          <Sidebar />
        </div>
        <div className="col-10">
          <div className="container-fluid">
            <h1 className="text-white">Car Registration</h1>
            <div
              className="text-white w-100 p-4 rounded-2"
              style={{ backgroundColor: "#212632" }}
            >
              <div className="mb-4">
                <p>New Car Registration</p>
              </div>

              <div className="row g-3">
                <div className="col-md-6">
                  <input
                    type="text"
                    className="form-control mb-2 rounded-pill placeholder-white py-2"
                    placeholder="Customer Name"
                    value={newData.custName}
                    onChange={(e) =>
                      setNewData({ ...newData, custName: e.target.value })
                    }
                  />
                </div>
                <div className="col-md-6">
                  <input
                    type="text"
                    className="form-control mb-2 rounded-pill placeholder-white py-2"
                    placeholder="Contact No"
                    value={newData.custContactNo}
                    onChange={(e) =>
                      setNewData({ ...newData, custContactNo: e.target.value })
                    }
                  />
                </div>

                <div className="col-md-6">
                  <input
                    type="email"
                    className="form-control mb-2 rounded-pill placeholder-white py-2"
                    placeholder="Email"
                    value={newData.email}
                    onChange={(e) =>
                      setNewData({ ...newData, email: e.target.value })
                    }
                  />
                </div>
                <div className="col-md-6">
                  <input
                    type="text"
                    className="form-control mb-2 rounded-pill placeholder-white py-2"
                    placeholder="Address"
                    value={newData.address}
                    onChange={(e) =>
                      setNewData({ ...newData, address: e.target.value })
                    }
                  />
                </div>

                <div className="col-md-6">
                  <input
                    type="text"
                    className="form-control mb-2 rounded-pill placeholder-white py-2"
                    placeholder="Payment Details"
                    value={newData.paymentDetails}
                    onChange={(e) =>
                      setNewData({ ...newData, paymentDetails: e.target.value })
                    }
                  />
                </div>
                <div className="col-md-6">
                  <input
                    type="text"
                    className="form-control mb-2 rounded-pill placeholder-white py-2"
                    placeholder="Invoice No"
                    value={newData.invoiceNo}
                    onChange={(e) =>
                      setNewData({ ...newData, invoiceNo: e.target.value })
                    }
                  />
                </div>

                <div className="col-md-6">
                  <input
                    type="datetime-local"
                    className="form-control mb-2 rounded-pill placeholder-white py-2"
                    value={newData.dateTime}
                    onChange={(e) =>
                      setNewData({ ...newData, dateTime: e.target.value })
                    }
                  />
                </div>

                <div className="col-md-6">
                  <select
                    className="form-control mb-2 rounded-pill placeholder-white py-2"
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
                </div>
              </div>

              <div className="mb-2">
                {newData.selectedServices.map((service, index) => (
                  <span
                    key={index}
                    className="badge bg-warning me-2 p-2 rounded-pill"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleRemoveService(service)}
                  >
                    {service} &times;
                  </span>
                ))}
              </div>

              <textarea
                className="form-control mb-2 placeholder-white py-2"
                rows="4"
                placeholder="Remarks"
                value={newData.remarks}
                onChange={(e) =>
                  setNewData({ ...newData, remarks: e.target.value })
                }
              />

              <div className="mt-4">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSave}
                >
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
