import React from 'react';
import { Box, Container, Typography, Link } from '@mui/material';
import { FaFacebook, FaXTwitter, FaLinkedin, FaYoutube, FaInstagram } from 'react-icons/fa6';
import '@fontsource/poppins';
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/700.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: FaFacebook, url: '#', label: 'Facebook' },
    { icon: FaXTwitter, url: '#', label: 'X' },
    { icon: FaLinkedin, url: '#', label: 'LinkedIn' },
    { icon: FaYoutube, url: '#', label: 'YouTube' },
    { icon: FaInstagram, url: '#', label: 'Instagram' },
  ];

  const footerLinks = [
    { label: 'Privacy Policy', url: '#' },
    { label: 'Cookie Notice', url: '#' },
    { label: 'Do Not Sell My Personal Information', url: '#' },
    { label: 'Accessibility', url: '#' },
    { label: 'Security', url: '#' },
    { label: 'Terms of Use', url: '#' },
  ];

  return (
    <Box
      sx={{
        background: 'linear-gradient(135deg, #fafbfc 0%, #f2f5f9 50%, #f0f3f8 100%)',
        color: '#1a1a2e',
        py: { xs: 4, md: 6 },
        mt: 0,
      }}
    >
      <Container maxWidth="lg">
        {/* Social Icons Section */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: 2.5,
            mb: 4,
            flexWrap: 'wrap',
          }}
        >
          {socialLinks.map((social, index) => {
            const IconComponent = social.icon;
            return (
              <Link
                key={index}
                href={social.url}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%)',
                  color: '#667eea',
                  transition: 'all 0.3s ease',
                  border: '1.5px solid rgba(102, 126, 234, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    boxShadow: '0 8px 20px rgba(102, 126, 234, 0.4)',
                    transform: 'translateY(-4px)',
                    borderColor: '#667eea',
                  },
                  cursor: 'pointer',
                  textDecoration: 'none',
                }}
              >
                <IconComponent size={22} />
              </Link>
            );
          })}
        </Box>

        {/* Footer Links Section */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: { xs: 1.5, md: 3 },
            mb: 4,
            alignItems: 'center',
          }}
        >
          {footerLinks.map((link, index) => (
            <React.Fragment key={index}>
              <Link
                href={link.url}
                sx={{
                  color: '#666',
                  textDecoration: 'none',
                  fontSize: { xs: '12px', md: '14px' },
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 500,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    color: '#667eea',
                  },
                }}
              >
                {link.label}
              </Link>
              {index < footerLinks.length - 1 && (
                <Box
                  sx={{
                    width: '1px',
                    height: '16px',
                    background: 'rgba(102, 126, 234, 0.3)',
                    display: { xs: 'none', md: 'block' },
                  }}
                />
              )}
            </React.Fragment>
          ))}
        </Box>

        {/* Copyright Section */}
        <Box
          sx={{
            textAlign: 'center',
            borderTop: '1px solid rgba(102, 126, 234, 0.2)',
            pt: 3,
          }}
        >
          <Typography
            sx={{
              fontSize: '13px',
              color: '#999',
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 400,
            }}
          >
            © {currentYear} devskill. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
