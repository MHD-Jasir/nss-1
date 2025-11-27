import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Lock, User, Sparkles, ArrowLeft } from 'lucide-react';

interface LoginPageProps {
  onLogin: (credentials: { id: string; password: string }) => Promise<void> | void;
  onBack: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onBack }) => {
  const [credentials, setCredentials] = useState({ id: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleSubmit = async (
    e?: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLInputElement>
  ) => {
    e?.preventDefault();
    setError('');
    
    if (!credentials.id || !credentials.password) {
      setError('Please enter both ID and password');
      return;
    }

    setIsLoggingIn(true);
    
    // Simulate a brief delay for the animation
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    try {
      await onLogin(credentials);
      // Keep isLoggingIn true if successful - parent will handle navigation
    } catch (err: unknown) {
      // If login fails, stop the animation and show error
      setIsLoggingIn(false);
      const message = err instanceof Error ? err.message : 'Invalid ID or password. Please try again.';
      setError(message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-emerald-600 flex items-center justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated Background Elements with Mouse Tracking */}
      <div className="absolute inset-0 opacity-20 overflow-hidden hidden md:block">
        <div 
          className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-pulse"
          style={{
            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`,
            transition: 'transform 0.3s ease-out'
          }}
        ></div>
        <div 
          className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-300 rounded-full mix-blend-overlay filter blur-3xl animate-pulse" 
          style={{ 
            animationDelay: '1s',
            transform: `translate(${mousePosition.x * -0.03}px, ${mousePosition.y * -0.03}px)`,
            transition: 'transform 0.3s ease-out'
          }}
        ></div>
        <div 
          className="absolute top-1/2 left-1/2 w-80 h-80 bg-blue-300 rounded-full mix-blend-overlay filter blur-3xl animate-pulse" 
          style={{ 
            animationDelay: '2s',
            transform: `translate(${mousePosition.x * 0.015}px, ${mousePosition.y * 0.015}px)`,
            transition: 'transform 0.3s ease-out'
          }}
        ></div>
        
        {/* Floating particles */}
        <div className="absolute top-10 left-1/4 w-4 h-4 bg-white rounded-full animate-float"></div>
        <div className="absolute top-32 right-1/3 w-3 h-3 bg-blue-200 rounded-full animate-float" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute bottom-40 left-1/3 w-5 h-5 bg-emerald-200 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-white rounded-full animate-float" style={{ animationDelay: '1.5s' }}></div>
      </div>

      <div className={`max-w-md w-full space-y-6 sm:space-y-8 relative z-10 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center items-center gap-4 sm:gap-6 mb-4 sm:mb-6">
            <div className="rounded-full overflow-hidden w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center bg-white shadow-2xl transform hover:scale-110 hover:rotate-6 transition-all duration-500 animate-bounce-slow relative touch-manipulation">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-400 to-transparent opacity-0 hover:opacity-30 transition-opacity duration-500"></div>
              <img src="/mamo-logo.png" alt="College logo" className="w-full h-full object-contain relative z-10" />
            </div>
            <div className="rounded-full overflow-hidden w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center bg-white shadow-2xl transform hover:scale-110 hover:-rotate-6 transition-all duration-500 animate-bounce-slow relative touch-manipulation" style={{ animationDelay: '0.5s' }}>
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-400 to-transparent opacity-0 hover:opacity-30 transition-opacity duration-500"></div>
              <img src="/download.png" alt="NSS logo" className="w-full h-full object-cover relative z-10" />
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 animate-gradient-text flex items-center justify-center gap-2 flex-wrap">
            <span>NSS MAMOC Login</span>
            <Sparkles className="animate-spin-slow text-yellow-300" size={20} />
          </h2>
          <p className="mt-2 text-base sm:text-lg md:text-xl text-blue-100 animate-fade-in-up px-4" style={{ animationDelay: '0.2s' }}>
            Access your portal
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white bg-opacity-95 backdrop-blur-lg rounded-3xl shadow-2xl border border-white border-opacity-50 transform hover:scale-105 transition-all duration-500 animate-slide-up mx-4 sm:mx-0">
          <div className="p-6 sm:p-8">
            <div className="space-y-5 sm:space-y-6">
              {/* ID Field */}
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <User size={16} className="text-blue-600" />
                  ID
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={credentials.id}
                    onChange={(e) => setCredentials({ ...credentials, id: e.target.value })}
                    onFocus={() => setFocusedField('id')}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full px-4 py-3 sm:py-4 border-2 rounded-xl transition-all duration-300 text-base ${
                      focusedField === 'id' 
                        ? 'border-blue-500 ring-4 ring-blue-100 shadow-lg' 
                        : 'border-gray-300 hover:border-blue-300'
                    } focus:outline-none touch-manipulation`}
                    placeholder="Enter your ID"
                  />
                  <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-full transition-all duration-300 ${
                    focusedField === 'id' ? 'w-full' : 'w-0'
                  }`}></div>
                </div>
              </div>

              {/* Password Field */}
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Lock size={16} className="text-blue-600" />
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={credentials.password}
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSubmit(e);
                      }
                    }}
                    className={`w-full px-4 py-3 sm:py-4 pr-12 border-2 rounded-xl transition-all duration-300 ${
                      focusedField === 'password' 
                        ? 'border-blue-500 ring-4 ring-blue-100 shadow-lg' 
                        : 'border-gray-300 hover:border-blue-300'
                    } focus:outline-none`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 sm:top-4 text-gray-500 hover:text-blue-600 transition-all duration-300 transform hover:scale-110 p-1"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                  <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-full transition-all duration-300 ${
                    focusedField === 'password' ? 'w-full' : 'w-0'
                  }`}></div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium animate-shake flex items-center gap-2">
                  <span className="text-red-500 text-lg">⚠️</span>
                  {error}
                </div>
              )}

              {/* Login Button */}
              <button
                onClick={handleSubmit}
                disabled={isLoggingIn}
                className={`w-full bg-gradient-to-r from-blue-600 to-emerald-600 text-white py-3 sm:py-4 px-4 rounded-xl transition-all duration-300 font-semibold text-lg shadow-lg flex items-center justify-center gap-2 group relative overflow-hidden ${
                  isLoggingIn 
                    ? 'cursor-not-allowed opacity-90' 
                    : 'hover:from-blue-700 hover:to-emerald-700 hover:shadow-xl transform hover:scale-105 active:scale-95'
                }`}
              >
                {isLoggingIn ? (
                  <>
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                      </div>
                      <span className="animate-pulse">Logging in...</span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 animate-shimmer-login"></div>
                  </>
                ) : (
                  <>
                    Login
                    <ArrowLeft className="transform rotate-180 group-hover:translate-x-1 transition-transform" size={20} />
                  </>
                )}
              </button>
            </div>

            {/* Back Button */}
            <div className="mt-6 text-center">
              <button
                onClick={onBack}
                disabled={isLoggingIn}
                className={`text-blue-600 hover:text-blue-800 text-sm sm:text-base font-semibold flex items-center justify-center gap-2 mx-auto transition-all duration-300 hover:gap-3 group ${
                  isLoggingIn ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <ArrowLeft className="group-hover:-translate-x-1 transition-transform" size={18} />
                Back to Home
              </button>
            </div>

            {/* Help Text */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-xs sm:text-sm text-gray-600 text-center leading-relaxed">
                <span className="font-semibold text-blue-700">💡 Tip:</span> Use your assigned ID and password. The system will route you to the correct portal.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center text-white text-sm animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <p className="flex items-center justify-center gap-2">
            <Lock size={16} />
            Secure Login • NSS MAMOC 2025
          </p>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          25% {
            transform: translateY(-20px) rotate(5deg);
          }
          50% {
            transform: translateY(-40px) rotate(-5deg);
          }
          75% {
            transform: translateY(-20px) rotate(5deg);
          }
        }

        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes gradient-text {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(40px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes shake {
          0%, 100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-5px);
          }
          75% {
            transform: translateX(5px);
          }
        }

        @keyframes shimmer-login {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }

        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }

        .animate-gradient-text {
          background: linear-gradient(90deg, #ffffff, #93c5fd, #ffffff, #6ee7b7, #ffffff);
          background-size: 300% 100%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: gradient-text 4s ease infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.8s ease-out;
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }

        .animate-shimmer-login {
          animation: shimmer-login 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

// Demo Component
const App = () => {
  const handleLogin = async (credentials: { id: string; password: string }) => {
    console.log('Login attempt:', credentials);
    
    // Simulate authentication check
    if (credentials.id === 'admin' && credentials.password === 'password') {
      // Successful login
      alert(`Welcome! Login successful with ID: ${credentials.id}`);
    } else {
      // Failed login - throw error
      throw new Error('Invalid ID or password');
    }
  };

  const handleBack = () => {
    console.log('Back to home');
    alert('Navigating back to home');
  };

  return <LoginPage onLogin={handleLogin} onBack={handleBack} />;
};

export default App;