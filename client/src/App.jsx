import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, 
  Apple, 
  LayoutDashboard, 
  Settings as SettingsIcon, 
  X, 
  Shield, 
  Users, 
  TrendingUp, 
  FileText, 
  Clock, 
  LifeBuoy 
} from 'lucide-react';

import Dashboard from './Dashboard';
import Workouts from './Workouts';
import Nutrition from './Nutrition';
import Progress from './Progress';
import Community from './Community';
import Reports from './Reports';
import Reminders from './Reminders';
import Settings from './Settings';
import Support from './Support';
import Auth from './Auth';
import Home from './Home';
import About from './About';
import Contact from './Contact';
import PublicNav from './PublicNav';
import Navbar from './Navbar';
import AdminDashboard from './AdminDashboard';
import AdminUsers from './AdminUsers';
import AdminSupport from './AdminSupport';
import { useAuth } from './context/AuthContext';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const { user } = useAuth();
  
  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Workouts', icon: Activity, path: '/workouts' },
    { name: 'Nutrition', icon: Apple, path: '/nutrition' },
    { name: 'Progress & PRs', icon: TrendingUp, path: '/progress' },
    { name: 'Community', icon: Users, path: '/community' },
    { name: 'Reports & Export', icon: FileText, path: '/reports' },
    { name: 'Reminders', icon: Clock, path: '/reminders' },
    { name: 'Settings', icon: SettingsIcon, path: '/settings' },
    { name: 'Support', icon: LifeBuoy, path: '/support' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={toggleSidebar}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 90 }}
            className="mobile-overlay"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Panel */}
      <motion.div 
        className="sidebar-panel"
        initial={false}
        animate={{ x: isOpen ? 0 : (window.innerWidth < 1024 ? '-100%' : 0) }}
        style={{ 
          width: 'var(--sidebar-width)', 
          height: '100vh', 
          position: 'fixed', 
          left: 0, 
          top: 0, 
          padding: '1.75rem 1.25rem', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '1.5rem', 
          zIndex: 100, 
          background: 'var(--surface)',
          borderRight: '1px solid var(--surface-border)',
          overflowY: 'auto'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to="/dashboard" style={{ textDecoration: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Activity size={20} color="#fff" />
              </div>
              <h1 style={{ color: '#fff', display: 'flex', alignItems: 'center', fontWeight: 800, margin: 0, fontSize: '1.5rem', fontFamily: "'Oswald', sans-serif" }}>
                YOGA<span style={{ color: 'var(--primary)' }}>LIFE</span> <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 400, marginLeft: '0.2rem' }}>&amp; FIT</span>
              </h1>
            </div>
          </Link>
          <button onClick={toggleSidebar} style={{ background: 'transparent', border: 'none', color: 'var(--text)', cursor: 'pointer', display: 'flex' }} className="mobile-close-btn">
            <X size={24} />
          </button>
        </div>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link 
                to={item.path} 
                key={item.name} 
                style={{ textDecoration: 'none' }} 
                onClick={() => window.innerWidth < 1024 && toggleSidebar()}
              >
                <div 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.85rem', 
                    padding: '0.75rem 1rem', 
                    borderRadius: '8px', 
                    color: isActive ? '#000000' : 'var(--text-muted)',
                    backgroundColor: isActive ? 'var(--primary)' : 'transparent',
                    fontWeight: isActive ? 700 : 500,
                    boxShadow: isActive ? '0 4px 15px var(--primary-glow)' : 'none',
                    transition: 'all 0.2s',
                    fontFamily: "'Oswald', sans-serif",
                    letterSpacing: '0.5px'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <Icon size={20} />
                  <span style={{ fontSize: '1rem' }}>{item.name}</span>
                </div>
              </Link>
            );
          })}

          {user?.role === 'admin' && (
            <Link 
              to="/admin/dashboard" 
              style={{ textDecoration: 'none', marginTop: '0.5rem' }} 
              onClick={() => window.innerWidth < 1024 && toggleSidebar()}
            >
              <div 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.85rem', 
                  padding: '0.75rem 1rem', 
                  borderRadius: '8px', 
                  color: location.pathname.startsWith('/admin') ? '#000000' : 'var(--primary)',
                  backgroundColor: location.pathname.startsWith('/admin') ? 'var(--primary)' : 'rgba(245, 158, 11, 0.12)',
                  fontWeight: 700,
                  fontFamily: "'Oswald', sans-serif",
                  letterSpacing: '0.5px'
                }}
              >
                <Shield size={20} />
                <span style={{ fontSize: '1rem' }}>Admin Portal</span>
              </div>
            </Link>
          )}
        </nav>

        {/* Pro Banner */}
        <div style={{ marginTop: 'auto', padding: '1.25rem', background: 'var(--surface-light)', borderRadius: '10px', textAlign: 'center', border: '1px solid var(--surface-border)' }}>
          <h4 style={{ color: '#fff', margin: '0 0 0.35rem 0', fontSize: '1rem' }}>Pro Athlete Mode</h4>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: '0 0 0.85rem 0', fontFamily: "'Poppins', sans-serif", textTransform: 'none' }}>
            Full metrics, cloud backups & priority support active.
          </p>
          <span className="badge" style={{ background: 'var(--primary-glow)', color: 'var(--primary)', fontSize: '0.75rem' }}>
            Active Subscription
          </span>
        </div>
      </motion.div>

      <style>{`
        @media (min-width: 1024px) {
          .mobile-overlay, .mobile-close-btn, .mobile-menu-btn { display: none !important; }
        }
      `}</style>
    </>
  );
};

const AdminSidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  
  const adminItems = [
    { name: 'System Overview', icon: LayoutDashboard, path: '/admin/dashboard' },
    { name: 'Manage Athletes', icon: Users, path: '/admin/users' },
    { name: 'Support Tickets', icon: LifeBuoy, path: '/admin/support' },
    { name: 'Switch to Athlete View', icon: Activity, path: '/dashboard' },
  ];

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={toggleSidebar}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 90 }}
            className="mobile-overlay"
          />
        )}
      </AnimatePresence>

      <motion.div 
        className="sidebar-panel"
        initial={false}
        animate={{ x: isOpen ? 0 : (window.innerWidth < 1024 ? '-100%' : 0) }}
        style={{ 
          width: 'var(--sidebar-width)', 
          height: '100vh', 
          position: 'fixed', 
          left: 0, 
          top: 0, 
          padding: '1.75rem 1.25rem', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '1.5rem', 
          zIndex: 100, 
          background: 'var(--surface)',
          borderRight: '1px solid var(--surface-border)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Shield size={20} color="#fff" />
            </div>
            <h1 style={{ color: '#fff', display: 'flex', alignItems: 'center', fontWeight: 800, margin: 0, fontSize: '1.5rem', fontFamily: "'Oswald', sans-serif" }}>
              ADMIN<span style={{ color: 'var(--primary)' }}>PORTAL</span>
            </h1>
          </div>
          <button onClick={toggleSidebar} style={{ background: 'transparent', border: 'none', color: 'var(--text)', cursor: 'pointer', display: 'flex' }} className="mobile-close-btn">
            <X size={24} />
          </button>
        </div>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {adminItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link 
                to={item.path} 
                key={item.name} 
                style={{ textDecoration: 'none' }} 
                onClick={() => window.innerWidth < 1024 && toggleSidebar()}
              >
                <div 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.85rem', 
                    padding: '0.75rem 1rem', 
                    borderRadius: '8px', 
                    color: isActive ? '#000000' : 'var(--text-muted)',
                    backgroundColor: isActive ? 'var(--primary)' : 'transparent',
                    fontWeight: isActive ? 700 : 500,
                    boxShadow: isActive ? '0 4px 15px var(--primary-glow)' : 'none',
                    transition: 'all 0.2s',
                    fontFamily: "'Oswald', sans-serif",
                    letterSpacing: '0.5px'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <Icon size={20} />
                  <span style={{ fontSize: '1rem' }}>{item.name}</span>
                </div>
              </Link>
            );
          })}
        </nav>
      </motion.div>
    </>
  );
};

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading session...</div>;
  if (!user) return <Navigate to="/login" />;
  return children;
};

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <ProtectedRoute>
      <div style={{ display: 'flex', width: '100vw', minHeight: '100vh', background: 'var(--background)' }}>
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        <div 
          style={{ 
            flex: 1, 
            marginLeft: window.innerWidth >= 1024 ? 'var(--sidebar-width)' : '0', 
            display: 'flex', 
            flexDirection: 'column', 
            minHeight: '100vh', 
            transition: 'margin 0.3s' 
          }} 
          className="main-content-wrapper"
        >
          <Navbar toggleSidebar={toggleSidebar} />
          <main style={{ padding: '2rem 3rem', flex: 1 }}>
            {children}
          </main>
        </div>
        <style>{`
          @media (max-width: 1023px) {
            .main-content-wrapper { margin-left: 0 !important; }
            main { padding: 1.5rem !important; }
          }
        `}</style>
      </div>
    </ProtectedRoute>
  );
};

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <ProtectedRoute>
      <div style={{ display: 'flex', width: '100vw', minHeight: '100vh', background: 'var(--background)' }}>
        <AdminSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        <div 
          style={{ 
            flex: 1, 
            marginLeft: window.innerWidth >= 1024 ? 'var(--sidebar-width)' : '0', 
            display: 'flex', 
            flexDirection: 'column', 
            minHeight: '100vh', 
            transition: 'margin 0.3s' 
          }} 
          className="main-content-wrapper"
        >
          <Navbar toggleSidebar={toggleSidebar} />
          <main style={{ padding: '2rem 3rem', flex: 1 }}>
            {children}
          </main>
        </div>
        <style>{`
          @media (max-width: 1023px) {
            .main-content-wrapper { margin-left: 0 !important; }
            main { padding: 1.5rem !important; }
          }
        `}</style>
      </div>
    </ProtectedRoute>
  );
};

const PublicLayout = ({ children }) => (
  <>
    <PublicNav />
    {children}
  </>
);

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
        <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
        <Route path="/login" element={<PublicLayout><Auth /></PublicLayout>} />
        
        {/* Protected Athlete Dashboard Routes */}
        <Route path="/dashboard" element={<DashboardLayout><Dashboard /></DashboardLayout>} />
        <Route path="/workouts" element={<DashboardLayout><Workouts /></DashboardLayout>} />
        <Route path="/nutrition" element={<DashboardLayout><Nutrition /></DashboardLayout>} />
        <Route path="/progress" element={<DashboardLayout><Progress /></DashboardLayout>} />
        <Route path="/community" element={<DashboardLayout><Community /></DashboardLayout>} />
        <Route path="/reports" element={<DashboardLayout><Reports /></DashboardLayout>} />
        <Route path="/reminders" element={<DashboardLayout><Reminders /></DashboardLayout>} />
        <Route path="/settings" element={<DashboardLayout><Settings /></DashboardLayout>} />
        <Route path="/support" element={<DashboardLayout><Support /></DashboardLayout>} />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
        <Route path="/admin/users" element={<AdminLayout><AdminUsers /></AdminLayout>} />
        <Route path="/admin/support" element={<AdminLayout><AdminSupport /></AdminLayout>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
}

export default App;
