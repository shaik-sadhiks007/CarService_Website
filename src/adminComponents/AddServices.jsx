import React, { useContext, useState } from 'react';
import axios from 'axios';
import { toast } from "react-toastify";
import { CarDataContext } from '../components/CarDataContext';
import Logout from '../components/Logout';
import Sidebar from '../components/Sidebar';
import { useTranslation } from 'react-i18next';

const AddServices = () => {

    const { showOffcanvas, setShowOffcanvas, apiUrl, userRole } = useContext(CarDataContext);

    const {t} = useTranslation()

    // Token for Authorization header (use your actual token)
    const token = localStorage.getItem("token");

    // State for the service category
    const [serviceCategory, setServiceCategory] = useState('');

    // Form validation and API call
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation for the serviceCategory field
        if (!serviceCategory) {
            toast.error('Please enter a service category');
            return;
        }

        try {
            const response = await axios.post(
                `${apiUrl}/api/v1/carService/add-servicetypes`,
                {
                    serviceCategory,
                    active: true,
                    createdBy: userRole.username,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            toast.success('Service added successfully');
            setServiceCategory("")

        } catch (err) {
            toast.error('Failed to add service. Please try again.');
            console.error('Error adding service:', err);
        }
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
                                <h1 className="text-white">{t("menus.addServices")}</h1>
                            </div>
                            <Logout />
                        </div>

                        <div
                            className="text-white w-100 p-4 rounded-2"
                            style={{ backgroundColor: "#212632" }}
                        >
                            <div className="mb-4">
                                <label htmlFor="serviceCategory" className="form-label">
                                    {t("serviceCategory")}
                                </label>
                                <div className="col-12 col-md-9 col-lg-6 d-flex">
                                    <input
                                        id="serviceCategory"
                                        type="text"
                                        className="form-control input-dashboard text-white placeholder-white"
                                        placeholder={t("serviceCategory")}
                                        value={serviceCategory}
                                        onChange={(e) => setServiceCategory(e.target.value)}
                                    />
                                    <button
                                        className="btn btn-outline-warning text-white py-2 ms-3"
                                        onClick={handleSubmit}
                                    >
                                        {t("signup.submit")}
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddServices;
