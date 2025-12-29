import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import logo from "../assets/logo.jpg";
import { logout } from '../redux/userSlice';
import useGetCurrentUser from '../customHooks/getCurrentUser';

function Nav() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.userData);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const hoverTimeoutRef = useRef(null);

  // Fetch current user on component mount
  useGetCurrentUser();

  // Function to get user initials
  const getUserInitials = (name) => {
    if (!name) return '';
    const parts = name.trim().split(' ');
    return parts.map((part) => part[0]).join('').toUpperCase();
  };

  const initials = user ? getUserInitials(user.name) : '';

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const handleNavigate = (path) => {
    navigate(path);
    setShowProfileMenu(false);
  };

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setShowProfileMenu(true);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setShowProfileMenu(false);
    }, 100);
  };

  return (
    <div style={{
      width: '100%',
      height: '70px',
      position: 'fixed',
      top: 0,
      left: 0,
      padding: '10px 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: 'rgba(0, 0, 0, 0.28)',
      zIndex: 10
    }}>
      <div style={{ width: '20%', paddingLeft: '50px', cursor: 'pointer' }} onClick={() => handleNavigate('/')}>
        <img src={logo} alt="" style={{ width: '60px', borderRadius: '5px', border: '2px solid white' }} />
      </div>
      <div style={{ width: '30%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
        {user ? (
          <>
            {/* User Icon with Initials and Dropdown */}
            <div
              style={{
                position: 'relative',
              }}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <div
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  backgroundColor: '#4CAF50',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '20px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  transform: showProfileMenu ? 'scale(1.1)' : 'scale(1)',
                  boxShadow: showProfileMenu ? '0 0 10px rgba(76, 175, 80, 0.5)' : 'none',
                }}
                title={user.name}
              >
                {initials}
              </div>

              {/* Dropdown Menu */}
              {showProfileMenu && (
                <div
                  style={{
                    position: 'absolute',
                    top: '60px',
                    right: '0px',
                    backgroundColor: 'white',
                    border: '2px solid #333',
                    borderRadius: '8px',
                    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
                    zIndex: 1000,
                    minWidth: '150px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    onClick={() => handleNavigate('/profile')}
                    style={{
                      padding: '12px 16px',
                      color: '#333',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500',
                      borderBottom: '1px solid #e0e0e0',
                      transition: 'all 0.2s ease',
                      backgroundColor: '#f9f9f9',
                    }}
                    onMouseEnter={(e) => (e.target.style.backgroundColor = '#e8f5e9')}
                    onMouseLeave={(e) => (e.target.style.backgroundColor = '#f9f9f9')}
                  >
                    My Profile
                  </div>
                  <div
                    onClick={() => handleNavigate('/educator/courses')}
                    style={{
                      padding: '12px 16px',
                      color: '#333',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500',
                      transition: 'all 0.2s ease',
                      backgroundColor: '#f9f9f9',
                    }}
                    onMouseEnter={(e) => (e.target.style.backgroundColor = '#e8f5e9')}
                    onMouseLeave={(e) => (e.target.style.backgroundColor = '#f9f9f9')}
                  >
                    My Courses
                  </div>
                </div>
              )}
            </div>

            {/* Dashboard Button - Only show if user is not a student */}
            {user?.role !== 'student' && (
              <div
                style={{
                  padding: '10px 20px',
                  border: '2px solid white',
                  color: 'white',
                  backgroundColor: 'black',
                  borderRadius: '10px',
                  fontSize: '18px',
                  fontWeight: '300',
                  cursor: 'pointer',
                }}
                onClick={() => handleNavigate('/educator/dashboard')}
              >
                Dashboard
              </div>
            )}

            {/* Logout Button */}
            <span
              style={{
                padding: '10px 20px',
                backgroundColor: 'white',
                color: 'black',
                borderRadius: '10px',
                boxShadow: '0 0 0 2px black',
                fontSize: '18px',
                cursor: 'pointer',
              }}
              onClick={handleLogout}
            >
              LogOut
            </span>
          </>
        ) : (
          <>
            {/* Login Button - shown when not logged in */}
            <span
              style={{
                padding: '10px 20px',
                border: '2px solid white',
                color: 'white',
                borderRadius: '10px',
                fontSize: '18px',
                fontWeight: '300',
                cursor: 'pointer',
                backgroundColor: 'rgba(0, 0, 0, 0.84)',
              }}
              onClick={() => handleNavigate('/login')}
            >
              Login
            </span>
          </>
        )}
      </div>
    </div>
  );
}

export default Nav;