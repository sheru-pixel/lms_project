import React, { useState } from "react";
import { useParams } from "react-router-dom";
import useGetAvailableSlots from "../customHooks/useGetAvailableSlots";
import "../styles/BookSession.css";

const BookSession = () => {
  const { courseId } = useParams();
  const { slots, loading, error } = useGetAvailableSlots(courseId);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [requestMessage, setRequestMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  console.log("BookSession - courseId:", courseId);
  console.log("BookSession - slots:", slots);
  console.log("BookSession - loading:", loading);
  console.log("BookSession - error:", error);

  const handleRequestSession = async () => {
    if (!selectedSlot) {
      setMessage("Please select a time slot");
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch(
        "http://localhost:3000/api/session/request",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            slotId: selectedSlot._id,
            requestMessage
          })
        }
      );

      const data = await response.json();
      if (response.ok) {
        setMessage("Session request sent successfully! The educator will review your request soon.");
        setSelectedSlot(null);
        setRequestMessage("");
        setTimeout(() => setMessage(""), 5000);
      } else {
        setMessage(data.message || "Failed to send request");
      }
    } catch (err) {
      setMessage(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getDuration = (startTime, endTime) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const minutes = Math.round((end - start) / 60000);
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  if (loading) {
    return (
      <div className="book-session-container">
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <p>Loading available slots...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="book-session-container">
        <div style={{ textAlign: 'center', padding: '40px 20px', color: 'red' }}>
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="book-session-container">
      <div className="session-header">
        <h1>Book a One-on-One Session</h1>
        <p>Select your preferred time slot with the educator</p>
      </div>

      {message && (
        <div className={`alert ${message.includes("successfully") ? "alert-success" : "alert-error"}`}>
          {message}
        </div>
      )}

      <div className="booking-layout">
        <div className="slots-section">
          <h2>Available Time Slots</h2>
          {slots.length === 0 ? (
            <div className="empty-slots">
              <p>No available slots at the moment</p>
              <p className="text-muted">Check back later or contact the educator</p>
            </div>
          ) : (
            <div className="slots-list">
              {slots.map(slot => (
                <div
                  key={slot._id}
                  className={`slot-item ${selectedSlot?._id === slot._id ? "selected" : ""}`}
                  onClick={() => setSelectedSlot(slot)}
                >
                  <div className="slot-educator">
                    {slot.educator?.photoUrl && (
                      <img
                        src={slot.educator.photoUrl}
                        alt={slot.educator?.name}
                        className="educator-photo"
                      />
                    )}
                    <div className="educator-info">
                      <h4>{slot.educator?.name}</h4>
                      <p className="educator-title">Educator</p>
                    </div>
                  </div>

                  <div className="slot-timing">
                    <p className="date-time">{formatDate(slot.startTime)}</p>
                    <p className="duration">Duration: {getDuration(slot.startTime, slot.endTime)}</p>
                  </div>

                  {slot.notes && (
                    <p className="slot-notes">{slot.notes}</p>
                  )}

                  <button
                    className={`btn-select ${selectedSlot?._id === slot._id ? "selected" : ""}`}
                  >
                    {selectedSlot?._id === slot._id ? "✓ Selected" : "Select Slot"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="request-section">
          <h2>Request Details</h2>
          {selectedSlot ? (
            <div className="request-form">
              <div className="selected-slot-info">
                <h4>Selected Slot</h4>
                <p><strong>Educator:</strong> {selectedSlot.educator?.name}</p>
                <p><strong>Date & Time:</strong> {formatDate(selectedSlot.startTime)}</p>
                <p><strong>Duration:</strong> {getDuration(selectedSlot.startTime, selectedSlot.endTime)}</p>
              </div>

              <div className="form-group">
                <label>Message to Educator (Optional)</label>
                <textarea
                  placeholder="Tell the educator what you'd like to discuss or any specific topics you want help with..."
                  value={requestMessage}
                  onChange={(e) => setRequestMessage(e.target.value)}
                  rows="5"
                  maxLength="500"
                ></textarea>
                <p className="char-count">{requestMessage.length}/500</p>
              </div>

              <button
                className="btn-submit-request"
                onClick={handleRequestSession}
                disabled={submitting}
              >
                {submitting ? "Sending Request..." : "Send Session Request"}
              </button>
            </div>
          ) : (
            <div className="no-selection">
              <p>Select a time slot to proceed</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookSession;
