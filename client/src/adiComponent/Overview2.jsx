import React, { useEffect, useState } from "react";
import LeadData from "../components/DataExport/LeadData";
import QuotationData from "../components/DataExport/QuotationData";
import InvoiceData from "../components/DataExport/InvoiceData"; // Add your invoice component here if it exists
import Employees from "../components/DataExport/Employees";
import { useSelector } from "react-redux";
import axios from "axios";
// import MainHeader from '../components/MainHeader';
// import Sider from '../components/Sider';
import { SiMoneygram } from "react-icons/si";
import { MdOutlineNextWeek } from "react-icons/md";
import { GiFiles, GiMoneyStack } from "react-icons/gi";
import { Link } from "react-router-dom";

const Overview2 = () => {
  // const [metrics, setMetrics] = useState([
  //     { title: 'Total Leads', value: 0, positive: true },
  //     { title: 'Total Invoices', value: 0, positive: false },
  //     { title: 'Total Quotation', value: 0, positive: true },
  //     { title: 'Total Employees', value: 0, positive: true },
  // ]);
  const [leads, setLeads] = useState([]);
  const [employee, setEmployee] = useState([]);
  const [selectedComponent, setSelectedComponent] = useState("LeadData"); // Set 'LeadData' as default

  const UserId = useSelector((state) => state.auth.user.id);

  useEffect(() => {
    fetchLeads();
    fetchEmployee();
    // fetchQuotation();
    // fetchInvoice();
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

  // const fetchQuotation = async () => {
  //   try {
  //     const response = await axios.get(`http://localhost:9000/api/get-quotation-data`);
  //     console.log(response.data);
  //     setQuotation(response.data.data);
  //   } catch (error) {
  //     console.error("Error fetching quotations:", error);
  //   }
  // };

  // const fetchInvoice = async () => {
  //   try {
  //     const response = await axios.get(`http://localhost:9000/api/invoice-data`);
  //     setInvoice(response.data);
  //   } catch (error) {
  //     console.error("Error fetching invoices:", error);
  //   }
  // };

  const employeeCount = employee.length;
  const leadCount = leads.length;
  // const quotationCount = quotation.length;
  // const invoiceCount = invoice.length;

  return (
    <>
      <div className="flex flex-wrap justify-around mt-5">
        <div className="w-full sm:w-1/2 lg:w-1/4 xl:w-1/5 my-3 p-0 sm-mx-0 mx-3  ">
          <Link to="/super-admin-total-lead">
            <div
              className="shadow-lg rounded-lg overflow-hidden cursor-pointer text-gray-600 border-1" // Change background color if active
              //   onClick={() => setSelectedComponent('LeadData')}  // Set selected component
            >
              <div className="p-4 flex flex-col items-center text-center">
                <div className=" text-3xl text-gray-700">
                  <GiFiles />
                </div>
                <div className="mt-2">
                  <h5 className="text-gray-800 text-xl font-semibold ">
                    Total Leads{" "}
                  </h5>
                  <p className="text-gray-800 text-xl font-semibold ">
                    {leadCount}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        </div>

        <div className="w-full sm:w-1/2 lg:w-1/4 xl:w-1/5 my-3 p-0 sm-mx-0 mx-3">
          <Link to="/super-admin-total-visit">
            <div className="shadow-lg rounded-lg overflow-hidden cursor-pointer text-gray-600">
              <div className="p-4 flex flex-col items-center text-center">
                <div className=" text-3xl text-gray-700">
                  <MdOutlineNextWeek />
                </div>
                <div className="mt-2">
                  <h5 className="text-gray-800 text-xl font-semibold ">
                    Total Visit
                  </h5>
                  <p className="text-gray-800 text-xl font-semibold ">
                    {leads.filter((item) => item.visit !== "pending").length}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        </div>

        <div className="w-full sm:w-1/2 lg:w-1/4 xl:w-1/5 my-3 p-0 sm-mx-0 mx-3">
          <Link to="/super-admin-total-employee">
            <div
              className="shadow-lg rounded-lg overflow-hidden cursor-pointer text-gray-600" // Change background color if active
              //   onClick={() => setSelectedComponent('EmployeeData')}  // Set selected component
            >
              <div className="p-4 flex flex-col items-center text-center">
                <div className=" text-3xl text-gray-700">
                  <SiMoneygram />
                </div>
                <div className="mt-2">
                  <h5 className="text-gray-800 text-xl font-semibold ">
                    Total Employees{" "}
                  </h5>
                  <p className="text-gray-800 text-xl font-semibold ">
                    {employeeCount}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Overview2;
