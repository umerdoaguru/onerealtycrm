import React from 'react'


import { Navigate, Route, Routes } from 'react-router-dom'
import { useSelector } from 'react-redux'

import Registration from '../components/Registration';

import Leads from '../pages/Leads';
import QuotationForm1 from '../pages/Quotation/QuotationForm1';
import CreateCompanyProfile from '../pages/Quotation/CreateCompanyProfile';

import UpdateCompanyData from '../pages/Quotation/UpdateCompanyData';
import DeleteCompanydata from '../pages/Quotation/DeleteCompanydata';

import Invoicelist from '../components/Invoice/Invoicelist';

import DataExport from '../pages/DataExport';
import LeadData from '../components/DataExport/LeadData';
import QuotationData from '../components/DataExport/QuotationData';
import InvoiceData from '../components/DataExport/InvoiceData';
import Dashboard from '../adiComponent/Dashboard';
import Overview from '../adiComponent/Overview';
import UserProfile from '../adiComponent/userProfile';
import EmployeeManagement from '../adiComponent/EmployManagement';
import EmployeeSingle from '../adiComponent/EmployeSingle';
import SingleOrganization from '../adiComponent/SingleOrganizaton';
import Reporting from '../adiComponent/Reporting';
import Single_Lead_Profile from '../components/Leads/Single_Lead_Profile';
import Landingpage from '../pages/Landingpage';
import AdminLogin from '../components/AdminLogin';
import ServicenameList from '../pages/Quotation/ServicenameList';
import CreateServicelist from '../pages/Quotation/CreateServicelist';
import DeleteServiceName from '../pages/Quotation/DeleteServiceName';
import UpdateServiceList from '../pages/Quotation/UpdateServiceList';

import QuotationList from '../pages/Quotation/QuotationList';
import AdminQuotationVIew from '../pages/Quotation/AdminQuotationVIew';
import AdminInvoiceView from '../components/Invoice/AdminInvoiceView';
import TotalLead from '../components/AdminDashBoardCards/TotalLead';
import TotalEmployee from '../components/AdminDashBoardCards/TotalEmployee';
import TotalQuotation from '../components/AdminDashBoardCards/TotalQuotation';
import TotalInvoice from '../components/AdminDashBoardCards/TotalInvoice';
import MainSocialLeads from '../components/SocialMediaLeads/MainSocialLeads';

function AdminRoutes() {
    const user = useSelector(state => state.auth.user);
  return (

    <>
   

    <Routes>

      {/* Admin routes */}
      <Route path="/" element={<Dashboard/>} />
      <Route path="/admincrmonerealty" element={<Registration />} />
        
      {/* <Route path="/" element={user? <Dashboard/> :<Landingpage/>} /> */}
        {/* <Route path="/admin-login" element={<AdminLogin/>} /> */}
    

<Route path="/admin-dashboard" element={<Dashboard />} />
<Route path="/total-leads" element={<TotalLead />} />
<Route path="/total-employees" element={<TotalEmployee/>} />
<Route path="/total-quotations" element={<TotalQuotation/>} />
<Route path="/total-invoices" element={<TotalInvoice/>} />




<Route path="/leads" element={  <Leads/>} />
<Route path="/social-media-leads" element={  <MainSocialLeads/>} />
<Route path="/quotation-form" element={  <QuotationForm1 /> } />
<Route path="/quotation-section" element={  <CreateCompanyProfile /> } />
<Route path="/data-export" element={  <DataExport /> } />



<Route path="/admin-view-quotation/:id" element={ <AdminQuotationVIew />} />
<Route path="/admin-view-invoice/:id" element={ <AdminInvoiceView/>} />


<Route path="/updatecompanydata" element={  <UpdateCompanyData />} />
<Route path="/deletecompanydata" element={  <DeleteCompanydata />} />

<Route path="/servicenamelist" element={ <ServicenameList/>} />       
<Route path="/create-servicelist" element={ <CreateServicelist />} />
<Route path="/delete-servicename" element={ <DeleteServiceName />} />
<Route path="/update-servicename" element={ <UpdateServiceList />} />


<Route path="/invoicelist" element={  <Invoicelist />} />
<Route path="/quotationlist" element={  <QuotationList />} />




<Route path="/lead-data" element={  <LeadData/>} />
<Route path="/lead-single-data/:id" element={  <Single_Lead_Profile/>} />
<Route path="/quotation-data" element={  <QuotationData/>} />
<Route path="/invoice-data" element={  <InvoiceData/>} />

{/* aditya routes */}


<Route path='/overview' element={<Overview/>}/>

<Route path='/edit-profile' element={<UserProfile/>}/>
<Route path='/employee-management' element={<EmployeeManagement/>}/>
<Route path='/employee-single/:employeeId' element={<EmployeeSingle/>}/>
<Route path='/singleOrganization/:id' element={<SingleOrganization/>}/>
<Route path='/reporting' element={<Reporting/>}/>


       



        
        
       


      </Routes>





    
    </>





  )
}

export default AdminRoutes