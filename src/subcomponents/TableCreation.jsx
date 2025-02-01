import React from "react";

function TableCreation({ historyData }) {
  const keyMapping = {
    // Customer Info
    custName: "Customer Name",
    vehicleRegNo: "Vehicle No.",
    dateIn: "Date In",

    // Car Service Info
    technitionName: "Technician Name",
    remarks: "Remarks",
    serviceTypes: "Service Types",
  };

  const getColumnName = (key) => keyMapping[key] || key;

  // Filter the keys to only include those in keyMapping
  const filteredKeys =
    historyData.length > 0
      ? Object.keys(historyData[0]).filter((key) => key in keyMapping)
      : [];

  return (
    <div className="mt-3" style={{ overflowX: "auto" }}>
      <table className="table table-bordered">
        <thead>
          <tr>
            {filteredKeys.map((key, index) => (
              <th key={index}>{getColumnName(key)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {historyData.map((data, rowIndex) => (
            <tr key={rowIndex}>
              {filteredKeys.map((key, cellIndex) => (
                <td key={cellIndex}>
                  {key === "serviceTypes" && typeof data[key] === "string" ? (
                    <ul style={{ paddingLeft: "15px", margin: 0 }}>
                      {data[key]
                        .split(",")
                        .map((service) => service.trim())
                        .map((service, i) => (
                          <li key={i}>{service}</li>
                        ))}
                    </ul>
                  ) : (
                    data[key]
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TableCreation;
