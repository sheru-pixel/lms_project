import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { FiBook, FiArrowLeft } from 'react-icons/fi'
import useGetCreatorCourse from '../../customHooks/getCreatorCourse'
import '../../styles/Courses.css'

function Courses() {
  const navigate = useNavigate()
  
  useGetCreatorCourse()
  const creatorCourses = useSelector(state => state.course.creatorCourses)
  
  const handleEdit = (courseId) => {
    navigate(`/educator/edit-course/${courseId}`)
  }

  const handleQuiz = (courseId) => {
    navigate(`/educator/course/${courseId}/quiz`)
  }

  return (
    <div className="courses-container">
      <div className="courses-header">
        <div className="header-top">
          <button 
            className="btn-back" 
            onClick={() => navigate('/educator/dashboard')}
            title="Go back to dashboard"
          >
            <FiArrowLeft />
          </button>
          <h1>All Created Courses</h1>
        </div>
        <button className="btn-create-course" onClick={() => navigate('/educator/create-course')}>
          Create Course
        </button>
      </div>

      {creatorCourses && creatorCourses.length > 0 ? (
        <div className="courses-table-wrapper">
          <table className="courses-table">
            <thead>
              <tr>
                <th>Courses</th>
                <th>Price</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {creatorCourses.map((course) => (
                <tr key={course._id} className="course-row">
                  <td className="course-name-cell">
                    <div className="course-item">
                      {course.thumbnail ? (
                        <img 
                          src={course.thumbnail}
                          alt={course.title}
                          className="course-thumbnail"
                        />
                      ) : (
                        <div className="course-thumbnail-placeholder">
                          <FiBook />
                        </div>
                      )}
                      <span className="course-title">{course.title}</span>
                    </div>
                  </td>
                  <td className="price-cell">$ {course.price || 'NA'}</td>
                  <td className="status-cell">
                    <span className={`status-badge status-${course.isPublished ? 'published' : 'draft'}`}>
                      {course.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="action-cell" style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                    <button 
                      className="btn-edit"
                      onClick={() => handleEdit(course._id)}
                      title="Edit course"
                    >
                      ✏️
                    </button>
                    <button 
                      className="btn-edit"
                      onClick={() => handleQuiz(course._id)}
                      title="Manage quiz"
                      style={{
                        backgroundColor: '#667eea',
                        color: '#fff',
                        fontSize: '12px',
                        padding: '6px 12px',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: '600'
                      }}
                    >
                      📝 Quiz
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="no-courses-message">
          <p>A list of your recent courses.</p>
          <p className="empty-state">No courses created yet. <a href="/educator/create-course">Create your first course</a></p>
        </div>
      )}
    </div>
  )
}

export default Courses

