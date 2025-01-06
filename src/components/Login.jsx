import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './style.css'; 

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // const apiUrl = process.env.REACT_APP_API_URL;
  // console.log(apiUrl,'url')

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('http://localhost:8080/CarServiceMaintenance/api/auth/login', {
        username,
        password,
      });

      if (response.data && response.data.token) {

        localStorage.setItem('token', response.data.token);
        navigate('/dashboard'); 
      }
    } catch (err) {
      setError('Invalid credentials or server error.');
    }
  };

  return (
    <div className="container-fluid login-container d-flex align-items-center justify-content-center">
      <form className="form-box" onSubmit={handleSubmit}>
        <h3 className="text-center mb-4">Login</h3>
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="mb-3">
          <input 
            type="text" 
            name="username" 
            className="form-control input-box rounded-pill px-3 py-2 fs-5" 
            placeholder="Username" 
            value={username}
            onChange={(e) => setUsername(e.target.value)} 
          />
        </div>
        <div className="mb-3">
          <input 
            type="password" 
            name="password" 
            className="form-control input-box rounded-pill px-3 py-2 fs-5" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)} 
          />
        </div>
        <button type="submit" className="btn btn-warning w-100 rounded-pill px-3 py-2 fs-5 text-white">Login</button>
        {/* Uncomment if you want a signup link */}
        {/* <div className="text-center mt-3">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </div> */}
      </form>
    </div>
  );
};

export default Login;
