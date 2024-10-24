import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/MainHeader";
import Sider from "../components/Sider";
import moment from "moment";
import { Link, useNavigate } from "react-router-dom";
import { BsPencilSquare, BsTrash } from "react-icons/bs";
import ToDoList from "./../adiComponent/Todo";
import styled from "styled-components";
import ReactPaginate from "react-paginate";

function Leads() {
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [currentLead, setCurrentLead] = useState({
    lead_no: "",
    assignedTo: "",
    employeeId: "",
    employeephone: "",
    createdTime: "", // Added here
    name: "",
    phone: "",
    leadSource: "",
    subject: "",
    address: "",
    actual_date: "",
  });
  const [showPopup, setShowPopup] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const leadsPerPage = 10; // Default leads per page
  const [leadSourceFilter, setLeadSourceFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [visitFilter, setVisitFilter] = useState("");
  const [dealFilter, setDealFilter] = useState("");
  const [employeeFilter, setEmployeeFilter] = useState("");

  // Fetch leads and employees from the API
  useEffect(() => {
    fetchLeads();
    fetchEmployees();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await axios.get("http://localhost:9000/api/leads");
      setLeads(response.data);
      console.log(leads);
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await axios.get("http://localhost:9000/api/employee");
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    if (!currentLead.lead_no) {
      formErrors.lead_no = "Lead number is required";
      isValid = false;
    }

    if (!currentLead.assignedTo) {
      formErrors.assignedTo = "Assigned To field is required";
      isValid = false;
    }

    if (!currentLead.name) {
      formErrors.name = "Name is required";
      isValid = false;
    }
    if (!currentLead.createdTime) {
      formErrors.createdTime = "Date is required";
      isValid = false;
    }

    if (!currentLead.phone) {
      formErrors.phone = "Phone number is required";
      isValid = false;
    } else if (!/^\d{10}$/.test(currentLead.phone)) {
      formErrors.phone = "Phone number must be 10 digits";
      isValid = false;
    }

    if (!currentLead.leadSource) {
      formErrors.leadSource = "Lead Source is required";
      isValid = false;
    }
    if (!currentLead.subject) {
      formErrors.subject = "Subject is required";
      isValid = false;
    }
    if (!currentLead.address) {
      formErrors.address = "Address is required";
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentLead((prevLead) => {
      const updatedLead = { ...prevLead, [name]: value };

        // If createdTime changes, update actual_date accordingly
    if (name === "createdTime") {
      updatedLead.actual_date = value; // Copy createdTime to actual_date
    }

  
      // If assignedTo changes, update employeeId and employeephone accordingly
      if (name === "assignedTo") {
        const selectedEmployee = employees.find(
          (employee) => employee.name === value
        );
        if (selectedEmployee) {
          updatedLead.employeeId = selectedEmployee.employeeId;
          updatedLead.employeephone = selectedEmployee.phone; // Store employee's phone number in employeephone
        } else {
          updatedLead.employeeId = ""; // Reset if no match
          updatedLead.employeephone = ""; // Reset employeephone if no match
        }
      }
  
      return updatedLead;
    });
  };
  
  

  const handleCreateClick = () => {
    setIsEditing(false);
    setCurrentLead({
      lead_no: "",
      assignedTo: "",
      employeeId: "",
      employeephone: "",
      name: "",
      phone: "",
      leadSource: "",
      createdTime: "", // Clear out createdTime for new lead
      subject: "",
      address: "",
      actual_date: "",
    });
    setShowPopup(true);
  };

  const handleEditClick = (lead) => {
    setIsEditing(true);
    setCurrentLead({
      ...lead,
      createdTime: moment(lead.createdTime).format("YYYY-MM-DD"), // Format the createdTime
      actual_date: moment(lead.createdTime).format("YYYY-MM-DD"), // Format the createdTime
      
    });
    setShowPopup(true);
  };

  const saveChanges = async () => {
    if (validateForm()) {
      try {
        if (isEditing) {
          await axios.put(
            `http://localhost:9000/api/leads/${currentLead.lead_id}`,
            currentLead
          );
        } else {
          await axios.post("http://localhost:9000/api/leads", currentLead);

        // Format the createdTime using moment
const formattedDate = moment(currentLead.createdTime).format("DD-MM-YYYY"); // Format the date as per your requirement

// Generate the WhatsApp link with the formatted date
const whatsappLink = `https://wa.me/${currentLead.employeephone}?text=Hi%20${currentLead.assignedTo},%20you%20have%20been%20assigned%20a%20new%20lead%20with%20the%20following%20details:%0A%0A1)%20Assign%20Date:-${formattedDate}%0A2)%20Lead%20No.%20${currentLead.lead_no}%0A3)%20Name:%20${currentLead.name}%0A4)%20Phone%20Number:%20${currentLead.phone}%0A5)%20Lead%20Source:%20Facebook%20Campaign%0A6)%20Address:%20${currentLead.address}%0A7)%20Subject:%20${currentLead.subject}%0A%0APlease%20check%20your%20dashboard%20for%20details.`;

// Open WhatsApp link
window.open(whatsappLink, "_blank");


        }
  
        fetchLeads(); // Refresh the list
        closePopup();
  
        // Create WhatsApp URL
       
  
      } catch (error) {
        console.error("Error saving lead:", error);
      }
    }
  };
  

  const handleDeleteClick = async (id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this data?"
    );
    if (isConfirmed) {
      try {
        await axios.delete(`http://localhost:9000/api/leads/${id}`);
        fetchLeads(); // Refresh the list after deletion
      } catch (error) {
        console.error("Error deleting lead:", error);
      }
    }
  };

  const handleSearch = (value) =>{
    if(value === ' '){
      return;
    }
    setSearchTerm(value);
  }
  useEffect(() => {
    let filtered = leads;
    console.log(filtered);
    // Filter by search term
    if (searchTerm) { 
      filtered = filtered.filter(
        (lead) =>
          lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lead.lead_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lead.leadSource.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by date range
    if (startDate && endDate) {
      filtered = filtered.filter((lead) => {
        const leadDate = moment(lead.createdTime).format("YYYY-MM-DD");
        return leadDate >= startDate && leadDate <= endDate;
      });
    }

    // Filter by lead source
    if (leadSourceFilter) {
      filtered = filtered.filter(
        (lead) => lead.leadSource === leadSourceFilter
      );
    }
    // Filter by status
    if (statusFilter) {
      filtered = filtered.filter((lead) => lead.status === statusFilter);
    }

    // Filter by visit
    if (visitFilter) {
      filtered = filtered.filter((visit) => visit.visit === visitFilter);
    }

    // Filter by Deak
    if (dealFilter) {
      filtered = filtered.filter((deal) => deal.deal_status === dealFilter);
    }
    if (employeeFilter) {
      filtered = filtered.filter((employee) => employee.assignedTo === employeeFilter);
    }

    setFilteredLeads(filtered);
    setCurrentPage(0); // Reset to first page on filter change
  }, [
    searchTerm,
    startDate,
    endDate,
    leads,
    leadSourceFilter,
    statusFilter,
    visitFilter,
    dealFilter,
    employeeFilter,
  ]);

  const closePopup = () => {
    setShowPopup(false);
    setErrors({});
  };

  const pageCount = Math.ceil(filteredLeads.length / leadsPerPage);
  const currentLeads = filteredLeads.slice(
    currentPage * leadsPerPage,
    (currentPage + 1) * leadsPerPage
  );

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  return (
    <>
      <Header />
      <Sider />
      <>
        <div className="container">
          <div className="main">
            <h1 className="text-2xl text-center mt-[5rem] font-medium">
              Leads Management
            </h1>
            <div className="mx-auto h-[3px] w-16 bg-[#34495E] my-3"></div>

            {/* Button to create a new lead */}
            <div className="mb-4">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 font-medium"
                onClick={handleCreateClick}
              >
                Add Lead
              </button>
            </div>
            {/* <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <label htmlFor="">Search</label>
                <input
                  type="text"
                  placeholder="Search by Name, Lead No, Lead Source , Address"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border rounded-2xl p-2 w-full"
                />
              </div>
              <div>
                <label htmlFor="">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="border  rounded-2xl p-2 w-full"
                />
              </div>

              <div>
                <label htmlFor="">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="border   rounded-2xl p-2 w-full"
                />
              </div>
            </div> */}
              <div className="grid max-sm:grid-cols-2 sm:grid-cols-3  lg:grid-cols-5 gap-4 mb-4">
              <div>
                <label htmlFor="">Search</label>
                <input
                  type="text"
                  placeholder="Search by Name, Lead No, Lead Source"
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="border rounded-2xl p-2 w-full"
                />
              </div>
              <div>
                <label htmlFor="">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="border  rounded-2xl p-2 w-full"
                />
              </div>

              <div>
                <label htmlFor="">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="border   rounded-2xl p-2 w-full"
                />
              </div>
              <div>
                <label htmlFor="">Lead Source Filter</label>
                <select
                  value={leadSourceFilter}
                  onChange={(e) => setLeadSourceFilter(e.target.value)}
                  className="border rounded-2xl p-2 w-full"
                >
                  <option value="">All Lead Sources</option>
                  <option value="Facebook Campaign">Facebook Campaign</option>
                  <option value="One Realty Website">One Realty Website</option>
                  <option value="Trade Shows">Trade Shows</option>
                  <option value="Cold Calling">Cold Calling</option>
                  <option value="Email Campaigns">Email Campaigns</option>
                  <option value="Networking Events">Networking Events</option>
                  <option value="Paid Advertising">Paid Advertising</option>
                  <option value="Content Marketing">Content Marketing</option>
                  <option value="SEO">Search Engine Optimization</option>
                  <option value="Trade Shows">Trade Shows</option>
                  <option value="Affiliate Marketing">
                    Affiliate Marketing
                  </option>
                  <option value="Direct Mail">Direct Mail</option>
                  <option value="Online Directories">Online Directories</option>
                </select>
              </div>

              <div>
                <label htmlFor="">Status Filter</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border rounded-2xl p-2 w-full"
                >
                  <option value="">All Status</option>
                  {/* <option value="Facebook Campaign">visited</option>
                  <option value="One Realty Website">pending</option>
                  <option value="Trade Shows">confirm</option>
                  <option value="Cold Calling">Cold Calling</option> */}
                  <option default value="pending">
                    Pending
                  </option>
                  <option value="interested">Interested</option>
                  <option value="non interested">Non-Interested</option>
                </select>
              </div>
              <div>
                <label htmlFor="">Visit Filter</label>
                <select
                  value={visitFilter}
                  onChange={(e) => setVisitFilter(e.target.value)}
                  className="border rounded-2xl p-2 w-full"
                >
                  <option value="">All visit</option>
                  <option value="pending">Pending</option>
                  <option value="Fresh Visit">Fresh Visit</option>
                  <option value="Repeated Visit">Repeated Visit</option>
                </select>
              </div>
              <div>
                <label htmlFor="">Deal Filter</label>
                <select
                  value={dealFilter}
                  onChange={(e) => setDealFilter(e.target.value)}
                  className="border rounded-2xl p-2 w-full"
                >
                  <option value="">All Deal</option>
                  <option value="pending">Pending</option>
                  <option value="in progress">In Progress</option>
                  <option value="close">Closed</option>
                  <option value="not closed">Not Closed</option>
                </select>
              </div>
              <div>
  <label htmlFor="">Employee Filter</label>
  <select
    name="assignedTo"
    value={employeeFilter}
    onChange={(e) => setEmployeeFilter(e.target.value)}
    className={`border rounded-2xl p-2 w-full`}
  >
    <option value="">Select Employee</option>
    {employees.map((employee) => (
      <option key={employee.employee_id} value={employee.name}>
        {employee.name}
      </option>
    ))}
  </select>
</div>
            </div>
          </div>

          <div className=" overflow-x-auto mt-4 whitespace-nowrap  lg:w-[100%]">
          <div className="flex gap-10 text-xl font-semibold my-3">
  {/* Filter leads based on the selected employee */}
  <div>
    Total Lead visit:{" "}
    {leads
      .filter((lead) => !employeeFilter || lead.assignedTo === employeeFilter) // filter by employee
      .reduce(
        (acc, lead) => acc + (lead.visit && lead.visit !== "pending" ? 1 : 0),
        0
      )}
  </div>
  <div>
    Total Lead:{" "}
    {
      leads.filter((lead) => !employeeFilter || lead.assignedTo === employeeFilter)
        .length
    }
  </div>
  <div>
    Total Closed Lead:{" "}
    {
      leads
        .filter((lead) => !employeeFilter || lead.assignedTo === employeeFilter)
        .filter((lead) => lead.deal_status === "close").length
    }
  </div>
</div>





            <table className="min-w-full bg-white border">
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
                    Address
                  </th>
                  <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider">
                    Lead Status
                  </th>
                  <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider">
                    Deal Status
                  </th>
                  <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider">
                    Visit
                  </th>
                  <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider">
                    Visit Date
                  </th>
                  <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider">
                    Action
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
      <tr key={lead.lead_id} className={index % 2 === 0 ? "bg-gray-100" : ""}>
        <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
          {index + 1}
        </td>
        <td className="px-6 py-4 border-b border-gray-200 underline text-[blue]">
          <Link to={`/lead-single-data/${lead.lead_id}`}>{lead.lead_no}</Link>
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
          {lead.address}
        </td>

        {/* Lead Status */}
        <td className={`px-6 py-4 border-b border-gray-200 font-semibold ${lead.lead_status === "pending" ? "text-[red]" : lead.lead_status === "in progress" ? "text-[orange]" : "text-[green]"}`}>
          {lead.lead_status}
        </td>

        {/* Status */}
        <td className={`px-6 py-4 border-b border-gray-200 font-semibold ${lead.status === "pending" ? "text-[red]" : lead.status === "in progress" ? "text-[orange]" : "text-[green]"}`}>
          {lead.status}
        </td>

        {/* Visit Status */}
        <td className={`px-6 py-4 border-b border-gray-200 font-semibold ${lead.visit === "pending" ? "text-[red]" : lead.visit === "Fresh Visit" ? "text-[orange]" : "text-[green]"}`}>
          {lead.visit}
        </td>

        {/* Visit Date */}
        <td className="px-6 py-4 border-b border-gray-200 font-semibold text-[green]">
          {lead.visit_date === "pending" ? lead.visit_date : moment(lead.visit_date).format("DD-MM-YYYY")}
        </td>

        {/* Created Time */}
        <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
          {moment(lead.createdTime).format("DD-MM-YYYY")}
        </td>

        {/* Actions */}
        <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
          <button
            className="text-blue-500 hover:text-blue-700"
            onClick={() => handleEditClick(lead)}
          >
            <BsPencilSquare size={20} />
          </button>
          <button
            className="text-red-500 hover:text-red-700 mx-2"
            onClick={() => handleDeleteClick(lead.lead_id)}
          >
            <BsTrash size={20} />
          </button>
        </td>
      </tr>
    ))
  )}
</tbody>

            </table>
          </div>

          {showPopup && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-[500px]">
                <h2 className="text-xl mb-4">
                  {isEditing ? "Edit Lead" : "Add Lead"}
                </h2>
                <div className="mb-4">
                  <label className="block text-gray-700">Lead Number</label>
                  <input
                    type="number"
                    name="lead_no"
                    value={currentLead.lead_no}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border ${
                      errors.lead_no ? "border-red-500" : "border-gray-300"
                    } rounded`}
                  />
                  {errors.lead_no && (
                    <span className="text-red-500">{errors.lead_no}</span>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Assigned To</label>
                  <select
                    name="assignedTo"
                    value={currentLead.assignedTo}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border ${
                      errors.assignedTo ? "border-red-500" : "border-gray-300"
                    } rounded`}
                  >
                    <option value="">Select Employee</option>
                    {employees.map((employee) => (
                      <option key={employee.employee_id} value={employee.name}>
                        {employee.name}
                      </option>
                    ))}
                  </select>
                  {errors.assignedTo && (
                    <span className="text-red-500">{errors.assignedTo}</span>
                  )}
                </div>

                {/* Hidden employeeId field */}
                <input
                  type="hidden"
                  id="employeeId"
                  name="employeeId"
                  value={currentLead.employeeId}
                />

                <div className="mb-4">
                  <label className="block text-gray-700">Assign Date</label>
                  <input
                    type="date"
                    name="createdTime"
                    value={currentLead.createdTime}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100"
                  />
                {errors.createdTime && (
                    <span className="text-red-500">{errors.createdTime}</span>
                  )}
                </div>
                

                <div className="mb-4">
                  <label className="block text-gray-700">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={currentLead.name}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border ${
                      errors.name ? "border-red-500" : "border-gray-300"
                    } rounded`}
                  />
                  {errors.name && (
                    <span className="text-red-500">{errors.name}</span>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={currentLead.phone}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border ${
                      errors.phone ? "border-red-500" : "border-gray-300"
                    } rounded`}
                  />
                  {errors.phone && (
                    <span className="text-red-500">{errors.phone}</span>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Lead Source</label>
                  <select
                    name="leadSource"
                    id="leadSource"
                    value={currentLead.leadSource}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  >
                    <option value="">Select Lead Source</option>
                    <option value="Website Inquiries">Website Inquiries</option>
                    <option value="Social Media">Social Media</option>
                    <option value="Referrals">Referrals</option>
                    <option value="Cold Calling">Cold Calling</option>
                    <option value="Email Campaigns">Email Campaigns</option>
                    <option value="Networking Events">Networking Events</option>
                    <option value="Paid Advertising">Paid Advertising</option>
                    <option value="Content Marketing">Content Marketing</option>
                    <option value="SEO">Search Engine Optimization</option>
                    <option value="Trade Shows">Trade Shows</option>
                    <option value="Facebook Campaign">Facebook Campaign</option>
                    <option value="One Realty Website">
                      One Realty Website
                    </option>
                    <option value="Affiliate Marketing">
                      Affiliate Marketing
                    </option>
                    <option value="Direct Mail">Direct Mail</option>
                    <option value="Online Directories">
                      Online Directories
                    </option>
                  </select>
                  {errors.leadSource && (
                    <p className="text-red-500 text-xs">{errors.leadSource}</p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={currentLead.subject}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border ${
                      errors.subject ? "border-red-500" : "border-gray-300"
                    } rounded`}
                  />
                {errors.subject && (
                    <span className="text-red-500">{errors.subject}</span>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={currentLead.address}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border ${
                      errors.address ? "border-red-500" : "border-gray-300"
                    } rounded`}
                  />
                    {errors.address && (
                    <span className="text-red-500">{errors.address}</span>
                  )}
                </div>

                <div className="flex justify-end">
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 mr-2"
                    onClick={saveChanges}
                  >
                    Save
                  </button>
                  <button
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
                    onClick={closePopup}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
          <div className="mt-2 mb-2 flex justify-center">
          <ReactPaginate
          previousLabel={"Previous"}
          nextLabel={"Next"}
          breakLabel={"..."}
          pageCount={pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageClick}
          containerClassName={"flex justify-center items-center space-x-3 mt-6"}
          pageClassName={"bg-white border border-gray-300 rounded-md shadow-md"}
          pageLinkClassName={"py-1 px-4 text-sm text-white bg-blue-500"}
          previousClassName={
            "bg-white border border-gray-300 rounded-md shadow-md"
          }
          previousLinkClassName={
            "py-1 px-4 text-sm text-gray-700 hover:bg-gray-100"
          }
          nextClassName={"bg-white border border-gray-300 rounded-md shadow-md"}
          nextLinkClassName={
            "py-1 px-4 text-sm text-gray-700 hover:bg-gray-100"
          }
          breakClassName={
            "bg-white border border-gray-300 rounded-md shadow-md"
          }
          breakLinkClassName={" text-sm text-gray-700 hover:bg-gray-100"}
          activeClassName={
            "bg-blue-500 text-white border border-gray-500 rounded-md shadow-md"
          }
        />
          </div>
        </div>
      </>
    </>
  );
}

export default Leads;


