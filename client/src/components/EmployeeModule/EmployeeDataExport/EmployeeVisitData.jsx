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
  const leadsPerPage = 7; // Default leads per page
  const EmpId = useSelector((state) => state.auth.user);
  const token = EmpId?.token;
  const [selectedColumns, setSelectedColumns] = useState([
    "lead_no",
    "assignedTo",
    "name",
    "phone",
    "leadSource",
    "remark_status",
    "answer_remark",
    "meeting_status",
    "assignedBy",
    "lead_status",
    "address",
    "booking_amount",
    "deal_status",
    "employeeId",
    "follow_up_status",
    "payment_mode",
    "quotation",
    "quotation_status",
    "reason",
    "registry",
   
    "subject",
    "visit",
    "visit_date",
    "d_closeDate",
    "createdTime",
    "actual_date",
    
  ]);

  // Fetch leads from the API
  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await axios.get(
        `https://crm.one-realty.in/api/employe-leads/${EmpId.id}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }}
      );
      // Filter out leads where visit is "Pending"
      const nonPendingLeads = response.data.filter((lead) =>
        ["fresh", "re-visit", "self", "associative"].includes(lead.visit)
      );

      setLeads(nonPendingLeads);
      setFilteredLeads(nonPendingLeads); // Initial data set for filtering
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
  };

  useEffect(() => {
    let filtered = leads;

    // Filter by date
    if (startDate && endDate) {
      filtered = filtered.filter((lead) => {
        const visitDate = moment(lead.visit_date, "YYYY-MM-DD");
        return visitDate.isBetween(startDate, endDate, undefined, "[]");
      });
    }

   
    setFilteredLeads(filtered);
  }, [startDate, endDate,  leads]);

  const downloadExcel = () => {
    // Map to rename keys for export
    const columnMapping = {
      lead_no: "Lead Number",
      assignedTo: "Assigned To",
      name: "Name",
      phone: "Phone",
      leadSource: "Lead Source",
      remark_status: "Remark Status",
      answer_remark: "Answer Remark",
      meeting_status: "Meeting Status",
      assignedBy: "Assigned By",
      lead_status: "Lead Status",
      address: "Address",
      booking_amount: "Booking Amount",
      deal_status: "Deal Status",
      employeeId: "Employee ID",
      follow_up_status: "Follow-up Status",
      payment_mode: "Payment Mode",
      quotation: "Quotation",
      quotation_status: "Quotation Status",
      reason: "Reason",
      registry: "Registry",
    
      subject: "Project",
      visit: "Visit",
      visit_date: "Visit Date",
      d_closeDate: "Close Date",
      createdTime: "Assigned Date",
      actual_date: "Actual Date",
    };
  
    const completedLeads = filteredLeads.map((lead) => {
      const formattedLead = {};
    
      selectedColumns.forEach((col) => {
        const newKey = columnMapping[col] || col;
    
        if (["actual_date", "createdTime", "visit_date", "d_closeDate"].includes(col)) {
          // Check if date exists and is valid
          formattedLead[newKey] =
            lead[col] && moment(lead[col], moment.ISO_8601, true).isValid()
              ? moment(lead[col]).format("DD MMM YYYY").toUpperCase()
              : "pending"; // If invalid or missing, set as "PENDING"
        } else {
          formattedLead[newKey] = lead[col]; // Assign other fields normally
        }
      });
    
      return formattedLead;
    });
       // Ensure we handle empty reports gracefully
  if (completedLeads.length === 0) {
    alert("No data available for the selected date range.");
    return;
  }

  // Generate the Excel workbook
  const worksheet = XLSX.utils.json_to_sheet(completedLeads);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Report");

  // Generate a valid filename
  const filename = ` Lead Report ${
    startDate ? moment(startDate).format("DD-MM-YYYY") : "Start"
  } to ${
    endDate ? moment(endDate).format("DD-MM-YYYY") : "End"
  }.xlsx`;

  // Download the Excel file
  XLSX.writeFile(workbook, filename);
  
  
  };


 // Calculate total number of pages
 const pageCount = Math.ceil(filteredLeads.length / leadsPerPage);

 // Pagination logic
 const indexOfLastLead = (currentPage + 1) * leadsPerPage;
 const indexOfFirstLead = indexOfLastLead - leadsPerPage;
 const currentLeads = filteredLeads.slice(indexOfFirstLead, indexOfLastLead);
 
  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  return (
    <>
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
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      S.no
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                     Lead Id 
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                     Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Assigned To
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Visit 
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Visit Date
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
    currentLeads.map((visit, index) => (  
      <tr
        key={visit.id}
        className={index % 2 === 0 ? "bg-gray-100" : ""}
      >
        <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
          {currentPage * leadsPerPage + index + 1}
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
                      {visit.lead_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {visit.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                     {visit.assignedTo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                     {visit.visit}
                    </td>
                    <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
                     {visit.visit_date === "pending"
                       ? "pending"
                       : moment(visit.visit_date).format("DD MMM YYYY").toUpperCase()}
                   </td>
                   
      </tr>
    ))
  )}
</tbody>

          </table>
        </div>

        <div className="mt-4 flex justify-center">
        <ReactPaginate
          previousLabel={"Previous"}
          nextLabel={"Next"}
          breakLabel={"..."}
          pageCount={pageCount}
              forcePage={currentPage} 
          marginPagesDisplayed={2}
          pageRangeDisplayed={3}
          onPageChange={handlePageClick}
          containerClassName={"pagination"}
          activeClassName={"active"}
          pageClassName={"page-item"}
          pageLinkClassName={"page-link"}
          previousClassName={"page-item"}
          nextClassName={"page-item"}
          previousLinkClassName={"page-link"}
          nextLinkClassName={"page-link"}
          breakClassName={"page-item"}
          breakLinkClassName={"page-link"}
        />
      </div>
      </div>
    </>
  );
};

export default EmployeeVisitData;

