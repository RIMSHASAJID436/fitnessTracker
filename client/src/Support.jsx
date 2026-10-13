import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  HelpCircle, 
  Send, 
  CheckCircle, 
  Clock, 
  MessageSquare, 
  AlertCircle, 
  LifeBuoy,
  FileQuestion,
  ShieldAlert
} from 'lucide-react';
import { useAuth } from './context/AuthContext';

const Support = () => {
  const { user } = useAuth();
  const token = localStorage.getItem('fitTrackToken');

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    category: 'support',
    priority: 'medium',
    subject: '',
    message: ''
  });

  const fetchMyTickets = async () => {
    if (!token) return;
    try {
      const res = await fetch('http://localhost:5000/api/support/my', {
        headers: { 'x-auth-token': token }
      });
      if (res.ok) {
        const data = await res.json();
        setTickets(data);
      }
    } catch (err) {
      console.error('Fetch tickets err:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyTickets();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        userId: user?._id
      };

      const res = await fetch('http://localhost:5000/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        setTickets([data.ticket, ...tickets]);
        setMsg('Your inquiry has been submitted! Our support team will review it.');
        setFormData({
          ...formData,
          subject: '',
          message: ''
        });
        setTimeout(() => setMsg(''), 5000);
      }
    } catch (err) {
      console.error('Submit ticket err:', err);
    }
  };

  const statusBadge = (status) => {
    switch (status) {
      case 'resolved':
        return <span className="badge" style={{ background: 'var(--success-bg)', color: 'var(--success)' }}>Resolved</span>;
      case 'in_progress':
        return <span className="badge" style={{ background: 'var(--info-bg)', color: 'var(--info)' }}>In Progress</span>;
      default:
        return <span className="badge" style={{ background: 'var(--warning-bg)', color: 'var(--warning)' }}>Open</span>;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <LifeBuoy color="var(--primary)" size={36} /> HELP & <span style={{ color: 'var(--primary)' }}>SUPPORT SYSTEM</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.35rem' }}>
          Need assistance or want to request a feature? Submit a ticket and our team will get back to you promptly.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '2rem' }}>
        
        {/* Ticket Submission Form */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.4rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileQuestion color="var(--primary)" size={22} /> Submit an Inquiry / Feedback
          </h2>

          {msg && (
            <div style={{ background: 'var(--success-bg)', border: '1px solid var(--success)', color: 'var(--success)', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.25rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle size={18} /> {msg}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Category *</label>
                <select 
                  className="input-field"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="support">Technical Support</option>
                  <option value="bug">Report a Bug</option>
                  <option value="feature">Feature Request</option>
                  <option value="feedback">User Experience Feedback</option>
                  <option value="account">Account & Privacy</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Priority</label>
                <select 
                  className="input-field"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Subject *</label>
              <input 
                type="text" 
                className="input-field" 
                placeholder="Brief summary of your inquiry..."
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Detailed Message *</label>
              <textarea 
                className="input-field" 
                rows="5"
                placeholder="Explain the issue, steps to reproduce, or feedback details..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
              ></textarea>
            </div>

            <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <Send size={18} /> Submit Ticket
            </button>
          </form>
        </div>

        {/* My Inquiries & Responses */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.4rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MessageSquare color="var(--primary)" size={22} /> My Inquiries & Tickets ({tickets.length})
          </h2>

          {loading ? (
            <p style={{ color: 'var(--text-muted)' }}>Loading tickets...</p>
          ) : tickets.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '3rem 1rem' }}>
              <p>You haven't submitted any support requests yet.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '550px', overflowY: 'auto' }}>
              {tickets.map(t => (
                <div key={t._id} style={{ background: 'var(--surface-light)', border: '1px solid var(--surface-border)', borderRadius: '10px', padding: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700 }}>{t.subject}</h3>
                    {statusBadge(t.status)}
                  </div>

                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                    Category: <strong style={{ textTransform: 'capitalize' }}>{t.category}</strong> • Submitted: {new Date(t.createdAt).toLocaleDateString()}
                  </div>

                  <p style={{ fontSize: '0.9rem', color: 'var(--text)', lineHeight: 1.5, marginBottom: '0.75rem' }}>
                    {t.message}
                  </p>

                  {/* Admin Reply if any */}
                  {t.adminReply && (
                    <div style={{ background: 'rgba(56, 189, 248, 0.08)', borderLeft: '3px solid var(--info)', padding: '0.75rem 1rem', borderRadius: '4px', marginTop: '0.75rem' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--info)', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                        Support Team Response ({new Date(t.adminRepliedAt || t.updatedAt).toLocaleDateString()}):
                      </div>
                      <div style={{ fontSize: '0.88rem', color: '#fff' }}>
                        {t.adminReply}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </motion.div>
  );
};

export default Support;
