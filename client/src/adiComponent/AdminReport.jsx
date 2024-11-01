import React, { useState, useEffect } from "react";
import { BsDownload, BsFilter } from "react-icons/bs";
import * as XLSX from "xlsx";

import axios from "axios";

import moment from "moment";

import cogoToast from "cogo-toast";
import MainHeader from "../components/MainHeader";

import Sider from "./../components/Sider";
import Pagination from "./comp/pagination";
import { useSelector } from "react-redux";

const d_fileds = {
  // quotation: {
  //   heading: ["Id", "Quotation Name", "Employee Name", "Date"],
  //   columns: [
  //     "quotation_id",
  //     "quotation_name",
  //     "employee_name",
  //     "created_date",
  //   ],
  //   quotation: [],
  // },
  // invoice: {
  //   heading: [
  //     "id ",
  //     "Invoice Name",
  //     "Employee Name",
  //     "Amount",
  //     "Payment Mode",
  //     "Date",
  //   ],
  //   columns: [
  //     "invoice_id",
  //     "invoice_name",
  //     "employee_name",
  //     "offer_price",
  //     "payment_mode",
  //     "created_date",
  //   ],
  //   invoice: [],
  // },

  leads: {
    heading: [
      "Lead No.",
      "Assigned To",
      "Lead Name",
      "subject",
      "Phone Number",
      "Date",
      "Lead Status",
      "Lead Source",
      "Quotation Status",
      "Deal Status",
      "FollowUp Status",
    ],
    columns: [
      "lead_no",
      "assignedTo",
      "name",
      "subject",
      "phone",
      "createdTime",
      "lead_status",
      "leadSource",
      "quotation_status",
      "deal_status",
      "follow_up_status",
    ],
    leads: [],
  },
  visit: {
    heading: [
      "S.no.",
      "Lead Id.",
      "Name",
      "Employee Name",

      "visit",
      "visit date",
      "report",
    ],
    columns: [
      "id",
      "lead_id",

      "name",
      "employee_name",

      "visit_date",
      "visit",
      "report",
    ],
    visit: [],
  },
  closed: {
    heading: [
      "Lead No.",
      "Assigned To",
      "Lead Name",
      "subject",
      "Phone Number",
      // "Date",
      "Lead Source",
      "visit date",
      "visit",
      // "Quotation Status",
      // "Invoice Status",
      "Deal Status",
      "Deal Close Date",
      "FollowUp Status",
    ],
    columns: [
      "lead_no",
      "assignedTo",
      "name",
      "subject",
      "phone",
      // "createdTime",
      "leadSource",
      "visit_date",
      "visit",
      // "quotation_status",
      // "invoice_status",
      "deal_status",
      "d_closeDate",
      "follow_up_status",
    ],
    closed: [],
  },
};

const AdminReport = () =>  {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("leads");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowPerPage, setRowPerPage] = useState(5);
  const [dataFields, setDataFields] = useState(d_fileds);
 
  useEffect(() => {
    filterData();
  }, [selectedCategory, filter]);

  const filterData = () => {
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

      if (selectedCategory == "leads") {
        itemDate = new Date(convertToMMDDYYYY(item.createdTime));
      } else if (selectedCategory == "visit") {
        itemDate = new Date(convertToMMDDYYYY(item.visit_date));
      } else {
        itemDate = new Date(convertToMMDDYYYY(item.d_closeDate));
      }

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
    filterData();

    const combinedData = {
      leads: data.leads,
      visit: data.visit,
      closed: data.closed,
    };

    const updatedDataFields = {
      ...dataFields,
      leads: {
        ...dataFields.leads,
        leads: combinedData.leads,
      },
      visit: {
        ...dataFields.visit,
        visit: combinedData.visit,
      },
      closed: {
        ...dataFields.closed,
        closed: combinedData.closed,
      },
    };
    console.log(updatedDataFields, combinedData);
    setDataFields(updatedDataFields);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleDownload = () => {
    const itemsPerPage = 5;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    // Get the data for the current page
    const paginatedData = dataFields[selectedCategory][selectedCategory]
      .slice(startIndex, endIndex)
      .map(({ createdTime, d_closeDate, ...rest }) => rest); // Remove createdTime and closeDate

    // Convert the filtered paginated data to Excel
    const ws = XLSX.utils.json_to_sheet(paginatedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    // Write the Excel file
    XLSX.writeFile(
      wb,
      `${selectedCategory}-${filter}-data-page-${currentPage}.xlsx`
    );
  };

  // const quotationAxios = axios.create({
  //   baseURL: "http://localhost:9000/api",
  // });

  // const invoiceAxios = axios.create({
  //   baseURL: "http://localhost:9000/api",
  // });

  const leadsAxios = axios.create({
    baseURL: "http://localhost:9000/api",
  });

  const visitAxios = axios.create({
    baseURL: "http://localhost:9000/api",
  });

  const closedAxios = axios.create({
    baseURL: "http://localhost:9000/api",
  });

  const formatData = (data) => {
    return data.map((item) => ({
      ...item,
      createdTime: moment(item.createdTime).format("DD/MM/YYYY"),
      visit_date:
        item.visit_date !== "pending"
          ? moment(item.visit_date).format("DD/MM/YYYY")
          : "pending",
      d_closeDate:
        item.d_closeDate !== "pending"
          ? moment(item.d_closeDate).format("DD/MM/YYYY")
          : "pending",
    }));
  };

  const getQuotationData = async () => {
    try {
      const results = await Promise.allSettled([
        // quotationAxios.get(`/get-quotation-byEmploye/${EmpId}`),
        // invoiceAxios.get(`/get-employee-invoice/${EmpId}`),
        leadsAxios.get(`/leads`),
        visitAxios.get(`/employe-all-visit`),
        closedAxios.get(`/leads`),
        
      ]);

      // Initialize empty response objects
      // let quotationData = [];
      // let invoiceData = [];
      let leadsData = [];
      let visitData = [];
      let closedData = [];
      // Handle each result
      results.forEach((result, index) => {
        if (result.status === "fulfilled") {
          switch (index) {
            // case 0:
            //   quotationData = formatData(result.value.data);
            //   break;
            // case 1:
            //   invoiceData = formatData(result.value.data);
            //   break;
            case 0:
              leadsData = formatData(result.value.data).filter((item) => {
                return (
                  item.lead_status !== "in progress" &&
                  item.lead_status !== "pending"
                );
              });
              break;
            case 1:
              visitData = formatData(result.value.data).filter((item) => {
                return (
                  item.d_closeDate !== "pending" &&
                  item.visit_date !== "pending"
                );
              });
              break;
            case 2:
              closedData = formatData(result.value.data).filter((item) => {
                return (
                  item.d_closeDate !== "pending" &&
                  item.visit_date !== "pending"
                );
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

      const combinedData = {
        // quotation: quotationData,
        // invoice: invoiceData,
        leads: leadsData,
        visit: visitData,
        closed: closedData,
      };

      const updatedDataFields = {
        ...dataFields,
        // quotation: {
        //   ...dataFields.quotation,
        //   quotation: combinedData.quotation,
        // },
        // invoice: {
        //   ...dataFields.invoice,
        //   invoice: combinedData.invoice,
        // },
        leads: {
          ...dataFields.leads,
          leads: combinedData.leads,
        },
        visit: {
          ...dataFields.visit,
          visit: combinedData.visit,
        },
        closed: {
          ...dataFields.closed,
          closed: combinedData.closed,
        },
      };

      setDataFields(updatedDataFields);
      console.log(combinedData);
      setData(combinedData);
    } catch (error) {
      console.log("Unexpected error:", error);
    }
  };

  useEffect(() => {
    getQuotationData();
  }, []);

  return (
    <>
      <MainHeader />
      <Sider />

      <div className="flex-auto flex-col lg:flex-row min-w-screen md:mx-2">
        <div className="flex-grow p-4 mt-14 lg:mt-0 lg:ml-36 sm:ml-0 w-2xl">
          <center className="text-2xl text-center mt-8 font-medium">
            Employee Report
          </center>
          <center className="mx-auto h-[3px] w-16 bg-[#34495E] my-3"></center>

          <div className="md:flex  justify-between mb-4 ">
            <div className="flex flex-col space-y-4 lg:space-y-0 lg:flex-row lg:justify-between  w-fit">
              <div className="flex flex-wrap justify-center max-sm:justify-start">
                {["leads", "visit", "closed"].map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategoryClick(category)}
                    className={`mb-2 mr-2 px-4 py-2 rounded-lg ${
                      selectedCategory === category
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200"
                    }`}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center lg:flex-row justify-between lg:justify-end max-sm:justify-start ">
              <div className="flex items-center p-2 bg-gray-100 mr-2 mb-2 border rounded-lg">
                <label htmlFor="rowsPerPage" className="mr-2">
                  Rows per page:
                </label>
                <select
                  id="rowsPerPage"
                  value={rowPerPage}
                  onChange={(e) => setRowPerPage(Number(e.target.value))}
                  className="bg-transparent border-none outline-none"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                </select>
              </div>

              <div className="flex items-center p-2 bg-gray-100 border mr-2 mb-2 rounded-lg">
                <BsFilter className="mr-2" />
                <select
                  value={filter}
                  onChange={handleFilterChange}
                  className="bg-transparent border-none outline-none"
                >
                  <option value="All">All</option>
                  <option value="week">Week</option>
                  <option value="month">Month</option>
                  <option value="year">Year</option>
                </select>
              </div>

              <button
                onClick={handleDownload}
                className="flex items-center px-4 py-2 text-white mr-2 mb-2 bg-blue-500 hover:bg-blue-700 rounded-lg"
              >
                <BsDownload className="mr-2" /> Download
              </button>
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg shadow-md ">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="text-sm font-semibold text-left text-gray-600 uppercase bg-gray-200">
                  {dataFields?.[selectedCategory].heading.map((head) => (
                    <th className="px-4 py-3">{head}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dataFields?.[selectedCategory]?.[selectedCategory]?.length >
                0 ? (
                  dataFields?.[selectedCategory]?.[selectedCategory]

                    .filter((item, index, array) => {
                      if (
                        selectedCategory === "visit" &&
                        item.visit === "pending"
                      ) {
                        return false;
                      }
                      if (
                        selectedCategory === "closed" &&
                        item.deal_status === "pending" // Ensure correct case for 'pending'
                      ) {
                        return false;
                      }

                      return true; // Include all other rows
                    })
                    .slice(
                      (currentPage - 1) * rowPerPage,
                      currentPage * rowPerPage
                    )
                    .map((item, index) => (
                      <tr key={index} className="border-b border-gray-200">
                        {dataFields[selectedCategory]?.columns.map((column) => (
                          <td className="px-4 py-3">{item[column]}</td>
                        ))}
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-4 text-center">
                      No data found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <Pagination
            currentPage={currentPage}
            totalItems={
              dataFields?.[selectedCategory]?.[selectedCategory]?.length
            }
            itemsPerPage={rowPerPage}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </>
  );
};


export default AdminReport;
