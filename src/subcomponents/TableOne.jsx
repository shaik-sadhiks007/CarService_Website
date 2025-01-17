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

  const getMimeType = (base64String) => {
    if (base64String.startsWith("/9j/")) return "image/jpeg";
    if (base64String.startsWith("iVBORw0KGgo")) return "image/png";
    if (
      base64String.startsWith("R0lGODdh") ||
      base64String.startsWith("R0lGODlh")
    )
      return "image/gif";
    return "image/*";
  };

  const renderValue = (key, value) => {
    if ((key === "fuelLevelImage" || key === "carImage") && value) {
      const mimeType = getMimeType(value);
      return (
        <img
          src={`data:${mimeType};base64,${value}`}
          alt={key}
          style={{
            maxWidth: "150px",
            maxHeight: "100px",
            objectFit: "contain",
          }}
        />
      );
    }
    return value || "N/A";
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
                <td>{renderValue(key, historyData[key])}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default TableOne;
