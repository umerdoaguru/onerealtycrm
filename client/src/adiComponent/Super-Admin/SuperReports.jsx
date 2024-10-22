import React, { useState, useEffect } from "react";
import { BsDownload, BsFilter } from "react-icons/bs";
import * as XLSX from "xlsx";

import axios from "axios";

import moment from "moment";
import SuperAdminSider from "./SuperAdminSider";
import MainHeader from "./../../components/MainHeader";
import Pagination from "../comp/pagination";
import cogoToast from "cogo-toast";

const SuperReports = () => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState("All");
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Visited lead");
  const [selectEmploye, setSelectEmploye] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredData, setFilteredData] = useState(data);
  const [rowPerPage, setRowPerPage] = useState(5);
  const [date, setDate] = useState({ startDate: "", endDate: "" });
  const [dataFields, setDataFields] = useState({
    "Visited lead": {
      heading: [
        "Lead No.",
        "Assigned To",
        "Lead Name",
        "Phone Number",
        "Date",
        "Lead Source",
        "Quotation Status",
        "Visit Status",
        "Visit Date",
        "Invoice Status",
        "Deal Status",
        "FollowUp Status",
      ],
      columns: [
        "lead_no",
        "assignedTo",
        "name",
        "phone",
        "createdTime",
        "leadSource",
        "quotation_status",
        "visit",
        "visit_date",
        "invoice_status",
        "deal_status",
        "follow_up_status",
      ],
      "Visited lead": [],
    },
    employee: {
      employee: [],
    },
    leads: {
      heading: [
        "Lead No.",
        "Assigned To",
        "Lead Name",
        "Phone Number",
        "Date",
        "Lead Source",
        "Visit Date",
        "Quotation Status",
        "Invoice Status",
        "Deal Status",
        "FollowUp Status",
      ],
      columns: [
        "lead_no",
        "assignedTo",
        "name",
        "phone",
        "createdTime",
        "leadSource",
        "visit_date",
        "quotation_status",
        "invoice_status",
        "deal_status",
        "follow_up_status",
      ],
      leads: [],
    },
  });

  useEffect(() => {
    filterData();
  }, [selectedCategory, filter]);

  const filterData = () => {

    if(selectedCategory === 'Visited lead') return;
    
    const filteredData = data[selectedCategory]?.filter((item) => {
      const currentDate = new Date();
      console.log(data[selectedCategory], item);
      // Parse the date from created_date or createdTime, whichever exists
      // Function to convert DD/MM/YYYY to MM/DD/YYYY
      const convertToMMDDYYYY = (dateStr) => {
        const [day, month, year] = dateStr.split("/"); // Split by "/"
        return `${month}/${day}/${year}`; // Return in MM/DD/YYYY format
      };

      let itemDate;
      if(item.d_closeDate === "pending") return false;

      itemDate = new Date(convertToMMDDYYYY(item.d_closeDate));

      console.log(itemDate);

      let filterCondition = false;

      if (filter === "week") {
        // Get the last Sunday and the current date for the week range
        const lastSunday = new Date(currentDate);
        lastSunday.setDate(currentDate.getDate() - currentDate.getDay()); // Last Sunday
        lastSunday.setHours(0, 0, 0, 0); // Start of the day

        const nextSaturday = new Date(lastSunday);
        nextSaturday.setDate(lastSunday.getDate() + 6); // Following Saturday

        filterCondition = itemDate >= lastSunday && itemDate <= nextSaturday;
      } else if (filter === "month") {
        // Get the start and end of the previous month
        const firstDayOfThisMonth = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          1
        );
        const lastDayOfThisMonth = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() + 1,
          0
        ); // Last day of the current month

        filterCondition =
          itemDate >= firstDayOfThisMonth && itemDate <= lastDayOfThisMonth;
      } else if (filter === "year") {
        // Get the start and end of the current year
        const startOfYear = new Date(currentDate.getFullYear(), 0, 1); // January 1st
        const endOfYear = new Date(
          currentDate.getFullYear(),
          11,
          31,
          23,
          59,
          59
        ); // December 31st

        filterCondition = itemDate >= startOfYear && itemDate <= endOfYear;
      } else if (filter === "All") {
        return true;
      }

      return filterCondition;
    });

    console.log(filteredData);
    // Update the dataFields state for the selected category with the filtered data
    setDataFields((prevDataFields) => ({
      ...prevDataFields,
      [selectedCategory]: {
        ...prevDataFields[selectedCategory],
        [selectedCategory]: filteredData, // Update the specific category with filtered data
      },
    }));
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
    if(date.startDate !== "" && date.endDate !== "") {
      const combinedData = {
        "Visited lead": data.leads,
        employee: data.employee,
        leads: data.leads,
      };
  
      const updatedDataFields = {
        ...dataFields,
        "Visited lead": {
          ...dataFields["Visited lead"],
          "Visited lead": combinedData["Visited lead"],
        },
        employee: {
          ...dataFields.employee,
          employee: combinedData.employee,
        },
        leads: {
          ...dataFields.leads,
          leads: combinedData.leads,
        },
      };
      console.log(updatedDataFields, combinedData);
      setDataFields(updatedDataFields);
    }
    setDate({ startDate: "", endDate: "" });
   
  };

  // const handleFilterChange = (event) => {
  //   setFilter(event.target.value);
  // };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
    // Add any additional logic to apply the filter to your data here
    console.log("Filter changed to:", event.target.value);
  };

  const handleDownload = () => {
    // Items per page (5 in this case, or any other number you are using)
    const itemsPerPage = 5;

    // Calculate the start and end index for the current page
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    // Get the data for the current page
    const paginatedData = dataFields[selectedCategory][selectedCategory].slice(
      startIndex,
      endIndex
    );

    // Convert the paginated data to Excel
    const ws = XLSX.utils.json_to_sheet(paginatedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    // Write the Excel file
    XLSX.writeFile(
      wb,
      `${selectedCategory}-${filter}-data-page-${currentPage}.xlsx`
    );
  };

  const employeeAxios = axios.create({
    baseURL: "https://crm.one-realty.in/api",
  });

  const leadsAxios = axios.create({
    baseURL: "https://crm.one-realty.in/api",
  });

  const formatData = (data) => {
    return data.map((item) => ({
      ...item,
      createdTime: moment(item.createdTime).format("DD/MM/YYYY"),
      visit_date: (item.visit_date !== "pending") ? moment(item.visit_date).format("DD/MM/YYYY") : "pending",
      d_closeDate: (item.d_closeDate !== "pending") ? moment(item.d_closeDate).format("DD/MM/YYYY") : "pending",
    }));
  };

  const getQuotationData = async () => {
    try {
      const results = await Promise.allSettled([
        employeeAxios.get("/employee"),
        leadsAxios.get("/leads"),
      ]);

      // Initialize empty response objects
      let employeeData = [];
      let leadsData = [];
      console.log(results);

      // Handle each result
      results.forEach((result, index) => {
        if (result.status === "fulfilled") {
          switch (index) {
            case 0:
              employeeData = formatData(result.value.data);
              break;
            case 1:
              leadsData = formatData(result.value.data).filter((item) => {
                return item.d_closeDate !== "pending" || item.visit_date !== "pending";
              });
              break;
            default:
              break;
          }
        } else {
          console.error(
            `Error fetching data for index ${index}:`,
            result.reason
          );
        }
      });
      console.log(leadsData, employeeData);

      const combinedData = {
        "Visited lead": leadsData,
        employee: employeeData,
        leads: leadsData,
      };

      const updatedDataFields = {
        ...dataFields,
        "Visited lead": {
          ...dataFields["Visited lead"],
          "Visited lead": combinedData["Visited lead"],
        },
        employee: {
          ...dataFields.employee,
          employee: combinedData.employee,
        },
        leads: {
          ...dataFields.leads,
          leads: combinedData.leads,
        },
      };
      console.log(updatedDataFields, combinedData);
      setDataFields(updatedDataFields);
      console.log(combinedData);
      setData(combinedData);
    } catch (error) {
      console.log("Unexpected error:", error);
    }
  };

  const changeVisitedLeadData = (e) => {
    const value = e.target.value;
    console.log(value);
    setSelectEmploye(value);

    // Optional chaining to safely access `leads` array
    console.log(data);
    // const getEmployeeLead = dataFields?.leads?.leads?.filter((data) => {
    const getEmployeeLead = data?.leads?.filter((data) => {
      console.log(data);
      if(value == "All"){
        return true;
      } 
      return data.employeeId == value; // Use strict equality for type safety
    });

    console.log(getEmployeeLead);
    setDataFields({
      ...dataFields,
      "Visited lead": {
        ...dataFields["Visited lead"],
        "Visited lead": getEmployeeLead,
      },
    });

    // Update the state or perform necessary actions here
    // setDataFields(updatedDataFields);
  };

  const searchByDate = () => {
    // console.log(dataFields?.[selectedCategory]);
    if (date.startDate === "" || date.endDate === "") {
      cogoToast.info("Date is set");
      return;
    }
    console.log(data.leads);

    let filteredData;
    let dateVar;
    let currentDate;

    if(selectedCategory == "Visited lead"){
      filteredData = data?.leads?.filter((item) => {

        if(item.visit_date == "pending") return false;
        if(item.employeeId == selectEmploye) {

          dateVar = item.visit_date;
          currentDate = new Date(moment(dateVar, "DD/MM/YYYY").toDate());
        } else {

          dateVar = item.visit_date;
          currentDate = new Date(moment(dateVar, "DD/MM/YYYY").toDate());
        }
        
        if(dateVar == undefined) return false;

        return (
          currentDate.getTime() >= new Date(date.startDate).getTime() &&
          currentDate.getTime() <= new Date(date.endDate).getTime()
        );
        
      });  
    } else {
      filteredData = data?.leads?.filter((item) => {

        if(item.d_closeDate == "pending") return false;

        let dateVar = item.d_closeDate;
        currentDate = new Date(moment(dateVar, "DD/MM/YYYY").toDate());
        return (
          currentDate.getTime() >= new Date(date.startDate).getTime() &&
          currentDate.getTime() <= new Date(date.endDate).getTime()
        );
      });
    }

    setDataFields({
      ...dataFields,
      [selectedCategory]: {
        ...dataFields[selectedCategory],
        [selectedCategory]: filteredData,
      },
    });
  };

  const clearDate = () => {
    // Clear the date states
    console.log(dataFields);
    if(date.startDate == "" && date.endDate == ""){
      cogoToast.info("Date is already cleared");
      return;
    }
    setDate({ startDate: "", endDate: "" });

    console.log(data?.leads);

    let defaultEmployeLead = data?.leads.filter(
      (lead) => {
        if(selectEmploye == "All") return true;
        
        return lead.employeeId == selectEmploye
      }
    );

    console.log(defaultEmployeLead, selectEmploye);

    const combinedData = {
      "Visited lead": defaultEmployeLead,
      employee: data?.employee,
      leads: data?.leads.filter((lead) => lead.d_closeDate !== "pending"),
    };

    // console.log(combinedData);

    const updatedDataFields = {
      ...dataFields,
      "Visited lead": {
        ...dataFields["Visited lead"],
        "Visited lead": combinedData["Visited lead"],
      },
      employee: {
        ...dataFields.employee,
        employee: combinedData.employee,
      },
      leads: {
        ...dataFields.leads,
        leads: combinedData.leads,
      },
    };
    console.log(updatedDataFields);
    // Update the state with the unfiltered data
    setDataFields(updatedDataFields);
    // setData(combinedData);

    console.log("Date filter cleared, showing all data");
  };

  // const downloadExcel = () => {
  //   const worksheet = XLSX.utils.json_to_sheet(filteredLeads);
  //   const workbook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(workbook, worksheet, "Leads");
  //   XLSX.writeFile(workbook, "LeadsData.xlsx");
  // };

  useEffect(() => {
    getQuotationData();
  }, []);

  return (
    <>
      <MainHeader />
      <SuperAdminSider />
      <div className="container p-4 mt-14">
        <center className="text-2xl text-center mt-8 font-medium">
          Reports
        </center>
        <center className="mx-auto h-[3px] w-16 bg-[#34495E] my-3"></center>
        {/* <div className="gap-4 mb-3"> */}
        {/* <div className="flex flex-wrap justify-center mb-8"> */}
        <div className="flex md:flex-row max-sm:flex-col mb-8">
          <div className="flex">
            <div className="flex  justify-center items-center p-2 rounded-lg mt-0">
              {["Visited lead", "leads"].map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryClick(category)}
                  className={`px-3 py-1 mr-3 hover:bg-blue-600 transition-colors rounded-lg  font-medium w-max ${
                    selectedCategory === category
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>

            <div className="flex items-center w-full">
              <div className="flex px-1 py-1.5 border mx-2 rounded-lg mt-0">
                <BsFilter className="lg:mr-2 mr-0" />
                {selectedCategory === "Visited lead" ? (
                  <select
                    value={selectEmploye}
                    onChange={changeVisitedLeadData}
                    className="bg-transparent border-gray-300 rounded sm:px-2 w-full outline-none"
                  >
                     <option
                        value="All"
                      >
                        Leads of Emp : All Emp.
                      </option>
                    {dataFields?.employee?.employee?.map((emp_name) => (
                      <option
                        key={emp_name.employeeId}
                        value={emp_name.employeeId}
                      >
                        Leads of Emp : {emp_name.name.toUpperCase()}
                      </option>
                    ))}
                  </select>
                ) : (
                  <select
                    value={filter}
                    onChange={handleFilterChange}
                    className="bg-transparent border-gray-300 rounded sm:px-2 px-0 w-full outline-none"
                  >
                    <option value="All">All</option>
                    <option value="week">Week</option>
                    <option value="month">Month</option>
                    <option value="year">Year</option>
                  </select>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center ">
            <div className="flex items-center md:mr-2 rounded-lg mt-2 p-1 w-full md:w-auto">
              <input
                type="date"
                value={date.startDate}
                onChange={(e) =>
                  setDate({ ...date, startDate: e.target.value })
                }
                className="border border-gray-300 px-2 py-1 rounded-lg focus:outline-none focus:border-blue-500 transition-colors w-full md:w-auto"
              />
              <span className="px-1 text-gray-600">
                <p>to</p>
              </span>
              <input
                type="date"
                value={date.endDate}
                onChange={(e) => setDate({ ...date, endDate: e.target.value })}
                className="border border-gray-300 px-2 py-1 rounded-lg focus:outline-none focus:border-blue-500 transition-colors w-full md:w-auto"
              />
            </div>

            <div className="mt-2 md:mt-0 w-full md:w-auto">
              <button
                onClick={searchByDate}
                className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition-colors w-full md:w-auto w-max"
              >
                Search by Date
              </button>
            </div>
          </div>

          <div className="flex items-center justify-center mt-2 md:mt-0 gap-2 flex-wrap">
            <div className="ml-2">
              <button
                onClick={clearDate}
                className="bg-gray-300 text-gray-700 px-3 py-1 rounded-lg hover:bg-gray-400 transition-colors w-max"
              >
                Clear Date
              </button>
            </div>
            <div className="flex-1 md:mx-2 ">
              <button
                onClick={handleDownload}
                className="bg-blue-500 flex justify-center items-center text-white lg:font-medium font-base  lg:px-3 px-3 py-1 rounded hover:bg-blue-700 sm:auto w-full"
              >
                <BsDownload className="mr-2" /> Download
              </button>
            </div>
          </div>
        </div>
        {/* </div> */}

        <div className="overflow-x-auto rounded-lg shadow-md">
          <table className="bg-white">
            <thead>
              {/* <tr className="text-sm font-semibold text-left text-gray-600 uppercase bg-gray-200"> */}
              <tr className="px-6 py-3 border-y-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider">
                {dataFields?.[selectedCategory].heading.map(
                  (heading, index) => (
                    <th key={index} className="px-4 py-3">
                      {heading}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {dataFields?.[selectedCategory]?.[selectedCategory]?.length >
              0 ? (
                dataFields?.[selectedCategory]?.[selectedCategory]
                  .slice(
                    (currentPage - 1) * rowPerPage,
                    currentPage * rowPerPage
                  )
                  .map((item, index) => (
                    <tr
                      key={index}
                      // className="border-b border-gray-200">
                      className="px-6 py-4 border-b border-gray-200 text-gray-800"
                    >
                      {dataFields[selectedCategory]?.columns.map(
                        (column, colIndex) => (
                          <td key={colIndex} className="px-4 py-3">
                            {item[column]}
                          </td>
                        )
                      )}
                    </tr>
                  ))
              ) : (
                <tr>
                  <td
                    colSpan={
                      dataFields?.[selectedCategory]?.heading.length || 1
                    }
                    className="py-4 text-center"
                  >
                    No data found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={currentPage}
          totalItems={dataFields?.[selectedCategory]?.[selectedCategory]?.length}
          itemsPerPage={rowPerPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </>
  );
};

export default SuperReports;
