import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Trash2, Users, Search, ArrowLeft } from 'lucide-react';
import { useAuth } from './context/AuthContext';
import { Navigate, Link } from 'react-router-dom';

const AdminUsers = () => {
  const [usersList, setUsersList] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const token = localStorage.getItem('fitTrackToken');

  const fetchUsers = async () => {
    try {
      const url = search.trim() 
        ? `http://localhost:5000/api/admin/users?search=${encodeURIComponent(search.trim())}`
        : 'http://localhost:5000/api/admin/users';

      const res = await fetch(url, {
        headers: { 'x-auth-token': token }
      });
      if (res.ok) {
        const data = await res.json();
        setUsersList(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search]);

  const handleDelete = async (id) => {
    if (!window.confirm('WARNING: Are you sure you want to delete this user? ALL of their workouts, nutrition logs, progress entries, and notifications will be permanently deleted.')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: { 'x-auth-token': token }
      });
      if (res.ok) {
        setUsersList(usersList.filter(u => u._id !== id));
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to delete user');
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (user?.role !== 'admin') return <Navigate to="/dashboard" />;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4 }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Users color="var(--primary)" size={36} /> ATHLETE <span style={{ color: 'var(--primary)' }}>MANAGEMENT</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.35rem' }}>
            Inspect registered platform users, monitor activity, or remove accounts.
          </p>
        </div>

        <Link to="/admin/dashboard" style={{ textDecoration: 'none' }}>
          <button className="btn-outline btn-sm">
            <ArrowLeft size={16} /> Back to Overview
          </button>
        </Link>
      </div>

      {/* Search */}
      <div className="glass-panel" style={{ padding: '1.25rem 1.5rem', marginBottom: '2rem' }}>
        <div style={{ position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            className="input-field" 
            placeholder="Search users by name, email, or username..." 
            style={{ paddingLeft: '2.75rem' }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '2rem' }}>
        <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.25rem' }}>Platform Users ({usersList.length})</h3>

        {loading ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>Loading accounts...</p>
        ) : usersList.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>No users match the query.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {usersList.map(u => (
              <div 
                key={u._id}
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  padding: '1rem 1.25rem', 
                  background: 'var(--surface-light)', 
                  borderRadius: '10px', 
                  border: '1px solid var(--surface-border)' 
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <img 
                    src={u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'} 
                    alt={u.name}
                    style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <h4 style={{ margin: 0, fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {u.name}
                      {u.role === 'admin' ? (
                        <span className="badge" style={{ background: 'var(--primary)', color: '#fff', fontSize: '0.65rem' }}>
                          <Shield size={12} /> Admin
                        </span>
                      ) : (
                        <span className="badge" style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)', fontSize: '0.65rem' }}>
                          Athlete
                        </span>
                      )}
                    </h4>
                    <p style={{ margin: '0.2rem 0 0 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      @{u.username} • {u.email}
                    </p>
                    <p style={{ margin: '0.2rem 0 0 0', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                      Goal: <strong style={{ color: '#fff', textTransform: 'capitalize' }}>{u.fitnessGoal?.replace('_', ' ') || 'None'}</strong> • Joined: {new Date(u.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div>
                  {u.role !== 'admin' && (
                    <button 
                      onClick={() => handleDelete(u._id)} 
                      style={{ background: 'var(--danger-bg)', border: '1px solid var(--danger)', color: 'var(--danger)', padding: '0.55rem 0.85rem', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}
                      title="Delete User and All Data"
                    >
                      <Trash2 size={16} /> Delete Account
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AdminUsers;
