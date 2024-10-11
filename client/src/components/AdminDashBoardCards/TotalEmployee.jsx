import axios from 'axios';
import React, { useEffect, useState } from 'react'
import MainHeader from '../MainHeader';
import Sider from '../Sider';
import { useNavigate } from 'react-router-dom';

function TotalEmployee() {
    const [employees, setEmployees] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        fetchEmployees();
      }, []);
    
      const fetchEmployees = async () => {
        try {
          const response = await axios.get('http://localhost:9000/api/getAllEmployees');
          const { employees } = response.data;
          setEmployees(employees || []); // Ensure employees is always an array
        } catch (error) {
          console.error('Error fetching employees:', error);
        }
      };
      
  const handleEmployeeClick = (employeeId) => {
    navigate(`/employee-single/${employeeId}`); 
  };
    
  return (
   
    <>

<MainHeader/>
  <Sider/>
<div className="container">
<h1 className="text-2xl text-center mt-[5rem]">Total Employees </h1>
<div className="mx-auto h-[3px] w-16 bg-[#34495E] my-3"></div>
</div>
       <div className="overflow-x-auto rounded-lg shadow-md">
<button>f</button>
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
              {employees.length > 0 ? (
                employees
                  .filter((employee) => employee && employee.name) // Ensure employee and employee.name exist
                  .map((employee, index) => (
                    <tr
                      key={employee.employeeId}
                      className="border-b border-gray-200 cursor-pointer hover:bg-gray-100"
                      onClick={() => handleEmployeeClick(employee.employeeId)} // Navigate on row click

                    >
                      <td className="px-4 py-4 sm:px-6">{employee.name}</td>
                      <td className="px-4 py-4 sm:px-6">{employee.email}</td>
                      <td className="px-4 py-4 sm:px-6">{employee.position}</td>
                      <td className="px-4 py-4 sm:px-6">{employee.phone}</td>
                    
                    
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
    
    </>
  )
}

export default TotalEmployee