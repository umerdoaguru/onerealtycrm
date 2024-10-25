import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import MainHeader from "./../../components/MainHeader";
import SuperAdminSider from "./SuperAdminSider";

const mockEmployeeData = {
  employeeId: 1,
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "9876543210",
  position: "Software Engineer",
  designation: "Developer",
  createdTime: "2024-09-01 12:00:00",
  signature: "john-sign.png",
  photo: "john-profile.png",
};

function EmployeeProfile() {
  const [user, setUser] = useState([]); // Initialize state for employee data
  const {employeeId} = useParams();
  const [leads, setLeads] = useState([]);


  const fetchLeads = async () => {
    try {
      const response = await axios.get(
        `http://localhost:9000/api/employe-leads/${employeeId}`);
      const data = response.data;
      setLeads(data);
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
  };

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await axios.get(
          `http://localhost:9000/api/employeeProfile/${employeeId}`
        ); // Fetch employee data
        setUser(response.data[0]); // Set employee data to state
        console.log(response.data); // Debug: log employee data
      } catch (error) {
        console.error("Error fetching employee data:", error);
      }
    };

    fetchEmployee();
    fetchLeads();
  }, [employeeId]);

  // Mock data for testing (remove once API is working)

  return (
    <>
      <MainHeader />
      <SuperAdminSider />
      <div className="flex flex-col justify-center lg:flex-row mt-14">
        <div className="flex-grow md:p-4 mt-14 lg:mt-0 sm:ml-0">
          <center className="text-2xl text-center mt-8 font-medium">
            Employee Profile
          </center>
          <center className="mx-auto h-[3px] w-16 bg-[#34495E] my-3"></center>
          <div className="flex flex-wrap justify-center mb-4">
            {/* <div className="w-full lg:w-1/3">
            <img
              src={user.photo ? `path_to_images/${user.photo}` : img} // Use employee photo if available
              alt="employee-profile"
              className="rounded-lg"
            />
          </div> */}
            <div className="w-full md:w-2/3 md:mx-0 mx-3">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div>
                  <label className="text-info">Employee ID</label>
                  <div className="p-2 bg-gray-100 rounded">
                    <p className="m-0">{user.employeeId}</p>
                  </div>
                </div>

                <div>
                  <label className="text-info">Name</label>
                  <div className="p-2 bg-gray-100 rounded">
                    <p className="m-0">{user.name}</p>
                  </div>
                </div>

                <div>
                  <label className="text-info">Email</label>
                  <div className="p-2 bg-gray-100 rounded">
                    <p className="m-0">{user.email}</p>
                  </div>
                </div>

                <div>
                  <label className="text-info">Phone</label>
                  <div className="p-2 bg-gray-100 rounded">
                    <p className="m-0">{user.phone}</p>
                  </div>
                </div>

                <div>
                  <label className="text-info">Created Date</label>
                  <div className="p-2 bg-gray-100 rounded">
                    <p className="m-0">
                      {moment(user.createdTime).format("DD/MM/YYYY")}
                    </p>
                  </div>
                </div>
              </div>
              <table className="min-w-full bg-white border mt-4">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider">
                          S.no
                        </th>
                        <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider">
                          Lead Number
                        </th>
                        <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider">
                          Assigned To
                        </th>
                        <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider">
                          Created Time
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
                      </tr>
                    </thead>
                    <tbody>
                      {leads.map((lead, index) => (
                        <tr
                          key={lead.id}
                          className={index % 2 === 0 ? "bg-gray-100" : ""}
                        >
                          <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
                            {index + 1}
                          </td>
                          <Link to={`/super-admin-lead-single-data/${lead.lead_id}`}>
                            <td className="px-6 py-4 border-b border-gray-200  underline text-[blue]">
                              {lead.lead_no}
                            </td>
                          </Link>
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
        </div>
      </div>
    </>
  );
}

export default EmployeeProfile;
