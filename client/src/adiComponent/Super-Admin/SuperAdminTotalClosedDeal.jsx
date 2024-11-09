import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import * as XLSX from "xlsx";
import MainHeader from "../../components/MainHeader";
import SuperAdminSider from "./SuperAdminSider";
import ReactPaginate from "react-paginate";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const SuperAdminTotalClosedDeal = () => {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const leadsPerPage = 7;
  const navigate = useNavigate();

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await axios.get(`http://localhost:9000/api/leads`);
      const nonPendingLeads = response.data.filter((lead) => lead.deal_status !== "pending");
      setLeads(nonPendingLeads);
      setFilteredLeads(nonPendingLeads);
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
  };

  useEffect(() => {
    if (startDate && endDate) {
      const filtered = leads.filter((lead) => {
        const createdTime = moment(lead.createdTime, "YYYY-MM-DD");
        return createdTime.isBetween(startDate, endDate, undefined, "[]");
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
  const pageCount = Math.ceil(filteredLeads.length / leadsPerPage);

  // Pagination logic
  const indexOfLastLead = (currentPage + 1) * leadsPerPage;
  const indexOfFirstLead = indexOfLastLead - leadsPerPage;
  const currentLeads = filteredLeads.slice(indexOfFirstLead, indexOfLastLead);
  
  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
    console.log("change current page ", data.selected);
  };
  return (
    <>
      <MainHeader />
      <SuperAdminSider />
      <div className="container mt-[7rem]  2xl:ml-40">
   
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-500 text-white px-3 py-1 max-sm:hidden rounded-lg hover:bg-blue-600 transition-colors"
          >
            Back
          </button>
       
      </div>
      <div className="flex flex-col 2xl:ml-40">
        <div className="flex-grow p-4 mt-2  sm:ml-0">
          <center className="text-2xl text-center  font-medium">
            Total Closed Deals
          </center>
          <center className="mx-auto h-[3px] w-16 bg-[#34495E] my-3"></center>

          <div className="overflow-x-auto mt-4">
            <table className="min-w-full bg-white border">
              <thead>
                <tr>
                  <th className="px-6 py-3 border-b-2 border-gray-300">S.no</th>
                  <th className="px-6 py-3 border-b-2 border-gray-300">Lead Number</th>
                  <th className="px-6 py-3 border-b-2 border-gray-300">Assigned To</th>
                  <th className="px-6 py-3 border-b-2 border-gray-300">Lead Name</th>
                  <th className="px-6 py-3 border-b-2 border-gray-300">Subject</th>
                  <th className="px-6 py-3 border-b-2 border-gray-300">Phone</th>
                  <th className="px-6 py-3 border-b-2 border-gray-300">Lead Source</th>
                  <th className="px-6 py-3 border-b-2 border-gray-300">Visit</th>
                  <th className="px-6 py-3 border-b-2 border-gray-300">Visit Date</th>
            
                  <th className="px-6 py-3 border-b-2 border-gray-300">Deal Status</th>
                  <th className="px-6 py-3 border-b-2 border-gray-300">Deal Close Date</th>
                </tr>
              </thead>
              <tbody>
                {currentLeads.map((lead, index) => (
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
                      {lead.follow_up_status}
                    </td>
                    <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
                      {lead.deal_status}
                    </td>
                    <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
                      {lead.d_closeDate}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-2 mb-2 flex justify-center">
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
      </div>
    </>
  );
};

export default SuperAdminTotalClosedDeal;
