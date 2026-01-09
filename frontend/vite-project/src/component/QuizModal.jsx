import React, { useState, useEffect } from 'react'
import axios from 'axios'

function QuizModal({ courseId, onClose, onQuizComplete }) {
  const [quiz, setQuiz] = useState(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [results, setResults] = useState(null)
  const [showResults, setShowResults] = useState(false)

  useEffect(() => {
    fetchQuiz()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId])

  const fetchQuiz = async () => {
    try {
      setLoading(true)
      const response = await axios.get(
        `http://localhost:3000/api/quiz/course/${courseId}/quiz`,
        { withCredentials: true }
      )
      setQuiz(response.data)
      setSelectedAnswers(new Array(10).fill(null))
      setError('')
    } catch (err) {
      if (err.response?.status === 404) {
        setError('Quiz has not been created yet for this course. Please ask your instructor to set up the quiz.')
      } else {
        setError(err.response?.data?.message || 'Failed to load quiz')
      }
      console.error('Error fetching quiz:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectAnswer = (optionIndex) => {
    const newAnswers = [...selectedAnswers]
    newAnswers[currentQuestion] = optionIndex
    setSelectedAnswers(newAnswers)
  }

  const handleNextQuestion = () => {
    if (currentQuestion < 9) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmitQuiz = async () => {
    // Check if all questions are answered
    if (selectedAnswers.includes(null)) {
      setError('Please answer all questions before submitting')
      return
    }

    try {
      setSubmitting(true)
      const response = await axios.post(
        `http://localhost:3000/api/quiz/course/${courseId}/submit`,
        { answers: selectedAnswers },
        { withCredentials: true }
      )
      setResults(response.data)
      setShowResults(true)
      setError('')

      // If passed, generate certificate
      if (response.data.passed) {
        try {
          await axios.post(
            'http://localhost:3000/api/quiz/generate-certificate',
            { courseId, quizScore: response.data.score },
            { withCredentials: true }
          )
        } catch (certErr) {
          console.error('Error generating certificate:', certErr)
          // Don't block result display if certificate generation fails
        }
      }

      // Call callback to notify parent
      if (response.data.passed && onQuizComplete) {
        onQuizComplete(response.data)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit quiz')
      console.error('Error submitting quiz:', err)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '40px',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <p style={{ color: '#666', fontSize: '16px' }}>Loading quiz...</p>
        </div>
      </div>
    )
  }

  if (error && !showResults) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '40px',
          borderRadius: '12px',
          textAlign: 'center',
          maxWidth: '400px'
        }}>
          <p style={{ color: '#d32f2f', fontSize: '16px', marginBottom: '20px' }}>{error}</p>
          <button
            onClick={onClose}
            style={{
              padding: '10px 20px',
              backgroundColor: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600'
            }}
          >
            Close
          </button>
        </div>
      </div>
    )
  }

  if (showResults && results) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        overflow: 'auto',
        padding: '20px'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '40px',
          borderRadius: '12px',
          maxWidth: '600px',
          width: '100%'
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: results.passed ? '#28a745' : '#d32f2f',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            {results.passed ? '🎉 Quiz Passed!' : '❌ Quiz Failed'}
          </h2>

          <div style={{
            backgroundColor: '#f5f5f5',
            padding: '20px',
            borderRadius: '8px',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: '18px', fontWeight: '600', color: '#333', margin: '10px 0' }}>
              Your Score: <span style={{ color: '#667eea', fontSize: '24px' }}>{results.score}</span> / {results.totalQuestions}
            </p>
            <p style={{ fontSize: '14px', color: '#666', margin: '10px 0' }}>
              Passing Score: {results.passingScore}/{results.totalQuestions}
            </p>
          </div>

          {results.passed && (
            <div style={{
              backgroundColor: '#e8f5e9',
              border: '2px solid #4caf50',
              padding: '16px',
              borderRadius: '8px',
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              <p style={{ color: '#2e7d32', fontWeight: '600', margin: 0 }}>
                ✓ You have passed! You can now download your certificate.
              </p>
            </div>
          )}

          {!results.passed && (
            <div style={{
              backgroundColor: '#ffebee',
              border: '2px solid #f44336',
              padding: '16px',
              borderRadius: '8px',
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              <p style={{ color: '#c62828', fontWeight: '600', margin: 0 }}>
                You need to score at least {results.passingScore} to pass. Try again!
              </p>
            </div>
          )}

          <div style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'center'
          }}>
            <button
              onClick={onClose}
              style={{
                padding: '12px 24px',
                backgroundColor: '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600'
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!quiz || !quiz.questions) {
    return null
  }

  const question = quiz.questions[currentQuestion]

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        maxWidth: '700px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '20px',
          borderBottom: '1px solid #eee'
        }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: '700',
            color: '#333',
            margin: 0
          }}>
            Quiz: {quiz.courseId}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '28px',
              cursor: 'pointer',
              color: '#999'
            }}
          >
            ×
          </button>
        </div>

        {/* Progress Bar */}
        <div style={{
          padding: '20px',
          borderBottom: '1px solid #eee'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '10px',
            fontSize: '14px',
            fontWeight: '600',
            color: '#666'
          }}>
            <span>Question {currentQuestion + 1} of 10</span>
            <span>{Math.round(((currentQuestion + 1) / 10) * 100)}%</span>
          </div>
          <div style={{
            width: '100%',
            height: '8px',
            backgroundColor: '#e0e0e0',
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <div style={{
              height: '100%',
              backgroundColor: '#667eea',
              width: `${((currentQuestion + 1) / 10) * 100}%`,
              transition: 'width 0.3s ease'
            }}></div>
          </div>
        </div>

        {/* Question */}
        <div style={{
          padding: '30px'
        }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#333',
            marginBottom: '20px'
          }}>
            {question.question}
          </h3>

          {/* Options */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            {question.options.map((option, idx) => (
              <label
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '14px 16px',
                  border: `2px solid ${selectedAnswers[currentQuestion] === idx ? '#667eea' : '#e0e0e0'}`,
                  borderRadius: '8px',
                  backgroundColor: selectedAnswers[currentQuestion] === idx ? '#f0f4ff' : '#fff',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  if (selectedAnswers[currentQuestion] !== idx) {
                    e.currentTarget.style.borderColor = '#ddd'
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedAnswers[currentQuestion] !== idx) {
                    e.currentTarget.style.borderColor = '#e0e0e0'
                  }
                }}
              >
                <input
                  type="radio"
                  name={`question-${currentQuestion}`}
                  value={idx}
                  checked={selectedAnswers[currentQuestion] === idx}
                  onChange={() => handleSelectAnswer(idx)}
                  style={{
                    width: '18px',
                    height: '18px',
                    cursor: 'pointer'
                  }}
                />
                <span style={{
                  fontSize: '14px',
                  color: '#333',
                  fontWeight: '500'
                }}>
                  {option.text}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '20px',
          borderTop: '1px solid #eee',
          backgroundColor: '#f9f9f9'
        }}>
          <button
            onClick={handlePreviousQuestion}
            disabled={currentQuestion === 0}
            style={{
              padding: '10px 20px',
              backgroundColor: currentQuestion === 0 ? '#e0e0e0' : '#667eea',
              color: currentQuestion === 0 ? '#999' : '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: currentQuestion === 0 ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '600'
            }}
          >
            Previous
          </button>

          <span style={{
            fontSize: '14px',
            fontWeight: '600',
            color: '#666'
          }}>
            {currentQuestion + 1} / 10
          </span>

          {currentQuestion === 9 ? (
            <button
              onClick={handleSubmitQuiz}
              disabled={submitting || selectedAnswers.includes(null)}
              style={{
                padding: '10px 20px',
                backgroundColor: submitting || selectedAnswers.includes(null) ? '#e0e0e0' : '#28a745',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: submitting || selectedAnswers.includes(null) ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: '600'
              }}
            >
              {submitting ? 'Submitting...' : 'Submit Quiz'}
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              style={{
                padding: '10px 20px',
                backgroundColor: '#667eea',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600'
              }}
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default QuizModal
