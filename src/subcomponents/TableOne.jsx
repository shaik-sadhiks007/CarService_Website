import React from "react";

function TableOne({ historyData }) {
  const keyMapping = {
    // Customer Info
    customerId: "Customer Id",
    vehicleRegNo: "Vehicle No.",
    custName: "Customer Name",
    custContactNo: "Phone Number",
    email: "Email",
    address: "Address",
    vehicleModel: "Vehicle Model",
    manufactureYear: "Manufacture Year",
    vehicleColor: "Vehicle Color",
    engineNo: "Engine No.",
    chasisNo: "Chasis No.",

    // Car Service Info
    dateIn: "Date In",
    entryType: "Entry Type",
    mileage: "Mileage",
    fuelLevel: "Fuel Level",
    fuelLevelImage: "Fuel Level Image",
    carImage: "Car Image",
    remarks: "Remarks",
    technitionName: "Technician Name",
    managerName: "Manager Name",
  };

  const getColumnName = (key) => {
    return keyMapping && keyMapping[key] ? keyMapping[key] : key;
  };

  return (
    <div className="mt-3" style={{ overflowX: "auto" }}>
      <table className="table table-bordered">
        <tbody>
          {historyData &&
            Object.keys(historyData).map((key, index) => (
              <tr key={index}>
                <td>
                  <span className="fw-bold">{getColumnName(key)}</span>
                </td>
                <td>{historyData[key] || "N/A"}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default TableOne;
