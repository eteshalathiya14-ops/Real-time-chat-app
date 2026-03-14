import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';

function Signup() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState('Please Select Your Profile Picture');
  const [form, setForm] = useState({
    fullname: '',
    username: '',
    password: '',
    confirmpassword: '',
    gender: '',
    profile_picture: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = e => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setForm(f => ({ ...f, profile_picture: files[0] }));
      setFileName(files[0] ? files[0].name : 'Please Select Your Profile Picture');
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });
    try {
      const res = await fetch('http://localhost:3000/api/auth/signup', {
        method: 'POST',
        credentials: 'include',
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        setSuccess('Signup successful!');
        setTimeout(() => navigate('/login'), 1200); // Redirect after 1.2s
      } else {
        setError(data.message || 'Signup failed');
      }
    } catch (err) {
      setError('Server error');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-pink-100 via-blue-100 to-purple-100 relative overflow-hidden">
      {/* Abstract floating blur circles */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-200 opacity-40 rounded-full blur-3xl animate-float" style={{zIndex:0}}></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-200 opacity-40 rounded-full blur-3xl animate-float2" style={{zIndex:0}}></div>
      <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-pink-200 opacity-30 rounded-full blur-2xl animate-float3" style={{zIndex:0, transform:'translate(-50%,-50%)'}}></div>
      {/* Glassmorphism Card */}
      <div className="relative z-10 w-full max-w-md mx-auto rounded-3xl shadow-2xl bg-white bg-opacity-80 backdrop-blur-lg p-8 flex flex-col gap-8 animate-fade-in">
        <div className="flex flex-col items-center gap-2">
          <h2 className="text-3xl font-extrabold text-center text-purple-700 mb-1 tracking-tight">Create Your Account</h2>
          <p className="text-gray-600 text-center text-base">Sign up to start chatting</p>
        </div>
        <form className="flex flex-col gap-5" onSubmit={handleSubmit} encType="multipart/form-data">
          <input
            type="text"
            name="fullname"
            placeholder="Full Name"
            value={form.fullname}
            onChange={handleChange}
            className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all text-lg text-gray-900  bg-white bg-opacity-60 backdrop-blur-md shadow-sm hover:border-blue-400 focus:border-purple-400"
            required
          />
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all text-lg text-gray-900  bg-white bg-opacity-60 backdrop-blur-md shadow-sm hover:border-purple-400 focus:border-blue-400"
            required
          />
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-300 transition-all text-lg text-gray-900 bg-white bg-opacity-60 backdrop-blur-md shadow-sm hover:border-pink-400 focus:border-blue-400 w-full"
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
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmpassword"
              placeholder="Confirm Password"
              value={form.confirmpassword}
              onChange={handleChange}
              className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all text-lg text-gray-900 bg-white bg-opacity-60 backdrop-blur-md shadow-sm hover:border-purple-400 focus:border-pink-400 w-full"
              required
            />
            <span
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
              onClick={() => setShowConfirmPassword(v => !v)}
            >
              {/* FontAwesome eye icon */}
              {showConfirmPassword ? (
                < i className="fa-solid fa-eye text-purple-500 text-sm"></i>
              ) : (
                <i className="fa-solid fa-eye-slash text-purple-500 text-sm"></i>
              )}
            </span>
          </div>
          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            className="px-4 py-3 rounded-lg border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all text-lg bg-white bg-opacity-60 backdrop-blur-md shadow-sm"
            required
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white bg-opacity-60 backdrop-blur-md">
            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              className="bg-blue-100 text-blue-700 px-4 py-2 font-semibold hover:bg-blue-200"
            >
              Choose File
            </button>
            <span className="px-4 text-blue-800 text-sm">
              {fileName}
            </span>
            <input
              ref={fileInputRef}
              type="file"
              name="profile_picture"
              accept="image/*"
              className="hidden"
              onChange={handleChange}
            />
          </div>
          {error && <div className="text-red-500 text-center font-semibold">{error}</div>}
          {success && <div className="text-green-600 text-center font-semibold">{success}</div>}
          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-pink-400 via-blue-400 to-purple-400 text-white font-bold py-3 rounded-lg hover:scale-105 hover:shadow-xl transition-all shadow-lg text-lg mt-2 focus:outline-none focus:ring-2 focus:ring-purple-300">
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>
        </form>
        <div className="text-center text-gray-500 mt-2 text-base">
          Already have an account? <a href="/login" className="text-purple-600 hover:underline font-semibold">Login</a>
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

export default Signup