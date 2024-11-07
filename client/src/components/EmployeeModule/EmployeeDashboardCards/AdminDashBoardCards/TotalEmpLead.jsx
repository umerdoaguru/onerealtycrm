import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import EmployeeSider from "./../../EmployeeSider";
import MainHeader from "../../../MainHeader";
import Pagination from "../../../../adiComponent/comp/pagination";

function TotalEmpLead() {
  const EmpId = useSelector((state) => state.auth.user.id);
  const [leads, setLeads] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // State for current page
  const [rowPerPage] = useState(10); // Number of rows per page
  const navigate = useNavigate();

  useEffect(() => {
    fetchLeads();

    // Cleanup function to avoid memory leaks
    return () => {
      setLeads([]);
    };
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await axios.get(
        `https://crm.one-realty.in/api/employe-leads/${EmpId}`
      );
      setLeads(response.data);
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
  };

  const handleBackClick = () => {
    navigate(-1); // Go back to the previous page
  };

  // Get current leads for the pagination
  const indexOfLastLead = currentPage * rowPerPage;
  const indexOfFirstLead = indexOfLastLead - rowPerPage;
  const currentLeads = leads.slice(indexOfFirstLead, indexOfLastLead);

  return (
    <>
      <MainHeader />
      <EmployeeSider />
      <div className="flex flex-col 2xl:ml-44 ">
        <div className="flex-grow p-4 mt-14 lg:mt-5 sm:ml-0">
          <center className="text-2xl text-center mt-8 font-medium">
            Total Assign Leads
          </center>
          <center className="mx-auto h-[3px] w-16 bg-[#34495E] my-3"></center>

          <div className="overflow-x-auto mt-4">
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
                {currentLeads.map((lead, index) => (
                  <tr
                    key={lead.lead_id}
                    className={index % 2 === 0 ? "bg-gray-100" : ""}
                  >
                    <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
                      {index + 1 + indexOfFirstLead}
                    </td>
                    <td className="px-6 py-4 border-b border-gray-200 underline text-[blue]">
                      <Link to={`/employee-lead-single-data/${lead.lead_id}`}>
                        {lead.lead_no}
                      </Link>
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
                      {lead.assignedTo}
                    </td>
                    <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
                      {lead.subject}
                    </td>
                    <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
                      {lead.lead_status}
                    </td>
                    <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
                      {moment(lead.createdTime).format("YYYY-MM-DD")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="text-center">
        <Pagination
          currentPage={currentPage}
          totalItems={leads.length}
          itemsPerPage={rowPerPage}
          onPageChange={setCurrentPage}
        />
      </div>
      </div>
    </>
  );
}

export default TotalEmpLead;
