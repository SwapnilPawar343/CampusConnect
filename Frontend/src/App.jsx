import React from 'react'
import StudentDashboard from '../../Frontend/src/pages/StudentDashboard'
import AlumniDashboard from './Alumni/AlumniDashboard'

const App = () => {
  return (
    <div>
      <AlumniDashboard />
      <p className='text-xl text-orange-500'>lets connect</p>
    </div>
  )
}

export default App
