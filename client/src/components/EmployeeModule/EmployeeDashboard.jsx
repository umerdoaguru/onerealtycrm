import React, { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa'; // Icons for hamburger and close
import MainHeader from '../MainHeader'
import EmployeeSider from './EmployeeSider';
import EmployeeInvoiceGraph from './DashboardCompo/EmployeeInvoiceGraph';
import EmployeeLeadsGraph from './DashboardCompo/EmployeeLeadGraph';
import EmployeeQuotationGraph from './DashboardCompo/EmployeeQuotationGraph';
import EmployeeOverview from './DashboardCompo/EmployeDashboardOverview';
import EmployeeLeadsReport from './DashboardCompo/EmployeeLeadsReport';

function EmployeeDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
      setIsSidebarOpen(!isSidebarOpen);
  };
  return (
    <>
    <MainHeader/>
   <EmployeeSider/>
   <h1 className="text-2xl text-center mt-[5rem]">Employee Dashboard</h1>
   <div className="mx-auto h-[3px] w-16 bg-[#34495E] my-3"></div>
   <div className="flex min-h-screen overflow-hidden">
            {/* Main Content */}
            <div className="flex-1 max-w-full lg:ml-64 xl:ml-52 mr-3 ">
                {/* Hamburger Menu Button for Mobile */}
                {/* <div className="p-4 lg:hidden">
                    <button onClick={toggleSidebar} className="text-2xl">
                        <FaBars />
                    </button>
                </div> */}
                
                {/* Adjust grid layout for different screen sizes */}
                <div>
                    <EmployeeOverview />
                </div>
                <div className="grid grid-cols-1 gap-4 mt-6 md:grid-cols-2 lg:grid-cols-3">
                    {/* <Invoice /> */}
                    <EmployeeInvoiceGraph />
                    <EmployeeLeadsGraph />
                    <EmployeeQuotationGraph />
                </div>
                <EmployeeLeadsReport />
                {/* <ToDoList /> will not use remote it  */}
            </div>
        </div>
  
  </>
  )
}

export default EmployeeDashboard