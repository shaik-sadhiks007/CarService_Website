import React from "react"
import MetricCard from "./MetricCard"
import DonutChart from "./DonutChart"
import RevenueList from "./RevenueList"

const metrics = [
  {
    title: "Revenue",
    value: "100,750,000",
    change: 2.1,
    icon: "bi-currency-dollar",
  },
  {
    title: "Car",
    value: "350",
    change: -0.5,
    icon: "bi-car-front",
  },
  {
    title: "Job Order",
    value: "300",
    change: -0.5,
    icon: "bi-clipboard",
  },
  {
    title: "Panel Average",
    value: "4.8",
    change: 1,
    icon: "bi-grid",
  },
]

const repairData = [
  { label: "Auto Repair A", value: 44, revenue: 44330000 },
  { label: "Auto Repair B", value: 32, revenue: 32240000 },
  { label: "Auto Repair C", value: 24, revenue: 24180000 },
]

function AdminPage() {
  return (
    <div className="container-fluid p-4">
      <div className="row g-3 mb-4">
        {metrics.map((metric, index) => (
          <div key={index} className="col-md-3">
            <MetricCard {...metric} />
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-body">
          <h6 className="text-muted mb-4">AUTO REPAIR (%)</h6>
          <div className="d-flex">
            <DonutChart data={repairData} />
            <RevenueList
              items={repairData.map((item) => ({
                label: item.label,
                percentage: item.value,
                amount: item.revenue,
              }))}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminPage

