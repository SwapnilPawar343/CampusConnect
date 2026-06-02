import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

const fieldBaseClass =
  'w-full rounded-2xl border bg-slate-950/60 px-4 py-3 text-slate-100 placeholder:text-slate-500 shadow-sm outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20'

const selectClass = `${fieldBaseClass} appearance-none`

const themeButtonClass =
  'inline-flex w-full items-center justify-center rounded-2xl bg-linear-to-r from-pink-600 via-purple-600 to-indigo-600 px-4 py-3 font-semibold text-white shadow-lg shadow-pink-950/30 transition duration-200 hover:scale-[1.01] hover:from-pink-500 hover:via-purple-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-pink-400/30 disabled:cursor-not-allowed disabled:opacity-70'

const initialFormData = {
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
  age: '',
  department: '',
  yearOfStudy: '',
  graduationYear: '',
  jobRole: '',
  companyName: '',
  bio: '',
  skills: '',
  idCard: null,
}

const Registration = () => {
  const navigate = useNavigate()
  const [role, setRole] = useState('student') // 'student' or 'alumni'
  const [formData, setFormData] = useState(initialFormData)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'

  const departments = [
    'Computer Science',
    'Information Technology',
    'Electronics & Communication',
    'Mechanical Engineering',
    'Civil Engineering',
    'Business Administration',
    'Commerce',
    'Arts & Science',
    'Medicine',
    'Law'
  ]

  const yearsOfStudy = ['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year']

  const validateForm = () => {
    const newErrors = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full Name is required'
    }

    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (role === 'student') {
      if (!/^\S+@ghrce\.raisoni\.net$/.test(formData.email.trim())) {
        newErrors.email = 'Please use your @ghrce.raisoni.net email address'
      }
    } else {
      if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email'
      }
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    if (!formData.age || Number.isNaN(Number(formData.age)) || Number(formData.age) <= 0) {
      newErrors.age = 'Please enter a valid age'
    }

    if (role === 'student') {
      if (!formData.department) {
        newErrors.department = 'Department is required'
      }
      if (!formData.yearOfStudy) {
        newErrors.yearOfStudy = 'Year of Study is required'
      }
    } else {
      if (!formData.department.trim()) {
        newErrors.department = 'Department Studied is required'
      }
      if (!formData.jobRole.trim()) {
        newErrors.jobRole = 'Current Job Role is required'
      }
      if (!formData.companyName.trim()) {
        newErrors.companyName = 'Company Name is required'
      }
      if (!formData.graduationYear || Number.isNaN(Number(formData.graduationYear))) {
        newErrors.graduationYear = 'Graduation Year is required'
      }
      if (!formData.idCard) {
        newErrors.idCard = 'College ID Card is mandatory'
      }
    }

    if (!formData.skills.trim()) {
      newErrors.skills = 'Skills are required'
    }

    return newErrors
  }

  const parseSkills = (skillsText) => {
    return skillsText
      .split(',')
      .map((skill) => skill.trim())
      .filter(Boolean)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = validateForm()

    if (Object.keys(newErrors).length === 0) {
      try {
        setIsSubmitting(true)
        const skils = parseSkills(formData.skills)

        if (role === 'student') {
          const payload = {
            name: formData.fullName.trim(),
            email: formData.email.trim(),
            password: formData.password,
            age: Number(formData.age),
            department: formData.department.trim(),
            skils,
          }

          await axios.post(`${backendUrl}/api/students`, payload)
        } else {
          const payload = new FormData()
          payload.append('name', formData.fullName.trim())
          payload.append('email', formData.email.trim())
          payload.append('password', formData.password)
          payload.append('age', String(Number(formData.age)))
          payload.append('department', formData.department.trim())
          payload.append('currentCompany', formData.companyName.trim())
          payload.append('graduationYear', String(Number(formData.graduationYear)))
          payload.append('bio', formData.bio.trim())
          payload.append('jobRole', formData.jobRole.trim())
          skils.forEach((skill) => payload.append('skils', skill))

          if (formData.idCard) {
            payload.append('file', formData.idCard)
          }

          await axios.post(`${backendUrl}/api/alumni`, payload)
        }

        alert(`${role.charAt(0).toUpperCase() + role.slice(1)} registration successful!`)
        setFormData(initialFormData)
        setErrors({})
        navigate('/login')
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.'
        alert(errorMessage)
      } finally {
        setIsSubmitting(false)
      }
    } else {
      setErrors(newErrors)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' })
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    setFormData({
      ...formData,
      idCard: file,
    })
    if (errors.idCard) {
      setErrors({ ...errors, idCard: '' })
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-10 text-slate-100 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(236,72,153,0.18),_transparent_35%),radial-gradient(circle_at_top_right,_rgba(99,102,241,0.18),_transparent_30%),linear-gradient(135deg,_rgba(2,6,23,0.98),_rgba(15,23,42,0.96))]" />
      <div className="absolute left-0 top-20 h-64 w-64 rounded-full bg-pink-500/10 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />

      <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-[32px] border border-white/10 bg-slate-950/75 shadow-[0_30px_80px_rgba(15,23,42,0.55)] backdrop-blur-2xl lg:grid-cols-[0.95fr_1.05fr]">
          <div className="hidden flex-col justify-between border-r border-white/10 p-10 lg:flex">
            <div>
              <div className="mb-8 flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-pink-500 via-purple-500 to-indigo-500 text-white shadow-lg shadow-pink-950/40">
                  <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                    />
                  </svg>
                </div>
                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-white">CampusConnect</h1>
                  <p className="text-sm text-slate-300">Create your account and connect with your community</p>
                </div>
              </div>

              <h2 className="max-w-md text-4xl font-semibold leading-tight text-white">
                Build your profile in a space that matches the rest of the app.
              </h2>
              <p className="mt-5 max-w-lg text-base leading-7 text-slate-300">
                Register as a student or alumni, set your role, and start using the campus network with the same theme as the main application.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-slate-400">Role</p>
                <p className="mt-1 font-semibold text-white">Student or alumni</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-slate-400">Profile</p>
                <p className="mt-1 font-semibold text-white">Complete details</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-slate-400">Access</p>
                <p className="mt-1 font-semibold text-white">Connect instantly</p>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 lg:p-10">
            <div className="mx-auto w-full max-w-2xl">
              <div className="mb-8 text-center lg:hidden">
                <div className="mb-4 flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-pink-500 via-purple-500 to-indigo-500 text-white shadow-lg shadow-pink-950/40">
                    <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                      />
                    </svg>
                  </div>
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-white">CampusConnect</h1>
                <p className="mt-2 text-sm text-slate-400">Create your account and connect with your community</p>
              </div>

              <div className="mb-8">
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-pink-300/90">Join now</p>
                <h3 className="mt-3 text-3xl font-bold text-white">Create your account</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Fill in your details below to get started with the campus network.
                </p>
              </div>

              <div className="mb-8 rounded-3xl border border-white/10 bg-white/5 p-4 sm:p-5">
                <p className="text-center text-sm font-semibold uppercase tracking-[0.24em] text-slate-300">Select Your Role</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => {
                      setRole('student')
                      setErrors({})
                      setFormData(initialFormData)
                    }}
                    className={`rounded-2xl px-5 py-3 font-semibold transition duration-200 ${
                      role === 'student'
                        ? 'bg-linear-to-r from-pink-600 via-purple-600 to-indigo-600 text-white shadow-lg shadow-pink-950/30'
                        : 'border border-white/10 bg-slate-900/60 text-slate-300 hover:border-pink-400/30 hover:bg-slate-900'
                    }`}
                  >
                    Student
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setRole('alumni')
                      setErrors({})
                      setFormData(initialFormData)
                    }}
                    className={`rounded-2xl px-5 py-3 font-semibold transition duration-200 ${
                      role === 'alumni'
                        ? 'bg-linear-to-r from-pink-600 via-purple-600 to-indigo-600 text-white shadow-lg shadow-pink-950/30'
                        : 'border border-white/10 bg-slate-900/60 text-slate-300 hover:border-pink-400/30 hover:bg-slate-900'
                    }`}
                  >
                    Alumni
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-200">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className={`${fieldBaseClass} ${errors.fullName ? 'border-red-500/70 focus:border-red-400 focus:ring-red-400/20' : 'border-white/10'}`}
                  />
                  {errors.fullName && <p className="mt-2 text-sm text-red-300">{errors.fullName}</p>}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-200">
                    {role === 'student' ? 'College Email' : 'Email Address'}
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder={role === 'student' ? 'your.name@ghrce.raisoni.net' : 'Enter your email'}
                    className={`${fieldBaseClass} ${errors.email ? 'border-red-500/70 focus:border-red-400 focus:ring-red-400/20' : 'border-white/10'}`}
                  />
                  {errors.email && <p className="mt-2 text-sm text-red-300">{errors.email}</p>}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-200">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter a strong password"
                    className={`${fieldBaseClass} ${errors.password ? 'border-red-500/70 focus:border-red-400 focus:ring-red-400/20' : 'border-white/10'}`}
                  />
                  {errors.password && <p className="mt-2 text-sm text-red-300">{errors.password}</p>}
                  <p className="mt-2 text-xs text-slate-500">Minimum 8 characters required</p>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-200">Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Re-enter your password"
                    className={`${fieldBaseClass} ${errors.confirmPassword ? 'border-red-500/70 focus:border-red-400 focus:ring-red-400/20' : 'border-white/10'}`}
                  />
                  {errors.confirmPassword && <p className="mt-2 text-sm text-red-300">{errors.confirmPassword}</p>}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-200">Age</label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    placeholder="Enter your age"
                    min="1"
                    className={`${fieldBaseClass} ${errors.age ? 'border-red-500/70 focus:border-red-400 focus:ring-red-400/20' : 'border-white/10'}`}
                  />
                  {errors.age && <p className="mt-2 text-sm text-red-300">{errors.age}</p>}
                </div>

                {role === 'student' && (
                  <>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-200">Department</label>
                      <select
                        name="department"
                        value={formData.department}
                        onChange={handleInputChange}
                        className={`${selectClass} ${errors.department ? 'border-red-500/70 focus:border-red-400 focus:ring-red-400/20' : 'border-white/10'}`}
                      >
                        <option value="">Select your department</option>
                        {departments.map((dept) => (
                          <option key={dept} value={dept}>
                            {dept}
                          </option>
                        ))}
                      </select>
                      {errors.department && <p className="mt-2 text-sm text-red-300">{errors.department}</p>}
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-200">Year of Study</label>
                      <select
                        name="yearOfStudy"
                        value={formData.yearOfStudy}
                        onChange={handleInputChange}
                        className={`${selectClass} ${errors.yearOfStudy ? 'border-red-500/70 focus:border-red-400 focus:ring-red-400/20' : 'border-white/10'}`}
                      >
                        <option value="">Select your year</option>
                        {yearsOfStudy.map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                      {errors.yearOfStudy && <p className="mt-2 text-sm text-red-300">{errors.yearOfStudy}</p>}
                    </div>
                  </>
                )}

                {role === 'alumni' && (
                  <>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-200">Department Studied</label>
                      <input
                        type="text"
                        name="department"
                        value={formData.department}
                        onChange={handleInputChange}
                        placeholder="Enter your department"
                        className={`${fieldBaseClass} ${errors.department ? 'border-red-500/70 focus:border-red-400 focus:ring-red-400/20' : 'border-white/10'}`}
                      />
                      {errors.department && <p className="mt-2 text-sm text-red-300">{errors.department}</p>}
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-200">Current Job Role</label>
                      <input
                        type="text"
                        name="jobRole"
                        value={formData.jobRole}
                        onChange={handleInputChange}
                        placeholder="e.g., Senior Software Engineer"
                        className={`${fieldBaseClass} ${errors.jobRole ? 'border-red-500/70 focus:border-red-400 focus:ring-red-400/20' : 'border-white/10'}`}
                      />
                      {errors.jobRole && <p className="mt-2 text-sm text-red-300">{errors.jobRole}</p>}
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-200">Company Name</label>
                      <input
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleInputChange}
                        placeholder="Enter your company name"
                        className={`${fieldBaseClass} ${errors.companyName ? 'border-red-500/70 focus:border-red-400 focus:ring-red-400/20' : 'border-white/10'}`}
                      />
                      {errors.companyName && <p className="mt-2 text-sm text-red-300">{errors.companyName}</p>}
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-200">Graduation Year</label>
                      <input
                        type="number"
                        name="graduationYear"
                        value={formData.graduationYear}
                        onChange={handleInputChange}
                        placeholder="e.g., 2020"
                        className={`${fieldBaseClass} ${errors.graduationYear ? 'border-red-500/70 focus:border-red-400 focus:ring-red-400/20' : 'border-white/10'}`}
                      />
                      {errors.graduationYear && <p className="mt-2 text-sm text-red-300">{errors.graduationYear}</p>}
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-200">Bio (Optional)</label>
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        placeholder="Write a short bio"
                        rows="3"
                        className={fieldBaseClass}
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-200">Skills</label>
                  <textarea
                    name="skills"
                    value={formData.skills}
                    onChange={handleInputChange}
                    placeholder="Enter your skills (comma-separated, e.g., Java, Python, React)"
                    rows="3"
                    className={`${fieldBaseClass} ${errors.skills ? 'border-red-500/70 focus:border-red-400 focus:ring-red-400/20' : 'border-white/10'}`}
                  />
                  {errors.skills && <p className="mt-2 text-sm text-red-300">{errors.skills}</p>}
                </div>

                {role === 'alumni' && (
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-200">
                      Upload College ID Card <span className="text-pink-300">*</span> (Mandatory)
                    </label>
                    <div className="rounded-3xl border-2 border-dashed border-white/15 bg-slate-900/40 p-6 text-center transition hover:border-pink-400/50 hover:bg-slate-900/60">
                      <input
                        type="file"
                        id="idCard"
                        onChange={handleFileChange}
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="hidden"
                      />
                      <label htmlFor="idCard" className="flex cursor-pointer flex-col items-center justify-center">
                        <svg className="mb-2 h-12 w-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <p className="font-medium text-slate-200">Click to upload or drag and drop</p>
                        <p className="mt-1 text-sm text-slate-500">PDF, JPG or PNG (Max 5MB)</p>
                        {formData.idCard && (
                          <p className="mt-2 text-sm font-semibold text-emerald-300">{formData.idCard.name}</p>
                        )}
                      </label>
                    </div>
                    {errors.idCard && <p className="mt-2 text-sm text-red-300">{errors.idCard}</p>}
                  </div>
                )}

                <button type="submit" disabled={isSubmitting} className={`${themeButtonClass} mt-6`}>
                  {isSubmitting ? 'Creating Account...' : 'Create Account'}
                </button>
              </form>

              <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5 text-center">
                <p className="text-slate-300">
                  Already have an account?{' '}
                  <Link to="/login" className="font-semibold text-pink-300 transition hover:text-pink-200">
                    Login here
                  </Link>
                </p>
                <p className="mt-2 text-xs text-slate-500">
                  By registering, you agree to our Terms & Conditions and Privacy Policy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


export default Registration
