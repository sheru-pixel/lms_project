# Educator Quiz & Certificate Rights

## Overview
Educators now have proper permission controls for managing quizzes and viewing certificate statistics in their courses.

## Educator Permissions

### 1. Create/Edit Quiz
**Endpoint:** `POST /api/quiz/course/:courseId/create`

**Requirements:**
- User must be authenticated (isAuth middleware)
- User must be the course creator (verified against course.creator)
- Must provide exactly 10 questions

**Example Request:**
```javascript
POST /api/quiz/course/694cdb536eeea1434d0b86b3/create
Authorization: Bearer [JWT_TOKEN]
Content-Type: application/json

{
  "questions": [
    {
      "questionNumber": 1,
      "question": "Question text?",
      "options": [
        { "text": "Option 1", "isCorrect": false },
        { "text": "Option 2", "isCorrect": true },
        { "text": "Option 3", "isCorrect": false },
        { "text": "Option 4", "isCorrect": false }
      ],
      "explanation": "Explanation for learning"
    },
    // ... 9 more questions
  ],
  "passingScore": 7
}
```

**Response:**
```json
{
  "message": "Quiz created/updated successfully",
  "quiz": { /* quiz object */ }
}
```

**Permission Denied Response:**
```json
{
  "message": "You don't have permission to create quiz for this course"
}
```

### 2. View Certificate Statistics
**Endpoint:** `GET /api/quiz/course/:courseId/stats`

**Requirements:**
- User must be authenticated (isAuth middleware)
- User must be the course creator

**Response:**
```json
{
  "courseId": "694cdb536eeea1434d0b86b3",
  "courseName": "Course Title",
  "totalEnrolledStudents": 150,
  "certificatesIssued": 120,
  "passRate": 80,
  "averageScore": 7.8,
  "certificates": [
    {
      "_id": "...",
      "userId": {
        "_id": "...",
        "name": "Student Name",
        "email": "student@example.com"
      },
      "courseName": "Course Title",
      "quizScore": 8,
      "certificateNumber": "CERT-20260109-ABC123",
      "issuedDate": "2026-01-09T10:30:00Z"
    },
    // ... more certificates
  ]
}
```

**Statistics Provided:**
- Total enrolled students
- Total certificates issued
- Pass rate (percentage)
- Average score (out of 10)
- Detailed certificate list with student info

### 3. View Detailed Quiz Results
**Endpoint:** `GET /api/quiz/course/:courseId/results`

**Requirements:**
- User must be authenticated (isAuth middleware)
- User must be the course creator

**Response:**
```json
{
  "courseId": "694cdb536eeea1434d0b86b3",
  "courseName": "Course Title",
  "totalResults": 120,
  "results": [
    {
      "studentName": "Student Name",
      "studentEmail": "student@example.com",
      "studentId": "...",
      "score": 8,
      "totalQuestions": 10,
      "passingScore": 7,
      "passed": true,
      "certificateNumber": "CERT-20260109-ABC123",
      "issuedDate": "2026-01-09T10:30:00Z"
    },
    // ... more results
  ]
}
```

**Results Provided:**
- Student name and email
- Quiz score
- Pass/fail status
- Certificate number (if passed)
- Date issued

## Permission Checks Flow

```
Educator Action:
    ↓
Is user authenticated? (isAuth middleware)
    ├─ No → Return 401 Unauthorized
    └─ Yes ↓
Is courseId valid? (mongoose validation)
    ├─ No → Return 400 Bad Request
    └─ Yes ↓
Get course from database
    ├─ Not found → Return 404 Not Found
    └─ Found ↓
Is req.userId === course.creator? (permission check)
    ├─ No → Return 403 Forbidden
    └─ Yes ↓
Allow action (create quiz, view stats, etc.)
```

## API Summary Table

| Method | Endpoint | Auth | Permission | Purpose |
|--------|----------|------|------------|---------|
| POST | `/course/:courseId/create` | ✅ | Course Creator | Create/update quiz |
| GET | `/course/:courseId/stats` | ✅ | Course Creator | View certificate statistics |
| GET | `/course/:courseId/results` | ✅ | Course Creator | View detailed quiz results |

## Student Permissions (Unchanged)

Students can:
- ✅ Get quiz questions (no auth required) - `GET /course/:courseId/quiz`
- ✅ Submit quiz answers (auth required) - `POST /course/:courseId/submit`
- ✅ Check their quiz status (auth required) - `GET /course/:courseId/status`
- ✅ Generate their certificate (auth required) - `POST /generate-certificate`
- ✅ Download their certificate (auth required) - `GET /download/:courseId`
- ✅ View all their certificates (auth required) - `GET /my-certificates`

## Security Features

1. **Role-Based Access Control**: Only course creators can manage quizzes
2. **User Verification**: Permission check validates `req.userId` against `course.creator`
3. **Course Ownership**: Cannot create quizzes for courses you don't own
4. **No Data Leakage**: Students can only access their own certificates and quiz status
5. **Audit Trail**: All quiz and certificate data includes creation timestamps

## Future Enhancements

- [ ] Create editor UI for educators to add/edit quiz questions
- [ ] View quiz attempt history with detailed answer feedback
- [ ] Export quiz results as CSV
- [ ] Email results to students
- [ ] Send results to enrollment email
- [ ] Track which educators edited which quizzes
- [ ] Version control for quiz questions
