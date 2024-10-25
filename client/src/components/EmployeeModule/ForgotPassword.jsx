import React, { useState } from "react";
import axios from "axios";
import cogoToast from "cogo-toast";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const sendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("http://localhost:9000/api/sendOtp", { email });
      cogoToast.success("OTP sent to your email!");
      setStep(2);
    } catch (error) {
      cogoToast.error("Failed to send OTP. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:9000/api/verifyOtp", {
        email,
        otp,
      });
      if (response.data.success) {
        cogoToast.success("OTP verified!");
        setStep(3);
      } else {
        cogoToast.error("Invalid OTP!");
      }
    } catch (error) {
      cogoToast.error("Failed to verify OTP. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("http://localhost:9000/api/resetPassword", {
        email,
        password: newPassword,
      });
      cogoToast.success("Password reset successfully!");
      navigate("/admin-login");
    } catch (error) {
      cogoToast.error("Failed to reset password. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-white shadow-md rounded-lg w-4/5 md:w-3/5 lg:w-2/5 xl:w-1/3 mt-8 p-6">
        <div className="text-center font-bold text-2xl mb-6 text-gray-800">
          Password Reset
        </div>

        {step === 1 && (
          <form className="space-y-4" onSubmit={sendOtp}>
            <div className="flex items-center">
              <i className="fas fa-envelope text-xl mr-3 text-gray-500"></i>
              <div className="flex-grow">
                <label className="block text-gray-700">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border rounded px-3 py-2 w-full"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>
            <div className="text-center">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                disabled={loading}
              >
                {loading ? "Loading..." : "Send OTP"}
              </button>
            </div>
          </form>
        )}

        {step === 2 && (
          <form className="space-y-4" onSubmit={verifyOtp}>
            <div className="flex items-center">
              <i className="fas fa-envelope text-xl mr-3 text-gray-500"></i>
              <div className="flex-grow">
                <label className="block text-gray-700">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border rounded px-3 py-2 w-full"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>
            <div className="flex items-center">
              <i className="fas fa-key text-xl mr-3 text-gray-500"></i>
              <div className="flex-grow">
                <label className="block text-gray-700">OTP</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="border rounded px-3 py-2 w-full"
                  placeholder="Enter OTP"
                  required
                />
              </div>
            </div>
            <div className="text-center">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                disabled={loading}
              >
                {loading ? "Loading..." : "Verify OTP"}
              </button>
            </div>
          </form>
        )}

        {step === 3 && (
          <form className="space-y-4" onSubmit={resetPassword}>
            <div className="flex items-center">
              <i className="fas fa-lock text-xl mr-3 text-gray-500"></i>
              <div className="flex-grow">
                <label className="block text-gray-700">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="border rounded px-3 py-2 w-full"
                  placeholder="Enter new password"
                  required
                />
              </div>
            </div>
            <div className="text-center">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                disabled={loading}
              >
                {loading ? "Loading..." : "Reset Password"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;
