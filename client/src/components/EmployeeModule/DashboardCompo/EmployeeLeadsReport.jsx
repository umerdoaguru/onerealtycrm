import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ReactPaginate from "react-paginate"; // Import ReactPaginate
import styled from "styled-components"; // Import styled-components for styling

const EmployeeLeadsReport = () => {
  const [leads, setLeads] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const leadsPerPage = 5; // Define how many leads to display per page
  const EmpId = useSelector((state) => state.auth.user.id);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await axios.get(
          `http://localhost:9000/api/employe-leads/${EmpId}`
        );
        const data = response.data;
        const today = new Date();
        const todayStr = today.toISOString().split("T")[0]; // YYYY-MM-DD format

        const filteredLeads = data.filter((lead) => {
          const leadDate = new Date(lead.createdTime)
            .toISOString()
            .split("T")[0];
          return leadDate === todayStr;
        });

        setLeads(filteredLeads);
      } catch (error) {
        console.error("Error fetching leads:", error);
      }
    };

    fetchLeads();
  }, [EmpId]);

  const indexOfLastLead = (currentPage + 1) * leadsPerPage;
  const indexOfFirstLead = indexOfLastLead - leadsPerPage;
  const currentLeads = leads.slice(indexOfFirstLead, indexOfLastLead);

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  return (
    <div className="mx-7">
    <div className="p-4 mt-6 bg-white rounded-lg shadow-lg">
      <h3 className="mb-4 text-lg font-semibold">Leads Assign Report</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-sm font-medium text-left text-gray-500">S.no</th>
              <th className="px-4 py-2 text-sm font-medium text-left text-gray-500">Lead Number</th>
              <th className="px-4 py-2 text-sm font-medium text-left text-gray-500">Assigned To</th>
              <th className="px-4 py-2 text-sm font-medium text-left text-gray-500">Created Time</th>
              <th className="px-4 py-2 text-sm font-medium text-left text-gray-500">Name</th>
              <th className="px-4 py-2 text-sm font-medium text-left text-gray-500">Phone</th>
              <th className="px-4 py-2 text-sm font-medium text-left text-gray-500">Lead Source</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentLeads.length > 0 ? (
              currentLeads.map((lead, index) => (
                <tr key={lead.id} className={index % 2 === 0 ? "bg-gray-100" : ""}>
                  <td className="px-6 py-4 border-b border-gray-200 text-gray-800">{currentPage * leadsPerPage + index + 1}</td>
                  <td className="px-6 py-4 border-b border-gray-200 text-gray-800">{lead.lead_no}</td>
                  <td className="px-6 py-4 border-b border-gray-200 text-gray-800">{lead.assignedTo}</td>
                  <td className="px-6 py-4 border-b border-gray-200 text-gray-800">{moment(lead.createdTime).format("DD/MM/YYYY")}</td>
                  <td className="px-6 py-4 border-b border-gray-200 text-gray-800">{lead.name}</td>
                  <td className="px-6 py-4 border-b border-gray-200 text-gray-800">{lead.phone}</td>
                  <td className="px-6 py-4 border-b border-gray-200 text-gray-800">{lead.leadSource}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-4 py-2 text-center">
                  <p className="p-4">No leads created today.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {leads.length > 0 && (
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
      )}
    </div></div>
  );
};

export default EmployeeLeadsReport;

const Wrapper = styled.div`
  /* Your existing styles */
  .pagination-container {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.75rem;
    margin-top: 1.5rem;
  }
  
  .pagination-page,
  .pagination-previous,
  .pagination-next,
  .pagination-break {
    background-color: white;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .pagination-link {
    padding: 0.25rem 1rem;
    font-size: 0.875rem;
    color: #3b82f6;
    text-decoration: none;
    &:hover {
      color: #2563eb;
    }
  }

  .pagination-active {
    background-color: #1e50ff;
    color: white;
    border: 1px solid #374151;
  }

  .pagination-active a {
    color: white !important;
  }
`;
