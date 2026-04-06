import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loading } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
    } catch (err) {
      setError(err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-16 rounded-lg shadow-lg w-full max-w-xl border border-gray-200">
        <h1 className="text-4xl font-extrabold text-center mb-2 text-blue-600">Task Management Login</h1>
        <p className="text-center text-gray-500 mb-10 font-bold text-lg italic">
          Note: Sign in as Employee or Admin to access your portal.
        </p>

        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xl font-bold mb-3">Email Address</label>
            <input
              type="email" required
              className="w-full"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xl font-bold mb-3">Password</label>
            <input
              type="password" required
              className="w-full"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit" disabled={loading}
            className="w-full bg-blue-600 text-white py-4 rounded font-bold text-xl hover:bg-blue-700 mt-4"
          >
            {loading ? 'Please wait...' : 'Sign In Now'}
          </button>
        </form>

        <p className="text-center text-xl mt-10 font-medium">
          New employee? <Link to="/register" className="text-blue-600 font-extrabold hover:underline">Apply for Access</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
