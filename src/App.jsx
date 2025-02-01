import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import "./App.css";
import Pending from "./components/Pending";
import Completed from "./components/Completed";
import Accepted from "./components/Accepted";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddServices from "./adminComponents/AddServices";
import DataDownload from "./adminComponents/DataDownload";

function App() {
  
  return (
    <Router basename="/CarServiceUI">
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/services" element={<AddServices />} />
        <Route path="/data" element={<DataDownload />} />

        <Route
          path="/pending"
          element={<Pending  />}
        />
        <Route
          path="/completed"
          element={<Completed  />}
        />
          <Route
          path="/accepted"
          element={<Accepted  />}
        />
      </Routes>
    </Router>
  );
}

export default App;
