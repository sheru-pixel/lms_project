import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Nav from '../component/Nav'
import '../styles/Profile.css'

function Profile() {
  const navigate = useNavigate()
  const user = useSelector((state) => state.user.userData)

  // Get user initials for avatar
  const getUserInitials = (name) => {
    if (!name) return '?'
    const parts = name.trim().split(' ')
    return parts.map((part) => part[0]).join('').toUpperCase()
  }

  if (!user) {
    return (
      <div style={{ width: '100%', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Poppins', sans-serif" }}>
        <h2 style={{ color: '#666' }}>Please log in to view your profile</h2>
      </div>
    )
  }

  const initials = getUserInitials(user.name)

  return (
    <>
      <div style={{
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
        padding: '20px',
        fontFamily: "'Poppins', sans-serif"
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '20px',
          padding: '30px 60px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          maxWidth: '700px',
          width: '100%',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {/* Back Button - Inside Box */}
          <div 
            onClick={() => navigate(-1)}
            style={{
              alignSelf: 'flex-start',
              cursor: 'pointer',
              fontSize: '20px',
              color: '#333',
              transition: 'transform 0.2s ease',
              marginBottom: '16px'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.2)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
          >
            ←
          </div>

          {/* Avatar Circle */}
          <div style={{
            width: '110px',
            height: '110px',
            borderRadius: '50%',
            backgroundColor: '#4CAF50',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '48px',
            fontWeight: 'bold',
            margin: '0 auto 20px',
            boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)',
            border: '4px solid white'
          }}>
            {initials}
          </div>

          {/* User Name */}
          <h1 style={{
            fontSize: '26px',
            fontWeight: '700',
            color: '#1a1a1a',
            margin: '0 0 6px 0',
            letterSpacing: '-0.5px'
          }}>
            {user.name}
          </h1>

          {/* User Role */}
          <p style={{
            fontSize: '12px',
            fontWeight: '500',
            color: '#999',
            margin: '0 0 20px 0',
            textTransform: 'capitalize',
            letterSpacing: '0.5px'
          }}>
            {user.role}
          </p>

          {/* Divider */}
          <div style={{
            height: '1px',
            backgroundColor: '#e0e0e0',
            margin: '20px 0',
            width: '100%'
          }}></div>

          {/* Profile Info */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            margin: '20px 0',
            width: '100%'
          }}>
            {/* Email */}
            <div style={{
              textAlign: 'left'
            }}>
              <label style={{
                fontSize: '11px',
                fontWeight: '600',
                color: '#666',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                display: 'block',
                marginBottom: '4px'
              }}>
                Email
              </label>
              <p style={{
                fontSize: '13px',
                color: '#333',
                margin: 0,
                fontWeight: '500'
              }}>
                {user.email}
              </p>
            </div>

            {/* Bio */}
            <div style={{
              textAlign: 'left'
            }}>
              <label style={{
                fontSize: '11px',
                fontWeight: '600',
                color: '#666',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                display: 'block',
                marginBottom: '4px'
              }}>
                Bio
              </label>
              <p style={{
                fontSize: '13px',
                color: '#555',
                margin: 0,
                fontWeight: '500',
                minHeight: '16px'
              }}>
                {user.description || 'No bio added yet'}
              </p>
            </div>

            {/* Enrolled Courses */}
            <div style={{
              textAlign: 'left'
            }}>
              <label style={{
                fontSize: '11px',
                fontWeight: '600',
                color: '#666',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                display: 'block',
                marginBottom: '4px'
              }}>
                Enrolled Courses
              </label>
              <p style={{
                fontSize: '13px',
                color: '#333',
                margin: 0,
                fontWeight: '500'
              }}>
                {user.enrolledCourses?.length || 0}
              </p>
            </div>
          </div>

          {/* Divider */}
          <div style={{
            height: '1px',
            backgroundColor: '#e0e0e0',
            margin: '20px 0',
            width: '100%'
          }}></div>

          {/* Edit Profile Button */}
          <button
            onClick={() => navigate('/edit-profile')}
            style={{
              width: '100%',
              padding: '12px 32px',
              backgroundColor: '#1a1a1a',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              marginTop: '12px',
              letterSpacing: '0.5px'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#333'
              e.target.style.transform = 'translateY(-2px)'
              e.target.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.15)'
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#1a1a1a'
              e.target.style.transform = 'translateY(0)'
              e.target.style.boxShadow = 'none'
            }}
          >
            Edit Profile
          </button>
        </div>
      </div>
    </>
  )
}

export default Profile
