# One-on-One Live Session Feature - Implementation Guide

## Overview
A complete feature has been implemented allowing students to book one-on-one live sessions with course educators. Educators can set their availability slots, and students can request and confirm sessions.

## Backend Implementation

### 1. Database Models

#### AvailabilitySlot Model (`backend/model/availabilitySlotModel.js`)
Stores educator's available time slots for sessions.

**Fields:**
- `educator`: Reference to User (educator)
- `course`: Reference to Course
- `startTime`: DateTime of session start
- `endTime`: DateTime of session end
- `isBooked`: Boolean flag
- `bookedBy`: Reference to User (student who booked)
- `status`: Enum [available, booked, cancelled]
- `meetingLink`: Optional meeting URL
- `notes`: Additional notes

#### SessionRequest Model (`backend/model/sessionRequestModel.js`)
Tracks session booking requests and confirmations.

**Fields:**
- `student`: Reference to User
- `educator`: Reference to User
- `course`: Reference to Course
- `availabilitySlot`: Reference to AvailabilitySlot
- `status`: Enum [pending, approved, rejected, completed, cancelled]
- `requestMessage`: Student's message
- `rejectionReason`: Reason if rejected
- `sessionStartTime`: Session start time
- `sessionEndTime`: Session end time
- `meetingLink`: Session meeting URL
- `notes`: Additional notes

### 2. API Controllers

#### Availability Controller (`backend/contollers/availabilityController.js`)

**Endpoints:**
- `POST /create` - Educator creates availability slot
- `GET /educator/slots` - Educator views their slots
- `GET /course/:courseId` - Student views available slots for a course
- `PUT /update/:slotId` - Educator updates a slot
- `DELETE /delete/:slotId` - Educator deletes a slot

#### Session Request Controller (`backend/contollers/sessionRequestController.js`)

**Endpoints:**
- `POST /request` - Student requests a session
- `GET /educator/requests` - Educator views incoming requests
- `GET /my-requests` - Student views their requests
- `PUT /approve/:requestId` - Educator approves request
- `PUT /reject/:requestId` - Educator rejects request
- `PUT /cancel/:requestId` - Student cancels request
- `GET /detail/:requestId` - Get request details

### 3. API Routes

**Availability Routes** (`backend/route/availabilityRoute.js`)
```
POST   /api/availability/create
GET    /api/availability/educator/slots
GET    /api/availability/course/:courseId
PUT    /api/availability/update/:slotId
DELETE /api/availability/delete/:slotId
```

**Session Routes** (`backend/route/sessionRoute.js`)
```
POST   /api/session/request
GET    /api/session/educator/requests
GET    /api/session/my-requests
PUT    /api/session/approve/:requestId
PUT    /api/session/reject/:requestId
PUT    /api/session/cancel/:requestId
GET    /api/session/detail/:requestId
```

## Frontend Implementation

### 1. Custom Hooks

#### useGetAvailableSlots.js
Fetches available slots for a specific course.
```javascript
const { slots, loading, error } = useGetAvailableSlots(courseId);
```

#### useGetEducatorSlots.js
Fetches educator's availability slots.
```javascript
const { slots, loading, error, setSlots } = useGetEducatorSlots();
```

#### useGetStudentSessions.js
Fetches student's session requests.
```javascript
const { sessions, loading, error, setSessions } = useGetStudentSessions();
```

#### useGetEducatorSessionRequests.js
Fetches educator's incoming session requests.
```javascript
const { requests, loading, error, setRequests } = useGetEducatorSessionRequests();
```

### 2. Pages & Components

#### For Educators

**EducatorAvailability.jsx** (`src/pages/Educator/EducatorAvailability.jsx`)
- Create and manage availability slots
- Set start/end times for sessions
- Delete available slots
- View booking status

**Route:** `/educator/availability`

**EducatorSessionRequests.jsx** (`src/pages/Educator/EducatorSessionRequests.jsx`)
- View pending session requests
- Approve requests with meeting link and notes
- Reject requests with reason
- View approved and rejected requests

**Route:** `/educator/session-requests`

#### For Students

**BookSession.jsx** (`src/pages/BookSession.jsx`)
- Browse available time slots for a course
- View educator information
- Select a slot
- Send session request with optional message

**Route:** `/course/:courseId/book-session`

**MySessionRequests.jsx** (`src/pages/MySessionRequests.jsx`)
- View all session requests
- Filter by status (pending, approved, rejected, completed, cancelled)
- See meeting links for approved sessions
- Cancel pending/approved sessions

**Route:** `/session-requests`

### 3. Styling

All components have comprehensive CSS files with responsive design:
- `EducatorAvailability.css` - Availability management UI
- `EducatorSessionRequests.css` - Session requests management
- `BookSession.css` - Session booking interface
- `MySessionRequests.css` - Student session view

## User Workflow

### Educator Workflow
1. Navigate to `/educator/availability`
2. Click "Create New Slot"
3. Select a course
4. Set start and end time
5. Add optional notes
6. Click "Create Slot"
7. View all created slots with status
8. Navigate to `/educator/session-requests`
9. Review incoming requests
10. Approve with meeting link and optional notes
11. Or reject with reason

### Student Workflow
1. Navigate to enrolled course view
2. Click "Book a Session" button
3. View available time slots with educator info
4. Select preferred slot
5. Add optional message for educator
6. Click "Send Session Request"
7. Navigate to `/session-requests`
8. Track request status
9. Once approved, see meeting link and join session
10. Can cancel requests if needed

## Key Features

✅ **Educator Availability Management**
- Create time slots when available
- Delete unused slots
- Update slot details
- Set meeting links upon approval

✅ **Student Session Booking**
- Browse available slots
- View educator information
- Send requests with messages
- Track request status in real-time

✅ **Request Management**
- Educators approve/reject with feedback
- Students receive notifications
- Meeting links shared upon approval
- Ability to cancel requests

✅ **Data Integrity**
- Only enrolle students can book
- Educators control availability
- Status tracking (pending → approved → completed)
- Slot conflict prevention

✅ **Responsive Design**
- Mobile-friendly interfaces
- Adaptive layouts
- Accessible components

## Integration Steps

1. **Backend Routes** - Added to `index.js`:
   ```javascript
   import availabilityRouter from './route/availabilityRoute.js';
   import sessionRouter from './route/sessionRoute.js';
   
   app.use('/api/availability', availabilityRouter);
   app.use('/api/session', sessionRouter);
   ```

2. **Frontend Routes** - Updated `App.jsx`:
   ```javascript
   <Route path='/educator/availability' element={<EducatorAvailability />} />
   <Route path='/educator/session-requests' element={<EducatorSessionRequests />} />
   <Route path='/course/:courseId/book-session' element={<BookSession />} />
   <Route path='/session-requests' element={<MySessionRequests />} />
   ```

## Testing

### Test as Educator
1. Go to `/educator/availability`
2. Create a slot 1 hour from now
3. Go to `/educator/session-requests` (should be empty initially)

### Test as Student
1. Go to enrolled course
2. Click "Book Session" (route: `/course/{courseId}/book-session`)
3. Select available slot
4. Send request with message

### Test Approval
1. Switch to educator account
2. Go to `/educator/session-requests`
3. See student request
4. Approve with meeting link
5. Switch to student account
6. Go to `/session-requests`
7. See approved status with meeting link

## Future Enhancements

- Add calendar view for availability
- Email/notification system
- Automated reminder emails
- Video call integration (Zoom, Google Meet)
- Session recording capability
- Feedback/rating system
- Rescheduling functionality
- Recurring availability slots
- Time zone handling
- Payment integration for paid sessions

## Database Queries

All models are properly indexed for efficient querying:
- Find slots by educator and course
- Find requests by status
- Filter by date ranges
- Populate related documents automatically

## Security

- Authentication required for all operations
- Authorization checks (educator/student)
- Course enrollment verification
- Slot ownership verification

---

**Implementation Date:** January 2026
**Status:** Complete and Ready for Testing
