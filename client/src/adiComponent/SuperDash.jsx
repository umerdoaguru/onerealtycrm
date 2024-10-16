import React, { useState } from "react";
import Overview from "./Overview2";
import PaymentsGraph from "./QuotationGraph";
import DevicesGraph from "./LeadsGraph";
import LeadsReport from "./LeadsReport";
import ToDoList from "./Todo";
import Sider from "../components/Sider";
import { FaBars, FaTimes } from "react-icons/fa"; // Icons for hamburger and close
import MainHeader from "./../components/MainHeader";
import Invoice from "./Invoice";
import axios from "axios";
import LeadsGraph from "./LeadsGraph";
import QuotationGraph from "./QuotationGraph";
import SuperAdminSider from "./Super-Admin/SuperAdminSider";
import SuperHeader from "./Super-Admin/SuperHeader";

const SuperDash = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const getInvoiceData = () => {
    try {
      const response = axios.get("http://localhost:9000/api/invoiceData");
    } catch (err) {}
  };

  return (
    <>
      <MainHeader />
      <SuperAdminSider />
      {/* <SuperHeader /> */}

<div className="container">
  
      <h1 className="text-2xl text-center mt-[5rem] font-medium">
        Super Admin Dashboard
      </h1>
      <div className="mx-auto h-[3px] w-16 bg-[#34495E] my-3"></div>
      <div className="flex min-h-screen overflow-hidden ">
        {/* Main Content */}
        {/* <div className="flex-1 max-w-full lg:ml-64 xl:ml-52 mr-3 "> */}
        <div className="flex-1 max-w-full mr-3 ">
          {/* Hamburger Menu Button for Mobile */}
          {/* <div className="p-4 lg:hidden">
                    <button onClick={toggleSidebar} className="text-2xl">
                        <FaBars />
                    </button>
                </div> */}

          {/* Adjust grid layout for different screen sizes */}
          <div>
            <Overview />
          </div>
          <div className="grid grid-cols-1 gap-4 mt-6 md:grid-cols-2 lg:grid-cols-2">
            <Invoice />
            <LeadsGraph />
          </div>

          <LeadsReport />
          {/* <ToDoList /> */}
        </div>
      </div>
      </div>
    </>
  );
};

export default SuperDash;
