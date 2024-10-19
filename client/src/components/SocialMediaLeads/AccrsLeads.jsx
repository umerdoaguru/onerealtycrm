import { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import ReactPaginate from 'react-paginate';


function Accrs() {
  const [responses, setResponses] = useState([]);
  const [leadsAssigned, setLeadsAssigned] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [leadsPerPage] = useState(10);
  const [currentLead, setCurrentLead] = useState({
    assignedTo: "",
    employeeId: "",
    employeephone: "",
  });
  console.log(responses, 'Line number 7 data check');

  const fetchResponses = async () => {
    try {
      const response = await axios.get('https://crm.one-realty.in/api/get-responses');
      console.log('Response received from API:', response.data);
      setResponses(response.data);
    } catch (error) {
      console.error('Error fetching 99Acres responses:', error);
    }
  };
  const fetchEmployees = async () => {
    try {
      const response = await axios.get("https://crm.one-realty.in/api/employee");
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };
  const fetchLeadassigned = async () => {
    try {
      const response = await axios.get("https://crm.one-realty.in/api/leads");
      setLeadsAssigned(response.data);
      // console.log(leadsAssigned);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  useEffect(() => {
    fetchResponses();
    fetchEmployees();
    fetchLeadassigned();
  }, []);

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
    try {
      await axios.post("https://crm.one-realty.in/api/leads", {
        lead_no:  selectedLead.leadId,    
        assignedTo:currentLead.assignedTo,
        employeeId:currentLead.employeeId,
        createdTime:  selectedLead.date,
        name: selectedLead.fullName,         
        phone:  selectedLead.phoneNumber,   
        leadSource: "99 Acres", 
        subject: selectedLead.subject,
        address: selectedLead.address,
      });
      fetchResponses(); // Refresh the list
      fetchLeadassigned();

      closePopup();
      const whatsappLink = `https://wa.me/${currentLead.employeephone}?text=Hi%20${currentLead.assignedTo},%20you%20have%20been%20assigned%20a%20new%20lead%20with%20the%20following%20details:%0A%0A1)%20Lead%20No.%20${selectedLead.leadId}%0A2)%20Name:%20${selectedLead.fullName}%0A3)%20Phone%20Number:%20${selectedLead.phoneNumber}%0A4)%20Lead%20Source:%20${`99 Acres`}%0A5)%20Address:%20${selectedLead.address}%0A6)%20Subject:%20${selectedLead.subject}%0A%0APlease%20check%20your%20dashboard%20for%20details.`;
      // Open WhatsApp link
      window.open(whatsappLink, "_blank");

     
    } catch (error) {
      console.error("Error adding lead:", error);
    }
  };

  const handleEditClick = (lead) => {
    setSelectedLead({
      leadId: lead.id,
      fullName: lead.contact_name,
      phoneNumber: lead.phone ,
      subject: lead.project_name,
      address: lead.city_name,
      date: moment(lead.received_on).format("YYYY-MM-DD"),
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
  const currentLeads = responses.slice(indexOfFirstLead, indexOfLastLead);

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  return (
    <>
        <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">99Acres Responses</h1>
      {responses.length > 0 ? (
       <div className="overflow-x-auto">
       <table className="min-w-full text-sm bg-white border border-gray-200">
         <thead className="bg-gray-200">
           <tr>
             <th className="py-2 px-4 text-left font-semibold text-gray-700">Query ID</th>
             <th className="py-2 px-4 text-left font-semibold text-gray-700">Project Name</th>
             <th className="py-2 px-4 text-left font-semibold text-gray-700">City</th>
             <th className="py-2 px-4 text-left font-semibold text-gray-700">Query Info</th>
             <th className="py-2 px-4 text-left font-semibold text-gray-700">Received On</th>
             <th className="py-2 px-4 text-left font-semibold text-gray-700">Contact Name</th>
             <th className="py-2 px-4 text-left font-semibold text-gray-700">Email</th>
             <th className="py-2 px-4 text-left font-semibold text-gray-700">Phone</th>
             <th className="py-2 px-4 text-left font-semibold text-gray-700">Assigned Lead</th>
           </tr>
         </thead>
         <tbody>
           {currentLeads.filter(
  (lead) =>
    !leadsAssigned.some((assigned) => assigned.lead_no === lead.id.toString())
).map((lead, index) => (
             <tr key={index} className="border-b">
               <td className="py-2 px-4">{lead.id || 'N/A'}</td>
               <td className="py-2 px-4">{lead.project_name || 'N/A'}</td>
               <td className="py-2 px-4">{lead.city_name || 'N/A'}</td>
               <td className="py-2 px-4">{lead.query_info || 'N/A'}</td>
               <td className="py-2 px-4">{lead.received_on || 'N/A'}</td>
               <td className="py-2 px-4">{lead.contact_name || 'N/A'}</td>
               <td className="py-2 px-4">{lead.email || 'N/A'}</td>
               <td className="py-2 px-4">{lead.phone || 'N/A'}</td>
               <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
      <button className="text-blue-500 hover:text-blue-700" onClick={() => handleEditClick(lead)}>
        Assign
      </button>
    </td>
             </tr>
           ))}
         </tbody>
       </table>
     </div>
      ) : (
        <p>Loading data...</p>
      )}
    </div>

   {/* Pagination Component */}
   <div className="mt-4 mb-5 flex justify-center">
            <ReactPaginate
              previousLabel={"Previous"}
              nextLabel={"Next"}
              breakLabel={"..."}
              pageCount={Math.ceil(responses.length / leadsPerPage)}
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
  

        {/* Popup */}
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
                <option value="Website Inquiries">99 Acres</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Subject</label>
              <input
                type="text"
                name="subject"
                value={selectedLead.subject}
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
              <label className="block text-gray-700">Date</label>
              <input
                type=""
                name="createdTime"
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
    
    </>

  );
}

export default Accrs;
