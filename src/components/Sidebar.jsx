import { jwtDecode } from "jwt-decode";
import { useLocation, Link } from "react-router-dom"; 

function Sidebar() {
  const location = useLocation(); 

  const decodeToken = jwtDecode(localStorage.getItem('token'));


  return (
    <>
      <div className="profile mb-4 d-flex align-items-center">
        <img
          src="https://via.placeholder.com/40"
          alt="profile"
          className="rounded-circle me-2"
        />
        <span className="text-white fs-4 mb-0 text-capitalize">Hi {decodeToken.sub}</span>
      </div>

      <ul className="nav nav-pills flex-column mb-auto">
        <li
          className={`nav-item my-2 rounded-2 ${
            location.pathname === "/dashboard" ? "active" : ""
          }`}
          style={{
            backgroundColor:
              location.pathname === "/dashboard" ? "#FFC107" : "#2E3543",
            color: location.pathname === "/dashboard" ? "#000" : "#fff",
          }}
        >
          <Link
            to="/dashboard"
            className="nav-link d-flex align-items-center"
            style={{ color: "inherit" }}
          >
            <i className="bi bi-grid-1x2-fill me-2"></i>
            Car Service Entry
          </Link>
        </li>
        <li
          className={`nav-item my-2 rounded-2 ${
            location.pathname === "/car-registration" ? "active" : ""
          }`}
          style={{
            backgroundColor:
              location.pathname === "/car-registration" ? "#FFC107" : "#2E3543",
            color: location.pathname === "/car-registration" ? "#000" : "#fff",
          }}
        >
          <Link
            to="/car-registration"
            className="nav-link d-flex align-items-center"
            style={{ color: "inherit" }}
          >
            <i className="bi bi-car-front-fill me-2 fw-semibold"></i>
            <span className="fw-semibold">Car Registration</span>
          </Link>
        </li>
        <li
          className={`nav-item my-2 rounded-2 ${
            location.pathname === "/pending" ? "active" : ""
          }`}
          style={{
            backgroundColor:
              location.pathname === "/pending" ? "#FFC107" : "#2E3543",
            color: location.pathname === "/pending" ? "#000" : "#fff",
          }}
        >
          <Link
            to="/pending"
            className="nav-link d-flex align-items-center"
            style={{ color: "inherit" }}
          >
            <i className="bi bi-hourglass-split me-2 fw-semibold"></i>
            <span className="fw-semibold">Pending</span>
          </Link>
        </li>
        <li
          className={`nav-item my-2 rounded-2 ${
            location.pathname === "/completed" ? "active" : ""
          }`}
          style={{
            backgroundColor:
              location.pathname === "/completed" ? "#FFC107" : "#2E3543",
            color: location.pathname === "/completed" ? "#000" : "#fff",
          }}
        >
          <Link
            to="/completed"
            className="nav-link d-flex align-items-center"
            style={{ color: "inherit" }}
          >
            <i className="bi bi-check-circle-fill me-2 fw-semibold"></i>
            <span className="fw-semibold">Completed</span>
          </Link>
        </li>
        <li
          className={`nav-item my-2 rounded-2 ${
            location.pathname === "/accepted" ? "active" : ""
          }`}
          style={{
            backgroundColor:
              location.pathname === "/accepted" ? "#FFC107" : "#2E3543",
            color: location.pathname === "/accepted" ? "#000" : "#fff",
          }}
        >
          <Link
            to="/accepted"
            className="nav-link d-flex align-items-center"
            style={{ color: "inherit" }}
          >
            <i className="bi bi-gear-fill me-2 fw-semibold"></i>
            <span className="fw-semibold">Accepted</span>
          </Link>
        </li>
      </ul>
    </>
  );
}

export default Sidebar;
