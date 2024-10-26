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
  const itemsPerPage = 10;
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

  const displayedLeads = filteredLeads.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handlePageClick = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  return (
    <>
      <MainHeader />
      <SuperAdminSider />
      <div className="container mt-[5rem] px-5 2xl:ml-44">
      </div>
      <div className="flex flex-col 2xl:ml-44">
        <div className="flex-grow p-4 mt-14 lg:mt-5 sm:ml-0">
          <center className="text-2xl text-center mt-8 font-medium">
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
                  <th className="px-6 py-3 border-b-2 border-gray-300">FollowUp Status</th>
                  <th className="px-6 py-3 border-b-2 border-gray-300">Deal Status</th>
                  <th className="px-6 py-3 border-b-2 border-gray-300">Deal Close Date</th>
                </tr>
              </thead>
              <tbody>
                {displayedLeads.map((lead, index) => (
                  <tr key={lead.id} className={index % 2 === 0 ? "bg-gray-100" : ""}>
                    <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
                      {index + 1 + currentPage * itemsPerPage}
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
                    <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
                      {lead.d_closeDate}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <PaginationWrapper>
            <ReactPaginate
              previousLabel={"Previous"}
              nextLabel={"Next"}
              breakLabel={"..."}
              pageCount={Math.ceil(filteredLeads.length / itemsPerPage)}
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
          </PaginationWrapper>
        </div>
      </div>
    </>
  );
};

export default SuperAdminTotalClosedDeal;
const PaginationWrapper = styled.div`
padding-bottom: 2rem;
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