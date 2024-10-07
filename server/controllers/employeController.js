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
        console.error('Database query error:', err); // Log the error for debugging
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
        console.error('Database query error:', err); // Log the error for debugging
        res.status(500).json({ message: "Internal Server Erro, error: errr"});
    } 
}
const updateOnlyLeadStatus = async (req, res) => {
    try {
      const { id } = req.params;
      const { lead_status } = req.body;

      console.log(lead_status,  id);
  
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
      console.error('Database update error:', error);
      res.status(500).json({ message: "Internal Server Error", error: err });
    }
  };
  
const updateOnlyQuotationStatus = async (req, res) => {
    try {
      const { id } = req.params;
      const { quotation} = req.body;

      console.log(quotation,  id);
  
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
      console.error('Database update error:', error);
      res.status(500).json({ message: "Internal Server Error", error: err });
    }
  };





const updateLeadStatus = async (req, res) => {
    try {
      const { id } = req.params;
      const { lead_status, quotation_status, invoice_status, deal_status, reason,  follow_up_status } = req.body;

      console.log(lead_status, quotation_status, invoice_status, deal_status, reason,  follow_up_status, id);
  
      const sql = `UPDATE leads SET 
                    lead_status = ?, 
                    quotation_status = ?, 
                    invoice_status = ?, 
                    deal_status = ?, 
                    reason = ?, 
                  
                    follow_up_status = ? 
                    WHERE lead_id = ?`;
  
      await new Promise((resolve, reject) => {
        db.query(sql, [lead_status, quotation_status, invoice_status, deal_status, reason,  follow_up_status, id], (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      });
  
      res.status(200).json({ message: "Lead updated successfully" });
    } catch (error) {
      console.error('Database update error:', error);
      res.status(500).json({ message: "Internal Server Error", error: err });
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
        console.error('Database query error:', err); // Log the error for debugging
        res.status(500).json({ message: "Internal Server Error", error: err });
    }
};

const employeeProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const sql = "SELECT employeeId, name, email, phone,photo,salary, position, createdTime FROM employee WHERE employeeId = ?";
    
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
        console.error('Database query error:', err); // Log the error for debugging
        res.status(500).json({ message: "Internal Server Error", error: err });
    } 
};

 
module.exports = {
    getEmployeeInvoice,
    getEmployeeLeads,
    updateLeadStatus,
    getEmployeeQuotation,
    employeeProfile,
    updateOnlyLeadStatus,updateOnlyQuotationStatus
};
  