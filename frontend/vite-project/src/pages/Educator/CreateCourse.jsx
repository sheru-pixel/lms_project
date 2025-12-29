import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import '../../styles/CreateCourseForm.css'

const TECH_CATEGORIES = [
  'Web Development',
  'Mobile Development',
  'Data Science',
  'Cloud Computing',
  'Cybersecurity'
]

function CreateCourse() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: '',
    category: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!formData.title.trim() || !formData.category.trim()) {
      setError('Please fill in all fields')
      return
    }

    setLoading(true)
    try {
      const response = await axios.post(
        'http://localhost:3000/api/course/create',
        {
          title: formData.title,
          category: formData.category
        },
        { withCredentials: true }
      )

      if (response.status === 201) {
        setFormData({ title: '', category: '' })
        navigate('/educator/courses')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create course. Please try again.')
      console.error('Error creating course:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="create-course-container">
      <div className="create-course-card">
        <h1>Create New Course</h1>
        <p className="subtitle">Get started by providing basic information about your course</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="course-form">
          <div className="form-group">
            <label htmlFor="title">Course Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Complete HTML Course"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category *</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="form-input"
            >
              <option value="">Select a category</option>
              {TECH_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="form-actions">
            <button
              type="submit"
              disabled={loading}
              className="btn-submit"
            >
              {loading ? 'Creating...' : 'Create Course'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/educator/courses')}
              className="btn-cancel"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateCourse
