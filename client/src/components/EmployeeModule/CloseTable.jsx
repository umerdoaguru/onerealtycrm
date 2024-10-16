import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import { useSelector } from "react-redux";
import ReactPaginate from "react-paginate";
import * as XLSX from "xlsx";
import styled from "styled-components";
import MainHeader from "../MainHeader";
import EmployeeSider from "../EmployeeModule/EmployeeSider";

const CloseTable = () => {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const EmpId = useSelector((state) => state.auth.user.id);
  // Fetch leads from the API
  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await axios.get(
        `http://localhost:9000/api/employe-leads/${EmpId}`
      );
      // Filter out leads where visit is "Pending"
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

  return (
    <>
      <MainHeader />
      <EmployeeSider />
      <div className="container">
        <h1 className="text-2xl text-center mt-20">Total Closed Deal</h1>
        <div className="mx-auto h-[3px] w-16 bg-[#34495E] my-3"></div>

        <div className="overflow-x-auto mt-4 ">
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

                <th className="px-6 py-3 border-b-2 border-gray-300">Phone</th>
                <th className="px-6 py-3 border-b-2 border-gray-300">
                  Lead Source
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-300">Visit </th>
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
              {filteredLeads.map((lead, index) => (
                <tr
                  key={lead.id}
                  className={index % 2 === 0 ? "bg-gray-100" : ""}
                >
                  <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
                    {index + 1}
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

                  {/* <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
                    {moment(lead.createdTime).format("DD/MM/YYYY")}
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};
export default CloseTable;
const Wrapper = styled.div`
  .respo {
    @media screen and (max-width: 768px) {
      margin-top: 1rem;
    }
  }
`;
