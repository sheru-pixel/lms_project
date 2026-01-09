import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import { FiArrowLeft, FiPlus, FiTrash2, FiCheck } from 'react-icons/fi'
import '../../styles/CreateLecture.css'

function EditQuiz() {
  const navigate = useNavigate()
  const { courseId } = useParams()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [course, setCourse] = useState(null)
  const [passingScore, setPassingScore] = useState(7)
  const [questions, setQuestions] = useState([
    { questionNumber: 1, question: '', options: [
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
      { text: '', isCorrect: false }
    ], explanation: '' }
  ])

  // Fetch course and quiz data
  useEffect(() => {
    fetchCourseAndQuiz()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId])

  const fetchCourseAndQuiz = async () => {
    try {
      setLoading(true)
      
      // Fetch course
      const courseRes = await axios.get(
        `http://localhost:3000/api/course/getcourse/${courseId}`,
        { withCredentials: true }
      )
      setCourse(courseRes.data)

      // Try to fetch existing quiz
      try {
        const quizRes = await axios.get(
          `http://localhost:3000/api/quiz/course/${courseId}/quiz`,
          { withCredentials: true }
        )
        setQuestions(quizRes.data.questions)
        setPassingScore(quizRes.data.passingScore || 7)
      } catch (err) {
        // No quiz exists yet, that's fine
        if (err.response?.status !== 404) {
          console.error('Error fetching quiz:', err)
        }
      }
    } catch (err) {
      setError('Failed to load course data')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const updateQuestion = (idx, field, value) => {
    const newQuestions = [...questions]
    newQuestions[idx][field] = value
    setQuestions(newQuestions)
  }

  const updateOption = (qIdx, oIdx, field, value) => {
    const newQuestions = [...questions]
    newQuestions[qIdx].options[oIdx][field] = value
    setQuestions(newQuestions)
  }

  const addQuestion = () => {
    if (questions.length < 10) {
      setQuestions([
        ...questions,
        {
          questionNumber: questions.length + 1,
          question: '',
          options: [
            { text: '', isCorrect: false },
            { text: '', isCorrect: false },
            { text: '', isCorrect: false },
            { text: '', isCorrect: false }
          ],
          explanation: ''
        }
      ])
    }
  }

  const removeQuestion = (idx) => {
    if (questions.length > 1) {
      const newQuestions = questions.filter((_, i) => i !== idx).map((q, i) => ({
        ...q,
        questionNumber: i + 1
      }))
      setQuestions(newQuestions)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validation
    if (questions.length !== 10) {
      setError('Quiz must have exactly 10 questions')
      return
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i]
      if (!q.question.trim()) {
        setError(`Question ${i + 1} text is required`)
        return
      }
      if (q.options.some(opt => !opt.text.trim())) {
        setError(`Question ${i + 1}: All options must have text`)
        return
      }
      if (!q.options.some(opt => opt.isCorrect)) {
        setError(`Question ${i + 1}: Must mark one option as correct`)
        return
      }
      if (!q.explanation.trim()) {
        setError(`Question ${i + 1}: Explanation is required`)
        return
      }
    }

    try {
      setSubmitting(true)
      setError('')
      
      await axios.post(
        `http://localhost:3000/api/quiz/course/${courseId}/create`,
        { questions, passingScore },
        { withCredentials: true }
      )

      setSuccess('Quiz saved successfully!')
      setTimeout(() => {
        navigate(`/educator/courses`)
      }, 2000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save quiz')
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="create-lecture-container">
        <p style={{ textAlign: 'center', fontSize: '16px', color: '#666' }}>Loading...</p>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="create-lecture-container">
        <p style={{ textAlign: 'center', fontSize: '16px', color: '#d32f2f' }}>Course not found</p>
      </div>
    )
  }

  return (
    <div className="create-lecture-container" style={{ 
      paddingTop: '40px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%'
    }}>
      {/* Header */}
      <div className="create-lecture-header" style={{
        width: '100%',
        maxWidth: '900px',
        paddingLeft: '20px',
        paddingRight: '20px',
        boxSizing: 'border-box'
      }}>
        <button
          onClick={() => navigate(-1)}
          className="create-lecture-back-btn"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 16px',
            backgroundColor: '#f0f0f0',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            color: '#333'
          }}
        >
          <FiArrowLeft size={18} />
          Back
        </button>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#333', margin: '0 0 8px 0' }}>
            Quiz Management
          </h1>
          <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>
            {course.title}
          </p>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div style={{
          padding: '12px 16px',
          backgroundColor: '#ffebee',
          border: '1px solid #ef5350',
          borderRadius: '6px',
          color: '#c62828',
          fontWeight: '600',
          fontSize: '14px',
          marginBottom: '20px',
          width: '100%',
          maxWidth: '900px',
          boxSizing: 'border-box'
        }}>
          {error}
        </div>
      )}

      {success && (
        <div style={{
          padding: '12px 16px',
          backgroundColor: '#e8f5e9',
          border: '1px solid #66bb6a',
          borderRadius: '6px',
          color: '#2e7d32',
          fontWeight: '600',
          fontSize: '14px',
          marginBottom: '20px',
          width: '100%',
          maxWidth: '900px',
          boxSizing: 'border-box'
        }}>
          ✓ {success}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ 
        maxWidth: '900px',
        width: '100%',
        boxSizing: 'border-box',
        paddingLeft: '20px',
        paddingRight: '20px'
      }}>
        {/* Passing Score */}
        <div className="create-lecture-form-group" style={{ marginBottom: '30px' }}>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '600',
            color: '#333',
            marginBottom: '8px'
          }}>
            Passing Score (out of 10)
          </label>
          <input
            type="number"
            min="1"
            max="10"
            value={passingScore}
            onChange={(e) => setPassingScore(Math.min(10, Math.max(1, parseInt(e.target.value) || 1)))}
            style={{
              width: '100px',
              padding: '10px 12px',
              border: '2px solid #e0e0e0',
              borderRadius: '6px',
              fontSize: '14px',
              boxSizing: 'border-box'
            }}
          />
          <p style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
            Students need to score at least {passingScore} out of 10 to pass
          </p>
        </div>

        {/* Questions */}
        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#333', marginBottom: '20px' }}>
            Questions ({questions.length}/10)
          </h2>

          {questions.map((question, qIdx) => (
            <div
              key={qIdx}
              style={{
                padding: '20px',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                marginBottom: '20px',
                backgroundColor: '#fafafa'
              }}
            >
              {/* Question Header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px'
              }}>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#333', margin: 0 }}>
                  Question {qIdx + 1}
                </h3>
                {questions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeQuestion(qIdx)}
                    style={{
                      padding: '8px 12px',
                      backgroundColor: '#ffebee',
                      border: '1px solid #ef5350',
                      borderRadius: '6px',
                      color: '#d32f2f',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <FiTrash2 size={16} />
                    Delete
                  </button>
                )}
              </div>

              {/* Question Text */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#333',
                  marginBottom: '6px'
                }}>
                  Question Text *
                </label>
                <textarea
                  value={question.question}
                  onChange={(e) => updateQuestion(qIdx, 'question', e.target.value)}
                  placeholder="Enter the question"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '6px',
                    fontSize: '14px',
                    minHeight: '80px',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit',
                    resize: 'vertical'
                  }}
                />
              </div>

              {/* Options */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#333',
                  marginBottom: '10px'
                }}>
                  Options (Mark correct answer) *
                </label>
                {question.options.map((option, oIdx) => (
                  <div
                    key={oIdx}
                    style={{
                      display: 'flex',
                      gap: '12px',
                      alignItems: 'flex-start',
                      marginBottom: '10px'
                    }}
                  >
                    <input
                      type="radio"
                      name={`correct-${qIdx}`}
                      checked={option.isCorrect}
                      onChange={() => {
                        const newOptions = question.options.map((opt, i) => ({
                          ...opt,
                          isCorrect: i === oIdx
                        }))
                        updateQuestion(qIdx, 'options', newOptions)
                      }}
                      style={{
                        marginTop: '10px',
                        cursor: 'pointer',
                        width: '18px',
                        height: '18px'
                      }}
                    />
                    <input
                      type="text"
                      value={option.text}
                      onChange={(e) => updateOption(qIdx, oIdx, 'text', e.target.value)}
                      placeholder={`Option ${oIdx + 1}`}
                      style={{
                        flex: 1,
                        padding: '10px 12px',
                        border: `2px solid ${option.isCorrect ? '#667eea' : '#e0e0e0'}`,
                        borderRadius: '6px',
                        fontSize: '14px',
                        boxSizing: 'border-box',
                        backgroundColor: option.isCorrect ? '#f0f4ff' : '#fff'
                      }}
                    />
                    {option.isCorrect && (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '32px',
                        height: '32px',
                        backgroundColor: '#e8f5e9',
                        borderRadius: '6px',
                        color: '#4caf50',
                        fontSize: '16px',
                        fontWeight: '700'
                      }}>
                        <FiCheck size={18} />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Explanation */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#333',
                  marginBottom: '6px'
                }}>
                  Explanation (Why is the correct answer correct?) *
                </label>
                <textarea
                  value={question.explanation}
                  onChange={(e) => updateQuestion(qIdx, 'explanation', e.target.value)}
                  placeholder="Explain why the correct answer is right. This helps students learn."
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '6px',
                    fontSize: '14px',
                    minHeight: '60px',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit',
                    resize: 'vertical'
                  }}
                />
              </div>
            </div>
          ))}

          {/* Add Question Button */}
          {questions.length < 10 && (
            <button
              type="button"
              onClick={addQuestion}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px dashed #667eea',
                backgroundColor: '#f0f4ff',
                borderRadius: '6px',
                color: '#667eea',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#e8ecff'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f0f4ff'
              }}
            >
              <FiPlus size={18} />
              Add Question ({questions.length}/10)
            </button>
          )}
        </div>

        {/* Submit Buttons */}
        <div style={{
          display: 'flex',
          gap: '12px',
          justifyContent: 'flex-end',
          paddingTop: '20px',
          borderTop: '1px solid #e0e0e0'
        }}>
          <button
            type="button"
            onClick={() => navigate(-1)}
            style={{
              padding: '12px 24px',
              backgroundColor: '#f0f0f0',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              color: '#333'
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            style={{
              padding: '12px 24px',
              backgroundColor: '#667eea',
              border: 'none',
              borderRadius: '6px',
              cursor: submitting ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              color: '#fff',
              opacity: submitting ? 0.6 : 1
            }}
          >
            {submitting ? 'Saving...' : 'Save Quiz'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditQuiz
