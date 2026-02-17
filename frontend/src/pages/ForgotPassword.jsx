import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, AlertCircle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { authService } from '../services/authService';

const ForgotPassword = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    
    try {
      const response = await authService.forgotPassword(username, email);
      if (response.data.success) {
        setSuccess(response.data.message);
        // Store credentials for next screen
        sessionStorage.setItem('recoveryUsername', username);        sessionStorage.setItem('recoveryEmail', email);        // Redirect to OTP verification after 1.5 seconds
        setTimeout(() => {
          navigate('/verification-code');
        }, 1500);
      } else {
        setError(response.data.message || 'Failed to initiate password recovery');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error initiating password recovery. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Same illustration as Login */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 items-center justify-center p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md"
        >
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-2xl font-bold text-white">H</span>
              </div>
              <span className="text-2xl font-display font-bold text-gray-800">Hero</span>
            </div>
            <h2 className="text-3xl font-display font-bold text-gray-800">
              Lead Nurturing Application
            </h2>
          </div>
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="h-64 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg"></div>
          </div>
        </motion.div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <Link to="/login" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6">
              <ArrowLeft size={20} />
              <span>Forgot Password</span>
            </Link>

            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Follow instructions to recover password
            </h2>

            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-sm text-gray-600">
              To retrieve your password, please enter your <span className="font-medium">username</span> and <span className="font-medium">Email ID</span> to continue.
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex gap-3"
              >
                <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
                <div className="text-sm text-red-700">{error}</div>
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex gap-3"
              >
                <CheckCircle className="text-green-600 flex-shrink-0" size={20} />
                <div className="text-sm text-green-700">{success}</div>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  USERNAME
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter Username"
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  EMAIL ID
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter Email ID"
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'VERIFYING...' : 'VERIFY'}
              </button>
            </form>
          </div>

          <div className="mt-8 text-center text-sm text-gray-600">
            <p>For Assistance Call: 1800-266-0018 Email: helpdesk@heromotocorp.com</p>
            <p className="mt-2 text-xs">Copyright Hero MotoCorp Ltd. 2025 . All Rights Reserved.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPassword;
