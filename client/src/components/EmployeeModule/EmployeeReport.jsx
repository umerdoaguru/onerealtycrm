import React, { useState, useEffect } from "react";
import { BsDownload, BsFilter } from "react-icons/bs";
import * as XLSX from "xlsx";

import axios from "axios";

import Pagination from './../../adiComponent/comp/pagination';
import MainHeader from "../MainHeader";
import EmployeeSider from "./EmployeeSider";
import { useSelector } from "react-redux";
import moment from "moment";

const d_fileds = {
  quotation: {
    heading: ["Id", "Quotation Name", "Employee Name", "Date"],  
    columns: ["quotation_id", "quotation_name", "employee_name", "created_date"],
    quotation: [],
  },
  invoice: {
    heading: ["id ", "Invoice Name", "Employee Name", "Amount", "Payment Mode", "Date"],
    columns: ["invoice_id", "invoice_name", "employee_name", "offer_price", "payment_mode", "created_date"],
    invoice: [],
  },
 
  leads: {
    heading: ["Lead No.", "Assigned To", "Lead Name", "Phone Number", "Date", "Lead Source", "Quotation Status", "Invoice Status", "Deal Status",  "FollowUp Status"],
    columns: ["lead_no", "assignedTo", "name",  "phone", "createdTime", "leadSource", "quotation_status", "invoice_status", "deal_status", "follow_up_status"],
    leads: [],
  },
}
 
const EmployeeReport = () => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("quotation");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowPerPage, setRowPerPage] = useState(5);
  const [dataFields, setDataFields] = useState(d_fileds);
  const EmpId = useSelector(state => state.auth.user.id); 
  useEffect(() => {
    filterData();
  }, [selectedCategory, filter]);

  const filterData = () => {
    const filteredData = data[selectedCategory]?.filter((item) => {
      const currentDate = new Date();

      // Parse the date from created_date or createdTime, whichever exists
      const itemDate = new Date(item.created_date || item.createdTime);

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
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
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

  // const getQuotationData = async () => {
  //   try {
  //     const formatData = (data) => {
  //       return data.map((item) => ({
  //         ...item,
  //         created_date: moment(item.created_date).format('DD/MM/YYYY'),
  //         createdTime: moment(item.createdTime).format('DD/MM/YYYY'),
  //       }));
  //     };
  
  //     const [
  //       quotationResponse,
  //       invoiceResponse,
  //       leadsResponse,
  //     ] = await Promise.all([
  //       axios.get(`https://crmdemo.vimubds5.a2hosted.com/api/get-quotation-byEmploye/${EmpId}`),
  //       axios.get(`https://crmdemo.vimubds5.a2hosted.com/api/get-employee-invoice/${EmpId}`),
  //       axios.get(`https://crmdemo.vimubds5.a2hosted.com/api/employe-leads/${EmpId}`),
  //     ]);
  
  //     // Use formatData to format the response data
  //     const combinedData = {
  //       quotation: formatData(quotationResponse.data),
  //       invoice: formatData(invoiceResponse.data),
  //       leads: formatData(leadsResponse.data),
  //     };
  
  //     console.log(combinedData);
  
  //     const updatedDataFields = {
  //       ...dataFields,
  //       quotation: { ...dataFields.quotation, quotation: combinedData.quotation },
  //       invoice: { ...dataFields.invoice, invoice: combinedData.invoice },
  //       leads: { ...dataFields.leads, leads: combinedData.leads },
  //     };
  
  //     setDataFields(updatedDataFields);
  //     setData(combinedData);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  
  
  const quotationAxios = axios.create({
    baseURL: "https://crmdemo.vimubds5.a2hosted.com/api",
  });
  
  const invoiceAxios = axios.create({
    baseURL: "https://crmdemo.vimubds5.a2hosted.com/api",
  });
  

  
  const leadsAxios = axios.create({
    baseURL: "https://crmdemo.vimubds5.a2hosted.com/api",
  });
  
  const formatData = (data) => {
    return data.map((item) => ({
      ...item,
      created_date: moment(item.created_date).format('DD/MM/YYYY'),
      createdTime: moment(item.createdTime).format('DD/MM/YYYY'),
    }));
  };
  
  const getQuotationData = async () => {
    try {
      const results = await Promise.allSettled([
        quotationAxios.get(`/get-quotation-byEmploye/${EmpId}`),
        invoiceAxios.get(`/get-employee-invoice/${EmpId}`),
        leadsAxios.get(`/employe-leads/${EmpId}`),
      ]);
  
      // Initialize empty response objects
      let quotationData = [];
      let invoiceData = [];
      let leadsData = [];
  
      // Handle each result
      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          switch (index) {
            case 0:
              quotationData = formatData(result.value.data);
              break;
            case 1:
              invoiceData = formatData(result.value.data);
              break;
            case 2:
              leadsData = formatData(result.value.data);
              break;
            default:
              break;
          }
        } else {
          console.error(`Error fetching data for index ${index}:`, result.reason);
        }
      });
  
      const combinedData = {
        quotation: quotationData,
        invoice: invoiceData,
        leads: leadsData,
      };
  
      const updatedDataFields = {
        ...dataFields,
        quotation: {
          ...dataFields.quotation,
          quotation: combinedData.quotation,
        },
        invoice: {
          ...dataFields.invoice,
          invoice: combinedData.invoice,
        },
        leads: {
          ...dataFields.leads,
          leads: combinedData.leads,
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
      <EmployeeSider />
      <h1 className="text-2xl text-center mt-[5rem] ">Employee Report</h1>
        <div className="mx-auto h-[3px] w-16 bg-[#34495E] my-3"></div>

      <div className="container flex flex-col min-h-screen p-4 lg:p-8">
        <div className="flex flex-col space-y-4 lg:space-y-0 lg:flex-row justify-between mb-8">
          <div className="flex flex-wrap justify-center max-sm:justify-start">
            {["quotation", "invoice", "leads"].map((category) => (
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

          <div className="flex flex-wrap items-center lg:flex-row justify-center max-sm:justify-start">
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

            <div className="flex items-center p-2 bg-gray-100 border mr-2 mb-2 rounded-lg mt-0">
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
              className="flex items-center px-4 py-2 text-white mr-2 mb-2 bg-blue-500 hover:bg-blue-700 rounded-lg    mt-0"
            >
              <BsDownload className="mr-2" /> Download
            </button>
          </div>
        </div>
        

        <div className="overflow-x-auto rounded-lg shadow-md">
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
          totalItems={data?.[selectedCategory]?.length}
          itemsPerPage={rowPerPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </>
  );
};

export default EmployeeReport;