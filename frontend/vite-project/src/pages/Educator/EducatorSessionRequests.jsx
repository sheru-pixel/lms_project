import React, { useState } from "react";
import useGetEducatorSessionRequests from "../../customHooks/useGetEducatorSessionRequests";
import "../../styles/EducatorSessionRequests.css";

const EducatorSessionRequests = () => {
  const { requests, loading, setRequests } = useGetEducatorSessionRequests();
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showApprovalForm, setShowApprovalForm] = useState(false);
  const [approvalData, setApprovalData] = useState({
    meetingLink: "",
    notes: ""
  });
  const [rejectionReason, setRejectionReason] = useState("");
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState("");

  const handleApprove = async (requestId) => {
    try {
      setProcessing(true);
      const response = await fetch(
        `http://localhost:3000/api/session/approve/${requestId}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(approvalData)
        }
      );

      const data = await response.json();
      if (response.ok) {
        setMessage("Session approved successfully!");
        setRequests(requests.map(req =>
          req._id === requestId ? data.data : req
        ));
        setSelectedRequest(null);
        setShowApprovalForm(false);
        setApprovalData({ meetingLink: "", notes: "" });
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage(data.message || "Failed to approve request");
      }
    } catch (err) {
      setMessage(err.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async (requestId) => {
    if (!rejectionReason.trim()) {
      setMessage("Please provide a rejection reason");
      return;
    }

    try {
      setProcessing(true);
      const response = await fetch(
        `http://localhost:3000/api/session/reject/${requestId}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ rejectionReason })
        }
      );

      const data = await response.json();
      if (response.ok) {
        setMessage("Session request rejected");
        setRequests(requests.map(req =>
          req._id === requestId ? data.data : req
        ));
        setSelectedRequest(null);
        setRejectionReason("");
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage(data.message || "Failed to reject request");
      }
    } catch (err) {
      setMessage(err.message);
    } finally {
      setProcessing(false);
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

  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return "#ff9800";
      case "approved": return "#4caf50";
      case "rejected": return "#f44336";
      case "completed": return "#2196f3";
      default: return "#9e9e9e";
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="educator-sessions-container">
      <div className="sessions-header">
        <h1>Session Requests</h1>
        <div className="filter-stats">
          <span className="stat pending">
            Pending: {requests.filter(r => r.status === "pending").length}
          </span>
          <span className="stat approved">
            Approved: {requests.filter(r => r.status === "approved").length}
          </span>
        </div>
      </div>

      {message && <div className="alert alert-info">{message}</div>}

      <div className="sessions-layout">
        <div className="requests-list">
          {requests.length === 0 ? (
            <p className="empty-message">No session requests yet</p>
          ) : (
            requests.map(req => (
              <div
                key={req._id}
                className={`request-item ${req.status} ${selectedRequest?._id === req._id ? "active" : ""}`}
                onClick={() => setSelectedRequest(req)}
              >
                <div className="item-header">
                  <h4>{req.student?.name}</h4>
                  <span
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(req.status) }}
                  >
                    {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                  </span>
                </div>
                <p className="course-name">{req.course?.title}</p>
                <p className="time">
                  {formatDate(req.sessionStartTime)}
                </p>
              </div>
            ))
          )}
        </div>

        <div className="request-details">
          {selectedRequest ? (
            <div className="details-content">
              <h2>Session Request Details</h2>

              <div className="detail-section">
                <h3>Student Information</h3>
                <div className="student-info">
                  {selectedRequest.student?.photoUrl && (
                    <img
                      src={selectedRequest.student.photoUrl}
                      alt={selectedRequest.student?.name}
                      className="student-photo"
                    />
                  )}
                  <div>
                    <p><strong>Name:</strong> {selectedRequest.student?.name}</p>
                    <p><strong>Email:</strong> {selectedRequest.student?.email}</p>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3>Session Information</h3>
                <p><strong>Course:</strong> {selectedRequest.course?.title}</p>
                <p><strong>Start:</strong> {formatDate(selectedRequest.sessionStartTime)}</p>
                <p><strong>End:</strong> {formatDate(selectedRequest.sessionEndTime)}</p>
                {selectedRequest.requestMessage && (
                  <p><strong>Message:</strong> {selectedRequest.requestMessage}</p>
                )}
              </div>

              {selectedRequest.status === "pending" && (
                <div className="detail-section actions-section">
                  <h3>Actions</h3>
                  {!showApprovalForm ? (
                    <div className="action-buttons">
                      <button
                        className="btn-approve"
                        onClick={() => setShowApprovalForm(true)}
                      >
                        Approve Request
                      </button>
                      <button
                        className="btn-reject"
                        onClick={() => document.querySelector('.rejection-form')?.scrollIntoView()}
                      >
                        Reject Request
                      </button>
                    </div>
                  ) : (
                    <div className="approval-form">
                      <div className="form-group">
                        <label>Meeting Link</label>
                        <input
                          type="url"
                          placeholder="https://meet.google.com/..."
                          value={approvalData.meetingLink}
                          onChange={(e) => setApprovalData({
                            ...approvalData,
                            meetingLink: e.target.value
                          })}
                        />
                      </div>
                      <div className="form-group">
                        <label>Additional Notes</label>
                        <textarea
                          placeholder="Share any additional information..."
                          value={approvalData.notes}
                          onChange={(e) => setApprovalData({
                            ...approvalData,
                            notes: e.target.value
                          })}
                          rows="3"
                        ></textarea>
                      </div>
                      <div className="form-buttons">
                        <button
                          className="btn-primary"
                          onClick={() => handleApprove(selectedRequest._id)}
                          disabled={processing}
                        >
                          {processing ? "Processing..." : "Confirm Approval"}
                        </button>
                        <button
                          className="btn-secondary"
                          onClick={() => {
                            setShowApprovalForm(false);
                            setApprovalData({ meetingLink: "", notes: "" });
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="rejection-form">
                    <h4>Reject Request</h4>
                    <div className="form-group">
                      <label>Reason for Rejection *</label>
                      <textarea
                        placeholder="Explain why you're rejecting this request..."
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        rows="3"
                      ></textarea>
                    </div>
                    <button
                      className="btn-danger"
                      onClick={() => handleReject(selectedRequest._id)}
                      disabled={processing}
                    >
                      {processing ? "Processing..." : "Send Rejection"}
                    </button>
                  </div>
                </div>
              )}

              {selectedRequest.status === "approved" && (
                <div className="detail-section">
                  <h3>Approved Session Details</h3>
                  {selectedRequest.meetingLink && (
                    <p>
                      <strong>Meeting Link:</strong>{" "}
                      <a href={selectedRequest.meetingLink} target="_blank" rel="noopener noreferrer">
                        {selectedRequest.meetingLink}
                      </a>
                    </p>
                  )}
                  {selectedRequest.notes && (
                    <p><strong>Notes:</strong> {selectedRequest.notes}</p>
                  )}
                </div>
              )}

              {selectedRequest.status === "rejected" && (
                <div className="detail-section rejection-info">
                  <h3>Rejection Details</h3>
                  <p><strong>Reason:</strong> {selectedRequest.rejectionReason}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="no-selection">
              <p>Select a request to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EducatorSessionRequests;
