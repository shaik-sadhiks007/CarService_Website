import React, { useState } from "react";
import './new.css';

function DashboardComp() {
  const sampleData = {
    customerId: 999,
    vehicleRegNo: "SLW3344K",
    custName: "John Pope",
    custContactNo: 89899898,
    email: "john.pope@mail.com",
    address: "BLK-126,#05-254, Tampines Street 12, Singapore - 521126",
    vehicleModel: "BMW X5",
    manufactureYear: 2020,
    vehicleColor: "Black",
    engineNo: "ZDE56533HJE",
    chasisNo: "MUBEF65733MGF56YK",
    createdBy: "Joshua How",
    createdDate: "2024-12-29T01:15:15Z",
    modifiedBy: null,
    modifiedDate: null,
  };

  const [carPlate, setCarPlate] = useState("");
  const [matchedData, setMatchedData] = useState(null);

  const handleSearch = () => {
    if (carPlate.toLowerCase() === sampleData.vehicleRegNo.toLowerCase()) {
      setMatchedData(sampleData);
    } else {
      setMatchedData(null);
    }
  };

  return (
    <div className="container-fluid">
      <h1 className="text-white">Dashboard</h1>

      <div className="text-white w-100 p-4 rounded-2" style={{backgroundColor:'#212632'}}>
        <div className="mb-4">
          <p>Search</p>
        </div>

        <div className="col-6">
          <div className="d-flex justify-content-between">
            <input
              type="text"
              className="form-control input-dashboard text-white placeholder-white"
              placeholder="Enter Car Plate"
              value={carPlate}
              onChange={(e) => setCarPlate(e.target.value)}
            />
            <button className="btn btn-warning py-2 ms-3 text-white" onClick={handleSearch}>
              Search
            </button>
          </div>
        </div>

        {matchedData && (
          <div className="table-responsive mt-4">
            <table className="table table-bordered" 
             >
              <tbody>
                <tr>
                  <th>Customer ID</th>
                  <td>{matchedData.customerId}</td>
                </tr>
                <tr>
                  <th>Vehicle Reg No</th>
                  <td>{matchedData.vehicleRegNo}</td>
                </tr>
                <tr>
                  <th>Customer Name</th>
                  <td>{matchedData.custName}</td>
                </tr>
                <tr>
                  <th>Contact No</th>
                  <td>{matchedData.custContactNo}</td>
                </tr>
                <tr>
                  <th>Email</th>
                  <td>{matchedData.email}</td>
                </tr>
                <tr>
                  <th>Address</th>
                  <td>{matchedData.address}</td>
                </tr>
                <tr>
                  <th>Vehicle Model</th>
                  <td>{matchedData.vehicleModel}</td>
                </tr>
                <tr>
                  <th>Manufacture Year</th>
                  <td>{matchedData.manufactureYear}</td>
                </tr>
                <tr>
                  <th>Vehicle Color</th>
                  <td>{matchedData.vehicleColor}</td>
                </tr>
                <tr>
                  <th>Engine No</th>
                  <td>{matchedData.engineNo}</td>
                </tr>
                <tr>
                  <th>Chasis No</th>
                  <td>{matchedData.chasisNo}</td>
                </tr>
                <tr>
                  <th>Created By</th>
                  <td>{matchedData.createdBy}</td>
                </tr>
                <tr>
                  <th>Created Date</th>
                  <td>{matchedData.createdDate}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardComp;
