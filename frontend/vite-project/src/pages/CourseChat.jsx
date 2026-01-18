import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import axios from 'axios';
import CourseCommunityChat from '../component/CourseCommunityChat';

function CourseChat() {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isEducator, setIsEducator] = useState(false);

  // Fetch current user
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/user/current', {
          withCredentials: true,
        });
        console.log('Current user response:', response.data);
        setCurrentUser(response.data.user);
      } catch (err) {
        console.error('Error fetching user:', err);
        setError('Failed to load user information');
      }
    };

    fetchCurrentUser();
  }, []);

  // Fetch course data and check enrollment
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');

        // Fetch course
        const courseResponse = await axios.get(
          `http://localhost:3000/api/course/getcourse/${courseId}`,
          { withCredentials: true }
        );
        setCourse(courseResponse.data);

        // Check if current user is the educator
        if (currentUser && courseResponse.data.educator) {
          const isEdu = courseResponse.data.educator === currentUser._id || 
                        courseResponse.data.educator._id === currentUser._id;
          setIsEducator(isEdu);
          if (isEdu) {
            setIsEnrolled(true); // Educators have access without enrollment
            return;
          }
        }

        // Check enrollment (only if not educator)
        const enrollmentResponse = await axios.get(
          `http://localhost:3000/api/payment/check-enrollment/${courseId}`,
          { withCredentials: true }
        );
        setIsEnrolled(enrollmentResponse.data.enrolled);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load course information');
      } finally {
        setLoading(false);
      }
    };

    if (courseId && currentUser) {
      fetchData();
    }
  }, [courseId, currentUser]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Loading course...</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <p className="text-red-600 font-semibold">{error || 'Course not found'}</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!isEnrolled) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">
            You must be enrolled in this course to access the community chat room.
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => navigate(`/course/${courseId}`)}
              className="flex-1 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Enroll Now
            </button>
            <button
              onClick={() => navigate(-1)}
              className="flex-1 px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Get token from localStorage or use a dummy token (cookies will be sent automatically)
  const token = localStorage.getItem('token') || localStorage.getItem('jwtToken') || sessionStorage.getItem('token') || 'cookie-based';

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-gray-200 p-4 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <button
            onClick={() => navigate(`/course/${courseId}`)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            title="Back to course"
          >
            <FiArrowLeft size={20} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-800">{course.title}</h1>
            <p className="text-sm text-gray-500">Community Chat Room</p>
          </div>
        </div>
      </div>

      {/* Chat Component */}
      {token ? (
        <CourseCommunityChat
          courseId={courseId}
          courseName={course.title}
          userId={currentUser?._id || 'unknown'}
          token={token}
        />
      ) : (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <p className="text-red-600 font-semibold">No authentication token found</p>
            <p className="text-gray-600 mt-2">Please login first</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default CourseChat;
