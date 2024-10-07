import axios from 'axios';
import moment from 'moment';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';


import { useSelector } from 'react-redux';
import MainHeader from '../../../MainHeader';
import EmployeeSider from './../../EmployeeSider';

function TotalEmpQuotation() {
  const EmpId = useSelector(state => state.auth.user.id);
    const [quotations, setQuotations] = useState([]);
    useEffect(() => {
        const fetchQuotations = async () => {
          try {
            const response = await axios.get(`https://crmdemo.vimubds5.a2hosted.com/api/get-quotation-byEmploye/${EmpId}`);
            setQuotations(response.data);
            console.log(response);
          } catch (error) {
            console.error("Error fetching quotations:", error);
          }
        };
    
        fetchQuotations();
      }, []);
    
  return (
   <>
   <MainHeader/>
  <EmployeeSider/>
<div className="container">

<h1 className="text-2xl text-center mt-[5rem]">Total Quotations </h1>
<div className="mx-auto h-[3px] w-16 bg-[#34495E] my-3"></div>
</div>
   <div className="container">

   <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee Id</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quotation Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created Date</th>
      
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {quotations.map((quotation, index) => (
            <tr key={quotation.quotation_id}>
              <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
              <td className="px-6 py-4 whitespace-nowrap">{quotation.employeeId}</td>
              <td className="px-6 py-4 whitespace-nowrap">{quotation.employee_name}</td>
              <td className="px-6 py-4 whitespace-nowrap">{quotation.quotation_name}</td>
              <td className="px-6 py-4 whitespace-nowrap">{moment(quotation.created_date).format('DD/MM/YYYY')}</td>
           
            </tr>
          ))}
        </tbody>
      </table>
   </div>
   
   </>
  )
}

export default TotalEmpQuotation