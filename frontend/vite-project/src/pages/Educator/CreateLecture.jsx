import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import { FiArrowLeft, FiEdit2, FiTrash2 } from 'react-icons/fi'
import '../../styles/CreateLecture.css'

function CreateLecture() {
  const navigate = useNavigate()
  const { courseId } = useParams()
  console.log('=== CreateLecture Component ===')
  console.log('courseId from URL params:', courseId)
  console.log('courseId type:', typeof courseId)
  console.log('courseId length:', courseId?.length)
  console.log('Full URL:', window.location.href)
  
  const [lectures, setLectures] = useState([])
  const [loading, setLoading] = useState(false)
  const [lecturesLoading, setLecturesLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  const [formData, setFormData] = useState({
    title: ''
  })

  const fetchLectures = useCallback(async () => {
    try {
      setLecturesLoading(true)
      const response = await axios.get(
        `http://localhost:3000/api/course/${courseId}/lectures`,
        { withCredentials: true }
      )
      setLectures(response.data || [])
    } catch (err) {
      console.error('Error fetching lectures:', err)
      setLectures([])
    } finally {
      setLecturesLoading(false)
    }
  }, [courseId])

  // Fetch lectures on mount
  useEffect(() => {
    if (courseId) {
      fetchLectures()
    }
  }, [courseId, fetchLectures])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError('')
    setSuccess('')
  }

  const handleCreateLecture = async (e) => {
    e.preventDefault()
    
    if (!formData.title.trim()) {
      setError('Lecture title is required')
      return
    }

    try {
      setLoading(true)
      setError('')
      
      console.log('Creating lecture with courseId:', courseId)
      
      await axios.post(
        `http://localhost:3000/api/course/${courseId}/lecture/create`,
        {
          title: formData.title
        },
        { withCredentials: true }
      )
      
      setSuccess('Lecture created successfully!')
      setFormData({ title: '' })
      
      // Refresh lectures list
      setTimeout(() => {
        fetchLectures()
        setSuccess('')
      }, 1000)
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to create lecture'
      setError(errorMsg)
      console.error('Error creating lecture:')
      console.error('Status:', err.response?.status)
      console.error('Message:', errorMsg)
      console.error('Full error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteLecture = async (lectureId) => {
    if (window.confirm('Are you sure you want to delete this lecture?')) {
      try {
        await axios.delete(
          `http://localhost:3000/api/course/${courseId}/lecture/delete/${lectureId}`,
          { withCredentials: true }
        )
        setSuccess('Lecture deleted successfully!')
        setTimeout(() => {
          fetchLectures()
          setSuccess('')
        }, 1000)
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete lecture')
        console.error('Error deleting lecture:', err)
      }
    }
  }

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      padding: '40px 20px',
      fontFamily: "'Poppins', sans-serif"
    }}>
      <div style={{
        maxWidth: '900px',
        margin: '0 auto'
      }}>
        {/* Header with Back Button */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '15px',
          marginBottom: '30px'
        }}>
          <button
            onClick={() => navigate(`/educator/edit-course/${courseId}`)}
            style={{
              backgroundColor: 'white',
              border: '2px solid #ddd',
              padding: '10px 20px',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
              fontWeight: '600',
              color: '#333',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
          >
            <FiArrowLeft /> Back to Course
          </button>
        </div>

        {/* Create Lecture Form */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '15px',
          padding: '40px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          marginBottom: '30px'
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#1a1a1a',
            marginBottom: '10px'
          }}>
            Let's Add a Lecture
          </h2>
          <p style={{
            fontSize: '14px',
            color: '#666',
            marginBottom: '25px',
            lineHeight: '1.6'
          }}>
            Enter the title and add your video lectures to enhance your course content.
          </p>

          {error && (
            <div style={{
              backgroundColor: '#fee',
              color: '#c33',
              padding: '12px 15px',
              borderRadius: '8px',
              marginBottom: '20px',
              fontSize: '14px',
              border: '1px solid #fcc'
            }}>
              {error}
            </div>
          )}

          {success && (
            <div style={{
              backgroundColor: '#efe',
              color: '#3c3',
              padding: '12px 15px',
              borderRadius: '8px',
              marginBottom: '20px',
              fontSize: '14px',
              border: '1px solid #cfc'
            }}>
              {success}
            </div>
          )}

          <form onSubmit={handleCreateLecture}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#333',
                marginBottom: '8px'
              }}>
                Lecture Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g. Introduction to HTML"
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  fontSize: '14px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  fontFamily: "'Poppins', sans-serif",
                  boxSizing: 'border-box',
                  transition: 'border-color 0.3s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = '#4CAF50'}
                onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
              />
            </div>

            <div style={{
              display: 'flex',
              gap: '15px',
              flexWrap: 'wrap'
            }}>
              <button
                type="button"
                onClick={() => navigate(`/educator/edit-course/${courseId}`)}
                style={{
                  padding: '12px 30px',
                  fontSize: '14px',
                  fontWeight: '600',
                  backgroundColor: 'white',
                  color: '#333',
                  border: '2px solid #ddd',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#f5f5f5'
                  e.target.style.borderColor = '#999'
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'white'
                  e.target.style.borderColor = '#ddd'
                }}
              >
                Back to Course
              </button>
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '12px 30px',
                  fontSize: '14px',
                  fontWeight: '600',
                  backgroundColor: '#1a1a1a',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.6 : 1,
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = '#333')}
                onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = '#1a1a1a')}
              >
                {loading ? 'Creating...' : '+ Create Lecture'}
              </button>
            </div>
          </form>
        </div>

        {/* Lectures List */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '15px',
          padding: '30px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
        }}>
          <h3 style={{
            fontSize: '20px',
            fontWeight: '700',
            color: '#1a1a1a',
            marginBottom: '20px'
          }}>
            Your Lectures
          </h3>

          {lecturesLoading ? (
            <p style={{ color: '#999', textAlign: 'center', padding: '20px' }}>
              Loading lectures...
            </p>
          ) : lectures && lectures.length > 0 ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              {lectures.map((lecture, index) => (
                <div
                  key={lecture._id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '15px',
                    backgroundColor: '#f9f9f9',
                    borderRadius: '8px',
                    border: '1px solid #eee',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f0f0f0'
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#f9f9f9'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  <div>
                    <p style={{
                      margin: '0 0 5px 0',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#1a1a1a'
                    }}>
                      Lecture {index + 1} - {lecture.title}
                    </p>
                    <p style={{
                      margin: '0',
                      fontSize: '12px',
                      color: '#999'
                    }}>
                      {lecture.videoUrl ? 'Video added' : 'No video yet'} • {lecture.isPreviewfree ? 'Free preview' : 'Premium'}
                    </p>
                  </div>
                  <div style={{
                    display: 'flex',
                    gap: '10px'
                  }}>
                    <button
                      onClick={() => navigate(`/educator/course/${courseId}/lecture/${lecture._id}/edit`)}
                      style={{
                        padding: '8px 12px',
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        fontSize: '13px',
                        fontWeight: '600',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#45a049'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#4CAF50'}
                    >
                      <FiEdit2 size={16} /> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteLecture(lecture._id)}
                      style={{
                        padding: '8px 12px',
                        backgroundColor: '#f44336',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        fontSize: '13px',
                        fontWeight: '600',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#da190b'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#f44336'}
                    >
                      <FiTrash2 size={16} /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{
              color: '#999',
              textAlign: 'center',
              padding: '40px 20px',
              fontSize: '14px'
            }}>
              No lectures yet. Create one above to get started!
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default CreateLecture
