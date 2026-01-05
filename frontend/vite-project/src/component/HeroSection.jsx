import React from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from 'react-router-dom';
import '@fontsource/poppins';

const HeroSection = () => {
  const navigate = useNavigate();
  return (
    <Box
      className="hero-container"
      sx={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #fafbfc 0%, #f2f5f9 50%, #f0f3f8 100%)',
        marginTop: '-64px',
        paddingTop: '64px',
      }}
    >
      {/* Animated Background - Floating Dots and Lines */}
      <Box
        className="animated-bg"
        sx={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          zIndex: 1,
          overflow: 'hidden',
        }}
      >
        {/* Floating Dots */}
        {[...Array(15)].map((_, i) => (
          <Box
            key={`dot-${i}`}
            className={`dot dot-${i}`}
            sx={{
              position: 'absolute',
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              borderRadius: '50%',
              background: 'rgba(102, 126, 234, 0.1)',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float-dot ${Math.random() * 8 + 6}s ease-in-out infinite`,
              '@keyframes float-dot': {
                '0%, 100%': { transform: 'translate(0, 0)', opacity: 0.3 },
                '50%': { transform: `translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px)`, opacity: 0.6 },
              },
            }}
          />
        ))}

        {/* Additional Moving Shapes */}
        <Box
          className="moving-shape moving-shape-4"
          sx={{
            position: 'absolute',
            width: '70px',
            height: '70px',
            border: '3px solid rgba(102, 126, 234, 0.22)',
            left: '15%',
            bottom: '15%',
            animation: 'moveShape4 14s ease-in-out infinite',
            '@keyframes moveShape4': {
              '0%, 100%': { transform: 'translateX(0) translateY(0) rotate(0deg)' },
              '50%': { transform: 'translateX(80px) translateY(80px) rotate(180deg)' },
            },
          }}
        />

        <Box
          className="moving-shape moving-shape-5"
          sx={{
            position: 'absolute',
            width: '45px',
            height: '45px',
            border: '3px solid rgba(102, 126, 234, 0.2)',
            borderRadius: '50%',
            right: '20%',
            bottom: '25%',
            animation: 'moveShape5 11s ease-in-out infinite',
            '@keyframes moveShape5': {
              '0%, 100%': { transform: 'translateY(0) scale(1)' },
              '50%': { transform: 'translateY(-100px) scale(1.2)' },
            },
          }}
        />

        {/* Grid Background */}
        <Box
          className="grid-bg"
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundImage: `
              linear-gradient(rgba(102, 126, 234, 0.14) 1px, transparent 1px),
              linear-gradient(90deg, rgba(102, 126, 234, 0.14) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
            backgroundPosition: '0 0',
            zIndex: 0,
          }}
        />

        {/* Light Gradient Overlay */}
        <Box
          className="gradient-overlay"
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            background: 'radial-gradient(circle at 20% 50%, rgba(102, 126, 234, 0.08) 0%, transparent 50%),radial-gradient(circle at 80% 80%, rgba(102, 126, 234, 0.06) 0%, transparent 50%)',
            zIndex: 1,
            pointerEvents: 'none',
          }}
        />

        {/* Moving Gradient Effect */}
        <Box
          className="moving-gradient"
          sx={{
            position: 'absolute',
            width: '200%',
            height: '200%',
            background: 'linear-gradient(90deg, transparent 0%, rgba(102, 126, 234, 0.12) 25%, rgba(102, 126, 234, 0.14) 50%, rgba(102, 126, 234, 0.12) 75%, transparent 100%)',
            backgroundSize: '200% 200%',
            animation: 'singleWave 8s ease-in-out infinite',
            zIndex: 2,
            pointerEvents: 'none',
            '@keyframes singleWave': {
              '0%': { backgroundPosition: '-100% 0%' },
              '50%': { backgroundPosition: '100% 0%' },
              '100%': { backgroundPosition: '-100% 0%' },
            },
          }}
        />

        {/* Animated Lines */}
        <svg
          className="animated-lines"
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            zIndex: 0,
            display: 'none',
          }}
          preserveAspectRatio="none"
        >
          <defs>
            <style>{`
              @keyframes dash {
                to { stroke-dashoffset: 0; }
              }
              line { stroke: rgba(102, 126, 234, 0.25); stroke-width: 2.5; stroke-dasharray: 15; animation: dash 2s linear infinite; }
            `}</style>
          </defs>
        </svg>

        {/* Moving Geometric Elements */}
        <Box
          className="moving-shape moving-shape-1"
          sx={{
            position: 'absolute',
            width: '80px',
            height: '80px',
            border: '3px solid rgba(102, 126, 234, 0.28)',
            borderRadius: '20px',
            left: '8%',
            top: '30%',
            animation: 'moveShape1 12s ease-in-out infinite',
            '@keyframes moveShape1': {
              '0%, 100%': { transform: 'translateX(0) translateY(0) rotate(0deg)' },
              '50%': { transform: 'translateX(50px) translateY(-50px) rotate(90deg)' },
            },
          }}
        />

        <Box
          className="moving-shape moving-shape-2"
          sx={{
            position: 'absolute',
            width: '60px',
            height: '60px',
            border: '3px solid rgba(102, 126, 234, 0.25)',
            borderRadius: '50%',
            right: '10%',
            top: '50%',
            animation: 'moveShape2 15s ease-in-out infinite',
            '@keyframes moveShape2': {
              '0%, 100%': { transform: 'translateX(0) translateY(0)' },
              '25%': { transform: 'translateX(60px) translateY(-60px)' },
              '50%': { transform: 'translateX(0) translateY(-120px)' },
              '75%': { transform: 'translateX(-60px) translateY(-60px)' },
            },
          }}
        />

        <Box
          className="moving-shape moving-shape-3"
          sx={{
            position: 'absolute',
            width: '50px',
            height: '50px',
            border: '3px solid rgba(102, 126, 234, 0.23)',
            left: '75%',
            bottom: '20%',
            animation: 'moveShape3 10s ease-in-out infinite',
            '@keyframes moveShape3': {
              '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
              '50%': { transform: 'translateY(-80px) rotate(180deg)' },
            },
          }}
        />
      </Box>

        {/* Additional Moving Elements */}
        <Box
          className="moving-shape moving-shape-6"
          sx={{
            position: 'absolute',
            width: '55px',
            height: '55px',
            border: '3px solid rgba(102, 126, 234, 0.24)',
            borderRadius: '12px',
            top: '25%',
            right: '12%',
            animation: 'moveShape6 13s ease-in-out infinite',
            '@keyframes moveShape6': {
              '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
              '50%': { transform: 'translateY(60px) rotate(180deg)' },
            },
          }}
        />

        <Box
          className="moving-shape moving-shape-7"
          sx={{
            position: 'absolute',
            width: '65px',
            height: '65px',
            border: '3px solid rgba(102, 126, 234, 0.19)',
            borderRadius: '50%',
            bottom: '10%',
            left: '40%',
            animation: 'moveShape7 16s ease-in-out infinite',
            '@keyframes moveShape7': {
              '0%, 100%': { transform: 'translateX(0) scale(1)' },
              '50%': { transform: 'translateX(-100px) scale(0.9)' },
            },
          }}
        />

        <Box
          className="moving-shape moving-shape-8"
          sx={{
            position: 'absolute',
            width: '40px',
            height: '40px',
            border: '3px solid rgba(102, 126, 234, 0.26)',
            left: '50%',
            top: '20%',
            animation: 'moveShape8 9s ease-in-out infinite',
            '@keyframes moveShape8': {
              '0%, 100%': { transform: 'rotate(0deg)' },
              '50%': { transform: 'rotate(360deg) translateX(30px)' },
            },
          }}
        />

        {/* Content */}
        <Container
          maxWidth="lg"
          className="hero-content"
          sx={{
            position: 'relative',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            py: 10,
          }}
        >
        {/* Eyebrow Text */}
        <Typography
          className="hero-eyebrow"
          sx={{
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 500,
            fontSize: '0.85rem',
            color: '#667eea',
            textTransform: 'uppercase',
            letterSpacing: '1.5px',
            marginBottom: 2,
            animation: 'slideDown 0.8s ease-out',
            '@keyframes slideDown': {
              from: { opacity: 0, transform: 'translateY(-15px)' },
              to: { opacity: 1, transform: 'translateY(0)' },
            },
            display: 'none',
          }}
        >
          Education Platform
        </Typography>

        {/* Main Heading */}
        <Typography
          className="hero-title"
          variant="h1"
          sx={{
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 800,
            fontSize: { xs: '3rem', sm: '4rem', md: '5rem', lg: '5.5rem' },
            color: '#0f172a',
            lineHeight: 1.15,
            marginBottom: 2,
            maxWidth: '900px',
            animation: 'slideDown 0.8s ease-out 0.1s backwards',
            '@keyframes slideDown': {
              from: { opacity: 0, transform: 'translateY(-30px)' },
              to: { opacity: 1, transform: 'translateY(0)' },
            },
          }}
        >
          Learn Skills That <span style={{ color: '#667eea' }}>Shape The Future</span>
        </Typography>

        {/* Subtitle */}
        <Typography
          className="hero-subtitle"
          sx={{
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 400,
            fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem' },
            color: '#475569',
            marginBottom: 5,
            maxWidth: '700px',
            lineHeight: 1.7,
            animation: 'slideUp 0.8s ease-out 0.2s backwards',
            '@keyframes slideUp': {
              from: { opacity: 0, transform: 'translateY(20px)' },
              to: { opacity: 1, transform: 'translateY(0)' },
            },
          }}
        >
          Master the most in-demand skills with expert-led courses. Start your learning journey today.
        </Typography>

        {/* CTA Button */}
        <Button
          className="hero-btn"
          endIcon={<ArrowForwardIcon />}
          onClick={() => navigate('/all-courses')}
          sx={{
            backgroundColor: '#667eea',
            color: '#fff',
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 700,
            fontSize: '1rem',
            paddingX: 5,
            paddingY: 1.75,
            borderRadius: '8px',
            textTransform: 'none',
            boxShadow: '0 10px 30px rgba(102, 126, 234, 0.2)',
            transition: 'all 0.3s ease',
            animation: 'slideUp 0.8s ease-out 0.3s backwards',
            '@keyframes slideUp': {
              from: { opacity: 0, transform: 'translateY(20px)' },
              to: { opacity: 1, transform: 'translateY(0)' },
            },
            '&:hover': {
              transform: 'translateY(-3px)',
              boxShadow: '0 15px 40px rgba(102, 126, 234, 0.3)',
              backgroundColor: '#5568d3',
            },
          }}
        >
          Explore Courses
        </Button>
      </Container>
    </Box>
  );
};

export default HeroSection;
