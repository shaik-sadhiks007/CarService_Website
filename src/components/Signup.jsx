import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css'; // Custom styles

const Signup = () => {
  return (
    <div className="container-fluid login-container d-flex align-items-center justify-content-center">
      <form className="form-box">
        <h3 className="text-center mb-4">Sign Up</h3>
        <div className="mb-3">
          <input type="text" className="form-control input-box rounded-pill" placeholder="User name" />
        </div>
        <div className="mb-3">
          <input type="email" className="form-control input-box rounded-pill" placeholder="Email" />
        </div>
        <div className="mb-3">
          <input type="password" className="form-control input-box rounded-pill" placeholder="Password" />
        </div>
        <button type="submit" className="btn btn-warning w-100 rounded-pill">Sign Up</button>
        <div className="text-center mt-3">
          Already have an account? <Link to="/">Login</Link>
        </div>
      </form>
    </div>
  );
};

export default Signup;
