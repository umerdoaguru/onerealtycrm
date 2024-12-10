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
  const EmpId = useSelector((state) => state.auth.user.id);
  const [selectedColumns, setSelectedColumns] = useState([
    'lead_id',
'name',
'employee_name',
'employeeId',
'visit',
'report',
'visit_date',

]);

  // Fetch leads from the API
  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await axios.get(
        `https://crmdemo.vimubds5.a2hosted.com/api/employebyid-visit/${EmpId}`
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
        lead_id: "Lead ID",          
        name: "Name",                
        employee_name: "Employee Name", 
        employeeId: "Employee ID",   
        visit: "Visit",              
        report: "Report",             
        visit_date: "Visit Date",    
      };
      
  
    const completedLeads = filteredLeads
      .filter((lead) => lead.visit !== "pending")
      .map((lead) => {
        const formattedLead = {};
  
        // Dynamically include selected columns
        selectedColumns.forEach((col) => {
          const newKey = columnMapping[col] || col; // Use mapped name if available
          formattedLead[newKey] = 
            (col === "visit_date") && lead[col]
              ? moment(lead[col]).format("DD MMM YYYY").toUpperCase()
              : lead[col]; // Format dates or copy value
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
                    <th className="px-6 py-3 border-b-2 border-gray-300 text-black-500">
                      S.no
                    </th>
                    <th className="px-6 py-3 border-b-2 border-gray-300 text-black-500">
                     Lead Id 
                    </th>
                    <th className="px-6 py-3 border-b-2 border-gray-300 text-black-500">
                     Name
                    </th>
                    <th className="px-6 py-3 border-b-2 border-gray-300 text-black-500">
                      Assigned To
                    </th>
                    <th className="px-6 py-3 border-b-2 border-gray-300 text-black-500">
                      Visit 
                    </th>
                    <th className="px-6 py-3 border-b-2 border-gray-300 text-black-500">
                      Report
                    </th>
                    <th className="px-6 py-3 border-b-2 border-gray-300 text-black-500">
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
                     {visit.employee_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                     {visit.visit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                     {visit.report}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                   
          {moment(visit.visit_date).format("DD MMM YYYY").toUpperCase()}

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

