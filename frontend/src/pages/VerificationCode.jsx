import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const VerificationCode = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(59);
  const inputRefs = useRef([]);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/reset-password');
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
                    />
                  ))}
                </div>
                <div className="flex justify-between items-center mt-3">
                  <button type="button" className="text-sm text-primary-600 hover:text-primary-700">Resend</button>
                  <span className="text-sm text-red-600">00:{timer < 10 ? `0${timer}` : timer}</span>
                </div>
              </div>

              <button type="submit" className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700">
                VERIFY
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
