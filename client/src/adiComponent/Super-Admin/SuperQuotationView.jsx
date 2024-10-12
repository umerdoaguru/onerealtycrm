import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { styled } from "styled-components";
import moment from "moment";



import { useSelector } from "react-redux";
import SuperAdminSider from "./SuperAdminSider";
import MainHeader from "../../components/MainHeader";
import EditableSeoPayment from './../../pages/Quotation/EditableSeoPayment';
import EditablePaymentTable from './../../pages/Quotation/EditablePaymentWebTable';


function SuperQuotationVIew() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quotations, setQuotations] = useState([]);
  const [quotationDate, setQuotationDate] = useState(""); // New state to store quotation name
  const [quotationName, setQuotationName] = useState("");
  const [companyNames, setCompanyNames] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [accountname, setAccountName] = useState("");
  const [accountIFSC, setAccountIFSC] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");

  const [isCompanySelected, setIsCompanySelected] = useState(false); // Track if a company is selected

  const [notes, setNotes] = useState([]);
  const [footerImagePath, setFooterImagePath] = useState("");

  const [headerImagePath, setHeaderImagePath] = useState("");

  const UserId = useSelector((state) => state.auth.user.id);
  const [rowVisible, setRowVisible] = useState(true);

  const fetchQuotations = async () => {
    try {
      const response = await axios.get(
        `http://localhost:9000/api/quotation/${id}`
      );

      if (response.status === 200) {
        setQuotationDate(response.data[0].created_date); // Set the quotation name
        setQuotationName(response.data[0].quotation_name);
        setQuotations(response.data);
        console.log(response);
      }
    } catch (error) {
      console.error("Error fetching quotations:", error);
    }
  };
  const fetchNotes = async () => {
    try {
      const response = await axios.get(`http://localhost:9000/api/notes/${id}`);

      if (response.status === 200) {
        setNotes(response.data);
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  useEffect(() => {
    // Fetch company names from the backend
    const fetchCompanyNames = async () => {
      try {
        const response = await axios.get(
          `http://localhost:9000/api/header-footer-images/company-names/${UserId}`
        );
        if (response.status === 200) {
          setCompanyNames(response.data); // Assuming response.data is an array of company names
        } else {
          console.error("Failed to fetch company names");
        }
      } catch (error) {
        console.error("Error fetching company names:", error);
      }
    };

    fetchCompanyNames();
  }, []);

  const renderServiceTables = (subscriptionFrequency, serviceTypeTitle) => {
    const actualPriceTotal = quotations.reduce(
      (total, q) =>
        q.subscription_frequency === subscriptionFrequency &&
        q.service_type === serviceTypeTitle
          ? total + q.actual_price
          : total,
      0
    );

    const offerPriceTotal = quotations.reduce(
      (total, q) =>
        q.subscription_frequency === subscriptionFrequency &&
        q.service_type === serviceTypeTitle
          ? total + q.offer_price
          : total,
      0
    );

    const services = quotations.filter(
      (q) =>
        q.subscription_frequency === subscriptionFrequency &&
        q.service_type === serviceTypeTitle
    );

    return (
      actualPriceTotal > 0 && (
        <div className="mt-4">
        <h5 className="font-bold text-lg">{`${serviceTypeTitle} Services - ${subscriptionFrequency}`}</h5>
        <div className="">
          <table className="min-w-full divide-y divide-gray-300 border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 border border-gray-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sr.No
                </th>
                <th className="px-6 py-3 border border-gray-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service Name
                </th>
                <th className="px-6 py-3 border border-gray-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service Description
                </th>
                <th className="px-6 py-3 border border-gray-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actual Price (INR)
                </th>
                <th className="px-6 py-3 border border-gray-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Offer Price (INR)
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {services.map((q, index) => (
                <tr key={q.id}>
                  <td className="px-6 py-4 border border-gray-300 text-center text-sm font-bold">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 border border-gray-300 text-sm font-bold">
                    {q.service_name}
                  </td>
                  <td className="px-6 py-4 border border-gray-300 text-sm">
                    {q.service_description.split(".").map((part, index) => (
                      <p key={index}>
                        {part.trim()}
                        {index !==
                          q.service_description.split(".").length - 1 && "."}
                      </p>
                    ))}
                  </td>
                  <td className="px-6 py-4 border border-gray-300 text-sm">
                    {q.actual_price}
                  </td>
                  <td className="px-6 py-4 border border-gray-300 text-sm">
                    {q.offer_price}
                  </td>
                </tr>
              ))}

              <tr>
                <td
                  colSpan="3"
                  className="px-6 py-4 border border-gray-300 font-bold text-sm"
                >
                  Total {`${serviceTypeTitle} Amount`}
                </td>
                <td className="px-6 py-4 border border-gray-300 font-bold text-sm">
                  {actualPriceTotal}
                </td>
                <td className="px-6 py-4 border border-gray-300 font-bold text-sm">
                  {offerPriceTotal}
                </td>
              </tr>

              <tr className="bg-gray-50 btn-print"></tr>
            </tbody>
          </table>
        </div>
      </div>
      )
    );
  };

  const renderPaidServices = () => {
    return (
      <>
        {renderServiceTables("Monthly", "Paid")}
        {renderServiceTables("Yearly", "Paid")}
        {renderServiceTables("One Time", "Paid")}
        {renderServiceTables("Quarterly", "Paid")}
        {renderServiceTables("Half Yearly", "Paid")}
        {renderServiceTables("Weekly", "Paid")}
        {renderServiceTables("As Per Requirement", "Paid")}
        {renderServiceTables("15 Days", "Paid")}
        {renderServiceTables("10 Days", "Paid")}
        {renderServiceTables("1-5 Days", "Paid")}
        {/* Add similar calls for other subscription frequencies for Paid services */}
      </>
    );
  };

  const renderComplimentaryServices = () => {
    return (
      <>
        {renderServiceTables("Monthly", "Complimentary")}
        {renderServiceTables("Yearly", "Complimentary")}
        {renderServiceTables("One Time", "Complimentary")}
        {renderServiceTables("Quarterly", "Complimentary")}
        {renderServiceTables("Half Yearly", "Complimentary")}
        {renderServiceTables("Weekly", "Complimentary")}
        {renderServiceTables("As Per Requirement", "Complimentary")}
        {renderServiceTables("15 Days", "Complimentary")}
        {renderServiceTables("10 Days", "Complimentary")}
        {renderServiceTables("1-5 Days", "Complimentary")}
        {/* Add similar calls for other subscription frequencies for Complimentary services */}
      </>
    );
  };

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.post(
          "http://localhost:9000/api/company-header-footer",
          {
            company_name: selectedCompany,
          }
        );
        console.log(response);

        if (response.status === 200) {
          const {
            company_name_account_name,
            company_name_account_ifsc,
            company_name_account_number,
            company_address,
          } = response.data;
          setAccountName(company_name_account_name);
          setAccountIFSC(company_name_account_ifsc);
          setAccountNumber(company_name_account_number);
          setCompanyAddress(company_address);
        } else {
          console.error(
            "Error fetching header and footer images:",
            response.statusText
          );
        }
      } catch (error) {
        console.error(
          "Error fetching header and footer images:",
          error.message
        );
      }
    };

    fetchImages();
  });

  useEffect(() => {
    fetchQuotations();
    fetchNotes();
  }, []);
  return (
    <>
       
       <MainHeader />
        <SuperAdminSider />
     <div className="min-h-screen bg-gray-100 mt-5">

      <div className="flex">
        <div className="flex-grow p-6">
          <div className="max-w-7xl mx-auto bg-white p-8 rounded-lg shadow-md">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">
                Quotation: {quotationName}
              </h2>
              <p className="text-sm text-gray-600">
                Date: {moment(quotationDate).format("DD-MM-YYYY")}
              </p>
            </div>
  
            {/* Paid Services Table */}
            <div>{renderPaidServices()}</div>
  
            {/* Complimentary Services Table */}
            <div>{renderComplimentaryServices()}</div>
  
            <div className="mt-6">
              <EditableSeoPayment quotationId={id} />
            </div>
            <div className="mt-6">
              <EditablePaymentTable quotationId={id} />
            </div>
          </div>
        </div>
      </div>
    
    </div>
    </>
   
  );
  
}

export default SuperQuotationVIew;
