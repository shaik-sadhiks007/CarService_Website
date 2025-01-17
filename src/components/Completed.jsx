import React, { useContext, useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { CarDataContext } from "./CarDataContext";
import axios from "axios";
import Logout from "./Logout";
import TableOne from "../subcomponents/TableOne";

function Completed() {
  const { userRole, apiUrl, showOffcanvas, setShowOffcanvas,carData } =
    useContext(CarDataContext);
  const [completedData, setCompletedData] = useState([]);
  const [sortedData, setSortedData] = useState([]);
  const [sortOrder, setSortOrder] = useState("desc"); 
  const token = localStorage.getItem("token");

  const [clicked, setClicked] = useState({
    click: false,
    data: {},
  });

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
        return { ...customer, ...service };
      });

      setCompletedData(combinedData);
      setSortedData(sortByDate(carData, "desc")); 

      // setSortedData(sortByDate(combinedData, "desc")); 
    } catch (error) {
      console.error("Error fetching completed cars:", error);
    }
  };

  useEffect(() => {
    fetchCompletedCars();
  }, [userRole]);

  const sortByDate = (data, order) => {
    return data.sort((a, b) => {
      const dateA = new Date(a.modifiedDate);
      const dateB = new Date(b.modifiedDate);
      return order === "asc" ? dateA - dateB : dateB - dateA;
    });
  };

  const toggleSortOrder = () => {
    const newOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newOrder);
    setSortedData(sortByDate([...sortedData], newOrder));
  };

  const formatDate = (dateString) => {
    return new Intl.DateTimeFormat("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(dateString));
  };

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

            {sortedData.length > 0 && !clicked.click ? (
              <div style={{ overflowX: "auto" }}>
                <table className="table table-bordered text-center">
                  <thead>
                    <tr>
                      <th onClick={toggleSortOrder} style={{ cursor: "pointer" }}>
                        Date{" "}
                        <i
                          className={` mt-4 bi bi-caret-${
                            sortOrder === "asc" ? "up-fill " : "down-fill"
                          }`}
                        ></i>
                      </th>
                      <th>Customer Name</th>
                      <th>Contact No</th>
                      <th>Email</th>
                      <th>Vehicle No.</th>
                      <th>Services</th>
                      <th>Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      let lastDate = null;
                      return sortedData.map((item, index) => {
                        const currentDate = formatDate(item.modifiedDate);
                        const showDate = currentDate !== lastDate;
                        lastDate = currentDate;
                        return (
                          <tr key={index}>
                            <td>
                              {showDate && (
                                <span className="badge bg-danger">
                                  {currentDate}
                                </span>
                              )}
                            </td>
                            <td>{item.custName || "N/A"}</td>
                            <td>{item.custContactNo || "N/A"}</td>
                            <td>{item.email || "N/A"}</td>
                            <td>
                              <span className="badge bg-primary">
                                {item.vehicleRegNo || "N/A"}
                              </span>
                            </td>
                            <td>
                              <span className="badge bg-danger">
                                {item.serviceTypes || "N/A"}
                              </span>
                            </td>
                            <td>{item.remarks || "N/A"}</td>
                          </tr>
                        );
                      });
                    })()}
                  </tbody>
                </table>
              </div>
            ) : (
              !clicked.click && (
                <p className="text-white">No completed data available.</p>
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

export default Completed;
