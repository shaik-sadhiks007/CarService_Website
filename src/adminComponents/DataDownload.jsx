import React, { useContext, useState } from 'react';
import axios from 'axios';
import { toast } from "react-toastify";
import { CarDataContext } from '../components/CarDataContext';
import Logout from '../components/Logout';
import Sidebar from '../components/Sidebar';
import AdminPage from './AdminPage';
import { useTranslation } from 'react-i18next';

const DataDownload = () => {

    const {t} = useTranslation()

    const { showOffcanvas, setShowOffcanvas, apiUrl, dashboard } = useContext(CarDataContext);

    // Token for Authorization header (use your actual token)
    const token = localStorage.getItem("token");

    // Form validation and API call
    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log(object)
    };

    const toggleOffcanvas = () => {
        setShowOffcanvas(!showOffcanvas);
    };

    return (
        <div className="container-fluid">
            <div className="row">
                <div
                    className={`col-2 col-md-3 col-lg-2 p-3 ${showOffcanvas ? "d-block" : "d-none d-md-block"
                        }`}
                    style={{
                        height: "auto",
                        minHeight: "100vh",
                        backgroundColor: "#212632",
                    }}
                >
                    <Sidebar />

                </div>

                <div className="col-12 col-md-9 col-lg-10 p-3">
                    <div className="container-fluid">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <div className="d-flex">
                                <div
                                    className="d-md-none me-2"
                                    onClick={toggleOffcanvas}
                                    style={{ cursor: "pointer" }}
                                >
                                    <i className="bi bi-list text-light fs-2"></i>
                                </div>
                                <h1 className="text-white">{t("menus.dataDownload")}</h1>
                            </div>
                            <Logout />
                        </div>

                        <div
                            className="text-white w-100 p-4 rounded-2"
                            style={{ backgroundColor: "#212632" }}
                        >

                            <AdminPage/>


                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default DataDownload;
