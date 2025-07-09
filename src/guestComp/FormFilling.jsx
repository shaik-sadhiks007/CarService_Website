import React, { useContext, useState } from "react";
import { CarDataContext } from "../components/CarDataContext";
import Sidebar from "../components/Sidebar";
import { useLocation, useNavigate } from "react-router-dom";
import Logout from "../components/Logout";
import { useTranslation } from "react-i18next";
import RightSidebar from "../sidebar/RightSidebar";
import DashboardComp from "../components/DashboardComp";

function FormFilling() {
    const { apiUrl, showOffcanvas, setShowOffcanvas, userRole } = useContext(CarDataContext);

    console.log(userRole,'role')
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const role = queryParams.get("role"); // Get role from query params
    const { t } = useTranslation();
    const navigate = useNavigate();

    // Define form fields dynamically based on role
    const formFields = {
        customer: [
            { name: "customerName", label: "Customer Name" },
            { name: "phoneNumber", label: "Phone Number" },
            { name: "vehicleModel", label: "Vehicle Model" },
            { name: "serviceType", label: "Repair/General Service" },
            { name: "customerRemarks", label: "Customer Complaints" }
        ],
        dealer: [
            { name: "customerName", label: "Dealer Name" },
            { name: "vehicleModel", label: "Vehicle Model" },
            { name: "customerRemarks", label: "Dealer Complaints" }
        ],
        rental: [
            { name: "customerName", label: "Rental Car Company Name" },
            { name: "phoneNumber", label: "Phone Number" },
            { name: "vehicleModel", label: "Vehicle Model" },
            { name: "customerRemarks", label: "Car Complaints" }
        ]
    };

    const selectedFields = formFields[role] || [];

    const [formData, setFormData] = useState(
        Object.fromEntries(selectedFields.map(field => [field.name, ""]))
    );

   
    return (
        <div className="container-fluid">
            <div className="row">
                <div
                    className={`col-2 col-md-3 col-lg-2 p-3 ${showOffcanvas ? "d-block" : "d-none d-md-block"}`}
                    style={{
                        height: "auto",
                        minHeight: "100vh",
                        backgroundColor: "#212632",
                    }}
                >
                    {/* Sidebar component */}
                    <Sidebar />
                </div>
                <div className="col-12 col-md-9 col-lg-10 p-3">
                    {/* Main content */}
                    {/* <RightSidebar /> */}


                    {/* <div
                        className="text-white w-100 p-4 rounded-2 mt-4"
                        style={{ backgroundColor: "#212632" }}
                    >
                        <div className="mb-4">
                            <h2 className="text-white mb-4">
                                {role === "customer"
                                    ? "Customer Form"
                                    : role === "dealer"
                                        ? "Dealer Form"
                                        : "Rental Form"}
                            </h2>
                            <div className="row">
                                {selectedFields.map(({ name, label }) => (
                                    <div className="col-12 col-md-6 mb-3" key={name}>
                                        <label className="form-label">{label}</label>
                                        <input
                                            type="text"
                                            name={name}
                                            className="form-control placeholder-white py-2"
                                            placeholder={label}
                                            value={formData[name] || ""}
                                            onChange={handleChange}
                                            disabled={userRole.userRole === "mechanic"}
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className="mt-3">
                                <button
                                    type="button"
                                    className="btn btn-outline-warning text-white"
                                    onClick={handleSubmit}
                                >
                                    {t("save")}
                                </button>
                            </div>
                        </div>
                    </div> */}

                    <DashboardComp
                        apiUrl={apiUrl}
                        setShowOffcanvas={setShowOffcanvas}
                        showOffcanvas={showOffcanvas}
                        userRole={userRole}
                        role={role}
                    />

                    <button
                        className="btn btn-outline-warning text-white mt-4"
                        onClick={() => navigate("/guest")}
                    >
                        <span className="fw-semibold">{t("back")}</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default FormFilling;
