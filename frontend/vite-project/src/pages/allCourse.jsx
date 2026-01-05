import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Card, CardContent, Button, Rating, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { FiArrowLeft } from 'react-icons/fi';
import axios from 'axios';
import '@fontsource/poppins';
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/700.css';

const AllCourses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [error, setError] = useState('');

  const categoryColors = {
    'Web Development': '#667eea',
    'Data Science': '#f093fb',
    'Artificial Intelligence': '#4facfe',
    'Cybersecurity': '#fa709a',
    'Cloud & DevOps': '#30cfd0',
    'Mobile Development': '#a8edea',
    'Embedded Systems': '#fed6e3',
  };

  const categories = [
    { id: 'all', label: 'All Courses' },
    { id: 'Web Development', label: 'Web Development' },
    { id: 'Data Science', label: 'Data Science' },
    { id: 'Artificial Intelligence', label: 'Artificial Intelligence' },
    { id: 'Cybersecurity', label: 'Cybersecurity' },
    { id: 'Cloud & DevOps', label: 'Cloud & DevOps' },
    { id: 'Mobile Development', label: 'Mobile Development' },
    { id: 'Embedded Systems', label: 'Embedded Systems' },
  ];

  useEffect(() => {
    fetchPublishedCourses();
  }, []);

  const fetchPublishedCourses = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        'http://localhost:3000/api/course/getPublished',
        { withCredentials: true }
      );
      setCourses(response.data || []);
      setError('');
    } catch (err) {
      setError('Failed to load courses. Please try again later.');
      console.error('Error fetching courses:', err);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = activeCategory === 'all' 
    ? courses 
    : courses.filter(course => course.category === activeCategory);

  const groupedCourses = filteredCourses.reduce((acc, course) => {
    const category = course.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(course);
    return acc;
  }, {});

  const getColor = (category) => categoryColors[category] || '#667eea';

  const handleViewCourse = (courseId) => {
    navigate(`/course/${courseId}`);
  };

  if (loading) {
    return (
      <Box
        sx={{
          width: '100%',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f5f5f5',
        }}
      >
        <CircularProgress sx={{ color: '#667eea' }} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        py: { xs: 2, md: 3 },
        background: 'linear-gradient(135deg, #fafbfc 0%, #f2f5f9 50%, #f0f3f8 100%)',
        fontFamily: 'Poppins, sans-serif',
      }}
    >
      <Container maxWidth="lg">
        {/* Back Button */}
        <Button
          onClick={() => navigate('/')}
          sx={{
            backgroundColor: '#f0f0f0',
            color: '#333',
            border: 'none',
            padding: '10px 16px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'background-color 0.3s ease',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: '#e0e0e0',
            },
          }}
        >
          <FiArrowLeft size={18} />
        </Button>

        {/* Section Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: '16px', md: '16px' },
              color: '#1a1a2e',
              maxWidth: '700px',
              mx: 'auto',
              textAlign: 'center',
              mb: 3,
              lineHeight: 1.6,
              fontWeight: 700,
              fontFamily: "'Poppins', sans-serif",
              letterSpacing: '0.3px',
            }}
          >
            Discover a comprehensive collection of courses across multiple technology domains. Learn from industry experts and master new skills to advance your career.
          </Typography>

          {/* Category Filter Tabs */}
          <Box
            sx={{
              display: 'flex',
              gap: 1.5,
              justifyContent: 'center',
              flexWrap: 'wrap',
              mb: 3,
            }}
          >
            {categories.map((category) => (
              <Button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                sx={{
                  px: 3,
                  py: 1.2,
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: activeCategory === category.id ? 700 : 600,
                  fontSize: '13px',
                  textTransform: 'none',
                  borderRadius: '8px',
                  border: '2px solid',
                  transition: 'all 0.3s ease',
                  backgroundColor:
                    activeCategory === category.id ? '#667eea' : 'transparent',
                  borderColor:
                    activeCategory === category.id ? '#667eea' : '#ddd',
                  color: activeCategory === category.id ? '#fff' : '#333',
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor:
                      activeCategory === category.id ? '#5568d3' : '#f0f0f0',
                    borderColor: '#667eea',
                    color:
                      activeCategory === category.id ? '#fff' : '#667eea',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.2)',
                  },
                }}
              >
                {category.label}
              </Button>
            ))}
          </Box>
        </Box>

        {/* Courses by Category */}
        {error && (
          <Typography
            sx={{
              color: '#d32f2f',
              textAlign: 'center',
              mb: 4,
              fontSize: '16px',
            }}
          >
            {error}
          </Typography>
        )}

        {filteredCourses.length === 0 ? (
          <Box
            sx={{
              textAlign: 'center',
              py: 8,
            }}
          >
            <Typography
              sx={{
                fontSize: '20px',
                fontWeight: 600,
                color: '#666',
              }}
            >
              No courses available in this category yet.
            </Typography>
            <Typography
              sx={{
                fontSize: '14px',
                color: '#999',
                mt: 1,
              }}
            >
              Check back soon for more courses!
            </Typography>
          </Box>
        ) : (
          <Box>
            {Object.entries(groupedCourses).map(([category, categoryCoursesData]) => (
              <Box key={category} sx={{ mb: 6 }}>
                {/* Category Title */}
                {activeCategory === 'all' && (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      mb: 3,
                    }}
                  >
                    <Box
                      sx={{
                        width: '6px',
                        height: '32px',
                        backgroundColor: getColor(category),
                        borderRadius: '3px',
                      }}
                    />
                    <Typography
                      variant="h4"
                      sx={{
                        fontSize: { xs: '24px', md: '28px' },
                        fontWeight: 700,
                        color: '#1a1a2e',
                      }}
                    >
                      {category}
                      <Typography
                        component="span"
                        sx={{
                          fontSize: '14px',
                          color: '#999',
                          fontWeight: 500,
                          ml: 2,
                        }}
                      >
                        ({categoryCoursesData.length} courses)
                      </Typography>
                    </Typography>
                  </Box>
                )}

                {/* Courses Grid */}
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                      xs: '1fr',
                      sm: 'repeat(2, 1fr)',
                      md: 'repeat(3, 1fr)',
                      lg: 'repeat(4, 1fr)',
                    },
                    gap: 2.5,
                  }}
                >
                  {categoryCoursesData.map((course) => (
                    <Card
                      key={course._id}
                      sx={{
                        borderRadius: '12px',
                        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        overflow: 'hidden',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        borderBottom: `5px solid ${getColor(course.category)}`,
                        backgroundColor: 'white',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow:
                            '0 12px 28px rgba(102, 126, 234, 0.15)',
                        },
                      }}
                    >
                      {/* Thumbnail */}
                      {course.thumbnail && (
                        <Box
                          sx={{
                            width: '100%',
                            height: '160px',
                            backgroundColor: getColor(course.category),
                            backgroundImage: `url(${course.thumbnail})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            position: 'relative',
                            overflow: 'hidden',
                          }}
                        >
                          <Box
                            sx={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              backgroundColor:
                                'rgba(0, 0, 0, 0.3)',
                            }}
                          />
                        </Box>
                      )}

                      {/* Course Content */}
                      <CardContent
                        sx={{
                          flexGrow: 1,
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 0.8,
                          p: 2,
                        }}
                      >
                        {/* Category Tag */}
                        <Box>
                          <Typography
                            sx={{
                              display: 'inline-block',
                              backgroundColor: getColor(
                                course.category
                              ),
                              color: 'white',
                              fontSize: '11px',
                              fontWeight: 700,
                              padding: '4px 10px',
                              borderRadius: '4px',
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px',
                            }}
                          >
                            {course.category}
                          </Typography>
                        </Box>

                        {/* Title */}
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 700,
                            fontSize: '16px',
                            color: '#1a1a2e',
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
                            color: '#667eea',
                            fontWeight: 600,
                            fontStyle: 'italic',
                          }}
                        >
                          Published by {course.creator?.name || 'Expert Educator'}
                        </Typography>

                        {/* Description */}
                        <Typography
                          variant="body2"
                          sx={{
                            color: '#1a1a2e',
                            fontSize: '13px',
                            lineHeight: 1.4,
                            flexGrow: 1,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            fontWeight: 600,
                            fontFamily: "'Poppins', sans-serif",
                          }}
                        >
                          {course.description || course.subTitle || 'Learn and master this course content.'}
                        </Typography>

                        {/* Course Level */}
                        {course.level && (
                          <Typography
                            sx={{
                              fontSize: '12px',
                              color: '#667eea',
                              fontWeight: 600,
                              textTransform: 'capitalize',
                            }}
                          >
                            Level: {course.level}
                          </Typography>
                        )}

                        {/* Price and Button */}
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mt: 1.5,
                            pt: 1.5,
                            borderTop: '1px solid #eee',
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: '18px',
                              fontWeight: 700,
                              color: '#1a1a2e',
                            }}
                          >
                            ${course.price || '0'}
                          </Typography>

                          <Button
                            onClick={() => handleViewCourse(course._id)}
                            endIcon={<ArrowForwardIcon />}
                            sx={{
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              color: '#fff',
                              textTransform: 'none',
                              fontWeight: 600,
                              fontSize: '12px',
                              px: 2,
                              py: 0.8,
                              borderRadius: '6px',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                boxShadow:
                                  '0 6px 16px rgba(102, 126, 234, 0.4)',
                                transform: 'translateY(-2px)',
                              },
                            }}
                          >
                            View
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default AllCourses;
