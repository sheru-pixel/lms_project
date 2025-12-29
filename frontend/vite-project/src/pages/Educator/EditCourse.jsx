import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import { FiArrowLeft, FiEdit2 } from 'react-icons/fi'
import '../../styles/EditCourse.css'

const TECH_CATEGORIES = [
  'Web Development',
  'Mobile Development',
  'Data Science',
  'Cloud Computing',
  'Cybersecurity'
]

const COURSE_LEVELS = [
  'Beginner',
  'Intermediate',
  'Advanced'
]

function EditCourse() {
  const navigate = useNavigate()
  const { courseId } = useParams()
  const [loading, setLoading] = useState(false)
  const [courseLoading, setCourseLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [thumbnail, setThumbnail] = useState(null)
  const [thumbnailPreview, setThumbnailPreview] = useState('')

  const [formData, setFormData] = useState({
    title: '',
    subTitle: '',
    description: '',
    category: '',
    level: '',
    price: '',
    isPublished: false
  })

  // Fetch course data on mount
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setCourseLoading(true)
        const response = await axios.get(
          `http://localhost:3000/api/course/getcourse/${courseId}`,
          { withCredentials: true }
        )
        const course = response.data
        setFormData({
          title: course.title || '',
          subTitle: course.subTitle || '',
          description: course.description || '',
          category: course.category || '',
          level: course.level || '',
          price: course.price || '',
          isPublished: course.isPublished || false
        })
        setThumbnailPreview(course.thumbnail || '')
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load course')
        console.error('Error fetching course:', err)
      } finally {
        setCourseLoading(false)
      }
    }

    fetchCourse()
  }, [courseId])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    setError('')
  }

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setThumbnail(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setThumbnailPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const validatePublish = () => {
    const errors = []
    if (!formData.title.trim()) errors.push('Title is required')
    if (!formData.category.trim()) errors.push('Category is required')
    if (!formData.subTitle.trim()) errors.push('Subtitle is required')
    if (!formData.description.trim()) errors.push('Description is required')
    if (!formData.level.trim()) errors.push('Course Level is required')
    if (!formData.price || formData.price <= 0) errors.push('Valid price is required')
    if (!thumbnailPreview) errors.push('Course thumbnail is required')
    
    if (errors.length > 0) {
      setError('Please fill in all required fields:\n• ' + errors.join('\n• '))
      return false
    }
    return true
  }

  const handlePublish = async () => {
    if (!validatePublish()) return

    try {
      setLoading(true)
      const data = new FormData()
      data.append('title', formData.title)
      data.append('subTitle', formData.subTitle)
      data.append('description', formData.description)
      data.append('category', formData.category)
      data.append('level', formData.level)
      data.append('price', formData.price)
      data.append('isPublished', true)
      if (thumbnail) {
        data.append('thumbnail', thumbnail)
      }

      const response = await axios.post(
        `http://localhost:3000/api/course/editcourse/${courseId}`,
        data,
        { 
          withCredentials: true,
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      )

      if (response.status === 200) {
        setFormData(prev => ({ ...prev, isPublished: true }))
        setSuccess('Course published successfully!')
        setTimeout(() => {
          navigate('/educator/courses')
        }, 1500)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to publish course')
      console.error('Error publishing course:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleUnpublish = async () => {
    try {
      setLoading(true)
      const data = new FormData()
      data.append('title', formData.title)
      data.append('subTitle', formData.subTitle)
      data.append('description', formData.description)
      data.append('category', formData.category)
      data.append('level', formData.level)
      data.append('price', formData.price)
      data.append('isPublished', false)
      if (thumbnail) {
        data.append('thumbnail', thumbnail)
      }

      const response = await axios.post(
        `http://localhost:3000/api/course/editcourse/${courseId}`,
        data,
        { 
          withCredentials: true,
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      )

      if (response.status === 200) {
        setFormData(prev => ({ ...prev, isPublished: false }))
        setSuccess('Course unpublished successfully!')
        setTimeout(() => {
          setSuccess('')
        }, 2000)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to unpublish course')
      console.error('Error unpublishing course:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.category.trim()) {
      setError('Title and Category are required')
      return
    }

    try {
      setLoading(true)
      const data = new FormData()
      data.append('title', formData.title)
      data.append('subTitle', formData.subTitle)
      data.append('description', formData.description)
      data.append('category', formData.category)
      data.append('level', formData.level)
      data.append('price', formData.price)
      data.append('isPublished', formData.isPublished)
      if (thumbnail) {
        data.append('thumbnail', thumbnail)
      }

      const response = await axios.post(
        `http://localhost:3000/api/course/editcourse/${courseId}`,
        data,
        { 
          withCredentials: true,
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      )

      if (response.status === 200) {
        setSuccess('Course updated successfully!')
        setThumbnail(null)
        setTimeout(() => {
          setSuccess('')
        }, 2000)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update course')
      console.error('Error updating course:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = async () => {
    if (window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      try {
        setLoading(true)
        const response = await axios.delete(
          `http://localhost:3000/api/course/remove/${courseId}`,
          { withCredentials: true }
        )

        if (response.status === 200) {
          setSuccess('Course deleted successfully!')
          setTimeout(() => {
            navigate('/educator/courses')
          }, 1500)
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete course')
        console.error('Error deleting course:', err)
      } finally {
        setLoading(false)
      }
    }
  }

  if (courseLoading) {
    return (
      <div className="edit-course-container">
        <div className="loading">Loading course details...</div>
      </div>
    )
  }

  return (
    <div className="edit-course-container">
      <div className="edit-course-header">
        <button className="btn-back" onClick={() => navigate('/educator/courses')}>
          <FiArrowLeft /> Add detail information regarding course
        </button>
        <button className="btn-lectures" onClick={() => navigate(`/educator/course/${courseId}/lectures`)}>
          Go to lectures page
        </button>
      </div>

      <div className="edit-course-content">
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <div className="course-form-card">
          <h2>Basic Course Information</h2>

          <div className="action-buttons">
            {formData.isPublished ? (
              <button 
                className="btn-unpublish"
                onClick={handleUnpublish}
                disabled={loading}
              >
                Unpublish Course
              </button>
            ) : (
              <button 
                className="btn-publish"
                onClick={handlePublish}
                disabled={loading}
              >
                Click to Publish
              </button>
            )}
            <button 
              className="btn-remove"
              onClick={handleRemove}
              disabled={loading}
            >
              Remove Course
            </button>
          </div>

          <form className="edit-course-form">
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Course Title"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="subTitle">Subtitle</label>
              <input
                type="text"
                id="subTitle"
                name="subTitle"
                value={formData.subTitle}
                onChange={handleInputChange}
                placeholder="Subtitle"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Course description"
                className="form-textarea"
                rows="5"
              ></textarea>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="form-input"
                >
                  <option value="">Select Category</option>
                  {TECH_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="level">Course Level</label>
                <select
                  id="level"
                  name="level"
                  value={formData.level}
                  onChange={handleInputChange}
                  className="form-input"
                >
                  <option value="">Select Level</option>
                  {COURSE_LEVELS.map((lvl) => (
                    <option key={lvl} value={lvl}>
                      {lvl}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="price">Price (USD)</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="0"
                  className="form-input"
                  min="0"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Course Thumbnail</label>
              <div className="thumbnail-upload">
                {thumbnailPreview ? (
                  <div className="thumbnail-preview">
                    <img src={thumbnailPreview} alt="Thumbnail preview" />
                    <label htmlFor="thumbnail-input" className="edit-icon">
                      <FiEdit2 />
                    </label>
                  </div>
                ) : (
                  <label htmlFor="thumbnail-input" className="thumbnail-placeholder">
                    <div className="placeholder-icon">📷</div>
                    <p>Click to upload thumbnail</p>
                  </label>
                )}
                <input
                  type="file"
                  id="thumbnail-input"
                  name="thumbnail"
                  onChange={handleThumbnailChange}
                  accept="image/*"
                  className="file-input"
                />
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn-cancel"
                onClick={() => navigate('/educator/courses')}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-save"
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EditCourse
