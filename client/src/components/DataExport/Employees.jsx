import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import * as XLSX from 'xlsx';
import Sider from '../Sider';
import Header from '../../pages/Quotation/Header';
import styled from 'styled-components';

function Employees() {
    const [employee, setEmployee] = useState([]);
    const [filteredEmployee, setFilteredEmployee] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    // Fetch employee from the API
    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const response = await axios.get('http://localhost:9000/api/employee');
            setEmployee(response.data);
            setFilteredEmployee(response.data); // Initial data set for filtering
        } catch (error) {
            console.error('Error fetching employee:', error);
        }
    };

    // Automatically apply date filter when start or end date changes
    useEffect(() => {
        if (startDate && endDate) {
            const filtered = employee.filter((employees) => {
                const createdTime = moment(employees.createdTime, 'YYYY-MM-DD');
                return createdTime.isBetween(startDate, endDate, undefined, '[]');
            });
            setFilteredEmployee(filtered);
        } else {
            setFilteredEmployee(employee);
        }
    }, [startDate, endDate, employee]);

    const downloadExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(filteredEmployee);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "employee");
        XLSX.writeFile(workbook, "employeeData.xlsx");
    };

    return (
        <Wrapper>
            <Header />
            <Sider />
            <div className="container">
            <h1 className="text-2xl text-center mt-[2rem] font-medium">Employee Data</h1>
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

                {/* Download Button */}
             

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
                                <th className="px-6 py-3 border-b-2 border-gray-300">Salary</th>
                                <th className="px-6 py-3 border-b-2 border-gray-300">Created Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEmployee.map((employees, index) => (
                                <tr key={employees.id} className={index % 2 === 0 ? "bg-gray-100" : ""}>
                                    <td className="px-6 py-4 border-b border-gray-200 text-gray-800">{index + 1}</td>
                                    <td className="px-6 py-4 border-b border-gray-200 text-gray-800">{employees.employeeId}</td>
                                    <td className="px-6 py-4 border-b border-gray-200 text-gray-800">{employees.name}</td>
                                    <td className="px-6 py-4 border-b border-gray-200 text-gray-800">{employees.email}</td>
                                    <td className="px-6 py-4 border-b border-gray-200 text-gray-800">{employees.position}</td>
                                    <td className="px-6 py-4 border-b border-gray-200 text-gray-800">{employees.phone}</td>
                                    <td className="px-6 py-4 border-b border-gray-200 text-gray-800">{employees.salary}</td>
                                    <td className="px-6 py-4 border-b border-gray-200 text-gray-800">{moment(employees.createdTime).format('DD/MM/YYYY')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </Wrapper>
    );
}

export default Employees;

const Wrapper = styled.div`
.respo{
    @media screen and (max-width: 768px) {
        margin-top: 1rem;
    }
}

`;

