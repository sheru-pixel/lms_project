import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Button,
  TextField,
  Box,
  Container,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import logo from '../assets/logo.jpeg';
import '@fontsource/poppins';
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/700.css';

function Header() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleGetStarted = () => {
    navigate('/signup');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      console.log('Search for:', searchQuery);
      // Add search functionality here
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
            {/* Resources */}
            <Button
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
              Resources
            </Button>

            {/* Business */}
            <Button
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
              Business
            </Button>

            {/* Universities */}
            <Button
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
              Universities
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
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Header;
