import React, { useContext, useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { CarDataContext } from "./CarDataContext";
import axios from "axios";
import Logout from "./Logout";

function Completed() {
  const { userRole, apiUrl, showOffcanvas, setShowOffcanvas } =
    useContext(CarDataContext);
  const [completedData, setCompletedData] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchCompletedCars = async () => {
      try {
        const url =
          userRole.userRole === "admin"
            ? `${apiUrl}/api/v1/carService/getAllPendingCarServiceforAdmin`
            : `${apiUrl}/api/v1/carService/getAllPendingCarServiceforUser?technitionName=${userRole.username}`;

        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const customerData = response.data.custInformationList || [];
        const serviceData = response.data.carServiceInfromationList || [];

        const filteredServiceData = serviceData.filter(
          (service) => service.status === "D"
        );

        const combinedData = filteredServiceData.map((service) => {
          const customer = customerData.find(
            (cust) => cust.customerId === service.customerId
          );
          return { ...service, ...customer };
        });

        setCompletedData(combinedData);
      } catch (error) {
        console.error("Error fetching completed cars:", error);
      }
    };

    fetchCompletedCars();
  }, [userRole]);

  const toggleOffcanvas = () => {
    setShowOffcanvas(!showOffcanvas);
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div
          className={`col-2 col-md-3 col-lg-2 p-3 ${
            showOffcanvas ? "d-block" : "d-none d-md-block"
          }`}
          style={{
            height: "auto",
            minHeight: "100vh",
            backgroundColor: "#212632",
          }}
        >
          <Sidebar />
        </div>
        <div className="col-12 col-md-9 col-lg-10 p-3">
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
                <h1 className="text-white">Completed</h1>
              </div>
              <Logout />
            </div>

            {completedData.length > 0 ? (
              <div style={{ overflowX: "auto" }}>
                <table className="table table-striped table-dark">
                  <thead>
                    <tr>
                      <th>Customer Name</th>
                      <th>Contact No</th>
                      <th>Email</th>
                      <th>Invoice No</th>
                      <th>Date & Time</th>
                      <th>Selected Services</th>
                      <th>Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {completedData.map((item, index) => (
                      <tr key={index}>
                        <td>{item.custName}</td>
                        <td>{item.custContactNo}</td>
                        <td>{item.email}</td>
                        <td>{item.invoiceNo}</td>
                        <td>{item.dateTime}</td>
                        <td>{item.selectedServices?.join(", ") || "N/A"}</td>
                        <td>{item.remarks}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-white">No completed data available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Completed;
