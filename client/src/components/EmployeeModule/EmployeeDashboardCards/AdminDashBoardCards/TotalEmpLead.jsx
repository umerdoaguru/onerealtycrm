import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useSelector } from "react-redux";
import EmployeeSider from "./../../EmployeeSider";
import MainHeader from "../../../MainHeader";

function TotalEmpLead() {
  const EmpId = useSelector((state) => state.auth.user.id);
  const [leads, setLeads] = useState([]);
  const navigate = useNavigate();

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
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
  };
  const handleBackClick = () => {
    navigate(-1); // -1 navigates to the previous page in history
  };
=======
    const fetchLeads = async () => {
        try {
            const response = await axios.get( `http://localhost:9000/api/employe-leads/${EmpId}`);
            setLeads(response.data);
        } catch (error) {
            console.error('Error fetching leads:', error);
        }
    };
    const handleBackClick = () => {
        navigate(-1); // -1 navigates to the previous page in history
      };
    
>>>>>>> 60b59349eb3700a5fdac63d4db21e49fcf757eb2

  return (
    <>
      <MainHeader />
      <EmployeeSider />
      <div className="container">
        <h1 className="text-2xl text-center mt-[5rem]">Total Leads </h1>
        <div className="mx-auto h-[3px] w-16 bg-[#34495E] my-3"></div>
      </div>

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
            {leads.map((lead, index) => (
              <tr
                key={lead.lead_id}
                className={index % 2 === 0 ? "bg-gray-100" : ""}
              >
                <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
                  {index + 1}
                </td>
                <Link to={`/lead-single-data/${lead.lead_id}`}>
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
    </>
  );
}

export default TotalEmpLead;
