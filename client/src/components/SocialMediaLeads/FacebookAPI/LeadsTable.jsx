
import { useEffect, useState } from 'react';
import axios from "axios";
import FormSelector from './SelectForm';
import LeadsDisplay from './LeadsDisplay';
import FormInput from './FormInput';
import moment from 'moment';
import ReactPaginate from 'react-paginate';

const LeadsTable = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [gotId, setGotId] = useState("");
  const [selectedFormId, setSelectedFormId] = useState(''); // Store selected form ID
  const [showForm, setShowForm] = useState(false);  
  
  const [leadsAssigned, setLeadsAssigned] = useState([]);

  const [showPopup, setShowPopup] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [formName, setFormName] = useState([]);

  const [currentLead, setCurrentLead] = useState({
    assignedTo: "",
    employeeId: "",
    employeephone: "",
    createdTime:"",
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [leadsPerPage] = useState(10);
  

  const fetchLeadsByFormId = async () => {
    try {
      const response = await axios.get(`http://localhost:9000/api/Leads-data-fetch/${gotId}`);
      setLeads(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching leads:', err);
      setError('Failed to fetch leads');
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
  const fetchLeadassigned = async () => {
    try {
      const response = await axios.get("http://localhost:9000/api/leads");
      setLeadsAssigned(response.data);
      // console.log(leadsAssigned);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };


  const handleFormSelect = (formId, formName) => {
    setSelectedFormId(formId); // Set the selected form ID
    setFormName(formName); // Set the selected form name
    fetchLeadsByFormId(formId); // Fetch leads based on selected form ID
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentLead((prevLead) => {
      const updatedLead = { ...prevLead, [name]: value };
  
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
  

  const saveChanges = async () => {
    if (!currentLead.assignedTo) {
      alert("Please assign the lead to an employee."); // Show an alert message
      return; // Stop further execution if the field is empty
    }
    if (!currentLead.createdTime) {
      alert("Please Select Assign Date."); // Show an alert message
      return; // Stop further execution if the field is empty
    }
    try {
      await axios.post("http://localhost:9000/api/leads", {
        lead_no:  selectedLead.leadId,    
        assignedTo:currentLead.assignedTo,
        employeeId:currentLead.employeeId,
        createdTime:  currentLead.createdTime,
        actual_date:  selectedLead.date,
        name: selectedLead.fullName,         
        phone:  selectedLead.phoneNumber,   
        leadSource: "Facebook Campaign", 
        subject:  formName, 
        address:selectedLead.address,
      });
      fetchLeadsByFormId(); // Refresh the list
      fetchLeadassigned();
      closePopup();
// Format the createdTime using moment
const formattedDate = moment(currentLead.createdTime).format("DD-MM-YYYY"); // Format the date as 'DD-MM-YYYY'

// Generate the WhatsApp link with the formatted date
const whatsappLink = `https://wa.me/${currentLead.employeephone}?text=Hi%20${currentLead.assignedTo},%20you%20have%20been%20assigned%20a%20new%20lead%20with%20the%20following%20details:%0A%0A1)%20Date:-${formattedDate}%0A2)%20Lead%20No.%20${selectedLead.leadId}%0A3)%20Name:%20${selectedLead.fullName}%0A4)%20Phone%20Number:%20${selectedLead.phoneNumber}%0A5)%20Lead%20Source:%20Facebook%20Campaign%0A6)%20Address:%20${selectedLead.address}%0A7)%20Subject:%20${formName}%0A%0APlease%20check%20your%20dashboard%20for%20details.`;

// Open WhatsApp link
window.open(whatsappLink, "_blank");



    } catch (error) {
      console.error("Error adding lead:", error);
    }
  };

  const handleEditClick = (lead) => {
    console.log(lead);
    setSelectedLead({
      leadId: lead.lead_id,
     
      fullName:lead.full_name,
      address: lead.street_address,
      phoneNumber: lead.phone_number,
      date: moment(lead.created_time).format("YYYY-MM-DD"), // Format the createdTime

    });

    setShowPopup(true);
  };
  
  const saveIntoDB = async () => {
    try {
      // Fetch leads from Meta API via backend
      const response = await axios.post('http://localhost:9000/api/leads/fetch', {
        formId: gotId,
      });
      setLoading(true);
      fetchLeadsByFormId();
    } catch (err) {
      console.error('Error fetching leads:', err);
    }
  }

  // const extractFieldValue = (fieldData, fieldName) => {
  //   const field = fieldData.find((item) => item.name === fieldName);
  //   return field ? field.values[0] : "";
  // };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedLead(null);
  };
  // Pagination logic
  const indexOfLastLead = (currentPage + 1) * leadsPerPage;
  const indexOfFirstLead = indexOfLastLead - leadsPerPage;
  const currentLeads = leads.slice(indexOfFirstLead, indexOfLastLead);

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };


  useEffect(() => {
    saveIntoDB();
    fetchEmployees();
    fetchLeadassigned();
  }, [gotId])

  return (
    <div className="container mx-auto p-4">
      <button
        className="bg-blue-500 text-white py-2 px-4 rounded mb-4"
        onClick={() => setShowForm(!showForm)}  // toggle form visibility
      >
        Add Form Details
      </button>

      {showForm && <FormInput />} 
      
      <h1 className="text-2xl font-bold mb-4">Select Form to Fetch Leads</h1>

      {/* {error && <p className="text-red-500 mb-4">{error}</p>} */}

      <FormSelector setLoading={setLoading} setMe={setGotId} setError={setError} onFormSelect={(formId, formName) => handleFormSelect(formId, formName)} />


      {loading && <p>Loading...</p>}

      {leads.length > 0 &&

         <div className="overflow-x-auto">
         <table className="min-w-full bg-white border border-gray-200">
           <thead>
           <th colSpan="6" className='py-2 px-4 border-b"'>Ad Name : {formName}</th>
             <tr className="bg-gray-100">
               <th className="py-2 px-4 border-b">Lead S.no</th>
               <th className="py-2 px-4 border-b">Lead ID</th>
               <th className="py-2 px-4 border-b">Full Name</th>
               <th className="py-2 px-4 border-b">Phone Number</th>
               <th className="py-2 px-4 border-b">Address</th>
               <th className="py-2 px-4 border-b">Subject</th>
               <th className="py-2 px-4 border-b">Date</th>
               <th className="py-2 px-4 border-b">Assign Lead</th>
             </tr>
           </thead>
           <tbody>
  {Array.isArray(currentLeads) && currentLeads
    .filter(
      (lead) =>
        !leadsAssigned.some(
          (assigned) => assigned.lead_no === lead.lead_id
        )
    )
    .map((lead, index) => (
      <tr key={lead.id}>
        <td className="py-2 px-4 border-b">{index + 1}</td>
        <td className="py-2 px-4 border-b">{lead.lead_id}</td>
        <td className="py-2 px-4 border-b">{lead.full_name}</td>
        <td className="py-2 px-4 border-b">{lead.phone_number}</td>
        <td className="py-2 px-4 border-b">{lead.street_address}</td>
        <td className="py-2 px-4 border-b">{formName}</td>
        <td className="py-2 px-4 border-b">
          {lead.created_time
            ? `${new Date(lead.created_time).toLocaleDateString('en-GB')} ${new Date(lead.created_time).toLocaleTimeString()}`
            : 'N/A'}
        </td>

        <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
          <button
            className="text-blue-500 hover:text-blue-700"
            onClick={() => handleEditClick(lead)}
          >
            Assign
          </button>
        </td>
      </tr>
    ))}
</tbody>

         </table>
           {/* Pagination */}
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
       
}
{showPopup && selectedLead && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[500px]">
            <h2 className="text-xl mb-4">{"Add Lead"}</h2>
            <div className="mb-4">
              <label className="block text-gray-700">Lead Number</label>
              <input
                type="number"
                name="lead_no"
                value={selectedLead.leadId}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border  rounded`}
                disabled
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Assigned To</label>
              <select
                name="assignedTo"
                value={currentLead.assignedTo}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded`}
              >
                <option value="">Select Employee</option>
                {employees.map((employee) => (
                  <option key={employee.employee_id} value={employee.name}>
                    {employee.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Hidden employeeId field */}
            <input
              type="hidden"
              id="employeeId"
              name="employeeId"
              value={currentLead.employeeId}
            />

            <div className="mb-4">
              <label className="block text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                value={selectedLead.fullName}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border  rounded`}
                disabled
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Phone</label>
              <input
                type="text"
                name="phone"
                value={selectedLead.phoneNumber}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded`}
                disabled
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Lead Source</label>
              <select
                name="leadSource"
                id="leadSource"
                value={currentLead.leadSource}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                disabled
              >
                <option value="Website Inquiries">Facebook Campaign</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Subject</label>
              <input
                type="text"
                name="subject"
                value={formName}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border  rounded`}
                disabled
              />
            </div>
            <div className="mb-4">
                  <label className="block text-gray-700">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={selectedLead.address}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded`}
                    disabled
                  />
                  
                </div>
            <div className="mb-4">
              <label className="block text-gray-700">Assign Date</label>
              <input
                type="date"
                name="createdTime"
                value={currentLead.createdTime}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border  rounded`}
                
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Actual Date</label>
              <input
                type="date"
                name="actual_date"
                value={selectedLead.date}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border  rounded`}
                disabled
              />
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

    

    
    </div>
  );
};

export default LeadsTable;
