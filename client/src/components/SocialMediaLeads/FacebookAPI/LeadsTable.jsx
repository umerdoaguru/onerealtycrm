// import { useState, useEffect } from 'react';
// import axios from 'axios';

// const LeadsTable = () => {
//   const [forms, setForms] = useState([]);
//   const [selectedFormId, setSelectedFormId] = useState('');
//   const [leads, setLeads] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   console.log('Leads Data check:',leads);
  

//   // Fetch forms from backend
//   useEffect(() => {
//     const fetchForms = async () => {
//       try {
//         const response = await axios.get('http://localhost:9000/api/forms');
//         setForms(response.data);
//       } catch (err) {
//         console.error('Error fetching forms:', err);
//         setError('Failed to fetch forms');
//       }
//     };

//     fetchForms();
//   }, []);

//   // Handle form selection change
//   const handleFormChange = (e) => {
//     const formId = e.target.value;
//     setSelectedFormId(formId);
//   };

//   // Handle fetch leads button click
//   const handleFetchLeads = async () => {
//     if (!selectedFormId) {
//       setError('Please select a form');
//       return;
//     }

//     setLoading(true);
//     setError('');

//     try {
//       // Fetch leads from Meta API via backend
//       const response = await axios.post('http://localhost:9000/api/leads/fetch', {
//         formId: selectedFormId
//       });

//       // Set the leads in state after fetching
//       setLeads(response.data.leads);
//       setLoading(false);

//       // Optionally display a success message
//     } catch (err) {
//       console.error('Error fetching leads:', err);
//       setError('Failed to fetch leads');
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">Select Form to Fetch Leads</h1>

//       {error && <p className="text-red-500 mb-4">{error}</p>}

//       <div className="mb-4">
//         <label className="block text-gray-700 text-sm font-bold mb-2">
//           Select a Form
//         </label>
//         <select
//           onChange={handleFormChange}
//           className="border rounded w-full py-2 px-3 text-gray-700"
//           value={selectedFormId}
//         >
//           <option value="">-- Select a Form --</option>
//           {forms.map((form) => (
//             <option key={form.id} value={form.form_id}>
//               {form.form_name} (ID: {form.form_id})
//             </option>
//           ))}
//         </select>
//       </div>

//       <button
//         onClick={handleFetchLeads}
//         className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
//         disabled={loading}
//       >
//         {loading ? 'Fetching Leads...' : 'Fetch Leads'}
//       </button>

//       {leads.length > 0 && (
//         <div className="mt-6">
//           <h2 className="text-xl font-bold mb-4">Leads Data</h2>
//           <table className="min-w-full bg-white border border-gray-200">
//             <thead>
//               <tr className="bg-gray-100">
//                 <th className="py-2 px-4 border-b">Lead ID</th>
//                 <th className="py-2 px-4 border-b">Full Name</th>
//                 <th className="py-2 px-4 border-b">Phone Number</th>
//                 <th className="py-2 px-4 border-b">Street Address</th>
//                 <th className="py-2 px-4 border-b">Created Time</th>
//               </tr>
//             </thead>
//             <tbody>
//               {leads.map((lead) => (
//                 <tr key={lead.id}>
//                   <td className="py-2 px-4 border-b">{lead.lead_id}</td>
//                   <td className="py-2 px-4 border-b">{lead.full_name}</td>
//                   <td className="py-2 px-4 border-b">{lead.phone_number}</td>
//                   <td className="py-2 px-4 border-b">{lead.street_address}</td>
//                   <td className="py-2 px-4 border-b">{new Date(lead.created_time).toLocaleString()}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default LeadsTable;


import { useEffect, useState } from 'react';
import axios from "axios";
import FormSelector from './SelectForm';
import LeadsDisplay from './LeadsDisplay';
import FormInput from './FormInput';

const LeadsTable = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [gotId, setGotId] = useState("");
  const [selectedFormId, setSelectedFormId] = useState(''); // Store selected form ID

  // Fetch leads based on selected form ID
  // const fetchLeadsByFormId = async (formId) => {
  //   try {
  //     const response = await axios.get(`http://localhost:9000/api/Leads-data-fetch/${formId}`);
  //     setLeads(response.data);
  //   } catch (err) {
  //     console.error('Error fetching leads:', err);
  //     setError('Failed to fetch leads');
  //   }
  // };
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

  // New function to handle form ID selection
  const handleFormSelect = (formId) => {
    setSelectedFormId(formId); // Set the selected form ID
    fetchLeadsByFormId(formId); // Fetch leads based on selected form ID
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

  useEffect(() => {
    saveIntoDB();
  }, [gotId])

  return (
    <div className="container mx-auto p-4">
      <FormInput/>
      <h1 className="text-2xl font-bold mb-4">Select Form to Fetch Leads</h1>

      {/* {error && <p className="text-red-500 mb-4">{error}</p>} */}

      <FormSelector setLoading={setLoading} setMe={setGotId} setError={setError} onFormSelect={handleFormSelect} />

      {loading && <p>Loading...</p>}

      {leads.length > 0 && <LeadsDisplay leads={leads} />}
    </div>
  );
};

export default LeadsTable;
