'use client';

import React, { useState } from 'react';
import { Header } from './Header';
import { HomePage } from './HomePage';
import { TeacherPortal } from './TeacherPortal';
import StudentPortal from './StudentPortal';
import { ProgramOfficerPortal } from './ProgramOfficerPortal';
import { LoginPage } from './LoginPage';
import { ProgramsPage } from './ProgramsPage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

type ViewType = 'home' | 'programs' | 'stories' | 'login' | 'student' | 'coordinator' | 'officer';
type UserType = 'student' | 'coordinator' | 'officer';

interface CurrentUser {
  type: UserType;
  data: any;
}

function AppClientContent() {
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

  const handleLogin = async (credentials: { id: string; password: string }) => {
    try {
      // Try officer login first
      const officerRes = await fetch('/api/officer-credentials');
      const officerData = await officerRes.json();
      
      if (officerData.id === credentials.id && officerData.password === credentials.password) {
        setCurrentUser({ type: 'officer', data: { id: credentials.id, name: 'Program Officer' } });
        setIsLoggedIn(true);
        setCurrentView('officer');
        return;
      }

      // Try coordinator login
      const coordRes = await fetch('/api/coordinators');
      const coordinators = await coordRes.json();
      const coordinator = coordinators.find((c: any) => 
        c.id === credentials.id && c.password === credentials.password && c.is_active
      );
      
      if (coordinator) {
        setCurrentUser({ type: 'coordinator', data: coordinator });
        setIsLoggedIn(true);
        setCurrentView('coordinator');
        return;
      }

      // Try student login
      const studentRes = await fetch('/api/students');
      const students = await studentRes.json();
      const student = students.find((s: any) => 
        s.id === credentials.id && s.password === credentials.password
      );
      
      if (student) {
        setCurrentUser({ type: 'student', data: student });
        setIsLoggedIn(true);
        setCurrentView('student');
        return;
      }

      alert('Invalid credentials');
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please try again.');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setCurrentView('home');
  };

  const getUserInfo = () => {
    if (!currentUser) return undefined;
    return {
      name: currentUser.type === 'officer' 
        ? currentUser.data.name
        : currentUser.data.name,
      type: currentUser.type
    };
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return <HomePage programs={[]} />;
      case 'programs':
        return <ProgramsPage programs={[]} />;
      case 'stories':
        if (isLoggedIn) {
          const StoriesPage = React.lazy(() => import('./StoriesPage'));
          return (
            <React.Suspense fallback={<div className="p-6">Loading...</div>}>
              <StoriesPage
                batches={[]}
                currentBatchId=""
                setCurrentBatchId={() => {}}
                canManage={currentUser?.type === 'coordinator' || currentUser?.type === 'officer'}
                isOfficer={currentUser?.type === 'officer'}
                onCreateBatch={() => {}}
                onCreateAlbum={() => {}}
                onDeleteMedia={() => {}}
                onAddMedia={() => {}}
                onToggleFeatured={() => {}}
                onMergeCurrentAlbumToSingle={() => {}}
              />
            </React.Suspense>
          );
        }
        return <LoginPage onLogin={handleLogin} onBack={() => setCurrentView('home')} />;
      case 'login':
        return <LoginPage onLogin={handleLogin} onBack={() => setCurrentView('home')} />;
      case 'student':
        if (isLoggedIn && currentUser?.type === 'student') {
          return (
            <StudentPortal 
              programs={[]} 
              currentStudent={currentUser.data}
            />
          );
        }
        return <LoginPage onLogin={handleLogin} onBack={() => setCurrentView('home')} />;
      case 'coordinator':
        if (isLoggedIn && (currentUser?.type === 'coordinator' || currentUser?.type === 'officer')) {
          return (
            <TeacherPortal
              programs={[]}
              registeredStudents={[]}
              onAddProgram={() => {}}
              onEditProgram={() => {}}
              onDeleteProgram={() => {}}
              onAddParticipants={() => {}}
            />
          );
        }
        return <LoginPage onLogin={handleLogin} onBack={() => setCurrentView('home')} />;
      case 'officer':
        if (isLoggedIn && currentUser?.type === 'officer') {
          return (
            <ProgramOfficerPortal
              students={[]}
              coordinators={[]}
              departments={[]}
              onAddStudent={() => {}}
              onAddCoordinator={() => {}}
              onToggleCoordinatorAccess={() => {}}
              onDeleteStudent={() => {}}
              onDeleteCoordinator={() => {}}
              onUpdateOfficerPassword={() => {}}
              onEditStudent={() => {}}
              onEditCoordinator={() => {}}
              onAddDepartment={() => {}}
              onEditDepartment={() => {}}
              onToggleDepartment={() => {}}
              studentReports={{}}
              programs={[]}
              onAddStudentActivity={() => {}}
              onEditStudentActivity={() => {}}
            />
          );
        }
        return <LoginPage onLogin={handleLogin} onBack={() => setCurrentView('home')} />;
      default:
        return <HomePage programs={[]} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        currentView={currentView} 
        onViewChange={setCurrentView}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        userInfo={getUserInfo()}
      />
      {renderCurrentView()}
    </div>
  );
}

export default function AppClient() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppClientContent />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
