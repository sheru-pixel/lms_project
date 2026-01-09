import React, { useState } from 'react';
import { Box, Container, Typography, Card, CardContent, Grid, Button, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import '@fontsource/poppins';

const Career = () => {
  const navigate = useNavigate();

  const careerResources = [
    {
      title: 'LinkedIn Learning - Career Development',
      description: 'Access career paths, skill assessments, and professional development courses',
      url: 'https://www.linkedin.com/learning/topics/career-development',
      icon: '💼',
      category: 'Professional',
    },
    {
      title: 'Indeed Career Guide',
      description: 'Comprehensive career guidance, job search tips, and industry insights',
      url: 'https://www.indeed.com/career',
      icon: '🎯',
      category: 'Job Search',
    },
    {
      title: 'Coursera Career Academy',
      description: 'Career certificates and professional development programs',
      url: 'https://www.coursera.org/career-academy',
      icon: '🏆',
      category: 'Certificates',
    },
    {
      title: 'Glassdoor Career Advice',
      description: 'Company insights, salary data, and interview preparation',
      url: 'https://www.glassdoor.com/Career',
      icon: '📊',
      category: 'Insights',
    },
    {
      title: 'Medium - Career Articles',
      description: 'In-depth articles about career growth and professional development',
      url: 'https://medium.com/tag/career',
      icon: '📝',
      category: 'Articles',
    },
    {
      title: 'HackerRank Career Path',
      description: 'Tech career paths with skill building and certifications',
      url: 'https://www.hackerrank.com/careers',
      icon: '💻',
      category: 'Tech Career',
    },
  ];

  const categories = ['All', ...new Set(careerResources.map(r => r.category))];
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredResources = selectedCategory === 'All'
    ? careerResources
    : careerResources.filter(r => r.category === selectedCategory);

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        py: { xs: 3, md: 4 },
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
            marginBottom: '30px',
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
          Back to Home
        </Button>

        {/* Page Header */}
        <Box sx={{ mb: 5, textAlign: 'center' }}>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              fontWeight: 800,
              color: '#0f172a',
              mb: 2,
              fontFamily: 'Poppins, sans-serif',
            }}
          >
            Career <span style={{ color: '#667eea' }}>Development</span>
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: '1rem', md: '1.2rem' },
              color: '#475569',
              maxWidth: '700px',
              mx: 'auto',
              lineHeight: 1.7,
              fontWeight: 400,
            }}
          >
            Explore comprehensive career resources, development paths, and professional growth opportunities from industry-leading platforms.
          </Typography>
        </Box>

        {/* Category Filter */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: 2,
            mb: 5,
            flexWrap: 'wrap',
          }}
        >
          {categories.map((category) => (
            <Chip
              key={category}
              label={category}
              onClick={() => setSelectedCategory(category)}
              sx={{
                backgroundColor: selectedCategory === category ? '#667eea' : '#e0e7ff',
                color: selectedCategory === category ? '#fff' : '#667eea',
                fontWeight: 600,
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                },
              }}
            />
          ))}
        </Box>

        {/* Career Resources Grid */}
        <Grid container spacing={3}>
          {filteredResources.map((resource, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  borderRadius: '12px',
                  border: '2px solid #e0e0e0',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 32px rgba(102, 126, 234, 0.15)',
                    borderColor: '#667eea',
                  },
                }}
              >
                <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                  {/* Icon */}
                  <Typography
                    sx={{
                      fontSize: '2.5rem',
                      mb: 2,
                    }}
                  >
                    {resource.icon}
                  </Typography>

                  {/* Title */}
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      color: '#0f172a',
                      mb: 1.5,
                      fontSize: '1.1rem',
                      fontFamily: 'Poppins, sans-serif',
                    }}
                  >
                    {resource.title}
                  </Typography>

                  {/* Description */}
                  <Typography
                    sx={{
                      color: '#64748b',
                      fontSize: '0.95rem',
                      mb: 2,
                      flex: 1,
                      lineHeight: 1.6,
                    }}
                  >
                    {resource.description}
                  </Typography>

                  {/* Category Tag */}
                  <Chip
                    label={resource.category}
                    size="small"
                    sx={{
                      backgroundColor: '#f0f4ff',
                      color: '#667eea',
                      fontWeight: 600,
                      mb: 2,
                      width: 'fit-content',
                    }}
                  />

                  {/* Visit Button */}
                  <Button
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      backgroundColor: '#667eea',
                      color: '#fff',
                      fontWeight: 600,
                      textTransform: 'none',
                      borderRadius: '8px',
                      py: 1,
                      '&:hover': {
                        backgroundColor: '#5568d3',
                        transform: 'translateX(4px)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Visit Resource →
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* CTA Section */}
        <Box
          sx={{
            mt: 8,
            p: 4,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '16px',
            textAlign: 'center',
            color: '#fff',
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              mb: 2,
              fontSize: { xs: '1.5rem', md: '2rem' },
            }}
          >
            Accelerate Your Career Growth
          </Typography>
          <Typography
            sx={{
              fontSize: '1rem',
              mb: 3,
              maxWidth: '600px',
              mx: 'auto',
              opacity: 0.95,
            }}
          >
            Combine these career resources with our expert-led courses to build a comprehensive professional development plan.
          </Typography>
          <Button
            onClick={() => navigate('/all-courses')}
            sx={{
              backgroundColor: '#fff',
              color: '#667eea',
              fontWeight: 700,
              textTransform: 'none',
              borderRadius: '8px',
              px: 4,
              py: 1.5,
              fontSize: '1rem',
              '&:hover': {
                backgroundColor: '#f5f5f5',
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            Explore Courses
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Career;
