import React, { useContext, useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import axios from "axios";
import { CarDataContext } from "./CarDataContext";

function Accepted() {

  const { userRole,apiUrl } = useContext(CarDataContext);
  const [acceptedData, setAcceptedData] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchAcceptedCars = async () => {
      try {
        const url =
          userRole.userRole === 'admin'
          ? `${apiUrl}/api/v1/carService/getAllPendingCarServiceforAdmin`
          : `${apiUrl}/api/v1/carService/getAllPendingCarServiceforUser?technitionName=${userRole.username}`;

        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const customerData = response.data.custInformationList || [];
        const serviceData = response.data.carServiceInfromationList || [];

        // Filter the service data to include only those with status "A"
        const filteredServiceData = serviceData.filter(service => service.status === 'A');
        
        const combinedData = filteredServiceData.map((service) => {
          const customer = customerData.find((cust) => cust.customerId === service.customerId);
          return { ...service, ...customer };
        });

        setAcceptedData(combinedData);
      } catch (error) {
        console.error('Error fetching accepted cars:', error);
      }
    };

    fetchAcceptedCars();
  }, [userRole, token, apiUrl]);

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
            <h1 className="text-white">Accepted</h1>

            {acceptedData.length > 0 ? (
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
                  {acceptedData.map((item, index) => (
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
            ) : (
              <p className="text-white">No accepted data available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Accepted;
