import React, { useState } from 'react'

const StudentDashboard = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

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

  const events = [
    { id: 1, title: 'Tech Interview Workshop', date: 'Mar 15' },
    { id: 2, title: 'AI/ML Webinar', date: 'Mar 18' },
    { id: 3, title: 'Resume Review Session', date: 'Mar 20' },
    { id: 4, title: 'Company Hiring Fair', date: 'Mar 25' },
    { id: 5, title: 'System Design Bootcamp', date: 'Apr 1' }
  ]

  const [currentEventIndex, setCurrentEventIndex] = useState(0)

  const nextEvent = () => {
    setCurrentEventIndex((prevIndex) => (prevIndex + 1) % events.length)
  }

  const prevEvent = () => {
    setCurrentEventIndex((prevIndex) => (prevIndex - 1 + events.length) % events.length)
  }

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
          {/* Events Carousel */}
          <div className='bg-white rounded-lg p-6 border border-blue-300 border-opacity-50 hover:shadow transition'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='text-xl font-bold text-blue-800'>Upcoming Events</h3>
              <div className='flex gap-2'>
                <button
                  onClick={prevEvent}
                  className='px-3 py-1 rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200 transition'
                  aria-label='Previous event'
                >
                  ←
                </button>
                <button
                  onClick={nextEvent}
                  className='px-3 py-1 rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200 transition'
                  aria-label='Next event'
                >
                  →
                </button>
              </div>
            </div>
            <div className='bg-linear-to-br from-blue-500 to-blue-600 rounded-lg p-5 text-white'>
              <p className='font-bold text-lg'>{events[currentEventIndex].title}</p>
              <p className='text-sm text-blue-100 mt-2'>{events[currentEventIndex].date}</p>
            </div>
            <div className='mt-3 text-sm text-blue-600'>
              {currentEventIndex + 1} / {events.length}
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
                    className='bg-linear-to-r from-green-400 to-blue-600 h-3 rounded-full'
                    style={{ width: `${careerPrediction.probability}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <p className='text-blue-600 mb-2'>Top Companies</p>
                <div className='flex flex-wrap gap-2'>
                  {careerPrediction.companies.map((company) => (
                    <span
                      key={company}
                      className='px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm'
                    >
                      {company}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Mentor Card */}
          <div className='bg-linear-to-br from-blue-600 to-blue-500 rounded-lg p-6 text-white border border-blue-700 border-opacity-50 hover:shadow transition'>
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
                <div
                  key={resource.id}
                  className='flex items-center justify-between p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition cursor-pointer'
                >
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
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg p-8 shadow-lg max-w-md w-full mx-4'>
            <h2 className='text-2xl font-bold text-blue-800 mb-4'>Edit Profile</h2>
            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-semibold text-blue-700 mb-1'>Name</label>
                <input
                  type='text'
                  defaultValue={studentData.name}
                  className='w-full px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:border-blue-600'
                />
              </div>
              <div>
                <label className='block text-sm font-semibold text-blue-700 mb-1'>Email</label>
                <input
                  type='email'
                  defaultValue={studentData.email}
                  className='w-full px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:border-blue-600'
                />
              </div>
              <div>
                <label className='block text-sm font-semibold text-blue-700 mb-1'>Major</label>
                <input
                  type='text'
                  defaultValue={studentData.major}
                  className='w-full px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:border-blue-600'
                />
              </div>
              <div className='flex gap-3 mt-6'>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className='flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 rounded-lg transition'
                >
                  Cancel
                </button>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className='flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition'
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default StudentDashboard
