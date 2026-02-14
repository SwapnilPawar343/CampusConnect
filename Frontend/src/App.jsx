import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Login from './Login'
import Registration from './Registration'
import StudentDashboard from './Student/pages/StudentDashboard'
import AlumniDashboard from './Alumni/pages/AlumniDashboard'
import QnA from './Student/pages/QnA'
import MyQues from './Student/pages/MyQues'
import MentorRecommendation from './Student/pages/MentorRecommendation'
import CareerPrediction from './Student/pages/CareerPrediction'
import Navbar from './Student/components/Navbar'

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
          <Route path="/my-questions" element={<MyQues />} />
          <Route path="/mentor-recommendation" element={<MentorRecommendation />} />
          <Route path="/career-prediction" element={<CareerPrediction />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>

    </Router>
  )
}

export default App
