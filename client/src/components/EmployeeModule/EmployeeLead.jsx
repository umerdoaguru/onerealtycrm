

import React, { useState, useEffect } from "react";
import moment from "moment";

import cogoToast from "cogo-toast";
import { Link, useNavigate } from "react-router-dom";
import MainHeader from "../MainHeader";
import EmployeeSider from "./EmployeeSider";
import UpdateLeadField from "./updateLeadField";
import { useSelector } from "react-redux";
import axios from "axios";
import ReactPaginate from "react-paginate";
import styled from "styled-components";

function EmployeeLead() {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [leadSourceFilter, setLeadSourceFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [visitFilter, setVisitFilter] = useState("");
  const [dealFilter, setDealFilter] = useState("");
  const [leadStatusFilter, setLeadStatusFilter] = useState("");
  const [leadnotInterestedStatusFilter, setLeadnotInterestedStatusFilter] = useState("");
  const [meetingStatusFilter, setMeetingStatusFilter] = useState("");

  const [endDate, setEndDate] = useState("");
  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [leadsPerPage, setLeadsPerPage] = useState(10);

  const navigate = useNavigate();

  const EmpId = useSelector((state) => state.auth.user.id);

  // Fetch leads from the API
  useEffect(() => {
    fetchLeads();
  }, []);
  
  const fetchLeads = async () => {
    try {
      const response = await axios.get(
        `https://crm.one-realty.in/api/employe-leads/${EmpId}`
      );
      const data = response.data;
      console.log(data);
      setLeads(data.reverse()); // Reverse the data here
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
  };
  

  const handleUpdate = async (lead) => {
    try {
      // Send updated data to the backend using Axios
      const response = await axios.put(
        `https://crm.one-realty.in/api/updateOnlyLeadStatus/${lead.lead_id}`,
        { lead_status: "active lead" }
      );

      if (response.status === 200) {
        console.log("Updated successfully:", response.data);
        cogoToast.success("Lead status updated successfully");
        navigate(`/employee-lead-single-data/${lead.lead_id}`);
      } else {
        console.error("Error updating:", response.data);
        cogoToast.error("Failed to update the lead status.");
      }
    } catch (error) {
      console.error("Request failed:", error);
      cogoToast.error("Failed to update the lead status.");
    }
  };


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

    if (filterDate) {
      filtered = filtered.filter((lead) => {
        const leadDate = moment(lead.createdTime).format("YYYY-MM-DD");
        return leadDate === filterDate;
      });
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
      console.log(dealFilter);
      filtered = filtered.filter((deal) => deal.deal_status === dealFilter);
      console.log(filtered);
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
    filterDate,
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

  return (
    <>
      <MainHeader />
      <EmployeeSider />
      {/* <div className=" container"> */}
      <div className="flex flex-col  2xl:ml-44 ">
        <div className="flex-grow p-4 mt-14 lg:mt-5  sm:ml-0">
          <center className="text-2xl text-center mt-8 font-medium">
            Assigned Employee Leads
          </center>
          <center className="mx-auto h-[3px] w-16 bg-[#34495E] my-3"></center>

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
                <label htmlFor="">Manual Date</label>
                <input
                  type="date"
                  value={filterDate}
        onChange={(e) => setFilterDate(e.target.value)}
                  className="border   rounded-2xl p-2 w-full"
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

          <div className="overflow-x-auto rounded-lg shadow-md">
            <table className="min-w-full bg-white">
              
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
                  <th className="px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm border-y-2 border-gray-300 text-left">
                    Action
                  </th>
                
               
                </tr>
              </thead>

              <tbody>
  {currentLeads.length > 0 ? (
    currentLeads.map((lead, index) => (

      <tr
        key={lead.id}
        className={index % 2 === 0 ? "bg-gray-100" : ""}
      >
        <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
        {leadsPerPage === Infinity ? index + 1 : index + 1 + currentPage * leadsPerPage}
        </td>
        <td className="px-6 py-4 border-b border-gray-200 underline text-[blue]">
          <Link to={`/employee-lead-single-data/${lead.lead_id}`}>
            {lead.lead_no}
          </Link>
        </td>
         <td className="px-6 py-4 border-b border-gray-200 text-gray-800 text-wrap">
                        {lead.name}
                      </td>
                      <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
                        {lead.phone}
                      </td>
                      <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
                        {lead.leadSource}
                      </td>
                      <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
                        {lead.assignedTo}
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
                      <td className="px-6 py-4 border-b border-gray-200 text-gray-800  text-wrap" >
                        {lead.answer_remark}
                        
                                       
                      </td>
                      <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
                        {moment(lead.createdTime).format("DD MMM YYYY").toUpperCase()}
                      </td>
        <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
        {lead.lead_status === "active lead" || lead.lead_status === "calling done" || lead.lead_status === "site visit done" || lead.lead_status === "interested" || lead.lead_status === "not-interested"  ?  (
  <button
    className="text-[green] font-semibold hover:text-blue-700"
    onClick={() => handleUpdate(lead)}
  >
    Started Work
  </button>
) : lead.lead_status === "pending" ? (
  <button
    className="text-blue-500 font-semibold hover:text-blue-700"
    onClick={() => handleUpdate(lead)}
  >
    Start Work
  </button>
) : lead.lead_status === "completed" ? (
  <button
    className="text-gray-400 font-semibold cursor-not-allowed"
    disabled
  >
    Work Completed
  </button>
) : null}

        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td
        colSpan="12"
        className="text-center py-4 text-gray-500"
      >
        No Data Available
      </td>
    </tr>
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
      </div>
      {/* </div> */}
    </>
  );
}

export default EmployeeLead;

const Wrapper = styled.div`
  // .tt {
  //   white-space: nowrap;
  //   @media screen and (min-width: 1500px) and (max-width: 1700px) {
  //     width: 89%;
  //     margin-left: 10rem;
  //     white-space: nowrap;
  //   }
  // }
  // .main {
  //   @media screen and (min-width: 1500px) and (max-width: 1700px) {
  //     margin-left: 10rem;
  //   }
  // }
`;
