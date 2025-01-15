import React, { useContext, useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import axios from "axios";
import { CarDataContext } from "./CarDataContext";
import Logout from "./Logout";
import { toast } from "react-toastify";
import TableOne from "../subcomponents/TableOne";

function Accepted() {
  const { userRole, apiUrl, showOffcanvas, setShowOffcanvas } =
    useContext(CarDataContext);
  const [acceptedData, setAcceptedData] = useState([]);

  const [clicked, setClicked] = useState({
    click: false,
    data: {},
  });

  const token = localStorage.getItem("token");

  const [fullData, setFullData] = useState(null);

  const fetchAcceptedCars = async () => {
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

      setFullData(response.data);

      const customerData = response.data.custInformationList || [];
      const serviceData = response.data.carServiceInfromationList || [];

      // Filter the service data to include only those with status "A"
      const filteredServiceData = serviceData.filter(
        (service) => service.status === "A"
      );

      const combinedData = filteredServiceData.map((service) => {
        const customer = customerData.find(
          (cust) => cust.customerId === service.customerId
        );
        return { ...service, ...customer };
      });

      setAcceptedData(combinedData);
    } catch (error) {
      console.error("Error fetching accepted cars:", error);
    }
  };

  useEffect(() => {
    fetchAcceptedCars();
  }, [userRole]);

  const toggleOffcanvas = () => {
    setShowOffcanvas(!showOffcanvas);
  };

  const handleComplete = async (vehicle) => {
    const cuInfo = fullData.custInformationList.find(
      (item) => item.vehicleRegNo === vehicle
    );
    const carInfo = fullData.carServiceInfromationList.find(
      (item) => item.vehicleRegNo === vehicle
    );

    const data = {
      custInformation: cuInfo,
      carServiceInfromation: { ...carInfo, status: "D" },
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
      fetchAcceptedCars();
      toast.success("Completed successfully!");
    } catch (error) {
      toast.error("Failed to Complete. Please try again.");
      console.error(error);
    }
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
                <h1 className="text-white">Accepted</h1>
              </div>
              <Logout />
            </div>

            {acceptedData.length > 0 && !clicked.click ? (
              <div style={{ overflowX: "auto" }}>
                <table className="table table-bordered text-center">
                  <thead>
                    <tr>
                      <th>Customer Name</th>
                      <th>Contact No</th>
                      <th>Email</th>
                      <th>Invoice No</th>
                      <th>Date & Time</th>
                      <th>Selected Services</th>
                      <th>Remarks</th>
                      {userRole.userRole == "user" && <th>Action</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {acceptedData.map((item, index) => (
                      <tr key={index}>
                        <td>
                          <span
                            onClick={() => setClicked({ click: true, data: item })}
                            style={{
                              color: "blue",
                              textDecoration: "underline",
                              cursor: "pointer",
                            }}
                          >
                            {item.custName}
                          </span>
                        </td>
                        <td>{item.custContactNo}</td>
                        <td>{item.email}</td>
                        <td>{item.invoiceNo}</td>
                        <td>{item.dateTime}</td>
                        <td>{item.selectedServices?.join(", ") || "N/A"}</td>
                        <td>{item.remarks}</td>
                        <td>
                          <button
                            className="btn btn-outline-success text-white fw-semibold"
                            onClick={() => handleComplete(item.vehicleRegNo)}
                          >
                            Completed
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              !clicked.click && (
                <p className="text-white">No accepted data available.</p>
              )
            )}
            {clicked.click && (
              <>
                <TableOne historyData={clicked.data} />
                <button
                  className="btn btn-outline-warning text-white"
                  onClick={() => setClicked({ click: false, data: {} })}
                >
                  <span className="fw-semibold">Back</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Accepted;
