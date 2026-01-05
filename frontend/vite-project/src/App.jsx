import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import SignUp from './pages/Signup.jsx'
import Login from './pages/Login.jsx'
import Profile from './pages/Profile.jsx'
import EditProfile from './pages/EditProfile.jsx'
import ForgetPassword from './pages/ForgetPassword.jsx'
import Dashboard from './pages/Educator/Dashboard.jsx'
import Courses from './pages/Educator/Courses.jsx'
import CreateCourse from './pages/Educator/CreateCourse.jsx'
import EditCourse from './pages/Educator/EditCourse.jsx'
import CreateLecture from './pages/Educator/CreateLecture.jsx'
import EditLecture from './pages/Educator/editlectures.jsx'
import ViewCourse from './pages/ViewCourse.jsx'
import AllCourses from './pages/allCourse.jsx'
import { ToastContainer } from 'react-toastify';
import useGetCurrentUser from './customHooks/getCurrentUser.js'

function App() {
  useGetCurrentUser();

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/all-courses" element={<AllCourses />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route path='/profile' element={<Profile />} />
      <Route path='/edit-profile' element={<EditProfile />} />
      <Route path='/forget-password' element={<ForgetPassword />} />
      <Route path='/educator/dashboard' element={<Dashboard />} />
      <Route path='/educator/courses' element={<Courses />} />
      <Route path='/educator/create-course' element={<CreateCourse />} />
      <Route path='/educator/edit-course/:courseId' element={<EditCourse />} />
      <Route path='/educator/course/:courseId/lectures' element={<CreateLecture />} />
      <Route path='/educator/course/:courseId/lecture/:lectureId/edit' element={<EditLecture />} />
      <Route path='/course/:courseId' element={<ViewCourse />} />
    </Routes>
  )
}

export default App