import React from "react"

function MetricCard({ title, value, change, icon }) {
  return (
    <div className="card bg-white p-3 shadow-sm">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h6 className="text-muted mb-0">{title}</h6>
        <i className={`bi ${icon} text-primary`}></i>
      </div>
      <div className="d-flex align-items-center">
        <h3 className="mb-0 me-2">{value}</h3>
        <span className={`badge ${change >= 0 ? "text-success" : "text-danger"}`}>
          {change >= 0 ? "+" : ""}
          {change}% From last month
        </span>
      </div>
    </div>
  )
}

export default MetricCard

