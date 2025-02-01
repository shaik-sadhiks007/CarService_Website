import React, { useState } from "react";
import TableCreation from "./TableCreation";

const HistoryTable = ({historyData}) => {

  const [isHistoryVisible, setIsHistoryVisible] = useState(false);

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
