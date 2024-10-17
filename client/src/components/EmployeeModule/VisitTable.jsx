import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import { useSelector } from "react-redux";
import * as XLSX from "xlsx";
import styled from "styled-components";
import MainHeader from "./../MainHeader";
import EmployeeeSider from "./EmployeeSider";
import Pagination from "../../adiComponent/comp/pagination";

const VisitTable = () => {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(0); // Current page for pagination
  const itemsPerPage = 10; // Set how many items you want per page
  const EmpId = useSelector((state) => state.auth.user.id);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await axios.get(
        `http://localhost:9000/api/employe-leads/${EmpId}`
      );
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

  // Calculate page data for pagination
  const pageCount = Math.ceil(filteredLeads.length / itemsPerPage);
  const displayedLeads = filteredLeads.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  return (
    <>
      <MainHeader />
      <EmployeeeSider />
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
                </tr>
              </thead>
              <tbody>
                {displayedLeads.map((lead, index) => (
                  <tr
                    key={lead.id}
                    className={index % 2 === 0 ? "bg-gray-100" : ""}
                  >
                    <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
                      {currentPage * itemsPerPage + index + 1}
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination
            currentPage={currentPage}
            totalItems={filteredLeads.length}
            itemsPerPage={itemsPerPage}
            onPageChange={(selectedPage) => setCurrentPage(selectedPage)}
            pageCount={pageCount}
          />
        </div>
      </div>
    </>
  );
};

export default VisitTable;

const Wrapper = styled.div`
  // You can add styled-components styles here
`;
