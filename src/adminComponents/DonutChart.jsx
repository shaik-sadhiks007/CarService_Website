import React from "react"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js"
import { Doughnut } from "react-chartjs-2"

ChartJS.register(ArcElement, Tooltip, Legend)

function DonutChart({ data }) {
  const chartData = {
    labels: data.map((item) => item.label),
    datasets: [
      {
        data: data.map((item) => item.value),
        backgroundColor: ["#1a237e", "#3949ab", "#7986cb"],
        borderWidth: 0,
      },
    ],
  }

  const options = {
    cutout: "70%",
    plugins: {
      legend: {
        display: false,
      },
    },
  }

  return (
    <div className="position-relative" style={{ width: "200px", height: "200px" }}>
      <Doughnut data={chartData} options={options} />
      <div className="position-absolute top-50 start-50 translate-middle text-center">
        <h4 className="mb-0">44.330K</h4>
        <small className="text-muted">Total Value</small>
      </div>
    </div>
  )
}

export default DonutChart

