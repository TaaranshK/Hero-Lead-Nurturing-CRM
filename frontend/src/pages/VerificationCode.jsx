
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { authService } from '../services/authService';

const VerificationCode = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(59);
  const inputRefs = useRef([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (index, value) => {
    if (value.length > 1) value = value[0];
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    const username = sessionStorage.getItem('recoveryUsername');
    const otpValue = otp.join('');
    try {
      const response = await authService.verifyOtp(username, otpValue);
      if (response.data.success) {
        setSuccess(response.data.message || 'OTP verified successfully!');
        setTimeout(() => {
          navigate('/reset-password');
        }, 1500);
      } else {
        setError(response.data.message || 'OTP verification failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error verifying OTP. Please try again.');
    } finally {
      setLoading(false);
    }
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
            <Link to="/forgot-password" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6">
              <ArrowLeft size={20} />
              <span>Forgot Password</span>
            </Link>

            <h2 className="text-xl font-semibold text-gray-800 mb-2">Follow instructions to recover password</h2>
            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-sm text-gray-600">
              Please enter verification code we've send on your <span className="font-medium">registered email ID</span>.
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
                <label className="block text-sm font-medium text-gray-700 mb-3">OTP (ONE TIME PASSWORD)</label>
                <div className="flex gap-3 justify-between">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      maxLength="1"
                      value={digit}
                      onChange={(e) => handleChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="w-12 h-14 text-center text-xl font-semibold border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                      disabled={loading}
                    />
                  ))}
                </div>
                <div className="flex justify-between items-center mt-3">
                  <button
                    type="button"
                    onClick={async () => {
                      if (loading) return;
                      setError('');
                      setSuccess('');
                      const username = sessionStorage.getItem('recoveryUsername');
                      const email = sessionStorage.getItem('recoveryEmail');
                      if (!username || !email) {
                        setError('Missing recovery information. Start again.');
                        return;
                      }
                      setLoading(true);
                      try {
                        const res = await authService.forgotPassword(username, email);
                        if (res.data?.success) {
                          setSuccess('OTP resent');
                          setTimer(59);
                        } else {
                          setError(res.data?.message || 'Failed to resend OTP');
                        }
                      } catch (err) {
                        setError(err.response?.data?.message || 'Error resending OTP');
                      } finally {
                        setLoading(false);
                      }
                    }}
                    className="text-sm text-primary-600 hover:text-primary-700"
                    disabled={loading}
                  >
                    Resend
                  </button>
                  <span className="text-sm text-red-600">00:{timer < 10 ? `0${timer}` : timer}</span>
                </div>
              </div>

              <button type="submit" disabled={loading} className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50">
                {loading ? 'VERIFYING...' : 'VERIFY'}
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

export default VerificationCode;
