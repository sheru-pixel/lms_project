import React, { useState } from "react";
import useGetEducatorSlots from "../../customHooks/useGetEducatorSlots";
import useGetCreatorCourse from "../../customHooks/getCreatorCourse";
import "../../styles/EducatorAvailability.css";

const EducatorAvailability = () => {
  const { courses, loading: coursesLoading } = useGetCreatorCourse();
  const { slots, loading: slotsLoading, setSlots } = useGetEducatorSlots();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    courseId: "",
    startTime: "",
    endTime: "",
    notes: ""
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.courseId || !formData.startTime || !formData.endTime) {
      setMessage("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        "http://localhost:3000/api/availability/create",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            courseId: formData.courseId,
            startTime: formData.startTime,
            endTime: formData.endTime,
            notes: formData.notes
          })
        }
      );

      const data = await response.json();
      if (response.ok) {
        setMessage("Availability slot created successfully!");
        setSlots([...slots, data.data]);
        setFormData({ courseId: "", startTime: "", endTime: "", notes: "" });
        setShowForm(false);
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage(data.message || "Failed to create slot");
      }
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSlot = async (slotId) => {
    if (!window.confirm("Are you sure you want to delete this slot?")) return;

    try {
      const response = await fetch(
        `http://localhost:3000/api/availability/delete/${slotId}`,
        {
          method: "DELETE",
          credentials: "include"
        }
      );

      if (response.ok) {
        setSlots(slots.filter(slot => slot._id !== slotId));
        setMessage("Slot deleted successfully!");
        setTimeout(() => setMessage(""), 3000);
      } else {
        const data = await response.json();
        setMessage(data.message || "Failed to delete slot");
      }
    } catch (err) {
      setMessage(err.message);
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

  const getSlotStatus = (slot) => {
    if (slot.status === "cancelled") return "Cancelled";
    if (slot.isBooked) return "Booked";
    return "Available";
  };

  if (coursesLoading || slotsLoading) {
    return (
      <div className="educator-availability-container">
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <p style={{ fontSize: '18px', color: '#666' }}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="educator-availability-container">
      <div className="availability-header">
        <h1>Manage Availability Slots</h1>
        <button
          className="btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Cancel" : "+ Create New Slot"}
        </button>
      </div>

      {message && <div className="alert alert-info">{message}</div>}
      {coursesLoading === false && courses.length === 0 && (
        <div className="alert alert-info">No courses found. Please create a course first.</div>
      )}

      {showForm && (
        <div className="availability-form-container">
          <h2>Create Availability Slot</h2>
          <form onSubmit={handleSubmit} className="availability-form">
            <div className="form-group">
              <label>Course *</label>
              <select
                name="courseId"
                value={formData.courseId}
                onChange={handleInputChange}
                required
              >
                <option value="">Select a course</option>
                {courses.map(course => (
                  <option key={course._id} value={course._id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Start Time *</label>
                <input
                  type="datetime-local"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>End Time *</label>
                <input
                  type="datetime-local"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Add any notes for this slot"
                rows="3"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
            >
              {loading ? "Creating..." : "Create Slot"}
            </button>
          </form>
        </div>
      )}

      <div className="slots-list">
        <h2>Your Availability Slots</h2>
        {slots.length === 0 ? (
          <p className="empty-message">No availability slots created yet</p>
        ) : (
          <div className="slots-grid">
            {slots.map(slot => (
              <div key={slot._id} className={`slot-card slot-${slot.status}`}>
                <div className="slot-header">
                  <h3>{slot.course?.title}</h3>
                  <span className={`status-badge status-${slot.status}`}>
                    {getSlotStatus(slot)}
                  </span>
                </div>

                <div className="slot-details">
                  <p>
                    <strong>From:</strong> {formatDate(slot.startTime)}
                  </p>
                  <p>
                    <strong>To:</strong> {formatDate(slot.endTime)}
                  </p>
                  {slot.notes && (
                    <p>
                      <strong>Notes:</strong> {slot.notes}
                    </p>
                  )}
                  {slot.isBooked && slot.bookedBy && (
                    <p>
                      <strong>Booked by:</strong> {slot.bookedBy?.name}
                    </p>
                  )}
                </div>

                {!slot.isBooked && (
                  <button
                    onClick={() => handleDeleteSlot(slot._id)}
                    className="btn-delete"
                  >
                    Delete
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EducatorAvailability;
