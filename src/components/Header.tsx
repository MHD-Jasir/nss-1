import React, { useState, useEffect } from 'react';
import { Calendar, LogIn, LogOut } from 'lucide-react';

interface HeaderProps {
  currentView: 'home' | 'programs' | 'stories' | 'login' | 'student' | 'coordinator' | 'officer';
  onViewChange: (view: 'home' | 'programs' | 'stories' | 'login' | 'student' | 'coordinator' | 'officer') => void;
  isLoggedIn?: boolean;
  onLogout?: () => void;
  userInfo?: { name: string; type: string };
}

export const Header: React.FC<HeaderProps> = ({ 
  currentView, 
  onViewChange, 
  isLoggedIn = false, 
  onLogout, 
  userInfo 
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  const headerTexts = [
    {
      primary: "MUHAMMED ABDURAHIMAN MEMORIAL",
      secondary: "ORPHANAGE (MAMO) COLLEGE, MUKKAM",
      showCollegeLogo: true,
      showNSSLogo: false
    },
    {
      primary: "NATIONAL SERVICE SCHEME",
      secondary: "NSS MAMOC",
      showCollegeLogo: false,
      showNSSLogo: true
    },
    {
      primary: "NSS MAMOC",
      secondary: "National Service Scheme",
      showCollegeLogo: true,
      showNSSLogo: true
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % headerTexts.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMobileNavigation = (view: 'home' | 'programs' | 'stories' | 'login' | 'student' | 'coordinator' | 'officer') => {
    onViewChange(view);
    setIsMobileMenuOpen(false);
  };

  const currentText = headerTexts[currentTextIndex];

  return (
    <header className="bg-gradient-to-r from-blue-50 via-white to-blue-50 shadow-lg border-b-4 border-blue-700">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center py-3 sm:py-4">
          {/* Animated Logo and Title Section */}
          <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4 flex-1 min-w-0">
            {/* Logos Container with Animation */}
            <div className="flex items-center space-x-1.5 sm:space-x-2 flex-shrink-0">
              {/* College Logo */}
              <div 
                className={`rounded-full overflow-hidden transition-all duration-700 flex items-center justify-center bg-white shadow-md ${
                  currentText.showCollegeLogo 
                    ? 'w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 opacity-100 scale-100' 
                    : 'w-0 h-0 opacity-0 scale-0'
                }`}
              >
                <img src="/mamo-logo.png" alt="College logo" className="w-full h-full object-contain p-1" />
              </div>
              
              {/* NSS Logo */}
              <div 
                className={`rounded-full overflow-hidden transition-all duration-700 flex items-center justify-center shadow-md ${
                  currentText.showNSSLogo 
                    ? 'w-8 h-8 sm:w-10 sm:h-10 lg:w-14 lg:h-14 opacity-100 scale-100' 
                    : 'w-0 h-0 opacity-0 scale-0'
                }`}
              >
                <img src="/download.png" alt="NSS logo" className="w-full h-full object-cover" />
              </div>
            </div>

            {/* Animated Text Container */}
            <div className="min-w-0 flex-1">
              <div className="relative h-10 sm:h-12 md:h-14 lg:h-16 flex items-center">
                {headerTexts.map((text, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 flex flex-col justify-center transition-all duration-700 ${
                      index === currentTextIndex
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-4'
                    }`}
                  >
                    <h1 className="text-[10px] sm:text-xs md:text-sm lg:text-lg xl:text-xl font-bold text-blue-900 leading-tight line-clamp-1">
                      {text.primary}
                    </h1>
                    <h1 className="text-[10px] sm:text-xs md:text-sm lg:text-lg xl:text-xl font-bold text-red-900 leading-tight line-clamp-1">
                      {text.secondary}
                    </h1>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Desktop Navigation - Enhanced */}
          <nav className="hidden md:flex space-x-3 lg:space-x-4 xl:space-x-6 items-center">
            <button
              onClick={() => onViewChange('home')}
              className={`px-3 lg:px-4 py-2 rounded-xl font-medium transition-all duration-300 text-sm lg:text-base transform hover:scale-105 ${
                currentView === 'home'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-200'
                  : 'text-gray-700 hover:text-blue-700 hover:bg-blue-100 bg-white/60'
              }`}
            >
              Home
            </button>
            
            <button
              onClick={() => onViewChange('programs')}
              className={`flex items-center space-x-2 px-3 lg:px-4 py-2 rounded-xl font-medium transition-all duration-300 text-sm lg:text-base transform hover:scale-105 ${
                currentView === 'programs'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-200'
                  : 'text-gray-700 hover:text-blue-700 hover:bg-blue-100 bg-white/60'
              }`}
            >
              <Calendar size={16} className="lg:w-[18px] lg:h-[18px]" />
              <span>Programs</span>
            </button>

            {isLoggedIn && (
              <button
                onClick={() => onViewChange('stories')}
                className={`flex items-center space-x-2 px-3 lg:px-4 py-2 rounded-xl font-medium transition-all duration-300 text-sm lg:text-base transform hover:scale-105 ${
                  currentView === 'stories'
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-200'
                    : 'text-gray-700 hover:text-blue-700 hover:bg-blue-100 bg-white/60'
                }`}
              >
                <span>Stories</span>
              </button>
            )}
            
            {isLoggedIn && userInfo?.type === 'officer' && (
              <button
                onClick={() => onViewChange('coordinator')}
                className={`px-3 lg:px-4 py-2 rounded-xl font-medium transition-all duration-300 text-sm lg:text-base transform hover:scale-105 ${
                  currentView === 'coordinator'
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-200'
                    : 'text-gray-700 hover:text-blue-700 hover:bg-blue-100 bg-white/60'
                }`}
              >
                Coordinator
              </button>
            )}
            
            {!isLoggedIn ? (
              <button
                onClick={() => onViewChange('login')}
                className={`flex items-center space-x-2 px-3 lg:px-4 py-2 rounded-xl font-medium transition-all duration-300 text-sm lg:text-base transform hover:scale-105 ${
                  currentView === 'login'
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-200'
                    : 'text-gray-700 hover:text-blue-700 hover:bg-blue-100 bg-white/60'
                }`}
              >
                <LogIn size={16} className="lg:w-[18px] lg:h-[18px]" />
                <span>Login</span>
              </button>
            ) : (
              <div className="flex items-center space-x-2 lg:space-x-3">
                <button
                  onClick={() => {
                    if (userInfo?.type === 'student') onViewChange('student');
                    else if (userInfo?.type === 'coordinator') onViewChange('coordinator');
                    else if (userInfo?.type === 'officer') onViewChange('officer');
                  }}
                  className={`px-3 lg:px-4 py-2 rounded-xl font-medium transition-all duration-300 text-sm lg:text-base transform hover:scale-105 ${
                    (currentView === 'student' && userInfo?.type === 'student') ||
                    (currentView === 'coordinator' && userInfo?.type === 'coordinator') ||
                    (currentView === 'officer' && userInfo?.type === 'officer')
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-200'
                      : 'text-gray-700 hover:text-blue-700 hover:bg-blue-100 bg-white/60'
                  }`}
                >
                  <div className="text-xs lg:text-sm text-center">
                    <div className="text-current">
                      <span className="hidden lg:inline">Welcome, </span>
                      <span className="font-medium">{userInfo?.name}</span>
                    </div>
                    <div className="text-[10px] lg:text-xs text-current opacity-80 capitalize">
                      {userInfo?.type}
                    </div>
                  </div>
                </button>
                <button
                  onClick={onLogout}
                  className="flex items-center space-x-2 px-3 lg:px-4 py-2 rounded-xl font-medium text-sm lg:text-base text-red-600 hover:text-white hover:bg-gradient-to-r hover:from-red-500 hover:to-red-600 bg-red-50 transition-all duration-300 transform hover:scale-105 shadow-sm"
                >
                  <LogOut size={16} className="lg:w-[18px] lg:h-[18px]" />
                  <span className="hidden lg:inline">Logout</span>
                </button>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button - Redesigned */}
          <div className="md:hidden flex-shrink-0 ml-2">
            <button
              onClick={toggleMobileMenu}
              className="relative p-2.5 text-white bg-gradient-to-br from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95"
              aria-label="Toggle menu"
            >
              <div className="relative w-6 h-6">
                <span
                  className={`absolute left-0 top-1 w-6 h-0.5 bg-white rounded-full transition-all duration-300 ${
                    isMobileMenuOpen ? 'rotate-45 top-2.5' : ''
                  }`}
                />
                <span
                  className={`absolute left-0 top-2.5 w-6 h-0.5 bg-white rounded-full transition-all duration-300 ${
                    isMobileMenuOpen ? 'opacity-0' : ''
                  }`}
                />
                <span
                  className={`absolute left-0 top-4 w-6 h-0.5 bg-white rounded-full transition-all duration-300 ${
                    isMobileMenuOpen ? '-rotate-45 top-2.5' : ''
                  }`}
                />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu - Enhanced Design */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-blue-200 py-3 bg-gradient-to-b from-blue-50/50 to-transparent">
            <nav className="space-y-2">
              {/* Home Button */}
              <button
                onClick={() => handleMobileNavigation('home')}
                className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-[1.02] ${
                  currentView === 'home'
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-200'
                    : 'text-gray-700 hover:text-blue-700 hover:bg-blue-100 bg-white/80'
                }`}
              >
                <span className="text-sm sm:text-base">🏠 Home</span>
              </button>

              {/* Programs Button */}
              <button
                onClick={() => handleMobileNavigation('programs')}
                className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-[1.02] flex items-center space-x-3 ${
                  currentView === 'programs'
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-200'
                    : 'text-gray-700 hover:text-blue-700 hover:bg-blue-100 bg-white/80'
                }`}
              >
                <Calendar size={18} />
                <span className="text-sm sm:text-base">Programs</span>
              </button>

              {/* Stories Button */}
              {isLoggedIn && (
                <button
                  onClick={() => handleMobileNavigation('stories')}
                  className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-[1.02] ${
                    currentView === 'stories'
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-200'
                      : 'text-gray-700 hover:text-blue-700 hover:bg-blue-100 bg-white/80'
                  }`}
                >
                  <span className="text-sm sm:text-base">📖 Stories</span>
                </button>
              )}

              {/* Login/Portal Buttons */}
              {!isLoggedIn ? (
                <button
                  onClick={() => handleMobileNavigation('login')}
                  className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-[1.02] flex items-center space-x-3 ${
                    currentView === 'login'
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-200'
                      : 'text-gray-700 hover:text-blue-700 hover:bg-blue-100 bg-white/80'
                  }`}
                >
                  <LogIn size={18} />
                  <span className="text-sm sm:text-base">Login</span>
                </button>
              ) : (
                <>
                  {/* Portal Buttons */}
                  {userInfo?.type === 'student' && (
                    <button
                      onClick={() => handleMobileNavigation('student')}
                      className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-[1.02] ${
                        currentView === 'student'
                          ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-200'
                          : 'text-gray-700 hover:text-blue-700 hover:bg-blue-100 bg-white/80'
                      }`}
                    >
                      <span className="text-sm sm:text-base">👤 Student Portal</span>
                    </button>
                  )}

                  {userInfo?.type === 'coordinator' && (
                    <button
                      onClick={() => handleMobileNavigation('coordinator')}
                      className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-[1.02] ${
                        currentView === 'coordinator'
                          ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-200'
                          : 'text-gray-700 hover:text-blue-700 hover:bg-blue-100 bg-white/80'
                      }`}
                    >
                      <span className="text-sm sm:text-base">👨‍🏫 Coordinator Portal</span>
                    </button>
                  )}

                  {userInfo?.type === 'officer' && (
                    <>
                      <button
                        onClick={() => handleMobileNavigation('officer')}
                        className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-[1.02] ${
                          currentView === 'officer'
                            ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-200'
                            : 'text-gray-700 hover:text-blue-700 hover:bg-blue-100 bg-white/80'
                        }`}
                      >
                        <span className="text-sm sm:text-base">👔 Officer Portal</span>
                      </button>
                      <button
                        onClick={() => handleMobileNavigation('coordinator')}
                        className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-[1.02] ${
                          currentView === 'coordinator'
                            ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-200'
                            : 'text-gray-700 hover:text-blue-700 hover:bg-blue-100 bg-white/80'
                        }`}
                      >
                        <span className="text-sm sm:text-base">👨‍🏫 Coordinator Portal</span>
                      </button>
                    </>
                  )}

                  {/* Logout Button */}
                  <button
                    onClick={() => {
                      onLogout?.();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 rounded-xl font-medium text-red-600 hover:text-white hover:bg-gradient-to-r hover:from-red-500 hover:to-red-600 bg-red-50 transition-all duration-300 transform hover:scale-[1.02] flex items-center space-x-3 shadow-sm"
                  >
                    <LogOut size={18} />
                    <span className="text-sm sm:text-base">Logout</span>
                  </button>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;