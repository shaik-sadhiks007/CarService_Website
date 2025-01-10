import React, { useContext } from "react";
import Sidebar from "./Sidebar";
import { CarDataContext } from "./CarDataContext";

function Completed() {

  const { carData } = useContext(CarDataContext);
  
  const completedData = carData.filter((item) => item.status === "D");

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
            <h1 className="text-white">Completed</h1>

            {completedData.length > 0 ? (
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
                      <td>{item.selectedServices.join(", ")}</td>
                      <td>{item.remarks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
