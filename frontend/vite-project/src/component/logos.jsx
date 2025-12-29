import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import '@fontsource/poppins';
import {
  SiPython,
  SiJavascript,
  SiReact,
  SiNodedotjs,
  SiMongodb,
  SiPostgresql,
  SiDocker,
  SiGit,
  SiMysql,
  SiAngular,
  SiVuedotjs,
  SiExpress,
  SiNginx,
  SiAmazon,
  SiGithub,
  SiFacebook,
  SiNvidia,
} from 'react-icons/si';

// Logo components mapped with brand colors
const logos = [
  { name: 'Python', Icon: SiPython, color: '#3776ab' },
  { name: 'JavaScript', Icon: SiJavascript, color: '#F7DF1E' },
  { name: 'React', Icon: SiReact, color: '#61DAFB' },
  { name: 'Angular', Icon: SiAngular, color: '#DD0031' },
  { name: 'Vue', Icon: SiVuedotjs, color: '#4FC08D' },
  { name: 'Node.js', Icon: SiNodedotjs, color: '#339933' },
  { name: 'Express', Icon: SiExpress, color: '#000000' },
  { name: 'MongoDB', Icon: SiMongodb, color: '#13AA52' },
  { name: 'PostgreSQL', Icon: SiPostgresql, color: '#336791' },
  { name: 'MySQL', Icon: SiMysql, color: '#00758F' },
  { name: 'Docker', Icon: SiDocker, color: '#2496ED' },
  { name: 'Nginx', Icon: SiNginx, color: '#009639' },
  { name: 'Git', Icon: SiGit, color: '#F1502F' },
  { name: 'GitHub', Icon: SiGithub, color: '#181717' },
  { name: 'Facebook', Icon: SiFacebook, color: '#1877F2' },
  { name: 'AWS', Icon: SiAmazon, color: '#000000' },
  { name: 'Nvidia', Icon: SiNvidia, color: '#76B900' },
];

const LogosSection = () => {
  return (
    <Box
      className="logos-section"
      sx={{
        position: 'relative',
        width: '100%',
        py: 2,
        background: 'linear-gradient(135deg, #fafbfc 0%, #f2f5f9 50%, #f0f3f8 100%)',
        borderTop: '1px solid rgba(102, 126, 234, 0.1)',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(90deg, rgba(102, 126, 234, 0.05) 0%, transparent 20%, transparent 80%, rgba(102, 126, 234, 0.05) 100%)',
          pointerEvents: 'none',
        },
      }}
    >
      {/* Title */}
      <Typography
        sx={{
          fontFamily: 'Poppins, sans-serif',
          fontWeight: 600,
          fontSize: '0.95rem',
          color: '#2c3e50',
          textAlign: 'center',
          marginBottom: 2,
          letterSpacing: '0.3px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        Master Skills from Industry Leaders
      </Typography>

      <Container maxWidth="100%" disableGutters>
        {/* Logo Container - Single Line Rectangular */}
        <Box
          sx={{
            display: 'flex',
            gap: 1,
            justifyContent: 'center',
            alignItems: 'center',
            flexWrap: 'nowrap',
            width: '100%',
            px: { xs: 2, sm: 4, md: 8 },
            overflowX: 'visible',
            position: 'relative',
            zIndex: 1,
            '&::-webkit-scrollbar': { display: 'none' },
            scrollbarWidth: 'none',
          }}
        >
          {logos.map((logo, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '12px 16px',
                borderRadius: '6px',
                backgroundColor: 'transparent',
                border: 'none',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                flexShrink: 0,
                width: '70px',
                height: '70px',
                '&:hover': {
                  transform: 'scale(1.1)',
                  filter: 'drop-shadow(0 4px 8px rgba(102, 126, 234, 0.2))',
                },
              }}
            >
              <logo.Icon size={40} color={logo.color} />
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default LogosSection;
