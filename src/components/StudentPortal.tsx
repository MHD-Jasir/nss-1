import React, { useMemo, useState } from 'react';
import { Calendar, Clock, MapPin, User, Download, Search, Filter, Users, X, Check } from 'lucide-react';
import { motion } from 'framer-motion';
// NOTE: adjust the import paths of your types and utils as needed
import { Program, RegisteredStudent } from '../types';
import { downloadCertificate } from '../utils/certificateGenerator';

// Single-file modern redesign of the Student Portal page.
// Uses Tailwind CSS, Framer Motion for subtle animations and lucide-react icons.
// Export default React component at the bottom.

interface StudentPortalProps {
  programs: Program[];
  currentStudent: RegisteredStudent;
}

const StatsCard: React.FC<{
  title: string;
  value: number | string;
  icon: React.ReactNode;
  accent?: string;
}> = ({ title, value, icon, accent = 'bg-blue-50 text-blue-600' }) => (
  <div className="bg-white/60 backdrop-blur-sm p-5 rounded-2xl shadow border border-gray-100">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-semibold text-gray-900 mt-1">{value}</p>
      </div>
      <div className={`p-3 rounded-xl ${accent}`}>
        {icon}
      </div>
    </div>
  </div>
);

const SearchFilter: React.FC<{
  searchTerm: string;
  onSearch: (v: string) => void;
  filterType: string;
  onFilter: (v: string) => void;
}> = ({ searchTerm, onSearch, filterType, onFilter }) => (
  <div className="bg-white/60 backdrop-blur-sm p-4 rounded-2xl shadow border border-gray-100">
    <div className="flex flex-col md:flex-row gap-3 items-center">
      <div className="relative flex-1 w-full">
        <Search className="absolute left-3 top-3 text-gray-400" size={18} />
        <input
          value={searchTerm}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search programs, coordinators or venue..."
          className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-300"
        />
      </div>

      <div className="w-full md:w-48 relative">
        <Filter className="absolute left-3 top-3 text-gray-400" size={18} />
        <select
          value={filterType}
          onChange={(e) => onFilter(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 appearance-none"
        >
          <option value="all">All Programs</option>
          <option value="upcoming">Upcoming</option>
          <option value="completed">Completed</option>
          <option value="my-programs">My Programs</option>
        </select>
      </div>
    </div>
  </div>
);

const ProgramCard: React.FC<{
  program: Program;
  isParticipant: boolean;
  isUpcoming: boolean;
  onDownload: (p: Program) => void;
}> = ({ program, isParticipant, isUpcoming, onDownload }) => {
  const isPast = !isUpcoming;

  // normalize coordinator(s) to a display string
  const coordinatorsDisplay = program.coordinatorIds?.length
    ? program.coordinatorIds.join(', ')
    : program.coordinator || 'Not assigned';

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18 }}
      className="bg-white p-6 rounded-2xl shadow hover:shadow-xl border border-gray-100"
    >
      <div className="flex flex-col lg:flex-row justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-start gap-3">
            <div>
              <h3 className="text-lg md:text-xl font-semibold text-gray-900">{program.title}</h3>
              <div className="mt-2 flex gap-2 flex-wrap">
                <span className={`px-2 py-1 rounded-full text-sm font-medium ${isUpcoming ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
                  {isUpcoming ? 'Upcoming' : 'Completed'}
                </span>
                {isParticipant && (
                  <span className="px-2 py-1 rounded-full text-sm font-medium bg-purple-50 text-purple-700">Participant</span>
                )}
                {program.participantIds && program.participantIds.length > 0 && (
                  <span className="px-2 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700 flex items-center gap-1">
                    <Users size={14} />
                    {program.participantIds.length} participants
                  </span>
                )}
              </div>
            </div>
          </div>

          <p className="text-gray-600 mt-3 leading-relaxed">{program.description}</p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm text-gray-600 mt-4">
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>{new Date(program.date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} />
              <span>{program.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={16} />
              <span>{program.venue}</span>
            </div>
            <div className="flex items-center gap-2">
              <User size={16} />
              <span>{coordinatorsDisplay}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-start sm:items-end gap-3 md:gap-4">
          {isParticipant ? (
            isPast ? (
              <button
                onClick={() => onDownload(program)}
                className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2 rounded-lg hover:bg-emerald-700 transition"
              >
                <Download size={16} />
                <span>Download Certificate</span>
              </button>
            ) : (
              <div className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-5 py-2 rounded-lg">
                <Calendar size={16} />
                <span>Registered</span>
              </div>
            )
          ) : (
            <div className="flex items-center gap-2 bg-gray-100 text-gray-600 px-5 py-2 rounded-lg">
              <Users size={16} />
              <span>Not a participant</span>
            </div>
          )}

          <div className="text-xs text-gray-400">Coordinator: <span className="text-gray-600">{coordinatorsDisplay}</span></div>
        </div>
      </div>
    </motion.div>
  );
};

export default function StudentPortal({ programs, currentStudent }: StudentPortalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'upcoming' | 'completed' | 'my-programs'>('all');

  const now = useMemo(() => new Date(), []);

  const filteredPrograms = useMemo(() => {
    return programs.filter((program) => {
      // normalize coordinatorIds to string for searching
      const coordinatorsText = Array.isArray((program as any).coordinatorIds) ? (program as any).coordinatorIds.join(' ') : (program as any).coordinatorIds || '';

      const matchesSearch = [program.title, program.description, coordinatorsText, program.venue]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const programDate = new Date(program.date);
      const isParticipant = program.participantIds?.includes(currentStudent.id) || false;

      const matchesFilter =
        filterType === 'all' ||
        (filterType === 'upcoming' && programDate >= now) ||
        (filterType === 'completed' && programDate < now) ||
        (filterType === 'my-programs' && isParticipant);

      return matchesSearch && matchesFilter;
    });
  }, [programs, searchTerm, filterType, currentStudent.id, now]);

  const sortedPrograms = useMemo(() => {
    return [...filteredPrograms].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [filteredPrograms]);

  const upcomingCount = useMemo(() => programs.filter((p) => new Date(p.date) >= now).length, [programs, now]);
  const completedCount = useMemo(() => programs.filter((p) => new Date(p.date) < now).length, [programs, now]);
  const myProgramsCount = useMemo(() => programs.filter((p) => p.participantIds?.includes(currentStudent.id)).length, [programs, currentStudent.id]);

  const handleDownloadCertificate = (program: Program) => {
    // ensure coordinator is a string (join if array)
    const coordinatorString = program.coordinatorIds?.length
      ? program.coordinatorIds.join(', ')
      : program.coordinator || '';

    const certificate = {
      programId: program.id,
      studentName: currentStudent.name,
      studentDepartment: currentStudent.department,
      programTitle: program.title,
      date: program.date,
      time: program.time,
      venue: program.venue,
      coordinator: coordinatorString,
    } as const;

    downloadCertificate(certificate);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-10">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex-shrink-0 ring-1 ring-gray-100">
            {currentStudent.profileImageUrl ? (
              <img src={currentStudent.profileImageUrl} alt={currentStudent.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">No Photo</div>
            )}
          </div>

          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">Student Portal</h1>
            <p className="text-gray-600 mt-1">Welcome, <span className="font-medium text-gray-800">{currentStudent.name}</span> — <span className="text-sm text-gray-500">{currentStudent.department}</span></p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs text-gray-400">Student ID</p>
              <p className="font-mono font-semibold text-sm text-gray-700">{currentStudent.id}</p>
            </div>

            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
              </svg>
              <span className="text-sm">Export</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatsCard title="Total Programs" value={programs.length} icon={<Calendar size={20} />} />
          <StatsCard title="Upcoming" value={upcomingCount} icon={<Clock size={20} />} accent="bg-emerald-50 text-emerald-700" />
          <StatsCard title="Completed" value={completedCount} icon={<Calendar size={20} />} accent="bg-gray-50 text-gray-700" />
          <StatsCard title="My Programs" value={myProgramsCount} icon={<User size={20} />} accent="bg-purple-50 text-purple-700" />
        </div>

        {/* Controls */}
        <div className="mb-6">
          <SearchFilter
            searchTerm={searchTerm}
            onSearch={setSearchTerm}
            filterType={filterType}
            onFilter={(v) => setFilterType(v as any)}
          />
        </div>

        {/* Programs list */}
        <div className="space-y-4">
          {sortedPrograms.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl shadow border border-gray-100 text-center">
              <Calendar size={56} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900">No programs found</h3>
              <p className="text-gray-500 mt-2">{searchTerm ? 'Try different keywords or clear filters.' : 'There are no programs scheduled yet.'}</p>
            </div>
          ) : (
            sortedPrograms.map((program) => {
              const programDate = new Date(program.date);
              const isUpcoming = programDate >= now;
              const isParticipant = program.participantIds?.includes(currentStudent.id) || false;

              return (
                <ProgramCard
                  key={program.id}
                  program={program}
                  isParticipant={isParticipant}
                  isUpcoming={isUpcoming}
                  onDownload={handleDownloadCertificate}
                />
              );
            })
          )}
        </div>

        {/* Footer small quick actions */}
        <div className="mt-8 flex items-center justify-between text-sm text-gray-500">
          <div>Need help? Contact <span className="text-gray-700 font-medium">admin@university.edu</span></div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-gray-100 shadow-sm hover:shadow transition">
              <Check size={14} />
              <span>Verify Profile</span>
            </button>
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-gray-100 shadow-sm hover:shadow transition">
              <X size={14} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}