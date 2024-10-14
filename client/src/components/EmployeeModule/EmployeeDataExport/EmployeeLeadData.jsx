// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// import moment from 'moment';
// import Sider from '../Sider';
// import Header from '../../pages/Quotation/Header';

// function LeadData() {
//     const [leads, setLeads] = useState([]);

//     // Fetch leads from the API
//     useEffect(() => {
//         fetchLeads();
//     }, []);

//     const fetchLeads = async () => {
//         try {
//             const response = await axios.get('http://localhost:9000/api/leads');
//             setLeads(response.data);
//         } catch (error) {
//             console.error('Error fetching leads:', error);
//         }
//     };

//     return (
//         <>
//             <Header />
//             <Sider />
//             <div className="container">
//                 <h1 className="text-2xl text-center mt-[2rem]">Leads Management</h1>
//                 <div className="mx-auto h-[3px] w-16 bg-[#34495E] my-3"></div>

//                 <div className="overflow-x-auto mt-4">
//                     <table className="min-w-full bg-white border">
//                         <thead>
//                             <tr>
//                                 <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider">S.no</th>
//                                 <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider">Lead Number</th>
//                                 <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider">Assigned To</th>
//                                 <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider">Created Time</th>
//                                 <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider">Name</th>
//                                 <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider">Phone</th>
//                                 <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider">Lead Source</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {leads.map((lead, index) => (
//                                 <tr key={lead.id} className={index % 2 === 0 ? "bg-gray-100" : ""}>
//                                     <td className="px-6 py-4 border-b border-gray-200 text-gray-800">{index + 1}</td>
//                                     <td className="px-6 py-4 border-b border-gray-200 text-gray-800">{lead.lead_no}</td>
//                                     <td className="px-6 py-4 border-b border-gray-200 text-gray-800">{lead.assignedTo}</td>
//                                     <td className="px-6 py-4 border-b border-gray-200 text-gray-800">{moment(lead.createdTime).format('DD/MM/YYYY')}</td>
//                                     <td className="px-6 py-4 border-b border-gray-200 text-gray-800">{lead.name}</td>
//                                     <td className="px-6 py-4 border-b border-gray-200 text-gray-800">{lead.phone}</td>
//                                     <td className="px-6 py-4 border-b border-gray-200 text-gray-800">{lead.leadSource}</td>

//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>

//             </div>
//         </>
//     );
// }

// export default LeadData;

import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import * as XLSX from "xlsx";

import styled from "styled-components";
import { useSelector } from "react-redux";

function EmployeeLeadData() {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const EmpId = useSelector((state) => state.auth.user.id);
  // Fetch leads from the API
  useEffect(() => {
    fetchLeads();
  }, []);

<<<<<<< HEAD
  const fetchLeads = async () => {
    try {
      const response = await axios.get(
        `http://localhost:9000/api/employe-leads/${EmpId}`
      );
      setLeads(response.data);
      setFilteredLeads(response.data); // Initial data set for filtering
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
  };
=======
    const fetchLeads = async () => {
        try {
            const response = await axios.get(`http://localhost:9000/api/employe-leads/${EmpId}`);
            setLeads(response.data);
            setFilteredLeads(response.data); // Initial data set for filtering
        } catch (error) {
            console.error('Error fetching leads:', error);
        }
    };
>>>>>>> 60b59349eb3700a5fdac63d4db21e49fcf757eb2

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
    <Wrapper>
      <div className="container">
        <h1 className="text-2xl text-center mt-[2rem]">Leads Management</h1>
        <div className="mx-auto h-[3px] w-16 bg-[#34495E] my-3"></div>

        {/* Date Filter */}
        <div className="flex space-x-1 mb-4 sm:flex-row flex-col">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border p-2"
          />
          <div className="p-2">
            <p>to</p>
          </div>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border p-2"
          />
          <div className="respo mx-2 ">
            <button
              onClick={downloadExcel}
              className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded "
            >
              Download Excel
            </button>
          </div>
        </div>

        {/* Download Button */}

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
                  Created Time
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-300">Name</th>
                <th className="px-6 py-3 border-b-2 border-gray-300">Phone</th>
                <th className="px-6 py-3 border-b-2 border-gray-300">
                  Lead Source
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
                    {moment(lead.createdTime).format("DD/MM/YYYY")}
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Wrapper>
  );
}

export default EmployeeLeadData;

const Wrapper = styled.div`
  .respo {
    @media screen and (max-width: 768px) {
      margin-top: 1rem;
    }
  }
`;
