import React, { useContext, useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { CarDataContext } from "./CarDataContext";
import axios from "axios";
import Logout from "./Logout";
import { toast } from "react-toastify";
import TableOne from "../subcomponents/TableOne";
import Pagination from "../subcomponents/Pagination";

function Pending() {
  const {
    mechanics,
    userRole,
    apiUrl,
    showOffcanvas,
    setShowOffcanvas,
    fetchMechanics,
    calculateItemsPerPage,
  } = useContext(CarDataContext);
  const [sortedData, setSortedData] = useState([]);
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedCarIndex, setSelectedCarIndex] = useState(null);
  const [selectedMechanic, setSelectedMechanic] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [clicked, setClicked] = useState({
    click: false,
    data: {},
  });
  const [fullData, setFullData] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(calculateItemsPerPage);

  const token = localStorage.getItem("token");

  const fetchPendingCars = async () => {
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

      const filteredServiceData = serviceData.filter((service) =>
        ["P", "R"].includes(service.status)
      );

      const combinedData = filteredServiceData.map((service) => {
        const customer = customerData.find(
          (cust) => cust.customerId === service.customerId
        );
        return { ...customer, ...service };
      });

      setSortedData(sortByDate(combinedData, "desc"));

    } catch (error) {
      console.error("Error fetching pending cars:", error);
    }
  };

  const sortByDate = (data, order) => {
    return data.sort((a, b) => {
      const dateA = new Date(a.dateIn);
      const dateB = new Date(b.dateIn);
      return order === "asc" ? dateA - dateB : dateB - dateA;
    });
  };

  useEffect(() => {
    fetchPendingCars();
    const handleResize = () => {
      setItemsPerPage(calculateItemsPerPage());
    };
    if (userRole.userRole == "admin") {
      fetchMechanics();
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [userRole]);

  // Open Modal
  const handleAssign = (vehicle) => {
    setSelectedCarIndex(vehicle);
    setShowModal(true);
  };

  const handleSaveMechanic = async () => {
    if (selectedMechanic && selectedCarIndex !== null) {
      const cuInfo = fullData.custInformationList.find(
        (item) => item.vehicleRegNo === selectedCarIndex
      );
      const carInfo = fullData.carServiceInfromationList.find(
        (item) => item.vehicleRegNo === selectedCarIndex
      );

      const data = {
        custInformation: cuInfo,
        carServiceInfromation: { ...carInfo, technitionName: selectedMechanic },
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

        fetchPendingCars();
        setSelectedMechanic("");
        setShowModal(false);
        toast.success("Assigned successfully!");
      } catch (error) {
        toast.error("Failed to Assign. Please try again.");
        console.error(error);
      }
    }
  };

  const toggleOffcanvas = () => {
    setShowOffcanvas(!showOffcanvas);
  };

  const formatDate = (dateString) => {
    return new Intl.DateTimeFormat("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(dateString));
  };

  const toggleSortOrder = () => {
    const newOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newOrder);
    setSortedData(sortByDate([...sortedData], newOrder));
  };

  const handleAccept = async (vehicle) => {
    
    const cuInfo = fullData.custInformationList.find(
      (item) => item.vehicleRegNo === vehicle
    );
    const carInfo = fullData.carServiceInfromationList.find(
      (item) => item.vehicleRegNo === vehicle
    );

    const data = {
      custInformation: cuInfo,
      carServiceInfromation: { ...carInfo, status: "A" },
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
      fetchPendingCars();
      toast.success("Accepted successfully!");
    } catch (error) {
      toast.error("Failed to Accept service information. Please try again.");
      console.error(error);
    }
  };

  const handleReject = async (vehicle) => {
    const cuInfo = fullData.custInformationList.find(
      (item) => item.vehicleRegNo === vehicle
    );
    const carInfo = fullData.carServiceInfromationList.find(
      (item) => item.vehicleRegNo === vehicle
    );

    const data = {
      custInformation: cuInfo,
      carServiceInfromation: { ...carInfo, status: "R" },
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
      fetchPendingCars();
      toast.success("Rejected successfully!");
    } catch (error) {
      toast.error("Failed to reject service information. Please try again.");
      console.error(error);
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
                <h1 className="text-white">Pending</h1>
              </div>
              <Logout />
            </div>

            <div>
              {sortedData.length > 0 && !clicked.click ? (
                <div style={{ overflowX: "auto" }}>
                  <table className="table table-bordered text-center">
                    <thead>
                      <tr>
                        <th
                          onClick={toggleSortOrder}
                          style={{ cursor: "pointer" }}
                        >
                          Date{" "}
                          <i
                            className={` mt-4 bi bi-caret-${
                              sortOrder === "asc" ? "up-fill " : "down-fill"
                            }`}
                          ></i>
                        </th>
                        <th>Customer Name</th>
                        <th>Contact No</th>
                        <th>Services</th>
                        <th>Status</th>
                        <th>Mechanic</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(() => {
                        let lastDate = null;
                        return paginatedData.map((item, index) => {
                          const currentDate = formatDate(item.dateIn);
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
                              <td>
                                <span
                                  onClick={() =>
                                    setClicked({ click: true, data: item })
                                  }
                                  style={{
                                    color: "#ffc107",
                                    textDecoration: "underline",
                                    cursor: "pointer",
                                  }}
                                >
                                  {item.custName || "N/A"}
                                </span>
                              </td>
                              <td>{item.custContactNo}</td>
                              <td>{item.serviceTypes || "N/A"}</td>
                              <td>{item.status}</td>
                              <td>{item.technitionName || "Not Assigned"}</td>
                              {userRole.userRole === "admin" && (
                                <td>
                                  <button
                                    className="btn btn-primary btn-sm"
                                    onClick={() =>
                                      handleAssign(item.vehicleRegNo)
                                    }
                                  >
                                    Assign
                                  </button>
                                </td>
                              )}
                              {userRole.userRole === "user" && (
                                <td>
                                  <div className="d-flex justify-content-center">
                                    <button
                                      className="btn btn-success btn-sm me-2 "
                                      onClick={() =>
                                        handleAccept(item.vehicleRegNo)
                                      }
                                    >
                                      <span className="fw-semibold">
                                        Accept
                                      </span>
                                    </button>
                                    <button
                                      className="btn btn-danger btn-sm"
                                      onClick={() =>
                                        handleReject(item.vehicleRegNo)
                                      }
                                    >
                                      <span className="fw-semibold">
                                        Reject
                                      </span>
                                    </button>
                                  </div>
                                </td>
                              )}
                            </tr>
                          );
                        });
                      })()}
                    </tbody>
                  </table>

                  {sortedData.length > itemsPerPage && (
                    <div
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <div
                        className=""
                        style={{
                          position: "absolute",
                          bottom: "0%",
                        }}
                      >
                        <Pagination
                          totalItems={sortedData.length}
                          itemsPerPage={itemsPerPage}
                          currentPage={currentPage}
                          onPageChange={handlePageChange}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                !clicked.click && (
                  <div className="text-white mt-4">No pending tasks</div>
                )
              )}

              {clicked.click && (
                <>
                  <TableOne historyData={clicked.data} setClicked={setClicked}/>
                </>
              )}
            </div>

            {/* Modal */}
            {showModal && (
              <div className="modal d-block" tabIndex="-1" role="dialog">
                <div className="modal-dialog" role="document">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">Assign Mechanic</h5>
                      <button
                        type="button"
                        className="btn-close"
                        onClick={() => setShowModal(false)}
                      ></button>
                    </div>
                    <div className="modal-body">
                      <select
                        className="form-select"
                        value={selectedMechanic}
                        onChange={(e) => setSelectedMechanic(e.target.value)}
                      >
                        <option value="">Select Mechanic</option>
                        {mechanics.map((mechanic, index) => (
                          <option key={index} value={mechanic.username}>
                            {mechanic.username}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleSaveMechanic}
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setShowModal(false)}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Pending;
