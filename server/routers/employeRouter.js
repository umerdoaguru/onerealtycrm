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
} = require("../controllers/employeController");
const router = express.Router();

router.get("/get-employee-invoice/:id", getEmployeeInvoice);
router.get("/employeeProfile/:id", employeeProfile);
router.get("/employe-leads/:id", getEmployeeLeads);
router.put("/updateLeadStatus/:id", updateLeadStatus);
router.put("/updateOnlyLeadStatus/:id", updateOnlyLeadStatus);
router.put("/updateOnlyQuotationStatus/:id", updateOnlyQuotationStatus);
router.get("/get-quotation-byEmploye/:id", getEmployeeQuotation);
router.get("/getAllEmployee-Toal-lead", getAllEmployeeTotalLeads);

module.exports = router;
