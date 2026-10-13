import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings as SettingsIcon, 
  User, 
  Sliders, 
  Target, 
  Palette, 
  Bell, 
  Save, 
  CheckCircle, 
  LogOut,
  Camera,
  Moon,
  Sun
} from 'lucide-react';
import { useAuth } from './context/AuthContext';

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
];

const ACCENT_COLORS = [
  { name: 'Dark Yellow / Gold', hex: '#f59e0b' },
  { name: 'Electric Cyan', hex: '#06b6d4' },
  { name: 'Emerald Green', hex: '#10b981' },
  { name: 'Neon Purple', hex: '#a855f7' },
  { name: 'Crimson Red', hex: '#f83a26' }
];

const Settings = () => {
  const { user, logout, updateUser } = useAuth();
  const token = localStorage.getItem('fitTrackToken');

  const [activeTab, setActiveTab] = useState('profile');
  const [saveMsg, setSaveMsg] = useState('');

  // Profile Form
  const [profileData, setProfileData] = useState({
    name: '',
    username: '',
    email: '',
    avatar: '',
    bio: '',
    gender: 'prefer_not_to_say',
    age: 25,
    height: 175,
    currentWeight: 70,
    targetWeight: 68,
    fitnessGoal: 'muscle_gain',
    activityLevel: 'moderately_active'
  });

  // Preferences Form
  const [prefData, setPrefData] = useState({
    units: {
      weight: 'kg',
      measurements: 'cm',
      distance: 'km'
    },
    theme: {
      mode: 'dark',
      accent: '#f59e0b'
    },
    dailyTargets: {
      calories: 2200,
      protein: 150,
      carbs: 220,
      fat: 65,
      water: 2500,
      workoutsPerWeek: 5
    },
    notifications: {
      workoutReminders: true,
      mealReminders: true,
      goalAchievements: true,
      communityUpdates: true
    }
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        username: user.username || '',
        email: user.email || '',
        avatar: user.avatar || AVATAR_PRESETS[0],
        bio: user.bio || '',
        gender: user.gender || 'prefer_not_to_say',
        age: user.age || 25,
        height: user.height || 175,
        currentWeight: user.currentWeight || 70,
        targetWeight: user.targetWeight || 68,
        fitnessGoal: user.fitnessGoal || 'muscle_gain',
        activityLevel: user.activityLevel || 'moderately_active'
      });

      if (user.preferences) {
        setPrefData({
          units: { ...prefData.units, ...(user.preferences.units || {}) },
          theme: { ...prefData.theme, ...(user.preferences.theme || {}) },
          dailyTargets: { ...prefData.dailyTargets, ...(user.preferences.dailyTargets || {}) },
          notifications: { ...prefData.notifications, ...(user.preferences.notifications || {}) }
        });
      }
    }
  }, [user]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/users/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify(profileData)
      });
      if (res.ok) {
        const updated = await res.json();
        updateUser(updated);
        setSaveMsg('Profile updated successfully!');
        setTimeout(() => setSaveMsg(''), 4000);
      }
    } catch (err) {
      console.error(err);
      setSaveMsg('Failed to update profile.');
    }
  };

  const handleSavePreferences = async (newPref) => {
    const toSave = newPref || prefData;
    try {
      const res = await fetch('http://localhost:5000/api/users/preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify(toSave)
      });
      if (res.ok) {
        const updated = await res.json();
        updateUser(updated);
        setSaveMsg('Preferences saved!');
        setTimeout(() => setSaveMsg(''), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAccentChange = (hex) => {
    const updated = {
      ...prefData,
      theme: { ...prefData.theme, accent: hex }
    };
    setPrefData(updated);
    document.documentElement.style.setProperty('--primary', hex);
    document.documentElement.style.setProperty('--primary-glow', `${hex}66`);
    handleSavePreferences(updated);
  };

  const handleModeToggle = () => {
    const newMode = prefData.theme.mode === 'dark' ? 'light' : 'dark';
    const updated = {
      ...prefData,
      theme: { ...prefData.theme, mode: newMode }
    };
    setPrefData(updated);
    if (newMode === 'light') {
      document.body.classList.add('theme-light');
    } else {
      document.body.classList.remove('theme-light');
    }
    handleSavePreferences(updated);
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
            <SettingsIcon color="var(--primary)" size={36} /> SETTINGS & <span style={{ color: 'var(--primary)' }}>PREFERENCES</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.35rem' }}>
            Manage your personal profile, units of measurement, daily nutrition targets, and app theme.
          </p>
        </div>

        <button onClick={logout} className="btn-outline" style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }}>
          <LogOut size={18} /> Logout
        </button>
      </div>

      {saveMsg && (
        <div style={{ background: 'var(--success-bg)', border: '1px solid var(--success)', color: 'var(--success)', padding: '0.85rem 1.25rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle size={18} /> {saveMsg}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', borderBottom: '1px solid var(--surface-border)', paddingBottom: '1rem', marginBottom: '2rem' }}>
        {[
          { id: 'profile', label: 'Athlete Profile', icon: User },
          { id: 'units', label: 'Units of Measurement', icon: Sliders },
          { id: 'targets', label: 'Daily Targets', icon: Target },
          { id: 'theme', label: 'Theme & Appearance', icon: Palette },
          { id: 'notifications', label: 'Notification Alerts', icon: Bell },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`filter-pill ${isActive ? 'active' : ''}`}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem' }}
            >
              <Icon size={16} /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab 1: Profile */}
      {activeTab === 'profile' && (
        <div className="glass-panel" style={{ padding: '2.5rem', maxWidth: '850px' }}>
          <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Avatar Section */}
            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>Profile Picture / Avatar</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                <img 
                  src={profileData.avatar || AVATAR_PRESETS[0]} 
                  alt="Profile Avatar"
                  style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary)', boxShadow: '0 0 15px var(--primary-glow)' }}
                />

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Choose an avatar preset:</div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {AVATAR_PRESETS.map((url, i) => (
                      <img 
                        key={i} 
                        src={url} 
                        alt={`Preset ${i}`}
                        onClick={() => setProfileData({ ...profileData, avatar: url })}
                        style={{ 
                          width: '40px', 
                          height: '40px', 
                          borderRadius: '50%', 
                          objectFit: 'cover', 
                          cursor: 'pointer',
                          border: profileData.avatar === url ? '2px solid var(--primary)' : '2px solid transparent',
                          opacity: profileData.avatar === url ? 1 : 0.6
                        }}
                      />
                    ))}
                  </div>
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="Or enter custom image URL..." 
                    value={profileData.avatar}
                    onChange={(e) => setProfileData({ ...profileData, avatar: e.target.value })}
                    style={{ fontSize: '0.85rem', padding: '0.4rem 0.75rem', marginTop: '0.25rem' }}
                  />
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Full Name *</label>
                <input 
                  type="text" 
                  className="input-field" 
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Username</label>
                <input 
                  type="text" 
                  className="input-field" 
                  value={profileData.username}
                  disabled
                  style={{ opacity: 0.6 }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Email Address</label>
              <input 
                type="email" 
                className="input-field" 
                value={profileData.email}
                disabled
                style={{ opacity: 0.6 }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Bio</label>
              <textarea 
                className="input-field" 
                rows="3"
                value={profileData.bio}
                onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                placeholder="Tell other athletes about your journey and targets..."
              ></textarea>
            </div>

            {/* Physical Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Age</label>
                <input 
                  type="number" 
                  className="input-field" 
                  value={profileData.age}
                  onChange={(e) => setProfileData({ ...profileData, age: e.target.value })}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Height (cm)</label>
                <input 
                  type="number" 
                  className="input-field" 
                  value={profileData.height}
                  onChange={(e) => setProfileData({ ...profileData, height: e.target.value })}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Current Weight (kg)</label>
                <input 
                  type="number" 
                  step="0.1"
                  className="input-field" 
                  value={profileData.currentWeight}
                  onChange={(e) => setProfileData({ ...profileData, currentWeight: e.target.value })}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Target Weight (kg)</label>
                <input 
                  type="number" 
                  step="0.1"
                  className="input-field" 
                  value={profileData.targetWeight}
                  onChange={(e) => setProfileData({ ...profileData, targetWeight: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Primary Fitness Goal</label>
                <select 
                  className="input-field"
                  value={profileData.fitnessGoal}
                  onChange={(e) => setProfileData({ ...profileData, fitnessGoal: e.target.value })}
                >
                  <option value="muscle_gain">Muscle Gain / Hypertrophy</option>
                  <option value="fat_loss">Fat Loss / Shred</option>
                  <option value="endurance">Endurance & Stamina</option>
                  <option value="maintenance">Maintenance & Health</option>
                  <option value="athletic_performance">Athletic Performance</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Activity Level</label>
                <select 
                  className="input-field"
                  value={profileData.activityLevel}
                  onChange={(e) => setProfileData({ ...profileData, activityLevel: e.target.value })}
                >
                  <option value="sedentary">Sedentary (Office job)</option>
                  <option value="lightly_active">Lightly Active (1-3 days/week)</option>
                  <option value="moderately_active">Moderately Active (3-5 days/week)</option>
                  <option value="very_active">Very Active (6-7 days/week)</option>
                  <option value="extra_active">Extra Active (Hard physical training)</option>
                </select>
              </div>
            </div>

            <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem', alignSelf: 'flex-start' }}>
              <Save size={18} /> Save Profile Changes
            </button>
          </form>
        </div>
      )}

      {/* Tab 2: Units of Measurement */}
      {activeTab === 'units' && (
        <div className="glass-panel" style={{ padding: '2.5rem', maxWidth: '700px' }}>
          <h2 style={{ fontSize: '1.4rem', marginBottom: '1.5rem' }}>Units of Measurement</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Weight Unit */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--surface-border)', paddingBottom: '1.25rem' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Weight Unit</h3>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Used for body weight and workout lifting weights</p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {['kg', 'lbs'].map(u => (
                  <button
                    key={u}
                    type="button"
                    onClick={() => {
                      const updated = { ...prefData, units: { ...prefData.units, weight: u } };
                      setPrefData(updated);
                      handleSavePreferences(updated);
                    }}
                    className={`filter-pill ${prefData.units.weight === u ? 'active' : ''}`}
                    style={{ textTransform: 'uppercase' }}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>

            {/* Measurements Unit */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--surface-border)', paddingBottom: '1.25rem' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Body Measurements</h3>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Used for chest, waist, hips, and arms</p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {['cm', 'in'].map(u => (
                  <button
                    key={u}
                    type="button"
                    onClick={() => {
                      const updated = { ...prefData, units: { ...prefData.units, measurements: u } };
                      setPrefData(updated);
                      handleSavePreferences(updated);
                    }}
                    className={`filter-pill ${prefData.units.measurements === u ? 'active' : ''}`}
                    style={{ textTransform: 'uppercase' }}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>

            {/* Distance Unit */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Distance Unit</h3>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Used for running and cardio sessions</p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {['km', 'mi'].map(u => (
                  <button
                    key={u}
                    type="button"
                    onClick={() => {
                      const updated = { ...prefData, units: { ...prefData.units, distance: u } };
                      setPrefData(updated);
                      handleSavePreferences(updated);
                    }}
                    className={`filter-pill ${prefData.units.distance === u ? 'active' : ''}`}
                    style={{ textTransform: 'uppercase' }}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Tab 3: Daily Targets */}
      {activeTab === 'targets' && (
        <div className="glass-panel" style={{ padding: '2.5rem', maxWidth: '750px' }}>
          <h2 style={{ fontSize: '1.4rem', marginBottom: '1.5rem' }}>Daily Nutrition & Fitness Goals</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Daily Calorie Target (kcal)</label>
              <input 
                type="number" 
                className="input-field" 
                value={prefData.dailyTargets.calories}
                onChange={(e) => setPrefData({
                  ...prefData,
                  dailyTargets: { ...prefData.dailyTargets, calories: Number(e.target.value) }
                })}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Daily Protein Target (grams)</label>
              <input 
                type="number" 
                className="input-field" 
                value={prefData.dailyTargets.protein}
                onChange={(e) => setPrefData({
                  ...prefData,
                  dailyTargets: { ...prefData.dailyTargets, protein: Number(e.target.value) }
                })}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Daily Carbs Target (grams)</label>
              <input 
                type="number" 
                className="input-field" 
                value={prefData.dailyTargets.carbs}
                onChange={(e) => setPrefData({
                  ...prefData,
                  dailyTargets: { ...prefData.dailyTargets, carbs: Number(e.target.value) }
                })}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Daily Fat Target (grams)</label>
              <input 
                type="number" 
                className="input-field" 
                value={prefData.dailyTargets.fat}
                onChange={(e) => setPrefData({
                  ...prefData,
                  dailyTargets: { ...prefData.dailyTargets, fat: Number(e.target.value) }
                })}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Daily Water Goal (ml)</label>
              <input 
                type="number" 
                className="input-field" 
                value={prefData.dailyTargets.water}
                onChange={(e) => setPrefData({
                  ...prefData,
                  dailyTargets: { ...prefData.dailyTargets, water: Number(e.target.value) }
                })}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Target Workouts / Week</label>
              <input 
                type="number" 
                className="input-field" 
                value={prefData.dailyTargets.workoutsPerWeek}
                onChange={(e) => setPrefData({
                  ...prefData,
                  dailyTargets: { ...prefData.dailyTargets, workoutsPerWeek: Number(e.target.value) }
                })}
              />
            </div>
          </div>

          <button onClick={() => handleSavePreferences()} className="btn-primary">
            <Save size={18} /> Save Daily Targets
          </button>
        </div>
      )}

      {/* Tab 4: Theme & Appearance */}
      {activeTab === 'theme' && (
        <div className="glass-panel" style={{ padding: '2.5rem', maxWidth: '700px' }}>
          <h2 style={{ fontSize: '1.4rem', marginBottom: '1.5rem' }}>Theme & Appearance</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Dark / Light Mode */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--surface-border)', paddingBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {prefData.theme.mode === 'dark' ? <Moon size={28} color="var(--primary)" /> : <Sun size={28} color="var(--warning)" />}
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.1rem' }}>
                    {prefData.theme.mode === 'dark' ? 'Dark Mode' : 'Light Mode'}
                  </h3>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {prefData.theme.mode === 'dark' ? 'Ultra-sleek obsidian glass interface' : 'Clean high-contrast daytime interface'}
                  </p>
                </div>
              </div>

              <button onClick={handleModeToggle} className="btn-outline btn-sm">
                Switch to {prefData.theme.mode === 'dark' ? 'Light' : 'Dark'}
              </button>
            </div>

            {/* Primary Accent Color Selection */}
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', marginBottom: '0.35rem' }}>Vibrant Accent Color</h3>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                Personalize your buttons, charts, and highlights across the entire app
              </p>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                {ACCENT_COLORS.map(color => {
                  const isSelected = prefData.theme.accent === color.hex;
                  return (
                    <div 
                      key={color.hex}
                      onClick={() => handleAccentChange(color.hex)}
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.6rem', 
                        padding: '0.6rem 1rem', 
                        borderRadius: '8px', 
                        background: 'var(--surface-light)', 
                        border: isSelected ? `2px solid ${color.hex}` : '1px solid var(--surface-border)',
                        cursor: 'pointer',
                        transition: 'transform 0.2s'
                      }}
                    >
                      <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: color.hex, boxShadow: `0 0 10px ${color.hex}66` }}></div>
                      <span style={{ fontSize: '0.9rem', fontWeight: isSelected ? 700 : 500 }}>{color.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Tab 5: Notification Preferences */}
      {activeTab === 'notifications' && (
        <div className="glass-panel" style={{ padding: '2.5rem', maxWidth: '700px' }}>
          <h2 style={{ fontSize: '1.4rem', marginBottom: '1.5rem' }}>Alert & Notification Preferences</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {[
              { key: 'workoutReminders', title: 'Workout Session Alerts', desc: 'Receive reminders for scheduled training sessions' },
              { key: 'mealReminders', title: 'Meal & Nutrition Reminders', desc: 'Alerts to log breakfast, lunch, dinner, and hydration' },
              { key: 'goalAchievements', title: 'Milestone & PR Achievements', desc: 'Celebrations when reaching target weight or hitting personal records' },
              { key: 'communityUpdates', title: 'Community & Social Updates', desc: 'Notifications for new followers and forum comment responses' },
            ].map(item => {
              const isEnabled = prefData.notifications[item.key];
              return (
                <div key={item.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--surface-border)', paddingBottom: '1.25rem' }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.05rem' }}>{item.title}</h3>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>{item.desc}</p>
                  </div>

                  <div 
                    onClick={() => {
                      const updated = {
                        ...prefData,
                        notifications: { ...prefData.notifications, [item.key]: !isEnabled }
                      };
                      setPrefData(updated);
                      handleSavePreferences(updated);
                    }}
                    style={{ 
                      width: '44px', 
                      height: '24px', 
                      background: isEnabled ? 'var(--primary)' : 'var(--surface-border)', 
                      borderRadius: '12px', 
                      position: 'relative', 
                      cursor: 'pointer',
                      transition: 'background 0.2s'
                    }}
                  >
                    <div style={{ 
                      width: '18px', 
                      height: '18px', 
                      background: '#fff', 
                      borderRadius: '50%', 
                      position: 'absolute', 
                      top: '3px', 
                      left: isEnabled ? '22px' : '3px',
                      transition: 'left 0.2s'
                    }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </motion.div>
  );
};

export default Settings;
