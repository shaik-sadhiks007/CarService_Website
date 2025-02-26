import "bootstrap/dist/css/bootstrap.min.css"
import { Line, Bar, Pie } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend)

function NewDashboard() {
  // Service Trends Data
  const lineData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Services",
        data: [300, 400, 350, 500, 450, 600],
        borderColor: "#ffc107",
        tension: 0.4,
        fill: false,
      },
    ],
  }

  // Service Types Data
  const barData = {
    labels: ["Oil Filters", "Brake Pads", "Batteries"],
    datasets: [
      {
        label: "Service Count",
        data: [120, 90, 60],
        backgroundColor: "#dc3545",
      },
    ],
  }

  // Service Distribution Data
  const pieData = {
    labels: ["Maintenance", "Repairs", "Diagnostics"],
    datasets: [
      {
        data: [40, 30, 30],
        backgroundColor: ["#28a745", "#fd7e14", "#6f42c1"],
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#fff",
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "#fff",
        },
      },
      y: {
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "#fff",
        },
      },
    },
  }

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#fff",
        },
      },
    },
  }

  return (
    <div className="min-vh-100 bg-dark text-white py-4">
      <div className="container">
        <h1 className="text-center mb-4">Automotive Service Dashboard</h1>

        {/* Metric Cards */}
        <div className="row g-4 mb-4">
          <div className="col-md-6 col-lg-3">
            <div className="card bg-secondary text-white h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h6 className="card-subtitle mb-2">Total Cars in Service</h6>
                    <h2 className="card-title mb-0">1,250</h2>
                  </div>
                  <i className="bi bi-car-front fs-4 text-info"></i>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-3">
            <div className="card bg-secondary text-white h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h6 className="card-subtitle mb-2">Total Services Completed</h6>
                    <h2 className="card-title mb-0">3,420</h2>
                  </div>
                  <i className="bi bi-wrench fs-4 text-info"></i>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-3">
            <div className="card bg-secondary text-white h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h6 className="card-subtitle mb-2">Pending Services</h6>
                    <h2 className="card-title mb-0">120</h2>
                  </div>
                  <i className="bi bi-clock fs-4 text-info"></i>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-3">
            <div className="card bg-secondary text-white h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h6 className="card-subtitle mb-2">Parts Inventory Value</h6>
                    <h2 className="card-title mb-0">$275,000</h2>
                  </div>
                  <i className="bi bi-currency-dollar fs-4 text-info"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="row g-4">
          <div className="col-md-12 col-lg-4">
            <div className="card bg-secondary text-white h-100">
              <div className="card-body">
                <h5 className="card-title">Service Trends (6 Months)</h5>
                <div style={{ height: "300px" }}>
                  <Line data={lineData} options={chartOptions} />
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-12 col-lg-4">
            <div className="card bg-secondary text-white h-100">
              <div className="card-body">
                <h5 className="card-title">Car Service Types</h5>
                <div style={{ height: "300px" }}>
                  <Bar data={barData} options={chartOptions} />
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-12 col-lg-4">
            <div className="card bg-secondary text-white h-100">
              <div className="card-body">
                <h5 className="card-title">Service Type Distribution</h5>
                <div style={{ height: "300px" }}>
                  <Pie data={pieData} options={pieOptions} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewDashboard


