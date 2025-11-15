import React from 'react'
import { useContext } from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import EmailVerify from './pages/EmailVerify'
import ResetPassword from './pages/ResetPassword'
import Courses from './pages/Courses' // Add this import
import MyCourses from './pages/MyCourses';
import { ToastContainer } from 'react-toastify';
import LoadingScreen from './components/LoadingScreen'
import 'react-toastify/dist/ReactToastify.css';
import { AppContent } from './context/Appcontext';




const App = () => {
  const { isLoading } = useContext(AppContent);

  if (isLoading) return <LoadingScreen />;
  return (
    <div>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/email-verify' element={<EmailVerify />} />
        <Route path='/courses' element={<Courses />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route path='/my-courses' element={<MyCourses />} />


      </Routes>
      
{      <ToastContainer
        position="top-right"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        limit={3}
      />}
    </div>
  )
}

export default App