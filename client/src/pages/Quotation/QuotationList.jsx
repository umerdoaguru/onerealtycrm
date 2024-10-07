


import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import moment from 'moment';
import { useSelector } from "react-redux";
import ReactPaginate from 'react-paginate';
import Header from "./Header";
import MainHeader from "../../components/MainHeader";
import Sider from "../../components/Sider";

const QuotationList = () => {
  const [quotations, setQuotations] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(10); // Number of items per page
  const [filterText, setFilterText] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  

  useEffect(() => {
    const fetchQuotations = async () => {
      try {
        const response = await axios.get(`https://crmdemo.vimubds5.a2hosted.com/api/quotation-data`);
        setQuotations(response.data);
        console.log(response);
      } catch (error) {
        console.error("Error fetching quotations:", error);
      }
    };

    fetchQuotations();
  }, []);



 

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const handleFilterChange = (event) => {
    setFilterText(event.target.value);
  };

  const handleSortChange = () => {
    setSortAsc(!sortAsc);
  };

  const filteredQuotations = quotations
    .filter(quotation => quotation.quotation_name.toLowerCase().includes(filterText.toLowerCase()))
    

  const offset = currentPage * itemsPerPage;
  const currentQuotations = filteredQuotations.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(filteredQuotations.length / itemsPerPage);

  return (
    <>
    <MainHeader/>
    <Sider/>
    <div className="container mt-5 px-2 mx-auto p-4">
  <Link to="/quotation-section" className="text-white">
    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2">
      <i className="bi bi-arrow-return-left mx-1"></i>Back
    </button>
  </Link>
  
  <div className="w-full px-2 mt-4">
    <h2 className="text-2xl font-bold mb-4">List of Quotations</h2>
    
    <div className="flex justify-between mb-4">
      <input
        type="text"
        placeholder="Filter by Quotation Name"
        value={filterText}
        onChange={handleFilterChange}
        className="form-input border-gray-300 rounded-md shadow-sm w-full max-w-md"
      />
    </div>

    <div className="">
      <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee Id</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quotation Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {currentQuotations.map((quotation, index) => (
            <tr key={quotation.quotation_id}>
              <td className="px-6 py-4 whitespace-nowrap">{offset + index + 1}</td>
              <td className="px-6 py-4 whitespace-nowrap">{quotation.employeeId}</td>
              <td className="px-6 py-4 whitespace-nowrap">{quotation.employee_name}</td>
              <td className="px-6 py-4 whitespace-nowrap">{quotation.quotation_name}</td>
              <td className="px-6 py-4 whitespace-nowrap">{moment(quotation.created_date).format('DD/MM/YYYY')}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Link to={`/admin-view-quotation/${quotation.quotation_id}`}>
                  <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded m-1">View</button>
                </Link>
                
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ReactPaginate
        previousLabel={'previous'}
        nextLabel={'next'}
        breakLabel={'...'}
        pageCount={pageCount}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageClick}
        containerClassName={'flex justify-center space-x-2 mt-4'}    
        pageClassName={'bg-white border border-gray-300 rounded-md'}
        pageLinkClassName={'py-2 px-4 text-sm text-gray-700 hover:bg-gray-200'}
        previousClassName={'bg-white border border-gray-300 rounded-md'}
        previousLinkClassName={'py-2 px-4 text-sm text-gray-700 hover:bg-gray-200'}
        nextClassName={'bg-white border border-gray-300 rounded-md'}
        nextLinkClassName={'py-2 px-4 text-sm text-gray-700 hover:bg-gray-200'}
        breakClassName={'bg-white border border-gray-300 rounded-md'}
        breakLinkClassName={'py-2 px-4 text-sm text-gray-700 hover:bg-gray-200'}
        activeClassName={'bg-gray-200'}
      />
    </div>
  </div>
</div>

    </>
    
  
  );
};

export default QuotationList;

