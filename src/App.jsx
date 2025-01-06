import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import "./App.css";
import CarRegistration from "./components/CarRegistration";
import Pending from "./components/Pending";
import Completed from "./components/Completed";

function App() {

  const [carData, setCarData] = useState([]);
  console.log(carData,'cardata')

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/car-registration" element={<CarRegistration  carData={carData} setCarData={setCarData}/>} />
        <Route path="/pending" element={<Pending carData={carData} setCarData={setCarData}/>} />
        <Route path="/completed" element={<Completed carData={carData} setCarData={setCarData} />} />
      </Routes>
    </Router>
  );
}

export default App;
