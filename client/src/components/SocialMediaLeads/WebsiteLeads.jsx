import axios from 'axios';
import moment from 'moment';
import React, { useEffect, useState } from 'react'
import { BsPencilSquare } from 'react-icons/bs';
import ReactPaginate from 'react-paginate';
import { Link, useNavigate } from 'react-router-dom';


function WebsiteLeads() {
  const [websiteleads, setWebsiteLeads] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [websiteleadsAssigned, setwebsiteLeadsAssigned] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [currentLead, setCurrentLead] = useState({
    assignedTo: "",
    employeeId: "",
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [leadsPerPage] = useState(10);

  // Fetch leads
  const fetchLeads = async () => {
    try {
      const response = await axios.get('https://one-realty.in/api/user-data');
      setWebsiteLeads(response.data);
    } catch (error) {
      console.error('Error fetching website leads:', error);
    }
  };

  // Fetch employees
  const fetchEmployees = async () => {
    try {
      const response = await axios.get("https://crmdemo.vimubds5.a2hosted.com/api/employee");
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  // Fetch lead assignments
  const fetchLeadassigned = async () => {
    try {
      const response = await axios.get("https://crmdemo.vimubds5.a2hosted.com/api/leads");
      setwebsiteLeadsAssigned(response.data);
    } catch (error) {
      console.error("Error fetching assigned leads:", error);
    }
  };

  useEffect(() => {
    fetchLeads();
    fetchEmployees();
    fetchLeadassigned();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentLead((prevLead) => {
      const updatedLead = { ...prevLead, [name]: value };

      if (name === "assignedTo") {
        const selectedEmployee = employees.find((employee) => employee.name === value);
        updatedLead.employeeId = selectedEmployee ? selectedEmployee.employeeId : "";
      }

      return updatedLead;
    });
  };

  const saveChanges = async () => {
    try {
      await axios.post("https://crmdemo.vimubds5.a2hosted.com/api/leads", {
        lead_no: selectedLead.leadId,
        assignedTo: currentLead.assignedTo,
        employeeId: currentLead.employeeId,
        createdTime: selectedLead.date,
        name: selectedLead.fullName,
        phone: selectedLead.phoneNumber,
        leadSource: "One Realty Website",
        subject: 'Query',
      });
      fetchLeads();
      fetchLeadassigned();
      closePopup();
    } catch (error) {
      console.error("Error adding lead:", error);
    }
  };

  const handleEditClick = (lead) => {
    setSelectedLead({
      leadId: lead.id,
      fullName: lead.name,
      phoneNumber: lead.mobile_no,
      subject: lead.subject,
      date: moment(lead.created_date).format("YYYY-MM-DD"),
    });
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedLead(null);
  };

 // Pagination logic
 const indexOfLastLead = (currentPage + 1) * leadsPerPage;
 const indexOfFirstLead = indexOfLastLead - leadsPerPage;
 const currentLeads = websiteleads.slice(indexOfFirstLead, indexOfLastLead);

 const handlePageClick = (data) => {
  setCurrentPage(data.selected);
};
  return (
    <>
      <div className="container">
        <h1 className="text-2xl text-center mt-[5rem]">Website Leads Data</h1>
        <div className="mx-auto h-[3px] w-16 bg-[#34495E] my-3"></div>

        <div className="overflow-x-auto mt-4">
          <table className="container bg-white border">
            <thead>
              <tr>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider">S.no</th>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider">Lead Number</th>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider">Name</th>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider">Email Id</th>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider">Phone</th>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider">Subject</th>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider">Created Time</th>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider">Assigned Lead</th>
              </tr>
            </thead>
            <tbody>
              {currentLeads.map((lead, index) => (
                <tr key={lead.id} className={index % 2 === 0 ? "bg-gray-100" : ""}>
                  <td className="px-6 py-4 border-b border-gray-200 text-gray-800">{ index + 1}</td>
                  <td className="px-6 py-4 border-b border-gray-200">{lead.id}</td>
                  <td className="px-6 py-4 border-b border-gray-200 text-gray-800">{lead.name}</td>
                  <td className="px-6 py-4 border-b border-gray-200 text-gray-800">{lead.email}</td>
                  <td className="px-6 py-4 border-b border-gray-200 text-gray-800">{lead.mobile_no}</td>
                  <td className="px-6 py-4 border-b border-gray-200 text-gray-800">{lead.subject}</td>
                  <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
                    {moment(lead.created_date).format('DD-MM-YYYY')}
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
                    <button className="text-blue-500 hover:text-blue-700" onClick={() => handleEditClick(lead)}>
                      <BsPencilSquare size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Component */}
           <div className="mt-4 flex justify-center">
          <ReactPaginate
    previousLabel={"Previous"}
    nextLabel={"Next"}
    breakLabel={"..."}
    pageCount={Math.ceil(websiteleads.length / leadsPerPage)}
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

        {/* Popup */}
        {showPopup && selectedLead && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[500px]">
              <h2 className="text-xl mb-4">{"Add Lead"}</h2>
              {/* Popup content */}
              {/* ... */}
              <div className="flex justify-end">
                <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 mr-2" onClick={saveChanges}>
                  Save
                </button>
                <button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700" onClick={closePopup}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default WebsiteLeads