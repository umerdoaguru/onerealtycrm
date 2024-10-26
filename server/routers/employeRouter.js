const express = require("express");
const multer = require("multer");
const {
  getEmployeeInvoice,
  employeeProfile,
  getEmployeeLeads,
  updateLeadStatus,
  getEmployeeQuotation,
  updateOnlyLeadStatus,
  updateOnlyQuotationStatus,
  getAllEmployeeTotalLeads,
  getLeadQuotation,
  getEmployeeVisit,
  createVisit,
  updateVisit,
  deleteVisit,
} = require("../controllers/employeController");
const router = express.Router();

router.get("/get-employee-invoice/:id", getEmployeeInvoice);
router.get("/employeeProfile/:id", employeeProfile);
router.get("/employe-leads/:id", getEmployeeLeads);
router.get("/employe-visit/:id", getEmployeeVisit);
router.put('/employe-visit', updateVisit);           
router.delete('/employe-visit/:id', deleteVisit); 
router.post("/employe-visit", createVisit);
router.put("/updateLeadStatus/:id", updateLeadStatus);
router.put("/updateOnlyLeadStatus/:id", updateOnlyLeadStatus);
router.put("/updateOnlyQuotationStatus/:id", updateOnlyQuotationStatus);
router.get("/get-quotation-byEmploye/:id", getEmployeeQuotation);
router.get("/get-quotation-byLead/:id", getLeadQuotation);
router.get("/getAllEmployee-Toal-lead", getAllEmployeeTotalLeads);

module.exports = router;
