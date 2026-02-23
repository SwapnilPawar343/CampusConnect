import React from 'react'
import StudentProfile from './Student/pages/StudentProfile'
import AlumniProfile from './Alumni/pages/AlumniProfile'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom'
import Login from './Login'
import Registration from './Registration'
// import StudentDashboard from './Student/pages/StudentDashboard'
// import AlumniDashboard from './Alumni/pages/AlumniDashboard'
import QnA from './Student/pages/QnA'
import MyQues from './Student/pages/MyQues'
import MentorRecommendation from './Student/pages/MentorRecommendation'
import CareerPrediction from './Student/pages/CareerPrediction'
import Navbar from './Student/components/Navbar'
import { StudentContextProvider } from './context/studentContext'
import StudentResource from './Student/pages/StudentResource'

const Layout = () => {
  const location = useLocation()
  const hideNavbarRoutes = ['/', '/login', '/register']
  const shouldShowNavbar = !hideNavbarRoutes.includes(location.pathname)

  return (
    <>
      {shouldShowNavbar && <Navbar />}
      <Outlet />
    </>
  )
}

const App = () => {
  return (
    <Router>
      <StudentContextProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Registration />} />
            <Route path="/student-dashboard" element={<StudentDashboard />} />
            <Route path="/alumni-dashboard" element={<AlumniDashboard />} />
            <Route path="/qna" element={<QnA />} />
            <Route path="/my-questions" element={<MyQues />} />
            <Route path="/mentor-recommendation" element={<MentorRecommendation />} />
            <Route path="/career-prediction" element={<CareerPrediction />} />
            <Route path="/student/profile" element={<StudentProfile />} />
            <Route path="/alumni/profile" element={<AlumniProfile />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Route>
        </Routes>
      </StudentContextProvider>
    </Router>
  )
}

export default App
