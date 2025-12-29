import React, { useState } from 'react';
import logo from "../assets/logo.jpeg";
import google from "../assets/google.jpg";
import { IoEyeOutline, IoEye } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';

function Login() {
    const [show, setShow] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogin = async () => {
      if (!email.trim() || !password.trim()) {
        toast.error('Please enter both email and password');
        return;
      }
      setLoading(true);
      try {
        const loginData = {
          email: email.trim().toLowerCase(),
          password: password
        };
        console.log('Sending login request with:', loginData);
        
        const response = await axios.post('http://localhost:3000/api/auth/login', loginData, {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        if (response.status === 201 || response.status === 200) {
          console.log('Login successful:', response.data);
          toast.success('Login successful! Redirecting...');
          dispatch(setUserData(response.data.user));
          setLoading(false);
          navigate('/');
        }
      } catch (error) {
        console.error('Login error:', error.response?.data || error.message);
        setLoading(false);
        toast.error(error.response?.data?.message || 'Login failed. Please try again.');
      }
    }
  
    return (
      <div style={{ backgroundColor: '#f5f5f5', width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: 0, padding: 0, fontFamily: "'Poppins', 'Segoe UI', sans-serif" }}>
        <form style={{ width: '100%', maxWidth: '450px', height: 'auto', backgroundColor: 'white', boxShadow: '0 8px 32px rgba(0,0,0,0.08)', borderRadius: '16px', display: 'flex', overflow: 'hidden', position: 'relative' }}>
          {/* left div */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', gap: '20px', padding: '40px 30px', fontFamily: "'Poppins', sans-serif", marginTop: '20px', marginBottom: '20px' }}>
            <div style={{ textAlign: 'center' }}>
              <h1 style={{ fontWeight: '700', color: '#1a1a1a', fontSize: '28px', margin: '0 0 8px 0', letterSpacing: '-0.5px' }}>Welcome Back</h1>
              <h2 style={{ color: '#b0b0b0', fontSize: '14px', fontWeight: '500', margin: 0, letterSpacing: '0.3px' }}>Log in to your account</h2>
            </div>
  
            
  
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', maxWidth: '320px', alignItems: 'flex-start' }}>
              <label htmlFor='email' style={{ fontWeight: '600', fontSize: '13px', color: '#1a1a1a', letterSpacing: '0.3px' }}>Email</label>
              <input id='email' type='email' value={email} onChange={(e) => setEmail(e.target.value)} style={{ border: '1px solid #e0e0e0', width: '100%', height: '44px', fontSize: '14px', paddingLeft: '16px', borderRadius: '8px', fontFamily: "'Poppins', sans-serif", transition: 'all 0.3s', outline: 'none', boxSizing: 'border-box' }} placeholder='Your email' />
            </div>
  
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', maxWidth: '320px', alignItems: 'flex-start', position: 'relative' }}>
              <label htmlFor="password" style={{ fontWeight: '600', fontSize: '13px', color: '#1a1a1a', letterSpacing: '0.3px' }}>Password</label>
              <input
                id='password'
                type={show ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ border: '1px solid #e0e0e0', width: '100%', height: '44px', fontSize: '14px', paddingLeft: '16px', paddingRight: '40px', borderRadius: '8px', fontFamily: "'Poppins', sans-serif", transition: 'all 0.3s', outline: 'none', boxSizing: 'border-box' }}
                placeholder='Your password'
              />
              {show ? (
                <IoEyeOutline
                  style={{ position: 'absolute', width: '18px', height: '18px', cursor: 'pointer', right: '12px', top: '36px', color: '#666' }}
                  onClick={() => setShow(prev => !prev)}
                />
              ) : (
                <IoEye
                  style={{ position: 'absolute', width: '18px', height: '18px', cursor: 'pointer', right: '12px', top: '36px', color: '#666' }}
                  onClick={() => setShow(prev => !prev)}
                />
              )}
            </div>
  
            
  
            <button 
              onClick={handleLogin}
              disabled={loading}
              style={{ width: '100%', maxWidth: '320px', height: '44px', backgroundColor: '#1a1a1a', color: 'white', cursor: loading ? 'not-allowed' : 'pointer', borderRadius: '8px', border: 'none', fontWeight: '600', fontSize: '14px', letterSpacing: '0.3px', transition: 'all 0.3s', fontFamily: "'Poppins', sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: loading ? 0.7 : 1 }}
            >{loading ? <ClipLoader color="#ffffff" size={20} /> : 'Log In'}</button>
            <span 
              onClick={() => navigate('/forget-password')}
              className='text-[13px] cursor-pointer text-[#828080]'
              style={{ cursor: 'pointer', textDecoration: 'underline', transition: 'color 0.3s' }}
              onMouseEnter={(e) => e.target.style.color = '#1a1a1a'}
              onMouseLeave={(e) => e.target.style.color = '#828080'}
            >
              Forgot Password?
            </span>
            <div style={{ width: '100%', maxWidth: '320px', display: 'flex', alignItems: 'center', gap: '12px', margin: '8px 0' }}>
              <div style={{ flex: 1, height: '1px', backgroundColor: '#e0e0e0' }}></div>
              <div style={{ fontSize: '12px', color: '#999', fontWeight: '500', whiteSpace: 'nowrap' }}>Or continue with</div>
              <div style={{ flex: 1, height: '1px', backgroundColor: '#e0e0e0' }}></div>
            </div>
  
            <div style={{ width: '100%', maxWidth: '320px', height: '44px', border: '1.5px solid #e0e0e0', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', cursor: 'pointer', transition: 'all 0.3s', backgroundColor: '#f9f9f9' }}>
              <img src={google} style={{ width: '20px', height: '20px' }} alt="google" />
              <span style={{ fontSize: '14px', color: '#666', fontWeight: '500' }}>Google</span>
            </div>
  
            <div style={{ fontSize: '13px', color: '#999', textAlign: 'center', marginTop: '30px' }}>
              Don't have an account? <span onClick={() => navigate("/signup")} style={{ color: '#1a1a1a', fontWeight: '600', cursor: 'pointer', textDecoration: 'underline' }}>Sign Up</span>
            </div>
          </div>
  
          {/* right div */}
          <div style={{ width: '40%', height: 'auto', backgroundColor: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: '40px', gap: '30px' }}>
            <img src={logo} alt="logo" style={{ width: '120px', height: 'auto', boxShadow: 'none', borderRadius: '0px' }} />
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '24px', color: 'white', fontWeight: '700', letterSpacing: '1.5px', display: 'block', lineHeight: '1.4' }}>VIRTUAL<br />COURSES</span>
            </div>
          </div>
  
        </form>
      </div>
    );
}

export default Login