import React, { useContext, useEffect, useMemo, useState } from 'react'
import { studentContext } from '../../context/studentContext'

const formatRelativeTime = (dateString) => {
  if (!dateString) return 'Just now'

  const createdAt = new Date(dateString)
  const now = new Date()
  const diffMs = now - createdAt

  if (Number.isNaN(createdAt.getTime())) return 'Just now'

  const minutes = Math.floor(diffMs / 60000)
  const hours = Math.floor(diffMs / 3600000)
  const days = Math.floor(diffMs / 86400000)

  if (minutes < 60) return `${Math.max(minutes, 1)}m ago`
  if (hours < 24) return `${hours}h ago`
  return `${days}d ago`
}

const AlumniDashboard = () => {
  const questionContext = useContext(studentContext)
  const { getToken } = questionContext

  const questions = useMemo(() => {
    return Array.isArray(questionContext?.question) ? questionContext.question : []
  }, [questionContext?.question])

  const alumniFromStorage = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('alumni') || '{}')
    } catch (error) {
      console.error('Failed to parse alumni from localStorage:', error)
      return {}
    }
  }, [])

  const alumniData = {
    name: alumniFromStorage.name || 'Alumni',
    email: alumniFromStorage.email || 'No email available',
    company: alumniFromStorage.currentCompany || 'Company not added',
    position: alumniFromStorage.jobRole || 'Role not added',
    graduationYear: alumniFromStorage.graduationYear || 'N/A',
    profileImage: 'https://via.placeholder.com/150',
  }

  const unansweredQuestions = useMemo(() => {
    return questions
      .filter((item) => !Array.isArray(item.answers) || item.answers.length === 0)
      .slice(0, 6)
  }, [questions])

  const [selectedStudent, setSelectedStudent] = useState(null)
  const [mentorshipRequests, setMentorshipRequests] = useState([])
  const [events, setEvents] = useState([])
  
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'

  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        const token = getToken()
        const response = await fetch(`${backendUrl}/api/mentor-requests/pending`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (response.ok) {
          const data = await response.json()
          setMentorshipRequests(data || [])
        }
      } catch (error) {
        console.error('Error fetching mentor requests:', error)
     }
   }

    fetchPendingRequests()
  }, [backendUrl, getToken])

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/events?audience=alumni`)
        const data = await response.json()
        if (response.ok) {
          setEvents(Array.isArray(data) ? data.slice(0, 5) : [])
        }
      } catch (error) {
        console.error('Error fetching events:', error)
      }
    }

    fetchEvents()
  }, [backendUrl])

  const handleAccept = async (requestId) => {
    try {
      const token = getToken()
      const response = await fetch(`${backendUrl}/api/mentor-requests/accept/${requestId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        setMentorshipRequests(mentorshipRequests.filter(req => req._id !== requestId))
        alert('Mentorship request accepted!')
      } else {
        alert('Failed to accept request')
      }
    } catch (error) {
      console.error('Error accepting request:', error)
      alert('An error occurred')
    }
  }

  const handleReject = async (requestId) => {
    try {
      const token = getToken()
      const response = await fetch(`${backendUrl}/api/mentor-requests/reject/${requestId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        setMentorshipRequests(mentorshipRequests.filter(req => req._id !== requestId))
        alert('Mentorship request rejected!')
      } else {
        alert('Failed to reject request')
      }
    } catch (error) {
      console.error('Error rejecting request:', error)
      alert('An error occurred')
    }
  }

  const contributionRanking = [
    { rank: 1, name: 'John Smith', questions: 45 },
    { rank: 2, name: 'Jane Doe', questions: 38 },
    { rank: 3, name: 'Michael Brown', questions: 32 },
    { rank: 4, name: 'Sarah Johnson', questions: 28 },
    { rank: 5, name: 'David Lee', questions: 24 }
  ]

  const statistics = {
    questionsAnswered: (questions || []).filter((item) => Array.isArray(item.answers) && item.answers.length > 0).length,
    studentsHelped: contributionRanking.length,
    averageRating: 4.8,
    contributionScore: unansweredQuestions.length * 10,
  }

  return (
    <div className='min-h-screen bg-linear-to-br from-purple-950 via-purple-900 to-indigo-950 p-4 md:p-8'>
      {/* Welcome Section */}
      <div className='mb-8'>
        <h1 className='text-4xl font-bold text-white'>
          Welcome back, {alumniData.name}! 👋
        </h1>
        <p className='text-purple-200 mt-2'>
          Thank you for giving back to the community. Keep inspiring future graduates!
        </p>
      </div>

      {/* Main Grid Layout */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>

        {/* Left Column */}
        <div className='lg:col-span-2 space-y-6'>

          {/* Profile Summary */}
          <div className='bg-linear-to-br from-slate-900/80 to-slate-950/80 rounded-2xl p-6 border border-pink-500/30 hover:shadow transition backdrop-blur-xl'>
            <div className='flex items-center gap-6'>
              <img
                src={alumniData.profileImage}
                alt={alumniData.name}
                className='w-20 h-20 rounded-full object-cover'
              />
              <div className='flex-1'>
                <h2 className='text-2xl font-bold text-white'>{alumniData.name}</h2>
                <p className='text-purple-200'>{alumniData.position} • {alumniData.company}</p>
                <p className='text-sm text-purple-300'>{alumniData.email}</p>
                <div className='mt-3 flex gap-4'>
                  <div>
                    <p className='text-sm text-pink-300'>Graduated</p>
                    <p className='text-xl font-bold text-white'>{alumniData.graduationYear}</p>
                  </div>
                </div>
              </div>
              <button className='bg-linear-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white px-6 py-2 rounded-lg transition'>
                Edit Profile
              </button>
            </div>
          </div>

          {/* Questions to Answer List */}
          <div className='bg-linear-to-br from-slate-900/80 to-slate-950/80 rounded-2xl p-6 border border-pink-500/30 hover:shadow transition backdrop-blur-xl'>
            <h3 className='text-xl font-bold text-white mb-4'>Unanswered Questions</h3>
            <div className='space-y-4'>
              {unansweredQuestions.length === 0 && (
                <div className='p-4 bg-slate-800/50 rounded-lg border-l-4 border-pink-400'>
                  <p className='font-semibold text-white'>No unanswered questions right now.</p>
                  <p className='text-sm text-purple-300 mt-1'>You are all caught up.</p>
                </div>
              )}

              {unansweredQuestions.map((item) => (
                <div key={item._id} className='p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition cursor-pointer border-l-4 border-pink-500'>
                  <p className='font-semibold text-white'>{item.title || item.description}</p>
                  {item.description && <p className='text-sm text-purple-200 mt-1'>{item.description}</p>}
                  <div className='mt-2 flex justify-between items-center'>
                    <p className='text-sm text-pink-300'>
                      Asked by: {item.askedBy?.name || 'Student'}
                    </p>
                    <p className='text-xs text-purple-300'>{formatRelativeTime(item.createdAt)}</p>
                  </div>
                  <button className='mt-3 text-pink-300 hover:text-pink-200 font-semibold text-sm'>
                    Answer →
                  </button>
                </div>
              ))}
            </div>
            <button className='w-full text-pink-300 hover:text-pink-200 font-bold mt-4'>
              View All Questions →
            </button>
          </div>

          {/* My Requests Panel */}
          <div className='bg-linear-to-br from-slate-900/80 to-slate-950/80 rounded-2xl p-6 border border-pink-500/30 hover:shadow transition backdrop-blur-xl'>
            <h3 className='text-xl font-bold text-white mb-4'>Mentorship Requests</h3>
            <div className='space-y-4'>
              {mentorshipRequests.length === 0 && (
                <div className='p-4 bg-slate-800/50 rounded-lg border-l-4 border-pink-400'>
                  <p className='font-semibold text-white'>No pending requests.</p>
                  <p className='text-sm text-purple-300 mt-1'>Check back later for new mentorship requests.</p>
                </div>
              )}
              
              {mentorshipRequests.map((request) => (
                <div key={request._id} className='p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition border-l-4 border-pink-500'>
                  <div className='flex items-start justify-between mb-2'>
                    <div>
                      <button 
                        onClick={() => setSelectedStudent({
                          name: request.student.name,
                          email: request.student.email,
                          department: request.student.department,
                          year: 'Student',
                          skills: request.student.skils || [],
                          about: 'Requesting mentorship'
                        })}
                        className='text-pink-300 font-semibold hover:text-pink-200 hover:underline cursor-pointer text-left'
                      >
                        {request.student.name}
                      </button>
                      <p className='text-sm text-purple-300 mt-1'>{request.student.department}</p>
                      <p className='text-sm text-purple-200 mt-2'>{request.message}</p>
                    </div>
                    <p className='text-xs text-purple-300 whitespace-nowrap ml-4'>{formatRelativeTime(request.createdAt)}</p>
                  </div>
                  <div className='flex gap-3 mt-3'>
                    <button 
                      onClick={() => handleAccept(request._id)}
                      className='flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 rounded-lg transition'
                    >
                      Accept
                    </button>
                    <button 
                      onClick={() => handleReject(request._id)}
                      className='flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg transition'
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className='space-y-6'>

          {/* Upcoming Events */}
          <div className='bg-linear-to-br from-slate-900/80 to-slate-950/80 rounded-2xl p-6 border border-pink-500/30 hover:shadow transition backdrop-blur-xl'>
            <h3 className='text-xl font-bold text-white mb-4'>Upcoming Events</h3>
            <div className='space-y-3'>
              {events.length === 0 ? (
                <p className='text-sm text-purple-300'>No upcoming events for alumni yet.</p>
              ) : (
                events.map((eventItem) => (
                  <div key={eventItem._id} className='p-3 bg-slate-800/50 rounded-lg border border-pink-500/20'>
                    <p className='font-semibold text-white'>{eventItem.name}</p>
                    <p className='text-xs text-pink-300 mt-1'>{new Date(eventItem.date).toLocaleDateString()}</p>
                    <p className='text-xs text-purple-300 mt-2 line-clamp-2'>{eventItem.description}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Contribution Ranking Card */}
          <div className='bg-linear-to-br from-slate-900/80 to-slate-950/80 rounded-2xl p-6 border border-pink-500/30 hover:shadow transition backdrop-blur-xl'>
            <h3 className='text-xl font-bold text-white mb-4'>Top Contributors</h3>
            <div className='space-y-3'>
              {contributionRanking.map((contributor) => (
                <div key={contributor.rank} className='flex items-center justify-between p-3 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition'>
                  <div className='flex items-center gap-3'>
                    <div className='w-8 h-8 bg-linear-to-r from-pink-600 to-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm'>
                      {contributor.rank}
                    </div>
                    <div>
                      <p className='font-semibold text-white'>{contributor.name}</p>
                      <p className='text-xs text-purple-300'>{contributor.questions} answers</p>
                    </div>
                  </div>
                  <span className='text-pink-300 font-bold'>{contributor.questions}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Statistics Section */}
          <div className='grid grid-cols-2 gap-4'>
            {/* Questions Answered */}
            <div className='bg-linear-to-br from-slate-900/80 to-slate-950/80 rounded-2xl p-6 border border-pink-500/30 hover:shadow transition text-center backdrop-blur-xl'>
              <p className='text-pink-300 text-sm font-semibold'>Questions Answered</p>
              <p className='text-3xl font-bold text-white mt-2'>{statistics.questionsAnswered}</p>
              <div className='mt-3 h-2 bg-slate-700 rounded-full'>
                <div className='h-2 bg-linear-to-r from-pink-600 to-purple-600 rounded-full' style={{ width: '85%' }}></div>
              </div>
            </div>

            {/* Students Helped */}
            <div className='bg-linear-to-br from-slate-900/80 to-slate-950/80 rounded-2xl p-6 border border-pink-500/30 hover:shadow transition text-center backdrop-blur-xl'>
              <p className='text-pink-300 text-sm font-semibold'>Students Helped</p>
              <p className='text-3xl font-bold text-white mt-2'>{statistics.studentsHelped}</p>
              <div className='mt-3 h-2 bg-slate-700 rounded-full'>
                <div className='h-2 bg-linear-to-r from-pink-600 to-purple-600 rounded-full' style={{ width: '70%' }}></div>
              </div>
            </div>

            {/* Average Rating */}
            <div className='bg-linear-to-br from-slate-900/80 to-slate-950/80 rounded-2xl p-6 border border-pink-500/30 hover:shadow transition text-center backdrop-blur-xl'>
              <p className='text-pink-300 text-sm font-semibold'>Average Rating</p>
              <p className='text-3xl font-bold text-white mt-2'>{statistics.averageRating} ⭐</p>
              <p className='text-xs text-purple-300 mt-2'>Highly rated</p>
            </div>

            {/* Contribution Score */}
            <div className='bg-linear-to-br from-slate-900/80 to-slate-950/80 rounded-2xl p-6 border border-pink-500/30 hover:shadow transition text-center backdrop-blur-xl'>
              <p className='text-pink-300 text-sm font-semibold'>Contribution Score</p>
              <p className='text-3xl font-bold text-white mt-2'>{statistics.contributionScore}</p>
              <p className='text-xs text-purple-300 mt-2'>Top performer</p>
            </div>
          </div>
        </div>
      </div>

      {/* Student Info Modal */}
      {selectedStudent && (
        <div className='fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50'>
          <div className='bg-linear-to-br from-slate-900/95 to-slate-950/95 border border-pink-500/30 rounded-2xl shadow-lg p-8 max-w-md w-full'>
            <div className='flex justify-between items-start mb-4'>
              <h2 className='text-2xl font-bold text-white'>Student Profile</h2>
              <button 
                onClick={() => setSelectedStudent(null)}
                className='text-purple-300 hover:text-white text-2xl font-bold'
              >
                ×
              </button>
            </div>

            <div className='space-y-4'>
              {/* Name */}
              <div>
                <p className='text-sm text-purple-300 font-semibold'>Name</p>
                <p className='text-lg text-white'>{selectedStudent.name}</p>
              </div>

              {/* Email */}
              <div>
                <p className='text-sm text-purple-300 font-semibold'>Email</p>
                <p className='text-lg text-white'>{selectedStudent.email}</p>
              </div>

              {/* Department */}
              <div>
                <p className='text-sm text-purple-300 font-semibold'>Department</p>
                <p className='text-lg text-white'>{selectedStudent.department}</p>
              </div>

              {/* Year */}
              <div>
                <p className='text-sm text-purple-300 font-semibold'>Year of Study</p>
                <p className='text-lg text-white'>{selectedStudent.year}</p>
              </div>

              {/* Skills */}
              <div>
                <p className='text-sm text-purple-300 font-semibold mb-2'>Skills</p>
                <div className='flex flex-wrap gap-2'>
                  {selectedStudent.skills && selectedStudent.skills.map((skill, idx) => (
                    <span key={idx} className='bg-linear-to-r from-pink-600 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium'>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* About */}
              <div>
                <p className='text-sm text-purple-300 font-semibold'>About</p>
                <p className='text-purple-100'>{selectedStudent.about}</p>
              </div>

              {/* Close Button */}
              <button 
                onClick={() => setSelectedStudent(null)}
                className='w-full bg-linear-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-bold py-2 rounded-lg transition mt-4'
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AlumniDashboard
