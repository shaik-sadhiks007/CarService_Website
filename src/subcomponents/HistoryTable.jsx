import React, { useState } from "react";
import TableCreation from "./TableCreation";

const HistoryTable = () => {

  const [isHistoryVisible, setIsHistoryVisible] = useState(false);

  const historyData = [
    {
      customerName: "John Doe",
      contactNo: "+1234567890",
      services: "Oil Change, Air Filter Replacement",
      address: "123 Main St, City",
      remarks: "Good condition",
      technitionName: "Mike",
      email: "john@gmail.com",
    },
    {
      customerName: "John Doe",
      contactNo: "+1234567890",
      services: "Tire Rotation",
      address: "123 Main St, City",
      remarks: "Requires inspection",
      technitionName: "Josuha",
      email: "john@gmail.com",
    },
  ];

  const toggleHistory = () => {
    setIsHistoryVisible(!isHistoryVisible);
  };

  return (
    <div>
      <div
        className="mt-4"
        onClick={toggleHistory}
        style={{ cursor: "pointer" }}
      >
        <div className="d-flex align-items-center">
          <p className="mb-0 fs-3 me-1">History</p>
          <span className="mt-2">
            <i
              className={`mb-0 ${
                isHistoryVisible
                  ? "bi bi-caret-up-fill"
                  : "bi bi-caret-down-fill"
              }`}
            ></i>
          </span>
        </div>
      </div>

      {/* History table */}
      {isHistoryVisible && <TableCreation historyData={historyData} />}
    </div>
  );
};

export default HistoryTable;
