import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  Filter, 
  X, 
  Dumbbell, 
  Clock, 
  Flame, 
  Tag, 
  Eye, 
  TrendingUp, 
  CheckCircle,
  BarChart2
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  Legend 
} from 'recharts';
import { useAuth } from './context/AuthContext';

const Workouts = () => {
  const { user, formatWeight } = useAuth();
  const token = localStorage.getItem('fitTrackToken');

  const [workouts, setWorkouts] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [activeTab, setActiveTab] = useState('routines'); // 'routines' or 'analytics'
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [tagFilter, setTagFilter] = useState('');

  // Modals
  const [showModal, setShowModal] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState(null);
  const [viewingWorkout, setViewingWorkout] = useState(null);

  // Form State
  const initialForm = {
    name: '',
    category: 'strength',
    tags: [],
    duration: 45,
    intensity: 'medium',
    notes: '',
    completed: true,
    exercises: [
      { name: '', sets: 3, reps: 10, weight: 20, duration: 0, restSeconds: 60, notes: '' }
    ]
  };
  const [formData, setFormData] = useState(initialForm);
  const [newTagInput, setNewTagInput] = useState('');

  const fetchWorkouts = async () => {
    try {
      let url = 'http://localhost:5000/api/workouts?';
      if (categoryFilter !== 'all') url += `category=${categoryFilter}&`;
      if (tagFilter) url += `tag=${encodeURIComponent(tagFilter)}&`;
      if (search.trim()) url += `search=${encodeURIComponent(search.trim())}&`;

      const res = await fetch(url, {
        headers: { 'x-auth-token': token }
      });
      if (res.ok) {
        const data = await res.json();
        setWorkouts(data);
      }
    } catch (err) {
      console.error('Fetch workouts error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/workouts/analytics', {
        headers: { 'x-auth-token': token }
      });
      if (res.ok) {
        const data = await res.json();
        setAnalytics(data);
      }
    } catch (err) {
      console.error('Analytics error:', err);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, [categoryFilter, tagFilter, search]);

  useEffect(() => {
    if (activeTab === 'analytics') {
      fetchAnalytics();
    }
  }, [activeTab]);

  const handleOpenCreate = () => {
    setEditingWorkout(null);
    setFormData(initialForm);
    setShowModal(true);
  };

  const handleOpenEdit = (workout) => {
    setEditingWorkout(workout);
    setFormData({
      name: workout.name || '',
      category: workout.category || 'strength',
      tags: workout.tags || [],
      duration: workout.duration || 45,
      intensity: workout.intensity || 'medium',
      notes: workout.notes || '',
      completed: workout.completed !== undefined ? workout.completed : true,
      exercises: workout.exercises && workout.exercises.length > 0 
        ? workout.exercises 
        : [{ name: '', sets: 3, reps: 10, weight: 0, duration: 0, restSeconds: 60, notes: '' }]
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this workout routine?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/workouts/${id}`, {
        method: 'DELETE',
        headers: { 'x-auth-token': token }
      });
      if (res.ok) {
        setWorkouts(workouts.filter(w => w._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddExercise = () => {
    setFormData({
      ...formData,
      exercises: [
        ...formData.exercises,
        { name: '', sets: 3, reps: 10, weight: 0, duration: 0, restSeconds: 60, notes: '' }
      ]
    });
  };

  const handleRemoveExercise = (index) => {
    if (formData.exercises.length === 1) return;
    const updated = formData.exercises.filter((_, i) => i !== index);
    setFormData({ ...formData, exercises: updated });
  };

  const handleExerciseChange = (index, field, value) => {
    const updated = [...formData.exercises];
    updated[index][field] = value;
    setFormData({ ...formData, exercises: updated });
  };

  const handleAddTag = () => {
    if (newTagInput.trim() && !formData.tags.includes(newTagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTagInput.trim()]
      });
      setNewTagInput('');
    }
  };

  const handleRemoveTag = (tag) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(t => t !== tag)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingWorkout 
        ? `http://localhost:5000/api/workouts/${editingWorkout._id}`
        : 'http://localhost:5000/api/workouts';
      const method = editingWorkout ? 'PUT' : 'POST';

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
        if (editingWorkout) {
          setWorkouts(workouts.map(w => w._id === saved._id ? saved : w));
        } else {
          setWorkouts([saved, ...workouts]);
        }
        setShowModal(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const COLORS = ['#f59e0b', '#fbbf24', '#d97706', '#38bdf8', '#10b981', '#a855f7'];

  const categoryColor = (cat) => {
    switch (cat) {
      case 'strength': return 'var(--primary)';
      case 'cardio': return 'var(--info)';
      case 'hiit': return 'var(--warning)';
      case 'flexibility': return 'var(--success)';
      case 'bodyweight': return 'var(--purple)';
      default: return 'var(--text-muted)';
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
            <Activity color="var(--primary)" size={36} /> WORKOUT <span style={{ color: 'var(--primary)' }}>ROUTINES</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.35rem' }}>
            Build custom workout routines, record sets and reps, and analyze your lifting volume.
          </p>
        </div>

        <button onClick={handleOpenCreate} className="btn-primary">
          <Plus size={20} /> Create Workout
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--surface-border)', paddingBottom: '1rem', marginBottom: '2rem' }}>
        <button 
          onClick={() => setActiveTab('routines')}
          style={{ 
            background: 'none', 
            border: 'none', 
            color: activeTab === 'routines' ? 'var(--primary)' : 'var(--text-muted)', 
            fontSize: '1.1rem', 
            fontWeight: 700, 
            cursor: 'pointer',
            fontFamily: "'Oswald', sans-serif",
            letterSpacing: '0.5px',
            position: 'relative',
            paddingBottom: '0.5rem'
          }}
        >
          My Workouts & Routines ({workouts.length})
          {activeTab === 'routines' && (
            <motion.div layoutId="tabUnderline" style={{ position: 'absolute', bottom: '-1rem', left: 0, right: 0, height: '3px', background: 'var(--primary)' }} />
          )}
        </button>

        <button 
          onClick={() => setActiveTab('analytics')}
          style={{ 
            background: 'none', 
            border: 'none', 
            color: activeTab === 'analytics' ? 'var(--primary)' : 'var(--text-muted)', 
            fontSize: '1.1rem', 
            fontWeight: 700, 
            cursor: 'pointer',
            fontFamily: "'Oswald', sans-serif",
            letterSpacing: '0.5px',
            position: 'relative',
            paddingBottom: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <BarChart2 size={18} /> Workout Analytics
          {activeTab === 'analytics' && (
            <motion.div layoutId="tabUnderline" style={{ position: 'absolute', bottom: '-1rem', left: 0, right: 0, height: '3px', background: 'var(--primary)' }} />
          )}
        </button>
      </div>

      {activeTab === 'routines' ? (
        <>
          {/* Search & Filters Bar */}
          <div className="glass-panel" style={{ padding: '1.25rem 1.5rem', marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '260px', position: 'relative' }}>
                <Search size={18} style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="Search routines or exercises (e.g. Bench, Squat, Cardio)..."
                  style={{ paddingLeft: '2.75rem' }}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              {/* Tag Search */}
              <div style={{ width: '220px', position: 'relative' }}>
                <Tag size={18} style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="Filter by tag..."
                  style={{ paddingLeft: '2.75rem' }}
                  value={tagFilter}
                  onChange={(e) => setTagFilter(e.target.value)}
                />
              </div>
            </div>

            {/* Category Filter Pills */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginRight: '0.5rem' }}>Category:</span>
              {['all', 'strength', 'cardio', 'hiit', 'flexibility', 'bodyweight', 'other'].map(cat => (
                <button 
                  key={cat} 
                  className={`filter-pill ${categoryFilter === cat ? 'active' : ''}`}
                  onClick={() => setCategoryFilter(cat)}
                  style={{ textTransform: 'capitalize' }}
                >
                  {cat}
                </button>
              ))}
            </div>

          </div>

          {/* Workouts Grid */}
          {loading ? (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '3rem' }}>Loading routines...</p>
          ) : workouts.length === 0 ? (
            <div className="glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
              <Dumbbell size={56} color="var(--primary)" style={{ opacity: 0.6, marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>No Workouts Found</h3>
              <p style={{ color: 'var(--text-muted)', maxWidth: '400px', margin: '0 auto 1.5rem auto' }}>
                {search || categoryFilter !== 'all' || tagFilter 
                  ? 'No workout routines match your current filters. Try resetting the filters.'
                  : 'Start by creating your first workout routine to track sets, reps, and weights.'}
              </p>
              <button onClick={handleOpenCreate} className="btn-primary">
                <Plus size={18} /> Create New Routine
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.5rem' }}>
              {workouts.map((w, index) => (
                <motion.div 
                  key={w._id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="glass-panel" 
                  style={{ 
                    padding: '1.5rem', 
                    position: 'relative', 
                    overflow: 'hidden', 
                    borderLeft: `4px solid ${categoryColor(w.category)}`,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                      <h3 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, textTransform: 'uppercase' }}>{w.name}</h3>
                      <span className="badge" style={{ background: 'rgba(255,255,255,0.08)', color: categoryColor(w.category) }}>
                        {w.category}
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Clock size={14} /> {w.duration || 45} mins
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Dumbbell size={14} /> {w.exercises?.length || 0} exercises
                      </span>
                      {w.totalVolume > 0 && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--primary)', fontWeight: 600 }}>
                          <Flame size={14} /> {w.totalVolume} kg volume
                        </span>
                      )}
                    </div>

                    {/* Exercise Preview List */}
                    <div style={{ background: 'var(--surface-light)', borderRadius: '8px', padding: '0.75rem', marginBottom: '1rem' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.4rem', fontWeight: 600 }}>
                        Routine Breakdown:
                      </div>
                      {(w.exercises || []).slice(0, 3).map((ex, idx) => (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', padding: '0.2rem 0' }}>
                          <span style={{ color: 'var(--text)' }}>• {ex.name}</span>
                          <span style={{ color: 'var(--text-muted)' }}>
                            {ex.sets}x{ex.reps} {ex.weight > 0 ? `@ ${ex.weight}kg` : ''}
                          </span>
                        </div>
                      ))}
                      {(w.exercises?.length || 0) > 3 && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--primary)', marginTop: '0.3rem', fontWeight: 600 }}>
                          +{w.exercises.length - 3} more exercise(s)...
                        </div>
                      )}
                    </div>

                    {/* Tags */}
                    {w.tags && w.tags.length > 0 && (
                      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                        {w.tags.map(t => (
                          <span key={t} style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', color: 'var(--text-muted)' }}>
                            #{t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--surface-border)', paddingTop: '1rem', marginTop: '0.5rem' }}>
                    <button 
                      onClick={() => setViewingWorkout(w)}
                      className="btn-outline btn-sm"
                      style={{ padding: '0.4rem 0.85rem' }}
                    >
                      <Eye size={15} /> Details
                    </button>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button 
                        onClick={() => handleOpenEdit(w)}
                        style={{ background: 'var(--surface-light)', border: '1px solid var(--surface-border)', color: 'var(--text)', padding: '0.4rem', borderRadius: '6px', cursor: 'pointer' }}
                        title="Edit Workout"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(w._id)}
                        style={{ background: 'var(--danger-bg)', border: '1px solid var(--danger)', color: 'var(--danger)', padding: '0.4rem', borderRadius: '6px', cursor: 'pointer' }}
                        title="Delete Workout"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                </motion.div>
              ))}
            </div>
          )}
        </>
      ) : (
        /* Workout Analytics Tab */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            
            <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>TOTAL WORKOUTS</div>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: "'Oswald', sans-serif", color: 'var(--primary)' }}>
                {analytics?.totalCount || 0}
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>TOTAL VOLUME LIFTED</div>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: "'Oswald', sans-serif", color: 'var(--info)' }}>
                {analytics?.totalVolumeSum || 0} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>kg</span>
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>ACTIVE TRAINING TIME</div>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: "'Oswald', sans-serif", color: 'var(--success)' }}>
                {analytics?.totalMinutes || 0} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>mins</span>
              </div>
            </div>

          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
            
            {/* Category Breakdown Donut */}
            <div className="glass-panel" style={{ padding: '2rem', height: '380px', display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', marginBottom: '1rem' }}>Category Distribution</h3>
              <div style={{ flex: 1 }}>
                {(!analytics?.categoryDistribution || analytics.categoryDistribution.length === 0) ? (
                  <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '4rem' }}>No data to display</p>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analytics.categoryDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={95}
                        paddingAngle={5}
                        dataKey="count"
                        nameKey="name"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {analytics.categoryDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: 'var(--surface)', border: '1px solid var(--surface-border-light)', borderRadius: '8px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Exercise Personal Records (PRs) */}
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <TrendingUp color="var(--primary)" size={22} /> Exercise Personal Bests (PR)
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {(!analytics?.prList || analytics.prList.length === 0) ? (
                  <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>Log weighted exercises to establish your personal records.</p>
                ) : (
                  analytics.prList.map((pr, i) => (
                    <div 
                      key={i}
                      style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        padding: '0.75rem 1rem', 
                        background: 'var(--surface-light)', 
                        borderRadius: '8px', 
                        border: '1px solid var(--surface-border)' 
                      }}
                    >
                      <div>
                        <span style={{ fontWeight: 600, fontSize: '0.95rem', textTransform: 'capitalize' }}>{pr.exercise}</span>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Recorded on {new Date(pr.date).toLocaleDateString()}</div>
                      </div>
                      <span style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--primary)', fontFamily: "'Oswald', sans-serif" }}>
                        {pr.maxWeight} kg
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* Create / Edit Workout Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '700px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--surface-border)', paddingBottom: '1rem' }}>
              <h2 style={{ margin: 0, fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Dumbbell color="var(--primary)" /> {editingWorkout ? 'Edit Workout Routine' : 'Create Workout Routine'}
              </h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Workout Name *</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="e.g. Chest & Triceps Hypertrophy" 
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Category</label>
                  <select 
                    className="input-field"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="strength">Strength</option>
                    <option value="cardio">Cardio</option>
                    <option value="hiit">HIIT</option>
                    <option value="flexibility">Flexibility</option>
                    <option value="bodyweight">Bodyweight</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Duration (Minutes)</label>
                  <input 
                    type="number" 
                    className="input-field" 
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Intensity</label>
                  <select 
                    className="input-field"
                    value={formData.intensity}
                    onChange={(e) => setFormData({ ...formData, intensity: e.target.value })}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="extreme">Extreme</option>
                  </select>
                </div>
              </div>

              {/* Tags Input */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Tags (e.g. Chest, Gym, Morning)</label>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="Add a tag..."
                    value={newTagInput}
                    onChange={(e) => setNewTagInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag(); } }}
                  />
                  <button type="button" onClick={handleAddTag} className="btn-outline btn-sm">Add</button>
                </div>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  {formData.tags.map(t => (
                    <span key={t} style={{ background: 'var(--surface-light)', border: '1px solid var(--surface-border)', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      #{t}
                      <X size={12} style={{ cursor: 'pointer' }} onClick={() => handleRemoveTag(t)} />
                    </span>
                  ))}
                </div>
              </div>

              {/* Exercises List Editor */}
              <div style={{ marginTop: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <h4 style={{ margin: 0, fontSize: '1rem', textTransform: 'uppercase' }}>Exercises in Routine ({formData.exercises.length})</h4>
                  <button type="button" onClick={handleAddExercise} className="btn-outline btn-sm" style={{ padding: '0.3rem 0.75rem' }}>
                    <Plus size={14} /> Add Exercise
                  </button>
                </div>

                {/* Column Headers Bar */}
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 36px', gap: '0.5rem', padding: '0.45rem 0.75rem', background: 'rgba(245, 158, 11, 0.12)', borderRadius: '6px', border: '1px solid rgba(245, 158, 11, 0.25)', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Exercise Name *</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>Sets</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>Reps</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>Weight (kg)</span>
                  <span></span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '250px', overflowY: 'auto' }}>
                  {formData.exercises.map((ex, idx) => (
                    <div key={idx} style={{ background: 'var(--surface-light)', border: '1px solid var(--surface-border)', borderRadius: '8px', padding: '0.75rem', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 36px', gap: '0.5rem', alignItems: 'flex-start' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.25rem', fontWeight: 600 }}>Exercise Name *</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Bench Press"
                          className="input-field" 
                          value={ex.name}
                          onChange={(e) => handleExerciseChange(idx, 'name', e.target.value)}
                          required
                          style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.25rem', fontWeight: 600, textAlign: 'center' }}>Sets</label>
                        <input 
                          type="number" 
                          placeholder="3"
                          min="1"
                          title="Sets"
                          className="input-field" 
                          value={ex.sets}
                          onChange={(e) => handleExerciseChange(idx, 'sets', e.target.value)}
                          style={{ padding: '0.5rem 0.5rem', fontSize: '0.85rem', textAlign: 'center' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.25rem', fontWeight: 600, textAlign: 'center' }}>Reps</label>
                        <input 
                          type="number" 
                          placeholder="10"
                          min="1"
                          title="Reps"
                          className="input-field" 
                          value={ex.reps}
                          onChange={(e) => handleExerciseChange(idx, 'reps', e.target.value)}
                          style={{ padding: '0.5rem 0.5rem', fontSize: '0.85rem', textAlign: 'center' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.25rem', fontWeight: 600, textAlign: 'center' }}>Weight (kg)</label>
                        <input 
                          type="number" 
                          placeholder="0"
                          min="0"
                          step="0.5"
                          title="Weight (kg)"
                          className="input-field" 
                          value={ex.weight}
                          onChange={(e) => handleExerciseChange(idx, 'weight', e.target.value)}
                          style={{ padding: '0.5rem 0.5rem', fontSize: '0.85rem', textAlign: 'center' }}
                        />
                      </div>
                      <div style={{ paddingTop: '1.45rem', textAlign: 'center' }}>
                        <button 
                          type="button" 
                          onClick={() => handleRemoveExercise(idx)} 
                          style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '0.25rem' }}
                          disabled={formData.exercises.length === 1}
                          title="Remove Exercise"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Routine Notes</label>
                <textarea 
                  className="input-field" 
                  rows="2" 
                  placeholder="Warm-up instructions, form tips, superset notes..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                ></textarea>
              </div>

              <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem' }}>
                {editingWorkout ? 'Update Routine' : 'Save Workout Routine'}
              </button>

            </form>
          </div>
        </div>
      )}

      {/* View Workout Details Modal */}
      {viewingWorkout && (
        <div className="modal-overlay" onClick={() => setViewingWorkout(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--surface-border)', paddingBottom: '1rem' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.6rem', textTransform: 'uppercase' }}>{viewingWorkout.name}</h2>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  {viewingWorkout.category.toUpperCase()} • {viewingWorkout.duration} mins • {new Date(viewingWorkout.date).toLocaleDateString()}
                </div>
              </div>
              <button onClick={() => setViewingWorkout(null)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>

            {viewingWorkout.notes && (
              <div style={{ background: 'var(--surface-light)', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                <strong>Notes:</strong> {viewingWorkout.notes}
              </div>
            )}

            <h4 style={{ margin: '0 0 0.75rem 0', textTransform: 'uppercase' }}>Exercises & Sets</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
              {(viewingWorkout.exercises || []).map((ex, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 1rem', background: 'var(--surface-light)', borderRadius: '8px', border: '1px solid var(--surface-border)' }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{ex.name}</div>
                    {ex.notes && <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{ex.notes}</div>}
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 700, color: 'var(--primary)' }}>{ex.sets} sets × {ex.reps} reps</div>
                    {ex.weight > 0 && <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>@ {ex.weight} kg</div>}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--surface-border)', paddingTop: '1rem' }}>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Total Volume Lifted: <strong style={{ color: '#fff' }}>{viewingWorkout.totalVolume || 0} kg</strong>
              </div>
              <button onClick={() => { setViewingWorkout(null); handleOpenEdit(viewingWorkout); }} className="btn-primary btn-sm">
                <Edit3 size={15} /> Edit Routine
              </button>
            </div>
          </div>
        </div>
      )}

    </motion.div>
  );
};

export default Workouts;
