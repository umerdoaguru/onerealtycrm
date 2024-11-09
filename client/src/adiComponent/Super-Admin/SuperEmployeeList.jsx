


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

import MainHeader from './../../components/MainHeader';
import SuperAdminSider from './SuperAdminSider';
import ReactPaginate from 'react-paginate';

const SuperEmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 7; 


  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('https://crmdemo.vimubds5.a2hosted.com/api/getAllEmployee-Toal-lead');
      const { employees } = response.data;
      setEmployees(employees || []); // Ensure employees is always an array
      console.log(employees);
      
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const handleEmployeeClick = (employeeId) => {
    navigate(`/super-admin-employee-leads/${employeeId}`); 
  };

  const pageCount = Math.ceil(employees.length / itemsPerPage);

  // Pagination logic
  const indexOfLastLead = (currentPage + 1) * itemsPerPage;
  const indexOfFirstLead = indexOfLastLead - itemsPerPage;
  const currentLeads = employees.slice(indexOfFirstLead, indexOfLastLead);
  
  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
    console.log("change current page ", data.selected);
  };

  return (
    <>
      <MainHeader />
      <SuperAdminSider />
      <div className="container px-3 pt-5">
        <h1 className="text-2xl text-center mt-[2rem] font-medium">Lead Management</h1>
        <div className="mx-auto h-[3px] w-16 bg-[#34495E] my-3"></div>
      </div>

      <div className="container mt-12 flex flex-col min-h-screen lg:flex-row">
        <main className="flex-1 p-4 lg:p-8">
          <div className="overflow-x-auto rounded-lg shadow-md xl:ml-32">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="text-sm font-semibold text-left text-gray-600 uppercase bg-gray-200">
                  <th className="px-4 py-3 sm:px-6">Employee Id</th>
                  <th className="px-4 py-3 sm:px-6">Employee Name</th>
                  <th className="px-4 py-3 sm:px-6">Employee Email</th>
                  <th className="px-4 py-3 sm:px-6">Total Leads</th> {/* Add Total Leads Column */}
                </tr>
              </thead>
              <tbody>
                {currentLeads.length > 0 ? (
                  currentLeads
                    .filter((employee) => employee && employee.name) // Ensure employee and employee.name exist
                    .map((employee, index) => (
                      <tr
                        key={employee.employeeId}
                        className="border-b border-gray-200 cursor-pointer hover:bg-gray-100"
                        onClick={() => handleEmployeeClick(employee.employeeId)} 
                      >
                        <td className="px-4 py-4 sm:px-6">{employee.employeeId}</td>
                        <td className="px-4 py-4 sm:px-6">{employee.name}</td>
                        <td className="px-4 py-4 sm:px-6">{employee.email}</td>
                        <td className="px-4 py-4 sm:px-6">{employee.total_leads}</td> {/* Display Total Leads */}
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td colSpan="6" className="py-4 text-center">No employees found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        <div className="mt-3 mb-2 flex justify-center">
        <ReactPaginate
          previousLabel={"Previous"}
          nextLabel={"Next"}
          breakLabel={"..."}
          pageCount={pageCount}
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
        </main>
      </div>
    </>
  );
};

export default SuperEmployeeList;
