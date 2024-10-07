// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// import moment from 'moment';

// import cogoToast from 'cogo-toast';
// import { Link, useNavigate } from 'react-router-dom';
// import MainHeader from '../MainHeader';
// import EmployeeSider from './EmployeeSider';
// import UpdateLeadField from './updateLeadField';
// import { useSelector } from 'react-redux';

// function EmployeeLead() {
//     const [leads, setLeads] = useState([]);
//     const navigate = useNavigate();
//     const [currentLead, setCurrentLead] = useState({
    
//         lead_status: 'in progress',
//         quotation_status: '',
//         invoice_status: '',
//         deal_status: '',
//         reason: '',
      
//         follow_up_status: ''
//     });
   

  
    
//     // Fetch leads from the API
//     useEffect(() => {
//         fetchLeads();
//     }, []);
//     const EmpId = useSelector(state => state.auth.user.id);

//     const fetchLeads = async () => {
//         try {
//           const response = await axios.get(
//             `https://crmdemo.vimubds5.a2hosted.com/api/employe-leads/${EmpId}`);
//           const data = response.data;
//           setLeads(data);
//         } catch (error) {
//           console.error("Error fetching leads:", error);
//         }
//       };






//     const handleUpdate = async (lead) =>  {
      

   
       
//         setCurrentLead(lead);
//         console.log(lead);
     
        
//         try {
//           // Send updated data to the backend using Axios
//           const response = await axios.put(`https://crmdemo.vimubds5.a2hosted.com/api/updateLeadStatus/${currentLead.lead_id}`, currentLead);
      
//           if (response.status === 200) {
//             console.log('Updated successfully:', response.data);
//             cogoToast.success("Lead status updated successfully");
          
//             navigate(`/employee-lead-single-data/${currentLead.lead_id}`)
//           } else {
//             console.error('Error updating:', response.data);
//             cogoToast.error({ general: 'Failed to update the lead status.' });
//           }
//         } catch (error) {
//           console.error('Request failed:', error);
//           cogoToast.error('Failed to update the lead status.');
//         }
     
//     };

  

//     useEffect(() => {
//       fetchLeads();
//     }, [])

//     return (
//         <>
//             <MainHeader />
//             <EmployeeSider />
//             <div className="container mt-16">
//                 <h1 className="text-2xl text-center mt-[2rem]">Assigned Employee Leads</h1>
//                 <div className="mx-auto h-[3px] w-16 bg-[#34495E] my-3"></div>

//                 {/* Button to create a new lead */}
//                 {/* <div className="mb-4">
//                     <button
//                         className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
//                         onClick={handleCreateClick}
//                     >
//                         Add Lead
//                     </button>
//                 </div> */}

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
//                                 <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider">Action</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {leads.map((lead, index) => (
//                                 <tr key={lead.id} className={index % 2 === 0 ? "bg-gray-100" : ""}>
//                                     <td className="px-6 py-4 border-b border-gray-200 text-gray-800">{index + 1}</td>
//                                     <Link to={`/employee-lead-single-data/${lead.lead_id}`}>
//                                     <td className="px-6 py-4 border-b border-gray-200  underline text-[blue]">{lead.lead_no}</td>
//                                     </Link>
//                                     <td className="px-6 py-4 border-b border-gray-200 text-gray-800">{lead.assignedTo}</td>
//                                     <td className="px-6 py-4 border-b border-gray-200 text-gray-800">{moment(lead.createdTime).format('DD/MM/YYYY')}</td>
//                                     <td className="px-6 py-4 border-b border-gray-200 text-gray-800">{lead.name}</td>
//                                     <td className="px-6 py-4 border-b border-gray-200 text-gray-800">{lead.phone}</td>
//                                     <td className="px-6 py-4 border-b border-gray-200 text-gray-800">{lead.leadSource}</td>
//                                     <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
//                                         <button
//                                             className="text-blue-500 hover:text-blue-700"
//                                             onClick={() => handleUpdate(lead)}>
//                                             Start Work
//                                         </button> 
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>

              
//             </div>
//         </>
//     );
// }

// export default EmployeeLead;

import React, { useState, useEffect } from 'react';
import moment from 'moment';

import cogoToast from 'cogo-toast';
import { Link, useNavigate } from 'react-router-dom';
import MainHeader from '../MainHeader';
import EmployeeSider from './EmployeeSider';
import UpdateLeadField from './updateLeadField';
import { useSelector } from 'react-redux';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import styled from 'styled-components';

function EmployeeLead() {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]); 
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState(''); 
  const [endDate, setEndDate] = useState('');
// Pagination state
const [currentPage, setCurrentPage] = useState(0);
 const [leadsPerPage] = useState(10);

  const navigate = useNavigate();


  const EmpId = useSelector((state) => state.auth.user.id);

  // Fetch leads from the API
  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await axios.get(`https://crmdemo.vimubds5.a2hosted.com/api/employe-leads/${EmpId}`);
      const data = response.data;
      setLeads(data);
    } catch (error) {
      console.error('Error fetching leads:', error);
    }
  };

  const handleUpdate = async (lead) => {
   

    try {
      // Send updated data to the backend using Axios
      const response = await axios.put(`https://crmdemo.vimubds5.a2hosted.com/api/updateOnlyLeadStatus/${lead.lead_id}`,  {lead_status: 'in progress'});

      if (response.status === 200) {
        console.log('Updated successfully:', response.data);
        cogoToast.success('Lead status updated successfully');
        navigate(`/employee-lead-single-data/${lead.lead_id}`);
      } else {
        console.error('Error updating:', response.data);
        cogoToast.error('Failed to update the lead status.');
      }
    } catch (error) {
      console.error('Request failed:', error);
      cogoToast.error('Failed to update the lead status.');
    }
  };
  useEffect(() => {
    let filtered = leads;

    // Filter by search term
    if (searchTerm) {
        filtered = filtered.filter(lead =>
            lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lead.lead_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lead.leadSource.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    // Filter by date range
    if (startDate && endDate) {
        filtered = filtered.filter(lead => {
            const leadDate = moment(lead.createdTime).format('YYYY-MM-DD');
            return leadDate >= startDate && leadDate <= endDate;
        });
    }

    setFilteredLeads(filtered);
}, [searchTerm, startDate, endDate, leads]);




// Use filteredLeads for pagination
const indexOfLastLead = (currentPage + 1) * leadsPerPage;
const indexOfFirstLead = indexOfLastLead - leadsPerPage;
const currentLeads = filteredLeads.slice(indexOfFirstLead, indexOfLastLead);

const handlePageClick = (data) => {
setCurrentPage(data.selected);
};


  return (
    <>
      <MainHeader />
      <EmployeeSider />
<Wrapper>
      <div className="container mt-16">

        <div className="main">
        <h1 className="text-2xl text-center mt-[5rem]">Assigned Employee Leads</h1>
                <div className="mx-auto h-[3px] w-16 bg-[#34495E] my-3"></div>

                {/* Button to create a new lead */}
              
                <div className="grid grid-cols-3 gap-4 mb-4">
    <div>
    <label htmlFor="">Search</label>
        <input
            type="text"
            placeholder="Search by Name, Lead No, Lead Source"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="border rounded-2xl p-2 w-full"
        />
    </div>
    <div>
    <label htmlFor="">Start Date</label>
        <input
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            className="border  rounded-2xl p-2 w-full"
        />
    
    </div>
 
  
 
    <div>
    <label htmlFor="">End Date</label>
        <input
            type="date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            className="border   rounded-2xl p-2 w-full"
        />
    </div>
</div>
</div>
      

        <div className="overflow-x-auto mt-4">
          <table className="tt min-w-full bg-white border">
            <thead>
              <tr>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider">S.no</th>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider">Lead Number</th>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider">Assigned To</th>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider">Created Time</th>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider">Name</th>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider">Phone</th>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider">Lead Source</th>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentLeads.map((lead, index) => (
                <tr key={lead.id} className={index % 2 === 0 ? 'bg-gray-100' : ''}>
                  <td className="px-6 py-4 border-b border-gray-200 text-gray-800">{index + 1}</td>
                  <td className="px-6 py-4 border-b border-gray-200 underline text-[blue]">
                    <Link to={`/employee-lead-single-data/${lead.lead_id}`}>{lead.lead_no}</Link>
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200 text-gray-800">{lead.assignedTo}</td>
                  <td className="px-6 py-4 border-b border-gray-200 text-gray-800">{moment(lead.createdTime).format('DD/MM/YYYY')}</td>
                  <td className="px-6 py-4 border-b border-gray-200 text-gray-800">{lead.name}</td>
                  <td className="px-6 py-4 border-b border-gray-200 text-gray-800">{lead.phone}</td>
                  <td className="px-6 py-4 border-b border-gray-200 text-gray-800">{lead.leadSource}</td>
                
                  {lead.lead_status === "in progress" && (
                  <td className="px-6 py-4 border-b  border-gray-200 text-gray-800">
                    <button
                      className="text-[green] font-semibold hover:text-blue-700"
                      onClick={() => handleUpdate(lead)}
                    >
                      Started Work
                    </button>
                  </td>
                  )}
                  {lead.lead_status === "pending" && (
                  <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
                    <button
                      className="text-blue-500 font-semibold hover:text-blue-700"
                      onClick={() => handleUpdate(lead)}
                    >
                      Start Work
                    </button>
                  </td>
                  )}
                </tr>
              ))}
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
</Wrapper>
    </>
  );
}

export default EmployeeLead;

const Wrapper = styled.div`
.tt{
    white-space: nowrap;
    @media screen and (min-width: 1500px) and (max-width:1700px) {
        width: 89%;
        margin-left: 10rem;
        white-space: nowrap;
    }
}
.main{
   
    @media screen and (min-width: 1500px) and (max-width:1700px) {
    
     margin-left: 10rem;
       
    }
}



`
