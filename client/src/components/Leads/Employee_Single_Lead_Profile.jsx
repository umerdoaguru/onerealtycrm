import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import img from "../../images/lead_profile.png";
import MainHeader from "../MainHeader";
import EmployeeeSider from "../EmployeeModule/EmployeeSider";
import Sider from "../Sider";
import cogoToast from "cogo-toast";
import UpdateLeadField from "../EmployeeModule/updateLeadField";
function Employee_Single_Lead_Profile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);

  const [quotationCreated, setQuotationCreated] = useState(false);

  // const leads = [{ /* lead data */ }];

  const fieldConfig = [
    {
      name: "lead_status",
      label: "Lead Status",
      type: "select",
      options: [
        { value: "", label: "Select Lead Status" },
        { value: "pending", label: "Pending" },
        { value: "in progress", label: "In Progress" },
        { value: "completed", label: "Completed" },
      ],
    },
    {
      name: "visit_date",
      label: "Visit Date",
      type: "date", // Changed to "date" for consistency
    },
    {
      name: "visit",
      label: "Visit",
      type: "select",
      options: [
        { value: "", label: "Select Lead Status" },
        { value: "Fresh Visit", label: "Fresh Visit" },
        { value: "Repeated Visit", label: "Repeated Visit" },
        // { value: "completed", label: "Completed" },
      ],
    },

    // {
    //   name: "quotation_status",
    //   label: "Quotation Status",
    //   type: "select",
    //   options: [
    //     { value: "", label: "Select Quotation Status" },
    //     { value: "pending", label: "Pending" },
    //     { value: "in progress", label: "In Progress" },
    //     { value: "approved", label: "Aprroved" },
    //     { value: "not approved", label: "Not Aprroved" },
    //   ],
    // },
    {
      name: "invoice_status",
      label: "Invoice Status",
      type: "select",
      options: [
        { value: "", label: "Select Invoice Status" },
        { value: "pending", label: "Pending" },
        { value: "in progress", label: "In Progress" },
        { value: "approved", label: "Aprroved" },
        { value: "not approved", label: "Not Aprroved" },
      ],
    },
    {
      name: "deal_status",
      label: "Deal Status",
      type: "select",
      options: [
        { value: "", label: "Select Deal Status" },
        { value: "pending", label: "pending" },
        { value: "close", label: "close" },
        { value: "not close", label: "not close" },
        { value: "in-progress", label: "in-progress" },
      ],
    },
    {
      name: "d_closeDate",
      label: "Deal Close Date",
      type: "date", // Changed to "date" for consistency
    },
    {
      name: "reason",
      label: "Reason",
      type: "textarea",
    },

    {
      name: "follow_up_status",
      label: "Follow Up Status",
      type: "select",
      options: [
        { value: "", label: "Select Follow Up Status" },
        { value: "pending", label: "Pending" },
        { value: "in progress", label: "In Progress" },
        { value: "done", label: "Done" },
      ],
    },
  ];


  const [currentLead, setCurrentLead] = useState({
    lead_status: "",
    visit_date: " ",
    visit: "",
    quotation_status: "",
    invoice_status: "",
    deal_status: "",
    reason: "",

    follow_up_status: "",
  });
  const [showPopup, setShowPopup] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [render, setRender] = useState(false);

  useEffect(() => {
    fetchLeads();
  }, [id]);
  // const fetchLeads = async () => {
  //   try {
  //     const response = await axios.get(https://crm.one-realty.in/api/leads/${id});
  //     setLeads(response.data);
  //     console.log(response);
  //   } catch (error) {
  //     console.error("Error fetching quotations:", error);
  //   }
  // };

  const fetchLeads = async () => {
    try {
      const response = await axios.get(`https://crm.one-realty.in/api/leads/${id}`);
      console.log(response.data);
      setLeads(response.data);

      // Debugging: Log the exact value of the quotation field
      response.data.forEach((lead) => {
        console.log("Lead Quotation Status (raw):", lead.quotation);
      });

      // Ensure proper comparison with 'Created', trim any spaces and normalize the case
      const hasCreatedQuotation = response.data.some(
        (lead) =>
          lead.quotation && lead.quotation.trim().toLowerCase() === "created"
      );

      console.log(
        "Has created quotation (normalized check)?",
        hasCreatedQuotation
      ); // Debugging
      setQuotationCreated(hasCreatedQuotation);
    } catch (error) {
      console.error("Error fetching quotations:", error);
    }
  };
  const handleBackClick = () => {
    navigate(-1); // -1 navigates to the previous page in history
  };
  const handleQuotation = async (lead) => {
    const name = lead.name;
    navigate(`/quotation-by-lead/${lead.lead_id}`, { state: { name } });
  };

  const handleViewQuotation = (lead) => {
    console.log("Lead Object:", lead); // Log the lead object
    const name = lead.name;
    console.log("Lead Name:", name); // Log the name
    navigate(`/View_quotations/${lead.lead_id}`);
    // navigate("/View_quotations");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentLead((prevLead) => ({
      ...prevLead,
      [name]: value,
    }));
  };

  const handleUpdate = (lead) => {
    setIsEditing(true);
    setCurrentLead(lead);
    setShowPopup(true);
  };

  const saveChanges = async () => {
    console.log(currentLead);
    if(currentLead.deal_status !== leads[0].deal_status){ 
      if(currentLead.d_closeDate === "pending") {
        alert("Please update the deal close date as well");
        return;
      }
    }

    if(currentLead.visit !== leads[0].visit){ 
      if(currentLead.visit_date === "pending") {
        alert("Please update the visit date as well");
        return;
      }
    }
    try {
      // Send updated data to the backend using Axios
      const response = await axios.put(
        `https://crm.one-realty.in/api/updateLeadStatus/${currentLead.lead_id}`,
        currentLead
      );

      if (response.status === 200) {
        console.log("Updated successfully:", response.data);
        cogoToast.success("Lead status updated successfully");
        setRender(!render);
        closePopup(); // Close the popup on success
        fetchLeads();
      } else {
        console.error("Error updating:", response.data);
        cogoToast.error({ general: "Failed to update the lead status." });
      }
    } catch (error) {
      console.error("Request failed:", error);
      cogoToast.error("Failed to update the lead status.");
    }
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <>
      <MainHeader />
      <EmployeeeSider />
      <div className="flex flex-col 2xl:ml-44 mt-2">
        <div className="container mt-5 px-2 mx-auto p-4">
          <h1 className="text-2xl text-center mt-[2rem]">Leads Profile</h1>
          <div className="mx-auto h-[3px] w-16 bg-[#34495E] my-3"></div>
          <div className="flex flex-wrap mb-4">
            <div className="w-full lg:w-1/3">
              <img src={img} alt="doctor-profile" className=" rounded-lg" />
            </div>
            {leads.map((lead, index) => (
              <div className="w-full lg:w-2/3 ">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="text-info">Lead Number</label>
                    <div className="p-2 bg-gray-100 rounded">
                      <p className="m-0">{lead.lead_no}</p>
                    </div>
                  </div>

                  <div>
                    <label className="text-info">Name</label>
                    <div className="p-2 bg-gray-100 rounded">
                      <p className="m-0 break-words">{lead.name}</p>
                    </div>
                  </div>

                  <div>
                    <label className="text-info">Assigned To</label>
                    <div className="p-2 bg-gray-100 rounded">
                      <p className="m-0">{lead.assignedTo}</p>
                    </div>
                  </div>

                  <div>
                    <label className="text-info">Mobile Number</label>
                    <div className="p-2 bg-gray-100 rounded">
                      <p className="m-0">{lead.phone}</p>
                    </div>
                  </div>

                  <div>
                    <label className="text-info">Lead Source</label>
                    <div className="p-2 bg-gray-100 rounded">
                      <p className="m-0">{lead.leadSource}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-info">Subject</label>
                    <div className="p-2 bg-gray-100 rounded">
                      <p className="m-0">{lead.subject}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-info">Lead Status</label>
                    <div className="p-2 bg-gray-100 rounded">
                      <p className="m-0">{lead.lead_status}</p>
                    </div>
                  </div>

                  <div>
                    <label className="text-info">Created Date</label>
                    <div className="p-2 bg-gray-100 rounded">
                      <p className="m-0">
                        {moment(lead.createdTime).format("DD/MM/YYYY")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className=" flex justify-between">
            <button
              onClick={() => handleQuotation(leads[0])}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Quotation Creation
            </button>

            {/* Conditionally render the View Quotation button */}
            {quotationCreated ? (
              <button
                onClick={() => handleViewQuotation(leads[0])}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                View Quotation
              </button>
            ) : (
              <p className="text-white bg-red-400 text-center px-4 py-2 rounded">
                Quotation not yet created
              </p>
            )}
          </div>

          <div className="overflow-x-auto mt-5">
            <table className="min-w-full bg-white border">
              <thead>
                <tr>
                  <th className="px-6 py-3 border-b-2 border-gray-300">Name</th>
                  <th className="px-6 py-3 border-b-2 border-gray-300">
                    Assigned To
                  </th>
                  <th className="px-6 py-3 border-b-2 border-gray-300">
                    Visit Date
                  </th>
                  <th className="px-6 py-3 border-b-2 border-gray-300">
                    Visit
                  </th>
                  <th className="px-6 py-3 border-b-2 border-gray-300">
                    Quotation
                  </th>
                  <th className="px-6 py-3 border-b-2 border-gray-300">
                    Invoice
                  </th>
                  <th className="px-6 py-3 border-b-2 border-gray-300">
                    {" "}
                    Invoice Status
                  </th>
                  <th className="px-6 py-3 border-b-2 border-gray-300">
                    {" "}
                    Deal Status
                  </th>
                  <th className="px-6 py-3 border-b-2 border-gray-300">
                    {" "}
                    Deal Close Date
                  </th>
                  <th className="px-6 py-3 border-b-2 border-gray-300">
                    {" "}
                    Reason
                  </th>
                  <th className="px-6 py-3 border-b-2 border-gray-300">
                    {" "}
                    Follow Up Status
                  </th>
                  <th className="px-6 py-3 border-b-2 border-gray-300">
                    Lead Status
                  </th>
                  <th className="px-6 py-3 border-b-2 border-gray-300">
                    {" "}
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead, index) => (
                  <tr
                    key={lead.id}
                    className={index % 2 === 0 ? "bg-gray-100" : ""}
                  >
                    <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
                      {lead.name}
                    </td>
                    <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
                      {lead.assignedTo}
                    </td>

                    <td className="px-6 py-4  border-b border-gray-200 text-gray-800">
                      {lead.visit_date}
                    </td>
                    <td className="px-6 py-4  border-b border-gray-200 text-gray-800">
                      {lead.visit}
                    </td>
                    <td className="px-6 py-4  border-b border-gray-200 text-gray-800">
                      {lead.quotation}
                    </td>

                    <td className="px-6 py-4 border-b border-gray-200  text-gray-800">
                      {lead.invoice}
                    </td>

                    {lead.invoice_status === "pending" && (
                      <td className="px-6 py-4 border-b border-gray-200 font-semibold text-[red]">
                        {lead.invoice_status}
                      </td>
                    )}

                    {lead.invoice_status === "in progress" && (
                      <td className="px-6 py-4 border-b border-gray-200 font-semibold text-[orange]">
                        {lead.invoice_status}
                      </td>
                    )}
                    {lead.invoice_status === "approved" && (
                      <td className="px-6 py-4 border-b border-gray-200 font-semibold text-[green]">
                        {lead.invoice_status}
                      </td>
                    )}
                    {lead.invoice_status === "not approved" && (
                      <td className="px-6 py-4 border-b border-gray-200 font-semibold text-[black]">
                        {lead.invoice_status}
                      </td>
                    )}

                    {lead.deal_status === "pending" && (
                      <td className="px-6 py-4 border-b border-gray-200 font-semibold text-[red]">
                        {lead.deal_status}
                      </td>
                    )}

                    {lead.deal_status === "close" && (
                      <td className="px-6 py-4 border-b border-gray-200 font-semibold text-[green]">
                        {lead.deal_status}
                      </td>
                    )}
                    {lead.deal_status === "not close" && (
                      <td className="px-6 py-4 border-b border-gray-200 font-semibold text-[blue]">
                        {lead.deal_status}
                      </td>
                    )}
                    {lead.deal_status === "in-progress" && (
                      <td className="px-6 py-4 border-b border-gray-200 font-semibold text-[blue]">
                        {lead.deal_status}
                      </td>
                    )}

                    <td className="px-6 py-4  border-b border-gray-200 text-gray-800">
                      {lead.d_closeDate}
                    </td>

                    <td className="px-6 py-4 border-b border-gray-200 font-semibold text-gray-800">
                      {lead.reason}
                    </td>

                    {lead.lead_working_status === "pending" && (
                      <td className="px-6 py-4 border-b border-gray-200 font-semibold text-[red]">
                        {lead.lead_working_status}
                      </td>
                    )}
                    {lead.lead_working_status === "in progress" && (
                      <td className="px-6 py-4 border-b border-gray-200 font-semibold text-[yellow]">
                        {lead.lead_working_status}
                      </td>
                    )}
                    {lead.lead_working_status === "completed" && (
                      <td className="px-6 py-4 border-b border-gray-200 font-semibold text-[green]">
                        {lead.lead_working_status}
                      </td>
                    )}

                    {lead.follow_up_status === "pending" && (
                      <td className="px-6 py-4 border-b border-gray-200 font-semibold text-[red]">
                        {lead.follow_up_status}
                      </td>
                    )}

                    {lead.follow_up_status === "in progress" && (
                      <td className="px-6 py-4 border-b border-gray-200 font-semibold text-amber-600">
                        {lead.follow_up_status}
                      </td>
                    )}
                    {lead.follow_up_status === "done" && (
                      <td className="px-6 py-4 border-b border-gray-200 font-semibold text-[green]">
                        {lead.follow_up_status}
                      </td>
                    )}
                    {lead.lead_status === "pending" && (
                      <td className="px-6 py-4 border-b border-gray-200 font-semibold text-[red]">
                        {lead.lead_status}
                      </td>
                    )}

                    {lead.lead_status === "in progress" && (
                      <td className="px-6 py-4 border-b border-gray-200 font-semibold text-[orange]">
                        {lead.lead_status}
                      </td>
                    )}
                    {lead.lead_status === "completed" && (
                      <td className="px-6 py-4 border-b border-gray-200 font-semibold text-[green]">
                        {lead.lead_status}
                      </td>
                    )}
                    <td className="px-6 py-4 border-b border-gray-200 font-semibold text-gray-800">
                      <button
                        className="text-blue-500 hover:text-blue-700"
                        onClick={() => handleUpdate(lead)}
                      >
                        Update
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {showPopup && (
            <div className=" fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
              <div className="w-75 bg-white p-6 rounded-lg shadow-lg max-h-[100vh] overflow-auto mx-4 my-5">
                <h2 className="text-xl font-semibold mb-4">
                  {isEditing ? "Update Status" : ""}
                </h2>

                {/* Render Form Fields */}
                {fieldConfig.map((field) => (
                  <UpdateLeadField
                    key={field.name}
                    field={field}
                    value={currentLead[field.name]}
                    onChange={handleInputChange}
                  />
                ))}

                {/* Save and Cancel Buttons */}
                <div className="flex justify-end">
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 mr-2"
                    onClick={saveChanges}
                  >
                    Save
                  </button>
                  <button
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
                    onClick={closePopup}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Employee_Single_Lead_Profile;
