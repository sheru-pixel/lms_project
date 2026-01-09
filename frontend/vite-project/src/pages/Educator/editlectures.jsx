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
  const [notesFile, setNotesFile] = useState(null)
  const [notesFileName, setNotesFileName] = useState('')
  const [taskFile, setTaskFile] = useState(null)
  const [taskFileName, setTaskFileName] = useState('')
  const [resourceFile, setResourceFile] = useState(null)
  const [resourceTitle, setResourceTitle] = useState('')
  const [uploadingNotes, setUploadingNotes] = useState(false)
  const [uploadingTask, setUploadingTask] = useState(false)
  const [uploadingResource, setUploadingResource] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    videoUrl: '',
    isPreviewfree: false,
    lectureNotes: '',
    taskPdf: '',
    resources: []
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
          isPreviewfree: lecture.isPreviewfree || false,
          lectureNotes: lecture.lectureNotes || '',
          taskPdf: lecture.taskPdf || '',
          resources: lecture.resources || []
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

  const handleNotesChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setNotesFile(file)
      setNotesFileName(file.name)
      setError('')
    }
  }

  const handleTaskChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setTaskFile(file)
      setTaskFileName(file.name)
      setError('')
    }
  }

  const handleResourceChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setResourceFile(file)
      setError('')
    }
  }

  const handleUploadNotes = async () => {
    if (!notesFile) {
      setError('Please select a notes file')
      return
    }

    try {
      setUploadingNotes(true)
      const notesFormData = new FormData()
      notesFormData.append('notes', notesFile)

      const response = await axios.post(
        `http://localhost:3000/api/course/${courseId}/lecture/upload-notes/${lectureId}`,
        notesFormData,
        { withCredentials: true }
      )

      setFormData(prev => ({
        ...prev,
        lectureNotes: response.data.lectureNotes
      }))
      setNotesFile(null)
      setNotesFileName('')
      setSuccess('Lecture notes uploaded successfully!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload notes')
    } finally {
      setUploadingNotes(false)
    }
  }

  const handleUploadTask = async () => {
    if (!taskFile) {
      setError('Please select a task file')
      return
    }

    try {
      setUploadingTask(true)
      const taskFormData = new FormData()
      taskFormData.append('task', taskFile)

      const response = await axios.post(
        `http://localhost:3000/api/course/${courseId}/lecture/upload-task/${lectureId}`,
        taskFormData,
        { withCredentials: true }
      )

      setFormData(prev => ({
        ...prev,
        taskPdf: response.data.taskPdf
      }))
      setTaskFile(null)
      setTaskFileName('')
      setSuccess('Task uploaded successfully!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload task')
    } finally {
      setUploadingTask(false)
    }
  }

  const handleUploadResource = async () => {
    if (!resourceFile || !resourceTitle.trim()) {
      setError('Please select a file and enter a resource title')
      return
    }

    try {
      setUploadingResource(true)
      const resourceFormData = new FormData()
      resourceFormData.append('resource', resourceFile)
      resourceFormData.append('resourceTitle', resourceTitle)

      const response = await axios.post(
        `http://localhost:3000/api/course/${courseId}/lecture/${lectureId}/upload-resource`,
        resourceFormData,
        { withCredentials: true }
      )

      setFormData(prev => ({
        ...prev,
        resources: [...prev.resources, response.data.resource]
      }))
      setResourceFile(null)
      setResourceTitle('')
      setSuccess('Resource uploaded successfully!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload resource')
    } finally {
      setUploadingResource(false)
    }
  }

  const handleDeleteResource = async (index) => {
    try {
      await axios.delete(
        `http://localhost:3000/api/course/${courseId}/lecture/${lectureId}/delete-resource/${index}`,
        { withCredentials: true }
      )

      setFormData(prev => ({
        ...prev,
        resources: prev.resources.filter((_, i) => i !== index)
      }))
      setSuccess('Resource deleted successfully!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete resource')
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

            {/* Lecture Notes Upload */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#333',
                marginBottom: '8px'
              }}>
                📄 Lecture Notes (PDF)
              </label>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '15px'
              }}>
                <label style={{
                  padding: '10px 20px',
                  backgroundColor: '#667eea',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'background-color 0.3s ease'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#5568d3'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#667eea'}
                >
                  Choose File
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleNotesChange}
                    style={{ display: 'none' }}
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
                  {notesFileName || (formData.lectureNotes ? '✓ Notes uploaded' : 'No file chosen')}
                </span>
                {notesFile && (
                  <button
                    type="button"
                    onClick={handleUploadNotes}
                    disabled={uploadingNotes}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#28a745',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: uploadingNotes ? 'not-allowed' : 'pointer',
                      fontSize: '13px',
                      fontWeight: '600',
                      opacity: uploadingNotes ? 0.6 : 1
                    }}
                    onMouseEnter={(e) => !uploadingNotes && (e.target.style.backgroundColor = '#218838')}
                    onMouseLeave={(e) => !uploadingNotes && (e.target.style.backgroundColor = '#28a745')}
                  >
                    {uploadingNotes ? 'Uploading...' : 'Upload'}
                  </button>
                )}
              </div>
            </div>

            {/* Task PDF Upload */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#333',
                marginBottom: '8px'
              }}>
                ✅ Task PDF
              </label>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '15px'
              }}>
                <label style={{
                  padding: '10px 20px',
                  backgroundColor: '#667eea',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'background-color 0.3s ease'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#5568d3'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#667eea'}
                >
                  Choose File
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleTaskChange}
                    style={{ display: 'none' }}
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
                  {taskFileName || (formData.taskPdf ? '✓ Task uploaded' : 'No file chosen')}
                </span>
                {taskFile && (
                  <button
                    type="button"
                    onClick={handleUploadTask}
                    disabled={uploadingTask}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#28a745',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: uploadingTask ? 'not-allowed' : 'pointer',
                      fontSize: '13px',
                      fontWeight: '600',
                      opacity: uploadingTask ? 0.6 : 1
                    }}
                    onMouseEnter={(e) => !uploadingTask && (e.target.style.backgroundColor = '#218838')}
                    onMouseLeave={(e) => !uploadingTask && (e.target.style.backgroundColor = '#28a745')}
                  >
                    {uploadingTask ? 'Uploading...' : 'Upload'}
                  </button>
                )}
              </div>
            </div>

            {/* Resources Upload */}
            <div style={{ marginBottom: '25px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#333',
                marginBottom: '8px'
              }}>
                📎 Additional Resources
              </label>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                <input
                  type="text"
                  placeholder="Resource title (e.g., Extra Reading)"
                  value={resourceTitle}
                  onChange={(e) => setResourceTitle(e.target.value)}
                  style={{
                    padding: '12px 15px',
                    fontSize: '14px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '8px',
                    fontFamily: "'Poppins', sans-serif",
                    boxSizing: 'border-box'
                  }}
                />
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px'
                }}>
                  <label style={{
                    padding: '10px 20px',
                    backgroundColor: '#667eea',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                    transition: 'background-color 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#5568d3'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#667eea'}
                  >
                    Choose File
                    <input
                      type="file"
                      onChange={handleResourceChange}
                      style={{ display: 'none' }}
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
                    {resourceFile ? resourceFile.name : 'No file chosen'}
                  </span>
                  {resourceFile && (
                    <button
                      type="button"
                      onClick={handleUploadResource}
                      disabled={uploadingResource || !resourceTitle.trim()}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: (uploadingResource || !resourceTitle.trim()) ? 'not-allowed' : 'pointer',
                        fontSize: '13px',
                        fontWeight: '600',
                        opacity: (uploadingResource || !resourceTitle.trim()) ? 0.6 : 1
                      }}
                      onMouseEnter={(e) => !(uploadingResource || !resourceTitle.trim()) && (e.target.style.backgroundColor = '#218838')}
                      onMouseLeave={(e) => !(uploadingResource || !resourceTitle.trim()) && (e.target.style.backgroundColor = '#28a745')}
                    >
                      {uploadingResource ? 'Uploading...' : 'Upload'}
                    </button>
                  )}
                </div>

                {/* Resources List */}
                {formData.resources && formData.resources.length > 0 && (
                  <div style={{
                    marginTop: '12px',
                    padding: '12px',
                    backgroundColor: '#f9f9f9',
                    borderRadius: '8px',
                    border: '1px solid #e0e0e0'
                  }}>
                    <p style={{
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#666',
                      margin: '0 0 12px 0'
                    }}>
                      Uploaded Resources:
                    </p>
                    {formData.resources.map((resource, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '10px 12px',
                          backgroundColor: '#fff',
                          border: '1px solid #e0e0e0',
                          borderRadius: '6px',
                          marginBottom: '8px'
                        }}
                      >
                        <span style={{ fontSize: '14px', color: '#333' }}>
                          📎 {resource.title}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleDeleteResource(idx)}
                          style={{
                            padding: '5px 10px',
                            backgroundColor: '#dc3545',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontWeight: '600'
                          }}
                          onMouseEnter={(e) => e.target.style.backgroundColor = '#c82333'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = '#dc3545'}
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
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
