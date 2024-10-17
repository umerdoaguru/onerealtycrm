import { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';


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
  });
  console.log(responses, 'Line number 7 data check');

  const fetchResponses = async () => {
    try {
      const response = await axios.get('http://localhost:9000/api/get-responses');
      console.log('Response received from API:', response.data);
      setResponses(response.data);
    } catch (error) {
      console.error('Error fetching 99Acres responses:', error);
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

  useEffect(() => {
    fetchResponses();
    fetchEmployees();
    fetchLeadassigned();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentLead((prevLead) => {
      const updatedLead = { ...prevLead, [name]: value };

      // If assignedTo changes, update employeeId accordingly
      if (name === "assignedTo") {
        const selectedEmployee = employees.find(
          (employee) => employee.name === value
        );
        if (selectedEmployee) {
          updatedLead.employeeId = selectedEmployee.employeeId;
        } else {
          updatedLead.employeeId = ""; // Reset employeeId if no match found
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
      await axios.post("http://localhost:9000/api/leads", {
        lead_no:  selectedLead.leadId,    
        assignedTo:currentLead.assignedTo,
        employeeId:currentLead.employeeId,
        createdTime:  selectedLead.date,
        name: selectedLead.fullName,         
        phone:  selectedLead.phoneNumber,   
        leadSource: "Facebook Campaign", 
        subject:  "formName", 
      });
      fetchResponses(); // Refresh the list
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

  const extractFieldValue = (fieldData, fieldName) => {
    const field = fieldData.find((item) => item.name === fieldName);
    return field ? field.values[0] : "";
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
           </tr>
         </thead>
         <tbody>
           {responses.map((response, index) => (
             <tr key={index} className="border-b">
               <td className="py-2 px-4">{response.query_id || 'N/A'}</td>
               <td className="py-2 px-4">{response.project_name || 'N/A'}</td>
               <td className="py-2 px-4">{response.city_name || 'N/A'}</td>
               <td className="py-2 px-4">{response.query_info || 'N/A'}</td>
               <td className="py-2 px-4">{response.received_on || 'N/A'}</td>
               <td className="py-2 px-4">{response.contact_name || 'N/A'}</td>
               <td className="py-2 px-4">{response.email || 'N/A'}</td>
               <td className="py-2 px-4">{response.phone || 'N/A'}</td>
             </tr>
           ))}
         </tbody>
       </table>
     </div>
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
}

export default Accrs;
