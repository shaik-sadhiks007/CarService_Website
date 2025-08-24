import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { CarDataContext } from "./CarDataContext";
import RightSidebar from "../sidebar/RightSidebar";
import { useTranslation } from "react-i18next";

function GuestLogin() {
    const { showOffcanvas } = useContext(CarDataContext);

    const navigate = useNavigate();

    const { t } = useTranslation()


    const handleCardClick = (role) => {
        navigate(`/form-filling?role=${role}`);
    };


    const guestItems = [
        { name: t("guest.customer"), icon: "bi-person" },
        { name: t("guest.towing"), icon: "bi-truck" },
        { name: t("guest.dealer"), icon: "bi-shop" },
        { name: t("guest.rental"), icon: "bi-car-front" },
    ];

    return (
        <div className="container-fluid">
            <div className="row">
                <div
                    className={`col-2 col-md-3 col-lg-2 p-3 `}
                    style={{
                        height: "auto",
                        minHeight: "100vh",
                        backgroundColor: "#212632",
                    }}
                >
                    <Sidebar />
                </div>
                <div className="col-12 col-md-9 col-lg-10 p-3">

                    <RightSidebar />

                    {/* Cards for selecting role */}
                    <div className="row text-center">
                        {guestItems.map((role, index) => (
                            <div key={index} className="col-md-6">
                                <div
                                    className="card p-3 mb-4 d-flex align-items-center justify-content-center"
                                    style={{ cursor: "pointer", backgroundColor: "#343a40", color: "white" }}
                                    onClick={() => handleCardClick(role.name.toLowerCase())}
                                >
                                    <i className={`bi ${role.icon} text-white`} style={{ fontSize: "2rem", marginBottom: "10px" }}></i>
                                    <h3 className="text-white text-capitalize">{role.name}</h3>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GuestLogin;
