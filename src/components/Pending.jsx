import React, { useContext, useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { CarDataContext } from "./CarDataContext";
import axios from "axios";
import Logout from "./Logout";

function Pending() {
  const {
    carData,
    setCarData,
    mechanics,
    userRole,
    apiUrl,
    showOffcanvas,
    setShowOffcanvas,
  } = useContext(CarDataContext);
  const [selectedCarIndex, setSelectedCarIndex] = useState(null);
  const [selectedMechanic, setSelectedMechanic] = useState("");
  const [showModal, setShowModal] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
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

        const customerData = response.data.custInformationList || [];
        const serviceData = response.data.carServiceInfromationList || [];

        // Filter the service data to include only those with status "P"
        const filteredServiceData = serviceData.filter(
          (service) => service.status === "P"
        );

        const combinedData = filteredServiceData.map((service) => {
          const customer = customerData.find(
            (cust) => cust.customerId === service.customerId
          );
          return { ...service, ...customer };
        });

        setCarData(combinedData);
      } catch (error) {
        console.error("Error fetching pending cars:", error);
      }
    };

    fetchPendingCars();
  }, [userRole, setCarData]);

  // Open Modal
  const handleAssign = (index) => {
    setSelectedCarIndex(index);
    setShowModal(true);
  };

  // Handle mechanic selection and save
  const handleSaveMechanic = () => {
    if (selectedMechanic && selectedCarIndex !== null) {
      const updatedCarData = [...carData];
      updatedCarData[selectedCarIndex] = {
        ...updatedCarData[selectedCarIndex],
        mechanic: selectedMechanic,
      };
      setCarData(updatedCarData);
      setShowModal(false);
      setSelectedMechanic("");
    }
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
                <h1 className="text-white">Pending</h1>
              </div>
              <Logout />
            </div>
            {carData.length > 0 ? (
              <div style={{ overflowX: "auto" }}>
                <table className="table table-dark table-striped ">
                  <thead>
                    <tr>
                      <th>Customer Name</th>
                      <th>Contact No</th>
                      <th>Selected Services</th>
                      <th>Status</th>
                      <th>Mechanic</th>
                      {userRole.userRole === "admin" && <th>Action</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {carData.map((car, index) => (
                      <tr key={index}>
                        <td>{car.custName}</td>
                        <td>{car.custContactNo}</td>
                        <td>{car.selectedServices?.join(", ") || "N/A"}</td>
                        <td>{car.status}</td>
                        <td>{car.mechanic || "Not Assigned"}</td>
                        {userRole.userRole === "admin" && (
                          <td>
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => handleAssign(index)}
                            >
                              Assign
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-white mt-4">No pending tasks</div>
            )}

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
