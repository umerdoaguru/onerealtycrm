import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import * as XLSX from "xlsx";
import ReactPaginate from "react-paginate"; // Import react-paginate

import { useSelector } from "react-redux";

function EmpLeadReport() {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const EmpId = useSelector((state) => state.auth.user.id);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [duration, setDuration] = useState("all"); // Default is "all"
  const [selectedColumns, setSelectedColumns] = useState([
    "lead_no",
    "assignedTo",
    "name",
    "phone",
    "leadSource",
    "remark_status",
    "answer_remark",
    "meeting_status",
    "assignedBy",
    "lead_status",
    "address",
    "booking_amount",
    "deal_status",
    "employeeId",
    "follow_up_status",
    "payment_mode",
    "quotation",
    "quotation_status",
    "reason",
    "registry",
   
    "subject",
    "visit",
    "d_closeDate",
    "createdTime",
    "actual_date",
  ]);
  const [currentPage, setCurrentPage] = useState(0);
  const leadsPerPage = 6;

  // Fetch leads and employees from the API
  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await axios.get(
        `https://crmdemo.vimubds5.a2hosted.com/api/employe-leads/${EmpId}`
      );
      setLeads(response.data);
      setFilteredLeads(response.data);
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
  };

  // Filter by duration
  const filterByDuration = (leads, duration) => {
    const today = moment();

    switch (duration) {
      case "week":
        return leads.filter((lead) =>
          moment(lead.createdTime).isSame(today, "week")
        );
      case "month":
        return leads.filter((lead) =>
          moment(lead.createdTime).isSame(today, "month")
        );
      case "year":
        return leads.filter((lead) =>
          moment(lead.createdTime).isSame(today, "year")
        );
      case "all":
      default:
        return leads;
    }
  };

  // Filter leads when employee or duration changes
  useEffect(() => {
    let filtered = leads;

    filtered = filtered.filter((lead) => lead.lead_status === "completed");
    filtered = filterByDuration(filtered, duration);

    setFilteredLeads(filtered);
    setCurrentPage(0);
  }, [selectedEmployee, duration, leads]);

  // Excel download function
  const downloadExcel = () => {
    const columnMapping = {
      lead_no: "Lead Number",
      assignedTo: "Assigned To",
      name: "Name",
      phone: "Phone",
      leadSource: "Lead Source",
      remark_status: "Remark Status",
      answer_remark: "Answer Remark",
      meeting_status: "Meeting Status",
      assignedBy: "Assigned By",
      lead_status: "Lead Status",
      address: "Address",
      booking_amount: "Booking Amount",
      deal_status: "Deal Status",
      employeeId: "Employee ID",
      follow_up_status: "Follow-up Status",
      payment_mode: "Payment Mode",
      quotation: "Quotation",
      quotation_status: "Quotation Status",
      reason: "Reason",
      registry: "Registry",
    
      subject: "Project",
      visit: "Visit",
      d_closeDate: "Close Date",
      createdTime: "Assigned Date",
      actual_date: "Actual Date",
    };

    const completedLeads = filteredLeads.map((lead) => {
      const formattedLead = {};

      selectedColumns.forEach((col) => {
        const newKey = columnMapping[col] || col;
        formattedLead[newKey] =
          (col === "actual_date" || col === "createdTime") && lead[col]
            ? moment(lead[col]).format("DD MMM YYYY").toUpperCase()
            : lead[col];
      });

      formattedLead["Actual Date"] = lead["actual_date"]
        ? moment(lead["actual_date"]).format("DD MMM YYYY").toUpperCase()
        : "";
      formattedLead["Assigned Date"] = lead["createdTime"]
        ? moment(lead["createdTime"]).format("DD MMM YYYY").toUpperCase()
        : "";
      formattedLead["Close Date"] = lead["d_closeDate"]
        ? moment(lead["d_closeDate"]).format("DD MMM YYYY").toUpperCase()
        : "pending";

      return formattedLead;
    });

    const worksheet = XLSX.utils.json_to_sheet(completedLeads);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      `Lead of ${duration} Report`
    );
    XLSX.writeFile(workbook, `Lead of ${duration} Report.xlsx`);
  };

  // Pagination logic
  const pageCount = Math.ceil(filteredLeads.length / leadsPerPage);
  const indexOfLastLead = (currentPage + 1) * leadsPerPage;
  const indexOfFirstLead = indexOfLastLead - leadsPerPage;
  const currentLeads = filteredLeads.slice(indexOfFirstLead, indexOfLastLead);

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  return (
    <>
      <div className="container 2xl:w-[95%] ">
        {/* Filters */}
        <div className="flex mb-4 sm:flex-row justify-end flex-col gap-2">
          <div>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="border p-2 rounded"
            >
              <option value="all">All</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
          </div>
          <button
            onClick={downloadExcel}
            className="bg-blue-500 text-white font-medium px-4 py-2 rounded hover:bg-blue-700"
          >
            Download Excel
          </button>
        </div>

        {/* Leads Table */}
        <div className="overflow-auto mt-4">
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
                <th className="px-6 py-3 border-b-2 border-gray-300">Name</th>
                <th className="px-6 py-3 border-b-2 border-gray-300">Phone</th>
                <th className="px-6 py-3 border-b-2 border-gray-300">
                  Lead Source
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-300">
                  Lead Status
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-300">
                  Assigned Date
                </th>
              </tr>
            </thead>
            <tbody>
              {currentLeads.length === 0 ? (
                <tr>
                  <td
                    colSpan="11"
                    className="px-6 py-4 border-b border-gray-200 text-center text-gray-500"
                  >
                    No data found
                  </td>
                </tr>
              ) : (
                currentLeads.map((lead, index) => (
                  <tr
                    key={lead.id}
                    className={index % 2 === 0 ? "bg-gray-100" : ""}
                  >
                    <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
                      {index + 1 + currentPage * leadsPerPage}
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
                      {lead.phone}
                    </td>
                    <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
                      {lead.leadSource}
                    </td>
                    <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
                      {lead.lead_status}
                    </td>
                    <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
                      {moment(lead.createdTime)
                        .format("DD MMM YYYY")
                        .toUpperCase()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pageCount > 1 && (
          <div className="mt-4">
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
              previousClassName={"prev"}
              nextClassName={"next"}
            />
          </div>
        )}
      </div>
    </>
  );
}

export default EmpLeadReport;
