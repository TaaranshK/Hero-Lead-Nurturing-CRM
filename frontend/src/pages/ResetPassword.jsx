import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    // Success - redirect to login
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 items-center justify-center p-12">
        <div className="max-w-md">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-2xl font-bold text-white">H</span>
            </div>
            <span className="text-2xl font-display font-bold">Hero</span>
          </div>
          <h2 className="text-3xl font-display font-bold text-gray-800">Lead Nurturing Application</h2>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <Link to="/verification-code" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6">
              <ArrowLeft size={20} />
              <span>Enter New Password</span>
            </Link>

            <h2 className="text-xl font-semibold text-gray-800 mb-2">Follow instructions to recover password</h2>
            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-sm text-gray-600">
              Password must be a maximum max <span className="font-medium">15 characters</span> with combination of lowercase, uppercase letters, numbers, and special characters
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">NEW PASSWORD</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••••••••"
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">CONFIRM PASSWORD</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••••••••"
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
              </div>

              <button type="submit" className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700">
                RESET PASSWORD
              </button>
            </form>
          </div>
          <div className="mt-8 text-center text-sm text-gray-600">
            <p>For Assistance Call: 1800-266-0018 Email: helpdesk@heromotocorp.com</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ResetPassword;
