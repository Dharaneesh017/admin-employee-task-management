import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await axios.post('/api/auth/register', formData);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-16 rounded-lg shadow-lg w-full max-w-xl border border-gray-200">
        <h1 className="text-4xl font-extrabold text-center mb-8 text-blue-600">Employee Registration</h1>
        
        {success ? (
          <div className="text-center py-6">
            <h2 className="text-xl font-bold text-green-600 mb-2">Success!</h2>
            <p className="text-sm text-gray-600">Registration successful! Please wait for admin approval. Redirecting...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>}
            
            <div>
              <label className="block text-xl font-bold mb-3">Full Name</label>
              <input 
                type="text" required 
                className="w-full"
                placeholder="Ex: Dharaneesh"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-xl font-bold mb-3">Email Address</label>
              <input 
                type="email" required 
                className="w-full"
                placeholder="dharaneeshj454@gmail.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-xl font-bold mb-3">Password</label>
              <input 
                type="password" required 
                className="w-full"
                placeholder="Choose a password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>

            <button 
              type="submit" disabled={loading}
              className="w-full bg-blue-600 text-white py-4 rounded font-bold text-xl hover:bg-blue-700 mt-4"
            >
              {loading ? 'Registering...' : 'Complete Registration'}
            </button>
            
            <p className="text-center text-xl mt-10 font-medium">
              Already have an account? <Link to="/login" className="text-blue-600 font-extrabold hover:underline">Login here</Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default Register;
