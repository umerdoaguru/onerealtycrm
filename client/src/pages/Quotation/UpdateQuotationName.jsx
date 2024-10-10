// import axios from 'axios';
// import React, { useEffect, useState } from 'react';
// import { Modal, Button, Form } from 'react-bootstrap';
// import { useNavigate, useParams } from 'react-router-dom';

// const UpdateQuotationName = () => {
//     const {id} = useParams()
//     const [newName, setNewName] = useState('');
//     const [showModal, setShowModal] = useState(true);
//     const [quotationName, setQuotationName] = useState("");
//     const [message, setMessage] = useState('');

//     const navigate = useNavigate()

//     const fetchServices = async () => {
//         try {
//           const response = await axios.get(`http://localhost:9000/api/quotation-name/${id}`);

//           setQuotationName(response.data[0].quotation_name);

//         } catch (error) {
//           console.error('Error fetching services:', error);
//         }
//       };
//       useEffect(() => {
//         fetchServices();
//       },[id]);

//     const handleSubmit = async (event) => {
//         event.preventDefault();

//         try {
//             const response = await axios.put(`http://localhost:9000/api/quotation-data/${id}`, { newName });

//             if (response.status === 200) {
//                 setMessage(response.data.message);
//                 navigate('/quotationlist')
//             } else {
//                 setMessage(response.data.error || 'Failed to update quotation name');
//             }
//         } catch (error) {
//             console.error('Error updating quotation name:', error);
//             setMessage('Internal Server Error');
//         }

//         // Close the modal after saving
//         setShowModal(false);
//     };

//     const handleClose = () => {
//         setShowModal(false); // Close the modal
//         navigate('/quotationlist')
//     };

//     return (
//         <Modal show={showModal} onHide={handleClose}>
//             <Modal.Header closeButton>
//                 <Modal.Title>Update Quotation Name</Modal.Title>
//             </Modal.Header>
//             <Modal.Body>
//                 <Form onSubmit={handleSubmit}>
//                     <Form.Group controlId="formNewName">
//                         <Form.Label>New Quotation Name</Form.Label>
//                         <Form.Control type="text" placeholder="Enter new Quotation name" value={quotationName} onChange={(e) => setNewName(e.target.value)} />
//                     </Form.Group>
//                     <Button variant="primary" type="submit" className='mt-3'>
//                         Save Changes
//                     </Button>
//                 </Form>
//             </Modal.Body>
//             <Modal.Footer>
//                 <Button variant="secondary" onClick={handleClose}>
//                     Close
//                 </Button>
//             </Modal.Footer>
//             {message && <p>{message}</p>}
//         </Modal>
//     );
// };

// export default UpdateQuotationName;

import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const UpdateQuotationName = () => {
  const { id } = useParams();
  const [newName, setNewName] = useState("");
  const [showModal, setShowModal] = useState(true);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuotationName = async () => {
      try {
        const response = await axios.get(
          `http://localhost:9000/api/quotation-name/${id}`
        );
        if (response.data && response.data.length > 0) {
          setNewName(response.data[0].quotation_name); // Set default value for input
        }
      } catch (error) {
        console.error("Error fetching quotation name:", error);
      }
    };
    fetchQuotationName();
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.put(
        `http://localhost:9000/api/quotation-data/${id}`,
        { newName }
      );
      if (response.status === 200) {
        setMessage(response.data.message);
        navigate("/quotationlist");
      } else {
        setMessage(response.data.error || "Failed to update quotation name");
      }
    } catch (error) {
      console.error("Error updating quotation name:", error);
      setMessage("Internal Server Error");
    }

    // Close the modal after saving
    setShowModal(false);
  };

  const handleClose = () => {
    setShowModal(false);
    navigate("/quotationlist");
  };

  return (
    <>
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Update Quotation Name</h2>
              {/* <button className="text-gray-400 hover:text-gray-600" onClick={handleClose}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button> */}
            </div>
            <form onSubmit={handleSubmit} className="mt-4">
              <div className="mb-4">
                <label
                  htmlFor="formNewName"
                  className="block text-sm font-medium text-gray-700"
                >
                  New Quotation Name
                </label>
                <input
                  type="text"
                  id="formNewName"
                  placeholder="Enter new Quotation name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="bg-gray-600 text-white px-4 py-2 rounded mr-2 hover:bg-gray-700"
                  onClick={handleClose}
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
            {message && <p className="mt-4 text-sm text-red-600">{message}</p>}
          </div>
        </div>
      )}
    </>
  );
};

export default UpdateQuotationName;
