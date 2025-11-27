import React, { useState, useEffect } from 'react';
import { Calendar, Award, MapPin, Clock, User, ArrowRight, Sparkles } from 'lucide-react';

interface Program {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  coordinatorIds?: string[];
}

interface HomePageProps {
  programs: Program[];
}

export const HomePage: React.FC<HomePageProps> = ({ programs }) => {
  const [collegeImageVisible, setCollegeImageVisible] = useState<boolean>(true);
  const [collegeTriedAlt, setCollegeTriedAlt] = useState<boolean>(false);
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [currentStatIndex, setCurrentStatIndex] = useState(0);
  const [memberCount, setMemberCount] = useState(0);
  const [programCount, setProgramCount] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    const handleScroll = () => setScrollY(window.scrollY);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    
    const statInterval = setInterval(() => {
      setCurrentStatIndex(prev => (prev + 1) % 2);
    }, 3000);

    // Counting animation for members
    const memberInterval = setInterval(() => {
      setMemberCount(prev => {
        if (prev >= 100) {
          clearInterval(memberInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 80);

    // Counting animation for programs
    const programInterval = setInterval(() => {
      setProgramCount(prev => {
        if (prev >= 50) {
          clearInterval(programInterval);
          return 50;
        }
        return prev + 1;
      });
    }, 120);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(statInterval);
      clearInterval(memberInterval);
      clearInterval(programInterval);
    };
  }, []);

  const upcomingPrograms = programs
    .filter(program => new Date(program.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  const missionColorClasses = {
    blue: { bg: 'bg-blue-100', text: 'text-blue-700' },
    emerald: { bg: 'bg-emerald-100', text: 'text-emerald-700' },
    orange: { bg: 'bg-orange-100', text: 'text-orange-700' },
  } as const;

  const missionItems = [
    {
      icon: User,
      color: 'blue',
      title: 'Community Service',
      desc: 'Engaging in meaningful community service projects that address local needs and create lasting positive impact.',
      delay: '0s'
    },
    {
      icon: Award,
      color: 'emerald',
      title: 'Leadership Development',
      desc: 'Building leadership skills through hands-on experience in organizing and managing community service initiatives.',
      delay: '0.2s'
    },
    {
      icon: Calendar,
      color: 'orange',
      title: 'Regular Programs',
      desc: 'Consistent programming throughout the year including camps, workshops, and awareness drives.',
      delay: '0.4s'
    }
  ] as const;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-emerald-50">
      {/* Hero Section with Parallax */}
      <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-emerald-600 text-white overflow-hidden">
        {/* Animated Background Elements with Mouse Tracking */}
        <div className="absolute inset-0 opacity-20 overflow-hidden">
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

        <div 
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10"
          style={{ transform: `translateY(${scrollY * 0.3}px)` }}
        >
          <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {/* Logos with Enhanced Animation */}
            <div className="flex justify-center items-center mb-8 space-x-8">
              <div className="rounded-full overflow-hidden w-32 h-32 flex items-center justify-center bg-white shadow-2xl transform hover:scale-125 transition-all duration-500 hover:rotate-12 animate-bounce-slow relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-400 to-transparent opacity-0 hover:opacity-30 transition-opacity duration-500"></div>
                <img src="/download.png" alt="NSS logo" className="w-full h-full object-cover relative z-10" loading="lazy" />
              </div>

              {collegeImageVisible ? (
                <div className="rounded-full overflow-hidden w-32 h-32 flex items-center justify-center bg-white shadow-2xl transform hover:scale-125 transition-all duration-500 hover:-rotate-12 animate-bounce-slow relative" style={{ animationDelay: '0.5s' }}>
                  <div className="absolute inset-0 bg-gradient-to-tr from-emerald-400 to-transparent opacity-0 hover:opacity-30 transition-opacity duration-500"></div>
                  <img
                    src="/mamo%20logo.png"
                    alt="College logo"
                    className="w-full h-full object-contain relative z-10"
                    loading="lazy"
                    onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                      const img = e.currentTarget;
                      if (!collegeTriedAlt) {
                        img.src = '/mamo-logo.png';
                        setCollegeTriedAlt(true);
                      } else {
                        setCollegeImageVisible(false);
                      }
                    }}
                    onLoad={() => setCollegeImageVisible(true)}
                  />
                </div>
              ) : (
                <div className="rounded-full w-32 h-32 flex items-center justify-center bg-white border-4 border-blue-200 shadow-2xl transform hover:scale-125 transition-all duration-500 animate-bounce-slow" style={{ animationDelay: '0.5s' }}>
                  <span className="text-sm font-semibold text-gray-700 text-center px-2">MAMO COLLEGE</span>
                </div>
              )}
            </div>

            {/* Animated Title with Gradient Text Animation */}
            <div className="mb-6 space-y-2">
              <h1 className="text-5xl md:text-6xl font-bold mb-2 animate-gradient-text">
                NSS MAMOC
              </h1>
              <h2 className="text-3xl md:text-4xl font-bold flex items-center justify-center gap-3 animate-slide-in">
                National Service Scheme
                <Sparkles className="animate-spin-slow text-yellow-300" size={28} />
              </h2>
            </div>

            <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed mb-8 text-blue-50 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              Empowering students through community service and social responsibility. 
              Join us in making a positive impact on society while developing leadership skills and civic consciousness.
            </p>

            {/* Stats Cards with Enhanced Animations */}
            <div className="mt-10 flex flex-col sm:flex-row gap-6 justify-center relative z-20">
              <div className={`bg-white bg-opacity-20 backdrop-blur-lg px-8 py-4 rounded-2xl shadow-xl transform transition-all duration-700 border border-white border-opacity-30 ${
                currentStatIndex === 0 ? 'scale-110 bg-opacity-30 ring-4 ring-white ring-opacity-50' : 'hover:scale-105 hover:bg-opacity-30'
              }`}>
                <div className="flex items-center justify-center space-x-3">
                  <img src="/download.png" alt="NSS icon" className="w-6 h-6 object-contain rounded-full animate-pulse-scale" />
                  <span className="font-semibold text-lg">
                    <span className="text-2xl font-bold">{memberCount}</span>
                    <span className="text-lg">+ Active Members</span>
                  </span>
                </div>
              </div>
              <div className={`bg-white bg-opacity-20 backdrop-blur-lg px-8 py-4 rounded-2xl shadow-xl transform transition-all duration-700 border border-white border-opacity-30 ${
                currentStatIndex === 1 ? 'scale-110 bg-opacity-30 ring-4 ring-white ring-opacity-50' : 'hover:scale-105 hover:bg-opacity-30'
              }`}>
                <div className="flex items-center justify-center space-x-3">
                  <Calendar size={24} className="animate-wiggle" />
                  <span className="font-semibold text-lg">
                    <span className="text-2xl font-bold">{programCount}</span>
                    <span className="text-lg">+ Programs Annually</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0 z-30">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full">
            <path fill="#f9fafb" fillOpacity="1" d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
          </svg>
        </div>
      </div>

      {/* Mission Section with Staggered Animation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 inline-flex items-center gap-3">
            Our Mission
            <Award className="text-blue-600 animate-pulse" />
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
            To develop the personality and character of students through voluntary community service
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: User,
              color: 'blue',
              title: 'Community Service',
              desc: 'Engaging in meaningful community service projects that address local needs and create lasting positive impact.',
              delay: '0s'
            },
            {
              icon: Award,
              color: 'emerald',
              title: 'Leadership Development',
              desc: 'Building leadership skills through hands-on experience in organizing and managing community service initiatives.',
              delay: '0.2s'
            },
            {
              icon: Calendar,
              color: 'orange',
              title: 'Regular Programs',
              desc: 'Consistent programming throughout the year including camps, workshops, and awareness drives.',
              delay: '0.4s'
            }
          ].map((item, idx) => {
            const Icon = item.icon;
            const colorClasses = missionColorClasses[item.color];
            return (
              <div
                key={idx}
                className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:rotate-1 group relative overflow-hidden"
                style={{ 
                  animation: `slideUp 0.6s ease-out ${item.delay} both`,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                <div className={`${colorClasses.bg} w-20 h-20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}>
                  <Icon className={`${colorClasses.text}`} size={32} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Upcoming Programs */}
      <div className="bg-gradient-to-br from-white via-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Upcoming Programs</h2>
            <p className="text-xl md:text-2xl text-gray-600">Don't miss out on these exciting opportunities</p>
          </div>

          {upcomingPrograms.length === 0 ? (
            <div className="text-center py-16">
              <Calendar size={80} className="mx-auto text-gray-400 mb-6 animate-pulse" />
              <p className="text-2xl text-gray-500">No upcoming programs scheduled</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {upcomingPrograms.map((program, idx) => (
                <div
                  key={program.id}
                  className="bg-white border-2 border-gray-200 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden group transform hover:-translate-y-3 hover:rotate-2 relative"
                  style={{ 
                    animation: `fadeIn 0.6s ease-out ${idx * 0.2}s both`,
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-emerald-500 opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
                  <div className="h-2 bg-gradient-to-r from-blue-600 to-emerald-600 group-hover:h-3 transition-all duration-300 animate-shimmer"></div>
                  <div className="p-8 relative z-10">
                    <div className="flex items-center justify-between mb-6">
                      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg flex items-center gap-2">
                        <Sparkles size={14} />
                        Upcoming
                      </div>
                      <div className="text-sm font-semibold text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                        {new Date(program.date).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                      {program.title}
                    </h3>
                    <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed">{program.description}</p>
                    
                    <div className="space-y-3">
                      <div className="flex items-center text-gray-700 bg-gray-50 p-3 rounded-xl">
                        <Clock size={18} className="mr-3 text-blue-600" />
                        <span className="font-medium">{program.time}</span>
                      </div>
                      <div className="flex items-center text-gray-700 bg-gray-50 p-3 rounded-xl">
                        <MapPin size={18} className="mr-3 text-emerald-600" />
                        <span className="font-medium">{program.venue}</span>
                      </div>
                      <div className="flex items-center text-gray-700 bg-gray-50 p-3 rounded-xl">
                        <User size={18} className="mr-3 text-orange-600" />
                        <span className="font-medium">Coordinators: {program.coordinatorIds?.length || 0}</span>
                      </div>
                    </div>

                    <button className="mt-6 w-full bg-gradient-to-r from-blue-600 to-emerald-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:from-blue-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl group-hover:gap-4 transform hover:scale-105 active:scale-95">
                      Learn More
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-500 rounded-full filter blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
          <div className="grid md:grid-cols-3 gap-12">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="rounded-full overflow-hidden w-10 h-10 bg-white transform hover:scale-110 transition-transform">
                  <img src="/download.png" alt="NSS logo small" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">NSS MAMOC</h3>
                  <p className="text-gray-400 text-sm">National Service Scheme</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="overflow-hidden w-12 h-12 transform hover:scale-110 transition-transform">
                  <img src="/mamo-logo.png" alt="College logo small" className="w-full h-full object-contain" />
                </div>
                <div>
                  <p className="text-gray-300 text-sm leading-snug">Muhammed Abdurahiman Memorial Orphanage College</p>
                </div>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Committed to developing student personality through community service and social responsibility.
              </p>
            </div>

            <div>
              <h4 className="text-xl font-semibold mb-6 flex items-center gap-2">
                Quick Links
                <ArrowRight size={18} className="animate-pulse" />
              </h4>
              <ul className="space-y-3 text-gray-400">
                {['About NSS', 'Programs', 'Registration', 'Contact'].map((link, idx) => (
                  <li key={idx}>
                    <a href="#" className="hover:text-white hover:translate-x-2 inline-block transition-all duration-300 flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xl font-semibold mb-6">Contact Info</h4>
              <div className="space-y-4 text-gray-400">
                <p className="flex items-center gap-3 hover:text-white transition-colors">
                  <span className="text-2xl">📧</span>
                  nss@college.edu
                </p>
                <p className="flex items-center gap-3 hover:text-white transition-colors">
                  <span className="text-2xl">📱</span>
                  +0495 229 7319
                </p>
                <p className="flex items-center gap-3 hover:text-white transition-colors">
                  <span className="text-2xl">📍</span>
                  MAMO College, Mukkam, Kozhikode
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
            <p className="flex items-center justify-center gap-2">
              &copy; 2025 NSS MAMOC. All rights reserved.
              <span className="inline-block animate-pulse">💙</span>
            </p>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

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

        @keyframes pulse-scale {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }

        @keyframes wiggle {
          0%, 100% {
            transform: rotate(-5deg);
          }
          50% {
            transform: rotate(5deg);
          }
        }

        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
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

        @keyframes shimmer {
          0% {
            background-position: -200% center;
          }
          100% {
            background-position: 200% center;
          }
        }

        @keyframes count {
          0% {
            opacity: 0;
            transform: scale(0.5);
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            opacity: 1;
            transform: scale(1);
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

        .animate-pulse-scale {
          animation: pulse-scale 2s ease-in-out infinite;
        }

        .animate-wiggle {
          animation: wiggle 1s ease-in-out infinite;
        }

        .animate-slide-in {
          animation: slide-in 0.8s ease-out;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }

        .animate-shimmer {
          background: linear-gradient(90deg, #2563eb, #10b981, #2563eb);
          background-size: 200% 100%;
          animation: shimmer 3s linear infinite;
        }

        .animate-count {
          animation: count 0.8s ease-out;
        }

        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

// Demo with sample data
const App = () => {
  const samplePrograms = [
    {
      id: '1',
      title: 'Blood Donation Camp',
      description: 'Join us for our annual blood donation drive. Help save lives by donating blood. All volunteers will receive certificates.',
      date: '2025-12-15',
      time: '9:00 AM - 3:00 PM',
      venue: 'College Auditorium',
      coordinatorIds: ['coord1', 'coord2']
    },
    {
      id: '2',
      title: 'Environmental Awareness Workshop',
      description: 'Learn about sustainable practices and climate action. Interactive sessions with experts.',
      date: '2025-12-20',
      time: '10:00 AM - 2:00 PM',
      venue: 'Seminar Hall',
      coordinatorIds: ['coord3']
    },
    {
      id: '3',
      title: 'Community Clean-Up Drive',
      description: 'Be part of the change! Join our community cleanup initiative to keep our neighborhood clean and green.',
      date: '2025-12-25',
      time: '6:00 AM - 9:00 AM',
      venue: 'Beach Road',
      coordinatorIds: ['coord4', 'coord5', 'coord6']
    }
  ];

  return <HomePage programs={samplePrograms} />;
};

export default App;