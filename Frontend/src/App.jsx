import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom'
import Login from './Login'
import Registration from './Registration'
import StudentDashboard from './Student/pages/StudentDashboard'
import AlumniDashboard from './Alumni/pages/AlumniDashboard'
import QnA from './Student/pages/QnA'
import MyQues from './Student/pages/MyQues'
import MentorRecommendation from './Student/pages/MentorRecommendation'
import CareerPrediction from './Student/pages/CareerPrediction'
import StudentNavbar from './Student/components/Navbar'
import AlumniNavbar from './Alumni/components/Navbar'
import { StudentContextProvider } from './context/studentContext'
import StudentResource from './Student/pages/StudentResource'
import AddResource from './Student/pages/AddResource'
import StudentProfile from './Student/pages/StudentProfile'
import AlumniProfile from './Alumni/pages/AlumniProfile'
import Quations from './Alumni/pages/Quations'
import MyAnswers from './Alumni/pages/MyAnswers'
import AlumniResource from './Alumni/pages/AlumniResource'

const Layout = () => {
  const location = useLocation()
  const hideNavbarRoutes = ['/', '/login', '/register', '/add-resource']
  const shouldShowNavbar = !hideNavbarRoutes.includes(location.pathname)

  const hasAlumniSession = Boolean(localStorage.getItem('alumni'))
  const hasStudentSession = Boolean(localStorage.getItem('student'))

  const isAlumniRoute =
    location.pathname.startsWith('/alumni') ||
    location.pathname === '/questions' ||
    location.pathname === '/my-answers'

  const isStudentRoute =
    location.pathname.startsWith('/student') ||
    location.pathname === '/qna' ||
    location.pathname === '/my-questions' ||
    location.pathname === '/mentor-recommendation' ||
    location.pathname === '/career-prediction' ||
    location.pathname === '/resources'

  let NavbarComponent = StudentNavbar

  if (isAlumniRoute) {
    NavbarComponent = AlumniNavbar
  } else if (isStudentRoute) {
    NavbarComponent = StudentNavbar
  } else if (hasAlumniSession && !hasStudentSession) {
    NavbarComponent = AlumniNavbar
  }

  return (
    <>
      {shouldShowNavbar && <NavbarComponent />}
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
            <Route path="/student-resource" element={<StudentResource />} />
            <Route path="/resources" element={<StudentResource />} />
            <Route path="/alumni-resource" element={<AlumniResource />} />
            <Route path="/alumni/resources" element={<AlumniResource />} />
            <Route path="/add-resource" element={<AddResource />} />
            <Route path="/questions" element={<Quations/>} />
            <Route path="/my-answers" element={<MyAnswers />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Route>
        </Routes>
      </StudentContextProvider>
    </Router>
  )
}

export default App
