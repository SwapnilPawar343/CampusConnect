import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const Registration = () => {
  const [role, setRole] = useState('student') // 'student' or 'alumni'
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    department: '',
    yearOfStudy: '',
    jobRole: '',
    companyName: '',
    skills: '',
    idCard: null,
  })
  const [errors, setErrors] = useState({})

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
      if (!/\S+@college\.edu\.\S+|\S+@(student\.)?college\.\S+/.test(formData.email)) {
        newErrors.email = 'Please use your college email address'
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
      if (!formData.idCard) {
        newErrors.idCard = 'College ID Card is mandatory'
      }
    }

    if (!formData.skills.trim()) {
      newErrors.skills = 'Skills are required'
    }

    return newErrors
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = validateForm()

    if (Object.keys(newErrors).length === 0) {
      console.log('Registration attempt with:', { role, ...formData })
      alert(`${role.charAt(0).toUpperCase() + role.slice(1)} registration successful!`)
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Join CampusConnect</h1>
          <p className="text-gray-600 mt-2">Create your account and connect with your community</p>
        </div>

        {/* Role Selection Toggle */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-8">
            <p className="text-center text-sm font-semibold text-gray-700 mb-4">Select Your Role</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => {
                  setRole('student')
                  setErrors({})
                  setFormData({
                    fullName: '',
                    email: '',
                    password: '',
                    confirmPassword: '',
                    department: '',
                    yearOfStudy: '',
                    jobRole: '',
                    companyName: '',
                    skills: '',
                    idCard: null,
                  })
                }}
                className={`px-8 py-3 rounded-lg font-semibold transition-all duration-200 ${
                  role === 'student'
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                👨‍🎓 Student
              </button>
              <button
                onClick={() => {
                  setRole('alumni')
                  setErrors({})
                  setFormData({
                    fullName: '',
                    email: '',
                    password: '',
                    confirmPassword: '',
                    department: '',
                    yearOfStudy: '',
                    jobRole: '',
                    companyName: '',
                    skills: '',
                    idCard: null,
                  })
                }}
                className={`px-8 py-3 rounded-lg font-semibold transition-all duration-200 ${
                  role === 'alumni'
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                👔 Alumni
              </button>
            </div>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                  errors.fullName
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-indigo-500 focus:border-transparent'
                }`}
              />
              {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {role === 'student' ? 'College Email' : 'Email Address'}
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder={role === 'student' ? 'your.name@college.edu' : 'Enter your email'}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                  errors.email
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-indigo-500 focus:border-transparent'
                }`}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter a strong password"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                  errors.password
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-indigo-500 focus:border-transparent'
                }`}
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              <p className="text-gray-500 text-xs mt-1">Minimum 8 characters required</p>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Re-enter your password"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                  errors.confirmPassword
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-indigo-500 focus:border-transparent'
                }`}
              />
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
            </div>

            {/* Student-specific fields */}
            {role === 'student' && (
              <>
                {/* Department Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                      errors.department
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-indigo-500 focus:border-transparent'
                    }`}
                  >
                    <option value="">Select your department</option>
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                  {errors.department && <p className="text-red-500 text-sm mt-1">{errors.department}</p>}
                </div>

                {/* Year of Study Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Year of Study</label>
                  <select
                    name="yearOfStudy"
                    value={formData.yearOfStudy}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                      errors.yearOfStudy
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-indigo-500 focus:border-transparent'
                    }`}
                  >
                    <option value="">Select your year</option>
                    {yearsOfStudy.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                  {errors.yearOfStudy && <p className="text-red-500 text-sm mt-1">{errors.yearOfStudy}</p>}
                </div>
              </>
            )}

            {/* Alumni-specific fields */}
            {role === 'alumni' && (
              <>
                {/* Department Studied */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Department Studied</label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    placeholder="Enter your department"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                      errors.department
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-indigo-500 focus:border-transparent'
                    }`}
                  />
                  {errors.department && <p className="text-red-500 text-sm mt-1">{errors.department}</p>}
                </div>

                {/* Current Job Role */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Job Role</label>
                  <input
                    type="text"
                    name="jobRole"
                    value={formData.jobRole}
                    onChange={handleInputChange}
                    placeholder="e.g., Senior Software Engineer"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                      errors.jobRole
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-indigo-500 focus:border-transparent'
                    }`}
                  />
                  {errors.jobRole && <p className="text-red-500 text-sm mt-1">{errors.jobRole}</p>}
                </div>

                {/* Company Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    placeholder="Enter your company name"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                      errors.companyName
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-indigo-500 focus:border-transparent'
                    }`}
                  />
                  {errors.companyName && <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>}
                </div>
              </>
            )}

            {/* Skills Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
              <textarea
                name="skills"
                value={formData.skills}
                onChange={handleInputChange}
                placeholder="Enter your skills (comma-separated, e.g., Java, Python, React)"
                rows="3"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                  errors.skills
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-indigo-500 focus:border-transparent'
                }`}
              />
              {errors.skills && <p className="text-red-500 text-sm mt-1">{errors.skills}</p>}
            </div>

            {/* Upload College ID Card (Alumni only) */}
            {role === 'alumni' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload College ID Card <span className="text-red-500">*</span> (Mandatory)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-500 transition-colors">
                  <input
                    type="file"
                    id="idCard"
                    onChange={handleFileChange}
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                  />
                  <label
                    htmlFor="idCard"
                    className="cursor-pointer flex flex-col items-center justify-center"
                  >
                    <svg
                      className="w-12 h-12 text-gray-400 mb-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    <p className="text-gray-600 font-medium">Click to upload or drag and drop</p>
                    <p className="text-gray-500 text-sm mt-1">PDF, JPG or PNG (Max 5MB)</p>
                    {formData.idCard && (
                      <p className="text-green-600 text-sm mt-2 font-semibold">✓ {formData.idCard.name}</p>
                    )}
                  </label>
                </div>
                {errors.idCard && <p className="text-red-500 text-sm mt-1">{errors.idCard}</p>}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-3 px-4 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105 mt-6"
            >
              Create Account
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center border-t border-gray-300 pt-6">
            <p className="text-gray-700">
              Already have an account?{' '}
              <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-semibold transition-colors">
                Login here
              </Link>
            </p>
          </div>

          {/* Terms */}
          <p className="text-center text-xs text-gray-500 mt-4">
            By registering, you agree to our Terms & Conditions and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  )
}

export default Registration
