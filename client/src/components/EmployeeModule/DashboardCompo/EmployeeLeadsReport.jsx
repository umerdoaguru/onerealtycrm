import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const EmployeeLeadsReport = () => {
  const [leads, setLeads] = useState([]);
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
  }, []);

  return (
    <div className="p-4 mt-6 bg-white rounded-lg shadow-lg">
      <h3 className="mb-4 text-lg font-semibold">Leads Assign Report</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-sm font-medium text-left text-gray-500">
                S.no
              </th>
              <th className="px-4 py-2 text-sm font-medium text-left text-gray-500">
                Lead Number
              </th>
              <th className="px-4 py-2 text-sm font-medium text-left text-gray-500">
                Assigned To
              </th>
              <th className="px-4 py-2 text-sm font-medium text-left text-gray-500">
                Created Time
              </th>
              <th className="px-4 py-2 text-sm font-medium text-left text-gray-500">
                Name
              </th>
              <th className="px-4 py-2 text-sm font-medium text-left text-gray-500">
                Phone
              </th>
              <th className="px-4 py-2 text-sm font-medium text-left text-gray-500">
                Lead Source
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {leads.length > 0 ? (
              leads.map((lead, index) => (
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
              ))
            ) : (
              <tr className="px-2 ">
                <td colSpan={7} className="px-4 py-2">
                  <p className="text-center p-4">No leads created today.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeLeadsReport;
