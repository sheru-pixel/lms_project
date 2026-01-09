# Quiz & Certificate System Implementation

## Overview
Implemented a complete quiz and certificate system for the LMS platform. Students can now take a 10-question quiz and earn certificates upon passing (score ≥ 7/10).

## Features Implemented

### 1. Backend
- **Quiz Model** (`/backend/model/quizModel.js`)
  - Stores 10 questions with multiple choice options
  - Each question has explanations for learning
  - Configurable passing score (default: 7/10)

- **Certificate Model** (`/backend/model/certificateModel.js`)
  - Records student achievements with unique certificate numbers
  - Stores course name, student name, score, and issue date
  - Prevents duplicate certificates

- **Quiz Controller** (`/backend/contollers/quizController.js`)
  - `createQuiz()` - Create/update quiz for a course
  - `getQuiz()` - Retrieve quiz questions (without answers)
  - `submitQuiz()` - Evaluate answers and calculate score
  - `checkQuizStatus()` - Check if student has passed

- **Certificate Controller** (`/backend/contollers/certificateController.js`)
  - `generateCertificate()` - Create certificate after passing
  - `getCertificate()` - Retrieve certificate details
  - `downloadCertificate()` - Generate PDF certificate
  - `getUserCertificates()` - List all user's certificates

- **PDF Generation**
  - Using `pdfkit` library for professional certificate PDFs
  - Beautiful formatted certificate with decorative borders
  - Includes certificate number, student name, course name, score, and date

### 2. Frontend
- **QuizModal Component** (`/src/component/QuizModal.jsx`)
  - Shows all 10 questions with multiple choice options
  - Progress bar indicating completion
  - Previous/Next navigation
  - Prevents submission until all questions answered
  - Displays results with score and feedback
  - Shows "Download Certificate" button if passed

- **ViewCourse Integration** (`/src/pages/ViewCourse.jsx`)
  - Added "Assessment & Certification" section
  - "Take Quiz" button for enrolled students
  - Shows quiz status (passed/not passed)
  - "Download Certificate" button for passed students
  - Automatic certificate generation after passing quiz

### 3. API Endpoints
```
POST   /api/quiz/course/:courseId/create        - Create/update quiz
GET    /api/quiz/course/:courseId/quiz          - Get quiz questions
POST   /api/quiz/course/:courseId/submit        - Submit answers
GET    /api/quiz/course/:courseId/status        - Check quiz status
POST   /api/quiz/generate-certificate           - Generate certificate
GET    /api/quiz/certificate/:certificateId    - Get certificate details
GET    /api/quiz/download/:courseId             - Download certificate PDF
GET    /api/quiz/my-certificates                - List user's certificates
```

## How It Works

### Student Workflow
1. **Enroll in Course** → See "Assessment & Certification" section
2. **Take Quiz** → Click "Take Quiz" button
3. **Answer 10 Questions** → Answer all questions (progress tracked)
4. **Submit Answers** → System evaluates responses
5. **View Results** → See score and explanations for each question
6. **If Passed (7+/10)** → 
   - Certificate is automatically generated
   - Can download PDF certificate
   - Certificate includes unique number, date, and score
7. **Next Time** → Section shows "✓ Quiz Passed - Score: X/10" with download button

### Question Format
Each question has:
- Question text
- 4 multiple choice options
- One marked as correct
- Explanation for learning purposes

## Database
Sample quiz added to first course with 10 learning-focused questions:
- Learning goals
- Study planning
- Time management (Pomodoro)
- Active recall
- Note-taking
- Sleep and learning
- Spaced repetition
- Learning styles
- Metacognition
- Learning environment

## Customization
To add/update a quiz for a course, use the create endpoint:
```javascript
POST /api/quiz/course/:courseId/create
{
  "questions": [
    {
      "questionNumber": 1,
      "question": "Question text?",
      "options": [
        { "text": "Option 1", "isCorrect": false },
        { "text": "Option 2", "isCorrect": true },
        // ... more options
      ],
      "explanation": "Explanation text"
    },
    // ... 9 more questions
  ],
  "passingScore": 7
}
```

## Security
- Quiz answers (correct options) are hidden from frontend
- Certificate endpoints require authentication
- Only certificate owner can download their certificate
- One certificate per user per course

## Future Enhancements
- Create educator UI to add/edit quiz questions
- Quiz attempt history and statistics
- Certificate templates with logos/branding
- Email certificate to students
- Share certificate on social media
- Quiz analytics for educators
