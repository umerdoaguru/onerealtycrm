import React, { useEffect, useState } from "react";
import moment from "moment"; // Import moment for date formatting
import ReactPaginate from 'react-paginate'; // Make sure to import ReactPaginate
import styled from 'styled-components'; // Import styled-components for styling

const LeadsReport = () => {
  const [leads, setLeads] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [leadsPerPage] = useState(7);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await fetch("https://crmdemo.vimubds5.a2hosted.com/api/leads");
        const data = await response.json();
        console.log("Fetched leads data:", data); // Debugging line

        // Filter leads to include only those created today
        const filteredLeads = data.filter((lead) =>
          moment(lead.createdTime).isSame(moment(), "day")
        );

        console.log("Fetched leads data:", filteredLeads);
        setLeads(filteredLeads);
      } catch (error) {
        console.error("Error fetching leads:", error);
      }
    };

    fetchLeads();
  }, []);

  // Pagination logic
   // Pagination logic
   const indexOfLastLead = (currentPage + 1) * leadsPerPage;
   const indexOfFirstLead = indexOfLastLead - leadsPerPage;
   const currentLeads = leads.slice(indexOfFirstLead, indexOfLastLead);
 
   const handlePageClick = (data) => {
     setCurrentPage(data.selected);
   };
 
 

  return (
    <>
    
    <div className="p-4 mt-6 bg-white rounded-lg shadow-lg mx-7 mb-2 ">
      <h3 className="mb-4 text-lg font-semibold">Today's Assigned Leads</h3>
      <div className="overflow-x-auto mt-4">
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="px-6 py-3 border-b-2 border-gray-300">S.no</th>
              <th className="px-6 py-3 border-b-2 border-gray-300">Lead Number</th>
              <th className="px-6 py-3 border-b-2 border-gray-300">Name</th>
              <th className="px-6 py-3 border-b-2 border-gray-300">Phone</th>
              <th className="px-6 py-3 border-b-2 border-gray-300">Assign To</th>
              <th className="px-6 py-3 border-b-2 border-gray-300">Lead Source</th>
              <th className="px-6 py-3 border-b-2 border-gray-300">Assigned To</th>
              <th className="px-6 py-3 border-b-2 border-gray-300">Subject</th>
              <th className="px-6 py-3 border-b-2 border-gray-300">Lead Status</th>
            </tr>
          </thead>
          <tbody>
            {currentLeads.length > 0 ? (
              currentLeads.map((lead, index) => (
                <tr key={lead.id} className={index % 2 === 0 ? "bg-gray-100" : ""}>
                  <td className="px-6 py-4 border-b border-gray-200 text-gray-800">{currentPage * leadsPerPage + index + 1}</td>
                  <td className="px-6 py-4 border-b border-gray-200 text-gray-800">{lead.lead_no}</td>
                  <td className="px-6 py-4 border-b border-gray-200 text-gray-800">{lead.name}</td>
                  <td className="px-6 py-4 border-b border-gray-200 text-gray-800">{lead.phone}</td>
                  <td className="px-6 py-4 border-b border-gray-200 text-gray-800">{lead.assignedTo}</td>
                  <td className="px-6 py-4 border-b border-gray-200 text-gray-800">{lead.leadSource}</td>
                  <td className="px-6 py-4 bg-primary-100 text-primary-800 text-gray-700">
                    <span className="bg-blue-200 text-gray-800 font-medium rounded px-2">{lead.assignedTo}</span>
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200 text-gray-800">{lead.subject}</td>
                  <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
                    <span className="px-2 font-semibold leading-tight text-green-700 bg-green-100 rounded">{lead.lead_status}</span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                
                <td colSpan="11" className="px-6 py-4 text-center  text-gray-500">No Data Available</td>
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
    </>
  );
};

export default LeadsReport;


