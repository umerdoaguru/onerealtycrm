import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const EditInvoice_date = () => {
  const { id } = useParams();
  const [newInvoiceDate, setNewInvoiceDate] = useState('');
  const [showModal, setShowModal] = useState(true)
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.put(`http://localhost:9000/api/invoice-date/${id}`, { newInvoice_date: newInvoiceDate });
      if (response.status === 200) {
        // Navigate after successful update
        navigate(`/print-invoice/${id}`);
      }
    } catch (error) {
      console.error('Error updating invoice date:', error);
    }

    // Close the modal after saving
    setShowModal(false);
  };

  const handleClose = () => {
    setShowModal(false);
    navigate(`/print-invoice/${id}`);
  };

  return (
    showModal && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Update Invoice Date</h2>
            <button onClick={handleClose} className="text-gray-500 hover:text-gray-700">
              &times;
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">New Invoice Date</label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded-md p-2"
                value={newInvoiceDate}
                onChange={(e) => setNewInvoiceDate(e.target.value)}
                required
              />
            </div>
            <div className="flex justify-end">
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2">
                Save Changes
              </button>
              <button onClick={handleClose} className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400">
                Close
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default EditInvoice_date;
