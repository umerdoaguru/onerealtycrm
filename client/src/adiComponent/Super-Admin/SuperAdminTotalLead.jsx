import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useSelector } from "react-redux";
import SuperAdminSider from "./SuperAdminSider";
import MainHeader from "../../components/MainHeader";
import ReactPaginate from "react-paginate";
import styled from "styled-components";


const SuperAdminTotalLead = () => {
  const [leads, setLeads] = useState([]);
const [currentPage, setCurrentPage] = useState(0);
const leadsPerPage = 10; 
  const navigate = useNavigate();

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await axios.get(`http://localhost:9000/api/leads`);
      console.log(response);
      setLeads(response.data);
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
  };
  const displayedLeads = leads.slice(
    currentPage * leadsPerPage,
    (currentPage + 1) * leadsPerPage
  );

  
  const handlePageClick = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };
  

  
  return (
    <>
      <MainHeader />
      <SuperAdminSider />
      <div className="container px-5 mt-[5rem]">
        <h1 className="text-2xl text-center ">Total Leads </h1>
        <div className="mx-auto h-[3px] w-16 bg-[#34495E] my-3"></div>
      </div>

      <div className="overflow-x-auto mt-4 px-5 ">
        <table className="container bg-white border">
          <thead>
            <tr>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider">
                S.no
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider">
                Lead Number
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider">
                Phone
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider">
                Lead Source
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider">
                Assigned To
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider">
                Subject
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider">
                Lead Status
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider">
                Created Time
              </th>
            </tr>
          </thead>
          <tbody>
          {displayedLeads.map((lead, index) => (
    <tr key={lead.lead_id} className={index % 2 === 0 ? "bg-gray-100" : ""}>
      <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
        {index + 1 + currentPage * leadsPerPage}
      </td>
      <td className="px-6 py-4 border-b border-gray-200">{lead.lead_no}</td>
      <td className="px-6 py-4 border-b border-gray-200 text-gray-800">{lead.name}</td>
      <td className="px-6 py-4 border-b border-gray-200 text-gray-800">{lead.phone}</td>
      <td className="px-6 py-4 border-b border-gray-200 text-gray-800">{lead.leadSource}</td>
      <td className="px-6 py-4 border-b border-gray-200 text-gray-800">{lead.assignedTo}</td>
      <td className="px-6 py-4 border-b border-gray-200 text-gray-800">{lead.subject}</td>
      <td className="px-6 py-4 border-b border-gray-200 text-gray-800">{lead.lead_status}</td>
      <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
        {moment(lead.createdTime).format("YYYY-MM-DD")}
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
          pageCount={Math.ceil(leads.length / leadsPerPage)}
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
    </>
  );
};

export default SuperAdminTotalLead;
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