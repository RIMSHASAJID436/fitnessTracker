import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Users, 
  Activity, 
  Apple, 
  TrendingUp, 
  LifeBuoy, 
  Clock, 
  ArrowRight,
  UserCheck
} from 'lucide-react';
import { useAuth } from './context/AuthContext';
import { Navigate, Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const { user } = useAuth();
  const token = localStorage.getItem('fitTrackToken');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/admin/stats', {
          headers: { 'x-auth-token': token }
        });
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, [token]);

  if (user?.role !== 'admin') return <Navigate to="/dashboard" />;
  if (!stats) return <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading admin statistics...</div>;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4 }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Shield color="var(--primary)" size={36} /> PLATFORM <span style={{ color: 'var(--primary)' }}>ADMINISTRATION</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.35rem' }}>
            System telemetry, user moderation, database records, and support resolution center.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/admin/users" style={{ textDecoration: 'none' }}>
            <button className="btn-primary btn-sm">
              <Users size={16} /> Manage Users
            </button>
          </Link>
          <Link to="/admin/support" style={{ textDecoration: 'none' }}>
            <button className="btn-outline btn-sm">
              <LifeBuoy size={16} /> Support Tickets ({stats.openTickets || 0})
            </button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        
        <div className="glass-panel" style={{ padding: '1.75rem', borderLeft: '4px solid var(--primary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            <span>Registered Athletes</span>
            <Users size={20} color="var(--primary)" />
          </div>
          <div style={{ fontSize: '2.6rem', fontWeight: 800, fontFamily: "'Oswald', sans-serif" }}>
            {stats.totalUsers}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
            Active platform accounts
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.75rem', borderLeft: '4px solid var(--info)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            <span>Workouts Logged</span>
            <Activity size={20} color="var(--info)" />
          </div>
          <div style={{ fontSize: '2.6rem', fontWeight: 800, fontFamily: "'Oswald', sans-serif", color: 'var(--info)' }}>
            {stats.totalWorkouts}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
            Training sessions saved
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.75rem', borderLeft: '4px solid var(--warning)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            <span>Nutrition Entries</span>
            <Apple size={20} color="var(--warning)" />
          </div>
          <div style={{ fontSize: '2.6rem', fontWeight: 800, fontFamily: "'Oswald', sans-serif", color: 'var(--warning)' }}>
            {stats.totalNutrition}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
            Daily food & macro logs
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.75rem', borderLeft: '4px solid var(--success)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            <span>Progress Entries</span>
            <TrendingUp size={20} color="var(--success)" />
          </div>
          <div style={{ fontSize: '2.6rem', fontWeight: 800, fontFamily: "'Oswald', sans-serif", color: 'var(--success)' }}>
            {stats.totalProgress || 0}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
            Weight & measurement entries
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.75rem', borderLeft: '4px solid #a855f7' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            <span>Support Tickets</span>
            <LifeBuoy size={20} color="#a855f7" />
          </div>
          <div style={{ fontSize: '2.6rem', fontWeight: 800, fontFamily: "'Oswald', sans-serif", color: '#a855f7' }}>
            {stats.totalTickets || 0}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--warning)', marginTop: '0.4rem' }}>
            {stats.openTickets || 0} open or pending
          </div>
        </div>

      </div>

      {/* Recent Users Table */}
      <div className="glass-panel" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Recent Registered Athletes</h3>
          <Link to="/admin/users" style={{ color: 'var(--primary)', textDecoration: 'none', fontSize: '0.85rem' }}>
            View Full User Management →
          </Link>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {(stats.recentUsers || []).map(u => (
            <div 
              key={u._id}
              style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                padding: '0.85rem 1rem', 
                background: 'var(--surface-light)', 
                borderRadius: '8px', 
                border: '1px solid var(--surface-border)' 
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <img 
                  src={u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'} 
                  alt={u.name}
                  style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div>
                  <div style={{ fontWeight: 600 }}>{u.name} {u.role === 'admin' && <span className="badge" style={{ background: 'var(--primary)', color: '#fff', fontSize: '0.65rem' }}>Admin</span>}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>@{u.username} • {u.email}</div>
                </div>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Joined: {new Date(u.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>

    </motion.div>
  );
};

export default AdminDashboard;
