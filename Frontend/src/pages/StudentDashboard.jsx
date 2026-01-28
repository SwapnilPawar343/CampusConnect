import React from 'react'

const StudentDashboard = () => {
  // Sample student data
  const studentData = {
    name: 'John Doe',
    email: 'john@example.com',
    gpa: 3.85,
    major: 'Computer Science',
    year: 'Junior',
    profileImage: 'https://via.placeholder.com/150'
  }

  const careerPrediction = {
    role: 'Software Engineer',
    probability: 85,
    companies: ['Google', 'Microsoft', 'Amazon']
  }

  const mentorData = {
    name: 'Dr. Sarah Johnson',
    title: 'Senior Software Engineer',
    image: 'https://via.placeholder.com/100'
  }

  const resources = [
    { id: 1, title: 'DSA Masterclass', type: 'Video' },
    { id: 2, title: 'System Design Basics', type: 'Article' },
    { id: 3, title: 'Interview Prep Guide', type: 'PDF' }
  ]

  // const recentActivity = [
  //   { id: 1, action: 'Completed Resume Review', date: '2 days ago' },
  //   { id: 2, action: 'Attended Webinar', date: '5 days ago' },
  //   { id: 3, action: 'Started New Course', date: '1 week ago' }
  // ]

  return (
    <div className='min-h-screen bg-blue-50 p-8'>
      {/* Welcome Message */}
      <div className='mb-8'>
        <h1 className='text-4xl font-bold text-blue-800'>
          Welcome back, {studentData.name}! 👋
        </h1>
        <p className='text-blue-600 mt-2'>
          Here's your personalized dashboard to track your career growth
        </p>
      </div>

      {/* Main Grid Layout */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        
        {/* Left Column */}
        <div className='lg:col-span-2 space-y-6'>
          
          {/* Profile Summary Panel */}
          <div className='bg-white rounded-lg p-6 border border-blue-300 border-opacity-50 hover:shadow transition'>
            <div className='flex items-center gap-6'>
              <img
                src={studentData.profileImage}
                alt={studentData.name}
                className='w-20 h-20 rounded-full object-cover'
              />
              <div className='flex-1'>
                <h2 className='text-2xl font-bold text-blue-800'>{studentData.name}</h2>
                <p className='text-blue-600'>{studentData.major} • {studentData.year}</p>
                <p className='text-sm text-blue-500'>{studentData.email}</p>
                <div className='mt-3 flex gap-4'>
                  <div>
                    <p className='text-sm text-blue-600'>Current GPA</p>
                    <p className='text-xl font-bold text-blue-700'>{studentData.gpa}</p>
                  </div>
                </div>
              </div>
              <button className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition'>
                Edit Profile
              </button>
            </div>
          </div>

          {/* Career Prediction Card */}
          <div className='bg-white rounded-lg p-6 border border-blue-300 border-opacity-50 hover:shadow transition'>
            <h3 className='text-xl font-bold text-blue-800 mb-4'>Career Prediction</h3>
            <div className='space-y-4'>
              <div>
                <p className='text-blue-600 mb-2'>Predicted Role</p>
                <p className='text-2xl font-bold text-blue-700'>{careerPrediction.role}</p>
              </div>
              <div>
                <p className='text-blue-600 mb-2'>Match Probability</p>
                <div className='w-full bg-blue-200 rounded-full h-3'>
                  <div
                    className='bg-gradient-to-r from-green-400 to-blue-600 h-3 rounded-full'
                    style={{ width: `${careerPrediction.probability}%` }}
                  ></div>
                </div>
                <p className='text-sm text-blue-600 mt-1'>{careerPrediction.probability}% Match</p>
              </div>
              <div>
                <p className='text-blue-600 mb-2'>Top Companies Targeting You</p>
                <div className='flex gap-2 flex-wrap'>
                  {careerPrediction.companies.map((company, idx) => (
                    <span
                      key={idx}
                      className='bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium'
                    >
                      {company}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Mentor Recommendation Card */}
          <div className='bg-gradient-to-br from-blue-600 to-blue-500 rounded-lg p-6 text-white border border-blue-700 border-opacity-50 hover:shadow transition'>
            <h3 className='text-xl font-bold mb-4'>My Mentor</h3>
            <div className='flex items-center gap-4 mb-4'>
              <img
                src={mentorData.image}
                alt={mentorData.name}
                className='w-16 h-16 rounded-full object-cover'
              />
              <div>
                <p className='font-bold text-lg'>{mentorData.name}</p>
                <p className='text-blue-100'>{mentorData.title}</p>
              </div>
            </div>
            <button className='w-full bg-white text-blue-600 hover:bg-blue-50 font-bold py-2 rounded-lg transition'>
              Connect with Mentor
            </button>
          </div>
        </div>

        {/* Right Column */}
        <div className='space-y-6'>
          
          {/* Ask Question Card */}
          <div className='bg-white rounded-lg p-6 border border-blue-300 border-opacity-50 hover:shadow transition'>
            <h3 className='text-xl font-bold text-blue-800 mb-4'>Ask a Question</h3>
            <textarea
              placeholder='Ask anything about your career, courses, or growth...'
              className='w-full p-3 border border-blue-300 rounded-lg focus:outline-none focus:border-blue-600 resize-none'
              rows='4'
            ></textarea>
            <button className='w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg mt-3 transition'>
              Ask Now
            </button>
          </div>

          {/* Resources Card */}
          <div className='bg-white rounded-lg p-6 border border-blue-300 border-opacity-50 hover:shadow transition'>
            <h3 className='text-xl font-bold text-blue-800 mb-4'>My Resources</h3>
            <div className='space-y-3'>
              {resources.map((resource) => (
                <div key={resource.id} className='flex items-center justify-between p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition cursor-pointer'>
                  <div>
                    <p className='font-semibold text-blue-800'>{resource.title}</p>
                    <p className='text-xs text-blue-600'>{resource.type}</p>
                  </div>
                  <span className='text-blue-600 text-xl'>→</span>
                </div>
              ))}
            </div>
            <button className='w-full text-blue-600 hover:text-blue-700 font-bold mt-4'>
              View All Resources →
            </button>
          </div>

          {/* Recent Activity Section */}
          {/* <di className='bg-gradient-to-br from-[rgb(255,233,219)] to-[#f6d7d7] rounded-lg p-6 border border-black border-opacity-50 hover:shadow transition'>
            <h3 className='text-xl font-bold text-gray-800 mb-4'>Recent Activity</h3>
            <div className='space-y-4'>
              {recentActivity.map((activity) => (
                <div key={activity.id} className='pb-4 border-b border-gray-200 last:border-b-0'>
                  <p className='font-semibold text-gray-800'>{activity.action}</p>
                  <p className='text-xs text-gray-500'>{activity.date}</p>
                </div>
              ))}
            </div>
            <button className='w-full text-blue-600 hover:text-blue-700 font-bold mt-4'>
              View Full History →
            </button>
          </di> */}
        </div>
      </div>
    </div>
  )
}

export default StudentDashboard
