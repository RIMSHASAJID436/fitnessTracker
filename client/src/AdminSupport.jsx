import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LifeBuoy, CheckCircle, Clock, Send, ArrowLeft, MessageSquare } from 'lucide-react';
import { useAuth } from './context/AuthContext';
import { Navigate, Link } from 'react-router-dom';

const AdminSupport = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState({});
  const { user } = useAuth();
  const token = localStorage.getItem('fitTrackToken');

  const fetchTickets = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/support/all', {
        headers: { 'x-auth-token': token }
      });
      if (res.ok) {
        const data = await res.json();
        setTickets(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleUpdateTicket = async (ticketId, status, reply) => {
    try {
      const payload = {};
      if (status) payload.status = status;
      if (reply) payload.adminReply = reply;

      const res = await fetch(`http://localhost:5000/api/support/${ticketId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const updated = await res.json();
        setTickets(tickets.map(t => t._id === updated._id ? updated : t));
        setReplyText({ ...replyText, [ticketId]: '' });
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
            <LifeBuoy color="var(--primary)" size={36} /> SUPPORT <span style={{ color: 'var(--primary)' }}>TICKETS</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.35rem' }}>
            Review feedback submissions, technical inquiries, and respond to users.
          </p>
        </div>

        <Link to="/admin/dashboard" style={{ textDecoration: 'none' }}>
          <button className="btn-outline btn-sm">
            <ArrowLeft size={16} /> Back to Overview
          </button>
        </Link>
      </div>

      <div className="glass-panel" style={{ padding: '2rem' }}>
        <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.25rem' }}>All Submitted Inquiries ({tickets.length})</h3>

        {loading ? (
          <p style={{ color: 'var(--text-muted)' }}>Loading tickets...</p>
        ) : tickets.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>No support inquiries found.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {tickets.map(t => (
              <div 
                key={t._id} 
                style={{ 
                  background: 'var(--surface-light)', 
                  border: '1px solid var(--surface-border)', 
                  borderRadius: '12px', 
                  padding: '1.5rem',
                  borderLeft: t.status === 'resolved' ? '4px solid var(--success)' : '4px solid var(--warning)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700 }}>{t.subject}</h4>
                    <p style={{ margin: '0.2rem 0 0 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      From: <strong>{t.name}</strong> ({t.email}) • Category: <strong style={{ textTransform: 'capitalize' }}>{t.category}</strong> • Priority: <strong>{t.priority}</strong>
                    </p>
                  </div>

                  {/* Status Dropdown */}
                  <select 
                    className="input-field"
                    value={t.status}
                    onChange={(e) => handleUpdateTicket(t._id, e.target.value, null)}
                    style={{ width: 'auto', padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                  >
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>

                <p style={{ fontSize: '0.95rem', lineHeight: 1.5, color: 'var(--text)', background: 'rgba(0,0,0,0.2)', padding: '0.85rem', borderRadius: '8px', marginBottom: '1rem' }}>
                  {t.message}
                </p>

                {t.adminReply && (
                  <div style={{ background: 'rgba(56, 189, 248, 0.08)', borderLeft: '3px solid var(--info)', padding: '0.75rem 1rem', borderRadius: '4px', marginBottom: '1rem' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--info)', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                      Previous Response ({new Date(t.adminRepliedAt || t.updatedAt).toLocaleDateString()}):
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#fff' }}>{t.adminReply}</div>
                  </div>
                )}

                {/* Reply Input */}
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="Write an admin response to this athlete..."
                    value={replyText[t._id] || ''}
                    onChange={(e) => setReplyText({ ...replyText, [t._id]: e.target.value })}
                  />
                  <button 
                    onClick={() => handleUpdateTicket(t._id, 'resolved', replyText[t._id])}
                    className="btn-primary btn-sm"
                    style={{ padding: '0.5rem 1rem', whiteSpace: 'nowrap' }}
                  >
                    <Send size={15} /> Reply & Resolve
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AdminSupport;
