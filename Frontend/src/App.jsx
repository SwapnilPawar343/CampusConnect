import React from 'react'
import StudentDashboard from './pages/StudentDashboard'
import AlumniDashboard from './Alumni/AlumniDashboard'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Login from './pages/Login'
import Registration from './pages/Registration'
import QnA from './pages/QnA'
import MentorRecommendation from './pages/MentorRecommendation'
import CareerPrediction from './pages/CareerPrediction'
import Navbar from './components/Navbar'

const Layout = ({ children }) => {
  const location = useLocation()
  const hideNavbarRoutes = ['/', '/login', '/register']
  const shouldShowNavbar = !hideNavbarRoutes.includes(location.pathname)

  return (
    <>
      {shouldShowNavbar && <Navbar />}
      {children}
    </>
  )
}

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/alumni-dashboard" element={<AlumniDashboard />} />
          <Route path="/qna" element={<QnA />} />
          <Route path="/mentor-recommendation" element={<MentorRecommendation />} />
          <Route path="/career-prediction" element={<CareerPrediction />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
