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

      <div className="main overflow-x-auto mt-4 px-12 lg:ml-12 xl:ml-32">
        <table className="bg-white border w-100">
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
      <>

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
        </>
    </>
  );
};

export default SuperAdminTotalLead;





