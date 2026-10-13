import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  Plus, 
  Trash2, 
  Edit3, 
  Clock, 
  Dumbbell, 
  Apple, 
  Droplet, 
  Target, 
  Check, 
  X, 
  AlertCircle 
} from 'lucide-react';
import { useAuth } from './context/AuthContext';

const Reminders = () => {
  const token = localStorage.getItem('fitTrackToken');
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [editingReminder, setEditingReminder] = useState(null);

  const initialForm = {
    title: '',
    type: 'workout',
    time: '08:00',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    notes: '',
    active: true
  };
  const [formData, setFormData] = useState(initialForm);

  const fetchReminders = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/reminders', {
        headers: { 'x-auth-token': token }
      });
      if (res.ok) {
        const data = await res.json();
        setReminders(data);
      }
    } catch (err) {
      console.error('Fetch reminders err:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  const handleToggleActive = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/reminders/${id}/toggle`, {
        method: 'PUT',
        headers: { 'x-auth-token': token }
      });
      if (res.ok) {
        const updated = await res.json();
        setReminders(reminders.map(r => r._id === updated._id ? updated : r));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this reminder?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/reminders/${id}`, {
        method: 'DELETE',
        headers: { 'x-auth-token': token }
      });
      if (res.ok) {
        setReminders(reminders.filter(r => r._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenCreate = () => {
    setEditingReminder(null);
    setFormData(initialForm);
    setShowModal(true);
  };

  const handleOpenEdit = (rem) => {
    setEditingReminder(rem);
    setFormData({
      title: rem.title || '',
      type: rem.type || 'workout',
      time: rem.time || '08:00',
      days: rem.days || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      notes: rem.notes || '',
      active: rem.active !== undefined ? rem.active : true
    });
    setShowModal(true);
  };

  const toggleDay = (day) => {
    if (formData.days.includes(day)) {
      setFormData({ ...formData, days: formData.days.filter(d => d !== day) });
    } else {
      setFormData({ ...formData, days: [...formData.days, day] });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingReminder 
        ? `http://localhost:5000/api/reminders/${editingReminder._id}`
        : 'http://localhost:5000/api/reminders';
      const method = editingReminder ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        const saved = await res.json();
        if (editingReminder) {
          setReminders(reminders.map(r => r._id === saved._id ? saved : r));
        } else {
          setReminders([...reminders, saved]);
        }
        setShowModal(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const typeIcon = (type) => {
    switch (type) {
      case 'workout': return <Dumbbell size={20} color="var(--primary)" />;
      case 'meal': return <Apple size={20} color="var(--warning)" />;
      case 'water': return <Droplet size={20} color="var(--info)" />;
      case 'goal': return <Target size={20} color="var(--success)" />;
      default: return <Bell size={20} color="var(--text-muted)" />;
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Clock color="var(--primary)" size={36} /> ALERTS & <span style={{ color: 'var(--primary)' }}>REMINDERS</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.35rem' }}>
            Stay disciplined with scheduled alerts for workouts, meals, hydration, and goal check-ins.
          </p>
        </div>

        <button onClick={handleOpenCreate} className="btn-primary">
          <Plus size={20} /> Set New Reminder
        </button>
      </div>

      {/* Reminders List */}
      {loading ? (
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '3rem' }}>Loading alerts...</p>
      ) : reminders.length === 0 ? (
        <div className="glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
          <Bell size={56} color="var(--primary)" style={{ opacity: 0.5, marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>No Reminders Configured</h3>
          <p style={{ color: 'var(--text-muted)', maxWidth: '400px', margin: '0 auto 1.5rem auto' }}>
            Set notifications for your morning gym sessions, afternoon protein shake, or hydration goals.
          </p>
          <button onClick={handleOpenCreate} className="btn-primary">
            <Plus size={18} /> Add First Alert
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.5rem' }}>
          {reminders.map((rem) => (
            <motion.div 
              key={rem._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel"
              style={{ 
                padding: '1.5rem', 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'space-between',
                opacity: rem.active ? 1 : 0.6,
                borderLeft: rem.active ? '4px solid var(--primary)' : '4px solid var(--surface-border)'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ background: 'var(--surface-light)', padding: '0.5rem', borderRadius: '8px' }}>
                      {typeIcon(rem.type)}
                    </div>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1.2rem', textTransform: 'capitalize' }}>{rem.title}</h3>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{rem.type}</span>
                    </div>
                  </div>

                  {/* Toggle Switch */}
                  <div 
                    onClick={() => handleToggleActive(rem._id)}
                    style={{ 
                      width: '44px', 
                      height: '24px', 
                      background: rem.active ? 'var(--primary)' : 'var(--surface-border)', 
                      borderRadius: '12px', 
                      position: 'relative', 
                      cursor: 'pointer',
                      transition: 'background 0.2s'
                    }}
                    title={rem.active ? 'Deactivate alert' : 'Activate alert'}
                  >
                    <div style={{ 
                      width: '18px', 
                      height: '18px', 
                      background: '#fff', 
                      borderRadius: '50%', 
                      position: 'absolute', 
                      top: '3px', 
                      left: rem.active ? '22px' : '3px',
                      transition: 'left 0.2s'
                    }}></div>
                  </div>
                </div>

                {/* Scheduled Time */}
                <div style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: "'Oswald', sans-serif", color: rem.active ? '#fff' : 'var(--text-muted)', margin: '0.5rem 0' }}>
                  {rem.time}
                </div>

                {/* Days */}
                <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', margin: '0.75rem 0' }}>
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => {
                    const isSelected = (rem.days || []).includes(d);
                    return (
                      <span 
                        key={d} 
                        style={{ 
                          fontSize: '0.75rem', 
                          padding: '0.2rem 0.5rem', 
                          borderRadius: '4px',
                          background: isSelected ? 'var(--primary-glow)' : 'var(--surface-light)',
                          color: isSelected ? 'var(--primary)' : 'var(--text-muted)',
                          fontWeight: isSelected ? 700 : 400
                        }}
                      >
                        {d}
                      </span>
                    );
                  })}
                </div>

                {rem.notes && (
                  <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {rem.notes}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', borderTop: '1px solid var(--surface-border)', paddingTop: '1rem', marginTop: '1rem' }}>
                <button 
                  onClick={() => handleOpenEdit(rem)}
                  style={{ background: 'var(--surface-light)', border: '1px solid var(--surface-border)', color: 'var(--text)', padding: '0.4rem', borderRadius: '6px', cursor: 'pointer' }}
                  title="Edit"
                >
                  <Edit3 size={16} />
                </button>
                <button 
                  onClick={() => handleDelete(rem._id)}
                  style={{ background: 'var(--danger-bg)', border: '1px solid var(--danger)', color: 'var(--danger)', padding: '0.4rem', borderRadius: '6px', cursor: 'pointer' }}
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>

            </motion.div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '550px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--surface-border)', paddingBottom: '1rem' }}>
              <h2 style={{ margin: 0, fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Clock color="var(--primary)" /> {editingReminder ? 'Edit Reminder' : 'Set New Alert & Reminder'}
              </h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Reminder Title *</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="e.g. Afternoon Heavy Lifting Session" 
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Alert Type</label>
                  <select 
                    className="input-field"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  >
                    <option value="workout">Workout Session</option>
                    <option value="meal">Meal / Nutrition</option>
                    <option value="water">Hydration Intake</option>
                    <option value="goal">Fitness Goal Check</option>
                    <option value="other">General Reminder</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Time</label>
                  <input 
                    type="time" 
                    className="input-field" 
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Active Days */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Repeat On Days</label>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => {
                    const isSelected = formData.days.includes(day);
                    return (
                      <button
                        type="button"
                        key={day}
                        onClick={() => toggleDay(day)}
                        style={{
                          padding: '0.45rem 0.85rem',
                          borderRadius: '6px',
                          border: isSelected ? '1px solid var(--primary)' : '1px solid var(--surface-border)',
                          background: isSelected ? 'var(--primary)' : 'var(--surface-light)',
                          color: isSelected ? '#fff' : 'var(--text-muted)',
                          cursor: 'pointer',
                          fontWeight: 600,
                          fontSize: '0.85rem'
                        }}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Instructions / Notes</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="e.g. Drink 500ml water and warm up shoulders..." 
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>

              <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem' }}>
                {editingReminder ? 'Update Alert' : 'Save Alert'}
              </button>

            </form>
          </div>
        </div>
      )}

    </motion.div>
  );
};

export default Reminders;
