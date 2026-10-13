import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Apple, 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  Calendar, 
  Droplet, 
  Flame, 
  PieChart as PieIcon, 
  X, 
  ChevronRight,
  TrendingUp,
  BarChart2
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  Legend
} from 'recharts';
import { useAuth } from './context/AuthContext';

const Nutrition = () => {
  const { user } = useAuth();
  const token = localStorage.getItem('fitTrackToken');

  const [logs, setLogs] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [activeTab, setActiveTab] = useState('logs'); // 'logs' or 'analytics'
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [mealFilter, setMealFilter] = useState('all');
  const [search, setSearch] = useState('');

  // Modals
  const [showModal, setShowModal] = useState(false);
  const [editingLog, setEditingLog] = useState(null);

  // Form state
  const initialForm = {
    date: new Date().toISOString().split('T')[0],
    mealType: 'breakfast',
    waterIntake: 0,
    notes: '',
    foodItems: [
      { name: '', quantity: '1 serving', calories: 250, protein: 15, carbs: 30, fat: 8 }
    ]
  };
  const [formData, setFormData] = useState(initialForm);

  const fetchLogs = async () => {
    try {
      let url = 'http://localhost:5000/api/nutrition?';
      if (selectedDate) url += `date=${selectedDate}&`;
      if (mealFilter !== 'all') url += `mealType=${mealFilter}&`;
      if (search.trim()) url += `search=${encodeURIComponent(search.trim())}&`;

      const res = await fetch(url, {
        headers: { 'x-auth-token': token }
      });
      if (res.ok) {
        const data = await res.json();
        setLogs(data);
      }
    } catch (err) {
      console.error('Fetch nutrition logs error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/nutrition/analytics', {
        headers: { 'x-auth-token': token }
      });
      if (res.ok) {
        const data = await res.json();
        setAnalytics(data);
      }
    } catch (err) {
      console.error('Fetch nutrition analytics error:', err);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [selectedDate, mealFilter, search]);

  useEffect(() => {
    if (activeTab === 'analytics') {
      fetchAnalytics();
    }
  }, [activeTab]);

  // Today totals
  const todayCalories = logs.reduce((acc, l) => acc + (l.totalCalories || 0), 0);
  const todayProtein = logs.reduce((acc, l) => acc + (l.totalProtein || 0), 0);
  const todayCarbs = logs.reduce((acc, l) => acc + (l.totalCarbs || 0), 0);
  const todayFat = logs.reduce((acc, l) => acc + (l.totalFat || 0), 0);
  const todayWater = logs.reduce((acc, l) => acc + (l.waterIntake || 0), 0);

  const calorieTarget = user?.preferences?.dailyTargets?.calories || 2200;
  const proteinTarget = user?.preferences?.dailyTargets?.protein || 150;
  const carbsTarget = user?.preferences?.dailyTargets?.carbs || 220;
  const fatTarget = user?.preferences?.dailyTargets?.fat || 65;

  const handleOpenCreate = () => {
    setEditingLog(null);
    setFormData({
      ...initialForm,
      date: selectedDate || new Date().toISOString().split('T')[0]
    });
    setShowModal(true);
  };

  const handleOpenEdit = (log) => {
    setEditingLog(log);
    setFormData({
      date: new Date(log.date).toISOString().split('T')[0],
      mealType: log.mealType || 'breakfast',
      waterIntake: log.waterIntake || 0,
      notes: log.notes || '',
      foodItems: log.foodItems && log.foodItems.length > 0 
        ? log.foodItems 
        : [{ name: '', quantity: '1 serving', calories: 0, protein: 0, carbs: 0, fat: 0 }]
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this meal entry?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/nutrition/${id}`, {
        method: 'DELETE',
        headers: { 'x-auth-token': token }
      });
      if (res.ok) {
        setLogs(logs.filter(l => l._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddFoodItem = () => {
    setFormData({
      ...formData,
      foodItems: [
        ...formData.foodItems,
        { name: '', quantity: '1 serving', calories: 150, protein: 10, carbs: 15, fat: 5 }
      ]
    });
  };

  const handleRemoveFoodItem = (index) => {
    if (formData.foodItems.length === 1) return;
    const updated = formData.foodItems.filter((_, i) => i !== index);
    setFormData({ ...formData, foodItems: updated });
  };

  const handleFoodChange = (index, field, value) => {
    const updated = [...formData.foodItems];
    updated[index][field] = value;
    setFormData({ ...formData, foodItems: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingLog 
        ? `http://localhost:5000/api/nutrition/${editingLog._id}`
        : 'http://localhost:5000/api/nutrition';
      const method = editingLog ? 'PUT' : 'POST';

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
        if (editingLog) {
          setLogs(logs.map(l => l._id === saved._id ? saved : l));
        } else {
          setLogs([saved, ...logs]);
        }
        setShowModal(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddQuickWater = async (ml) => {
    try {
      const payload = {
        mealType: 'other',
        waterIntake: ml,
        foodItems: [{ name: `Hydration (${ml}ml Water)`, quantity: '1 glass', calories: 0, protein: 0, carbs: 0, fat: 0 }]
      };
      const res = await fetch('http://localhost:5000/api/nutrition', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const saved = await res.json();
        setLogs([saved, ...logs]);
      }
    } catch (err) {
      console.error(err);
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
            <Apple color="var(--primary)" size={36} /> NUTRITION & <span style={{ color: 'var(--primary)' }}>MACROS</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.35rem' }}>
            Log your daily meals, track macronutrient breakdown, and maintain optimal hydration.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={() => handleAddQuickWater(250)} className="btn-outline btn-sm" title="Quick log 250ml water">
            <Droplet size={16} color="var(--info)" /> +250ml Water
          </button>
          <button onClick={handleOpenCreate} className="btn-primary">
            <Plus size={20} /> Log Meal
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--surface-border)', paddingBottom: '1rem', marginBottom: '2rem' }}>
        <button 
          onClick={() => setActiveTab('logs')}
          style={{ 
            background: 'none', 
            border: 'none', 
            color: activeTab === 'logs' ? 'var(--primary)' : 'var(--text-muted)', 
            fontSize: '1.1rem', 
            fontWeight: 700, 
            cursor: 'pointer',
            fontFamily: "'Oswald', sans-serif",
            letterSpacing: '0.5px',
            position: 'relative',
            paddingBottom: '0.5rem'
          }}
        >
          Daily Meal Logs ({logs.length})
          {activeTab === 'logs' && (
            <motion.div layoutId="tabUnderlineNut" style={{ position: 'absolute', bottom: '-1rem', left: 0, right: 0, height: '3px', background: 'var(--primary)' }} />
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
          <PieIcon size={18} /> Macro & Consumption Analytics
          {activeTab === 'analytics' && (
            <motion.div layoutId="tabUnderlineNut" style={{ position: 'absolute', bottom: '-1rem', left: 0, right: 0, height: '3px', background: 'var(--primary)' }} />
          )}
        </button>
      </div>

      {activeTab === 'logs' ? (
        <>
          {/* Day Macro Dashboard */}
          <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--surface-border)', paddingBottom: '1rem' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Daily Consumption Summary</h3>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Selected Date: {new Date(selectedDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              </div>

              {/* Date Selector */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Calendar size={18} color="var(--primary)" />
                <input 
                  type="date" 
                  className="input-field" 
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  style={{ padding: '0.45rem 0.75rem', width: 'auto' }}
                />
              </div>
            </div>

            {/* Macro Stats Columns */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.5rem', textAlign: 'center' }}>
              
              <div style={{ background: 'var(--surface-light)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--surface-border)' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>CALORIES</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: "'Oswald', sans-serif", color: 'var(--warning)', marginTop: '0.2rem' }}>
                  {todayCalories} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 400 }}>/ {calorieTarget}</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'var(--surface-border)', borderRadius: '3px', marginTop: '0.5rem' }}>
                  <div style={{ width: `${Math.min((todayCalories / calorieTarget) * 100, 100)}%`, height: '100%', background: 'var(--warning)', borderRadius: '3px' }} />
                </div>
              </div>

              <div style={{ background: 'var(--surface-light)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--surface-border)' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>PROTEIN</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: "'Oswald', sans-serif", color: 'var(--info)', marginTop: '0.2rem' }}>
                  {todayProtein}g <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 400 }}>/ {proteinTarget}g</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'var(--surface-border)', borderRadius: '3px', marginTop: '0.5rem' }}>
                  <div style={{ width: `${Math.min((todayProtein / proteinTarget) * 100, 100)}%`, height: '100%', background: 'var(--info)', borderRadius: '3px' }} />
                </div>
              </div>

              <div style={{ background: 'var(--surface-light)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--surface-border)' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>CARBS</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: "'Oswald', sans-serif", color: 'var(--success)', marginTop: '0.2rem' }}>
                  {todayCarbs}g <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 400 }}>/ {carbsTarget}g</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'var(--surface-border)', borderRadius: '3px', marginTop: '0.5rem' }}>
                  <div style={{ width: `${Math.min((todayCarbs / carbsTarget) * 100, 100)}%`, height: '100%', background: 'var(--success)', borderRadius: '3px' }} />
                </div>
              </div>

              <div style={{ background: 'var(--surface-light)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--surface-border)' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>FATS</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: "'Oswald', sans-serif", color: '#ec4899', marginTop: '0.2rem' }}>
                  {todayFat}g <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 400 }}>/ {fatTarget}g</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'var(--surface-border)', borderRadius: '3px', marginTop: '0.5rem' }}>
                  <div style={{ width: `${Math.min((todayFat / fatTarget) * 100, 100)}%`, height: '100%', background: '#ec4899', borderRadius: '3px' }} />
                </div>
              </div>

              <div style={{ background: 'var(--surface-light)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--surface-border)' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>HYDRATION</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: "'Oswald', sans-serif", color: '#38bdf8', marginTop: '0.2rem' }}>
                  {todayWater} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 400 }}>ml</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'var(--surface-border)', borderRadius: '3px', marginTop: '0.5rem' }}>
                  <div style={{ width: `${Math.min((todayWater / 2500) * 100, 100)}%`, height: '100%', background: '#38bdf8', borderRadius: '3px' }} />
                </div>
              </div>

            </div>
          </div>

          {/* Search & Meal Type Filter */}
          <div className="glass-panel" style={{ padding: '1.25rem 1.5rem', marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ flex: 1, minWidth: '260px', position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                className="input-field" 
                placeholder="Search food item or meal..."
                style={{ paddingLeft: '2.75rem' }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {['all', 'breakfast', 'lunch', 'dinner', 'snack'].map(m => (
                <button 
                  key={m}
                  className={`filter-pill ${mealFilter === m ? 'active' : ''}`}
                  onClick={() => setMealFilter(m)}
                  style={{ textTransform: 'capitalize' }}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Meals List */}
          {loading ? (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '3rem' }}>Loading meals...</p>
          ) : logs.length === 0 ? (
            <div className="glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
              <Apple size={56} color="var(--warning)" style={{ opacity: 0.6, marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>No Meal Logs for This Date</h3>
              <p style={{ color: 'var(--text-muted)', maxWidth: '400px', margin: '0 auto 1.5rem auto' }}>
                Track your breakfast, lunch, dinner, or snacks to monitor your daily caloric and protein intake.
              </p>
              <button onClick={handleOpenCreate} className="btn-primary">
                <Plus size={18} /> Log First Meal
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {logs.map((log) => (
                <motion.div 
                  key={log._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-panel"
                  style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}
                >
                  <div style={{ flex: 1, minWidth: '280px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
                      <span className="badge" style={{ background: 'var(--warning-bg)', color: 'var(--warning)' }}>
                        {log.mealType}
                      </span>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        {new Date(log.date).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Food Items */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginTop: '0.5rem' }}>
                      {(log.foodItems || []).map((item, idx) => (
                        <div key={idx} style={{ fontSize: '0.9rem', color: 'var(--text)' }}>
                          • <strong>{item.name}</strong> <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>({item.quantity || '1 serving'})</span>
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginLeft: '0.5rem' }}>
                            {item.calories} kcal | P: {item.protein || 0}g | C: {item.carbs || 0}g | F: {item.fat || 0}g
                          </span>
                        </div>
                      ))}
                    </div>

                    {log.notes && (
                      <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                        Note: {log.notes}
                      </p>
                    )}
                  </div>

                  {/* Macro Totals & Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.6rem', fontWeight: 800, fontFamily: "'Oswald', sans-serif", color: 'var(--warning)' }}>
                        {log.totalCalories} kcal
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        P: <strong style={{ color: 'var(--info)' }}>{log.totalProtein || 0}g</strong> • 
                        C: <strong style={{ color: 'var(--success)' }}>{log.totalCarbs || 0}g</strong> • 
                        F: <strong style={{ color: '#ec4899' }}>{log.totalFat || 0}g</strong>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button 
                        onClick={() => handleOpenEdit(log)}
                        style={{ background: 'var(--surface-light)', border: '1px solid var(--surface-border)', color: 'var(--text)', padding: '0.5rem', borderRadius: '6px', cursor: 'pointer' }}
                        title="Edit Log"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(log._id)}
                        style={{ background: 'var(--danger-bg)', border: '1px solid var(--danger)', color: 'var(--danger)', padding: '0.5rem', borderRadius: '6px', cursor: 'pointer' }}
                        title="Delete Log"
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
        /* Nutrition Analytics Tab */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '1.5rem' }}>
            
            {/* 14-Day Calorie Trends */}
            <div className="glass-panel" style={{ padding: '2rem', height: '400px', display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', marginBottom: '0.5rem' }}>14-Day Caloric Intake Trend</h3>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Daily calories consumed over the last two weeks</p>
              
              <div style={{ flex: 1 }}>
                {(!analytics?.dailyTrends || analytics.dailyTrends.length === 0) ? (
                  <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '4rem' }}>No data to display</p>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={analytics.dailyTrends}>
                      <defs>
                        <linearGradient id="nutriGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--warning)" stopOpacity={0.6}/>
                          <stop offset="95%" stopColor="var(--warning)" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--surface-border)" vertical={false} />
                      <XAxis dataKey="displayDate" stroke="var(--text-muted)" axisLine={false} tickLine={false} />
                      <YAxis stroke="var(--text-muted)" axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: 'var(--surface)', border: '1px solid var(--surface-border-light)', borderRadius: '8px' }} />
                      <Area type="monotone" dataKey="calories" stroke="var(--warning)" strokeWidth={3} fill="url(#nutriGrad)" />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Macronutrient Distribution Donut */}
            <div className="glass-panel" style={{ padding: '2rem', height: '400px', display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', marginBottom: '0.5rem' }}>Macronutrient Distribution</h3>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Protein vs Carbs vs Healthy Fats breakdown</p>

              <div style={{ flex: 1 }}>
                {(!analytics?.macroDistribution || analytics.macroDistribution.length === 0) ? (
                  <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '4rem' }}>No macro data logged yet</p>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analytics.macroDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={65}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="grams"
                        nameKey="name"
                        label={({ name, percent }) => `${name} (${percent}%)`}
                      >
                        {analytics.macroDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: 'var(--surface)', border: '1px solid var(--surface-border-light)', borderRadius: '8px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* Log / Edit Meal Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '750px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--surface-border)', paddingBottom: '1rem' }}>
              <h2 style={{ margin: 0, fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Apple color="var(--warning)" /> {editingLog ? 'Edit Meal Log' : 'Log Daily Food Intake'}
              </h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Meal Type *</label>
                  <select 
                    className="input-field"
                    value={formData.mealType}
                    onChange={(e) => setFormData({ ...formData, mealType: e.target.value })}
                  >
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                    <option value="snack">Snack</option>
                    <option value="other">Pre/Post Workout Shake</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Date</label>
                  <input 
                    type="date" 
                    className="input-field" 
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>
              </div>

              {/* Dynamic Food Items Table */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <h4 style={{ margin: 0, fontSize: '1rem', textTransform: 'uppercase' }}>Food Items & Macros ({formData.foodItems.length})</h4>
                  <button type="button" onClick={handleAddFoodItem} className="btn-outline btn-sm" style={{ padding: '0.3rem 0.75rem' }}>
                    <Plus size={14} /> Add Food Item
                  </button>
                </div>

                {/* Column Headers Bar */}
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 1fr 1fr 1fr 1fr 36px', gap: '0.5rem', padding: '0.45rem 0.75rem', background: 'rgba(255, 184, 0, 0.08)', borderRadius: '6px', border: '1px solid rgba(255, 184, 0, 0.25)', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--warning)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Food Item Name *</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--warning)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Portion / Qty</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--warning)', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>Cals (kcal)</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--warning)', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>Protein (g)</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--warning)', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>Carbs (g)</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--warning)', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>Fat (g)</span>
                  <span></span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '250px', overflowY: 'auto' }}>
                  {formData.foodItems.map((item, idx) => (
                    <div key={idx} style={{ background: 'var(--surface-light)', border: '1px solid var(--surface-border)', borderRadius: '8px', padding: '0.75rem', display: 'grid', gridTemplateColumns: '2fr 1.2fr 1fr 1fr 1fr 1fr 36px', gap: '0.5rem', alignItems: 'flex-start' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.25rem', fontWeight: 600 }}>Food Item *</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Grilled Chicken"
                          className="input-field" 
                          value={item.name}
                          onChange={(e) => handleFoodChange(idx, 'name', e.target.value)}
                          required
                          style={{ padding: '0.5rem', fontSize: '0.85rem' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.25rem', fontWeight: 600 }}>Quantity</label>
                        <input 
                          type="text" 
                          placeholder="e.g. 200g"
                          className="input-field" 
                          value={item.quantity}
                          onChange={(e) => handleFoodChange(idx, 'quantity', e.target.value)}
                          style={{ padding: '0.5rem', fontSize: '0.85rem' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.25rem', fontWeight: 600, textAlign: 'center' }}>Calories</label>
                        <input 
                          type="number" 
                          placeholder="kcal"
                          title="Calories (kcal)"
                          className="input-field" 
                          value={item.calories}
                          onChange={(e) => handleFoodChange(idx, 'calories', e.target.value)}
                          style={{ padding: '0.5rem', fontSize: '0.85rem', textAlign: 'center' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.25rem', fontWeight: 600, textAlign: 'center' }}>Protein</label>
                        <input 
                          type="number" 
                          placeholder="g"
                          title="Protein (g)"
                          className="input-field" 
                          value={item.protein}
                          onChange={(e) => handleFoodChange(idx, 'protein', e.target.value)}
                          style={{ padding: '0.5rem', fontSize: '0.85rem', textAlign: 'center' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.25rem', fontWeight: 600, textAlign: 'center' }}>Carbs</label>
                        <input 
                          type="number" 
                          placeholder="g"
                          title="Carbs (g)"
                          className="input-field" 
                          value={item.carbs}
                          onChange={(e) => handleFoodChange(idx, 'carbs', e.target.value)}
                          style={{ padding: '0.5rem', fontSize: '0.85rem', textAlign: 'center' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.25rem', fontWeight: 600, textAlign: 'center' }}>Fat</label>
                        <input 
                          type="number" 
                          placeholder="g"
                          title="Fat (g)"
                          className="input-field" 
                          value={item.fat}
                          onChange={(e) => handleFoodChange(idx, 'fat', e.target.value)}
                          style={{ padding: '0.5rem', fontSize: '0.85rem', textAlign: 'center' }}
                        />
                      </div>
                      <div style={{ paddingTop: '1.45rem', textAlign: 'center' }}>
                        <button 
                          type="button" 
                          onClick={() => handleRemoveFoodItem(idx)} 
                          style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '0.25rem' }}
                          disabled={formData.foodItems.length === 1}
                          title="Remove Food Item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Water intake & notes */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Water Intake (ml)</label>
                  <input 
                    type="number" 
                    className="input-field" 
                    placeholder="e.g. 500"
                    value={formData.waterIntake}
                    onChange={(e) => setFormData({ ...formData, waterIntake: e.target.value })}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Notes</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="e.g. Post workout meal, high protein..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
                </div>
              </div>

              <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem' }}>
                {editingLog ? 'Update Meal Log' : 'Save Meal Entry'}
              </button>

            </form>
          </div>
        </div>
      )}

    </motion.div>
  );
};

export default Nutrition;
