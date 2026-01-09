# Educator Quiz Management - User Guide

## Where to Add/Edit Quizzes

### Step 1: Go to Educator Dashboard
Navigate to `/educator/courses` or click **"Courses"** in the educator navigation menu.

### Step 2: Find Your Course
In the "All Created Courses" list, find the course you want to add a quiz to.

### Step 3: Click the "📝 Quiz" Button
In the action column on the right side of each course row, you'll see two buttons:
- **✏️** (Edit course details)
- **📝 Quiz** (Add/manage quiz) ← Click this one

### Step 4: Add Quiz Questions

The quiz editor allows you to:

#### Add Questions
- Click **"Add Question"** button to add more questions (max 10)
- Remove questions with the **"Delete"** button if you have more than 1

#### For Each Question:
1. **Question Text** - Enter the question (required)
2. **Options** - Enter 4 multiple choice options
3. **Mark Correct Answer** - Click the radio button to mark which option is correct
4. **Explanation** - Explain why the correct answer is right (helps students learn)

#### Set Passing Score
- At the top of the form, set the required passing score (default: 7 out of 10)
- Students need this score to earn the certificate

### Step 5: Save Quiz
- Click **"Save Quiz"** button to submit
- You'll see a success message
- You can edit the quiz anytime by returning to this page

---

## Requirements for a Valid Quiz

✅ **Must have exactly 10 questions**
✅ **Each question must have:**
   - Question text
   - 4 options with text
   - One option marked as correct
   - Explanation (why the answer is correct)

---

## Example: Adding a Quiz Question

```
Question Text: "What is the capital of France?"

Option 1: "London" (not selected)
Option 2: "Paris" ✓ (selected as correct)
Option 3: "Berlin" (not selected)
Option 4: "Madrid" (not selected)

Explanation: "Paris has been the capital and largest city of France 
since the 12th century. It is located in the north-central part of 
the country along the Seine River."
```

---

## Features

### View Existing Quiz
If you already have a quiz for the course, it will load automatically when you open the editor. You can edit any question at any time.

### Add Multiple Questions
Start with one question and gradually build up to 10. You don't need to add all 10 at once.

### Mark Correct Answers Clearly
The correct option is highlighted in blue to make it clear which is the right answer when editing.

### Provide Educational Explanations
The explanation is shown to students after they submit the quiz, helping them learn from their mistakes.

---

## Student Quiz Flow

Once you save the quiz:

1. **Students can take the quiz** - They'll see all 10 questions in the course
2. **Auto-evaluation** - The system automatically scores their answers
3. **Certificate on Pass** - If they score ≥ passing score (7 by default), they get a certificate
4. **Download Certificate** - Students can download a PDF certificate of completion

---

## View Student Results

After students take the quiz, you can view:

### Go to Course Statistics
Navigate to `/api/quiz/course/:courseId/stats` (via API) to see:
- Total enrolled students
- Certificates issued
- Pass rate (%)
- Average score
- List of all certificates with student details

### View Detailed Results
Navigate to `/api/quiz/course/:courseId/results` (via API) to see:
- Each student's name and email
- Their quiz score
- Pass/fail status
- Certificate number (if they passed)
- Date they took the quiz

*(UI for this is coming soon)*

---

## Tips for Effective Quizzes

1. **Clear Questions** - Write questions that test understanding, not memorization
2. **Good Explanations** - Provide detailed explanations for learning
3. **Balanced Difficulty** - Mix easy and challenging questions
4. **Realistic Answers** - Make wrong options plausible but clearly incorrect
5. **Course Relevance** - Ensure questions match course content

---

## Troubleshooting

### "You don't have permission to create quiz for this course"
- You must be the course creator
- Ensure you're logged in as the educator who created the course

### "Quiz must have exactly 10 questions"
- You need exactly 10 questions
- Remove or add questions to reach 10

### "All questions must be answered"
- Fill in all fields:
  - Question text
  - All 4 option texts
  - Mark one option as correct
  - Explanation

### Quiz won't save
- Check that all 10 questions are complete
- Ensure one option per question is marked as correct
- Try refreshing and trying again

---

## Next Steps

1. ✅ Add quiz to your course
2. 📊 Monitor student quiz results
3. 🎓 Award certificates to passing students
4. 📈 Use results to improve your course content

Enjoy creating assessments for your students! 🎉
