import React, { useState, useEffect } from "react";
import useGetStudentSessions from "../customHooks/useGetStudentSessions";
import "../styles/MySessionRequests.css";

const MySessionRequests = () => {
  const { sessions, loading, setSessions } = useGetStudentSessions();
  const [selectedSession, setSelectedSession] = useState(null);
  const [cancelling, setCancelling] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    console.log("Student sessions:", sessions);
  }, [sessions]);

  const handleCancelSession = async (sessionId) => {
    if (!window.confirm("Are you sure you want to cancel this session request?")) {
      return;
    }

    try {
      setCancelling(true);
      const response = await fetch(
        `http://localhost:3000/api/session/cancel/${sessionId}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      const data = await response.json();
      if (response.ok) {
        setMessage("Session cancelled successfully");
        setSessions(sessions.map(session =>
          session._id === sessionId ? data.data : session
        ));
        setSelectedSession(null);
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage(data.message || "Failed to cancel session");
      }
    } catch (err) {
      setMessage(err.message);
    } finally {
      setCancelling(false);
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

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "pending": return "#ff9800";
      case "approved": return "#4caf50";
      case "rejected": return "#f44336";
      case "cancelled": return "#9e9e9e";
      default: return "#9e9e9e";
    }
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
      <div className="my-sessions-container">
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>Loading your session requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="my-sessions-container">
      <div className="sessions-header">
        <h1>My Session Requests</h1>
        <p>View your one-on-one session requests with educators</p>
      </div>

      {message && (
        <div className={`alert ${message.includes("successfully") ? "alert-success" : "alert-error"}`}>
          {message}
        </div>
      )}

      {sessions.length === 0 ? (
        <div className="empty-sessions">
          <p>No session requests yet</p>
          <p className="text-muted">Book a session with an educator to get started</p>
        </div>
      ) : (
        <div className="sessions-grid">
          {sessions.map(session => (
            <div
              key={session._id}
              className="session-card"
              onClick={() => setSelectedSession(session)}
            >
              <div className="session-card-header">
                <h3>{session.educator?.name || "Educator"}</h3>
                <span
                  className="status-badge"
                  style={{ backgroundColor: getStatusBadgeColor(session.status) }}
                >
                  {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                </span>
              </div>

              <div className="session-card-body">
                <p><strong>Course:</strong> {session.course?.title || "Unknown Course"}</p>
                <p><strong>Requested:</strong> {formatDate(session.createdAt)}</p>
                <p><strong>Session Time:</strong> {formatDate(session.sessionStartTime)}</p>
                <p><strong>Duration:</strong> {getDuration(session.sessionStartTime, session.sessionEndTime)}</p>
              </div>

              {session.status === "approved" && session.meetingLink && (
                <div className="session-card-action">
                  <a
                    href={session.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="join-button"
                  >
                    Join Meeting
                  </a>
                </div>
              )}

              {(session.status === "pending" || session.status === "approved") && (
                <div className="session-card-action">
                  <button
                    className="cancel-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCancelSession(session._id);
                    }}
                    disabled={cancelling}
                  >
                    Cancel Request
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {selectedSession && (
        <div className="session-detail-modal" onClick={() => setSelectedSession(null)}>
          <div className="session-detail-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Session Details</h2>
              <button
                className="close-button"
                onClick={() => setSelectedSession(null)}
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="detail-section">
                <h4>Educator</h4>
                <p><strong>{selectedSession.educator?.name}</strong></p>
                <p className="text-muted">{selectedSession.educator?.email}</p>
              </div>

              <div className="detail-section">
                <h4>Course</h4>
                <p>{selectedSession.course?.title}</p>
              </div>

              <div className="detail-section">
                <h4>Session Time</h4>
                <p>{formatDate(selectedSession.sessionStartTime)}</p>
                <p className="text-muted">Duration: {getDuration(selectedSession.sessionStartTime, selectedSession.sessionEndTime)}</p>
              </div>

              {selectedSession.requestMessage && (
                <div className="detail-section">
                  <h4>Your Request Message</h4>
                  <p>{selectedSession.requestMessage}</p>
                </div>
              )}

              <div className="detail-section">
                <h4>Status</h4>
                <span
                  className="status-badge"
                  style={{ backgroundColor: getStatusBadgeColor(selectedSession.status) }}
                >
                  {selectedSession.status.charAt(0).toUpperCase() + selectedSession.status.slice(1)}
                </span>
              </div>

              {selectedSession.status === "pending" && (
                <div className="detail-section info-box">
                  <p>⏳ Waiting for educator approval...</p>
                </div>
              )}

              {selectedSession.status === "rejected" && selectedSession.rejectionReason && (
                <div className="detail-section rejection-reason">
                  <h4>Rejection Reason</h4>
                  <p>{selectedSession.rejectionReason}</p>
                </div>
              )}

              {selectedSession.status === "approved" && selectedSession.meetingLink && (
                <div className="detail-section">
                  <h4>Meeting Link</h4>
                  <p>
                    <a href={selectedSession.meetingLink} target="_blank" rel="noopener noreferrer">
                      {selectedSession.meetingLink}
                    </a>
                  </p>
                  <a href={selectedSession.meetingLink} target="_blank" rel="noopener noreferrer" className="btn-join-meeting">
                    Join Meeting Now
                  </a>
                </div>
              )}

              {(selectedSession.status === "pending" || selectedSession.status === "approved") && (
                <button
                  className="btn-cancel"
                  onClick={() => handleCancelSession(selectedSession._id)}
                  disabled={cancelling}
                >
                  {cancelling ? "Cancelling..." : "Cancel Request"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MySessionRequests;
