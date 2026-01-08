import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaBook, FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import { Box, CircularProgress, Button, IconButton, Tooltip } from '@mui/material';
import ChatBot from '../component/ChatBot';

function EnrolledCourses() {
  const navigate = useNavigate();
  const userData = useSelector((state) => state.user.userData);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          'http://localhost:3000/api/course/enrolled',
          { withCredentials: true }
        );
        console.log('Enrolled courses data:', response.data);
        setEnrolledCourses(response.data.courses || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching enrolled courses:', err);
        setError(err.response?.data?.message || 'Failed to fetch enrolled courses');
        toast.error(err.response?.data?.message || 'Failed to fetch enrolled courses');
      } finally {
        setLoading(false);
      }
    };

    if (userData) {
      fetchEnrolledCourses();
    }
  }, [userData]);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          backgroundColor: '#f5f5f5',
          mt: 8,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      className="enrolled-courses-container"
      sx={{
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        paddingTop: '80px',
        paddingBottom: '40px',
      }}
    >
      {/* Back Button - Above main content */}
      <div className="enrolled-courses-back-button-wrapper" style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px 20px 0 20px' }}>
        <Tooltip title="Back to Home">
          <IconButton
            onClick={() => navigate('/')}
            sx={{
              backgroundColor: '#f0f0f0',
              color: '#1565C0',
              padding: '10px',
              marginBottom: '20px',
              '&:hover': {
                backgroundColor: '#e0e0e0',
                transform: 'scale(1.05)',
                transition: 'all 0.3s ease'
              },
            }}
          >
            <FaArrowLeft style={{ fontSize: '20px' }} />
          </IconButton>
        </Tooltip>
      </div>

      <div className="enrolled-courses-content" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px 40px 20px' }}>
        {/* Header */}
        <Box className="enrolled-courses-header" sx={{ mb: 4 }}>
          <h1
            style={{
              fontSize: '32px',
              fontWeight: '700',
              color: '#1a1a1a',
              marginBottom: '10px',
            }}
          >
            My Enrolled Courses
          </h1>
          <p
            style={{
              fontSize: '16px',
              color: '#666',
              margin: '0',
            }}
          >
            {enrolledCourses.length} {enrolledCourses.length === 1 ? 'course' : 'courses'} enrolled
          </p>
        </Box>

        {/* Courses Grid */}
        {enrolledCourses.length > 0 ? (
          <div
            className="enrolled-courses-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '24px',
            }}
          >
            {enrolledCourses.map((course) => (
              <div
                className="enrolled-course-card"
                key={course._id}
                title={course.title}
                onClick={() => navigate(`/course/${course._id}`)}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
                }}
              >
                {/* Course Image */}
                <div
                  className="enrolled-course-image"
                  style={{
                    width: '100%',
                    height: '160px',
                    backgroundColor: '#e0e0e0',
                    overflow: 'hidden',
                  }}
                >
                  {course.thumbnail ? (
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                        backgroundColor: '#f0f0f0',
                      }}
                    >
                      <FaBook style={{ fontSize: '40px', color: '#999' }} />
                    </div>
                  )}
                </div>

                {/* Course Title Above Info */}
                <div
                  className="enrolled-course-title"
                  style={{
                    padding: '12px 16px',
                    backgroundColor: '#f9f9f9',
                    borderBottom: '1px solid #eee',
                  }}
                >
                  <h3
                    style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#1a1a1a',
                      margin: '0',
                      lineHeight: '1.4',
                    }}
                  >
                    {course.title}
                  </h3>
                </div>

                {/* Course Info */}
                <div className="enrolled-course-info" style={{ padding: '16px' }}>
                  {/* Category */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '12px',
                      color: '#1565C0',
                      fontWeight: '600',
                      marginBottom: '12px',
                      backgroundColor: '#E3F2FD',
                      padding: '6px 12px',
                      borderRadius: '4px',
                      width: 'fit-content',
                    }}
                  >
                    {course.category}
                  </div>

                  {/* Lecture Count */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '13px',
                      color: '#1565C0',
                      fontWeight: '500',
                    }}
                  >
                    <FaBook style={{ fontSize: '13px' }} />
                    {course.lectures?.length || 0} lectures
                  </div>

                  {/* View Button */}
                  <Button
                    fullWidth
                    sx={{
                      marginTop: '12px',
                      backgroundColor: '#1565C0',
                      color: 'white',
                      textTransform: 'none',
                      fontWeight: '600',
                      padding: '8px',
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      fontSize: '14px',
                      '&:hover': {
                        backgroundColor: '#0d47a1',
                      },
                    }}
                  >
                    View Course
                    <FaArrowRight style={{ fontSize: '12px' }} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Empty State
          <Box
            className="enrolled-courses-empty-state"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '400px',
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '40px 20px',
              textAlign: 'center',
            }}
          >
            <FaBook style={{ fontSize: '64px', color: '#ccc', marginBottom: '20px' }} />
            <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#1a1a1a', marginBottom: '10px' }}>
              No Enrolled Courses Yet
            </h2>
            <p style={{ fontSize: '16px', color: '#666', marginBottom: '30px' }}>
              You haven't enrolled in any courses yet. Start learning today!
            </p>
            <Button
              onClick={() => navigate('/all-courses')}
              variant="contained"
              sx={{
                backgroundColor: '#1565C0',
                color: 'white',
                textTransform: 'none',
                fontWeight: '600',
                padding: '10px 30px',
                fontSize: '16px',
                borderRadius: '6px',
                '&:hover': {
                  backgroundColor: '#0d47a1',
                },
              }}
            >
              Explore Courses
            </Button>
          </Box>
        )}
      </div>
      <ChatBot courseId={null} courseName="Enrolled Courses" />
    </Box>
  );
}

export default EnrolledCourses;
