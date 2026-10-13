import React, { useState, useEffect } from 'react';
import { LogOut, User as UserIcon, Menu, Bell, Check, Trash2, Search, X, Shield, Clock, HelpCircle, ExternalLink } from 'lucide-react';
import { useAuth } from './context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const token = localStorage.getItem('fitTrackToken');

  const fetchNotifications = async () => {
    if (!token) return;
    try {
      const res = await fetch('http://localhost:5000/api/notifications', {
        headers: { 'x-auth-token': token }
      });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (err) {
      console.error('Fetch notifs err:', err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Polling every 30s
    return () => clearInterval(interval);
  }, [token]);

  const handleMarkAllRead = async () => {
    try {
      await fetch('http://localhost:5000/api/notifications/read-all', {
        method: 'PUT',
        headers: { 'x-auth-token': token }
      });
      setNotifications(notifications.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    try {
      const res = await fetch(`http://localhost:5000/api/users/search?q=${encodeURIComponent(query)}`, {
        headers: { 'x-auth-token': token }
      });
      if (res.ok) {
        const data = await res.json();
        setSearchResults(data);
      }
    } catch (err) {
      console.error('Search err:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const userName = user ? user.name : 'Athlete';

  return (
    <>
      <div 
        className="navbar-container"
        style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          padding: '1rem 2rem', 
          background: 'var(--surface)', 
          borderBottom: '1px solid var(--surface-border)', 
          zIndex: 40,
          position: 'sticky',
          top: 0
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <button 
            onClick={toggleSidebar} 
            style={{ background: 'transparent', border: 'none', color: 'var(--text)', cursor: 'pointer', display: 'flex', padding: '0.25rem' }} 
            className="mobile-menu-btn"
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
          
          <div>
            <h2 style={{ fontSize: '1.15rem', margin: 0, color: 'var(--text-muted)', textTransform: 'none', fontFamily: "'Poppins', sans-serif", fontWeight: 400 }}>
              Welcome back, <span style={{ color: 'var(--text)', fontWeight: 600 }}>{userName}</span>
            </h2>
          </div>
        </div>

        {/* Right side tools: Quick Search, Notifications, Profile Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          
          {/* Quick Search Button */}
          <button 
            onClick={() => setShowSearchModal(true)}
            style={{ 
              background: 'var(--surface-light)', 
              border: '1px solid var(--surface-border)', 
              borderRadius: '20px', 
              padding: '0.5rem 1rem', 
              color: 'var(--text-muted)', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.85rem'
            }}
          >
            <Search size={16} />
            <span className="search-hint">Search Athletes...</span>
          </button>

          {/* Notifications Bell */}
          <div style={{ position: 'relative' }}>
            <button 
              onClick={() => { setShowNotifs(!showNotifs); setShowDropdown(false); }}
              style={{ 
                background: 'var(--surface-light)', 
                border: '1px solid var(--surface-border)', 
                borderRadius: '50%', 
                width: '40px', 
                height: '40px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                color: 'var(--text)', 
                cursor: 'pointer',
                position: 'relative'
              }}
              title="Notifications"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span 
                  style={{ 
                    position: 'absolute', 
                    top: '-3px', 
                    right: '-3px', 
                    background: 'var(--primary)', 
                    color: '#fff', 
                    fontSize: '0.7rem', 
                    fontWeight: 'bold', 
                    width: '18px', 
                    height: '18px', 
                    borderRadius: '50%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    boxShadow: '0 0 10px var(--primary-glow)'
                  }}
                >
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown Drawer */}
            <AnimatePresence>
              {showNotifs && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  style={{ 
                    position: 'absolute', 
                    top: 'calc(100% + 0.75rem)', 
                    right: 0, 
                    width: '360px', 
                    maxWidth: '90vw', 
                    background: 'var(--surface)', 
                    border: '1px solid var(--surface-border-light)', 
                    borderRadius: '14px', 
                    boxShadow: '0 20px 40px rgba(0,0,0,0.5)', 
                    zIndex: 100,
                    overflow: 'hidden'
                  }}
                >
                  <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--surface-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Bell size={18} color="var(--primary)" />
                      <h4 style={{ margin: 0, fontSize: '1rem' }}>Activity Notifications</h4>
                    </div>
                    {unreadCount > 0 && (
                      <button 
                        onClick={handleMarkAllRead}
                        style={{ background: 'transparent', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div style={{ maxHeight: '350px', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
                    {notifications.length === 0 ? (
                      <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        No notifications yet.
                      </div>
                    ) : (
                      notifications.map(notif => (
                        <div 
                          key={notif._id}
                          style={{ 
                            padding: '1rem 1.25rem', 
                            borderBottom: '1px solid var(--surface-border)', 
                            background: notif.read ? 'transparent' : 'rgba(245, 158, 11, 0.08)',
                            display: 'flex',
                            gap: '0.75rem',
                            alignItems: 'flex-start'
                          }}
                        >
                          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: notif.read ? 'transparent' : 'var(--primary)', marginTop: '6px', flexShrink: 0 }}></div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.2rem' }}>{notif.title}</div>
                            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>{notif.message}</div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.35rem', opacity: 0.7 }}>
                              {new Date(notif.createdAt).toLocaleDateString()} at {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Profile Dropdown */}
          <div style={{ position: 'relative' }}>
            <div 
              onClick={() => { setShowDropdown(!showDropdown); setShowNotifs(false); }}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.75rem', 
                cursor: 'pointer', 
                padding: '0.4rem 0.75rem', 
                borderRadius: '30px', 
                background: 'var(--surface-light)', 
                border: '1px solid var(--surface-border)' 
              }}
            >
              <img 
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'} 
                alt={userName}
                style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary)' }}
              />
              <span style={{ fontWeight: 600, fontSize: '0.95rem', paddingRight: '0.25rem', fontFamily: "'Oswald', sans-serif", letterSpacing: '0.5px' }}>
                {userName.split(' ')[0]}
              </span>
            </div>

            <AnimatePresence>
              {showDropdown && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  style={{ 
                    position: 'absolute', 
                    top: 'calc(100% + 0.5rem)', 
                    right: 0, 
                    width: '220px', 
                    background: 'var(--surface)', 
                    borderRadius: '12px', 
                    border: '1px solid var(--surface-border-light)', 
                    overflow: 'hidden', 
                    zIndex: 50, 
                    boxShadow: '0 15px 35px rgba(0,0,0,0.5)' 
                  }}
                >
                  <div style={{ padding: '1rem', borderBottom: '1px solid var(--surface-border)' }}>
                    <p style={{ margin: 0, fontWeight: 700, fontSize: '0.95rem' }}>{userName}</p>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>@{user?.username || 'athlete'}</p>
                    {user?.role === 'admin' && (
                      <span className="badge" style={{ background: 'var(--primary)', color: '#000000', fontWeight: 700, marginTop: '0.5rem', fontSize: '0.65rem' }}>
                        <Shield size={12} /> Administrator
                      </span>
                    )}
                  </div>

                  <Link 
                    to="/settings" 
                    onClick={() => setShowDropdown(false)}
                    style={{ textDecoration: 'none', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.8rem 1rem', fontSize: '0.9rem', transition: 'background 0.2s' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--surface-hover)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <UserIcon size={16} /> Profile & Settings
                  </Link>

                  <Link 
                    to="/reminders" 
                    onClick={() => setShowDropdown(false)}
                    style={{ textDecoration: 'none', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.8rem 1rem', fontSize: '0.9rem', transition: 'background 0.2s' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--surface-hover)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <Clock size={16} /> Reminders & Alerts
                  </Link>

                  <Link 
                    to="/support" 
                    onClick={() => setShowDropdown(false)}
                    style={{ textDecoration: 'none', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.8rem 1rem', fontSize: '0.9rem', transition: 'background 0.2s' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--surface-hover)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <HelpCircle size={16} /> Support & Feedback
                  </Link>

                  {user?.role === 'admin' && (
                    <Link 
                      to="/admin/dashboard" 
                      onClick={() => setShowDropdown(false)}
                      style={{ textDecoration: 'none', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.8rem 1rem', fontSize: '0.9rem', borderTop: '1px solid var(--surface-border)' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--surface-hover)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <Shield size={16} /> Admin Panel
                    </Link>
                  )}

                  <div 
                    onClick={handleLogout}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.75rem', 
                      padding: '0.8rem 1rem', 
                      cursor: 'pointer', 
                      color: 'var(--danger)', 
                      borderTop: '1px solid var(--surface-border)',
                      fontSize: '0.9rem',
                      fontWeight: 500
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--danger-bg)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <LogOut size={16} />
                    <span>Log Out</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Athlete Search Modal */}
      {showSearchModal && (
        <div className="modal-overlay" onClick={() => setShowSearchModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Search size={22} color="var(--primary)" /> Discover Athletes & Workouts
              </h3>
              <button onClick={() => setShowSearchModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
              <Search size={18} style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                className="input-field" 
                placeholder="Search athletes by name or username..." 
                style={{ paddingLeft: '2.75rem' }}
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                autoFocus
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '350px', overflowY: 'auto' }}>
              {isSearching ? (
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '1rem' }}>Searching...</p>
              ) : searchResults.length === 0 && searchQuery ? (
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '1rem' }}>No athletes found.</p>
              ) : (
                searchResults.map(u => (
                  <div 
                    key={u._id}
                    style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      padding: '0.75rem 1rem', 
                      background: 'var(--surface-light)', 
                      borderRadius: '10px', 
                      border: '1px solid var(--surface-border)' 
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <img 
                        src={u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'} 
                        alt={u.name}
                        style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{u.name}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>@{u.username} • {u.fitnessGoal?.replace('_', ' ')}</div>
                      </div>
                    </div>
                    <Link 
                      to="/community" 
                      onClick={() => setShowSearchModal(false)}
                      className="btn-outline btn-sm"
                      style={{ padding: '0.35rem 0.75rem' }}
                    >
                      Connect
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
