import React from 'react';
import { Box, Container, Typography, Grid, Card, CardContent } from '@mui/material';
import { FaGraduationCap, FaComments } from 'react-icons/fa';
import '@fontsource/poppins';
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/700.css';

const Features = () => {
  const dotsData = [
    { size: 8, opacity: 0.2, left: 15, top: 20, duration: 8 },
    { size: 10, opacity: 0.25, left: 85, top: 30, duration: 10 },
    { size: 7, opacity: 0.15, left: 25, top: 60, duration: 9 },
    { size: 9, opacity: 0.22, left: 70, top: 75, duration: 11 },
    { size: 6, opacity: 0.18, left: 50, top: 15, duration: 7 },
    { size: 11, opacity: 0.28, left: 10, top: 80, duration: 12 },
    { size: 8, opacity: 0.2, left: 60, top: 45, duration: 8.5 },
    { size: 9, opacity: 0.24, left: 40, top: 70, duration: 10.5 },
  ];
  const features = [
    {
      id: 1,
      title: 'Learn from Experts',
      description: 'Access courses created by industry professionals with years of real-world experience.',
      color: '#667eea',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      icon: <FaGraduationCap />,
    },
    {
      id: 2,
      title: 'Certificates',
      description: 'Earn recognized certifications upon course completion to boost your professional profile.',
      color: '#764ba2',
      gradient: 'linear-gradient(135deg, #764ba2 0%, #f093fb 100%)',
      icon: '🎖️',
    },
    {
      id: 3,
      title: 'AI Chatbot',
      description: 'Get instant assistance and personalized learning recommendations powered by AI.',
      color: '#f093fb',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      icon: <FaComments />,
    },
    {
      id: 4,
      title: 'One-to-One Live Sessions',
      description: 'Connect with mentors for personalized guidance and real-time problem solving.',
      color: '#f5576c',
      gradient: 'linear-gradient(135deg, #f5576c 0%, #ffa500 100%)',
      icon: '👥',
    },
  ];

  return (
    <Box
      sx={{
        width: '100%',
        py: { xs: 8, md: 12 },
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #fafbfc 0%, #f2f5f9 50%, #f0f3f8 100%)',
      }}
    >
      {/* Animated Grid Background */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0,
          overflow: 'hidden',
        }}
      >
        {/* Animated Floating Shapes - Top Left */}
        <Box
          sx={{
            position: 'absolute',
            width: '280px',
            height: '280px',
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.1) 100%)',
            borderRadius: '30px',
            top: '5%',
            left: '3%',
            animation: 'float 8s ease-in-out infinite',
            boxShadow: '0 20px 40px rgba(102, 126, 234, 0.1)',
            border: '2px solid rgba(102, 126, 234, 0.15)',
            '@keyframes float': {
              '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
              '50%': { transform: 'translateY(-40px) rotate(8deg)' },
            },
          }}
        />

        {/* Animated Circle - Top Right */}
        <Box
          sx={{
            position: 'absolute',
            width: '220px',
            height: '220px',
            background: 'linear-gradient(135deg, rgba(240, 147, 251, 0.12) 0%, rgba(245, 87, 108, 0.08) 100%)',
            borderRadius: '50%',
            top: '8%',
            right: '5%',
            animation: 'pulse 4s ease-in-out infinite',
            boxShadow: '0 15px 35px rgba(245, 87, 108, 0.08)',
            border: '2px solid rgba(245, 87, 108, 0.12)',
            '@keyframes pulse': {
              '0%, 100%': { transform: 'scale(1)' },
              '50%': { transform: 'scale(1.1)' },
            },
          }}
        />

        {/* Floating Elements - Middle */}
        <Box
          sx={{
            position: 'absolute',
            width: '150px',
            height: '150px',
            background: 'linear-gradient(135deg, rgba(118, 75, 162, 0.1) 0%, rgba(102, 126, 234, 0.08) 100%)',
            borderRadius: '20px',
            top: '50%',
            left: '10%',
            animation: 'bounce 6s ease-in-out infinite',
            boxShadow: '0 10px 25px rgba(118, 75, 162, 0.08)',
            border: '1px solid rgba(118, 75, 162, 0.1)',
            '@keyframes bounce': {
              '0%, 100%': { transform: 'translateY(0px) translateX(0px)' },
              '25%': { transform: 'translateY(-30px) translateX(15px)' },
              '50%': { transform: 'translateY(0px) translateX(0px)' },
              '75%': { transform: 'translateY(-20px) translateX(-15px)' },
            },
          }}
        />

        {/* Animated Shape - Bottom Right */}
        <Box
          sx={{
            position: 'absolute',
            width: '200px',
            height: '200px',
            background: 'linear-gradient(135deg, rgba(240, 147, 251, 0.1) 0%, rgba(245, 87, 108, 0.08) 100%)',
            bottom: '5%',
            right: '8%',
            clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)',
            animation: 'rotate 8s linear infinite',
            boxShadow: '0 15px 35px rgba(245, 87, 108, 0.1)',
            border: '1px solid rgba(245, 87, 108, 0.15)',
            '@keyframes rotate': {
              '0%': { transform: 'rotate(0deg)' },
              '100%': { transform: 'rotate(360deg)' },
            },
          }}
        />

        {/* Floating Dots */}
        {dotsData.map((dot, i) => (
          <Box
            key={`dot-${i}`}
            sx={{
              position: 'absolute',
              width: `${dot.size}px`,
              height: `${dot.size}px`,
              borderRadius: '50%',
              background: `rgba(102, 126, 234, ${dot.opacity})`,
              left: `${dot.left}%`,
              top: `${dot.top}%`,
              animation: `float${i % 3} ${dot.duration}s ease-in-out infinite`,
              '@keyframes float0': {
                '0%, 100%': { transform: 'translateY(0px)' },
                '50%': { transform: 'translateY(-50px)' },
              },
              '@keyframes float1': {
                '0%, 100%': { transform: 'translateX(0px)' },
                '50%': { transform: 'translateX(60px)' },
              },
              '@keyframes float2': {
                '0%, 100%': { transform: 'translate(0, 0)' },
                '50%': { transform: 'translate(40px, -40px)' },
              },
            }}
          />
        ))}
      </Box>

      {/* Content */}
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Section Header */}
        <Box sx={{ mb: 6, textAlign: 'center', position: 'relative' }}>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '28px', md: '42px' },
              fontWeight: 700,
              color: '#1a1a2e',
              mb: 2,
              fontFamily: 'Poppins, sans-serif',
            }}
          >
            Why Choose Our Platform
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: '14px', md: '16px' },
              color: '#666',
              maxWidth: '600px',
              mx: 'auto',
              fontFamily: 'Poppins, sans-serif',
              mb: 3,
            }}
          >
            Empowering learners with world-class content and tools to succeed in the digital economy.
          </Typography>

          {/* Gradient Accent Line - Below Description */}
          <Box
            sx={{
              width: '600px',
              height: '4px',
              background: 'linear-gradient(90deg, transparent 0%, rgba(102, 126, 234, 0.6) 20%, rgba(245, 87, 108, 0.6) 50%, rgba(102, 126, 234, 0.6) 80%, transparent 100%)',
              mx: 'auto',
              animation: 'glow 3s ease-in-out infinite',
              boxShadow: '0 0 20px rgba(102, 126, 234, 0.4), 0 0 40px rgba(245, 87, 108, 0.3)',
              '@keyframes glow': {
                '0%, 100%': { 
                  boxShadow: '0 0 20px rgba(102, 126, 234, 0.4), 0 0 40px rgba(245, 87, 108, 0.3)',
                  opacity: 0.6,
                },
                '50%': { 
                  boxShadow: '0 0 30px rgba(102, 126, 234, 0.6), 0 0 60px rgba(245, 87, 108, 0.5)',
                  opacity: 1,
                },
              },
            }}
          />
        </Box>

        {/* Features Grid */}
        <Grid
          container
          spacing={3}
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
            gap: 3,
          }}
        >
          {features.map((feature) => (
            <Card
              key={feature.id}
              sx={{
                background: 'rgba(255, 255, 255, 0.7)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(102, 126, 234, 0.2)',
                borderRadius: '12px',
                padding: 3,
                transition: 'all 0.3s ease',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.85)',
                  border: '1px solid rgba(102, 126, 234, 0.4)',
                  boxShadow: '0 8px 24px rgba(102, 126, 234, 0.15)',
                  transform: 'translateY(-8px)',
                },
              }}
            >
              <CardContent
                sx={{
                  p: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  '&:last-child': {
                    pb: 0,
                  },
                }}
              >
                {/* 3D Icon Box */}
                <Box
                  sx={{
                    width: '80px',
                    height: '80px',
                    background: feature.gradient,
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: `0 12px 24px ${feature.color}40, inset 0 1px 0 rgba(255,255,255,0.3)`,
                    transition: 'all 0.3s ease',
                    fontSize: '40px',
                    position: 'relative',
                    transform: 'perspective(1000px) rotateX(5deg) rotateY(-5deg)',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: '2px',
                      left: '2px',
                      right: '2px',
                      height: '40%',
                      background: 'linear-gradient(180deg, rgba(255,255,255,0.4) 0%, transparent 100%)',
                      borderRadius: '14px',
                    },
                  }}
                >
                  {feature.icon}
                </Box>

                {/* Title */}
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    fontSize: '18px',
                    color: '#1a1a2e',
                    fontFamily: 'Poppins, sans-serif',
                  }}
                >
                  {feature.title}
                </Typography>

                {/* Description */}
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: '14px',
                    color: '#666',
                    lineHeight: 1.6,
                    fontFamily: 'Poppins, sans-serif',
                    flexGrow: 1,
                  }}
                >
                  {feature.description}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Features;
