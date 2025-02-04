import React, { useContext, useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { CarDataContext } from "./CarDataContext";
import axios from "axios";
import Logout from "./Logout";
import TableOne from "../subcomponents/TableOne";
import Pagination from "../subcomponents/Pagination";
import { useTranslation } from "react-i18next";
import carLoader from "../assets/car-loader.json";
import DataTable from "react-data-table-component";
import Lottie from "lottie-react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

function Completed() {
  const {
    userRole,
    apiUrl,
    showOffcanvas,
    setShowOffcanvas,
  } = useContext(CarDataContext);

  const [tableData, setTableData] = useState([]);
  const token = localStorage.getItem("token");
  const { t } = useTranslation()

  const [clicked, setClicked] = useState({
    click: false,
    data: {},
  });

  const excelData = {

    dateIn: "Date",
    vehicleRegNo: "Velhicle No.",
    custName: "Customer Name",
    custContactNo: "Customer No.",
    serviceTypes: 'Services',
    technitionName: "Mechanic"

  }

  const [fullData, setFullData] = useState(null);
  const [loading, setLoading] = useState(false);


  const fetchCompletedCars = async () => {
    try {
      setLoading(true);

      const url =
        userRole.userRole === "admin"
          ? `${apiUrl}/api/v1/carService/getAllPendingCarServiceforAdmin`
          : `${apiUrl}/api/v1/carService/getAllPendingCarServiceforUser?technitionName=${userRole.username}`;

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setFullData(response.data);


      const customerData = response.data.custInformationList || [];
      const serviceData = response.data.carServiceInfromationList || [];

      const filteredServiceData = serviceData.filter(
        (service) => service.status === "C"
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
      console.error("Error fetching completed cars:", error);
    }
  };

  useEffect(() => {
    fetchCompletedCars();
  }, [userRole]);

  const sortByDate = (data, order) => {
    return data.sort((a, b) => {
      const dateA = new Date(a.modifiedDate);
      const dateB = new Date(b.modifiedDate);
      return order === "asc" ? dateA - dateB : dateB - dateA;
    });
  };

  const formatDate = (dateString) => {
    return new Intl.DateTimeFormat("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(dateString));
  };

  const toggleOffcanvas = () => {
    setShowOffcanvas(!showOffcanvas);
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
      name: t("carServiceInfo.remarks"),
      selector: (row) => row.remarks,
      key: "remarks",
      style: {
        textAlign: "center",
        whiteSpace: "pre-line",
        wordBreak: "break-word",
        overflowWrap: "break-word",
      },
      width: "auto",
      center: true,
    }

  ];


  const customStyles = {
    table: {
      style: {
        backgroundColor: "transparent",
      },
    },
    headCells: {
      style: {
        whiteSpace: "normal",
        wordBreak: "break-word",
      },
    },
    cells: {
      style: {
        padding: "8px",
        // border: "1px solid #555",
        textAlign: "center",
        whiteSpace: "normal",
        wordBreak: "break-word",
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
      vehicleModel: "Vehicle Model",
      manufactureYear: "Manufacture Year",
      vehicleColor: "Vehicle Color",
      engineNo: "Engine No.",
      chasisNo: "Chasis No.",

      // Car Service Info
      entryType: "Entry Type",
      mileage: "Mileage",
      fuelLevel: "Fuel Level",
      fuelLevelImage: "Fuel Level Image",
      carImage: "Car Image",
      technitionName: "Technician Name",
      managerName: "Manager Name",
      remarks: "Remarks",
      serviceTypes: "Service Types",
      createdBy: "Created By",
      createdDate: "Created Date",
      modifiedBy: "Modified By",
      modifiedDate: "Modified Date",
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
    XLSX.writeFile(workbook, "Icon_Technik_Completed.xlsx");
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

    doc.save("Icon_Technik_Completed_List.pdf");
  };

  const [searchText, setSearchText] = useState("");



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
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="d-flex">
                  <div
                    className="d-md-none me-2"
                    onClick={toggleOffcanvas}
                    style={{ cursor: "pointer" }}
                  >
                    <i className="bi bi-list text-light fs-2"></i>
                  </div>
                  <h1 className="text-white">{t("menu.completed")}</h1>
                </div>
                <input
                  type="text"
                  placeholder="Search by Vehicle No."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="form-control w-50 input-dashboard text-white placeholder-white rounded-pill"
                />
                <Logout />
              </div>

              {!clicked.click ? (
                <>

                  {/* <div
                  className="text-white w-100 p-4 rounded-2">
                  <label htmlFor="serviceCategory" className="form-label">
                    {t("serviceCategory")}
                  </label>

                  <div className="row">
                    <div className="col-6">
                      <input
                        type="text"
                        placeholder="Search by Vehicle No."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        className="form-control mb-3 input-dashboard text-white placeholder-white"
                      />
                    </div>
                  </div>

                </div> */}


                  <DataTable
                    columns={columns}
                    // data={tableData}
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

                  <div className="my-2 d-flex">
                    <button onClick={exportToExcel} className="px-4 py-2 btn btn-warning text-white mr-2 rounded me-4">
                      {t("exportToExcel")}
                    </button>
                    <button onClick={exportToPDF} className="px-4 py-2 btn btn-warning text-white rounded">
                      {t("exportToPdf")}
                    </button>
                  </div>
                </>

              ) : (
                !clicked.click && (
                  <p className="text-white">No data available.</p>
                )
              )}


              {clicked.click && (
                <>
                  <TableOne historyData={clicked.data} setClicked={setClicked} />
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

export default Completed;
