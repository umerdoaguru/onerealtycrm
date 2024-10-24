import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import moment from "moment";
import * as XLSX from "xlsx";
import MainHeader from '../../components/MainHeader';
import SuperAdminSider from './SuperAdminSider';

const SuperAdminTotalClosedDeal = () => {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(0); // Current page state
  const [itemsPerPage] = useState(10); // Items per page state
  
  // Fetch leads from the API
  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await axios.get(
        `http://localhost:9000/api/leads`
      );
      // Filter out leads where deal_status is not "pending"
      const nonPendingLeads = response.data.filter(
        (lead) => lead.deal_status !== "pending"
      );

      setLeads(nonPendingLeads);
      setFilteredLeads(nonPendingLeads); // Initial data set for filtering
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
  };

  // Automatically apply date filter when start or end date changes
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

  // Calculate the index of the last lead on the current page
  const lastLeadIndex = currentPage * itemsPerPage;
  const firstLeadIndex = lastLeadIndex + itemsPerPage;
  const currentLeads = filteredLeads.slice(lastLeadIndex, firstLeadIndex); // Get leads for the current page

  return (
    <>
      <MainHeader />
      <SuperAdminSider />
      <div className="flex flex-col  2xl:ml-44">
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
                  <th className="px-6 py-3 border-b-2 border-gray-300">
                    Deal Close Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentLeads
                  .filter((lead) => lead.deal_status === "close") // Filter out closed deals
                  .map((lead, index) => (
                    <tr
                      key={lead.id}
                      className={index % 2 === 0 ? "bg-gray-100" : ""}
                    >
                      <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
                        {lastLeadIndex + index + 1}{" "}
                        {/* Adjusted for pagination */}
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
        </div>
      </div>
    </>
  );
};

export default SuperAdminTotalClosedDeal;
