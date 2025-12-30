import React, { useState } from 'react';
import { Box, Container, Typography, Card, CardContent, CardMedia, Button, Chip, Rating } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import '@fontsource/poppins';
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/700.css';

const ExploreCourses = () => {
  const [activeTab, setActiveTab] = useState('top-courses');

  const tabs = [
    { id: 'top-courses', label: 'Top Courses' },
    { id: 'ai', label: 'AI' },
    { id: 'career', label: 'Career Tracks' },
    { id: 'skills', label: 'Skill Tracks' },
    { id: 'all', label: 'Explore All Courses' },
  ];
  const courses = [
    {
      id: 1,
      title: 'Introduction to Python',
      instructor: 'John Smith',
      rating: 4.8,
      reviews: 2340,
      description: 'Master the basics of data analysis with Python in just four hours. This online course will introduce the Python interface and explore popular packages.',
      accentColor: '#667eea',
    },
    {
      id: 2,
      title: 'Introduction to SQL',
      instructor: 'Sarah Johnson',
      rating: 4.9,
      reviews: 3250,
      description: 'Learn how to create and query relational databases using SQL in just two hours.',
      accentColor: '#7c3aed',
      badge: 'AI NATIVE',
    },
    {
      id: 3,
      title: 'Introduction to Power BI',
      instructor: 'Michael Brown',
      rating: 4.7,
      reviews: 1850,
      description: 'Master the Power BI basics and learn to use the data visualization software to build impactful reports.',
      accentColor: '#0ea5e9',
    },
    {
      id: 4,
      title: 'Data Science Fundamentals',
      instructor: 'Emily Davis',
      rating: 4.8,
      reviews: 2120,
      description: 'Dive deep into data science concepts and learn practical applications using real-world datasets.',
      accentColor: '#06b6d4',
    },
  ];

  return (
    <Box
      sx={{
        width: '100%',
        py: { xs: 6, md: 8 },
        background: 'linear-gradient(135deg, #fafbfc 0%, #f2f5f9 50%, #f0f3f8 100%)',
      }}
    >
      <Container maxWidth="lg">
        {/* Section Header */}
        <Box sx={{ mb: 6 }}>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '28px', md: '42px' },
              fontWeight: 700,
              color: '#1a1a2e',
              mb: 3,
              fontFamily: 'Poppins, sans-serif',
              textAlign: 'center',
            }}
          >
            Explore Top Courses
          </Typography>

          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: '14px', md: '16px' },
              color: '#666',
              maxWidth: '600px',
              mx: 'auto',
              fontFamily: 'Poppins, sans-serif',
              textAlign: 'center',
              mb: 4,
            }}
          >
            Choose from a wide range of professional courses across different tech domains. Learn from industry experts and advance your career.
          </Typography>

          {/* Filter Tabs */}
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              justifyContent: 'flex-start',
              flexWrap: 'wrap',
            }}
          >
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                sx={{
                  px: 2.5,
                  py: 1,
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: tab.id === 'top-courses' && activeTab === 'top-courses' ? 700 : 600,
                  fontSize: '14px',
                  textTransform: 'none',
                  borderRadius: '8px',
                  border: '2px solid',
                  transition: 'all 0.3s ease',
                  backgroundColor: tab.id === 'top-courses' && activeTab === 'top-courses' ? '#1a237e' : 'transparent',
                  borderColor: tab.id === 'top-courses' && activeTab === 'top-courses' ? '#1a237e' : '#333',
                  color: tab.id === 'top-courses' && activeTab === 'top-courses' ? '#fff' : '#333',
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: tab.id === 'top-courses' && activeTab === 'top-courses' ? '#0d1b5e' : '#f0f3f8',
                    borderColor: '#1a237e',
                    color: tab.id === 'top-courses' && activeTab === 'top-courses' ? '#fff' : '#1a237e',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(26, 35, 126, 0.15)',
                  },
                  '&:active': {
                    transform: 'none',
                  },
                  '&:focus': {
                    outline: 'none',
                  },
                }}
              >
                {tab.label}
              </Button>
            ))}
          </Box>
        </Box>

        {/* Courses Grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 3,
            mb: 4,
            '@media (max-width: 1200px)': {
              gridTemplateColumns: 'repeat(2, 1fr)',
            },
            '@media (max-width: 768px)': {
              gridTemplateColumns: '1fr',
            },
          }}
        >
          {courses.map((course) => (
            <Card
              key={course.id}
              sx={{
                borderRadius: '8px',
                boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                overflow: 'hidden',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderBottom: `4px solid ${course.accentColor}`,
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 20px rgba(0, 0, 0, 0.12)',
                },
              }}
            >
              {/* Course Content */}
              <CardContent
                sx={{
                  flexGrow: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1.2,
                  p: 2.5,
                }}
              >
                {/* Title */}
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    fontSize: '16px',
                    color: '#1a1a2e',
                    fontFamily: 'Poppins, sans-serif',
                    lineHeight: 1.3,
                    minHeight: '48px',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {course.title}
                </Typography>

                {/* Instructor Name */}
                <Typography
                  sx={{
                    fontSize: '12px',
                    color: '#999',
                    fontWeight: 500,
                    fontFamily: 'Poppins, sans-serif',
                  }}
                >
                  By {course.instructor}
                </Typography>

                {/* Rating */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                  }}
                >
                  <Rating
                    value={course.rating}
                    precision={0.1}
                    readOnly
                    sx={{
                      fontSize: '14px',
                      '& .MuiRating-iconFilled': {
                        color: '#ffc107',
                      },
                    }}
                  />
                  <Typography
                    sx={{
                      fontSize: '11px',
                      color: '#999',
                      fontWeight: 500,
                    }}
                  >
                    ({course.reviews.toLocaleString()})
                  </Typography>
                </Box>

                {/* Description */}
                <Typography
                  variant="body2"
                  sx={{
                    color: '#666',
                    fontSize: '13px',
                    lineHeight: 1.4,
                    flexGrow: 1,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    fontFamily: 'Poppins, sans-serif',
                  }}
                >
                  {course.description}
                </Typography>

                {/* See Details Button */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1.5 }}>
                  <Button
                    sx={{
                      background: '#1a237e',
                      color: '#fff',
                      textTransform: 'none',
                      fontWeight: 600,
                      fontSize: '12px',
                      px: 2,
                      py: 0.6,
                      borderRadius: '4px',
                      fontFamily: 'Poppins, sans-serif',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        background: '#0d1b5e',
                        boxShadow: '0 4px 12px rgba(26, 35, 126, 0.3)',
                      },
                    }}
                  >
                    See Details →
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default ExploreCourses;
