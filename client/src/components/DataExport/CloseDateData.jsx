import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import { useSelector } from "react-redux";
import ReactPaginate from "react-paginate";
import * as XLSX from "xlsx";
import styled from "styled-components";

const CloseData = () => {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const leadsPerPage = 10; // Number of leads to display per page
  const EmpId = useSelector((state) => state.auth.user.id);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");


  // Fetch leads from the API
  useEffect(() => {
    fetchLeads();
    fetchEmployees();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await axios.get(
        `http://localhost:9000/api/leads`
      );
      // Filter out leads where deal status is "pending"
      const nonPendingLeads = response.data.filter(
        (lead) => lead.deal_status !== "pending"
      );

      setLeads(nonPendingLeads);
      setFilteredLeads(nonPendingLeads); // Initial data set for filtering
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


  // Automatically apply date filter when start or end date changes
  useEffect(() => {
    let filtered = leads;

    if (startDate && endDate) {
      filtered = filtered.filter((lead) => {
        const closeDate = moment(lead.d_closeDate, "YYYY-MM-DD");
        return closeDate.isBetween(startDate, endDate, undefined, "[]");
      });
    }

    
      // Filter by selected employee
    if (selectedEmployee) {
      filtered = filtered.filter((lead) => lead.assignedTo === selectedEmployee);
    }

    setFilteredLeads(filtered);
  }, [startDate, endDate,selectedEmployee, leads]);

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredLeads);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Closed");
    XLSX.writeFile(workbook, "ClosedData.xlsx");
  };

  // Pagination logic
  const pageCount = Math.ceil(filteredLeads.length / leadsPerPage);
  const currentLeads = filteredLeads.slice(
    currentPage * leadsPerPage,
    (currentPage + 1) * leadsPerPage
  );

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  return (
    <Wrapper>
      <div className="container 2xl:w-[95%]">
      <div className="flex-grow mt-14 lg:mt-0 sm:ml-0">
        <center className="text-2xl text-center mt-8 font-medium">
          Closed Deal Data
        </center>
        <center className="mx-auto h-[3px] w-16 bg-[#34495E] my-3"></center>

        {/* Date Filter */}
        <div className="flex  mb-4 sm:flex-row flex-col gap-2">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border p-1"
          />
          <div className="p-1">
            <p>to</p>
          </div>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border p-1"
          />
            <div className="">
            <select
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              className="border p-1"
            >
              <option value="">Select Employee</option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.name}>
                  {employee.name}
                </option>
              ))}
            </select>
          </div>
          <div className="respo  ">
            <button
              onClick={downloadExcel}
              className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded "
            >
              Download Excel
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto mt-4">
          <table className="min-w-full bg-white border">
            <thead>
              <tr>
                <th className="px-6 py-3 border-b-2 border-gray-300">S.no</th>
                <th className="px-6 py-3 border-b-2 border-gray-300">
                  Lead Number
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-300">
                  Assigned To
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-300">
                  Lead Name
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-300">
                  Subject
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-300">Phone</th>
                <th className="px-6 py-3 border-b-2 border-gray-300">
                  Lead Source
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-300">Visit</th>
                <th className="px-6 py-3 border-b-2 border-gray-300">
                  Visit Date
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-300">
                  FollowUp Status
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-300">
                  Deal Status
                </th>
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
                  <tr
                    key={lead.id}
                    className={index % 2 === 0 ? "bg-gray-100" : ""}
                  >
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
                      {lead.name}
                    </td>
                    <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
                      {lead.subject}
                    </td>
                    <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
                      {lead.phone}
                    </td>
                    <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
                      {lead.leadSource}
                    </td>
                    <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
                      {lead.visit}
                    </td>
                    <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
                      {lead.visit_date}
                    </td>
                    <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
                      {lead.follow_up_status}
                    </td>
                    <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
                      {lead.deal_status}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-2 mb-2">
        <ReactPaginate
          previousLabel="Previous"
          nextLabel="Next"
          breakLabel="..."
          pageCount={pageCount}
          marginPagesDisplayed={2}
          forcePage={currentPage}
          pageRangeDisplayed={5}
          onPageChange={handlePageClick}
          containerClassName="pagination-container"
          pageClassName="pagination-page"
          pageLinkClassName="pagination-link"
          previousClassName="pagination-previous"
          previousLinkClassName="pagination-link-previous"
          nextClassName="pagination-next"
          nextLinkClassName="pagination-link-next"
          breakClassName="pagination-break"
          breakLinkClassName="pagination-break-link"
          activeClassName="pagination-active"
        /></div>
      </div></div>
    </Wrapper>
  );
};

export default CloseData;

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
