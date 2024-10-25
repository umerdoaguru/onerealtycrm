import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import { useSelector } from "react-redux";
import ReactPaginate from "react-paginate";
import * as XLSX from "xlsx";
import styled from "styled-components";
import MainHeader from "../../MainHeader";
import EmployeeSider from "../EmployeeSider";

const EmployeeVisitData = () => {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const leadsPerPage = 10; // Default leads per page
  const EmpId = useSelector((state) => state.auth.user.id);

  // Fetch leads from the API
  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await axios.get(
        `http://localhost:9000/api/employe-leads/${EmpId}`
      );
      // Filter out leads where visit is "Pending"
      const nonPendingLeads = response.data.filter(
        (lead) => lead.visit !== "pending"
      );

      setLeads(nonPendingLeads);
      setFilteredLeads(nonPendingLeads); // Initial data set for filtering
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
  };

  // Automatically apply date filter when start or end date changes
  useEffect(() => {
    if (startDate && endDate) {
      const filtered = leads.filter((lead) => {
        const visitDate = moment(lead.visit_date, "YYYY-MM-DD");
        return visitDate.isBetween(startDate, endDate, undefined, "[]");
      });
      setFilteredLeads(filtered);
    } else {
      setFilteredLeads(leads);
    }
  }, [startDate, endDate, leads]);

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
  };

  return (
    <Wrapper>
      <div className="flex-grow md:p-4 mt-14 lg:mt-0 sm:ml-0">
        <center className="text-2xl text-center mt-8 font-medium">
          Total Visits
        </center>
        <center className="mx-auto h-[3px] w-16 bg-[#34495E] my-3"></center>
        {/* Date Filter */}
        <div className="flex space-x-1 mb-4 sm:flex-row flex-col ">
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
          <div className="respo mx-2">
            <button
              onClick={downloadExcel}
              className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded"
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
      <td colSpan="11" className="px-6 py-4 border-b border-gray-200 text-center text-gray-500">
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
          {currentPage * leadsPerPage + index + 1}
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

        <ReactPaginate
          previousLabel={"Previous"}
          nextLabel={"Next"}
          breakLabel={"..."}
          pageCount={pageCount}
          marginPagesDisplayed={2}
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
        />
      </div>
    </Wrapper>
  );
};

export default EmployeeVisitData;

const Wrapper = styled.div`
  
  .pagination-container {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem; // Reduced gap for better spacing
    margin-top: 1.5rem;
  }

  .pagination-page {
    background-color: #ffffff;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: background-color 0.3s, transform 0.2s;
  }

  .pagination-link {
    padding: 0.5rem 1rem; // Increased padding for better click area
    font-size: 0.875rem;
    color: #3b82f6;
    text-decoration: none;
    transition: color 0.3s;

    &:hover {
      color: #2563eb;
    }
  }

  .pagination-previous,
  .pagination-next,
  .pagination-break {
    background-color: #ffffff;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: background-color 0.3s, transform 0.2s;
  }

  .pagination-link-previous,
  .pagination-link-next,
  .pagination-break-link {
    padding: 0.5rem 1rem; // Increased padding for consistency
    font-size: 0.875rem;
    color: #374151;
    transition: background-color 0.3s;

    &:hover {
      background-color: #f3f4f6; // Light gray on hover
      transform: translateY(-1px); // Subtle lift effect
    }
  }

  .pagination-active {
    background-color: #1e50ff;
    color: white;
    border: 1px solid #374151;
    border-radius: 0.375rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  .pagination-active .pagination-link {
    color: white !important; // Ensure link inside active page is white
  }
`;