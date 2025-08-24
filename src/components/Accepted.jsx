import React, { useContext, useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import axios from "axios";
import { CarDataContext } from "./CarDataContext";
import Logout from "./Logout";
import { toast } from "react-toastify";
import TableOne from "../subcomponents/TableOne";
import { useTranslation } from "react-i18next";
import carLoader from "../assets/car-loader.json";
import DataTable from "react-data-table-component";
import Lottie from "lottie-react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import RightSidebar from "../sidebar/RightSidebar";
import VirtualKeyboard from "./VirtualKeyboard";
import { useRef } from "react";
import { FaKeyboard } from "react-icons/fa";

function Accepted() {
  const {
    userRole,
    apiUrl,
    showOffcanvas,
    setShowOffcanvas,
  } = useContext(CarDataContext);
  const [category, setCategory] = useState("all")

  const [tableData, setTableData] = useState([]);
  const [clicked, setClicked] = useState({
    click: false,
    data: {},
  });

  const [searchText, setSearchText] = useState("");


  const excelData = {

    dateIn: "Date",
    vehicleRegNo: "Velhicle No.",
    custName: "Customer Name",
    custContactNo: "Customer No.",
    serviceTypes: 'Services',
    technitionName: "Mechanic"

  }

  const { t } = useTranslation()

  const token = localStorage.getItem("token");

  const [fullData, setFullData] = useState(null);
  const [loading, setLoading] = useState(false);

  const [showKeyboard, setShowKeyboard] = useState(false);
  const [keyboardInput, setKeyboardInput] = useState("");
  const [activeInput, setActiveInput] = useState("searchText");
  const activeInputRef = useRef(null);


  const fetchAcceptedCars = async () => {
    try {
      setLoading(true);
      const url =
        userRole.userRole === "super_admin"
          ? `${apiUrl}/api/v1/carService/getAllAccpeted?technitionName=null`
          : `${apiUrl}/api/v1/carService/getAllAccpeted?technitionName=${userRole.username}`;

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setFullData(response.data);

      const customerData = response.data.custInformationList || [];
      const serviceData = response.data.carServiceInformationList || [];

      const filteredServiceData = serviceData.filter(
        (service) => service.status.toLowerCase() === "i"
      );

      const combinedData = filteredServiceData.map((service) => {
        const customer = customerData.find(
          (cust) => cust.customerId === service.customerId
        );
        return { ...customer, ...service };
      });

      setTableData(sortByDate(combinedData, "desc"));
      setLoading(false);


    } catch (error) {
      console.error("Error fetching accepted cars:", error);
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
    fetchAcceptedCars();
  }, [userRole]);

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
    if (ref) activeInputRef.current = ref;
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
      name: t("carServiceInfo.remarks"),
      selector: (row) => row.remarks,
      key: "remarks",
      style: {
        textAlign: "center",
      },
      width: '130px',
      center: 'true',
    },

    userRole.userRole === "mechanic" && {
      name: t("pending.actions"),
      style: {
        textAlign: "center",
      },
      width: '142px',
      center: true,
      cell: (row) => (
        <button
          className="btn btn-outline-success text-white fw-semibold"
          onClick={() => handleComplete(row.vehicleRegNo)}
        >
          Completed
        </button>
      ),
    },
  ].filter(Boolean);

  const handleComplete = async (vehicle) => {
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
        status: "C",
        modifiedBy: userRole.username,
        modifiedDate: new Date().toISOString(),
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
      fetchAcceptedCars();
      toast.success("Completed successfully!");
    } catch (error) {
      toast.error("Failed to Complete. Please try again.");
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
    XLSX.writeFile(workbook, "Icon_Technik_Accepted.xlsx");
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

    doc.save("Icon_Technik_Accepted_List.pdf");
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
              {/* <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="d-flex">
                  <div
                    className="d-md-none me-2"
                    onClick={toggleOffcanvas}
                    style={{ cursor: "pointer" }}
                  >
                    <i className="bi bi-list text-light fs-2"></i>
                  </div>
                  <h1 className="text-white">{t("menu.accepted")}</h1>
                </div>
                <Logout />
              </div> */}

              <RightSidebar />

              <div className="d-flex justify-content-between align-items-center mb-3">

              <h1 className="text-white">{t("menu.accepted")}</h1>
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
                  {showKeyboard && activeInput && (
                    <VirtualKeyboard
                      input={keyboardInput}
                      onChange={handleKeyboardInput}
                      onClose={closeKeyboard}
                      onEnter={handleEnter}
                    />
                  )}
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
                      console.log(column, direction);
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
                    edit={userRole.userRole === "super_admin" || userRole.userRole == 'mechanic'}
                    setClicked={setClicked}
                    fullData={fullData}
                    refresh={fetchAcceptedCars}
                  />
                </>
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

export default Accepted;
