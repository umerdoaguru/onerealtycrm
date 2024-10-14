import React, { useEffect, useState } from "react";
import MainHeader from "../components/MainHeader";
import Sider from "../components/Sider";

import { Link } from "react-router-dom";
import axios from "axios";
import { SiMoneygram } from "react-icons/si";
import { MdOutlineNextWeek } from "react-icons/md";
import { GiFiles, GiMoneyStack } from "react-icons/gi";
import { useSelector } from "react-redux";
import LeadData from "../components/DataExport/LeadData";
import QuotationData from "../components/DataExport/QuotationData";
import InvoiceData from "../components/DataExport/InvoiceData"; // Add your invoice component here if it exists
import Employees from "../components/DataExport/Employees";

function DataExport() {
  const [leads, setLeads] = useState([]);
  const [employee, setEmployee] = useState([]);
  const [quotation, setQuotation] = useState([]);
  const [invoice, setInvoice] = useState([]);
  const [selectedComponent, setSelectedComponent] = useState("LeadData"); // Set 'LeadData' as default

  const UserId = useSelector((state) => state.auth.user.id);

  useEffect(() => {
    fetchLeads();
    fetchEmployee();
    fetchQuotation();
    fetchInvoice();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await axios.get("http://localhost:9000/api/leads");
      setLeads(response.data);
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
  };

  const fetchEmployee = async () => {
    try {
      const response = await axios.get(`http://localhost:9000/api/employee`);
      setEmployee(response.data);
    } catch (error) {
      console.error("Error fetching employee data:", error);
    }
  };

  const fetchQuotation = async () => {
    try {
      const response = await axios.get(
        `http://localhost:9000/api/quotation-data`
      );
      setQuotation(response.data);
    } catch (error) {
      console.error("Error fetching quotations:", error);
    }
  };

  const fetchInvoice = async () => {
    try {
      const response = await axios.get(
        `http://localhost:9000/api/invoice-data`
      );
      setInvoice(response.data);
    } catch (error) {
      console.error("Error fetching invoices:", error);
    }
  };

  const leadCount = leads.length;
  const employeeCount = employee.length;
  const quotationCount = quotation.length;
  const invoiceCount = invoice.length;

  return (
    <>
      <MainHeader />
      <Sider />
      <div className="container  ">
        <h1 className="text-2xl text-center mt-[5rem] font-medium">
          Data Export
        </h1>
        <div className="mx-auto h-[3px] w-16 bg-[#34495E] my-3"></div>

        <div className="flex flex-wrap justify-around mt-5">
          <div className="w-full sm:w-1/2 lg:w-1/4 xl:w-1/5 my-3 p-0 sm-mx-0 mx-3 ">
            <div
              className={` shadow-lg rounded-lg overflow-hidden cursor-pointer ${
                selectedComponent === "LeadData" ? "bg-blue-500 text-white" : ""
              }`} // Change background color if active
              onClick={() => setSelectedComponent("LeadData")} // Set selected component
            >
              <div className="p-4 flex flex-col items-center text-center">
                <div
                  className={`text-3xl ${
                    selectedComponent === "LeadData"
                      ? "text-white"
                      : "text-gray-700"
                  }`}
                >
                  <GiFiles />
                </div>
                <div className="mt-2">
                  <h5
                    className={`text-xl font-semibold ${
                      selectedComponent === "LeadData"
                        ? "text-white"
                        : "text-gray-800"
                    }`}
                  >
                    Leads Data
                  </h5>
                  <p
                    className={`${
                      selectedComponent === "LeadData"
                        ? "text-white"
                        : "text-gray-600"
                    }`}
                  >
                    {leadCount}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full sm:w-1/2 lg:w-1/4 xl:w-1/5 my-3 p-0 sm-mx-0 mx-3">
            <div
              className={` shadow-lg rounded-lg overflow-hidden cursor-pointer ${
                selectedComponent === "EmployeeData"
                  ? "bg-blue-500 text-white"
                  : ""
              }`} // Change background color if active
              onClick={() => setSelectedComponent("EmployeeData")} // Set selected component
            >
              <div className="p-4 flex flex-col items-center text-center">
                <div
                  className={`text-3xl ${
                    selectedComponent === "EmployeeData"
                      ? "text-white"
                      : "text-gray-700"
                  }`}
                >
                  <SiMoneygram />
                </div>
                <div className="mt-2">
                  <h5
                    className={`text-xl font-semibold ${
                      selectedComponent === "EmployeeData"
                        ? "text-white"
                        : "text-gray-800"
                    }`}
                  >
                    Employees Data
                  </h5>
                  <p
                    className={`${
                      selectedComponent === "EmployeeData"
                        ? "text-white"
                        : "text-gray-600"
                    }`}
                  >
                    {employeeCount}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full sm:w-1/2 lg:w-1/4 xl:w-1/5 my-3 p-0 sm-mx-0 mx-3">
            <div
              className={` shadow-lg rounded-lg overflow-hidden cursor-pointer ${
                selectedComponent === "QuotationData"
                  ? "bg-blue-500 text-white"
                  : ""
              }`} // Change background color if active
              onClick={() => setSelectedComponent("QuotationData")} // Set selected component
            >
              <div className="p-4 flex flex-col items-center text-center">
                <div
                  className={`text-3xl ${
                    selectedComponent === "QuotationData"
                      ? "text-white"
                      : "text-gray-700"
                  }`}
                >
                  <MdOutlineNextWeek />
                </div>
                <div className="mt-2">
                  <h5
                    className={`text-xl font-semibold ${
                      selectedComponent === "QuotationData"
                        ? "text-white"
                        : "text-gray-800"
                    }`}
                  >
                    Quotation Data
                  </h5>
                  <p
                    className={`${
                      selectedComponent === "QuotationData"
                        ? "text-white"
                        : "text-gray-600"
                    }`}
                  >
                    {quotationCount}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full sm:w-1/2 lg:w-1/4 xl:w-1/5 my-3 p-0 sm-mx-0 mx-3 ">
            <div
              className={` shadow-lg rounded-lg overflow-hidden cursor-pointer ${
                selectedComponent === "InvoiceData"
                  ? "bg-blue-500 text-white"
                  : ""
              }`} // Change background color if active
              onClick={() => setSelectedComponent("InvoiceData")} // Set selected component
            >
              <div className="p-4 flex flex-col items-center text-center">
                <div
                  className={`text-3xl ${
                    selectedComponent === "InvoiceData"
                      ? "text-white"
                      : "text-gray-700"
                  }`}
                >
                  <GiMoneyStack />
                </div>
                <div className="mt-2">
                  <h5
                    className={`text-xl font-semibold ${
                      selectedComponent === "InvoiceData"
                        ? "text-white"
                        : "text-gray-800"
                    }`}
                  >
                    Invoice Data
                  </h5>
                  <p
                    className={`${
                      selectedComponent === "InvoiceData"
                        ? "text-white"
                        : "text-gray-600"
                    }`}
                  >
                    {invoiceCount}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Conditionally render the selected component */}
        <div className="w-full h-[calc(100vh-10rem)] overflow-y-auto">
          {selectedComponent === "LeadData" && <LeadData />}
          {selectedComponent === "EmployeeData" && <Employees />}
          {selectedComponent === "QuotationData" && <QuotationData />}
          {selectedComponent === "InvoiceData" && <InvoiceData />}
        </div>
      </div>
    </>
  );
}

export default DataExport;
