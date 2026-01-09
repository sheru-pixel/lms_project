import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'

function Dashboard() {
  const userData = useSelector((state) => state.user.userData)
  const navigate = useNavigate()

  const getUserInitials = (name) => {
    if (!name) return '?'
    const parts = name.trim().split(' ')
    return parts.map((part) => part[0]).join('').toUpperCase()
  }

  if (!userData) {
    return (
      <div style={{ width: '100%', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Poppins', sans-serif" }}>
        <h2 style={{ color: '#666' }}>Please log in to view your dashboard</h2>
      </div>
    )
  }

  const initials = getUserInitials(userData.name)

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      padding: '40px 20px',
      fontFamily: "'Poppins', sans-serif",
      marginTop: '80px'
    }}>
    <div style={{
        maxWidth: '900px',
        margin: '0 auto'
      }}>
        {/* Back Button */}
        <button 
          onClick={() => navigate('/')}
          style={{
            backgroundColor: '#f0f0f0',
            color: '#333',
            border: 'none',
            padding: '10px 16px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '500',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'background-color 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#e0e0e0'
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#f0f0f0'
          }}
          title="Go back to home"
        >
          <FiArrowLeft size={20} /> Back to Home
        </button>

        {/* Header Section */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '20px',
          padding: '40px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          display: 'flex',
          gap: '30px',
          alignItems: 'center',
          flexWrap: 'wrap'
        }}>
          {/* Profile Image/Icon */}
          <div style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            backgroundColor: '#4CAF50',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '56px',
            fontWeight: 'bold',
            boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)',
            border: '4px solid white',
            flexShrink: 0
          }}>
            {initials}
          </div>

          {/* Profile Info */}
          <div style={{ flex: 1, minWidth: '250px' }}>
            <h1 style={{
              fontSize: '28px',
              fontWeight: '700',
              color: '#1a1a1a',
              margin: '0 0 10px 0'
            }}>
              Welcome, {userData.name}
            </h1>
            
            <p style={{
              fontSize: '16px',
              color: '#666',
              margin: '5px 0',
              fontWeight: '500'
            }}>
              📚 Educator
            </p>

            <p style={{
              fontSize: '14px',
              color: '#888',
              margin: '10px 0 0 0',
              lineHeight: '1.6'
            }}>
              {userData.description || 'Welcome to your educator dashboard. Start creating courses and sharing knowledge with students.'}
            </p>
          </div>

          {/* Create Course Button */}
          <button
            onClick={() => navigate('/educator/courses')}
            style={{
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              padding: '12px 30px',
              fontSize: '16px',
              fontWeight: '600',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)',
              whiteSpace: 'nowrap'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#45a049'
              e.target.style.boxShadow = '0 6px 16px rgba(76, 175, 80, 0.4)'
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#4CAF50'
              e.target.style.boxShadow = '0 4px 12px rgba(76, 175, 80, 0.3)'
            }}
          >
             My Courses
          </button>

          {/* Availability Button */}
          <button
            onClick={() => navigate('/educator/availability')}
            style={{
              backgroundColor: '#2196F3',
              color: 'white',
              border: 'none',
              padding: '12px 30px',
              fontSize: '16px',
              fontWeight: '600',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 12px rgba(33, 150, 243, 0.3)',
              whiteSpace: 'nowrap'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#1976D2'
              e.target.style.boxShadow = '0 6px 16px rgba(33, 150, 243, 0.4)'
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#2196F3'
              e.target.style.boxShadow = '0 4px 12px rgba(33, 150, 243, 0.3)'
            }}
          >
             Manage Availability
          </button>

          {/* Session Requests Button */}
          <button
            onClick={() => navigate('/educator/session-requests')}
            style={{
              backgroundColor: '#FF9800',
              color: 'white',
              border: 'none',
              padding: '12px 30px',
              fontSize: '16px',
              fontWeight: '600',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 12px rgba(255, 152, 0, 0.3)',
              whiteSpace: 'nowrap'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#F57C00'
              e.target.style.boxShadow = '0 6px 16px rgba(255, 152, 0, 0.4)'
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#FF9800'
              e.target.style.boxShadow = '0 4px 12px rgba(255, 152, 0, 0.3)'
            }}
          >
             Session Requests
          </button>
        </div>

        {/* Stats Section */}
        <div style={{
          marginTop: '40px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '15px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#4CAF50', margin: '0 0 5px 0' }}>0</p>
            <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>Courses Created</p>
          </div>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '15px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#4CAF50', margin: '0 0 5px 0' }}>0</p>
            <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>Students Enrolled</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
