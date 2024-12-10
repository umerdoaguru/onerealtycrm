import React, { useState, useEffect } from "react";
import moment from "moment";

import { Link, useNavigate, useParams } from "react-router-dom";

import axios from "axios";
import ReactPaginate from "react-paginate";
import styled from "styled-components";
import MainHeader from "./../../components/MainHeader";
import SuperAdminSider from "./SuperAdminSider";
import cogoToast from "cogo-toast";
import Super_Single_Lead_Profile from "./Super_Single_Lead_Profile";

function SuperEmployeeLeads() {  
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [leadsPerPage, setLeadsPerPage] = useState(10);
  const [leadSourceFilter, setLeadSourceFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [visitFilter, setVisitFilter] = useState("");
  const [dealFilter, setDealFilter] = useState("");
  const [leadStatusFilter, setLeadStatusFilter] = useState("");
  const [leadnotInterestedStatusFilter, setLeadnotInterestedStatusFilter] = useState("");
  const [meetingStatusFilter, setMeetingStatusFilter] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);

  const [isModalOpenLeadProfile, setIsModalOpenLeadProfile] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState(null);


  


  const navigate = useNavigate();

  const { id } = useParams();

  // Fetch leads from the API
  useEffect(() => {
    fetchLeads();
    // fetchVisit();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await axios.get(
        // `https://crmdemo.vimubds5.a2hosted.com/api/leads-visits/${id}`
           `https://crmdemo.vimubds5.a2hosted.com/api/employe-leads/${id}`
      );
      const data = response.data;
      console.log(data);
      setLeads(data.reverse());
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
  };
  // const fetchVisit = async () => {
  //   try {
  //     const response = await axios.get(
  //       // `https://crmdemo.vimubds5.a2hosted.com/api/employe-all-visit`
  //         `https://crmdemo.vimubds5.a2hosted.com/api/employe-all-visit`
  //     );
  //     console.log(response.data);
  //     setVisit(response.data);
  //     // Ensure proper comparison with 'Created', trim any spaces and normalize the case
    
  //   } catch (error) {
  //     console.error("Error fetching quotations:", error);
  //   }
  // };

  const handleInputChange = (e) => {
    setModalData({
      ...modalData,
      [e.target.name]: e.target.value,
    });
  };

  const updateAnswerRemark = async () => {
    try {
      const response = await axios.put(`https://crmdemo.vimubds5.a2hosted.com/api/updateOnlyAnswerRemark`, modalData);
      if (response.status === 200) {
        cogoToast.success("AnswerRemark updated successfully!");
       fetchLeads();
        closeModal(); // Close the modal
      }
    } catch (error) {
      console.error("Error updating AnswerRemark:", error);
    }
  };

  

  const handleSearch = (value) =>{
    if(value === ' '){
      return;
    }
    setSearchTerm(value);
  }

  useEffect(() => {
    let filtered = leads;
    console.log(filtered);
    // Filter by search term
    if (searchTerm) {
      const trimmedSearchTerm = searchTerm.toLowerCase().trim(); // Normalize the search term
      filtered = filtered.filter((lead) =>
        ["name", "lead_no", "leadSource","phone"].some((key) =>
          lead[key]?.toLowerCase().trim().includes(trimmedSearchTerm)
        )
      );
    }

    // Filter by date range
    if (startDate && endDate) {
      filtered = filtered.filter((lead) => {
        const leadDate = moment(lead.createdTime).format("YYYY-MM-DD");
        return leadDate >= startDate && leadDate <= endDate;
      });
    }

    // Filter by lead source
    if (leadSourceFilter) {
      filtered = filtered.filter(
        (lead) => lead.leadSource === leadSourceFilter
      );
    }
    // Filter by status
    if (statusFilter) {
      filtered = filtered.filter((lead) => lead.status === statusFilter);
    }

    // Filter by visit
    if (visitFilter) {
      filtered = filtered.filter((lead) => lead.visit === visitFilter);
    }

    // Filter by Deak
    if (dealFilter) {
      filtered = filtered.filter((lead) => lead.dealStatus === dealFilter);
    }

    if (leadStatusFilter) {
      console.log(leadStatusFilter);
      filtered = filtered.filter((lead) => lead.lead_status === leadStatusFilter);
      console.log(filtered);
    }
    if (leadnotInterestedStatusFilter) {
      console.log(leadnotInterestedStatusFilter);
    
      if (leadnotInterestedStatusFilter === "other") {
        // Exclude "price", "budget", "distance" and show all other data
        filtered = filtered.filter(
          (lead) => !["price", "budget", "distance"].includes(lead.reason)
        );
      } else {
        // Filter by specific reason
        filtered = filtered.filter(
          (lead) => lead.reason === leadnotInterestedStatusFilter
        );
      }
    
      console.log(filtered);
    }
    

    if (meetingStatusFilter) {
      console.log(meetingStatusFilter);
      filtered = filtered.filter((lead) => lead.meeting_status === meetingStatusFilter);
      console.log(filtered);
    }

    setFilteredLeads(filtered);
  }, [
    searchTerm,
    startDate,
    endDate,
    leads,
    leadSourceFilter,
    statusFilter,
    visitFilter,
    dealFilter,
    leadStatusFilter,
    leadnotInterestedStatusFilter,
    meetingStatusFilter
  ]);

  // Use filteredLeads for pagination
  const indexOfLastLead = (currentPage + 1) * leadsPerPage;
  const indexOfFirstLead = indexOfLastLead - leadsPerPage;


  // const currentLeads = filteredLeads.slice(indexOfFirstLead, indexOfLastLead);
  const currentLeads = leadsPerPage === Infinity ? filteredLeads : filteredLeads.slice(indexOfFirstLead, indexOfLastLead);

const pageCount = Math.ceil(filteredLeads.length / leadsPerPage);

const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const handleLeadsPerPageChange = (e) => {
    const value = e.target.value;
    setLeadsPerPage(value === "All" ? Infinity : parseInt(value, 10));
    setCurrentPage(0); // Reset to the first page
  };
  

  const openModal = (data) => {
    setModalData(data);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalData(null);
  };

  // Function to open modal and set lead_id
const handleRowClick = (leadId) => {
  setSelectedLeadId(leadId);
  setIsModalOpenLeadProfile(true);
};

// Function to close the modal
const closeModalLead = () => {
  setIsModalOpenLeadProfile(false);
  setSelectedLeadId(null);
};


  return (
    <>
      <MainHeader />
      <SuperAdminSider />
      <Wrapper>
        <div className="container mt-28 2xl:ml-40">
          <div className="main 2xl:w-[89%] ">
            <div>
              <button
                onClick={() => navigate(-1)}
                className="bg-blue-500 text-white px-3 py-1 max-sm:hidden rounded-lg hover:bg-blue-600 transition-colors max-2xl:ml-[4rem]"
              >
                Back
              </button>
              <h1 className="text-xl sm:text-2xl text-center">
                Leads Management{" "}
              </h1>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-5 mb-4"></div>

            {/* Button to create a new lead */}
            <div className="grid max-sm:grid-cols-2 sm:grid-cols-3  lg:grid-cols-5 gap-4 mb-4">
              <div>
                <label htmlFor="">Search</label>
                <input
                  type="text"
                   placeholder=" Name,Lead No,Lead Source,Phone No"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border rounded-2xl p-2 w-full"
                />
              </div>
              <div>
                <label htmlFor="">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="border  rounded-2xl p-2 w-full"
                />
              </div>

              <div>
                <label htmlFor="">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="border   rounded-2xl p-2 w-full"
                />
              </div>
              <div>
                <label htmlFor="">Lead Source Filter</label>
                <select
                  value={leadSourceFilter}
                  onChange={(e) => setLeadSourceFilter(e.target.value)}
                  className="border rounded-2xl p-2 w-full"
                >
                   <option value="">Select Lead Source</option>
                     <option value="Facebook">Facebook</option>
                    <option value="One Realty Website">
                      One Realty Website
                    </option>
                    <option value="99 Acres">
                    99 Acres
                    </option>
                    <option value="Referrals">Referrals</option>
                    <option value="Cold Calling">Cold Calling</option>
                    <option value="Email Campaigns">Email Campaigns</option>
                    <option value="Networking Events">Networking Events</option>
                    <option value="Paid Advertising">Paid Advertising</option>
                    <option value="Content Marketing">Content Marketing</option>
                    <option value="SEO">Search Engine Optimization</option>
                    <option value="Trade Shows">Trade Shows</option>
                   
                    <option value="Affiliate Marketing">
                      Affiliate Marketing
                    </option>
                    <option value="Direct Mail">Direct Mail</option>
                    <option value="Online Directories">
                      Online Directories
                    </option>
                </select>
              </div>

           
              <div>
                <label htmlFor="">Visit Filter</label>
                <select
                  value={visitFilter}
                  onChange={(e) => setVisitFilter(e.target.value)}
                  className="border rounded-2xl p-2 w-full"
                >
                  <option value="">All visit</option>
                  <option value="fresh">Fresh Visit</option>
                  <option value="re-visit">Re-Visit</option>
                  <option value="associative">Associative Visit</option>
                  <option value="self">Self Visit</option>
                </select>
              </div>
              <div>
                <label htmlFor="">Deal Filter</label>
                <select
                  value={dealFilter}
                  onChange={(e) => setDealFilter(e.target.value)}
                  className="border rounded-2xl p-2 w-full"
                >
                  <option value="">All Deal</option>
                  <option value="pending">Pending</option>
                  <option value="in progress">In Progress</option>
                  <option value="close">Closed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <label htmlFor="">Lead Status</label>
                <select
                  value={leadStatusFilter}
                  onChange={(e) => setLeadStatusFilter(e.target.value)}
                  className="border rounded-2xl p-2 w-full"
                >
                  <option value="">All Lead Status</option>
                  <option value="pending">Pending</option>
                  <option value="active lead">Active Lead</option>
                  <option value="calling done">Calling Done</option>
                  <option value="site visit done">Site Visit Done</option>
                  <option value="interested">Interested</option>
                  <option value="not-interested">Not-Interested</option>
        
                 
                  <option value="completed">Completed</option>
                </select>
              </div>
              {leadStatusFilter === "not-interested" && (
  <div>
  <label htmlFor="">Not Interested</label>
  <select
    value={leadnotInterestedStatusFilter}
    onChange={(e) => setLeadnotInterestedStatusFilter(e.target.value)}
    className="border rounded-2xl p-2 w-full"
  >
    <option value="">All Not Interested</option>
    <option value="price">Price</option>
    <option value="budget">Budget</option>
    <option value="distance">Distance</option>
       <option value="other">Other</option>
   
   

  </select>
</div>


              )}
              
              <div>
                <label htmlFor="">Meeting Status</label>
                <select
                  value={meetingStatusFilter}
                  onChange={(e) => setMeetingStatusFilter(e.target.value)}
                  className="border rounded-2xl p-2 w-full"
                >
                  <option value="">All Meeting Status</option>
                  <option value="pending">Pending</option>
                  <option value="done by director">Done By Director</option>
                  <option value="done by manager">Done By Manager</option>
                 
                </select>
              </div>
            
            </div>
          </div>
         

<div className="flex gap-10 text-xl font-semibold my-3 mt-5">
  {/* Total Lead Count */}
  <div>
    Total Lead:{" "}
    {
      leads
        .filter(
          (lead) =>
          
            (!leadSourceFilter || lead.leadSource === leadSourceFilter)
        ).length
    }
  </div>

  {/* Total Lead Visits */}
  <div>
    Total Lead Visit:{" "}
    {
      leads
        .filter(
          (lead) =>
           
            (!leadSourceFilter || lead.leadSource === leadSourceFilter)
        )
        .filter(
          (lead) =>
            ["fresh", "repeated", "self", "associative"].includes(lead.visit)
        ).length
    }
  </div>

  {/* Total Closed Leads */}
  <div>
    Total Closed Lead:{" "}
    {
      leads
        .filter(
          (lead) =>
           
            (!leadSourceFilter || lead.leadSource === leadSourceFilter)
        )
        .filter((lead) => lead.deal_status === "close").length
    }
  </div>

  <select
            onChange={handleLeadsPerPageChange}
            className="border rounded-2xl w-1/4"
          
          >
                <option value={10}>Number of rows: 10</option>
           
           <option value={20}>20</option>
           <option value={50}>50</option>
           <option value="All">All</option>
          </select>
</div>

          <div className="overflow-x-auto mt-2 2xl:w-[89%]">
        

            <table className="tt min-w-full bg-white border whitespace-nowrap">
              <thead>
                <tr>
                  <th className="px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm border-y-2 border-gray-300 text-left">
                    S.no
                  </th>
                  <th className="px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm border-y-2 border-gray-300 text-left">
                    Lead Number
                  </th>
                  <th className="px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm border-y-2 border-gray-300 text-left">
                    Name
                  </th>
                  <th className="px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm border-y-2 border-gray-300 text-left">
                    Phone
                  </th>
                  <th className="px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm border-y-2 border-gray-300 text-left">
                    Lead Source
                  </th>
                  <th className="px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm border-y-2 border-gray-300 text-left">
                    Assigned To
                  </th>
               
                  <th className="px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm border-y-2 border-gray-300 text-left">
                    Lead Status
                  </th>
                  <th className="px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm border-y-2 border-gray-300 text-left">
                    Reason
                  </th>
                  <th className="px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm border-y-2 border-gray-300 text-left">
                    Meeting Status
                  </th>
                 
                  <th className="px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm border-y-2 border-gray-300 text-left">
                    Remark Status
                  </th>
                  <th className="px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm border-y-2 border-gray-300 text-left">
                    Answer Remark
                  </th>
                  <th className="px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm border-y-2 border-gray-300 text-left">
                  Assigned Date
                  </th>
                
                
               
                </tr>
              </thead>
              <tbody>
  {currentLeads.length > 0 ? (
    currentLeads.map((lead, index) => (
      <tr
        key={index}
        className={index % 2 === 0 ? "bg-gray-100" : ""}
      >
        <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
        {leadsPerPage === Infinity ? index + 1 : index + 1 + currentPage * leadsPerPage}
        </td>
        <td
  className="px-6 py-4 border-b border-gray-200 underline text-[blue] cursor-pointer"
  onClick={() => handleRowClick(lead.lead_id)}
>
  {lead.lead_no}
</td>
        <td className="px-6 py-4 border-b border-gray-200 text-gray-800 text-wrap">
          {lead.name}
        </td>
        <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
          {lead.phone || "9630412500"}
        </td>
        <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
          {lead.leadSource || "Ofline"}
        </td>
        <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
          {lead.assignedTo || "NA"}
        </td>
      
      
          <td className="px-6 py-4 border-b border-gray-200 font-semibold">
            {lead.lead_status}
          </td>
          <td className="px-6 py-4 border-b border-gray-200 font-semibold">
            {lead.reason}
          </td>
          <td className="px-6 py-4 border-b border-gray-200 font-semibold">
            {lead.meeting_status}
          </td>
      
       
        <td className="px-6 py-4 border-b border-gray-200 text-gray-800 text-wrap">
          {lead.remark_status}
        </td>
        <td className="px-6 text-[blue] underline cursor-pointer text-wrap"  onClick={() => openModal(lead)}>
          {lead.answer_remark}
          
                         
        </td>
        <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
          {moment(lead.createdTime).format("DD MMM YYYY").toUpperCase()}
        </td>
      
      
       
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan={15} className="py-4 text-center">
        No data found
      </td>
    </tr>
  )}
</tbody>

            </table>
          </div>

          {isModalOpen && (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-[500px]">
      <h2 className="text-xl mb-4 font-bold">Edit Visit</h2>
      <form>
    
        
        <div className="mb-4">
          <label className="block text-gray-700">Remark Status:</label>
          <input
            type="text"
            name="remark_status"
            value={modalData.remark_status || ""}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded"
            disabled
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Answer Remarks</label>
          <input
            type="text"
            name="answer_remark"
            value={modalData.answer_remark || ""}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded"
          />
        </div>


        <div className="flex justify-end">
          <button
            type="button"
            onClick={updateAnswerRemark}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 mr-2"
          >
            Update
          </button>
          <button
            type="button"
            onClick={closeModal}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
)}

<div className="mt-4 flex mb-4 justify-center 2xl:w-[89%]">
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
{isModalOpenLeadProfile && selectedLeadId && (
       <div className=" fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-[1055]">
              <div className="w-75 bg-white p-6 rounded-lg shadow-lg max-h-[80vh] overflow-auto mx-4 my-5">
     
              <Super_Single_Lead_Profile id={selectedLeadId} closeModalLead={closeModalLead} />
            
    </div>
  </div>
)}
      </Wrapper>
    </>
  );
}

export default SuperEmployeeLeads;

const Wrapper = styled.div`

`;
