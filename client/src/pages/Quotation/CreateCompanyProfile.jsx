import React, { useEffect, useState } from "react";
import axios from "axios";
import DisplayCompanyData from "./Footer";

import Footer from "./Footer";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import styled from "styled-components";

import cogoToast from "cogo-toast";
import moment from "moment";
import UserLogin from "../../components/UserLogin";
import Logout from "../../components/Logout";
import Sider from "../../components/Sider";

import MainHeader from "../../components/MainHeader";
import { BsPencilSquare, BsTrash } from "react-icons/bs";

function CreateCompanyProfile() {
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
  const [render, setRender] = useState(false);
  
 
  useEffect(() => {
    const fetchinvoice = async () => {
      try {
        const response = await axios.get(`https://crmdemo.vimubds5.a2hosted.com/api/company-data`);
        setcompanydata(response.data);
        console.log(response);
      } catch (error) {
        console.error("Error fetching invoice:", error);
      }
    };

    fetchinvoice();
  }, [UserId, render]);

  const handleDeleteCompanyData = async (CompanyName) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this Company data?");
   if(isConfirmed){ try {
       const response = await axios.post('https://crmdemo.vimubds5.a2hosted.com/api/companydata', {
        company_name: CompanyName
      });
       
       
       
      if (response.status === 200) {
        console.log('Company Data deleted successfully');
        // Refresh CompanyDatas after deletion
        // window.location.reload();
        setRender(!render);
      }
    } catch (error) {
      console.error('Error deleting Company Data:', error);
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
        "https://crmdemo.vimubds5.a2hosted.com/api/upload-company-profile",
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

        // window.location.reload();
        setRender(!render);
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
     <MainHeader/>
       <Wrapper>
      <Sider/>
     
      <div className=" container px-3 pt-5">
      <h1 className="text-2xl text-center mt-[2rem] font-medium">Quotation & Invoice Management</h1>
      <div className="mx-auto h-[3px] w-16 bg-[#34495E] my-3"></div>
        <form className="p-4 bg-white rounded shadow-lg mt-5" onSubmit={handleUpload}>
          <div className="flex justify-between">
          <div className="mx-3 mt-3 font-medium text-xl">
              <UserLogin />
            </div>
            {/* <div className="mt-1 mx-3">
              <Logout />
            </div> */}
          </div>
          <div className="grid lg:grid-cols-3 gap-2 mt-2">
            {/* <div className="col-span-1">
              <Link
                to="/quotation-form"
                className="bg-green-600 text-white px-4 py-2 rounded block text-center"
              >
                Create Quotation
              </Link>
            </div>
            <div className="col-span-1">
              <Link
                to="/create-invoice"
                className="bg-green-600 text-white px-4 py-2 rounded block text-center"
              >
                Create Invoice
              </Link>
            </div> */}
            <div className="col-span-1">
              <Link
                to="/quotationlist"
                      className="bg-blue-500 text-white px-4 py-2 rounded block text-center font-medium"
              >
                Quotation List
              </Link>
            </div>
            <div className="col-span-1">
              <Link
                to="/invoicelist"
               className="bg-blue-500 text-white px-4 py-2 rounded block text-center font-medium"
              >
                Invoice List
              </Link>
            </div>
            <div className="col-span-1">
              <Link
to="/servicenamelist"
                  className="bg-blue-500 text-white px-4 py-2 rounded block text-center font-medium"
              >
                 Service Name List
              </Link>
            </div>
          </div>
  
          <div className="flex justify-center mt-4">
            <h3 className="text-center">Create Company Profile</h3>
          </div>
  
          <div className="grid lg:grid-cols-5 md:grid-cols-4 gap-2 mt-4">
            <div className="">
            <label className="block font-medium">
                Company Name<span className="text-red-600">*</span>
                <input
                  type="text"
                   className="w-full p-2 border rounded font-normal"
                  value={companyNameBranch}
                  onChange={(e) => setCompanyNameBranch(e.target.value)}
                  placeholder="Enter the Company Name"
                  required
                />
              </label>
            </div>
            <div className="">
            <label className="block font-medium">
                Company Address<span className="text-red-600">*</span>
                <input
                  type="text"
                   className="w-full p-2 border rounded font-normal"
                  value={companyAddress}
                  onChange={(e) => setCompanyAddress(e.target.value)}
                  placeholder="Enter the Company Address"
                  required
                />
              </label>
            </div>
            <div className="">
            <label className="block font-medium">
                 Mobile Number<span className="text-red-600">*</span>
                <input
                  type="text"
                   className="w-full p-2 border rounded font-normal"
                  value={companyMoblie_no}
                  onChange={(e) => setCompanyMoblie_no(e.target.value)}
                  placeholder="Enter the Mobile Number"
                  required
                />
              </label>
            </div>
            <div className="">
              <label className="block font-medium">
                Company Email Id<span className="text-red-600">*</span>
                <input
                  type="email"
                 className="w-full p-2 border rounded font-normal"
                  value={companyEmail_id}
                  onChange={(e) => setCompanyEmail_id(e.target.value)}
                  placeholder="Enter the Email Id"
                  required
                />
              </label>
            </div>
            <div className="">
              <label className="block font-medium">
                Select Company Details<span className="text-red-600">*</span>
                <select
                 className="w-full p-2 border rounded font-normal"
                  id="companyList"
                  name="company_list"
                  onChange={handleChangeCompany}
                  value={selectedCompany}
                  required
                >
                  <option value="" disabled>
                    Select Details
                  </option>
                  <option value="GST">GST</option>
                  <option value="Pan Card">Pan Card</option>
                  <option value="null">No Detail</option>
                </select>
              </label>
            </div>
            {selectedCompany === "GST" && (
              <div className="col-span-2">
                <label className="block font-medium">
                  GST Number
                  <input
                    type="text"
                   className="w-full p-2 border rounded font-normal"
                    value={companyGST_no}
                    onChange={(e) => setCompanyGST_no(e.target.value)}
                    placeholder="Enter the Company GST No."
                    maxLength={15}
                  />
                </label>
              </div>
            )}
            {selectedCompany === "Pan Card" && (
              <div className="col-span-2">
                <label className="block font-medium">
                  Pan Number:
                  <input
                    type="text"
                   className="w-full p-2 border rounded font-normal"
                    value={companyPan_no}
                    onChange={(e) => setCompanyPan_no(e.target.value)}
                    placeholder="Enter the Company Pan No."
                    maxLength={10}
                  />
                </label>
              </div>
            )}
          </div>
  
          <div className="mt-4">
            <h6 className="text-center mb-4">Company Payment Detail:</h6>
            <div className="grid lg:grid-cols-5 md:grid-cols-4 gap-2">
              <div className=" ">
                <label className="block font-medium">
                  Account Name<span className="text-red-600">*</span>
                  <input
                    type="text"
                   className="w-full p-2 border rounded font-normal"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    placeholder="Enter the Account No."
                    required
                  />
                </label>
              </div>
              <div className=" ">
                <label className="block font-medium">
                  IFSC Code<span className="text-red-600">*</span>
                  <input
                    type="text"
                   className="w-full p-2 border rounded font-normal"
                    value={accountIFSC}
                    onChange={(e) => setAccountIFSC(e.target.value)}
                    placeholder="Enter the IFSC Number"
                    required
                  />
                </label>
              </div>
              <div className=" ">
                <label className="block font-medium">
                  Account Number<span className="text-red-600">*</span>
                  <input
                    type="text"
                   className="w-full p-2 border rounded font-normal"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    placeholder="Enter the Account Number"
                    required
                  />
                </label>
              </div>
              <div className=" ">
                <label className="block font-medium">
                  Bank Name<span className="text-red-600">*</span>
                  <input
                    type="text"
                   className="w-full p-2 border rounded font-normal"
                    value={accountBank_Name}
                    onChange={(e) => setAccountBank_Name(e.target.value)}
                    placeholder="Enter the Bank Name"
                    required
                  />
                </label>
              </div>
              <div className=" ">
                <label className="block font-medium">
                  Header Image<span className="text-red-600">*</span>
                  <input
                    type="file"
                   className="w-full p-2 border rounded font-normal"
                    accept="image/*"
                    onChange={handleHeaderImageChange}
                    required
                  />
                  <span className="text-sm text-gray-500">
                    2480px width and 3508px height of Header
                  </span>
                </label>
              </div>
              <div className=" ">
                <label className="block font-medium">
                  Footer Image<span className="text-red-600">*</span>
                  <input
                    type="file"
                   className="w-full p-2 border rounded font-normal"
                    accept="image/*"
                    onChange={handleFooterImageChange}
                    required
                  />
                  <span className="text-sm text-gray-500">
                    2480px width and 3508px height of Footer
                  </span>
                </label>
              </div>
              <div className=" ">
                <label className="block font-medium">
                  Logo Image<span className="text-red-600">*</span>
                  <input
                    type="file"
                   className="w-full p-2 border rounded font-normal"
                    accept="image/*"
                    onChange={handleLogoImageChange}
                    required
                  />
                </label>
              </div>
              <div className=" ">
                <label className="block font-medium">
                  Digital Signature<span className="text-red-600">*</span>
                  <input
                    type="file"
                   className="w-full p-2 border rounded font-normal"
                    accept="image/*"
                    onChange={handledigitalSignImageChange}
                    required
                  />
                </label>
              </div>
            </div>
            <button
              type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded mt-4 font-medium"
            >
            Add Organization
            </button>
          </div>           
        </form>
      </div>
  
      <div className="container mt-4 ">
      <h2 className="text-center text-xl font-medium">List of Company Profile Created Data</h2>
       
        <div className="mx-auto h-[2px] w-16 bg-[#34495E] my-3"></div>
        <div className="overflow-y-auto mb-4" style={{ maxHeight: "700px" }}>
          <table className="w-full table-auto border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 p-2">ID</th>
                <th className="border border-gray-300 p-2">Company Name</th>
                <th className="border border-gray-300 p-2">Created Date</th>
                <th className="border border-gray-300 p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {companydata.map((company,index) => (
                <tr key={company.id} className="hover:bg-gray-100">
                  <td className="border border-gray-300 p-2">{index + 1}</td>
                  <td className="border border-gray-300 p-2">{company.company_name}</td>
                  <td className="border border-gray-300 p-2">
                  {moment(company.created_date).format('DD/MM/YYYY')}
                  </td>
                  <td className="border border-gray-300 p-2">
                  <button
                                            className="text-blue-500 hover:text-blue-700"
                                            onClick={() => handleEditCompany(company.company_name)}
                                        >
                                                                       <BsPencilSquare size={20} />
                                        </button>
                    <button
                     onClick={() => handleDeleteCompanyData(company.company_name)}
                      className=" text-[red] px-2 py-2 rounded"
                    >
                       <BsTrash size={20} />
                    </button>
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

export default CreateCompanyProfile;

const Wrapper = styled.div`

`;
