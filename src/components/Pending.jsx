import React, { useContext, useState, useEffect, lazy } from "react";
import Sidebar from "./Sidebar";
import { CarDataContext } from "./CarDataContext";
import axios from "axios";
import Logout from "./Logout";
import { toast } from "react-toastify";
import DataTable from 'react-data-table-component';
import TableOne from "../subcomponents/TableOne";
import Lottie from "lottie-react";
import carLoader from "../assets/car-loader.json";
import carLoader2 from "../assets/car-loader2.json";
import { useTranslation } from "react-i18next";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import headerIcon from '../assets/header.png'

function Pending() {
  const {
    mechanics,
    userRole,
    apiUrl,
    showOffcanvas,
    setShowOffcanvas,
    fetchMechanics,
    calculateItemsPerPage,
    setDashboard
  } = useContext(CarDataContext);

  const [tableData, setTableData] = useState([]);
  const [selectedCarIndex, setSelectedCarIndex] = useState(null);
  const [selectedMechanic, setSelectedMechanic] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [clicked, setClicked] = useState({
    click: false,
    data: {},
  });

  const { t } = useTranslation()
  const [fullData, setFullData] = useState(null);

  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const fetchPendingCars = async () => {
    try {

      setLoading(true);
      const url = `${apiUrl}/api/v1/carService/getAllPendingCarServiceforAdmin`;

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setFullData(response.data);

      if (userRole.userRole?.toLowerCase() === "admin") {
        console.log("hi admin")
        const customerData = response.data.custInformationList || [];
        const serviceData = response.data.carServiceInfromationList || [];

        const filteredServiceData = serviceData.filter((service) =>
          ["P", "R"].includes(service.status)
        );

        const combinedData = filteredServiceData.map((service) => {
          const customer = customerData.find(
            (cust) => cust.customerId === service.customerId
          );
          return { ...customer, ...service };
        });


        // setTableData(combinedData);


        setDashboard((prevState) => ({
          ...prevState,
          pending: combinedData.length
        }));
        setTableData(sortByDate(combinedData, "desc"));

        setLoading(false);

        // setSortedData(sortByDate(combinedData, "desc"));
      } else {
        const customerData = response.data.custInformationList || [];
        const serviceData = response.data.carServiceInfromationList || [];
        const filteredServiceData = serviceData.filter((service) => {

          return (
            (service.status?.toLowerCase() === "p" || service.status?.toLowerCase() === "r") &&
            (service.technitionName?.toLowerCase() === userRole.username?.toLowerCase() ||
              service.technitionName?.toLowerCase() === "")
          );
        });

        const prioritizedServiceData = [
          ...filteredServiceData.filter(
            (service) => service.technitionName?.toLowerCase() === userRole.username?.toLowerCase()
          ),
          ...filteredServiceData.filter(
            (service) => service.technitionName?.toLowerCase() === ""
          ),
        ];
        const combinedData = prioritizedServiceData.map((service) => {
          const customer = customerData.find(
            (cust) => cust.customerId === service.customerId
          );
          return { ...customer, ...service };
        });


        setDashboard((prevState) => ({
          ...prevState,
          pending: combinedData.length
        }));

        setTableData(sortByDate(combinedData, "desc"))

        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching pending cars:", error);
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

    if (userRole.userRole == "admin") {
      fetchMechanics();
    }

  }, [userRole]);

  // Open Modal
  const handleAssign = (vehicle) => {
    setSelectedCarIndex(vehicle);
    setShowModal(true);
  };

  const handleSaveMechanic = async () => {
    if (selectedMechanic && selectedCarIndex !== null) {
      const cuInfo = fullData.custInformationList.find(
        (item) => item.vehicleRegNo === selectedCarIndex
      );
      const carInfo = fullData.carServiceInfromationList.find(
        (item) => item.vehicleRegNo === selectedCarIndex
      );

      const data = {
        custInformation: cuInfo,
        carServiceInfromation: { ...carInfo, technitionName: selectedMechanic },
      };

      if (navigator.onLine) {
        // User is online, make API call
        try {
          await axios.post(
            `${apiUrl}/api/v1/carService/saveServiceInformation`,
            data,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          fetchPendingCars();
          setSelectedMechanic("");
          setShowModal(false);
          toast.success("Assigned successfully!");
        } catch (error) {
          toast.error("Failed to Assign. Please try again.");
          console.error(error);
        }
      } else {
        // User is offline, store in localStorage
        localStorage.setItem("pendingRequest", JSON.stringify(data));

        setSelectedMechanic("");
        setShowModal(false);
        toast.info("You are offline. The request will be sent when you're online.");
      }
    }
  };

  // Flag to prevent multiple API calls
  let isProcessing = false;

  // Process stored request when online
  const processPendingRequest = async () => {
    if (isProcessing) return; // Prevent duplicate execution
    isProcessing = true;

    const storedRequest = localStorage.getItem("pendingRequest");
    if (storedRequest) {
      const data = JSON.parse(storedRequest);
      try {
        await axios.post(
          `${apiUrl}/api/v1/carService/saveServiceInformation`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        // Remove request from storage after success
        localStorage.removeItem("pendingRequest");
        toast.success("Pending request processed successfully!");
      } catch (error) {
        console.error("Error processing pending request", error);
      }
    }

    isProcessing = false;
  };

  // Listen for online event
  window.addEventListener("online", processPendingRequest);



  const toggleOffcanvas = () => {
    setShowOffcanvas(!showOffcanvas);
  };

  const formatDate = (dateString) => {
    return new Intl.DateTimeFormat("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(dateString));
  };
  // const columns = [
  //   {
  //     name: t("pending.date"),
  //     id: "date",
  //     selector: (row) => new Date(row.dateIn),
  //     sortable: true,
  //     cell: (row) => formatDate(row.dateIn),
  //     style: {
  //       textAlign: "center",
  //     },
  //     width: '120px',
  //     center: 'true'
  //   },
  //   {
  //     name: t("pending.customerName"),
  //     selector: (row) => row.custName?.toLowerCase() || "",
  //     cell: (item) => (
  //       <span
  //         onClick={() => setClicked({ click: true, data: item })}
  //         style={{
  //           color: "#ffc107",
  //           textDecoration: "underline",
  //           cursor: "pointer",
  //         }}
  //         className="text-capitalize"
  //       >
  //         {item.custName || "N/A"}
  //       </span>
  //     ),
  //     sortable: true,
  //     style: {
  //       textAlign: "center",
  //     },
  //     width: '190px',
  //     center: 'true'

  //   },
  //   {
  //     name: t("pending.contactNo"),
  //     selector: (row) => row.custContactNo,
  //     style: {
  //       textAlign: "center",
  //     },
  //     width: '130px',
  //     center: 'true'

  //   },
  //   {
  //     name: t("pending.services"),
  //     selector: (row) => row.serviceTypes,
  //     style: {
  //       textAlign: "center",
  //     },
  //     width: '200px',
  //     center: 'true',

  //     cell: (item) => (
  //       item.serviceTypes ? (
  //         <ul className="text-center">
  //           {item.serviceTypes.split(",").map((type, index) => (
  //             <li key={index} className="text-start text-capitalize">{type.trim()}</li>
  //           ))}
  //         </ul>
  //       ) : (
  //         "N/A"
  //       )
  //     ),
  //   },
  //   {
  //     name: t("pending.status"),
  //     selector: (row) => row.status,
  //     style: {
  //       textAlign: "center",
  //     },
  //     width: '90px',
  //     center: 'true'

  //   },
  //   {
  //     name: t("pending.mechanic"),
  //     selector: (row) => row.technitionName || "Unassigned",
  //     style: {
  //       textAlign: "center",
  //     },
  //     width: '160px',
  //     sortable: true,
  //     center: 'true'

  //   },
  //   {
  //     name: t("pending.actions"),
  //     style: {
  //       textAlign: "center",
  //     },
  //     width: '142px',
  //     center: 'true',

  //     cell: (item) =>
  //       userRole.userRole === "admin" ? (
  //         <button
  //           className="btn btn-primary btn-sm"
  //           onClick={() => handleAssign(item.vehicleRegNo)}
  //         >
  //           Assign
  //         </button>
  //       ) : (
  //         <div className="d-flex justify-content-center">
  //           {item.technitionName === "" ? (
  //             <button
  //               className="btn btn-outline-warning btn-sm me-2"
  //               onClick={() => handleAccept(item.vehicleRegNo)}
  //             >
  //               <span className="fw-semibold">Assign to Me</span>
  //             </button>
  //           ) : (
  //             <>
  //               <button
  //                 className="btn btn-outline-success btn-sm me-2"
  //                 onClick={() => handleAccept(item.vehicleRegNo)}
  //               >
  //                 <span className="fw-semibold">Accept</span>
  //               </button>
  //               <button
  //                 className="btn btn-outline-danger btn-sm"
  //                 onClick={() => handleReject(item.vehicleRegNo)}
  //               >
  //                 <span className="fw-semibold">Reject</span>
  //               </button>
  //             </>
  //           )}
  //         </div>
  //       ),
  //   },
  // ];

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
      name: t("pending.customerName"),
      selector: (row) => row.custName?.toLowerCase() || "",
      key: "custName",
      cell: (item) => (
        <span
          onClick={() => setClicked({ click: true, data: item })}
          style={{
            color: "#ffc107",
            textDecoration: "underline",
            cursor: "pointer",
          }}
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
    {
      name: t("pending.actions"),
      style: {
        textAlign: "center",
      },
      width: '142px',
      center: 'true',

      cell: (item) =>
        userRole.userRole === "admin" ? (
          <button
            className="btn btn-primary btn-sm"
            onClick={() => handleAssign(item.vehicleRegNo)}
          >
            Assign
          </button>
        ) : (
          <div className="d-flex justify-content-center">
            {item.technitionName === "" ? (
              <button
                className="btn btn-outline-warning btn-sm me-2"
                onClick={() => handleAccept(item.vehicleRegNo)}
              >
                <span className="fw-semibold">Assign to Me</span>
              </button>
            ) : (
              <>
                <button
                  className="btn btn-outline-success btn-sm me-2"
                  onClick={() => handleAccept(item.vehicleRegNo)}
                >
                  <span className="fw-semibold">Accept</span>
                </button>
                <button
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => handleReject(item.vehicleRegNo)}
                >
                  <span className="fw-semibold">Reject</span>
                </button>
              </>
            )}
          </div>
        ),
    },
  ];


  const handleAccept = async (vehicle) => {

    const cuInfo = fullData.custInformationList.find(
      (item) => item.vehicleRegNo === vehicle
    );
    const carInfo = fullData.carServiceInfromationList.find(
      (item) => item.vehicleRegNo === vehicle
    );

    const data = {
      custInformation: cuInfo,
      carServiceInfromation: { ...carInfo, status: "A", technitionName: userRole.username },
    };

    try {
      await axios.post(
        `${apiUrl}/api/v1/carService/saveServiceInformation`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      fetchPendingCars();
      toast.success("Accepted successfully!");
    } catch (error) {
      toast.error("Failed to Accept service information. Please try again.");
      console.error(error);
    }
  };

  const handleReject = async (vehicle) => {
    const cuInfo = fullData.custInformationList.find(
      (item) => item.vehicleRegNo === vehicle
    );
    const carInfo = fullData.carServiceInfromationList.find(
      (item) => item.vehicleRegNo === vehicle
    );

    const data = {
      custInformation: cuInfo,
      carServiceInfromation: { ...carInfo, status: "R" },
    };

    try {
      await axios.post(
        `${apiUrl}/api/v1/carService/saveServiceInformation`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      fetchPendingCars();
      toast.success("Rejected successfully!");
    } catch (error) {
      toast.error("Failed to reject service information. Please try again.");
      console.error(error);
    }
  };


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


  const exportToExcel = () => {
    // Limit text length to avoid exceeding the 32,767-character limit
    const formattedData = tableData.map((row) =>
      Object.fromEntries(
        Object.entries(row).map(([key, value]) => [
          key,
          typeof value === "string"
            ? value.substring(0, 32766) // Truncate long strings
            : value || "", // Replace null/undefined with an empty string
        ])
      )
    );

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    XLSX.writeFile(workbook, "data.xlsx");
  };


  // Function to export data to PDF
  // const exportToPDF = () => {
  //   const doc = new jsPDF();
  //   doc.text("Exported Data", 10, 10);

  //   // Extract column headers from 'columns'
  //   const tableColumn = columns.map(col => col.name);

  //   // Map table rows to match columns' selectors
  //   const tableRows = tableData.map(row =>
  //     columns.map(col => {
  //       const value = row[col.key];
  //       // Ensure the value is not null or undefined before calling toString()
  //       return value !== null && value !== undefined ? value.toString() : "";
  //     })
  //   );


  //   // Check if rows are populated
  //   if (tableRows.length === 0) {
  //     doc.text("No data available", 10, 20);
  //   } else {
  //     // Use autoTable to add the data
  //     doc.autoTable({
  //       head: [tableColumn], // Headers
  //       body: tableRows,     // Data rows
  //       startY: 20           // Starting position of the table
  //     });
  //   }

  //   doc.save("data.pdf");
  // };

  
  const exportToPDF = async () => {
    const doc = new jsPDF();
  
    // Helper function to convert an image to Base64
    const getBase64ImageFromURL = (url) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL("image/png"));
        };
        img.onerror = (error) => reject(error);
        img.src = url;
      });
    };
  
    try {
      // Load header and footer images
      const headerImage = await getBase64ImageFromURL(headerIcon);
      const footerImage = await getBase64ImageFromURL(headerIcon);
  
      // Add header image
      doc.addImage(headerImage, "PNG", 0, 0, 210, 50); // Adjust dimensions as needed
  
      // Adjust starting Y position to account for the header
      const tableStartY = 60;
  
      // Extract column headers from 'columns'
      const tableColumn = columns.map(col => col.name);
  
      // Map table rows to match columns' selectors
      const tableRows = tableData.map(row =>
        columns.map(col => {
          const value = row[col.key];
          // Ensure the value is not null or undefined before calling toString()
          return value !== null && value !== undefined ? value.toString() : "";
        })
      );
  
      // Add table or fallback content
      if (tableRows.length === 0) {
        doc.text("No data available", 10, tableStartY);
      } else {
        doc.autoTable({
          head: [tableColumn], // Headers
          body: tableRows,     // Data rows
          startY: tableStartY, // Starting position of the table
        });
      }
  
      // Add footer image
      const pageHeight = doc.internal.pageSize.height;
      doc.addImage(footerImage, "PNG", 0, pageHeight - 50, 210, 50); // Adjust dimensions as needed
  
      // Save PDF
      doc.save("data_with_images_and_table.pdf");
    } catch (error) {
      console.error("Error loading images: ", error);
    }
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
          {!loading && (<div className="container-fluid">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="d-flex">
                <div
                  className="d-md-none me-2"
                  onClick={toggleOffcanvas}
                  style={{ cursor: "pointer" }}
                >
                  <i className="bi bi-list text-light fs-2"></i>
                </div>
                <h1 className="text-white">{t("menu.pending")}</h1>
              </div>
              <Logout />
            </div>

            {!clicked.click ? (
              <>

                <DataTable
                  columns={columns}
                  data={tableData}
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

                <div className="mb-2">
                  <button onClick={exportToExcel} className="px-4 py-2 btn btn-warning text-white mr-2 rounded me-4">
                    Export to Excel
                  </button>
                  <button onClick={exportToPDF} className="px-4 py-2 btn btn-warning text-white rounded">
                    Export to PDF
                  </button>
                </div>
              </>

            ) : (
              !clicked.click && (
                <p className="text-white">No completed data available.</p>
              )
            )}

            {clicked.click && (
              <>
                <TableOne historyData={clicked.data} setClicked={setClicked} />
              </>
            )}


            {/* Modal */}
            {showModal && (
              <div className="modal d-block" tabIndex="-1" role="dialog">
                <div className="modal-dialog" role="document">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">Assign Mechanic</h5>
                      <button
                        type="button"
                        className="btn-close"
                        onClick={() => setShowModal(false)}
                      ></button>
                    </div>
                    <div className="modal-body">
                      <select
                        className="form-select"
                        value={selectedMechanic}
                        onChange={(e) => setSelectedMechanic(e.target.value)}
                      >
                        <option value="">Select Mechanic</option>
                        {mechanics.map((mechanic, index) => (
                          <option key={index} value={mechanic.username}>
                            {mechanic.username}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleSaveMechanic}
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setShowModal(false)}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>)}

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

export default Pending;
