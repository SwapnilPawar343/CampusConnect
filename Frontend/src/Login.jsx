import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

const fieldBaseClass =
  'w-full rounded-2xl border bg-slate-950/60 px-4 py-3 text-slate-100 placeholder:text-slate-500 shadow-sm outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20'

const themeButtonClass =
  'inline-flex w-full items-center justify-center rounded-2xl bg-linear-to-r from-pink-600 via-purple-600 to-indigo-600 px-4 py-3 font-semibold text-white shadow-lg shadow-pink-950/30 transition duration-200 hover:scale-[1.01] hover:from-pink-500 hover:via-purple-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-pink-400/30'


const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()
  const validateForm = () => {
    const newErrors = {}
    
    if (!email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email'
    }
    
    if (!password) {
      newErrors.password = 'Password is required'
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    
    return newErrors
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    const newErrors = validateForm()
    
    if (Object.keys(newErrors).length === 0) {
      try {
        console.log('Login attempt with:', { email, password })
        if (email.includes('@ghrce.raisoni.net')) {
          console.log('Attempting student login with:', { email, password })
          const response = await axios.post('http://localhost:4000/api/students/login', { email, password });
          console.log('Received response from server:', response.data);
          const data= response.data;
          console.log('Login response:', data);
          if (data.success) {
            localStorage.removeItem('Alumnitoken');
            localStorage.removeItem('alumni');
            localStorage.setItem('Studenttoken',data.token);
            localStorage.setItem('student', JSON.stringify(data.student));
            localStorage.setItem('activeRole', 'student');
            navigate('/student-dashboard')
            alert('Login successful as student!')
          } else {
            alert(data.message)
          }
        } else {
          console.log('Attempting alumni login with:', { email, password })
          const response = await axios.post('http://localhost:4000/api/alumni/login', { email, password });
          console.log('Received response from server:', response.data);
          const data = response.data;
          console.log('Login response:', data);
          if (data.success) {
            localStorage.removeItem('Studenttoken');
            localStorage.removeItem('student');
            localStorage.setItem('Alumnitoken', data.token);
            localStorage.setItem('alumni', JSON.stringify(data.alumni));
            localStorage.setItem('activeRole', 'alumni');
            navigate('/alumni-dashboard');
            alert('Login successful as alumni!')
          } else {
            alert('Invalid credentials for alumni!')
          }
        }
      } catch (error) {
        console.error('Login error:', error);
        if (error.response?.data?.message) {
          alert(error.response.data.message);
        } else {
          alert('Login failed. Please try again.');
        }
      }
    } else {
      setErrors(newErrors)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-10 text-slate-100 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(236,72,153,0.18),_transparent_35%),radial-gradient(circle_at_top_right,_rgba(99,102,241,0.18),_transparent_30%),linear-gradient(135deg,_rgba(2,6,23,0.98),_rgba(15,23,42,0.96))]" />
      <div className="absolute left-0 top-20 h-64 w-64 rounded-full bg-pink-500/10 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />

      <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-[32px] border border-white/10 bg-slate-950/75 shadow-[0_30px_80px_rgba(15,23,42,0.55)] backdrop-blur-2xl lg:grid-cols-[1.05fr_0.95fr]">
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
                  <p className="text-sm text-slate-300">Connect with your campus community</p>
                </div>
              </div>

              <h2 className="max-w-md text-4xl font-semibold leading-tight text-white">
                One place for students, alumni, and everything campus.
              </h2>
              <p className="mt-5 max-w-lg text-base leading-7 text-slate-300">
                Sign in to reach mentors, share resources, and stay connected through a clean, focused workspace.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-slate-400">Theme</p>
                <p className="mt-1 font-semibold text-white">Dark glass UI</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-slate-400">Access</p>
                <p className="mt-1 font-semibold text-white">Students & alumni</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-slate-400">Network</p>
                <p className="mt-1 font-semibold text-white">Career support</p>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 lg:p-10">
            <div className="mx-auto w-full max-w-md">
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
                <p className="mt-2 text-sm text-slate-400">Connect with your campus community</p>
              </div>

              <div className="mb-8">
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-pink-300/90">Welcome back</p>
                <h3 className="mt-3 text-3xl font-bold text-white">Login to continue</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Use your student or alumni email to access your dashboard.
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-200">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (errors.email) setErrors({ ...errors, email: '' })
                    }}
                    placeholder="Enter your email"
                    className={`${fieldBaseClass} ${errors.email ? 'border-red-500/70 focus:border-red-400 focus:ring-red-400/20' : 'border-white/10'}`}
                  />
                  {errors.email && <p className="mt-2 text-sm text-red-300">{errors.email}</p>}
                </div>

                <div>
                  <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-200">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      if (errors.password) setErrors({ ...errors, password: '' })
                    }}
                    placeholder="Enter your password"
                    className={`${fieldBaseClass} ${errors.password ? 'border-red-500/70 focus:border-red-400 focus:ring-red-400/20' : 'border-white/10'}`}
                  />
                  {errors.password && <p className="mt-2 text-sm text-red-300">{errors.password}</p>}
                </div>

                <div className="flex items-center justify-between gap-4 text-sm">
                  <label className="flex items-center gap-2 text-slate-300">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-white/20 bg-slate-900 text-pink-500 focus:ring-pink-400/30"
                    />
                    Remember me
                  </label>
                  <Link to="#" className="font-medium text-pink-300 transition hover:text-pink-200">
                    Forgot Password?
                  </Link>
                </div>

                <button type="submit" className={themeButtonClass}>
                  Login
                </button>
              </form>

              <div className="my-8 flex items-center gap-4">
                <div className="h-px flex-1 bg-white/10" />
                <span className="text-xs uppercase tracking-[0.24em] text-slate-500">or</span>
                <div className="h-px flex-1 bg-white/10" />
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center">
                <p className="text-sm text-slate-300">
                  Don&apos;t have an account?{' '}
                  <Link to="/register" className="font-semibold text-pink-300 transition hover:text-pink-200">
                    Register here
                  </Link>
                </p>
                <p className="mt-2 text-xs text-slate-500">
                  By logging in, you agree to our Terms & Conditions and Privacy Policy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
