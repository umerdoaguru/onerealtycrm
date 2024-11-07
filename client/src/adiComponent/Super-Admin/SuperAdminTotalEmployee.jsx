import axios from 'axios';
import React, { useEffect, useState } from 'react';
import MainHeader from '../../components/MainHeader';
import SuperAdminSider from './SuperAdminSider';
import { useNavigate } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import styled from 'styled-components';

function SuperAdminTotalEmployee() {
  const [employees, setEmployees] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const employeesPerPage = 10; // Number of employees to display per page
  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('https://crm.one-realty.in/api/getAllEmployees');
      const { employees } = response.data;
      setEmployees(employees || []); // Ensure employees is always an array
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const displayedEmployees = employees.slice(
    currentPage * employeesPerPage,
    (currentPage + 1) * employeesPerPage
  );

  const handlePageClick = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  const handleEmployeeClick = (employeeId) => {
    navigate(`/super-admin-employee-single/${employeeId}`);
  };

  return (
    <>
      <MainHeader />
      <SuperAdminSider />
      <div className="container mt-[5rem]">
        <h1 className="text-2xl text-center ">Total Employees</h1>
        <div className="mx-auto h-[3px] w-16 bg-[#34495E] my-3"></div>
      </div>

      <div className="overflow-x-auto rounded-lg shadow-md xl:ml-48 mx-12">
        <table className="container bg-white">
          <thead>
            <tr className="text-sm font-semibold text-left text-gray-600 uppercase bg-gray-200">
              <th className="px-4 py-3 sm:px-6">Name</th>
              <th className="px-4 py-3 sm:px-6">Email</th>
              <th className="px-4 py-3 sm:px-6">Role</th>
              <th className="px-4 py-3 sm:px-6">Phone</th>
            </tr>
          </thead>
          <tbody>
            {displayedEmployees.length > 0 ? (
              displayedEmployees
                .filter((employee) => employee && employee.name)
                .map((employee, index) => (
                  <tr
                    key={employee.employeeId}
                    className="border-b border-gray-200 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleEmployeeClick(employee.employeeId)}
                  >
                    <td className="px-4 py-4 sm:px-6">{employee.name}</td>
                    <td className="px-4 py-4 sm:px-6">{employee.email}</td>
                    <td className="px-4 py-4 sm:px-6">{employee.position}</td>
                    <td className="px-4 py-4 sm:px-6">{employee.phone}</td>
                  </tr>
                ))
            ) : (
              <tr>
                <td colSpan="4" className="py-4 text-center">No employees found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <PaginationWrapper>
        <ReactPaginate
          previousLabel={"Previous"}
          nextLabel={"Next"}
          breakLabel={"..."}
          pageCount={Math.ceil(employees.length / employeesPerPage)}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageClick}
          containerClassName="pagination-container"
          pageClassName="pagination-page"
          pageLinkClassName="pagination-link"
          previousClassName="pagination-previous"
          previousLinkClassName="pagination-link-previous"
          nextClassName="pagination-next"
          nextLinkClassName="pagination-link-next"
          breakClassName="pagination-break"
          breakLinkClassName="pagination-break-link"
          activeClassName="pagination-active"
        />
      </PaginationWrapper>
    </>
  );
}

export default SuperAdminTotalEmployee;

const PaginationWrapper = styled.div`
  padding-bottom: 2rem;
  .pagination-container {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
    margin-top: 1.5rem;
  }

  .pagination-page {
    background-color: #ffffff;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: background-color 0.3s, transform 0.2s;
  }

  .pagination-link {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
    color: #3b82f6;
    text-decoration: none;
    transition: color 0.3s;

    &:hover {
      color: #2563eb;
    }
  }

  .pagination-previous,
  .pagination-next,
  .pagination-break {
    background-color: #ffffff;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: background-color 0.3s, transform 0.2s;
  }

  .pagination-link-previous,
  .pagination-link-next,
  .pagination-break-link {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
    color: #374151;
    transition: background-color 0.3s;

    &:hover {
      background-color: #f3f4f6;
      transform: translateY(-1px);
    }
  }

  .pagination-active {
    background-color: #1e50ff;
    color: white;
    border: 1px solid #374151;
    border-radius: 0.375rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  .pagination-active .pagination-link {
    color: white !important;
  }
`;
