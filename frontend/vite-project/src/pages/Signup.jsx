import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from "../assets/logo.jpeg";
import { IoEyeOutline, IoEye } from "react-icons/io5";
import { ClipLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import {useDispatch} from 'react-redux';
import {setUserData} from '../redux/userSlice';
import { Box, Button, TextField, Typography, ToggleButton, ToggleButtonGroup } from '@mui/material';
import styled from '@emotion/styled';

// Import premium fonts
import '@fontsource/poppins/400.css';
import '@fontsource/poppins/500.css';
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/700.css';

// Styled components for animated left panel
const AnimatedBackground = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: 
    linear-gradient(0deg, 
      rgba(0, 0, 0, 0.12) 1px, 
      transparent 1px
    ),
    linear-gradient(90deg, 
      rgba(0, 0, 0, 0.12) 1px, 
      transparent 1px
    );
  background-size: 50px 50px;
  background-position: 0 0;
  animation: gridMove 20s linear infinite;

  @keyframes gridMove {
    0% { background-position: 0 0; }
    100% { background-position: 50px 50px; }
  }

  &::before {
    content: '';
    position: absolute;
    width: 200px;
    height: 200px;
    background: linear-gradient(135deg, transparent 48%, rgba(0, 0, 0, 0.1) 49%, rgba(0, 0, 0, 0.1) 51%, transparent 52%);
    top: -50px;
    left: -50px;
    animation: floatTriangle1 15s ease-in-out infinite;
  }

  &::after {
    content: '';
    position: absolute;
    width: 150px;
    height: 150px;
    background: linear-gradient(-45deg, transparent 48%, rgba(0, 0, 0, 0.08) 49%, rgba(0, 0, 0, 0.08) 51%, transparent 52%);
    bottom: -30px;
    right: -30px;
    animation: floatTriangle2 18s ease-in-out infinite;
  }

  @keyframes floatTriangle1 {
    0%, 100% { transform: translate(0, 0) rotate(0deg); }
    50% { transform: translate(30px, 40px) rotate(180deg); }
  }

  @keyframes floatTriangle2 {
    0%, 100% { transform: translate(0, 0) rotate(0deg); }
    50% { transform: translate(-40px, -30px) rotate(-180deg); }
  }
`;

const GeometricShapes = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 1;

  .shape {
    position: absolute;
    opacity: 0.15;
  }

  .circle {
    border-radius: 50%;
    border: 2px solid rgba(0, 0, 0, 0.3);
  }

  .diamond {
    width: 60px;
    height: 60px;
    background: rgba(0, 0, 0, 0.1);
    transform: rotate(45deg);
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-radius: 4px;
    animation: floatDiamond 12s ease-in-out infinite;
  }

  .square {
    width: 50px;
    height: 50px;
    border: 2px solid rgba(0, 0, 0, 0.25);
    animation: floatSquare 10s ease-in-out infinite;
  }

  @keyframes floatDiamond {
    0%, 100% { transform: rotate(45deg) translateY(0); }
    50% { transform: rotate(45deg) translateY(30px); }
  }

  @keyframes floatSquare {
    0%, 100% { transform: translateX(0); }
    50% { transform: translateX(20px); }
  }

  @keyframes floatCircle {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(180deg); }
  }
`;

const CenteredLogo = styled.div`
  position: relative;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 150px;
  height: 150px;
  animation: logoFloat 4s ease-in-out infinite;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    filter: drop-shadow(0 10px 30px rgba(0, 0, 0, 0.1));
  }

  @keyframes logoFloat {
    0%, 100% { transform: translateY(0px) scale(1); }
    50% { transform: translateY(-15px) scale(1.05); }
  }
`;

function SignUp() {
  const [show, setShow] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch()
  

  const handleSignup = async() => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      toast.error('Please fill in all fields');
      return;
    }
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3000/api/auth/signup', {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: password,
        role
      }, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.status === 201 || response.status === 200) {
        toast.success('Signup successful! Redirecting to home...');
        dispatch(setUserData(response.data.user));
        setLoading(false);
        navigate('/');
      }
    } catch (error) {
      console.error('Signup error:', error.response?.data || error.message);
      setLoading(false);
      toast.error(error.response?.data?.message || 'Signup failed. Please try again.');
    }
  }
  return (
    <Box
      sx={{
        display: 'flex',
        width: '100vw',
        minHeight: '100vh',
        margin: 0,
        padding: 0,
        background: '#f5f5f2',
        fontFamily: "'Poppins', 'Segoe UI', sans-serif",
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Main Split Card Container */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          width: { xs: '95%', sm: '90%', md: '1000px' },
          maxWidth: '1100px',
          height: 'auto',
          minHeight: { xs: 'auto', md: '650px' },
          background: 'white',
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
          position: 'relative',
          zIndex: 1,
          margin: '40px auto',
          border: '1px solid #e0e0e0',
        }}
      >
        {/* Left Panel - Course Themed (Hidden on Mobile) */}
        <Box
          sx={{
            display: { xs: 'none', md: 'flex' },
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '60px 50px',
            background: '#ffffff',
            borderRadius: '20px 0 0 20px',
            position: 'relative',
            overflow: 'hidden',
            borderRight: '1px solid #e0e0e0',
          }}
        >
          <AnimatedBackground />
          
          <GeometricShapes>
            <div className="shape circle" style={{ width: '80px', height: '80px', top: '10%', left: '15%', animation: 'floatCircle 12s ease-in-out infinite' }} />
            <div className="shape diamond" style={{ top: '30%', right: '10%' }} />
            <div className="shape square" style={{ bottom: '20%', left: '20%' }} />
            <div className="shape circle" style={{ width: '60px', height: '60px', bottom: '10%', right: '15%', animation: 'floatCircle 10s ease-in-out infinite' }} />
            <div className="shape diamond" style={{ top: '60%', left: '10%', animation: 'floatDiamond 14s ease-in-out infinite 2s' }} />
            <div className="shape square" style={{ top: '15%', right: '20%', animation: 'floatSquare 11s ease-in-out infinite 1s' }} />
            <div className="shape circle" style={{ width: '50px', height: '50px', top: '50%', right: '25%', animation: 'floatCircle 13s ease-in-out infinite 1.5s' }} />
            <div className="shape diamond" style={{ bottom: '30%', right: '5%', animation: 'floatDiamond 15s ease-in-out infinite 3s' }} />
          </GeometricShapes>

          {/* Centered Logo with Animation */}
          <CenteredLogo>
            <img src={logo} alt="DevSkill Logo" />
          </CenteredLogo>

          {/* Left Panel Content */}
          <Box sx={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: '280px', marginTop: '30px' }}>
            <Typography
              sx={{
                fontSize: '32px',
                fontWeight: 700,
                color: '#000000',
                lineHeight: 1.3,
                marginBottom: '20px',
                letterSpacing: '-0.5px',
              }}
            >
              Master New Skills
            </Typography>
            <Typography
              sx={{
                fontSize: '15px',
                color: '#333333',
                fontWeight: 500,
                lineHeight: 1.6,
              }}
            >
              Learn from industry experts, get certified, and advance your career with world-class courses.
            </Typography>
          </Box>
        </Box>

        {/* Right Panel - Signup Form */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            padding: { xs: '40px 24px', sm: '50px 40px', md: '60px 50px' },
            background: '#ffffff',
            position: 'relative',
            borderLeft: { xs: 'none', md: '1px solid #e0e0e0' },
          }}
        >
          {/* Form Header */}
          <Box sx={{ marginBottom: '32px' }}>
            <Typography
              sx={{
                fontSize: { xs: '24px', sm: '28px' },
                fontWeight: 700,
                color: '#000000',
                marginBottom: '8px',
                letterSpacing: '-0.5px',
              }}
            >
              Join Now
            </Typography>
            <Typography
              sx={{
                fontSize: '13px',
                color: '#666666',
                fontWeight: 500,
              }}
            >
              Create your account and start your learning journey
            </Typography>
          </Box>

          {/* Full Name Input */}
          <TextField
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full Name"
            fullWidth
            variant="outlined"
            sx={{
              marginBottom: '16px',
              '& .MuiOutlinedInput-root': {
                fontSize: '14px',
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 500,
                height: '48px',
                backgroundColor: '#f8f9fa',
                '& fieldset': {
                  borderColor: '#e0e0e0',
                  borderRadius: '10px',
                  borderWidth: '1px',
                },
                '&:hover fieldset': {
                  borderColor: '#d0d0d0',
                },
                '&.Mui-focused': {
                  backgroundColor: '#ffffff',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#000000',
                  borderWidth: '2px',
                },
              },
              '& .MuiOutlinedInput-input::placeholder': {
                opacity: 0.6,
                color: '#999999',
              },
            }}
          />

          {/* Email Input */}
          <TextField
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Address"
            fullWidth
            variant="outlined"
            sx={{
              marginBottom: '16px',
              '& .MuiOutlinedInput-root': {
                fontSize: '14px',
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 500,
                height: '48px',
                backgroundColor: '#f8f9fa',
                '& fieldset': {
                  borderColor: '#e0e0e0',
                  borderRadius: '10px',
                  borderWidth: '1px',
                },
                '&:hover fieldset': {
                  borderColor: '#d0d0d0',
                },
                '&.Mui-focused': {
                  backgroundColor: '#ffffff',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#000000',
                  borderWidth: '2px',
                },
              },
              '& .MuiOutlinedInput-input::placeholder': {
                opacity: 0.6,
                color: '#999999',
              },
            }}
          />

          {/* Password Input */}
          <Box sx={{ position: 'relative', width: '100%', marginBottom: '20px' }}>
            <TextField
              id="password"
              type={show ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              fullWidth
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  fontSize: '14px',
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 500,
                  height: '48px',
                  backgroundColor: '#f8f9fa',
                  '& fieldset': {
                    borderColor: '#e0e0e0',
                    borderRadius: '10px',
                    borderWidth: '1px',
                  },
                  '&:hover fieldset': {
                    borderColor: '#d0d0d0',
                  },
                  '&.Mui-focused': {
                    backgroundColor: '#ffffff',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#000000',
                    borderWidth: '2px',
                  },
                },
                '& .MuiOutlinedInput-input::placeholder': {
                  opacity: 0.6,
                  color: '#999999',
                },
              }}
            />
            <Box
              onClick={() => setShow((prev) => !prev)}
              sx={{
                position: 'absolute',
                right: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                cursor: 'pointer',
                color: '#999',
                fontSize: '18px',
                display: 'flex',
                alignItems: 'center',
                transition: 'color 0.3s ease',
                '&:hover': {
                  color: '#000',
                }
              }}
            >
              {show ? <IoEyeOutline /> : <IoEye />}
            </Box>
          </Box>

          {/* Role Toggle Buttons */}
          <ToggleButtonGroup
            value={role}
            exclusive
            onChange={(e, newRole) => {
              if (newRole !== null) setRole(newRole);
            }}
            fullWidth
            sx={{
              gap: '12px',
              width: '100%',
              marginBottom: '28px',
              '& .MuiToggleButton-root': {
                flex: 1,
                padding: '12px 16px',
                fontSize: '14px',
                fontWeight: 600,
                border: '2px solid #e0e0e0',
                borderRadius: '10px',
                textTransform: 'none',
                fontFamily: "'Poppins', sans-serif",
                color: '#666666',
                backgroundColor: '#fafafa',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  backgroundColor: '#f5f5f5',
                  borderColor: '#d0d0d0',
                },
              },
              '& .Mui-selected': {
                backgroundColor: '#000000 !important',
                color: '#ffffff !important',
                borderColor: '#000000 !important',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                '&:hover': {
                  boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2)',
                },
              },
            }}
          >
            <ToggleButton value="student">Student</ToggleButton>
            <ToggleButton value="educator">Educator</ToggleButton>
          </ToggleButtonGroup>

          {/* Sign Up Button */}
          <Button
            onClick={handleSignup}
            disabled={loading}
            fullWidth
            sx={{
              backgroundColor: '#000000',
              color: '#ffffff',
              padding: '14px 0',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '15px',
              textTransform: 'none',
              fontFamily: "'Poppins', sans-serif",
              marginBottom: '16px',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              height: '50px',
              letterSpacing: '0.5px',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              '&:hover:not(:disabled)': {
                backgroundColor: '#1a1a1a',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
                transform: 'translateY(-2px)',
              },
              '&:disabled': {
                backgroundColor: '#e0e0e0',
                color: '#999',
                cursor: 'not-allowed',
              },
            }}
          >
            {loading ? <ClipLoader color="#000" size={18} /> : 'SIGN ME UP!'}
          </Button>

          {/* Login Link */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography sx={{ fontSize: '13px', color: '#666' }}>
              Already have an account?{' '}
              <Typography
                component="span"
                onClick={() => navigate('/login')}
                sx={{
                  color: '#000000',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                Log In
              </Typography>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default SignUp;