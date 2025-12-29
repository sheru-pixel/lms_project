import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import { FiArrowLeft, FiTrash2 } from 'react-icons/fi'
import '../../styles/EditLecture.css'

function EditLecture() {
  const navigate = useNavigate()
  const { courseId, lectureId } = useParams()
  const [loading, setLoading] = useState(false)
  const [lectureLoading, setLectureLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [videoFile, setVideoFile] = useState(null)
  const [videoFileName, setVideoFileName] = useState('')

  const [formData, setFormData] = useState({
    title: '',
    videoUrl: '',
    isPreviewfree: false
  })

  // Fetch lecture data on mount
  useEffect(() => {
    const fetchLecture = async () => {
      try {
        setLectureLoading(true)
        const response = await axios.get(
          `http://localhost:3000/api/course/${courseId}/lecture/${lectureId}`,
          { withCredentials: true }
        )
        const lecture = response.data
        setFormData({
          title: lecture.title || '',
          videoUrl: lecture.videoUrl || '',
          isPreviewfree: lecture.isPreviewfree || false
        })
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load lecture')
        console.error('Error fetching lecture:', err)
      } finally {
        setLectureLoading(false)
      }
    }

    fetchLecture()
  }, [lectureId, courseId])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    setError('')
  }

  const handleVideoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setVideoFile(file)
      setVideoFileName(file.name)
      setError('')
    }
  }

  const handleUpdateLecture = async (e) => {
    e.preventDefault()

    if (!formData.title.trim()) {
      setError('Lecture title is required')
      return
    }

    try {
      setLoading(true)
      setError('')

      const updateData = {
        title: formData.title,
        isPreviewfree: formData.isPreviewfree
      }

      // If new video file is selected, upload it
      if (videoFile) {
        const videoFormData = new FormData()
        videoFormData.append('video', videoFile)
        
        try {
          const uploadResponse = await axios.post(
            `http://localhost:3000/api/course/${courseId}/lecture/upload-video/${lectureId}`,
            videoFormData,
            {
              withCredentials: true,
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            }
          )
          updateData.videoUrl = uploadResponse.data.videoUrl
        } catch (uploadErr) {
          setError(uploadErr.response?.data?.message || 'Failed to upload video')
          setLoading(false)
          return
        }
      }

      await axios.post(
        `http://localhost:3000/api/course/${courseId}/lecture/edit/${lectureId}`,
        updateData,
        { withCredentials: true }
      )

      setSuccess('Lecture updated successfully!')
      setTimeout(() => {
        navigate(`/educator/course/${courseId}/lectures`)
      }, 1500)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update lecture')
      console.error('Error updating lecture:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteLecture = async () => {
    if (window.confirm('Are you sure you want to delete this lecture?')) {
      try {
        setLoading(true)
        await axios.delete(
          `http://localhost:3000/api/course/${courseId}/lecture/delete/${lectureId}`,
          { withCredentials: true }
        )
        setSuccess('Lecture deleted successfully!')
        setTimeout(() => {
          navigate(`/educator/course/${courseId}/lectures`)
        }, 1000)
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete lecture')
        console.error('Error deleting lecture:', err)
      } finally {
        setLoading(false)
      }
    }
  }

  if (lectureLoading) {
    return (
      <div style={{
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Poppins', sans-serif"
      }}>
        <p style={{ color: '#666' }}>Loading lecture...</p>
      </div>
    )
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
            onClick={() => navigate(`/educator/course/${courseId}/lectures`)}
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
            <FiArrowLeft /> Back to Lectures
          </button>
        </div>

        {/* Edit Lecture Form */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '15px',
          padding: '40px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '25px'
          }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#1a1a1a',
              margin: 0
            }}>
              Update Course Lecture
            </h2>
            <button
              onClick={handleDeleteLecture}
              disabled={loading}
              style={{
                padding: '10px 20px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                opacity: loading ? 0.6 : 1,
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = '#c82333')}
              onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = '#dc3545')}
            >
              <FiTrash2 size={16} /> Remove Lecture
            </button>
          </div>

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

          <form onSubmit={handleUpdateLecture}>
            {/* Title */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#333',
                marginBottom: '8px'
              }}>
                LectureTitle *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g. Installation to VS Code"
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

            {/* Video File Upload */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#333',
                marginBottom: '8px'
              }}>
                Video *
              </label>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '15px'
              }}>
                <label style={{
                  padding: '10px 20px',
                  backgroundColor: '#2c3e50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'background-color 0.3s ease'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#34495e'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#2c3e50'}
                >
                  Choose File
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoChange}
                    style={{
                      display: 'none'
                    }}
                  />
                </label>
                <span style={{
                  fontSize: '14px',
                  color: '#666',
                  flex: 1,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {videoFileName || formData.videoUrl || 'No file chosen'}
                </span>
              </div>
            </div>

            {/* Is Free Preview Checkbox */}
            <div style={{ marginBottom: '25px' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#333',
                cursor: 'pointer'
              }}>
                <input
                  type="checkbox"
                  name="isPreviewfree"
                  checked={formData.isPreviewfree}
                  onChange={handleInputChange}
                  style={{
                    width: '18px',
                    height: '18px',
                    cursor: 'pointer'
                  }}
                />
                Is this Video FREE
              </label>
            </div>

            {/* Update Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
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
              {loading ? 'Updating...' : 'Update Lecture'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EditLecture
