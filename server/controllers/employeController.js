const { db } = require("../db");

const getEmployeeInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const sql = `SELECT * FROM  
                        invoice_data 
                        JOIN  invoice_services_data ON invoice_data.invoice_id = invoice_services_data.invoice_id 
                        WHERE  invoice_data.employeeId = ?`;

    const result = await new Promise((resolve, reject) => {
      db.query(sql, [id], (err, results) => {
        if (err) {
          reject(err); // Reject the promise with the error
        } else {
          resolve(results); // Resolve the promise with the results
        }
      });
    });

    // Send the result as a response
    res.status(200).json(result);
  } catch (err) {
    console.error("Database query error:", err); // Log the error for debugging
    res.status(500).json({ message: "Internal Server Error", error: err });
  }
};

const getEmployeeLeads = async (req, res) => {
  try {
    const { id } = req.params;
    const sql = "SELECT * FROM leads WHERE employeeId = ?";

    const result = await new Promise((resolve, reject) => {
      db.query(sql, [id], (err, results) => {
        if (err) {
          reject(err); // Reject the promise with the error
        } else {
          resolve(results); // Resolve the promise with the results
        }
      });
    });
    // Send the result as a response
    res.status(200).json(result);
  } catch (err) {
    console.error("Database query error:", err); // Log the error for debugging
    res.status(500).json({ message: "Internal Server Erro, error: errr" });
  }
};

const updateOnlyLeadStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { lead_status } = req.body;

    console.log(lead_status, id);

    const sql = `UPDATE leads SET 
                    lead_status = ?
                    
                    WHERE lead_id = ?`;

    await new Promise((resolve, reject) => {
      db.query(sql, [lead_status, id], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    res.status(200).json({ message: "Lead updated successfully" });
  } catch (error) {
    console.error("Database update error:", error);
    res.status(500).json({ message: "Internal Server Error", error: err });
  }
};

const updateOnlyQuotationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { quotation } = req.body;

    console.log(quotation, id);

    const sql = `UPDATE leads SET 
                    quotation = ?
                    
                    WHERE lead_id = ?`;

    await new Promise((resolve, reject) => {
      db.query(sql, [quotation, id], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    res.status(200).json({ message: "Quotation Status updated successfully" });
  } catch (error) {
    console.error("Database update error:", error);
    res.status(500).json({ message: "Internal Server Error", error: err });
  }
};

const updateLeadStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      lead_status,
      quotation_status,
      invoice_status,
      deal_status,
      reason, 
      status,
      follow_up_status,
      visit, // Add visit to destructured body
      visit_date, // Add visit_date to destructured body
      d_closeDate, // Add d_closeDate (Deal Close Date) to destructured body
    } = req.body;

    console.log(
      lead_status,
      quotation_status,
      invoice_status,
      deal_status,
      reason, 
      status,
      follow_up_status,
      visit,
      visit_date,
      d_closeDate, // Log d_closeDate
      id
    );

    const sql = `UPDATE leads SET 
                      lead_status = ?, 
                      quotation_status = ?, 
                      invoice_status = ?, 
                      deal_status = ?, 
                      reason = ?, 
                      status = ?, 
                      follow_up_status = ?, 
                      visit = ?,            -- Include visit in the SQL query
                      visit_date = ?,       -- Include visit_date in the SQL query
                      d_closeDate = ?       -- Include d_closeDate in the SQL query
                  WHERE lead_id = ?`;

    await new Promise((resolve, reject) => {
      db.query(
        sql,
        [
          lead_status,
          quotation_status,
          invoice_status,
          deal_status,
          reason, 
          status,
          follow_up_status,
          visit, // Pass visit to the query
          visit_date, // Pass visit_date to the query
          d_closeDate, // Pass d_closeDate to the query
          id,
        ],
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    });

    res.status(200).json({ message: "Lead updated successfully" });
  } catch (error) {
    console.error("Database update error:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

const getEmployeeQuotation = async (req, res) => {
  try {
    const { id } = req.params;
    const sql = "SELECT * FROM quotations_data WHERE employeeId = ?";

    const result = await new Promise((resolve, reject) => {
      db.query(sql, [id], (err, results) => {
        if (err) {
          reject(err); // Reject the promise with the error
        } else {
          resolve(results); // Resolve the promise with the results
        }
      });
    });

    // Send the result as a response
    res.status(200).json(result);
  } catch (err) {
    console.error("Database query error:", err); // Log the error for debugging
    res.status(500).json({ message: "Internal Server Error", error: err });
  }
};

const employeeProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const sql =
      "SELECT employeeId, name, email, phone,photo, position, createdTime FROM employee WHERE employeeId = ?";

    const result = await new Promise((resolve, reject) => {
      db.query(sql, [id], (err, results) => {
        if (err) {
          reject(err); // Reject the promise with the error
        } else {
          resolve(results); // Resolve the promise with the results
        }
      });
    });

    // Send the result as a response
    res.status(200).json(result);
  } catch (err) {
    console.error("Database query error:", err); // Log the error for debugging
    res.status(500).json({ message: "Internal Server Error", error: err });
  }
};
const getAllEmployeeTotalLeads = async (req, res) => {
  try {
    const query = `
      SELECT 
          e.employeeId,
          e.name,
          e.email,
          COUNT(l.lead_id) AS total_leads
      FROM employee e
      LEFT JOIN leads l ON e.employeeId = l.employeeId
      
      GROUP BY e.employeeId;
    `;

    db.query(query, (err, results) => {
      if (err) {
        console.error("Error fetching employees with lead count:", err);
        return res.status(500).json({ error: "Internal server error" });
      }
      return res.status(200).json({
        success: true,
        employees: results,
      });
    });
  } catch (error) {
    console.error("Error in fetching employees:", error);
    res.status(500).json({
      success: false,
      message: "Error in fetching employees",
      error: error.message,
    });
  }
};
const getLeadQuotation = async (req, res) => {
  try {
    const { id } = req.params;
    const sql = "SELECT * FROM quotations_data WHERE lead_id = ?";

    const result = await new Promise((resolve, reject) => {
      db.query(sql, [id], (err, results) => {
        if (err) {
          reject(err); // Reject the promise with the error
        } else {
          resolve(results); // Resolve the promise with the results
        }
      });
    });

    // Send the result as a response
    res.status(200).json(result);
  } catch (err) {
    console.error("Database query error:", err); // Log the error for debugging
    res.status(500).json({ message: "Internal Server Error", error: err });
  }
};

module.exports = {
  getEmployeeInvoice,
  getEmployeeLeads,
  updateLeadStatus,
  getEmployeeQuotation,
  employeeProfile,
  updateOnlyLeadStatus,
  updateOnlyQuotationStatus,
  getAllEmployeeTotalLeads,
  getLeadQuotation,
};
