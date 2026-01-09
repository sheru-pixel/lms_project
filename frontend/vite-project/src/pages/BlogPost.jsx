import React, { useState } from 'react';
import { Box, Container, Typography, Card, CardContent, Grid, Button, Chip, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import '@fontsource/poppins';

const BlogPost = () => {
  const navigate = useNavigate();

  const blogResources = [
    {
      title: 'Medium - Technology & Learning',
      description: 'Articles on web development, programming, and tech trends',
      url: 'https://medium.com/tag/web-development',
      icon: '📱',
      category: 'Technology',
      author: 'Medium',
    },
    {
      title: 'Dev.to Community',
      description: 'Community-driven articles by developers for developers',
      url: 'https://dev.to/',
      icon: '👨‍💻',
      category: 'Development',
      author: 'Dev Community',
    },
    {
      title: 'Hacker News',
      description: 'Curated tech news and discussions on trending topics',
      url: 'https://news.ycombinator.com/',
      icon: '📰',
      category: 'News',
      author: 'YCombinator',
    },
    {
      title: 'CSS-Tricks Blog',
      description: 'In-depth articles on web design and frontend development',
      url: 'https://css-tricks.com/',
      icon: '🎨',
      category: 'Frontend',
      author: 'CSS-Tricks',
    },
    {
      title: 'Smashing Magazine',
      description: 'Professional web design and development articles',
      url: 'https://www.smashingmagazine.com/',
      icon: '✨',
      category: 'Design',
      author: 'Smashing Magazine',
    },
    {
      title: 'HashNode Blog Platform',
      description: 'Developer blog platform with articles on all tech topics',
      url: 'https://hashnode.com/',
      icon: '🔗',
      category: 'Blogs',
      author: 'HashNode',
    },
    {
      title: 'freeCodeCamp Blog',
      description: 'Educational articles and tutorials for learning to code',
      url: 'https://www.freecodecamp.org/news/',
      icon: '📚',
      category: 'Learning',
      author: 'FreeCodeCamp',
    },
    {
      title: 'Real Python',
      description: 'Python tutorials, best practices, and in-depth guides',
      url: 'https://realpython.com/',
      icon: '🐍',
      category: 'Python',
      author: 'Real Python',
    },
  ];

  const categories = ['All', ...new Set(blogResources.map(r => r.category))];
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredBlogs = selectedCategory === 'All'
    ? blogResources
    : blogResources.filter(b => b.category === selectedCategory);

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
            Blog <span style={{ color: '#667eea' }}>Posts</span>
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
            Discover insightful articles and tutorials from leading tech blogs and educational platforms worldwide.
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

        {/* Blog Resources Grid */}
        <Grid container spacing={3}>
          {filteredBlogs.map((blog, index) => (
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
                    {blog.icon}
                  </Typography>

                  {/* Title */}
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      color: '#0f172a',
                      mb: 1,
                      fontSize: '1.1rem',
                      fontFamily: 'Poppins, sans-serif',
                    }}
                  >
                    {blog.title}
                  </Typography>

                  {/* Author */}
                  <Typography
                    sx={{
                      fontSize: '0.85rem',
                      color: '#667eea',
                      fontWeight: 600,
                      mb: 1.5,
                    }}
                  >
                    by {blog.author}
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
                    {blog.description}
                  </Typography>

                  {/* Category Tag */}
                  <Chip
                    label={blog.category}
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
                    href={blog.url}
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
                    Read Articles →
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Featured Articles Section */}
        <Box sx={{ mt: 8 }}>
          <Typography
            variant="h4"
            sx={{
              fontSize: { xs: '1.8rem', md: '2.2rem' },
              fontWeight: 700,
              color: '#0f172a',
              mb: 4,
              textAlign: 'center',
              fontFamily: 'Poppins, sans-serif',
            }}
          >
            Popular Topics This Week
          </Typography>

          <Grid container spacing={3}>
            {/* Dev.to Section */}
            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  borderRadius: '12px',
                  overflow: 'hidden',
                  border: '2px solid #e0e0e0',
                  height: '100%',
                }}
              >
                <CardContent sx={{ p: 0 }}>
                  <Box
                    sx={{
                      width: '100%',
                      height: '400px',
                      backgroundColor: '#f5f5f5',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'column',
                      gap: 2,
                      p: 3,
                      textAlign: 'center',
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: '3rem',
                        mb: 2,
                      }}
                    >
                      👨‍💻
                    </Typography>
                    <Typography
                      sx={{
                        fontWeight: 700,
                        fontSize: '1.2rem',
                        color: '#0f172a',
                      }}
                    >
                      Dev.to Trending Posts
                    </Typography>
                    <Typography
                      sx={{
                        color: '#475569',
                        mb: 2,
                      }}
                    >
                      Join thousands of developers sharing knowledge and insights
                    </Typography>
                    <Button
                      href="https://dev.to/top/week"
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        backgroundColor: '#000',
                        color: '#fff',
                        fontWeight: 600,
                        textTransform: 'none',
                        borderRadius: '8px',
                        px: 3,
                        py: 1,
                        '&:hover': {
                          backgroundColor: '#333',
                        },
                      }}
                    >
                      View Trending
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Medium Section */}
            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  borderRadius: '12px',
                  overflow: 'hidden',
                  border: '2px solid #e0e0e0',
                  height: '100%',
                }}
              >
                <CardContent sx={{ p: 0 }}>
                  <Box
                    sx={{
                      width: '100%',
                      height: '400px',
                      backgroundColor: '#f5f5f5',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'column',
                      gap: 2,
                      p: 3,
                      textAlign: 'center',
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: '3rem',
                        mb: 2,
                      }}
                    >
                      📱
                    </Typography>
                    <Typography
                      sx={{
                        fontWeight: 700,
                        fontSize: '1.2rem',
                        color: '#0f172a',
                      }}
                    >
                      Medium Top Stories
                    </Typography>
                    <Typography
                      sx={{
                        color: '#475569',
                        mb: 2,
                      }}
                    >
                      Explore in-depth articles on technology and learning
                    </Typography>
                    <Button
                      href="https://medium.com/tag/technology"
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        backgroundColor: '#000',
                        color: '#fff',
                        fontWeight: 600,
                        textTransform: 'none',
                        borderRadius: '8px',
                        px: 3,
                        py: 1,
                        '&:hover': {
                          backgroundColor: '#333',
                        },
                      }}
                    >
                      Read Stories
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* Newsletter Section */}
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
            Stay Updated with the Latest Insights
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
            Follow these blogs and platforms to stay informed about the latest trends in technology and learning.
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
            Continue Learning
          </Button>
        </Box>

        {/* Quick Links */}
        <Box
          sx={{
            mt: 8,
            p: 4,
            backgroundColor: '#f8f9ff',
            borderRadius: '16px',
            border: '2px solid #e0e7ff',
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: '#0f172a',
              mb: 3,
              fontSize: '1.3rem',
            }}
          >
            Quick Links to Popular Topics
          </Typography>
          <Grid container spacing={2}>
            {[
              { label: 'Web Development', url: 'https://dev.to/search?q=web%20development' },
              { label: 'Machine Learning', url: 'https://medium.com/tag/machine-learning' },
              { label: 'Cloud Computing', url: 'https://dev.to/search?q=cloud' },
              { label: 'DevOps', url: 'https://dev.to/search?q=devops' },
              { label: 'Frontend Frameworks', url: 'https://dev.to/search?q=frontend' },
              { label: 'Database Design', url: 'https://dev.to/search?q=database' },
            ].map((link, idx) => (
              <Grid item xs={12} sm={6} md={4} key={idx}>
                <Button
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    width: '100%',
                    backgroundColor: '#fff',
                    color: '#667eea',
                    border: '2px solid #e0e7ff',
                    fontWeight: 600,
                    textTransform: 'none',
                    borderRadius: '8px',
                    py: 2,
                    '&:hover': {
                      backgroundColor: '#f0f4ff',
                      borderColor: '#667eea',
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  {link.label}
                </Button>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default BlogPost;
