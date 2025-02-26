import React, { useContext } from 'react'
import Logout from '../components/Logout'
import { CarDataContext } from '../components/CarDataContext';

function RightSidebar() {

    const { showOffcanvas, setShowOffcanvas } = useContext(CarDataContext);

    const toggleOffcanvas = () => {
        setShowOffcanvas(!showOffcanvas);
    };

    return (
        <div className="">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="d-flex align-items-center">
                    <span
                        className="d-md-none me-2"
                        onClick={toggleOffcanvas}
                        style={{ cursor: "pointer" }}
                    >
                        <i className="bi bi-list text-light fs-2"></i>
                    </span>
                    <span className="text-warning fs-1 custom-heading text-uppercase fw-bold">Icon Technik Pte Ltd</span>
                </div>
                <Logout />
            </div>
        </div>
    )
}

export default RightSidebar
