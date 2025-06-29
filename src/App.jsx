import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import "./App.css";
import "./pwa.css";
import Pending from "./components/Pending";
import Completed from "./components/Completed";
import Accepted from "./components/Accepted";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddServices from "./adminComponents/AddServices";
import DataDownload from "./adminComponents/DataDownload";
import Settings from "./settings/Settings";
import PrivateRoute from "./settings/PrivateRoute";
import GuestLogin from "./components/GuestLogin";
import FormFilling from "./guestComp/FormFilling";
import PaymentPending from "./guestComp/PaymentPending";
import ReadyToDeliver from "./guestComp/ReadyToDeliver";
import PendingCars from "./guestComp/PendingCars";
import OfflineIndicator from "./components/OfflineIndicator";

function App() {

  return (
    <Router>
      <ToastContainer />
      <OfflineIndicator />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<DataDownload />} />
          {/* <Route path="/car-service-entry" element={<Dashboard />} /> */}
          <Route path="/car-service-entry" element={<GuestLogin />} />
          <Route path="/register" element={<Signup />} />
          <Route path="/services" element={<AddServices />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/pending" element={<Pending />} />
          <Route path="/completed" element={<Completed />} />
          <Route path="/accepted" element={<Accepted />} />
          <Route path="/guest" element={<GuestLogin />} />
          <Route path="/form-filling" element={<FormFilling />} />
          <Route path="/ready-to-deliver" element={<ReadyToDeliver />} />
          <Route path="/payment-pending" element={<PaymentPending />} />
          <Route path="/pending-cars" element={<PendingCars />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
