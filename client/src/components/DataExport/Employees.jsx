import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import * as XLSX from "xlsx";
import ReactPaginate from "react-paginate"; // Import ReactPaginate
// import Sider from "../Sider";
import Header from "../../pages/Quotation/Header";
import styled from "styled-components";

function Employees() {
  const [employee, setEmployee] = useState([]);
  const [filteredEmployee, setFilteredEmployee] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(10); // Items per page

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get("http://localhost:9000/api/employee");
      setEmployee(response.data);
      setFilteredEmployee(response.data);
    } catch (error) {
      console.error("Error fetching employee:", error);
    }
  };

  useEffect(() => {
    if (startDate && endDate) {
      const filtered = employee.filter((employees) => {
        const createdTime = moment(employees.createdTime, "YYYY-MM-DD");
        return createdTime.isBetween(startDate, endDate, undefined, "[]");
      });
      setFilteredEmployee(filtered);
    } else {
      setFilteredEmployee(employee);
    }
  }, [startDate, endDate, employee]);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredEmployee);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "employee");
    XLSX.writeFile(workbook, "employeeData.xlsx");
  };

  // Pagination logic
  const offset = currentPage * itemsPerPage;
  const currentItems = filteredEmployee.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(filteredEmployee.length / itemsPerPage);

  return (
    <Wrapper>
      <Header />
      {/* <Sider /> */}
      <div className="container">
        <h1 className="text-2xl text-center mt-[2rem] font-medium">
          Employee Data
        </h1>
        <div className="mx-auto h-[3px] w-16 bg-[#34495E] my-3"></div>

        {/* Date Filter */}
        <div className="flex space-x-1 mb-4 sm:flex-row flex-col">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border p-2"
          />
          <div className="p-2">
            <p>to</p>
          </div>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border p-2"
          />
          <div className="respo mx-2 ">
            <button
              onClick={downloadExcel}
              className="bg-blue-500 text-white font-medium px-4 py-2 rounded hover:bg-blue-700"
            >
              Download Excel
            </button>
          </div>
        </div>

        {/* Employee Table */}
        <div className="overflow-x-auto mt-4">
          <table className="min-w-full bg-white border">
            <thead>
              <tr>
                <th className="px-6 py-3 border-b-2 border-gray-300">S.no</th>
                <th className="px-6 py-3 border-b-2 border-gray-300">Employees Number</th>
                <th className="px-6 py-3 border-b-2 border-gray-300">Name</th>
                <th className="px-6 py-3 border-b-2 border-gray-300">Email Id</th>
                <th className="px-6 py-3 border-b-2 border-gray-300">Position</th>
                <th className="px-6 py-3 border-b-2 border-gray-300">Phone</th>
                <th className="px-6 py-3 border-b-2 border-gray-300">Created Date</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((employees, index) => (
                <tr key={employees.id} className={index % 2 === 0 ? "bg-gray-100" : ""}>
                  <td className="px-6 py-4 border-b border-gray-200 text-gray-800">{offset + index + 1}</td>
                  <td className="px-6 py-4 border-b border-gray-200 text-gray-800">{employees.employeeId}</td>
                  <td className="px-6 py-4 border-b border-gray-200 text-gray-800">{employees.name}</td>
                  <td className="px-6 py-4 border-b border-gray-200 text-gray-800">{employees.email}</td>
                  <td className="px-6 py-4 border-b border-gray-200 text-gray-800">{employees.position}</td>
                  <td className="px-6 py-4 border-b border-gray-200 text-gray-800">{employees.phone}</td>
                  <td className="px-6 py-4 border-b border-gray-200 text-gray-800">{moment(employees.createdTime).format("DD/MM/YYYY")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-2 mb-2 flex justify-center">
          <ReactPaginate
            previousLabel="Previous"
            nextLabel="Next"
            breakLabel="..."
            pageCount={pageCount}
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
        </div>
      </div>
    </Wrapper>
  );
}

export default Employees;

const Wrapper = styled.div`
  .respo {
    @media screen and (max-width: 768px) {
      margin-top: 1rem;
    }
  }
  .active {
  background-color: #1e50ff;
}
 /* Container class */
 .pagination-container {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.75rem;
    margin-top: 1.5rem;
  }

  /* Page item */
  .pagination-page {
    background-color: white;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  /* Page link */
  .pagination-link {
    padding: 0.25rem 1rem;
    font-size: 0.875rem;
    color: #3b82f6;
    text-decoration: none;
    &:hover {
      color: #2563eb;
    }
  }

  /* Previous button */
  .pagination-previous {
    background-color: white;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  } 

  .pagination-link-previous {
    padding: 0.25rem 1rem;
    font-size: 0.875rem;
    color: #374151;
    &:hover {
      background-color: #f3f4f6;
    }
  }

  /* Next button */
  .pagination-next {
    background-color: white;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .pagination-link-next {
    padding: 0.25rem 1rem;
    font-size: 0.875rem;
    color: #374151;
    &:hover {
      background-color: #f3f4f6;
    }
  }

  /* Break item */
  .pagination-break {
    background-color: white;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .pagination-break-link {
    padding: 0.25rem 1rem;
    font-size: 0.875rem;
    color: #374151;
    &:hover {
      background-color: #f3f4f6;
    }
  }

  /* Active page */
  .pagination-active {
    background-color: #1e50ff;
    color: white;
    border: 1px solid #374151;
    border-radius: 0.375rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .pagination-active a {
    color: white !important;
  }
`;
