import React from "react";

function TableCreation({ historyData, keyMapping }) {
    
  const getColumnName = (key) => {
    return keyMapping && keyMapping[key] ? keyMapping[key] : key;
  };

  return (
    <div className="mt-3 " style={{ overflowX: "auto" }}>
      <table className="table table-bordered">
        <thead>
          <tr>
            {historyData.length > 0 && Object.keys(historyData[0]).map((key, index) => (
              <th key={index}>{getColumnName(key)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {historyData.map((data, rowIndex) => (
            <tr key={rowIndex}>
              {Object.keys(data).map((key, cellIndex) => (
                <td key={cellIndex}>{data[key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TableCreation;
