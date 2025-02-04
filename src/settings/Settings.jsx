import React, { useContext } from 'react'
import { CarDataContext } from '../components/CarDataContext';
import Logout from '../components/Logout';
import Sidebar from '../components/Sidebar';
import { useTranslation } from 'react-i18next';

function Settings() {

    const { showOffcanvas, setShowOffcanvas } = useContext(CarDataContext);

    const toggleOffcanvas = () => {
        setShowOffcanvas(!showOffcanvas);
    };

    const { t } = useTranslation()
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
                                <h1 className="text-white">
                                    {t("menu.settings")}
                                </h1>
                            </div>
                            <Logout />
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Settings
