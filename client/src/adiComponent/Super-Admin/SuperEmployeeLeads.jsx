import React, { useState, useEffect } from "react";
import moment from "moment";

import { Link, useNavigate, useParams } from "react-router-dom";

import axios from "axios";
import ReactPaginate from "react-paginate";
import styled from "styled-components";
import MainHeader from "./../../components/MainHeader";
import SuperAdminSider from "./SuperAdminSider";

function SuperEmployeeLeads() {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [leadsPerPage] = useState(10);
  const [leadSourceFilter, setLeadSourceFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [visitFilter, setVisitFilter] = useState("");
  const [dealFilter, setDealFilter] = useState("");

  const navigate = useNavigate();

  const { id } = useParams();

  // Fetch leads from the API
  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await axios.get(
        `http://localhost:9000/api/employe-leads/${id}`
      );
      const data = response.data;
      console.log(data);
      setLeads(data);
    } catch (error) {
      console.error("Error fetching leads:", error);
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
      filtered = filtered.filter(
        (lead) =>
          lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lead.lead_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lead.leadSource.toLowerCase().includes(searchTerm.toLowerCase())
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
      filtered = filtered.filter((visit) => visit.visit === visitFilter);
    }

    // Filter by Deak
    if (dealFilter) {
      console.log(dealFilter);
      filtered = filtered.filter((deal) => deal.deal_status === dealFilter);
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
  ]);

  // Use filteredLeads for pagination
  const indexOfLastLead = (currentPage + 1) * leadsPerPage;
  const indexOfFirstLead = indexOfLastLead - leadsPerPage;
  const currentLeads = filteredLeads.slice(indexOfFirstLead, indexOfLastLead);

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  return (
    <>
      <MainHeader />
      <SuperAdminSider />
      <Wrapper>
        <div className="container mt-16">
          <div className="main">
            <div>
            <button
            onClick={() => navigate(-1)}
            className="bg-blue-500 text-white px-3 py-1 max-sm:hidden rounded-lg hover:bg-blue-600 transition-colors max-2xl:ml-[4rem]"
          >
            Back
          </button>
            <h1 className="text-2xl text-center">
              Leads Management{" "}
            </h1>
            </div>
            <div className="mx-auto h-[3px] w-16 bg-[#34495E] my-3"></div>

            {/* Button to create a new lead */}
            <div className="grid max-sm:grid-cols-2 sm:grid-cols-3  lg:grid-cols-5 gap-4 mb-4">
              <div>
                <label htmlFor="">Search</label>
                <input
                  type="text"
                  placeholder="Search by Name, Lead No, Lead Source"
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
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
                  <option value="">All Lead Sources</option>
                  <option value="Facebook Campaign">Facebook Campaign</option>
                  <option value="One Realty Website">One Realty Website</option>
                  <option value="Trade Shows">Trade Shows</option>
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
                  <option value="Online Directories">Online Directories</option>
                </select>
              </div>

              <div>
                <label htmlFor="">Status Filter</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border rounded-2xl p-2 w-full"
                >
                  <option value="">All Status</option>
                  {/* <option value="Facebook Campaign">visited</option>
                  <option value="One Realty Website">pending</option>
                  <option value="Trade Shows">confirm</option>
                  <option value="Cold Calling">Cold Calling</option> */}
                  <option default value="pending">
                    Pending
                  </option>
                  <option value="interested">Interested</option>
                  <option value="non interested">Non-Interested</option>
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
                  <option value="pending">Pending</option>
                  <option value="fresh visit">Fresh Visit</option>
                  <option value="repeated visit">Repeated Visit</option>
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
                  <option value="not closed">Not Closed</option>
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto mt-4">
          <div className="flex gap-10 text-xl font-semibold my-3">
  <div>
    Total Lead visit:{" "}
    {leads.reduce(
      (acc, lead) =>
        acc + (lead.visit && lead.visit !== "pending" ? 1 : 0),
      0
    )}
  </div>
  <div>Total Lead: {leads.length}</div>
  <div>
    Total Closed Lead:{" "}
    {
      leads.filter((lead) => lead.deal_status === "close").length
    }
  </div>
</div>

            <table className="tt min-w-full bg-white border">
              <thead>
                <tr>
                  <th className="px-6 py-3 border-y-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider">
                    S.no
                  </th>
                  <th className="px-6 py-3 border-y-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider">
                    Lead Number
                  </th>
                  <th className="px-6 py-3 border-y-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 border-y-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-3 border-y-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider">
                    Lead Source
                  </th>
                  <th className="px-6 py-3 border-y-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider">
                    Assigned To
                  </th>
                  <th className="px-6 py-3 border-y-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider">
                    Subject
                  </th>
                  <th className="px-6 py-3 border-y-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider">
                    Lead Status
                  </th>
                  <th className="px-6 py-3 border-y-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider">
                    Created Time
                  </th>
                  <th className="px-6 py-3 border-y-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 border-y-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider">
                    Deal Status
                  </th>
                  <th className="px-6 py-3 border-y-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider">
                    Visit
                  </th>
                  <th className="px-6 py-3 border-y-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider">
                    Visit date
                  </th>
                </tr>
              </thead>
              <tbody>
  {currentLeads.length > 0 ? (
    currentLeads.map((lead, index) => (
      <tr
        key={lead.lead_id}
        className={index % 2 === 0 ? "bg-gray-100" : ""}
      >
        <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
          {index + 1}
        </td>
        <Link to={`/super-admin-lead-single-data/${lead.lead_id}`}>
          <td className="px-6 py-4 border-b border-gray-200 underline text-[blue]">
            {lead.lead_no}
          </td>
        </Link>
        <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
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
        <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
          {lead.subject}
        </td>
        {lead.lead_status === "pending" && (
          <td className="px-6 py-4 border-b border-gray-200 font-semibold text-[red]">
            {lead.lead_status}
          </td>
        )}
        {lead.lead_status === "in progress" && (
          <td className="px-6 py-4 border-b border-gray-200 font-semibold text-[orange]">
            {lead.lead_status}
          </td>
        )}
        {lead.lead_status === "completed" && (
          <td className="px-6 py-4 border-b border-gray-200 font-semibold text-[green]">
            {lead.lead_status}
          </td>
        )}
        <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
          {moment(lead.createdTime).format("YYYY-MM-DD")}
        </td>
        <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
          {lead.status}
        </td>
        <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
          {lead.deal_status}
        </td>
        <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
          {lead.visit}
        </td>
        <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
          {lead.visit_date}
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan={13} className="py-4 text-center">
        No data found
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
              pageCount={Math.ceil(leads.length / leadsPerPage)}
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
      </Wrapper>
    </>
  );
}

export default SuperEmployeeLeads;

const Wrapper = styled.div`
  .tt {
    white-space: nowrap;
    @media screen and (min-width: 1500px) and (max-width: 1700px) {
      width: 89%;
      margin-left: 10rem;
      white-space: nowrap;
    }
  }
  .main {
    @media screen and (min-width: 1500px) and (max-width: 1700px) {
      margin-left: 10rem;
    }
  }
`;
