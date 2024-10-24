import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { MdOutlineNextWeek } from "react-icons/md";
import { GiFiles, GiMoneyStack } from "react-icons/gi";
import { Link } from "react-router-dom";
import { FaClipboardList, FaCheckCircle } from "react-icons/fa"; // Import icons for Visit and Closed Data

const EmployeeOverview = () => {
  // const [metrics, setMetrics] = useState([
  //     { title: 'Total Leads', value: 0, positive: true },
  //     { title: 'Total Invoices', value: 0, positive: false },
  //     { title: 'Total Quotation', value: 0, positive: true },
  //     { title: 'Total Employees', value: 0, positive: true },
  // ]);
  const [leads, setLeads] = useState([]);
  // const [employee, setEmployee] = useState([]);
  const [quotation, setQuotation] = useState([]);
  const [invoice, setInvoice] = useState([]);
  const [selectedComponent, setSelectedComponent] = useState("LeadData"); // Set 'LeadData' as default

  const EmpId = useSelector((state) => state.auth.user.id);

  useEffect(() => {
    fetchLeads();
    //   fetchEmployee();
    fetchQuotation();
    fetchInvoice();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await axios.get(
        `http://localhost:9000/api/employe-leads/${EmpId}`
      );
      setLeads(response.data);
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
  };

  //   const fetchEmployee = async () => {
  //     try {
  //       const response = await axios.get(`http://localhost:9000/api/employee`);
  //       setEmployee(response.data);
  //     } catch (error) {
  //       console.error("Error fetching employee data:", error);
  //     }
  //   };

  const fetchQuotation = async () => {
    try {
      const response = await axios.get(
        `http://localhost:9000/api/get-quotation-byEmploye/${EmpId}`
      );
      console.log(response.data);
      setQuotation(response.data);
    } catch (error) {
      console.error("Error fetching quotations:", error);
    }
  };

  const fetchInvoice = async () => {
    try {
      const response = await axios.get(
        `http://localhost:9000/api/get-employee-invoice/${EmpId}`
      );
      setInvoice(response.data);
    } catch (error) {
      console.error("Error fetching invoices:", error);
    }
  };

  console.log(invoice, quotation, leads);

  const leadCount = leads.length;
  //   const employeeCount = employee.length;

  const visitCount = leads.filter(
    (lead) => lead.visit === "Fresh Visit" || lead.visit === "Repeated Visit"
  ).length;

  const closedCount = leads.filter(
    (lead) => lead.deal_status === "close"
  ).length; // Get count for Closed Data

  const quotationCount = quotation.length;
  const invoiceCount = invoice.length;

  return (
    <>
      {/* <div className="w-full  h-screen"> */}

      <div className="flex flex-wrap justify-around mt-5">
        <div className="w-full sm:w-1/2 lg:w-1/4 xl:w-1/5 my-3 p-0 sm-mx-0 mx-3  ">
          <Link to="/employees-total-leads">
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
                  Total Assign Leads{" "}
                  </h5>
                  <p className="text-gray-800 text-xl font-semibold ">
                    {leadCount}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* <div className="w-full sm:w-1/2 lg:w-1/4 xl:w-1/5 my-3 p-0 sm-mx-0 mx-3">
            <div
              className="shadow-lg rounded-lg overflow-hidden cursor-pointer text-gray-600"   // Change background color if active
            //   onClick={() => setSelectedComponent('EmployeeData')}  // Set selected component
            >
              <div className="p-4 flex flex-col items-center text-center">
                <div className=" text-3xl text-gray-700">
                  <SiMoneygram />
                </div>
                <div className="mt-2">
                  <h5 className="text-gray-800 text-xl font-semibold ">Total Employees </h5>
                  <p className="text-gray-800 text-xl font-semibold ">{employeeCount}</p>
                </div>
              </div>
            </div>
          </div> */}

        {/* <div className="w-full sm:w-1/2 lg:w-1/4 xl:w-1/5 my-3 p-0 sm-mx-0 mx-3">
          <Link to="/employees-total-quotations">
            <div className="shadow-lg rounded-lg overflow-hidden cursor-pointer text-gray-600">
              <div className="p-4 flex flex-col items-center text-center">
                <div className=" text-3xl text-gray-700">
                  <MdOutlineNextWeek />
                </div>
                <div className="mt-2">
                  <h5 className="text-gray-800 text-xl font-semibold ">
                    Total Quotation
                  </h5>
                  <p className="text-gray-800 text-xl font-semibold ">
                    {quotationCount}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        </div> */}

        {/* Card for Visit Data */}
        <div className="w-full sm:w-1/2 lg:w-1/4 xl:w-1/5 my-3 p-0 sm-mx-0 mx-3">
          <Link to="/visit-data">
            <div
              className={`shadow-lg rounded-lg overflow-hidden cursor-pointer ${
                selectedComponent === "VisitData"
                  ? "bg-blue-500 text-white"
                  : ""
              }`}
              onClick={() => setSelectedComponent("VisitData")}
            >
              <div className="p-4 flex flex-col items-center text-center">
                <div
                  className={`text-3xl ${
                    selectedComponent === "VisitData"
                      ? "text-white"
                      : "text-gray-700"
                  }`}
                >
                  <FaClipboardList />
                </div>
                <div className="mt-2">
                  <h5
                    className={`text-xl font-semibold ${
                      selectedComponent === "VisitData"
                        ? "text-white"
                        : "text-gray-800"
                    }`}
                  >
                    Visit Data
                  </h5>
                  <p
                    className={`${
                      selectedComponent === "VisitData"
                        ? "text-white"
                        : "text-gray-600"
                    }`}
                  >
                    {visitCount}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Card for Closed Data */}
        <div className="w-full sm:w-1/2 lg:w-1/4 xl:w-1/5 my-3 p-0 sm-mx-0 mx-3">
          <Link to="/close-data">
            <div
              className={`shadow-lg rounded-lg overflow-hidden cursor-pointer ${
                selectedComponent === "ClosedData"
                  ? "bg-blue-500 text-white"
                  : ""
              }`}
              onClick={() => setSelectedComponent("ClosedData")}
            >
              <div className="p-4 flex flex-col items-center text-center">
                <div
                  className={`text-3xl ${
                    selectedComponent === "ClosedData"
                      ? "text-white"
                      : "text-gray-700"
                  }`}
                >
                  <FaCheckCircle />
                </div>
                <div className="mt-2">
                  <h5
                    className={`text-xl font-semibold ${
                      selectedComponent === "ClosedData"
                        ? "text-white"
                        : "text-gray-800"
                    }`}
                  >
                    Closed Data
                  </h5>
                  <p
                    className={`${
                      selectedComponent === "ClosedData"
                        ? "text-white"
                        : "text-gray-600"
                    }`}
                  >
                    {closedCount}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* <div className="w-full sm:w-1/2 lg:w-1/4 xl:w-1/5 my-3 p-0 sm-mx-0 mx-3 ">
          <Link to="/employees-total-invoices">
            <div
              className="shadow-lg rounded-lg overflow-hidden cursor-pointer text-gray-600" // Change background color if active
              //   onClick={() => setSelectedComponent('InvoiceData')}  // Set selected component
            >
              <div className="p-4 flex flex-col items-center text-center">
                <div className=" text-3xl text-gray-700">
                  <GiMoneyStack />
                </div>
                <div className="mt-2">
                  <h5 className="text-gray-800 text-xl font-semibold ">
                    {" "}
                    Total Invoices
                  </h5>
                  <p className="text-gray-800 text-xl font-semibold ">
                    {invoiceCount}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        </div> */}
      </div>

      {/* Conditionally render the selected component */}
      {/* <div className="w-full h-[calc(100vh-10rem)] overflow-y-auto">
          {selectedComponent === 'LeadData' && <LeadData />}
          {selectedComponent === 'EmployeeData' && <Employees />}
          {selectedComponent === 'QuotationData' && <QuotationData />}
          {selectedComponent === 'InvoiceData' && <InvoiceData />}
        </div> */}
      {/* </div> */}
    </>
  );
};

export default EmployeeOverview;
