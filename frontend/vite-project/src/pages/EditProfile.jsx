import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { setUserData } from '../redux/userSlice'

function EditProfile() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user.userData)
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    description: user?.description || '',
    photoUrl: null
  })
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState(user?.photoUrl || null)

  const getUserInitials = (name) => {
    if (!name) return '?'
    const parts = name.trim().split(' ')
    return parts.map((part) => part[0]).join('').toUpperCase()
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData(prev => ({
        ...prev,
        photoUrl: file
      }))
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSaveChanges = async () => {
    if (!formData.name.trim()) {
      toast.error('Name is required')
      return
    }

    setLoading(true)
    try {
      const data = new FormData()
      data.append('name', formData.name)
      data.append('description', formData.description)
      if (formData.photoUrl instanceof File) {
        data.append('photoUrl', formData.photoUrl)
      }

      const response = await axios.post('http://localhost:3000/api/user/profile', data, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      if (response.status === 200) {
        dispatch(setUserData(response.data))
        toast.success('Profile updated successfully!')
        setTimeout(() => {
          navigate('/profile')
        }, 1000)
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error(error.response?.data?.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div style={{ width: '100%', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Poppins', sans-serif" }}>
        <h2 style={{ color: '#666' }}>Please log in to edit your profile</h2>
      </div>
    )
  }

  const initials = getUserInitials(formData.name)

  return (
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
        padding: '40px 60px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        maxWidth: '700px',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start'
      }}>
        {/* Header with Back Button and Title */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          marginBottom: '30px',
          position: 'relative'
        }}>
          <div 
            onClick={() => navigate(-1)}
            style={{
              cursor: 'pointer',
              fontSize: '24px',
              color: '#333',
              transition: 'transform 0.2s ease'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.2)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
          >
            ←
          </div>
          <h1 style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#1a1a1a',
            margin: '0',
            flex: 1,
            textAlign: 'center'
          }}>
            Edit Profile
          </h1>
          <div style={{ width: '24px' }}></div>
        </div>

        {/* Avatar Circle - Centered */}
        <div style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '30px'
        }}>
          <div style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            backgroundColor: '#4CAF50',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '50px',
            fontWeight: 'bold',
            boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)',
            border: '4px solid white',
            backgroundImage: preview ? `url(${preview})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            color: preview ? 'transparent' : 'white'
          }}>
            {!preview && initials}
          </div>
        </div>

        {/* Form Fields */}
        <div style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          {/* Select Avatar */}
          <div style={{
            display: 'flex',
            flexDirection: 'column'
          }}>
            <label style={{
              fontSize: '13px',
              fontWeight: '600',
              color: '#333',
              marginBottom: '8px',
              textTransform: 'capitalize'
            }}>
              Select Avatar
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{
                padding: '10px 12px',
                border: '1px solid #999',
                borderRadius: '6px',
                fontSize: '14px',
                fontFamily: "'Poppins', sans-serif",
                cursor: 'pointer'
              }}
            />
          </div>

          {/* UserName */}
          <div style={{
            display: 'flex',
            flexDirection: 'column'
          }}>
            <label style={{
              fontSize: '13px',
              fontWeight: '600',
              color: '#333',
              marginBottom: '8px'
            }}>
              UserName
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              style={{
                padding: '10px 12px',
                border: '1px solid #999',
                borderRadius: '6px',
                fontSize: '14px',
                fontFamily: "'Poppins', sans-serif",
                outline: 'none'
              }}
            />
          </div>

          {/* Email (Disabled) */}
          <div style={{
            display: 'flex',
            flexDirection: 'column'
          }}>
            <label style={{
              fontSize: '13px',
              fontWeight: '600',
              color: '#333',
              marginBottom: '8px'
            }}>
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              disabled
              style={{
                padding: '10px 12px',
                border: '1px solid #999',
                borderRadius: '6px',
                fontSize: '14px',
                fontFamily: "'Poppins', sans-serif",
                backgroundColor: '#f5f5f5',
                cursor: 'not-allowed',
                color: '#999'
              }}
            />
          </div>

          {/* Bio */}
          <div style={{
            display: 'flex',
            flexDirection: 'column'
          }}>
            <label style={{
              fontSize: '13px',
              fontWeight: '600',
              color: '#333',
              marginBottom: '8px'
            }}>
              Bio
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Tell us about yourself"
              style={{
                padding: '10px 12px',
                border: '1px solid #999',
                borderRadius: '6px',
                fontSize: '14px',
                fontFamily: "'Poppins', sans-serif",
                outline: 'none',
                minHeight: '100px',
                resize: 'vertical'
              }}
            />
          </div>
        </div>

        {/* Save Changes Button */}
        <button
          onClick={handleSaveChanges}
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px 32px',
            backgroundColor: loading ? '#999' : '#1a1a1a',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '15px',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            marginTop: '20px',
            letterSpacing: '0.5px'
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.target.style.backgroundColor = '#333'
              e.target.style.transform = 'translateY(-2px)'
              e.target.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.15)'
            }
          }}
          onMouseLeave={(e) => {
            if (!loading) {
              e.target.style.backgroundColor = '#1a1a1a'
              e.target.style.transform = 'translateY(0)'
              e.target.style.boxShadow = 'none'
            }
          }}
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}

export default EditProfile
