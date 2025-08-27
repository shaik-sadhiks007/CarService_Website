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
import RightSidebar from "../sidebar/RightSidebar";
import VirtualKeyboard from "./VirtualKeyboard";
import { useRef } from "react";
import { FaKeyboard } from "react-icons/fa";

function Pending() {
  const {
    mechanics,
    userRole,
    apiUrl,
    showOffcanvas,
    setShowOffcanvas,
    fetchMechanics,
  } = useContext(CarDataContext);

  const [tableData, setTableData] = useState([]);
  const [selectedCarIndex, setSelectedCarIndex] = useState(null);
  const [selectedMechanic, setSelectedMechanic] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [clicked, setClicked] = useState({
    click: false,
    data: {},
  });


  const [category, setCategory] = useState("all")

  const [searchText, setSearchText] = useState("");

  const [showKeyboard, setShowKeyboard] = useState(false);
  const [keyboardInput, setKeyboardInput] = useState("");
  const [activeInput, setActiveInput] = useState(null);
  const [activeInputRef, setActiveInputRef] = useState(null);


  const excelData = {

    dateIn: "Date",
    vehicleRegNo: "Velhicle No.",
    custName: "Customer Name",
    custContactNo: "Customer No.",
    serviceTypes: 'Services',
    technitionName: "Mechanic"

  }



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


      if (userRole.userRole?.toLowerCase() === "super_admin") {
        const customerData = response.data.custInformationList || [];
        const serviceData = response.data.carServiceInformationList || [];
        
        const filteredServiceData = serviceData.filter((service) =>
          ["p", "r"].includes(service.status.toLowerCase())
        );

        const combinedData = filteredServiceData.map((service) => {
          const customer = customerData.find(
            (cust) => cust.customerId === service.customerId
          );
          return { ...customer, ...service };
        });


        // setTableData(combinedData);

        setTableData(sortByDate(combinedData, "desc"));

        setLoading(false);

        // setSortedData(sortByDate(combinedData, "desc"));
      } else {
        const customerData = response.data.custInformationList || [];
        const serviceData = response.data.carServiceInformationList || [];
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

    if (userRole.userRole == "super_admin") {
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
      const carInfo = fullData.carServiceInformationList.find(
        (item) => item.vehicleRegNo === selectedCarIndex
      );

      const data = {
        custInformation: cuInfo,
        carServiceInformation: { 
          ...carInfo, 
          technitionId: selectedMechanic.userId,
          technitionName: selectedMechanic.username 
        },
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
        setSelectedMechanic(null);
        setShowModal(false);
        toast.success("Assigned successfully!");
      } catch (error) {
        toast.error("Failed to Assign. Please try again.");
        console.error(error);
      }
    } else {
      // User is offline, store in localStorage
      localStorage.setItem("pendingRequest", JSON.stringify(data));
      setSelectedMechanic(null);
      setShowModal(false);
      toast.info("You are offline. The request will be sent when you're online.");
    }

  };

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

  const handleKeyboardInput = (input) => {
    setKeyboardInput(input);
    if (activeInput === "searchText") {
      setSearchText(input);
    }
  };

  const openKeyboard = (inputName, ref = null, value = "") => {
    setActiveInput(inputName);
    setShowKeyboard(true);
    setKeyboardInput(value);
    if (ref) setActiveInputRef(ref);
  };

  const closeKeyboard = () => {
    setShowKeyboard(false);
    setActiveInput(null);
    if (activeInputRef && activeInputRef.current) activeInputRef.current.blur();
  };

  const handleEnter = () => {
    if (activeInput === "searchText") {
      // For search input, just close the keyboard when Enter is pressed
      closeKeyboard();
    }
  };

  // Function to handle when form inputs are focused
  const handleFormInputFocus = (section, key, currentValue) => {
    setActiveInput({ section, key });
    setKeyboardInput(currentValue || "");
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
      name: "Type",
      selector: (row) => row.custType,
      key: "custType",
      style: {
        textAlign: "center",
      },
      width: '140px',
      center: 'true',
      cell: (item) => {
        const typeMap = {
          c: { label: "customer", className: "badge bg-secondary" },
          d: { label: "dealer", className: "badge bg-info" },
          t: { label: "towing", className: "badge bg-warning text-dark" },
          r: { label: "rental", className: "badge bg-light text-dark" },
        };
        const code = (item.custType || '').toLowerCase();
        const t = typeMap[code];
        return t ? <span className={t.className}>{t.label}</span> : (item.custType || "N/A");
      },
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
      cell: (item) => {
        const statusMap = {
          P: { label: "Pending", className: "badge bg-warning text-dark" },
          C: { label: "Completed", className: "badge bg-success" },
          A: { label: "Assigned", className: "badge bg-info" },
          I: { label: "In Progress", className: "badge bg-primary" },
          R: { label: "Rejected", className: "badge bg-danger" },
        };
        const code = (item.status || '').toUpperCase();
        const status = statusMap[code];
        return status ? (
          <span className={status.className}>{status.label}</span>
        ) : (
          item.status || "N/A"
        );
      },
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
        userRole.userRole === "super_admin" ? (
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
    const carInfo = fullData.carServiceInformationList.find(
      (item) => item.vehicleRegNo === vehicle
    );

    const data = {
      custInformation: cuInfo,
      carServiceInformation: { 
        ...carInfo, 
        status: "I", 
        technitionName: userRole.username,
        technitionId: userRole.userId 
      },
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
    const carInfo = fullData.carServiceInformationList.find(
      (item) => item.vehicleRegNo === vehicle
    );

    const data = {
      custInformation: cuInfo,
      carServiceInformation: { ...carInfo, status: "R" },
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
        backgroundColor: "#15191F",
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
    // Format data according to excelData mapping
    const keyMapping = {
      // Customer Info
      customerId: "Customer Id",
      custName: "Customer Name",
      vehicleRegNo: "Vehicle No.",
      dateIn: "Date In",
      custContactNo: "Phone Number",
      email: "Email",
      address: "Address",
      // vehicleModel: "Vehicle Model",
      // manufactureYear: "Manufacture Year",
      // vehicleColor: "Vehicle Color",
      // engineNo: "Engine No.",
      // chasisNo: "Chasis No.",

      // Car Service Info
      entryType: "Entry Type",
      mileage: "Mileage",
      // fuelLevel: "Fuel Level",
      // fuelLevelImage: "Fuel Level Image",
      // carImage: "Car Image",
      // technitionName: "Technician Name",
      // managerName: "Manager Name",
      remarks: "Mechanic Remarks",
      serviceTypes: "Service Types",
      // createdBy: "Created By",
      // createdDate: "Created Date",
      // modifiedBy: "Modified By",
      // modifiedDate: "Modified Date",
    };

    const formattedData = tableData.map((row) =>
      Object.fromEntries(
        Object.keys(keyMapping).map((key) => {
          let value = row[key];

          // Format date if key is 'dateIn'
          if (key === "dateIn" && value) {
            value = formatDate(value);
          }

          // Split 'serviceTypes' into bullet points
          if (key === "serviceTypes" && value) {
            value = value.split(",").map(item => `• ${item.trim()}`).join("\n");
          }

          // Truncate long strings and replace null/undefined with an empty string
          return [keyMapping[key], typeof value === "string" ? value.substring(0, 32766) : value || ""];
        })
      )
    );

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    XLSX.writeFile(workbook, "Icon_Technik.xlsx");
  };

  const filteredData = tableData
    .filter((row) => {
      switch (category.toLowerCase()) {
        case 'all':
          return true;
        case 'customer':
          return row.custType?.toLowerCase() === 'c';
        case 'dealer':
          return row.custType?.toLowerCase() === 'd';
        case 'rental':
          return row.custType?.toLowerCase() === 'r';
        case 'towing':
          return row.custType?.toLowerCase() === 't';
        default:
          return true;
      }
    })
    .filter((row) => row.vehicleRegNo?.toLowerCase().includes(searchText.toLowerCase()));


  const handleCategoryChange = (selectedCategory) => {
    setCategory(selectedCategory);
  };

  const exportToPDF = async () => {

    const doc = new jsPDF();

    // Header: Centered H1 Title
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    const headerText = "ICON TECHNIK PTE. LTD.";
    const pageWidth = doc.internal.pageSize.width;
    const textWidth = doc.getTextWidth(headerText);
    doc.text(headerText, (pageWidth - textWidth) / 2, 20);

    // Add HR Line after header
    doc.setLineWidth(0.5);
    doc.line(10, 25, pageWidth - 10, 25);

    // Adjust starting Y position for table
    const tableStartY = 35;

    // Extract column headers from 'columns'
    const tableColumn = Object.values(excelData);

    // Map table rows to match columns' selectors
    const tableRows = tableData.map(row =>
      Object.keys(excelData).map(key => {
        let value = row[key];

        // Format date if key is 'dateIn'
        if (key === "dateIn" && value) {
          return formatDate(value);
        }

        // Split 'serviceTypes' into bullet points
        if (key === "serviceTypes" && value) {
          return value.split(",").map(item => `• ${item.trim()}`).join("\n");
        }

        // Default conversion to string
        return value !== null && value !== undefined ? value.toString() : "";
      })
    );

    // Add table or fallback content
    if (tableRows.length === 0) {
      doc.text("No data available", 10, tableStartY);
    } else {
      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: tableStartY,
      });
    }

    const footerMargin = 5;
    const pageHeight = doc.internal.pageSize.height;
    const pageWidthF = doc.internal.pageSize.width;

    // Footer HR Line
    const footerStartY = pageHeight - 10 - footerMargin;
    doc.line(10, footerStartY, pageWidthF - 10, footerStartY);

    // Footer Text (Centered)
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const footerText = "Registered Address: 1 BUKIT BATOK CRESCENT, #05-60/61, WCEGA PLAZA, SINGAPORE (658064)";
    const textWidthF = doc.getTextWidth(footerText);
    doc.text(footerText, (pageWidthF - textWidthF) / 2, footerStartY + 7);

    doc.save("Icon_Technik_Pending_List.pdf");
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
          {!loading && (
            <div className="container-fluid">

              <RightSidebar />

              <div className="d-flex justify-content-between align-items-center mb-3">  

              <h1 className="text-white">{t("menu.pending")}</h1>
              <div
                onClick={() => setShowKeyboard(!showKeyboard)}
                style={{ cursor: 'pointer' }}
                title="Open Virtual Keyboard"
              >
                <FaKeyboard size={20} className="text-warning" />
              </div>
            </div>
              {!clicked.click ? (
                <>
                  <div
                    className="text-white w-100 rounded-2">

                    <div className="row ">
                      <div className="col-12 col-md-6 mt-2">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <input
                            type="text"
                            placeholder="Search by Vehicle No."
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            onFocus={() => setActiveInput("searchText")}
                            readOnly={showKeyboard}
                            className="form-control input-dashboard text-white placeholder-white me-2"
                          />
                        </div>
                      </div>
                    </div>

                  </div>

                  <div className="row g-2 my-2">
                    <div className="col-6 col-sm-4 col-md-auto">
                      <button className={`btn w-100 ${category === 'all' ? 'btn-warning' : 'btn-outline-warning'}`} onClick={() => handleCategoryChange('all')}>
                        {t("category.all")}
                      </button>
                    </div>
                    <div className="col-6 col-sm-4 col-md-auto">
                      <button className={`btn w-100 ${category === 'customer' ? 'btn-warning' : 'btn-outline-warning'}`} onClick={() => handleCategoryChange('customer')}>
                        {t("category.customer")}
                      </button>
                    </div>
                    <div className="col-6 col-sm-4 col-md-auto">
                      <button className={`btn w-100 ${category === 'dealer' ? 'btn-warning' : 'btn-outline-warning'}`} onClick={() => handleCategoryChange('dealer')}>
                        {t("category.dealer")}
                      </button>
                    </div>
                    <div className="col-6 col-sm-4 col-md-auto">
                      <button className={`btn w-100 ${category === 'rental' ? 'btn-warning' : 'btn-outline-warning'}`} onClick={() => handleCategoryChange('rental')}>
                        {t("category.rental")}
                      </button>
                    </div>
                    <div className="col-6 col-sm-4 col-md-auto">
                      <button className={`btn w-100 ${category === 'towing' ? 'btn-warning' : 'btn-outline-warning'}`} onClick={() => handleCategoryChange('towing')}>
                        {t("category.towing")}
                      </button>
                    </div>
                  </div>

                  <DataTable
                    columns={columns}
                    data={filteredData}
                    defaultSortFieldId="date"
                    defaultSortAsc={false}
                    pagination
                    onSort={(column, direction) => {
                      // console.log(column, direction);
                    }}
                    theme="dark"
                    customStyles={customStyles}
                  />

                  <div className="row g-2 my-2">
                    <div className="col-12 col-sm-6 col-md-auto">
                      <button onClick={exportToExcel} className="btn btn-warning text-white w-100">
                        {t("exportToExcel")}
                      </button>
                    </div>
                    <div className="col-12 col-sm-6 col-md-auto">
                      <button onClick={exportToPDF} className="btn btn-warning text-white w-100">
                        {t("exportToPdf")}
                      </button>
                    </div>
                  </div>
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
                    setClicked={setClicked}
                    edit={userRole.userRole === "super_admin"}
                    fullData={fullData}
                    refresh={fetchPendingCars}

                  />
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
                          value={selectedMechanic?.username || ""}
                          onChange={(e) => {
                            const mechanic = mechanics.find(
                              (m) => m.username === e.target.value
                            );
                            setSelectedMechanic(mechanic);
                          }}
                        >
                          <option value="">Select Mechanic</option>
                          {mechanics
                            .filter((mechanic) => mechanic.active)
                            .map((mechanic, index) => (
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
      {showKeyboard && activeInput && (
        <VirtualKeyboard
          input={keyboardInput}
          onChange={handleKeyboardInput}
          onClose={closeKeyboard}
          onEnter={handleEnter}
        />
      )}
    </div>
  );
}

export default Pending;
