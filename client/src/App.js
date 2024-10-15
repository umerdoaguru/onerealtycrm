import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";

// Employee Module

// Routes
import AdminRoutes from "./routes/AdminRoutes";
import EmployeeRoutes from "./routes/EmployeeRoutes";
import SuperAdminRoutes from "./routes/SuperAdminRoutes";

// Auth Components
import AdminLogin from "./components/AdminLogin";
import EmployeeLogin from "./components/EmployeeModule/EmployeeLogin";
import SuperAdminLogin from "./components/SuperAdminLogin";
import Registration from "./components/Registration";

// Header & Landing Page
import Landingpage from "./pages/Landingpage";

function App() {
  const user = useSelector((state) => state.auth.user);
  console.log(user);

  return (
    <>
      <div style={{ overflow: "hidden" }}>
        <Routes>
          {/* main page routes */}
          <Route path="/main_page_crm" element={<Landingpage />} />

          {/* Common routes */}
          <Route path="/SuperAdmin-login" element={<SuperAdminLogin />} />

          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/employee-login" element={<EmployeeLogin />} />

          {/* Common routes */}

          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/employee-login" element={<EmployeeLogin />} />
          <Route path="/SuperAdmin-login" element={<SuperAdminLogin />} />
          {/* Conditionally render Admin or Employee routes based on user's role
        {user?.roles === 'Admin' ? (<Route path="/*" element={<AdminRoutes />} />) : user?.roles === 'Employee' ? (<Route path="/*" element={<EmployeeRoutes />} />) :
         ( <Route path="/" element={<Navigate to="/main_page_crm" />} /> )} */}

          {user?.roles === "Super-Admin" ? (
            <Route path="/*" element={<SuperAdminRoutes />} />
          ) : user?.roles === "Admin" ? (
            <Route path="/*" element={<AdminRoutes />} />
          ) : user?.roles === "Employee" ? (
            <Route path="/*" element={<EmployeeRoutes />} />
          ) : (
            <Route path="/" element={<Navigate to="/main_page_crm" />} />
          )}
          {/* Catch-all route to redirect unauthorized users */}
          <Route path="*" element={<Navigate to="/" />} />

          <Route path="/admincrmdoaguru" element={<Registration />} />

          {/* <Route path="/admin-login" element={<AdminLogin/>} />

        <Route path="/employee-login" element={<EmployeeLogin/>} />
       
        <Route path="/admincrmdoaguru" element={<Registration />} />
       
        <Route path="/leads" element={  <Leads/>} />
        <Route path="/quotation-form" element={  <QuotationForm1 /> } />
        <Route path="/quotation-section" element={  <CreateCompanyProfile /> } />
        <Route path="/data-export" element={  <DataExport /> } />
        <Route path="/final-quotation/:id" element={  <Final_quotation/>} />
        <Route path="/quotationlist" element={  <QuotationList />}/>

        <Route path="/print/:id" element={ <Print_Page />} />
        <Route path="/admin-view-quotation/:id" element={ <AdminQuotationVIew />} />
        <Route path="/addservices/:id" element={  <Addservices />} />
        <Route path="/createnotes/:id" element={  <CreateNotes />}/>
        <Route path="/deletenotes/:id" element={  <DeleteNotes />} />
        <Route path="/update-notes/:id" element={  <UpdateNotes />} />
        <Route path="/review/:id" element={  <Reviews />} />
        <Route path="/updatecompanydata" element={  <UpdateCompanyData />} />
        <Route path="/deletecompanydata" element={  <DeleteCompanydata />} />
        <Route path="/update-quotation-name/:id" element={  <UpdateQuotationName />} />

        <Route path="/servicenamelist" element={ <ServicenameList/>} />       
        <Route path="/create-servicelist" element={ <CreateServicelist />} />
        <Route path="/delete-servicename" element={ <DeleteServiceName />} />
        <Route path="/update-servicename" element={ <UpdateServiceList />} />


        <Route path="/create-invoice" element={  <CreateInvoice />} />
        <Route path="/final-invoice/:id" element={  <FinalInvoice/>} />
        <Route path="/invoicelist" element={  <Invoicelist />} />
        <Route path="/update-invoice-name/:id" element={  <EditInvoiceName />} />
        <Route path="/print-invoice/:id" element={ <PrintInvoice />} />
        <Route path="/addservicesinvoice/:id" element={  <AddInvoiceServices/>} />


        <Route path="/update-invoice-number/:id" element={  <EditInvoice_no />} />
        <Route path="/update-invoice-date/:id" element={  <EditInvoice_date/>} />         
         <Route path="/update-invoice-start-date/:id" element={  <EditInvoice_start_date/>} />         
        <Route path="/update-invoice-end-date/:id" element={  <EditInvoice_end_date/>} />          
        

        <Route path="/invoicecreatenotes/:id" element={  <CreateInvoiceNotes />}/>
        <Route path="/invoicedeletenotes/:id" element={  <DeleteInvoiceNotes />} />
        <Route path="/invoice-update-notes/:id" element={  <UpdateInvoiceNotes />} />

        <Route path="/quotation-invoice/:id" element={  <QuotationInvoice/>} />

        <Route path="/lead-data" element={  <LeadData/>} />
        <Route path="/lead-single-data/:id" element={  <Single_Lead_Profile/>} />
        <Route path="/quotation-data" element={  <QuotationData/>} />
        <Route path="/invoice-data" element={  <InvoiceData/>} /> */}

          {/* aditya routes */}

          {/* <Route path="/dashboard" element={<Dashboard />} />
        <Route path='/overview' element={<Overview/>}/>
     
        <Route path='/edit-profile' element={<UserProfile/>}/>
        <Route path='/employee-management' element={<EmployeeManagement/>}/>
        <Route path='/employee-single/:employeeId' element={<EmployeeSingle/>}/>
        <Route path='/singleOrganization/:id' element={<SingleOrganization/>}/>
        <Route path='/reporting' element={<Reporting/>}/> */}

          {/* employees routes */}
          {/* <Route path="/employees-dashboard" element={<EmployeeDashboard />} />
        <Route path="/employee-leads" element={  <EmployeeLead/>} />
        <Route path="/employee-report" element={  <EmployeeReport/>} />
        <Route path="/employee-data-export" element={  <EmployeeDataExport/>} />
        <Route path="/employee-quotation-invoice" element={  <MainQuotation/>} />
        <Route path="/employee-profile" element={  <EmployeeProfile/>} /> */}
        </Routes>
      </div>
    </>
  );
}

export default App;
