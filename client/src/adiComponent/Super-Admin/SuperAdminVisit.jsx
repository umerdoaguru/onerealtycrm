import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import SuperAdminSider from "./SuperAdminSider";
import MainHeader from "../../components/MainHeader";
import Pagination from "../comp/pagination";

const SuperAdminVisit = () => {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
  const [rowPerPage, setRowPerPage] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await axios.get(`https://crm.one-realty.in/api/leads`);
      const nonPendingLeads = response.data.filter(
        (lead) => lead.visit !== "pending"
      );

      console.log(nonPendingLeads);
      setLeads(nonPendingLeads);
      setFilteredLeads(nonPendingLeads); // Initial data set for filtering
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

  // Calculate page data for pagination
  const pageCount = Math.ceil(filteredLeads.length / rowPerPage);
  const displayedLeads = filteredLeads.slice(
    (currentPage - 1) * rowPerPage,
    currentPage * rowPerPage
  );

  return (
    <>
      <MainHeader />
      <SuperAdminSider />
      <div className="container 2xl:max-w-[1280px]">
        <div className="mt-[5rem]">
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-500 text-white px-3 py-1 max-sm:hidden rounded-lg hover:bg-blue-600 transition-colors"
          >
            Back
          </button>
        </div>
        <div className="flex flex-col 2xl:ml-44 ">
          <div className="flex-grow p-4 mt-14 lg:mt-5 sm:ml-0">
            <center className="text-2xl text-center mt-8 font-medium">
              Total Visits
            </center>
            <center className="mx-auto h-[3px] w-16 bg-[#34495E] my-3"></center>
            <div className="overflow-x-auto mt-4">
              <table className="container bg-white border">
                <thead>
                  <tr>
                    <th className="px-6 py-3 border-b-2 border-gray-300">
                      S.no
                    </th>
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
                    <th className="px-6 py-3 border-b-2 border-gray-300">
                      Phone
                    </th>
                    <th className="px-6 py-3 border-b-2 border-gray-300">
                      Lead Source
                    </th>
                    <th className="px-6 py-3 border-b-2 border-gray-300">
                      Visit
                    </th>
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
                  {displayedLeads.length > 0 ? (
                    displayedLeads.map((lead, index) => (
                      <tr
                        key={lead.id}
                        className={index % 2 === 0 ? "bg-gray-100" : ""}
                      >
                        <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
                          {currentPage * rowPerPage + index + 1}
                        </td>
                        <td className="px-6 py-4 border-b border-gray-200">
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
                  ) : (
                    <tr>
                      <td
                        colSpan={11} // Adjust the colSpan according to the number of columns
                        className="py-4 text-center"
                      >
                        No data found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <Pagination
              currentPage={currentPage}
              totalItems={filteredLeads.length}
              itemsPerPage={rowPerPage}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default SuperAdminVisit;
