import React from 'react'

const AlumniDashboard = () => {
  // Sample alumni data
  const alumniData = {
    name: 'Jane Smith',
    email: 'jane@example.com',
    company: 'Tech Solutions Inc.',
    position: 'Senior Product Manager',
    graduationYear: 2020,
    profileImage: 'https://via.placeholder.com/150'
  }

  const questionsToAnswer = [
    { id: 1, question: 'How to transition from engineering to product management?', asker: 'John Doe', date: '2 days ago' },
    { id: 2, question: 'Best resources for learning system design?', asker: 'Alice Johnson', date: '5 days ago' },
    { id: 3, question: 'Career growth tips in tech industry?', asker: 'Bob Wilson', date: '1 week ago' }
  ]

  const jobLinks = [
    { id: 1, title: 'Senior Engineer - Python', company: 'Tech Corp', link: '#' },
    { id: 2, title: 'Product Manager', company: 'Startup XYZ', link: '#' },
    { id: 3, title: 'Data Scientist', company: 'Analytics Pro', link: '#' }
  ]

  const contributionRanking = [
    { rank: 1, name: 'John Smith', questions: 45 },
    { rank: 2, name: 'Jane Doe', questions: 38 },
    { rank: 3, name: 'Michael Brown', questions: 32 },
    { rank: 4, name: 'Sarah Johnson', questions: 28 },
    { rank: 5, name: 'David Lee', questions: 24 }
  ]

  const statistics = {
    questionsAnswered: 127,
    studentsHelped: 89,
    averageRating: 4.8,
    contributionScore: 950
  }

  return (
    <div className='min-h-screen bg-blue-50 p-8'>
      {/* Welcome Section */}
      <div className='mb-8'>
        <h1 className='text-4xl font-bold text-blue-800'>
          Welcome back, {alumniData.name}! 👋
        </h1>
        <p className='text-blue-600 mt-2'>
          Thank you for giving back to the community. Keep inspiring future graduates!
        </p>
      </div>

      {/* Main Grid Layout */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        
        {/* Left Column */}
        <div className='lg:col-span-2 space-y-6'>
          
          {/* Profile Summary */}
          <div className='bg-white rounded-lg p-6 border border-blue-300 border-opacity-50 hover:shadow transition'>
            <div className='flex items-center gap-6'>
              <img
                src={alumniData.profileImage}
                alt={alumniData.name}
                className='w-20 h-20 rounded-full object-cover'
              />
              <div className='flex-1'>
                <h2 className='text-2xl font-bold text-blue-800'>{alumniData.name}</h2>
                <p className='text-blue-600'>{alumniData.position} • {alumniData.company}</p>
                <p className='text-sm text-blue-500'>{alumniData.email}</p>
                <div className='mt-3 flex gap-4'>
                  <div>
                    <p className='text-sm text-blue-600'>Graduated</p>
                    <p className='text-xl font-bold text-blue-700'>{alumniData.graduationYear}</p>
                  </div>
                </div>
              </div>
              <button className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition'>
                Edit Profile
              </button>
            </div>
          </div>

          {/* Questions to Answer List */}
          <div className='bg-white rounded-lg p-6 border border-blue-300 border-opacity-50 hover:shadow transition'>
            <h3 className='text-xl font-bold text-blue-800 mb-4'>Questions to Answer</h3>
            <div className='space-y-4'>
              {questionsToAnswer.map((item) => (
                <div key={item.id} className='p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition cursor-pointer border-l-4 border-blue-600'>
                  <p className='font-semibold text-blue-900'>{item.question}</p>
                  <div className='mt-2 flex justify-between items-center'>
                    <p className='text-sm text-blue-600'>Asked by: {item.asker}</p>
                    <p className='text-xs text-blue-500'>{item.date}</p>
                  </div>
                  <button className='mt-3 text-blue-600 hover:text-blue-700 font-semibold text-sm'>
                    Answer →
                  </button>
                </div>
              ))}
            </div>
            <button className='w-full text-blue-600 hover:text-blue-700 font-bold mt-4'>
              View All Questions →
            </button>
          </div>

          {/* Share Job Links Panel */}
          <div className='bg-white rounded-lg p-6 border border-blue-300 border-opacity-50 hover:shadow transition'>
            <h3 className='text-xl font-bold text-blue-800 mb-4'>Job Opportunities</h3>
            <p className='text-sm text-blue-600 mb-4'>Share opportunities with our students</p>
            <div className='space-y-3'>
              {jobLinks.map((job) => (
                <div key={job.id} className='flex items-center justify-between p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition'>
                  <div>
                    <p className='font-semibold text-blue-900'>{job.title}</p>
                    <p className='text-xs text-blue-600'>{job.company}</p>
                  </div>
                  <button className='text-blue-600 hover:text-blue-700 text-lg'>
                    ↗
                  </button>
                </div>
              ))}
            </div>
            <button className='w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg mt-4 transition'>
              + Add New Opportunity
            </button>
          </div>
        </div>

        {/* Right Column */}
        <div className='space-y-6'>
          
          {/* Contribution Ranking Card */}
          <div className='bg-white rounded-lg p-6 border border-blue-300 border-opacity-50 hover:shadow transition'>
            <h3 className='text-xl font-bold text-blue-800 mb-4'>Top Contributors</h3>
            <div className='space-y-3'>
              {contributionRanking.map((contributor) => (
                <div key={contributor.rank} className='flex items-center justify-between p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition'>
                  <div className='flex items-center gap-3'>
                    <div className='w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm'>
                      {contributor.rank}
                    </div>
                    <div>
                      <p className='font-semibold text-blue-900'>{contributor.name}</p>
                      <p className='text-xs text-blue-600'>{contributor.questions} answers</p>
                    </div>
                  </div>
                  <span className='text-blue-600 font-bold'>{contributor.questions}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Statistics Section */}
          <div className='grid grid-cols-2 gap-4'>
            {/* Questions Answered */}
            <div className='bg-white rounded-lg p-6 border border-blue-300 border-opacity-50 hover:shadow transition text-center'>
              <p className='text-blue-600 text-sm font-semibold'>Questions Answered</p>
              <p className='text-3xl font-bold text-blue-800 mt-2'>{statistics.questionsAnswered}</p>
              <div className='mt-3 h-2 bg-blue-200 rounded-full'>
                <div className='h-2 bg-blue-600 rounded-full' style={{ width: '85%' }}></div>
              </div>
            </div>

            {/* Students Helped */}
            <div className='bg-white rounded-lg p-6 border border-blue-300 border-opacity-50 hover:shadow transition text-center'>
              <p className='text-blue-600 text-sm font-semibold'>Students Helped</p>
              <p className='text-3xl font-bold text-blue-800 mt-2'>{statistics.studentsHelped}</p>
              <div className='mt-3 h-2 bg-blue-200 rounded-full'>
                <div className='h-2 bg-blue-600 rounded-full' style={{ width: '70%' }}></div>
              </div>
            </div>

            {/* Average Rating */}
            <div className='bg-white rounded-lg p-6 border border-blue-300 border-opacity-50 hover:shadow transition text-center'>
              <p className='text-blue-600 text-sm font-semibold'>Average Rating</p>
              <p className='text-3xl font-bold text-blue-800 mt-2'>{statistics.averageRating} ⭐</p>
              <p className='text-xs text-blue-600 mt-2'>Highly rated</p>
            </div>

            {/* Contribution Score */}
            <div className='bg-white rounded-lg p-6 border border-blue-300 border-opacity-50 hover:shadow transition text-center'>
              <p className='text-blue-600 text-sm font-semibold'>Contribution Score</p>
              <p className='text-3xl font-bold text-blue-800 mt-2'>{statistics.contributionScore}</p>
              <p className='text-xs text-blue-600 mt-2'>Top performer</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AlumniDashboard
