import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  Plus, 
  Trash2, 
  Edit3, 
  Calendar, 
  Scale, 
  Ruler, 
  Trophy, 
  Award, 
  X, 
  Activity,
  Flame,
  ArrowDown,
  ArrowUp
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ReferenceLine 
} from 'recharts';
import { useAuth } from './context/AuthContext';

const Progress = () => {
  const { user, formatWeight, formatLength } = useAuth();
  const token = localStorage.getItem('fitTrackToken');

  const [entries, setEntries] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showModal, setShowModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);

  // Form State
  const initialForm = {
    date: new Date().toISOString().split('T')[0],
    weight: 70,
    bodyFatPercentage: 15,
    measurements: {
      chest: 100,
      waist: 80,
      hips: 95,
      arms: 38,
      thighs: 58,
      calves: 38,
      shoulders: 120,
      neck: 39
    },
    performanceMetrics: {
      benchPress: 80,
      squat: 110,
      deadlift: 140,
      overheadPress: 50,
      run5kTimeMinutes: 24,
      pullUps: 12
    },
    notes: ''
  };
  const [formData, setFormData] = useState(initialForm);

  const fetchEntries = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/progress', {
        headers: { 'x-auth-token': token }
      });
      if (res.ok) {
        const data = await res.json();
        setEntries(data);
      }
    } catch (err) {
      console.error('Fetch progress error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/progress/analytics', {
        headers: { 'x-auth-token': token }
      });
      if (res.ok) {
        const data = await res.json();
        setAnalytics(data);
      }
    } catch (err) {
      console.error('Fetch analytics error:', err);
    }
  };

  useEffect(() => {
    fetchEntries();
    fetchAnalytics();
  }, [token]);

  const handleOpenCreate = () => {
    setEditingEntry(null);
    setFormData({
      ...initialForm,
      date: new Date().toISOString().split('T')[0],
      weight: user?.currentWeight || 70
    });
    setShowModal(true);
  };

  const handleOpenEdit = (entry) => {
    setEditingEntry(entry);
    setFormData({
      date: new Date(entry.date).toISOString().split('T')[0],
      weight: entry.weight || 70,
      bodyFatPercentage: entry.bodyFatPercentage || 0,
      measurements: { ...initialForm.measurements, ...(entry.measurements || {}) },
      performanceMetrics: { ...initialForm.performanceMetrics, ...(entry.performanceMetrics || {}) },
      notes: entry.notes || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this progress record?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/progress/${id}`, {
        method: 'DELETE',
        headers: { 'x-auth-token': token }
      });
      if (res.ok) {
        setEntries(entries.filter(e => e._id !== id));
        fetchAnalytics();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingEntry 
        ? `http://localhost:5000/api/progress/${editingEntry._id}`
        : 'http://localhost:5000/api/progress';
      const method = editingEntry ? 'PUT' : 'POST';

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
        if (editingEntry) {
          setEntries(entries.map(e => e._id === saved._id ? saved : e));
        } else {
          setEntries([saved, ...entries]);
        }
        fetchAnalytics();
        setShowModal(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const latest = entries[0];
  const targetWeight = user?.targetWeight || 68;

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
            <TrendingUp color="var(--primary)" size={36} /> PROGRESS & <span style={{ color: 'var(--primary)' }}>METRICS</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.35rem' }}>
            Track your weight transformation, body measurements, and athletic performance benchmarks over time.
          </p>
        </div>

        <button onClick={handleOpenCreate} className="btn-primary">
          <Plus size={20} /> Record Progress
        </button>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        
        {/* Current Weight */}
        <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid var(--info)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <span>Current Weight</span>
            <Scale size={18} color="var(--info)" />
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, fontFamily: "'Oswald', sans-serif", margin: '0.2rem 0' }}>
            {formatWeight(latest?.weight || user?.currentWeight || 70)}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Target: <strong style={{ color: '#fff' }}>{formatWeight(targetWeight)}</strong>
          </div>
        </div>

        {/* Total Delta */}
        <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid var(--primary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <span>Weight Progress</span>
            <Activity size={18} color="var(--primary)" />
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, fontFamily: "'Oswald', sans-serif", margin: '0.2rem 0', color: Number(analytics?.totalWeightChange) <= 0 ? 'var(--success)' : 'var(--warning)' }}>
            {analytics?.totalWeightChange !== undefined ? `${analytics.totalWeightChange > 0 ? `+${analytics.totalWeightChange}` : analytics.totalWeightChange} kg` : '0 kg'}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Since First Entry: {formatWeight(analytics?.startingWeight || 70)}
          </div>
        </div>

        {/* Body Fat */}
        <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid var(--warning)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <span>Body Fat %</span>
            <Flame size={18} color="var(--warning)" />
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, fontFamily: "'Oswald', sans-serif", margin: '0.2rem 0', color: 'var(--warning)' }}>
            {latest?.bodyFatPercentage ? `${latest.bodyFatPercentage}%` : 'N/A'}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Waist: <strong>{formatLength(latest?.measurements?.waist || 80)}</strong>
          </div>
        </div>

        {/* Bench Press PR */}
        <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid var(--purple)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <span>Bench Press PR</span>
            <Trophy size={18} color="var(--purple)" />
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, fontFamily: "'Oswald', sans-serif", margin: '0.2rem 0', color: 'var(--purple)' }}>
            {latest?.performanceMetrics?.benchPress ? `${latest.performanceMetrics.benchPress} kg` : '-'}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Squat: <strong>{latest?.performanceMetrics?.squat || '-'}kg</strong> • DL: <strong>{latest?.performanceMetrics?.deadlift || '-'}kg</strong>
          </div>
        </div>

      </div>

      {/* Main Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        
        {/* Weight Progression Chart */}
        <div className="glass-panel" style={{ padding: '2rem', height: '400px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Weight Transformation Over Time</h3>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Historical weight vs target goal line</p>
            </div>
            <span className="badge" style={{ background: 'var(--info-bg)', color: 'var(--info)' }}>
              Target: {targetWeight} kg
            </span>
          </div>

          <div style={{ flex: 1 }}>
            {(!analytics?.weightHistory || analytics.weightHistory.length === 0) ? (
              <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '4rem' }}>Log your weight to see your progress curve.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics.weightHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--surface-border)" vertical={false} />
                  <XAxis dataKey="date" stroke="var(--text-muted)" axisLine={false} tickLine={false} />
                  <YAxis stroke="var(--text-muted)" axisLine={false} tickLine={false} domain={['dataMin - 3', 'dataMax + 3']} />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--surface)', border: '1px solid var(--surface-border-light)', borderRadius: '8px' }} />
                  <ReferenceLine y={targetWeight} stroke="#10b981" strokeDasharray="4 4" label={{ value: 'Target Goal', fill: '#10b981', position: 'top' }} />
                  <Line type="monotone" dataKey="weight" stroke="var(--primary)" strokeWidth={3} dot={{ r: 5, fill: 'var(--primary)' }} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Body Measurements Evolution */}
        <div className="glass-panel" style={{ padding: '2rem', height: '400px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Body Measurements Trend (cm)</h3>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Chest, Waist, Hips, and Arms evolution</p>
            </div>
          </div>

          <div style={{ flex: 1 }}>
            {(!analytics?.measurementsHistory || analytics.measurementsHistory.length === 0) ? (
              <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '4rem' }}>No measurements data recorded yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics.measurementsHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--surface-border)" vertical={false} />
                  <XAxis dataKey="date" stroke="var(--text-muted)" axisLine={false} tickLine={false} />
                  <YAxis stroke="var(--text-muted)" axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--surface)', border: '1px solid var(--surface-border-light)', borderRadius: '8px' }} />
                  <Legend />
                  <Line type="monotone" dataKey="chest" name="Chest" stroke="#38bdf8" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="waist" name="Waist" stroke="#f59e0b" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="arms" name="Arms" stroke="#ef4444" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="hips" name="Hips" stroke="#10b981" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

      </div>

      {/* History Table */}
      <div className="glass-panel" style={{ padding: '2rem' }}>
        <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.25rem' }}>Progress Log History</h3>
        
        {entries.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>No progress entries recorded yet.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--surface-border)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '0.75rem 1rem' }}>DATE</th>
                  <th style={{ padding: '0.75rem 1rem' }}>WEIGHT</th>
                  <th style={{ padding: '0.75rem 1rem' }}>BODY FAT</th>
                  <th style={{ padding: '0.75rem 1rem' }}>CHEST / WAIST / ARMS</th>
                  <th style={{ padding: '0.75rem 1rem' }}>BENCH / SQUAT / DL</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {entries.map(e => (
                  <tr key={e._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.2s' }}>
                    <td style={{ padding: '1rem', fontWeight: 600 }}>{new Date(e.date).toLocaleDateString()}</td>
                    <td style={{ padding: '1rem', color: 'var(--primary)', fontWeight: 700 }}>{formatWeight(e.weight)}</td>
                    <td style={{ padding: '1rem' }}>{e.bodyFatPercentage ? `${e.bodyFatPercentage}%` : '-'}</td>
                    <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>
                      {e.measurements?.chest || '-'}cm / {e.measurements?.waist || '-'}cm / {e.measurements?.arms || '-'}cm
                    </td>
                    <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>
                      {e.performanceMetrics?.benchPress || '-'}kg / {e.performanceMetrics?.squat || '-'}kg / {e.performanceMetrics?.deadlift || '-'}kg
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                        <button 
                          onClick={() => handleOpenEdit(e)} 
                          style={{ background: 'var(--surface-light)', border: '1px solid var(--surface-border)', color: 'var(--text)', padding: '0.4rem', borderRadius: '6px', cursor: 'pointer' }}
                          title="Edit"
                        >
                          <Edit3 size={15} />
                        </button>
                        <button 
                          onClick={() => handleDelete(e._id)} 
                          style={{ background: 'var(--danger-bg)', border: '1px solid var(--danger)', color: 'var(--danger)', padding: '0.4rem', borderRadius: '6px', cursor: 'pointer' }}
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Log Progress Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '750px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--surface-border)', paddingBottom: '1rem' }}>
              <h2 style={{ margin: 0, fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <TrendingUp color="var(--primary)" /> {editingEntry ? 'Edit Progress Record' : 'Record Fitness Progress'}
              </h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Date *</label>
                  <input 
                    type="date" 
                    className="input-field" 
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Weight (kg) *</label>
                  <input 
                    type="number" 
                    step="0.1"
                    className="input-field" 
                    placeholder="e.g. 72.5"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Body Fat %</label>
                  <input 
                    type="number" 
                    step="0.1"
                    className="input-field" 
                    placeholder="e.g. 14.5"
                    value={formData.bodyFatPercentage}
                    onChange={(e) => setFormData({ ...formData, bodyFatPercentage: e.target.value })}
                  />
                </div>
              </div>

              {/* Body Measurements Section */}
              <div style={{ background: 'var(--surface-light)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--surface-border)' }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.75rem', textTransform: 'uppercase', color: 'var(--info)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Ruler size={16} /> Body Measurements (cm)
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem' }}>
                  {['chest', 'waist', 'hips', 'arms', 'thighs', 'calves', 'shoulders', 'neck'].map(key => (
                    <div key={key}>
                      <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'capitalize', marginBottom: '0.2rem' }}>{key}</label>
                      <input 
                        type="number"
                        step="0.5"
                        className="input-field"
                        style={{ padding: '0.4rem 0.6rem', fontSize: '0.85rem' }}
                        value={formData.measurements[key] || 0}
                        onChange={(e) => setFormData({
                          ...formData,
                          measurements: { ...formData.measurements, [key]: Number(e.target.value) }
                        })}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Performance Metrics Section */}
              <div style={{ background: 'var(--surface-light)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--surface-border)' }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.75rem', textTransform: 'uppercase', color: 'var(--purple)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Trophy size={16} /> Performance Benchmarks (Lifting PRs & Run Times)
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.75rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Bench Press (kg)</label>
                    <input 
                      type="number"
                      className="input-field"
                      style={{ padding: '0.4rem 0.6rem', fontSize: '0.85rem' }}
                      value={formData.performanceMetrics.benchPress || 0}
                      onChange={(e) => setFormData({
                        ...formData,
                        performanceMetrics: { ...formData.performanceMetrics, benchPress: Number(e.target.value) }
                      })}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Squat (kg)</label>
                    <input 
                      type="number"
                      className="input-field"
                      style={{ padding: '0.4rem 0.6rem', fontSize: '0.85rem' }}
                      value={formData.performanceMetrics.squat || 0}
                      onChange={(e) => setFormData({
                        ...formData,
                        performanceMetrics: { ...formData.performanceMetrics, squat: Number(e.target.value) }
                      })}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Deadlift (kg)</label>
                    <input 
                      type="number"
                      className="input-field"
                      style={{ padding: '0.4rem 0.6rem', fontSize: '0.85rem' }}
                      value={formData.performanceMetrics.deadlift || 0}
                      onChange={(e) => setFormData({
                        ...formData,
                        performanceMetrics: { ...formData.performanceMetrics, deadlift: Number(e.target.value) }
                      })}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Overhead Press (kg)</label>
                    <input 
                      type="number"
                      className="input-field"
                      style={{ padding: '0.4rem 0.6rem', fontSize: '0.85rem' }}
                      value={formData.performanceMetrics.overheadPress || 0}
                      onChange={(e) => setFormData({
                        ...formData,
                        performanceMetrics: { ...formData.performanceMetrics, overheadPress: Number(e.target.value) }
                      })}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>5K Run Time (Mins)</label>
                    <input 
                      type="number"
                      step="0.5"
                      className="input-field"
                      style={{ padding: '0.4rem 0.6rem', fontSize: '0.85rem' }}
                      value={formData.performanceMetrics.run5kTimeMinutes || 0}
                      onChange={(e) => setFormData({
                        ...formData,
                        performanceMetrics: { ...formData.performanceMetrics, run5kTimeMinutes: Number(e.target.value) }
                      })}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Max Pull-ups</label>
                    <input 
                      type="number"
                      className="input-field"
                      style={{ padding: '0.4rem 0.6rem', fontSize: '0.85rem' }}
                      value={formData.performanceMetrics.pullUps || 0}
                      onChange={(e) => setFormData({
                        ...formData,
                        performanceMetrics: { ...formData.performanceMetrics, pullUps: Number(e.target.value) }
                      })}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Notes</label>
                <input 
                  type="text"
                  className="input-field"
                  placeholder="e.g. Felt energetic today, new deadlift milestone reached..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>

              <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem' }}>
                {editingEntry ? 'Update Record' : 'Save Progress Record'}
              </button>

            </form>
          </div>
        </div>
      )}

    </motion.div>
  );
};

export default Progress;
