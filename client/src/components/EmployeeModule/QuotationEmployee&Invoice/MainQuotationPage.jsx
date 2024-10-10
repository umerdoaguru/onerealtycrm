import React, { useEffect, useState } from "react";
import axios from "axios";

import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import styled from "styled-components";

import cogoToast from "cogo-toast";
import moment from "moment";
import UserLogin from "../../UserLogin";
import Logout from "../../Logout";
import EmployeeSider from "../EmployeeSider";
import MainHeader from "../../MainHeader";
import QuotationForm1 from "../../../pages/Quotation/QuotationForm1";
import CreateInvoice from "../../Invoice/CreateInvoice";

// import UserLogin from "../../components/UserLogin";
// import Logout from "../../components/Logout";
// import Sider from "../../components/Sider";

// import MainHeader from "../../components/MainHeader";
// import QuotationForm1 from "./QuotationForm1";
// import CreateInvoice from "../../components/Invoice/CreateInvoice";
// import QuotationList from "./QuotationList";
// import Invoicelist from "../../components/Invoice/Invoicelist";
import Footer from "./../../../pages/Quotation/Footer";
import EmployeeInvoiceList from "./EmployeeInvoiceList";
import EmployeeQuotationList from "./EmployeeQuotationList";

function MainQuotation() {
  const { id } = useParams();

  const [headerImage, setHeaderImage] = useState(null);
  const [footerImage, setFooterImage] = useState(null);
  const [logoImage, setlogoImage] = useState(null);
  const [companyNameBranch, setCompanyNameBranch] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountIFSC, setAccountIFSC] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountBank_Name, setAccountBank_Name] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [companyMoblie_no, setCompanyMoblie_no] = useState("");
  const [companyGST_no, setCompanyGST_no] = useState("");
  const [companyPan_no, setCompanyPan_no] = useState("");
  const [companyEmail_id, setCompanyEmail_id] = useState("");

  const [selectedCompany, setSelectedCompany] = useState("");
  const [companydigitalsign, setCompanydigitalsign] = useState(null);
  const navigate = useNavigate();
  const UserId = useSelector((state) => state.auth.user.id);
  const [companydata, setcompanydata] = useState([]);
  const [selectedComponent, setSelectedComponent] = useState("LeadData"); // Set 'LeadData' as default

  useEffect(() => {
    const fetchinvoice = async () => {
      try {
        const response = await axios.get(
          `http://localhost:9000/api/company-data`
        );
        setcompanydata(response.data);
        console.log(response);
      } catch (error) {
        console.error("Error fetching invoice:", error);
      }
    };

    fetchinvoice();
  }, [UserId]);

  const handleDeleteCompanyData = async (CompanyName) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this Company data?"
    );
    if (isConfirmed) {
      try {
        const response = await axios.post(
          "http://localhost:9000/api/companydata",
          {
            company_name: CompanyName,
          }
        );

        if (response.status === 200) {
          console.log("Company Data deleted successfully");
          // Refresh CompanyDatas after deletion
          window.location.reload();
        }
      } catch (error) {
        console.error("Error deleting Company Data:", error);
      }
    }
  };

  // const handleUpload = async (e) => {
  const handleHeaderImageChange = (e) => {
    setHeaderImage(e.target.files[0]);
  };

  const handleFooterImageChange = (e) => {
    setFooterImage(e.target.files[0]);
  };
  const handleLogoImageChange = (e) => {
    setlogoImage(e.target.files[0]);
  };
  const handledigitalSignImageChange = (e) => {
    setCompanydigitalsign(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();

      formData.append("header_img", headerImage);
      formData.append("footer_img", footerImage);

      formData.append("user_id", UserId);
      formData.append("company_name", companyNameBranch);
      formData.append("company_name_account_name", accountName);
      formData.append("company_name_account_ifsc", accountIFSC);
      formData.append("company_name_account_number", accountNumber);
      formData.append("bank", accountBank_Name);
      formData.append("company_address", companyAddress);
      formData.append("moblie_no", companyMoblie_no);
      formData.append("gst_no", companyGST_no);
      formData.append("pan_no", companyPan_no);
      formData.append("email_id", companyEmail_id);
      formData.append("logo", logoImage);
      formData.append("digital_sign", companydigitalsign);

      const response = await axios.post(
        "http://localhost:9000/api/upload-company-profile",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success === true) {
        // Trigger CogoToast success message

        // Reset input values after successful upload
        setHeaderImage(null);
        setFooterImage(null);
        setCompanyNameBranch("");
        setAccountName("");
        setAccountIFSC("");
        setAccountNumber("");
        setCompanyAddress("");
        setAccountBank_Name("");
        setCompanyMoblie_no("");
        setCompanyGST_no("");
        setCompanyPan_no("");
        setCompanyEmail_id("");
        setlogoImage(null);

        setCompanydigitalsign(null);

        window.location.reload();
        cogoToast.success(`${response.data.message}`);
      } else {
        console.error(
          "Error uploading company data and images:",
          response.statusText
        );
      }
    } catch (error) {
      console.error("Error uploading company data and images:", error.message);
    }
  };
  const handleEditCompany = (company) => {
    navigate(`/updatecompanydata`, { state: { company } });
  };

  const handleChangeCompany = (e) => {
    setSelectedCompany(e.target.value);
  };

  return (
    <>
      <Wrapper>
        <MainHeader />

        <EmployeeSider />
        <div className="container px-3 ">
          <div className="flex justify-between">
            <div className="mx-3 mt-3">
              <UserLogin />
            </div>
            <div className="mt-1 mx-3">
              <Logout />
            </div>
          </div>
        </div>

        <h1 className="text-2xl text-center mt-[2rem]">
          Quotation & Invoice Management
        </h1>
        <div className="mx-auto h-[3px] w-16 bg-[#34495E] my-3"></div>
        <div className="container flex flex-wrap justify-around mt-5">
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
                  {/* <GiFiles /> */}
                </div>
                <div className="mt-2">
                  <h5
                    className={`text-xl font-semibold ${
                      selectedComponent === "LeadData"
                        ? "text-white"
                        : "text-gray-800"
                    }`}
                  >
                    Create Quotation
                  </h5>
                  {/* <p className={`${selectedComponent === 'LeadData' ? 'text-white' : 'text-gray-600'}`}>{"leadCount"}</p> */}
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
                  {/* <SiMoneygram /> */}
                </div>
                <div className="mt-2">
                  <h5
                    className={`text-xl font-semibold ${
                      selectedComponent === "EmployeeData"
                        ? "text-white"
                        : "text-gray-800"
                    }`}
                  >
                    Create Invoice
                  </h5>
                  {/* <p className={`${selectedComponent === 'EmployeeData' ? 'text-white' : 'text-gray-600'}`}>{"employeeCount"}</p> */}
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
                  {/* <MdOutlineNextWeek /> */}
                </div>
                <div className="mt-2">
                  <h5
                    className={`text-xl font-semibold ${
                      selectedComponent === "QuotationData"
                        ? "text-white"
                        : "text-gray-800"
                    }`}
                  >
                    {" "}
                    Quotation List
                  </h5>
                  {/* <p className={`${selectedComponent === 'QuotationData' ? 'text-white' : 'text-gray-600'}`}>{"quotationCount"}</p> */}
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
                  {/* <GiMoneyStack /> */}
                </div>
                <div className="mt-2">
                  <h5
                    className={`text-xl font-semibold ${
                      selectedComponent === "InvoiceData"
                        ? "text-white"
                        : "text-gray-800"
                    }`}
                  >
                    {" "}
                    Invoice List
                  </h5>
                  {/* <p className={`${selectedComponent === 'InvoiceData' ? 'text-white' : 'text-gray-600'}`}>{"invoiceCount"}</p> */}
                </div>
              </div>
            </div>
          </div>
          {/* <div className="w-full h-[calc(100vh-10rem)] overflow-y-auto"> */}
          <div className="w-full h-full">
            {selectedComponent === "LeadData" && <QuotationForm1 />}
            {selectedComponent === "EmployeeData" && <CreateInvoice />}
            {selectedComponent === "QuotationData" && <EmployeeQuotationList />}
            {selectedComponent === "InvoiceData" && <EmployeeInvoiceList />}
          </div>
        </div>
        <div className="container">
          <h2>List of Company Profile Created Data</h2>
          <div className="overflow-y-auto" style={{ maxHeight: "700px" }}>
            <table className="w-full mb-5 table-auto border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 p-2">ID</th>
                  <th className="border border-gray-300 p-2">Company Name</th>
                  <th className="border border-gray-300 p-2">Created Date</th>
                </tr>
              </thead>
              <tbody>
                {companydata.map((company, index) => (
                  <tr key={company.id} className="hover:bg-gray-100">
                    <td className="border border-gray-300 p-2">{index + 1}</td>
                    <td className="border border-gray-300 p-2">
                      {company.company_name}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {moment(company.created_date).format("DD/MM/YYYY")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Wrapper>
    </>
  );
}

export default MainQuotation;

const Wrapper = styled.div``;
