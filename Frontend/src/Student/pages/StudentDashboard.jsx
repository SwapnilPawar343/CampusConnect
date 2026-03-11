import React, { useState, useContext } from 'react'
import { studentContext } from '../../context/studentContext'

const StudentDashboard = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const questionContext = useContext(studentContext);
  const [studentData] = useState(JSON.parse(localStorage.getItem('student')) || {});
  const [question, setQuestion] = useState('');

  
  const careerPrediction = {
    role: studentData?.jobRecommendate || 'Not selected yet',
    probability: Number(studentData?.jobMatchPercent || 0),
    companies: []
  }

  const mentorData = {
    name: studentData?.mentorName || 'Not selected yet',
    title: studentData?.mentorRole || 'Select a mentor to get started',
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

  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const submitQuestion = async () => {
    const token = localStorage.getItem('token');
    if (!question.trim()) {
      alert('Please enter a question first.');
      return;
    }
    
    try {
      const response = await fetch('http://localhost:4000/api/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title: 'Question', description: question })
      });
      const data = await response.json();
      if (response.ok) {
        alert('Question submitted successfully!')
        setQuestion('')
        // Refresh questions in context
        questionContext.fetchQuestion();
      } else {
        alert(data.message || 'Failed to submit question')
      }
    } catch (error) {
      console.error('Error submitting question:', error);
      alert('An error occurred while submitting your question. Please try again later.');
    }
  }

  const nextEvent = () => {
    setCurrentEventIndex((prevIndex) => (prevIndex + 1) % events.length)
  }

  const prevEvent = () => {
    setCurrentEventIndex((prevIndex) => (prevIndex - 1 + events.length) % events.length)
  }

  const capitalizeName = (value) => {
    if (!value) return 'Student'

    return value
      .split(' ')
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 p-6 md:p-8'>
      {/* Animated Background Elements */}
      <div className='fixed inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute top-20 left-10 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse'></div>
        <div className='absolute bottom-20 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-2000'></div>
      </div>

      <div className='relative z-10 max-w-6xl mx-auto'>
        {/* Welcome Message */}
        <div className='mb-10 text-center'>
          <h1 className='text-4xl md:text-5xl font-black mb-3 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-300 to-pink-300'>
            Welcome back, {capitalizeName(studentData?.name)}! 👋
          </h1>
          <p className='text-purple-200 text-lg'>
            Track your career growth and discover your potential
          </p>
        </div>

        {/* Main Grid Layout */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          {/* Left Column */}
          <div className='lg:col-span-2 space-y-6'>
            {/* Events Carousel */}
            <div className='bg-gradient-to-br from-slate-900/80 to-slate-950/80 rounded-2xl p-6 border border-pink-500/30 backdrop-blur-xl shadow-lg'>
              <div className='flex items-center justify-between mb-6'>
                <h3 className='text-2xl font-bold text-white'>📅 Upcoming Events</h3>
                <div className='flex gap-2'>
                  <button
                    onClick={prevEvent}
                    className='px-3 py-2 rounded-lg bg-pink-500/20 text-pink-300 hover:bg-pink-500/30 transition border border-pink-500/30'
                    aria-label='Previous event'
                  >
                    ←
                  </button>
                  <button
                    onClick={nextEvent}
                    className='px-3 py-2 rounded-lg bg-pink-500/20 text-pink-300 hover:bg-pink-500/30 transition border border-pink-500/30'
                    aria-label='Next event'
                  >
                    →
                  </button>
                </div>
              </div>
              <div className='bg-gradient-to-br from-pink-600 to-purple-600 rounded-xl p-6 text-white shadow-lg'>
                <p className='font-bold text-xl'>{events[currentEventIndex].title}</p>
                <p className='text-pink-100 mt-2 text-sm'>{events[currentEventIndex].date}</p>
              </div>
              <div className='mt-4 text-sm text-purple-300'>
                {currentEventIndex + 1} / {events.length}
              </div>
            </div>

            {/* Career Prediction Card */}
            <div className='bg-gradient-to-br from-slate-900/80 to-slate-950/80 rounded-2xl p-6 border border-pink-500/30 backdrop-blur-xl shadow-lg'>
              <h3 className='text-2xl font-bold text-white mb-6'>🚀 Career Prediction</h3>
              <div className='space-y-6'>
                <div>
                  <p className='text-purple-300 mb-2 font-semibold text-sm'>PREDICTED ROLE</p>
                  <p className='text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-300 to-pink-400'>{careerPrediction.role}</p>
                </div>
                <div>
                  <div className='flex items-center justify-between mb-3'>
                    <p className='text-purple-300 font-semibold text-sm'>MATCH PROBABILITY</p>
                    <p className='text-xl font-bold text-pink-400'>{careerPrediction.probability}%</p>
                  </div>
                  <div className='w-full bg-slate-700 rounded-full h-3 overflow-hidden'>
                    <div
                      className='bg-gradient-to-r from-pink-500 to-purple-500 h-3 rounded-full shadow-lg shadow-pink-500/30 transition-all duration-500'
                      style={{ width: `${careerPrediction.probability}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mentor Card */}
            <div className='bg-gradient-to-br from-slate-900/80 to-slate-950/80 rounded-2xl p-6 border border-pink-500/30 backdrop-blur-xl shadow-lg'>
              <h3 className='text-2xl font-bold text-white mb-6'>👨‍🏫 My Mentor</h3>
              <div className='flex items-center gap-4 mb-6'>
                <div className='w-16 h-16 rounded-full bg-gradient-to-br from-pink-600 to-purple-600 flex items-center justify-center text-white font-bold text-xl'>
                  {mentorData.name.charAt(0)}
                </div>
                <div>
                  <p className='font-bold text-lg text-white'>{mentorData.name}</p>
                  <p className='text-purple-300'>{mentorData.title}</p>
                </div>
              </div>
              <button className='w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-bold py-3 rounded-lg transition'>
                Connect with Mentor
              </button>
            </div>
          </div>

          {/* Right Column */}
          <div className='space-y-6'>
            {/* Ask Question Card */}
            <div className='bg-gradient-to-br from-slate-900/80 to-slate-950/80 rounded-2xl p-6 border border-pink-500/30 backdrop-blur-xl shadow-lg'>
              <h3 className='text-xl font-bold text-white mb-4'>❓ Ask a Question</h3>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder='Ask about career, courses, or growth...'
                className='w-full p-3 bg-slate-700/30 border border-pink-500/30 rounded-lg focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20 resize-none text-white placeholder-purple-400 text-sm'
                rows='3'
              ></textarea>
              <button className='w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-bold py-2 rounded-lg mt-3 transition'
                onClick={() => submitQuestion()}>
                Ask Now
              </button>
            </div>

            {/* Resources Card */}
            <div className='bg-gradient-to-br from-slate-900/80 to-slate-950/80 rounded-2xl p-6 border border-pink-500/30 backdrop-blur-xl shadow-lg'>
              <h3 className='text-xl font-bold text-white mb-4'>📚 My Resources</h3>
              <div className='space-y-2'>
                {resources.map((resource) => (
                  <div
                    key={resource.id}
                    className='flex items-center justify-between p-3 bg-slate-700/30 border border-pink-500/20 rounded-lg hover:bg-slate-700/50 hover:border-pink-500/40 transition cursor-pointer group'
                  >
                    <div>
                      <p className='font-semibold text-purple-200 group-hover:text-white transition'>{resource.title}</p>
                      <p className='text-xs text-purple-400'>{resource.type}</p>
                    </div>
                    <span className='text-purple-400 group-hover:text-pink-300 transition'>→</span>
                  </div>
                ))}
              </div>
              <button className='w-full text-pink-400 hover:text-pink-300 font-bold mt-4 transition'>
                View All Resources →
              </button>
            </div>
          </div>
        </div>

        {/* Edit Profile Modal */}
        {isEditModalOpen && (
          <div className='fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50'>
            <div className='bg-gradient-to-br from-slate-900/90 to-slate-950/90 rounded-2xl p-8 shadow-2xl max-w-md w-full mx-4 border border-pink-500/30 backdrop-blur-xl'>
              <h2 className='text-2xl font-bold text-white mb-6'>Edit Profile</h2>
              <div className='space-y-4'>
                <div>
                  <label className='block text-sm font-semibold text-purple-300 mb-2'>Name</label>
                  <input
                    type='text'
                    defaultValue={studentData.name}
                    className='w-full px-4 py-2 bg-slate-700/30 border border-pink-500/30 rounded-lg focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20 text-white'
                  />
                </div>
                <div>
                  <label className='block text-sm font-semibold text-purple-300 mb-2'>Email</label>
                  <input
                    type='email'
                    defaultValue={studentData.email}
                    className='w-full px-4 py-2 bg-slate-700/30 border border-pink-500/30 rounded-lg focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20 text-white'
                  />
                </div>
                <div>
                  <label className='block text-sm font-semibold text-purple-300 mb-2'>Major</label>
                  <input
                    type='text'
                    defaultValue={studentData.major}
                    className='w-full px-4 py-2 bg-slate-700/30 border border-pink-500/30 rounded-lg focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20 text-white'
                  />
                </div>
                <div className='flex gap-3 mt-6'>
                  <button
                    onClick={() => setIsEditModalOpen(false)}
                    className='flex-1 bg-slate-700/50 hover:bg-slate-700 text-slate-300 font-bold py-2 rounded-lg transition border border-slate-600/30'
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setIsEditModalOpen(false)}
                    className='flex-1 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-bold py-2 rounded-lg transition'
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default StudentDashboard
