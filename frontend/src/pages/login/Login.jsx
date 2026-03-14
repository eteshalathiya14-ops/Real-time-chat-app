import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [form, setForm] = useState({
    username: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const res = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      })

      const data = await res.json()

      if (data.success || data.code === 200) {
        setSuccess("Login Successful!")
        await login()
        navigate('/home')
      } else {
        setError(data.message || "Login Failed")
      }
    } catch (error) {
      setError("Server Error")
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-pink-100 via-blue-100 to-purple-100 relative overflow-hidden">
      {/* Abstract floating blur circles */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-200 opacity-40 rounded-full blur-3xl animate-float" style={{zIndex:0}}></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-200 opacity-40 rounded-full blur-3xl animate-float2" style={{zIndex:0}}></div>
      <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-pink-200 opacity-30 rounded-full blur-2xl animate-float3" style={{zIndex:0, transform:'translate(-50%,-50%)'}}></div>
      
      {/* Glassmorphism Card */}
      <div className="relative z-10 w-full max-w-md mx-auto rounded-3xl shadow-2xl bg-white bg-opacity-80 backdrop-blur-lg p-8 flex flex-col gap-8 animate-fade-in">
        <div className="flex flex-col items-center gap-2">
          <h2 className="text-3xl font-extrabold text-center text-purple-700 mb-1 tracking-tight">Welcome Back!</h2>
          <p className="text-gray-600 text-center text-base">Sign in to continue chatting</p>
        </div>

        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded-xl border border-red-200 text-center font-semibold">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 text-green-600 p-3 rounded-xl border border-green-200 text-center font-semibold">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all text-lg text-gray-900 bg-white bg-opacity-60 backdrop-blur-md shadow-sm hover:border-purple-400 focus:border-blue-400"
            required
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-300 transition-all text-lg text-gray-900 bg-white bg-opacity-60 backdrop-blur-md shadow-sm hover:border-pink-400 focus:border-blue-400 w-full pr-10"
              required
            />
            <span
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
              onClick={() => setShowPassword(v => !v)}
            >
              {/* FontAwesome eye icon */}
              {showPassword ? (
                <i className="fa-solid fa-eye text-purple-500 text-sm"></i>
              ) : (
                <i className="fa-solid fa-eye-slash text-purple-500 text-sm"></i>
              )}
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-pink-400 via-blue-400 to-purple-400 text-white font-bold py-3 rounded-lg hover:scale-105 hover:shadow-xl transition-all shadow-lg text-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="text-center text-gray-500 mt-2 text-base">
          Don't have account? <a href="/signup" className="text-purple-600 hover:underline font-semibold">Sign Up</a>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        .animate-fade-in {
          animation: fadeIn 0.8s ease;
        }
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite alternate;
        }
        @keyframes float {
          0% { transform: translateY(0) scale(1); }
          100% { transform: translateY(30px) scale(1.05); }
        }
        .animate-float2 {
          animation: float2 7s ease-in-out infinite alternate;
        }
        @keyframes float2 {
          0% { transform: translateY(0) scale(1); }
          100% { transform: translateY(-40px) scale(1.08); }
        }
        .animate-float3 {
          animation: float3 5s ease-in-out infinite alternate;
        }
        @keyframes float3 {
          0% { transform: translateY(0) scale(1); }
          100% { transform: translateY(20px) scale(1.12); }
        }
      `}</style>
    </div>
  )
}

export default Login

