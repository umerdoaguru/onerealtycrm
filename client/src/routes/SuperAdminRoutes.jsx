import React from "react";

import { Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";



import Leads from "../pages/Leads";

import CreateCompanyProfile from "../pages/Quotation/CreateCompanyProfile";


import EmployeeManagement from "../adiComponent/EmployManagement";

import Reporting from "../adiComponent/Reporting";


import QuotationList from "../pages/Quotation/QuotationList";
import AdminQuotationVIew from "../pages/Quotation/AdminQuotationVIew";

import SuperDash from "../adiComponent/SuperDash";
import AdminManagement from "../adiComponent/AdminManagement";
import SuperAdminLead from '../adiComponent/Super-Admin/SuperAdminLead';
import SuperAdEmployeemanagement from "../adiComponent/Super-Admin/SuperAdEmployeemanagement";
import SuperQuotationList from "../adiComponent/Super-Admin/SuperQuotationList";
import SuperQuotationVIew from "../adiComponent/Super-Admin/SuperQuotationView";
import SuperReports from './../adiComponent/Super-Admin/SuperReports';
import Super_Admin_Adminmanagement from "../adiComponent/Super-Admin/Super_Admin_AdminManagement";

function SuperAdminRoutes() {
  const user = useSelector((state) => state.auth.user);
  return (
    <>
      <Routes>
        {/*super Admin routes by vinay */}
        <Route path="/" element={<SuperDash />} />
        <Route path="/super-admin-dashboard" element={<SuperDash />} />
        <Route path="/super-admin-leads" element={<SuperAdminLead />} />
        <Route path="/super-admin-employee-management" element={<SuperAdEmployeemanagement />} />
        <Route path="/super-admin-AdminManagement" element={<Super_Admin_Adminmanagement />} />
{/*         
        <Route path="/super-admin-quotation-section" element={<CreateCompanyProfile />} /> */}
        <Route path="/super-admin-quotationlist" element={<SuperQuotationList />} />
        <Route
          path="/admin-view-quotation/:id"
          element={<SuperQuotationVIew />} 
        />
        <Route path="/super-admin-reporting" element={<SuperReports />} />
        {/* <Route path="/" element={user? <Dashboard/> :<Landingpage/>} /> */}
        {/* <Route path="/admin-login" element={<AdminLogin/>} /> */}

        {/* <Route path="/total-leads" element={<TotalLead />} />
        <Route path="/total-employees" element={<TotalEmployee />} />
        <Route path="/total-quotations" element={<TotalQuotation />} />
        <Route path="/total-invoices" element={<TotalInvoice />} />

        <Route path="/social-media-leads" element={<MainSocialLeads />} />
        <Route path="/quotation-form" element={<QuotationForm1 />} />
        <Route path="/quotation-section" element={<CreateCompanyProfile />} />
        <Route path="/data-export" element={<DataExport />} /> */}

        {/* <Route
          path="/admin-view-quotation/:id"
          element={<AdminQuotationVIew />}
        />
        <Route path="/admin-view-invoice/:id" element={<AdminInvoiceView />} />

        <Route path="/updatecompanydata" element={<UpdateCompanyData />} />
        <Route path="/deletecompanydata" element={<DeleteCompanydata />} />

        <Route path="/servicenamelist" element={<ServicenameList />} />
        <Route path="/create-servicelist" element={<CreateServicelist />} />
        <Route path="/delete-servicename" element={<DeleteServiceName />} />
        <Route path="/update-servicename" element={<UpdateServiceList />} />

        <Route path="/invoicelist" element={<Invoicelist />} />
        <Route path="/quotationlist" element={<QuotationList />} />

        <Route path="/lead-data" element={<LeadData />} />
        <Route path="/lead-single-data/:id" element={<Single_Lead_Profile />} />
        <Route path="/quotation-data" element={<QuotationData />} />
        <Route path="/invoice-data" element={<InvoiceData />} /> */}

        {/* aditya routes */}

        {/* <Route path="/overview" element={<Overview />} />

        <Route path="/edit-profile" element={<UserProfile />} />

        <Route
          path="/employee-single/:employeeId"
          element={<EmployeeSingle />}
        />
        <Route
          path="/singleOrganization/:id"
          element={<SingleOrganization />}
        />
        <Route path="/reporting" element={<Reporting />} /> */}
      </Routes>
    </>
  );
}

export default SuperAdminRoutes;
