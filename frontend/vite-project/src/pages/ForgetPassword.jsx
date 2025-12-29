import { useState } from "react";
import axios from "axios";
import "../styles/ForgetPassword.css";

const ForgetPassword = () => {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const API_BASE_URL = "http://localhost:5000/api/auth";

  // Step 1: Send OTP to Email
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setMessage("");

    if (!email.trim()) {
      setErrorMessage("Please enter your email");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/forget-password`, {
        email,
      });

      setMessage(response.data.message);
      setStep(2);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Error sending OTP");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setMessage("");

    if (!otp.trim()) {
      setErrorMessage("Please enter the OTP");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/verify-otp`, {
        email,
        otp,
      });

      setMessage(response.data.message);
      setStep(3);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setMessage("");

    if (!newPassword.trim() || !confirmPassword.trim()) {
      setErrorMessage("Please fill in all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      setErrorMessage("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/reset-password`, {
        email,
        otp,
        newPassword,
        confirmPassword,
      });

      setMessage(response.data.message);
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Error resetting password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forget-password-container">
      <div className="forget-password-card">
        <h1>Reset Your Password</h1>

        {/* Progress Indicator */}
        <div className="progress-indicator">
          <div className={`step ${step >= 1 ? "active" : ""}`}>
            <div className="step-number">1</div>
            <div className="step-label">Email</div>
          </div>
          <div className={`step-line ${step >= 2 ? "active" : ""}`}></div>
          <div className={`step ${step >= 2 ? "active" : ""}`}>
            <div className="step-number">2</div>
            <div className="step-label">OTP</div>
          </div>
          <div className={`step-line ${step >= 3 ? "active" : ""}`}></div>
          <div className={`step ${step >= 3 ? "active" : ""}`}>
            <div className="step-number">3</div>
            <div className="step-label">Password</div>
          </div>
        </div>

        {/* Messages */}
        {message && <div className="success-message">{message}</div>}
        {errorMessage && <div className="error-message">{errorMessage}</div>}

        {/* Step 1: Email Input */}
        {step === 1 && (
          <form onSubmit={handleSendOtp} className="form-group">
            <div className="input-wrapper">
              <label htmlFor="email">Enter Your Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                disabled={loading}
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </form>
        )}

        {/* Step 2: OTP Verification */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="form-group">
            <p className="step-description">
              We've sent an OTP to <strong>{email}</strong>
            </p>
            <div className="input-wrapper">
              <label htmlFor="otp">Enter OTP</label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="000000"
                maxLength="6"
                disabled={loading}
              />
            </div>
            <p className="otp-info">OTP expires in 10 minutes</p>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
            <button
              type="button"
              onClick={() => {
                setStep(1);
                setOtp("");
                setMessage("");
              }}
              className="btn-secondary"
            >
              Back
            </button>
          </form>
        )}

        {/* Step 3: Password Reset */}
        {step === 3 && (
          <form onSubmit={handleResetPassword} className="form-group">
            <p className="step-description">
              Create a new password for your account
            </p>
            <div className="input-wrapper">
              <label htmlFor="newPassword">New Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="toggle-password"
                  disabled={loading}
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
            </div>

            <div className="input-wrapper">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="toggle-password"
                  disabled={loading}
                >
                  {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
            </div>

            <p className="password-info">
              • Password must be at least 8 characters long
            </p>

            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? "Resetting..." : "Reset Password"}
            </button>
            <button
              type="button"
              onClick={() => {
                setStep(2);
                setNewPassword("");
                setConfirmPassword("");
                setMessage("");
              }}
              className="btn-secondary"
            >
              Back
            </button>
          </form>
        )}

        {/* Back to Login */}
        <div className="back-to-login">
          <p>
            Remember your password?{" "}
            <a href="/login">Back to Login</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
