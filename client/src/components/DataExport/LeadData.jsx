import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import * as XLSX from "xlsx";
import ReactPaginate from "react-paginate"; // Import react-paginate
import Sider from "../Sider";
import Header from "../../pages/Quotation/Header";
import styled from "styled-components";

function LeadData() {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");

  const [currentPage, setCurrentPage] = useState(0);
  const leadsPerPage = 10; // Default leads per page

  // Fetch leads and employees from the API
  useEffect(() => {
    fetchLeads();
    fetchEmployees();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await axios.get("http://localhost:9000/api/leads");
      setLeads(response.data);
      setFilteredLeads(response.data); // Initial data set for filtering
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await axios.get("http://localhost:9000/api/employee");
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  // Automatically apply date and employee filters when start or end date changes or when an employee is selected
  useEffect(() => {
    let filtered = leads;

    if (startDate && endDate) {
      filtered = filtered.filter((lead) => {
        const createdTime = moment(lead.createdTime, "YYYY-MM-DD");
        return createdTime.isBetween(startDate, endDate, undefined, "[]");
      });
    }

    if (selectedEmployee) {
      filtered = filtered.filter((lead) => lead.assignedTo === selectedEmployee);
    }

    setFilteredLeads(filtered);
    setCurrentPage(0); // Reset to first page on filter change
  }, [startDate, endDate, selectedEmployee, leads]);

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredLeads);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Leads");
    XLSX.writeFile(workbook, "LeadsData.xlsx");
  };

  // Pagination logic
  const pageCount = Math.ceil(filteredLeads.length / leadsPerPage);
  const currentLeads = filteredLeads.slice(
    currentPage * leadsPerPage,
    (currentPage + 1) * leadsPerPage
  );

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
    console.log("change current page ", data.selected);
  };
  return (
    <Wrapper>
      <Header />
      <Sider />
      <div className="container">
        <h1 className="text-2xl text-center mt-[2rem] font-medium">
          Leads Data
        </h1>
        <div className="mx-auto h-[3px] w-16 bg-[#34495E] my-3"></div>

        {/* Date Filter */}
        <div className="flex space-x-1 mb-4 sm:flex-row flex-col">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border p-2"
          />
          <div className="p-2">
            <p>to</p>
          </div>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border p-2"
          />

          {/* Employee Filter */}
          <div className="">
            <select
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              className="border p-2"
            >
              <option value="">Select Employee</option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.name}>
                  {employee.name}
                </option>
              ))}
            </select>
          </div>

          {/* Download Button */}
          <div className="respo mx-2">
            <button
              onClick={downloadExcel}
              className="bg-blue-500 text-white font-medium px-4 py-2 rounded hover:bg-blue-700"
            >
              Download Excel
            </button>
          </div>
        </div>

        <div className="overflow-x-auto mt-4">
          <table className="min-w-full bg-white border">
            <thead>
              <tr>
                <th className="px-6 py-3 border-b-2 border-gray-300">S.no</th>
                <th className="px-6 py-3 border-b-2 border-gray-300">Lead Number</th>
                <th className="px-6 py-3 border-b-2 border-gray-300">Assigned To</th>
                <th className="px-6 py-3 border-b-2 border-gray-300">Created Time</th>
                <th className="px-6 py-3 border-b-2 border-gray-300">Name</th>
                <th className="px-6 py-3 border-b-2 border-gray-300">Phone</th>
                <th className="px-6 py-3 border-b-2 border-gray-300">Lead Source</th>
              </tr>
            </thead>
            <tbody>
  {currentLeads.length === 0 ? (
    <tr>
      <td
        colSpan="11"
        className="px-6 py-4 border-b border-gray-200 text-center text-gray-500"
      >
        No data found
      </td>
    </tr>
  ) : (
    currentLeads.map((lead, index) => (
      <tr key={lead.id} className={index % 2 === 0 ? "bg-gray-100" : ""}>
        <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
          {index + 1 + currentPage * leadsPerPage}
        </td>
        <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
          {lead.lead_no}
        </td>
        <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
          {lead.assignedTo}
        </td>
        <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
          {moment(lead.createdTime).format("DD/MM/YYYY")}
        </td>
        <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
          {lead.name}
        </td>
        <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
          {lead.phone}
        </td>
        <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
          {lead.leadSource}
        </td>
      </tr>
    ))
  )}
</tbody>

          </table>
        </div>

        {/* Pagination */}
        <div className="mt-2 mb-2 flex justify-center">
  <ReactPaginate
    previousLabel="Previous"
    nextLabel="Next"
    breakLabel="..."
    pageCount={pageCount}
    marginPagesDisplayed={2}
    forcePage={currentPage}
    pageRangeDisplayed={5}
    onPageChange={handlePageClick}
    containerClassName="flex justify-center items-center gap-3 mt-6"
    pageClassName="bg-white border border-gray-300 rounded-md shadow-sm"
    pageLinkClassName="px-4 py-2 text-sm text-blue-600 no-underline hover:text-blue-700"
    previousClassName="bg-white border border-gray-300 rounded-md shadow-sm"
    previousLinkClassName="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
    nextClassName="bg-white border border-gray-300 rounded-md shadow-sm"
    nextLinkClassName="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
    breakClassName="bg-white border border-gray-300 rounded-md shadow-sm"
    breakLinkClassName="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
    activeClassName="bg-blue-600 text-white border border-gray-700 rounded-md shadow-sm"
  />
</div>
      </div>
    </Wrapper>
  );
}

export default LeadData;

const Wrapper = styled.div`
  .respo {
    @media screen and (max-width: 768px) {
      margin-top: 1rem;
    }
  }

  .active {
  background-color: #1e50ff;
}
 /* Container class */
 .pagination-container {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.75rem;
    margin-top: 1.5rem;
  }

  /* Page item */
  .pagination-page {
    background-color: white;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  /* Page link */
  .pagination-link {
    padding: 0.25rem 1rem;
    font-size: 0.875rem;
    color: #3b82f6;
    text-decoration: none;
    &:hover {
      color: #2563eb;
    }
  }

  /* Previous button */
  .pagination-previous {
    background-color: white;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  } 

  .pagination-link-previous {
    padding: 0.25rem 1rem;
    font-size: 0.875rem;
    color: #374151;
    &:hover {
      background-color: #f3f4f6;
    }
  }

  /* Next button */
  .pagination-next {
    background-color: white;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .pagination-link-next {
    padding: 0.25rem 1rem;
    font-size: 0.875rem;
    color: #374151;
    &:hover {
      background-color: #f3f4f6;
    }
  }

  /* Break item */
  .pagination-break {
    background-color: white;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .pagination-break-link {
    padding: 0.25rem 1rem;
    font-size: 0.875rem;
    color: #374151;
    &:hover {
      background-color: #f3f4f6;
    }
  }

  /* Active page */
  .pagination-active {
    background-color: #1e50ff;
    color: white;
    border: 1px solid #374151;
    border-radius: 0.375rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .pagination-active a {
    color: white !important;
  }
`;
