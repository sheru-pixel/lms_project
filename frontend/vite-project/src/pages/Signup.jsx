import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from "../assets/logo.jpg";
import google from "../assets/google.jpg";
import { IoEyeOutline, IoEye } from "react-icons/io5";
import { ClipLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import {useDispatch} from 'react-redux';
import {setUserData} from '../redux/userSlice';

function SignUp() {
  const [show, setShow] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch()
  

  const handleSignup = async() => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      toast.error('Please fill in all fields');
      return;
    }
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3000/api/auth/signup', {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: password,
        role
      }, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.status === 201 || response.status === 200) {
        toast.success('Signup successful! Redirecting to home...');
        dispatch(setUserData(response.data.user));
        setLoading(false);
        navigate('/');
      }
    } catch (error) {
      console.error('Signup error:', error.response?.data || error.message);
      setLoading(false);
      toast.error(error.response?.data?.message || 'Signup failed. Please try again.');
    }
  }
  return (
    <div style={{ backgroundColor: '#f5f5f5', width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: 0, padding: 0, fontFamily: "'Poppins', 'Segoe UI', sans-serif" }}>
      <form style={{ width: '100%', maxWidth: '450px', height: 'auto', backgroundColor: 'white', boxShadow: '0 8px 32px rgba(0,0,0,0.08)', borderRadius: '16px', display: 'flex', overflow: 'hidden', position: 'relative' }}>
        {/* left div */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', gap: '20px', padding: '40px 30px', fontFamily: "'Poppins', sans-serif", marginTop: '20px', marginBottom: '20px' }}>
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ fontWeight: '700', color: '#1a1a1a', fontSize: '28px', margin: '0 0 8px 0', letterSpacing: '-0.5px' }}>Let's Get Started</h1>
            <h2 style={{ color: '#b0b0b0', fontSize: '14px', fontWeight: '500', margin: 0, letterSpacing: '0.3px' }}>Create your account</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', maxWidth: '320px', alignItems: 'flex-start' }}>
            <label htmlFor="name" style={{ fontWeight: '600', fontSize: '13px', color: '#1a1a1a', letterSpacing: '0.3px' }}>Name</label>
            <input 
              id='name' 
              type='text' 
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ border: '1px solid #e0e0e0', width: '100%', height: '44px', fontSize: '14px', paddingLeft: '16px', borderRadius: '8px', fontFamily: "'Poppins', sans-serif", transition: 'all 0.3s', outline: 'none', boxSizing: 'border-box' }} 
              placeholder='Your name' 
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', maxWidth: '320px', alignItems: 'flex-start' }}>
            <label htmlFor='email' style={{ fontWeight: '600', fontSize: '13px', color: '#1a1a1a', letterSpacing: '0.3px' }}>Email</label>
            <input 
              id='email' 
              type='email' 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ border: '1px solid #e0e0e0', width: '100%', height: '44px', fontSize: '14px', paddingLeft: '16px', borderRadius: '8px', fontFamily: "'Poppins', sans-serif", transition: 'all 0.3s', outline: 'none', boxSizing: 'border-box' }} 
              placeholder='Your email' 
            />
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

          <div style={{ display: 'flex', width: '100%', maxWidth: '320px', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
            <span
              onClick={() => setRole('student')}
              style={{
                padding: '10px 20px',
                border: role === 'student' ? '2px solid #1a1a1a' : '2px solid #e0e0e0',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: role === 'student' ? '600' : '500',
                transition: 'all 0.3s',
                color: role === 'student' ? '#1a1a1a' : '#666',
                backgroundColor: role === 'student' ? '#f0f0f0' : 'transparent'
              }}
            >Student</span>
            <span
              onClick={() => setRole('educator')}
              style={{
                padding: '10px 20px',
                border: role === 'educator' ? '2px solid #1a1a1a' : '2px solid #e0e0e0',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: role === 'educator' ? '600' : '500',
                transition: 'all 0.3s',
                color: role === 'educator' ? '#1a1a1a' : '#666',
                backgroundColor: role === 'educator' ? '#f0f0f0' : 'transparent'
              }}
            >Educator</span>
          </div>

          <button 
            onClick={handleSignup}
            disabled={loading}
            style={{ width: '100%', maxWidth: '320px', height: '44px', backgroundColor: '#1a1a1a', color: 'white', cursor: loading ? 'not-allowed' : 'pointer', borderRadius: '8px', border: 'none', fontWeight: '600', fontSize: '14px', letterSpacing: '0.3px', transition: 'all 0.3s', fontFamily: "'Poppins', sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: loading ? 0.7 : 1 }}
          >{loading ? <ClipLoader color="#ffffff" size={20} /> : 'Sign Up'}</button>

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
            Already have an account? <span onClick={() => navigate("/login")} style={{ color: '#1a1a1a', fontWeight: '600', cursor: 'pointer', textDecoration: 'underline' }}>Sign In</span>
          </div>
        </div>
              
        {/* right div */}
        <div style={{ width: '40%', height: 'auto', backgroundColor: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: '40px 30px', gap: '30px', borderTopRightRadius: '16px', borderBottomRightRadius: '16px' }}>
          <img src={logo} alt="logo" style={{ width: '120px', height: 'auto', boxShadow: 'none', borderRadius: '0px' }} />
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '24px', color: 'white', fontWeight: '700', letterSpacing: '1.5px', display: 'block', lineHeight: '1.4' }}>VIRTUAL<br />COURSES</span>
          </div>
        </div>

      </form>
    </div>
  );
}

export default SignUp;