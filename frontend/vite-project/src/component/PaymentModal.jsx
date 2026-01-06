import React, { useState } from 'react';
import axios from 'axios';
import '../styles/PaymentModal.css';

function PaymentModal({ isOpen, onClose, courseId, courseTitle, amount, onPaymentSuccess }) {
  const [step, setStep] = useState('confirm'); // confirm, bkash, processing
  const [bkashNumber, setBkashNumber] = useState('');
  const [bkashPin, setBkashPin] = useState('');
  const [paymentId, setPaymentId] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [transactionId, setTransactionId] = useState('');

  const initiatePayment = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await axios.post(
        'http://localhost:3000/api/payment/initiate',
        { courseId, amount },
        { withCredentials: true }
      );

      setPaymentId(response.data.paymentId);
      setStep('bkash');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to initiate payment');
      console.error('Error initiating payment:', err);
    } finally {
      setLoading(false);
    }
  };

  const processbKashPayment = async () => {
    try {
      if (!bkashNumber || !bkashPin) {
        setError('Please enter both bKash number and PIN');
        return;
      }

      setLoading(true);
      setError('');
      setStep('processing');

      const response = await axios.post(
        'http://localhost:3000/api/payment/bkash',
        {
          paymentId,
          bkashNumber,
          bkashPin
        },
        { withCredentials: true }
      );

      setTransactionId(response.data.transactionId);
      
      // Call success callback after a short delay
      setTimeout(() => {
        onPaymentSuccess?.(response.data.enrollmentId);
        handleClose();
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Payment failed. Please try again.');
      setStep('bkash');
      console.error('Error processing payment:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setBkashNumber('');
    setBkashPin('');
    setError('');
    setStep('confirm');
    setPaymentId(null);
    setTransactionId('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="payment-modal-overlay">
      <div className="payment-modal">
        <button className="payment-close-btn" onClick={handleClose}>×</button>

        {/* Confirm Step */}
        {step === 'confirm' && (
          <div className="payment-step">
            <h2>Confirm Purchase</h2>
            <div className="payment-details">
              <div className="detail-row">
                <span className="detail-label">Course:</span>
                <span className="detail-value">{courseTitle}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Amount:</span>
                <span className="detail-value price">${amount}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Payment Method:</span>
                <span className="detail-value">bKash</span>
              </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="payment-actions">
              <button
                className="btn-cancel"
                onClick={handleClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                className="btn-proceed"
                onClick={initiatePayment}
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Proceed to Payment'}
              </button>
            </div>
          </div>
        )}

        {/* bKash Payment Step */}
        {step === 'bkash' && (
          <div className="payment-step">
            <h2>bKash Payment</h2>
            <p className="payment-instruction">
              Enter your bKash number and PIN to complete the payment
            </p>

            <div className="form-group">
              <label htmlFor="bkash-number">bKash Number</label>
              <input
                id="bkash-number"
                type="tel"
                placeholder="01xxxxxxxxx"
                value={bkashNumber}
                onChange={(e) => setBkashNumber(e.target.value)}
                disabled={loading}
              />
              <small>Enter your 11-digit bKash number</small>
            </div>

            <div className="form-group">
              <label htmlFor="bkash-pin">bKash PIN</label>
              <input
                id="bkash-pin"
                type="password"
                placeholder="****"
                value={bkashPin}
                onChange={(e) => setBkashPin(e.target.value)}
                disabled={loading}
              />
              <small>Your 4-digit bKash PIN (For testing, use any 4 digits)</small>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="payment-actions">
              <button
                className="btn-back"
                onClick={() => setStep('confirm')}
                disabled={loading}
              >
                Back
              </button>
              <button
                className="btn-pay"
                onClick={processbKashPayment}
                disabled={loading}
              >
                {loading ? 'Processing...' : `Pay $${amount}`}
              </button>
            </div>
          </div>
        )}

        {/* Processing/Success Step */}
        {step === 'processing' && (
          <div className="payment-step">
            <div className="success-animation">
              <div className="checkmark">✓</div>
            </div>
            <h2>Payment Successful!</h2>
            <div className="success-details">
              <p>Transaction ID: <strong>{transactionId}</strong></p>
              <p>Amount Paid: <strong>${amount}</strong></p>
              <p>Course: <strong>{courseTitle}</strong></p>
            </div>
            <p className="success-message">
              You have successfully enrolled in this course. Redirecting...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default PaymentModal;
