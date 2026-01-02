import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../redux/authSlice';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (email && password) {
      // Dummy validation success
      dispatch(login({ firstName: '', email }));
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gray-300 flex items-center justify-center mt-10">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg ">
        <h2 className="text-3xl font-bold text-center mb-6  text-gray-900 ">Welcome Back</h2>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-900 focus:border-gray-900"
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-900 focus:border-gray-900"
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>
          <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800">
            Sign In
          </button>
        </form>
        <div className="text-center mt-4">
            <Link to="/signup" className="text-sm text-blue-600">Don't have an account? Sign Up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;