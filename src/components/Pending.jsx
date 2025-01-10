import React, { useContext, useState } from 'react';
import Sidebar from './Sidebar';
import { CarDataContext } from './CarDataContext';

function Pending() {
  
  const { carData, setCarData } = useContext(CarDataContext);
  const [selectedCarIndex, setSelectedCarIndex] = useState(null);
  const [selectedMechanic, setSelectedMechanic] = useState(""); 
  const [showModal, setShowModal] = useState(false); 

  const mechanics = ["John Doe", "Jane Smith", "Alex Brown"]; 

  // Filter data with status "P"
  const pendingCars = carData.filter((car) => car.status === "P");

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
        mechanic: selectedMechanic, // Add assigned mechanic
      };
      setCarData(updatedCarData); // Update car data
      setShowModal(false); // Close modal
      setSelectedMechanic(""); // Reset mechanic selection
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div
          className="col-2 p-3"
          style={{ height: 'auto', minHeight: '100vh', backgroundColor: '#212632' }}
        >
          <Sidebar />
        </div>
        <div className="col-10">
          <div className="container-fluid">
            <h1 className="text-white">Pending</h1>
            {pendingCars.length > 0 ? (
              <table className="table table-dark table-striped mt-4">
                <thead>
                  <tr>
                    <th>Customer Name</th>
                    <th>Contact No</th>
                    <th>Selected Services</th>
                    <th>Status</th>
                    <th>Mechanic</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingCars.map((car, index) => (
                    <tr key={index}>
                      <td>{car.custName}</td>
                      <td>{car.custContactNo}</td>
                      <td>{car.selectedServices.join(", ")}</td>
                      <td>{car.status}</td>
                      <td>{car.mechanic || "Not Assigned"}</td>
                      <td>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => handleAssign(index)}
                        >
                          Assign
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
                          <option key={index} value={mechanic}>
                            {mechanic}
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
