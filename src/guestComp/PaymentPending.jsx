import React, { useContext, useEffect, useState } from "react";
import { CarDataContext } from "../components/CarDataContext";
import Sidebar from "../components/Sidebar";
import { useLocation, useNavigate } from "react-router-dom";
import Logout from "../components/Logout";
import { useTranslation } from "react-i18next";
import TableOne from "../subcomponents/TableOne";
import DataTable from "react-data-table-component";
import RightSidebar from "../sidebar/RightSidebar";
import axios from "axios";
import Lottie from "lottie-react";
import carLoader from "../assets/car-loader.json";
import VirtualKeyboard from "../components/VirtualKeyboard";
import { useRef } from "react";


function PaymentPending() {
    const {
        userRole,
        apiUrl,
        showOffcanvas,
    } = useContext(CarDataContext);


    const [tableData, setTableData] = useState([]);
    const [clicked, setClicked] = useState({
        click: false,
        data: {},
    });

    const [searchText, setSearchText] = useState("");

    const { t } = useTranslation();
    const navigate = useNavigate();

    const [fullData, setFullData] = useState(null);

    const [loading, setLoading] = useState(false);

    const token = localStorage.getItem("token");

    const [showKeyboard, setShowKeyboard] = useState(false);
    const [keyboardInput, setKeyboardInput] = useState("");
    const [activeInput, setActiveInput] = useState(null);
    const activeInputRef = useRef(null);

    const fetchPendingCars = async () => {
        try {
            setLoading(true);

            const urls =
                userRole.userRole === "account_admin"
                    ? [
                        `${apiUrl}/api/v1/carService/getAllCompleted`
                    ]
                    : null;

            if (urls !== null) {
                try {
                    const responses = await Promise.all(
                        urls.map(url =>
                            axios.get(url, {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            })
                        )
                    );

                    const custInformationList = responses.flatMap(response => response.data.custInformationList);
                    const carServiceInfromationList = responses.flatMap(response => response.data.carServiceInfromationList);

                    const data = {
                        custInformationList: [...custInformationList],
                        carServiceInfromationList: [...carServiceInfromationList]
                    }

                    setFullData(data)

                    console.log("Merged Customer Information List:", custInformationList);
                    console.log("Merged Car Service Information List:", carServiceInfromationList);
                    console.log(data, "full data")


                    const filteredServiceData = carServiceInfromationList.filter(
                        (service) => service.paymentStatus?.toLowerCase() == "p"
                    );

                    console.log(filteredServiceData, "filter")

                    const combinedData = filteredServiceData.map((service) => {
                        const customer = custInformationList.find(
                            (cust) => cust.customerId === service.customerId
                        );
                        return { ...customer, ...service };
                    });

                    console.log(combinedData, "combDa")



                    setTableData(sortByDate(combinedData, "desc"));
                    setLoading(false);
                } catch (error) {
                    console.error("Error fetching car service data:", error);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }




        } catch (error) {
            console.error("Error fetching accepted cars:", error);
        } finally {
            setLoading(false);
        }
    };

    const sortByDate = (data, order) => {
        return data.sort((a, b) => {
            const dateA = new Date(a.dateIn);
            const dateB = new Date(b.dateIn);
            return order === "asc" ? dateA - dateB : dateB - dateA;
        });
    };

    useEffect(() => {
        fetchPendingCars();
    }, [userRole]);


    const formatDate = (dateString) => {
        return new Intl.DateTimeFormat("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
        }).format(new Date(dateString));
    };

    const handleInputFocus = (field, value, ref) => {
        setActiveInput(field);
        setShowKeyboard(true);
        setKeyboardInput(value || "");
        if (ref) activeInputRef.current = ref;
    };
    const handleKeyboardChange = (val) => {
        setKeyboardInput(val);
        if (activeInput === "searchText") setSearchText(val);
    };
    const handleKeyboardClose = () => {
        setShowKeyboard(false);
        setActiveInput(null);
        if (activeInputRef.current) activeInputRef.current.blur();
    };

    const columns = [
        {
            name: t("pending.date"),
            id: "date",
            selector: (row) => new Date(row.dateIn),
            key: "dateIn",
            sortable: true,
            cell: (row) => formatDate(row.dateIn),
            style: {
                textAlign: "center",
            },
            width: '120px',
            center: 'true',
        },
        {
            name: t("pending.vehicleRegNo"),
            selector: (row) => row.vehicleRegNo,
            key: "vehicleRegNo",
            cell: (item) => (
                <span
                    onClick={() => setClicked({ click: true, data: item })}
                    style={{
                        color: "#ffc107",
                        textDecoration: "underline",
                        cursor: "pointer",
                    }}
                    className="text-uppercase"
                >
                    {item.vehicleRegNo || "N/A"}
                </span>
            ),
            style: {
                textAlign: "center",
            },
            width: '150px',
            sortable: true,
            center: 'true',
        },

        {
            name: t("pending.customerName"),
            selector: (row) => row.custName?.toLowerCase() || "",
            key: "custName",
            cell: (item) => (
                <span
                    className="text-capitalize"
                >
                    {item.custName || "N/A"}
                </span>
            ),
            sortable: true,
            style: {
                textAlign: "center",
            },
            width: '190px',
            center: 'true',
        },
        {
            name: t("pending.contactNo"),
            selector: (row) => row.custContactNo,
            key: "custContactNo",
            style: {
                textAlign: "center",
            },
            width: '130px',
            center: 'true',
        },
        {
            name: t("pending.services"),
            selector: (row) => row.serviceTypes,
            key: "serviceTypes",
            style: {
                textAlign: "center",
            },
            width: '200px',
            center: 'true',

            cell: (item) => (
                item.serviceTypes ? (
                    <ul className="text-center">
                        {item.serviceTypes.split(",").map((type, index) => (
                            <li key={index} className="text-start text-capitalize">{type.trim()}</li>
                        ))}
                    </ul>
                ) : (
                    "N/A"
                )
            ),
        },
        {
            name: t("pending.status"),
            selector: (row) => row.status,
            key: "status",
            style: {
                textAlign: "center",
            },
            width: '90px',
            center: 'true',
        },
        {
            name: t("pending.mechanic"),
            selector: (row) => row.technitionName || "Unassigned",
            key: "technitionName",
            style: {
                textAlign: "center",
            },
            width: '160px',
            sortable: true,
            center: 'true',
        },
        // {
        //     name: t("pending.actions"),
        //     style: {
        //         textAlign: "center",
        //     },
        //     width: '142px',
        //     center: 'true',

        //     cell: (item) =>
        //         userRole.userRole === "super_admin" ? (
        //             <button
        //                 className="btn btn-primary btn-sm"
        //                 onClick={() => handleAssign(item.vehicleRegNo)}
        //             >
        //                 Assign
        //             </button>
        //         ) : (
        //             <div className="d-flex justify-content-center">
        //                 {item.technitionName === "" ? (
        //                     <button
        //                         className="btn btn-outline-warning btn-sm me-2"
        //                         onClick={() => handleAccept(item.vehicleRegNo)}
        //                     >
        //                         <span className="fw-semibold">Assign to Me</span>
        //                     </button>
        //                 ) : (
        //                     <>
        //                         <button
        //                             className="btn btn-outline-success btn-sm me-2"
        //                             onClick={() => handleAccept(item.vehicleRegNo)}
        //                         >
        //                             <span className="fw-semibold">Accept</span>
        //                         </button>
        //                         <button
        //                             className="btn btn-outline-danger btn-sm"
        //                             onClick={() => handleReject(item.vehicleRegNo)}
        //                         >
        //                             <span className="fw-semibold">Reject</span>
        //                         </button>
        //                     </>
        //                 )}
        //             </div>
        //         ),
        // },
    ];

    const customStyles = {
        table: {
            style: {
                backgroundColor: "transparent",
            },
        },
        cells: {
            style: {
                padding: "8px",
                // border: "1px solid #555",
                textAlign: "center",
            },
        },
        headRow: {
            style: {
                backgroundColor: "transparent",
                color: "#fff",
                fontSize: "18px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                fontWeight: "bold",
            },
        },
        rows: {
            style: {
                backgroundColor: "transparent",
                color: "#fff",
                fontSize: "16px",
                borderBottom: "1px solid #444",
            },
        },
        pagination: {
            style: {
                backgroundColor: "transparent",
                color: "#fff",
                fontSize: "15px"
            },
        },

        pageButtons: {
            style: {
                color: "#fff",
            },
        },
        paginationIcon: {
            style: {
                color: "#fff",
            },
        },
    };

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

                    <RightSidebar />

                    <h1 className="text-white">{t("account_admin.paymentPendingCars")}</h1>

                    {!clicked.click ? (
                        <>
                            <div
                                className="text-white w-100 rounded-2">

                                <div className="row ">
                                    <div className="col-12 col-md-6">
                                        <input
                                            type="text"
                                            placeholder="Search by Vehicle No."
                                            value={searchText}
                                            onChange={(e) => setSearchText(e.target.value)}
                                            className="form-control mb-3 input-dashboard text-white placeholder-white"
                                            onFocus={e => handleInputFocus("searchText", searchText, e.target)}
                                        />
                                    </div>
                                </div>

                            </div>

                            {showKeyboard && (
                                <VirtualKeyboard
                                    input={keyboardInput}
                                    onChange={handleKeyboardChange}
                                    onClose={handleKeyboardClose}
                                />
                            )}

                            <DataTable
                                columns={columns}
                                data={tableData.filter((row) =>
                                    row.vehicleRegNo.toLowerCase().includes(searchText.toLowerCase())
                                )}
                                defaultSortFieldId="date"
                                defaultSortAsc={false}
                                pagination
                                // highlightOnHover
                                onSort={(column, direction) => {
                                    // Optional: handle custom sorting logic here
                                    console.log(column, direction);
                                }}
                                theme="dark"
                                customStyles={customStyles}
                            />

                            {/* <div className="my-2">
                                <button onClick={exportToExcel} className="px-4 py-2 btn btn-warning text-white mr-2 rounded me-4">
                                    {t("exportToExcel")}
                                </button>
                                <button onClick={exportToPDF} className="px-4 py-2 btn btn-warning text-white rounded">
                                    {t("exportToPdf")}

                                </button>
                            </div> */}
                        </>

                    ) : (
                        !clicked.click && (
                            <p className="text-white">No data available.</p>
                        )
                    )}

                    {clicked.click && (
                        <>
                            <TableOne
                                historyData={clicked.data}
                                edit={true}
                                setClicked={setClicked}
                                fullData={fullData}
                                refresh={fetchPendingCars}
                            />
                        </>
                    )}



                    {loading && (
                        <div className="d-flex justify-content-center align-items-center w-100 h-100">
                            <Lottie animationData={carLoader} style={{ width: 400, height: 400 }} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default PaymentPending;
