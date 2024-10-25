const express = require("express");
const { db } = require("../db");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const roles = req.body.role || "Super-Admin"; // Default role to Super Admin

    // Validations
    const requiredFields = [name, email, password, roles];

    if (requiredFields.some((field) => !field)) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Hash the "password" and "cpassword"
    const saltRounds = 10;
    const hashedPassword = bcrypt.hashSync(password, saltRounds);

    // Check if the user already exists
    const checkUserQuery = "SELECT * FROM registered_data WHERE email = ?";

    db.query(checkUserQuery, [email], (err, result) => {
      if (err) {
        console.error("Error checking if user exists in MySQL:", err);
        res.status(500).json({ error: "Internal server error" });
      } else {
        // Check if there are any rows in the result
        if (result.length > 0) {
          return res.status(400).json({
            error: "User already exists.",
          });
        } else {
          // User not found, proceed with registration
          const insertUserQuery = `
              INSERT INTO registered_data  (user_name, email,password,roles ) VALUES (?, ?, ?,?)`;

          const insertUserParams = [name, email, hashedPassword, roles];

          db.query(
            insertUserQuery,
            insertUserParams,
            (insertErr, insertResult) => {
              if (insertErr) {
                console.error("Error inserting user:", insertErr);
                res.status(500).json({ error: "Internal server error" });
              } else {
                console.log("User registered successfully");
                return res.status(200).json({
                  success: true,
                  message: "User registered successfully",
                });
              }
            }
          );
        }
      }
    });
  } catch (error) {
    console.error("Error in registration:", error);
    res.status(500).json({
      success: false,
      message: "Error in registration",
      error: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    //Validation
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Invaild email or password ",
      });
    }
    // check user in mysql
    const checkUserQuery = "SELECT * FROM registered_data WHERE email =?";
    db.query(checkUserQuery, [email], async (err, results) => {
      if (err) {
        console.log("Error checking  user in mysql", err);
      }
      if (results.length === 0) {
        return res.status(404).send({
          success: false,
          message: "email is not  registered",
        });
      }
      const user = results[0];

      //compare  passwords
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(404).send({
          success: false,
          message: "Invaild password ",
        });
      }

      //generate  token
      const token = await JWT.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      res.status(200).send({
        success: true,
        message: "Login sucessfully",
        user: {
          id: user.user_id,
          name: user.user_name,
          email: user.email,
          roles: user.roles,
        },
        token,
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "error in login ", error });
  }
};

const employeelogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check user in MySQL
    const checkUserQuery = "SELECT * FROM employee WHERE email = ?";
    db.query(checkUserQuery, [email], (err, results) => {
      if (err) {
        console.log("Error checking user in MySQL", err);
        return res.status(500).send({
          success: false,
          message: "Server error",
        });
      }

      if (results.length === 0) {
        return res.status(404).send({
          success: false,
          message: "Email is not registered",
        });
      }

      const user = results[0];

      // Compare passwords (direct comparison since bcrypt is not used)
      if (password !== user.password) {
        return res.status(404).send({
          success: false,
          message: "Invalid password",
        });
      }

      // Generate token
      const token = JWT.sign({ id: user.employeeId }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      // Send response
      res.status(200).send({
        success: true,
        message: "Login successfully",
        user: {
          id: user.employeeId,
          name: user.name,
          email: user.email,
          position: user.position,
          salary: user.salary,
          roles: user.roles,
        },
        token,
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in login",
      error,
    });
  }
};

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check admin in MySQL
    const checkAdminsQuery = "SELECT * FROM admins WHERE email = ?";
    db.query(checkAdminsQuery, [email], (err, results) => {
      if (err) {
        console.log("Error checking admins in MySQL", err);
        return res.status(500).send({
          success: false,
          message: "Server error",
        });
      }

      if (results.length === 0) {
        return res.status(404).send({
          success: false,
          message: "Email is not registered",
        });
      }

      const user = results[0];

      // Compare passwords (direct comparison since bcrypt is not used)
      if (password !== user.password) {
        return res.status(404).send({
          success: false,
          message: "Invalid password",
        });
      }

      // Generate token
      const token = JWT.sign({ id: user.admin_id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      // Send response
      res.status(200).send({
        success: true,
        message: "Login successfully",
        user: {
          id: user.admin_id,
          name: user.name,
          email: user.email,
          roles: user.roles,
        },
        token,
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in login",
      error,
    });
  }
};

////////////////

// const crypto = require("crypto");
// const db = require("../dbConnection"); // import your db connection

// Function to generate OTP and send it
// const crypto = require('crypto');
// const nodemailer = require('nodemailer');

const sendOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res
      .status(400)
      .send({ success: false, message: "Email is required" });
  }

  // Check if user exists
  const checkUserQuery = "SELECT * FROM registered_data WHERE email = ?";
  db.query(checkUserQuery, [email], (err, results) => {
    if (err || results.length === 0) {
      return res
        .status(404)
        .send({ success: false, message: "Email is not registered" });
    }

    // Generate OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const expiry = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes

    // Store OTP and expiry in database (assuming `otp` and `otp_expiry` fields exist in `registered_data`)
    const updateOtpQuery =
      "UPDATE registered_data SET otp = ?, otp_expiry = ? WHERE email = ?";
    db.query(updateOtpQuery, [otp, expiry, email], (err) => {
      if (err)
        return res
          .status(500)
          .send({ success: false, message: "Error saving OTP" });

      // Send OTP to user's email
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Password Reset OTP",
        text: `Your OTP for password reset is ${otp}`,
      };

      transporter.sendMail(mailOptions, (err) => {
        if (err)
          return res
            .status(500)
            .send({ success: false, message: "Error sending OTP" });
        res.status(200).send({ success: true, message: "OTP sent to email" });
      });
    });
  });
};

const verifyOtp = (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res
      .status(400)
      .send({ success: false, message: "Email and OTP are required" });
  }

  const checkOtpQuery =
    "SELECT otp, otp_expiry FROM registered_data WHERE email = ?";
  db.query(checkOtpQuery, [email], (err, results) => {
    if (err || results.length === 0) {
      return res
        .status(404)
        .send({ success: false, message: "Email is not registered" });
    }

    const { otp: storedOtp, otp_expiry } = results[0];
    if (storedOtp !== otp || Date.now() > otp_expiry) {
      return res
        .status(400)
        .send({ success: false, message: "Invalid or expired OTP" });
    }

    res.status(200).send({
      success: true,
      message: "OTP verified, proceed to reset password",
    });
  });
};

const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;
  if (!email || !newPassword) {
    return res
      .status(400)
      .send({ success: false, message: "Email and new password are required" });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  const resetPasswordQuery =
    "UPDATE registered_data SET password = ?, otp = NULL, otp_expiry = NULL WHERE email = ?";
  db.query(resetPasswordQuery, [hashedPassword, email], (err) => {
    if (err)
      return res
        .status(500)
        .send({ success: false, message: "Error updating password" });
    res
      .status(200)
      .send({ success: true, message: "Password reset successfully" });
  });
};

module.exports = {
  register,
  login,
  employeelogin,
  adminLogin,
  sendOtp,
  resetPassword,
  verifyOtp,
};
