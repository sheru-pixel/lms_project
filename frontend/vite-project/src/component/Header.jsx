import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  AppBar,
  Toolbar,
  Button,
  TextField,
  Box,
  Container,
  InputAdornment,
  Menu,
  MenuItem,
  Avatar,
  IconButton,
  Tooltip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import {
  PersonOutline,
  SchoolOutlined,
  InfoOutlined,
  LogoutOutlined,
  DashboardOutlined,
  AccountCircleOutlined,
} from '@mui/icons-material';
import logo from '../assets/logo.jpeg';
import { logout } from '../redux/userSlice';
import axios from 'axios';
import { toast } from 'react-toastify';
import '@fontsource/poppins';
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/700.css';

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user.userData);
  const [searchQuery, setSearchQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);

  const getUserInitials = (name) => {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    return parts.map((part) => part[0]).join('').toUpperCase();
  };

  const handleGetStarted = () => {
    navigate('/signup');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/all-courses?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const handleSearchClick = () => {
    if (searchQuery.trim()) {
      navigate(`/all-courses?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNavigateProfile = () => {
    handleMenuClose();
    navigate('/profile');
  };

  const handleNavigateMyCourses = () => {
    handleMenuClose();
    if (userData.role === 'educator') {
      navigate('/educator/courses');
    } else if (userData.role === 'student') {
      navigate('/enrolled-courses');
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        'http://localhost:3000/api/auth/logout',
        {},
        { withCredentials: true }
      );
      if (response.status === 200) {
        toast.success('Logged out successfully');
        dispatch(logout());
        navigate('/login');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Logout failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        backdropFilter: 'blur(12px)',
        color: '#000',
        boxShadow: 'none',
        borderBottom: '1px solid rgba(102, 126, 234, 0.08)',
        fontFamily: 'Poppins, sans-serif',
        zIndex: 1000,
      }}
    >
      <Container maxWidth="lg">
        <Toolbar
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            py: 1.5,
          }}
        >
          {/* Logo */}
          <Box
            sx={{
              cursor: 'pointer',
              minWidth: '120px',
              height: '50px',
              display: 'flex',
              alignItems: 'center',
            }}
            onClick={() => navigate('/')}
          >
            <img src={logo} alt="Logo" style={{ height: '100%', width: 'auto' }} />
          </Box>

          {/* Navigation Links */}
          <Box
            sx={{
              display: 'flex',
              gap: 3,
              alignItems: 'center',
              flex: 1,
              ml: 4,
            }}
          >
            {/* Career */}
            <Button
              onClick={() => navigate('/career')}
              sx={{
                color: '#000',
                textTransform: 'none',
                fontSize: '15px',
                fontWeight: 700,
                fontFamily: 'Poppins, sans-serif',
                borderRadius: '8px',
                px: 1.5,
                py: 0.5,
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: 'rgba(31, 119, 212, 0.08)',
                },
              }}
            >
              Career
            </Button>

            {/* Blog Post */}
            <Button
              onClick={() => navigate('/blog-post')}
              sx={{
                color: '#000',
                textTransform: 'none',
                fontSize: '15px',
                fontWeight: 700,
                fontFamily: 'Poppins, sans-serif',
                borderRadius: '8px',
                px: 1.5,
                py: 0.5,
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: 'rgba(31, 119, 212, 0.08)',
                },
              }}
            >
              Blog Post
            </Button>
          </Box>

          {/* Search Bar */}
          <Box sx={{ flex: 0.8, mx: 2 }}>
            <TextField
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleSearch}
              size="small"
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#999' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <button
                      onClick={handleSearchClick}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '0 8px',
                        display: searchQuery.trim() ? 'block' : 'none',
                      }}
                      title="Search"
                    >
                      <SearchIcon sx={{ color: '#667eea', fontSize: '20px' }} />
                    </button>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#f5f5f5',
                  borderRadius: '20px',
                  fontFamily: 'Poppins, sans-serif',
                  '& fieldset': {
                    borderColor: '#2c3e50',
                    borderWidth: '1.5px',
                  },
                  '&:hover fieldset': {
                    borderColor: '#1f77d4',
                    borderWidth: '1.5px',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#1f77d4',
                    borderWidth: '1.5px',
                  },
                },
              }}
            />
          </Box>

          {/* Login Button */}
          {!userData ? (
            <>
              <Button
                onClick={handleLogin}
                sx={{
                  color: '#000',
                  textTransform: 'none',
                  fontSize: '15px',
                  fontWeight: 700,
                  fontFamily: 'Poppins, sans-serif',
                  borderRadius: '8px',
                  px: 2,
                  py: 0.6,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(31, 119, 212, 0.08)',
                  },
                  ml: 1,
                }}
              >
                Log In
              </Button>

              {/* Get Started Button */}
              <Button
                onClick={handleGetStarted}
                variant="contained"
                sx={{
                  backgroundColor: '#2c3e50',
                  color: '#fff',
                  textTransform: 'none',
                  fontSize: '15px',
                  fontWeight: 600,
                  fontFamily: 'Poppins, sans-serif',
                  ml: 1.5,
                  px: 3,
                  py: 1,
                  borderRadius: '12px',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: '#1a252f',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(44, 62, 80, 0.3)',
                  },
                }}
              >
                Get Started
              </Button>
            </>
          ) : userData.role === 'educator' ? (
            <>
              {/* Role Display */}
              <span style={{
                color: '#1565C0',
                fontWeight: '600',
                fontSize: '14px',
                marginRight: '16px',
                padding: '6px 12px',
                backgroundColor: '#E3F2FD',
                borderRadius: '6px'
              }}>
                 Educator
              </span>

              {/* Dashboard Button */}
              <Tooltip title="Dashboard">
                <IconButton
                  onClick={() => navigate('/educator/dashboard')}
                  sx={{
                    color: '#1565C0',
                    backgroundColor: '#E3F2FD',
                    fontSize: '28px',
                    padding: '8px',
                    '&:hover': {
                      backgroundColor: '#BBDEFB',
                      transform: 'scale(1.05)',
                      transition: 'all 0.3s ease'
                    },
                    mr: 1,
                  }}
                >
                  <DashboardOutlined sx={{ fontSize: '28px' }} />
                </IconButton>
              </Tooltip>

              {/* Profile Menu Icon */}
              <Tooltip title="Profile Menu">
                <IconButton
                  onClick={handleMenuOpen}
                  sx={{
                    color: '#1565C0',
                    backgroundColor: '#E3F2FD',
                    fontSize: '28px',
                    padding: '8px',
                    '&:hover': {
                      backgroundColor: '#BBDEFB',
                      transform: 'scale(1.05)',
                      transition: 'all 0.3s ease'
                    },
                  }}
                >
                  <AccountCircleOutlined sx={{ fontSize: '32px' }} />
                </IconButton>
              </Tooltip>

              {/* Profile Dropdown Menu */}
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                PaperProps={{
                  sx: {
                    backgroundColor: 'white',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)',
                    borderRadius: '8px',
                    marginTop: '8px',
                    minWidth: '240px',
                  },
                }}
              >
                <MenuItem
                  onClick={handleNavigateProfile}
                  sx={{
                    display: 'flex',
                    gap: '12px',
                    padding: '12px 16px',
                    '&:hover': {
                      backgroundColor: '#f5f5f5',
                    },
                  }}
                >
                  <PersonOutline sx={{ color: '#1565C0', fontSize: '20px' }} />
                  <span style={{ fontWeight: '500', color: '#1a1a1a' }}>My Profile</span>
                </MenuItem>

                <MenuItem
                  onClick={handleNavigateMyCourses}
                  sx={{
                    display: 'flex',
                    gap: '12px',
                    padding: '12px 16px',
                    '&:hover': {
                      backgroundColor: '#f5f5f5',
                    },
                  }}
                >
                  <SchoolOutlined sx={{ color: '#1565C0', fontSize: '20px' }} />
                  <span style={{ fontWeight: '500', color: '#1a1a1a' }}>My Courses</span>
                </MenuItem>
              </Menu>

              {/* Logout Button */}
              <Tooltip title="Logout">
                <IconButton
                  onClick={handleLogout}
                  disabled={loading}
                  sx={{
                    color: '#D32F2F',
                    backgroundColor: '#FFEBEE',
                    padding: '8px',
                    '&:hover': {
                      backgroundColor: '#FFCDD2',
                      transform: 'scale(1.05)',
                      transition: 'all 0.3s ease'
                    },
                  }}
                >
                  <LogoutOutlined sx={{ fontSize: '28px' }} />
                </IconButton>
              </Tooltip>
            </>
          ) : userData.role === 'student' ? (
            <>
              {/* Role Display */}
              <span style={{
                color: '#1565C0',
                fontWeight: '600',
                fontSize: '14px',
                marginRight: '16px',
                padding: '6px 12px',
                backgroundColor: '#E3F2FD',
                borderRadius: '6px'
              }}>
                 Student
              </span>

              {/* Profile Menu Icon */}
              <Tooltip title="Profile Menu">
                <IconButton
                  onClick={handleMenuOpen}
                  sx={{
                    color: '#1565C0',
                    backgroundColor: '#E3F2FD',
                    fontSize: '28px',
                    padding: '8px',
                    '&:hover': {
                      backgroundColor: '#BBDEFB',
                      transform: 'scale(1.05)',
                      transition: 'all 0.3s ease'
                    },
                    mr: 1,
                  }}
                >
                  <AccountCircleOutlined sx={{ fontSize: '32px' }} />
                </IconButton>
              </Tooltip>

              {/* Profile Dropdown Menu for Student */}
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                PaperProps={{
                  sx: {
                    backgroundColor: 'white',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)',
                    borderRadius: '8px',
                    marginTop: '8px',
                    minWidth: '240px',
                  },
                }}
              >
                <MenuItem
                  onClick={handleNavigateProfile}
                  sx={{
                    display: 'flex',
                    gap: '12px',
                    padding: '12px 16px',
                    '&:hover': {
                      backgroundColor: '#f5f5f5',
                    },
                  }}
                >
                  <PersonOutline sx={{ color: '#1565C0', fontSize: '20px' }} />
                  <span style={{ fontWeight: '500', color: '#1a1a1a' }}>My Profile</span>
                </MenuItem>

                <MenuItem
                  onClick={handleNavigateMyCourses}
                  sx={{
                    display: 'flex',
                    gap: '12px',
                    padding: '12px 16px',
                    '&:hover': {
                      backgroundColor: '#f5f5f5',
                    },
                  }}
                >
                  <SchoolOutlined sx={{ color: '#1565C0', fontSize: '20px' }} />
                  <span style={{ fontWeight: '500', color: '#1a1a1a' }}>My Courses</span>
                </MenuItem>
              </Menu>

              {/* Logout Button */}
              <Tooltip title="Logout">
                <IconButton
                  onClick={handleLogout}
                  disabled={loading}
                  sx={{
                    color: '#D32F2F',
                    backgroundColor: '#FFEBEE',
                    padding: '8px',
                    '&:hover': {
                      backgroundColor: '#FFCDD2',
                      transform: 'scale(1.05)',
                      transition: 'all 0.3s ease'
                    },
                  }}
                >
                  <LogoutOutlined sx={{ fontSize: '28px' }} />
                </IconButton>
              </Tooltip>
            </>
          ) : null}
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Header;
