# One-on-One Session Feature

A complete feature for booking one-on-one live sessions between students and course educators.

## Quick Start

### For Educators

1. **Set Your Availability**
   - Go to `Educator Dashboard` → `Manage Availability`
   - Click "Create New Slot"
   - Select a course and set your available time
   - Save the slot

2. **Review Session Requests**
   - Go to `Educator Dashboard` → `Session Requests`
   - See all pending requests from students
   - Approve with a meeting link (e.g., Google Meet, Zoom)
   - Or reject with a reason

### For Students

1. **Book a Session**
   - Open an enrolled course
   - Click "Book a Session"
   - Browse available time slots
   - Select your preferred time
   - Optionally add a message
   - Send the request

2. **Track Your Requests**
   - Go to `My Requests` (in dashboard)
   - See all your session requests
   - Once approved, click the meeting link to join
   - Can cancel pending/approved requests

## Features

- 📅 Flexible scheduling with custom time slots
- 🔔 Real-time request management
- 🎥 Meeting link support (Zoom, Google Meet, etc.)
- 💬 Student messages to educators
- ✅ Approval/rejection with feedback
- 📊 Request status tracking

## File Structure

```
Backend:
- backend/model/availabilitySlotModel.js
- backend/model/sessionRequestModel.js
- backend/contollers/availabilityController.js
- backend/contollers/sessionRequestController.js
- backend/route/availabilityRoute.js
- backend/route/sessionRoute.js

Frontend:
- src/pages/Educator/EducatorAvailability.jsx
- src/pages/Educator/EducatorSessionRequests.jsx
- src/pages/BookSession.jsx
- src/pages/MySessionRequests.jsx
- src/customHooks/useGetAvailableSlots.js
- src/customHooks/useGetEducatorSlots.js
- src/customHooks/useGetStudentSessions.js
- src/customHooks/useGetEducatorSessionRequests.js
- src/styles/EducatorAvailability.css
- src/styles/EducatorSessionRequests.css
- src/styles/BookSession.css
- src/styles/MySessionRequests.css
```

## Routes

### Educator Routes
- `/educator/availability` - Manage availability slots
- `/educator/session-requests` - View and manage session requests

### Student Routes  
- `/course/:courseId/book-session` - Book a session
- `/session-requests` - View my session requests

## API Endpoints

### Availability
- `POST /api/availability/create` - Create slot
- `GET /api/availability/educator/slots` - Get educator's slots
- `GET /api/availability/course/:courseId` - Get course available slots
- `PUT /api/availability/update/:slotId` - Update slot
- `DELETE /api/availability/delete/:slotId` - Delete slot

### Sessions
- `POST /api/session/request` - Request a session
- `GET /api/session/my-requests` - Get my requests
- `GET /api/session/educator/requests` - Get incoming requests
- `PUT /api/session/approve/:requestId` - Approve request
- `PUT /api/session/reject/:requestId` - Reject request
- `PUT /api/session/cancel/:requestId` - Cancel request

## Status Values

- **pending** - Request awaiting educator approval
- **approved** - Session confirmed with meeting link
- **rejected** - Request declined by educator
- **completed** - Session has finished
- **cancelled** - Request cancelled by student

---

For detailed implementation information, see [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md)
