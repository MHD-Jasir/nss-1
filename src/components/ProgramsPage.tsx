import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, User, Search, Filter, Users, Sparkles } from 'lucide-react';

interface Program {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  coordinatorIds?: string[];
  participantIds?: string[];
}

interface ProgramsPageProps {
  programs: Program[];
}

export const ProgramsPage: React.FC<ProgramsPageProps> = ({ programs }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'upcoming' | 'completed'>('all');
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [animatedStats, setAnimatedStats] = useState({
    total: 0,
    upcoming: 0,
    completed: 0,
    participants: 0
  });

  const upcomingCount = programs.filter(p => new Date(p.date) >= new Date()).length;
  const completedCount = programs.filter(p => new Date(p.date) < new Date()).length;
  const totalParticipants = programs.reduce((sum, program) => sum + (program.participantIds?.length || 0), 0);

  const statColorClasses = {
    blue: {
      number: 'text-blue-600',
      iconBg: 'bg-blue-100',
      iconText: 'text-blue-700',
      gradient: 'from-blue-600 to-blue-400',
    },
    emerald: {
      number: 'text-emerald-600',
      iconBg: 'bg-emerald-100',
      iconText: 'text-emerald-700',
      gradient: 'from-emerald-600 to-emerald-400',
    },
    gray: {
      number: 'text-gray-600',
      iconBg: 'bg-gray-100',
      iconText: 'text-gray-700',
      gradient: 'from-gray-600 to-gray-400',
    },
    orange: {
      number: 'text-orange-600',
      iconBg: 'bg-orange-100',
      iconText: 'text-orange-700',
      gradient: 'from-orange-600 to-orange-400',
    },
  } as const;

  const statCardConfigs = [
    { label: 'Total Programs', key: 'total', icon: Calendar, color: 'blue', delay: '0s' },
    { label: 'Upcoming', key: 'upcoming', icon: Clock, color: 'emerald', delay: '0.1s' },
    { label: 'Completed', key: 'completed', icon: Calendar, color: 'gray', delay: '0.2s' },
    { label: 'Total Participants', key: 'participants', icon: Users, color: 'orange', delay: '0.3s' }
  ] satisfies Array<{
    label: string;
    key: keyof typeof animatedStats;
    icon: typeof Calendar;
    color: keyof typeof statColorClasses;
    delay: string;
  }>;

  useEffect(() => {
    setIsVisible(true);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);

    // Animate stats
    const animateValue = (start: number, end: number, duration: number, key: keyof typeof animatedStats) => {
      const range = end - start;
      const increment = range / (duration / 16);
      let current = start;
      
      const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
          current = end;
          clearInterval(timer);
        }
        setAnimatedStats(prev => ({ ...prev, [key]: Math.round(current) }));
      }, 16);
    };

    setTimeout(() => {
      animateValue(0, programs.length, 1500, 'total');
      animateValue(0, upcomingCount, 1500, 'upcoming');
      animateValue(0, completedCount, 1500, 'completed');
      animateValue(0, totalParticipants, 2000, 'participants');
    }, 300);

    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [programs.length, upcomingCount, completedCount, totalParticipants]);

  const filteredPrograms = programs.filter(program => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = program.title.toLowerCase().includes(searchLower) ||
                         program.description.toLowerCase().includes(searchLower);
    
    const now = new Date();
    const programDate = new Date(program.date);
    
    const matchesFilter = filterType === 'all' || 
                         (filterType === 'upcoming' && programDate >= now) ||
                         (filterType === 'completed' && programDate < now);
    
    return matchesSearch && matchesFilter;
  });

  const sortedPrograms = [...filteredPrograms].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-emerald-50 py-8 sm:py-12 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-10 overflow-hidden hidden md:block pointer-events-none">
        <div 
          className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-overlay filter blur-3xl animate-pulse"
          style={{
            transform: `translate(${mousePosition.x * 0.01}px, ${mousePosition.y * 0.01}px)`,
            transition: 'transform 0.3s ease-out'
          }}
        ></div>
        <div 
          className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-400 rounded-full mix-blend-overlay filter blur-3xl animate-pulse" 
          style={{ 
            animationDelay: '1s',
            transform: `translate(${mousePosition.x * -0.015}px, ${mousePosition.y * -0.015}px)`,
            transition: 'transform 0.3s ease-out'
          }}
        ></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className={`mb-8 sm:mb-12 text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 animate-gradient-text flex items-center justify-center gap-3 flex-wrap">
            <span>NSS Programs</span>
            <Sparkles className="animate-spin-slow text-blue-600" size={28} />
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 animate-fade-in-up px-4" style={{ animationDelay: '0.2s' }}>
            Explore our community service programs and initiatives
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-8 sm:mb-12">
          {statCardConfigs.map((stat, idx) => {
            const Icon = stat.icon;
            const colorClasses = statColorClasses[stat.color];
            const value = animatedStats[stat.key as keyof typeof animatedStats];
            return (
              <div
                key={idx}
                className="bg-white bg-opacity-90 backdrop-blur-lg p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-lg border border-gray-200 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:rotate-1 group relative overflow-hidden animate-slide-up"
                style={{ animationDelay: stat.delay }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-2 sm:mb-3">
                    <div>
                      <p className="text-gray-600 text-xs sm:text-sm font-medium">{stat.label}</p>
                      <p className={`text-2xl sm:text-3xl md:text-4xl font-bold ${colorClasses.number} animate-count-up`}>
                        {value}
                      </p>
                    </div>
                    <div className={`${colorClasses.iconBg} p-2 sm:p-3 rounded-xl sm:rounded-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                      <Icon className={`${colorClasses.iconText}`} size={20} />
                    </div>
                  </div>
                  <div className={`h-1 bg-gradient-to-r ${colorClasses.gradient} rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Search and Filter */}
        <div className="bg-white bg-opacity-90 backdrop-blur-lg p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-xl border border-gray-200 mb-8 sm:mb-12 animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative group">
                <Search className="absolute left-3 top-3 sm:top-4 text-gray-400 group-hover:text-blue-600 transition-colors" size={20} />
                <input
                  type="text"
                  placeholder="Search programs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 sm:pl-11 pr-4 py-3 sm:py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 hover:border-blue-300 text-base touch-manipulation"
                />
                <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-full transform scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300"></div>
              </div>
            </div>
            <div className="md:w-56">
              <div className="relative group">
                <Filter className="absolute left-3 top-3 sm:top-4 text-gray-400 group-hover:text-blue-600 transition-colors pointer-events-none" size={20} />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as 'all' | 'upcoming' | 'completed')}
                  className="w-full pl-10 sm:pl-11 pr-4 py-3 sm:py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 appearance-none transition-all duration-300 hover:border-blue-300 cursor-pointer text-base touch-manipulation bg-white"
                >
                  <option value="all">All Programs</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="completed">Completed</option>
                </select>
                <div className="absolute right-4 top-4 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Programs List */}
        <div className="space-y-4 sm:space-y-6">
          {sortedPrograms.length === 0 ? (
            <div className="bg-white bg-opacity-90 backdrop-blur-lg p-8 sm:p-12 rounded-3xl shadow-xl text-center animate-fade-in">
              <Calendar size={48} className="mx-auto text-gray-400 mb-4 animate-pulse" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No programs found</h3>
              <p className="text-gray-600">
                {searchTerm ? 'Try adjusting your search terms' : 'No programs have been scheduled yet'}
              </p>
            </div>
          ) : (
            sortedPrograms.map((program, idx) => {
              const isUpcoming = new Date(program.date) >= new Date();
              const participantCount = program.participantIds?.length || 0;
              
              return (
                <div
                  key={program.id}
                  className="bg-white bg-opacity-90 backdrop-blur-lg p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-lg border-2 border-gray-200 hover:shadow-2xl transition-all duration-500 group hover:-translate-y-1 hover:border-blue-300 animate-slide-up relative overflow-hidden"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-emerald-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-emerald-50 opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
                  
                  <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center">
                    <div className="flex-1 mb-4 lg:mb-0 w-full">
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{program.title}</h3>
                        <div className={`px-3 py-1 rounded-full text-xs sm:text-sm font-semibold shadow-md ${
                          isUpcoming
                            ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white'
                            : 'bg-gray-200 text-gray-600'
                        }`}>
                          {isUpcoming ? '🎯 Upcoming' : '✓ Completed'}
                        </div>
                        {participantCount > 0 && (
                          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-1 shadow-md">
                            <Users size={14} />
                            <span>{participantCount}</span>
                          </div>
                        )}
                      </div>

                      <p className="text-gray-600 mb-4 leading-relaxed text-sm sm:text-base">{program.description}</p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2 bg-gray-50 p-2 sm:p-3 rounded-xl hover:bg-blue-50 transition-colors group/item">
                          <Calendar size={16} className="text-blue-600 group-hover/item:scale-110 transition-transform" />
                          <span>{new Date(program.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-gray-50 p-2 sm:p-3 rounded-xl hover:bg-emerald-50 transition-colors group/item">
                          <Clock size={16} className="text-emerald-600 group-hover/item:scale-110 transition-transform" />
                          <span>{program.time}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-gray-50 p-2 sm:p-3 rounded-xl hover:bg-orange-50 transition-colors group/item">
                          <MapPin size={16} className="text-orange-600 group-hover/item:scale-110 transition-transform" />
                          <span className="truncate">{program.venue}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-gray-50 p-2 sm:p-3 rounded-xl hover:bg-purple-50 transition-colors group/item">
                          <User size={16} className="text-purple-600 group-hover/item:scale-110 transition-transform" />
                          <span className="truncate">{program.coordinatorIds?.[0] || 'No coordinator'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="w-full lg:w-auto mt-4 lg:mt-0 lg:ml-6">
                      <div className="bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 px-4 sm:px-6 py-3 rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-300 group-hover:from-blue-100 group-hover:to-emerald-100 min-h-[48px]">
                        <Users size={18} className="group-hover:scale-110 transition-transform" />
                        <span className="font-semibold text-sm sm:text-base">
                          {participantCount > 0 
                            ? `${participantCount} participant${participantCount !== 1 ? 's' : ''}` 
                            : 'No participants yet'
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Info Section */}
        <div className="mt-12 sm:mt-16 bg-gradient-to-br from-blue-600 to-emerald-600 rounded-3xl p-6 sm:p-8 shadow-2xl animate-slide-up relative overflow-hidden" style={{ animationDelay: '0.6s' }}>
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full filter blur-3xl"></div>
          </div>
          <div className="relative z-10 flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
            <div className="bg-white bg-opacity-20 backdrop-blur-lg p-3 sm:p-4 rounded-2xl animate-pulse-scale">
              <Users className="text-white" size={28} />
            </div>
            <div className="flex-1">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 flex items-center gap-2">
                Want to Participate?
                <Sparkles size={20} className="animate-spin-slow" />
              </h3>
              <p className="text-blue-50 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
                Join our NSS programs and make a difference in the community. Contact your coordinators or visit the login section to access your student portal.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 text-sm text-white">
                <div className="bg-white bg-opacity-20 backdrop-blur-lg px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-opacity-30 transition-all">
                  <span>📧</span>
                  <span>nss@college.edu</span>
                </div>
                <div className="bg-white bg-opacity-20 backdrop-blur-lg px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-opacity-30 transition-all">
                  <span>📱</span>
                  <span>+91 98765 43210</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes gradient-text {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
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
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes pulse-scale {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        @keyframes count-up {
          from {
            opacity: 0;
            transform: scale(0.5);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-gradient-text {
          background: linear-gradient(90deg, #1e40af, #059669, #1e40af, #059669);
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
          animation: slide-up 0.6s ease-out both;
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }

        .animate-pulse-scale {
          animation: pulse-scale 2s ease-in-out infinite;
        }

        .animate-count-up {
          animation: count-up 0.8s ease-out;
        }
      `}</style>
    </div>
  );
};

// Demo Component
const App = () => {
  const samplePrograms = [
    {
      id: '1',
      title: 'Blood Donation Camp',
      description: 'Annual blood donation drive in collaboration with local health authorities. Help save lives by donating blood.',
      date: '2025-12-15',
      time: '9:00 AM - 3:00 PM',
      venue: 'College Auditorium',
      coordinatorIds: ['Dr. Sarah Johnson'],
      participantIds: Array(45).fill('participant')
    },
    {
      id: '2',
      title: 'Environmental Awareness Workshop',
      description: 'Interactive workshop on sustainable practices and climate action with expert speakers.',
      date: '2025-12-20',
      time: '10:00 AM - 2:00 PM',
      venue: 'Seminar Hall',
      coordinatorIds: ['Prof. Michael Chen'],
      participantIds: Array(32).fill('participant')
    },
    {
      id: '3',
      title: 'Community Clean-Up Drive',
      description: 'Join our initiative to keep the neighborhood clean and green. Gloves and materials provided.',
      date: '2024-11-10',
      time: '6:00 AM - 9:00 AM',
      venue: 'Beach Road',
      coordinatorIds: ['Ms. Priya Sharma'],
      participantIds: Array(67).fill('participant')
    },
    {
      id: '4',
      title: 'Digital Literacy Program',
      description: 'Teaching basic computer skills to senior citizens in our community.',
      date: '2024-10-25',
      time: '2:00 PM - 5:00 PM',
      venue: 'Computer Lab',
      coordinatorIds: ['Mr. Rajesh Kumar'],
      participantIds: Array(28).fill('participant')
    }
  ];

  return <ProgramsPage programs={samplePrograms} />;
};

export default App;