import React from "react"

function RevenueList({ items }) {
  return (
    <div className="ms-4">
      <h6 className="text-muted mb-3">REVENUE</h6>
      {items.map((item, index) => (
        <div key={index} className="d-flex justify-content-between mb-2">
          <div>
            <span className="me-2">{item.label}</span>
            <span className="text-muted">({item.percentage}%)</span>
          </div>
          <span>{item.amount.toLocaleString()}</span>
        </div>
      ))}
    </div>
  )
}

export default RevenueList

