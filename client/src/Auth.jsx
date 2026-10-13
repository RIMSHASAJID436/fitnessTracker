import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  AlertCircle, 
  AtSign, 
  Target, 
  Check 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
];

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    identifier: '',
    avatar: AVATAR_PRESETS[0],
    fitnessGoal: 'muscle_gain'
  });

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const payload = isLogin 
        ? { identifier: formData.identifier || formData.email, password: formData.password }
        : { 
            name: formData.name, 
            username: formData.username || formData.email.split('@')[0], 
            email: formData.email, 
            password: formData.password,
            avatar: formData.avatar,
            fitnessGoal: formData.fitnessGoal
          };

      const res = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Authentication failed');
      }

      localStorage.setItem('fitTrackToken', data.token);
      login(data.user);
      
      if (data.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', width: '100vw', background: 'var(--background)', padding: '2rem 1rem' }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="glass-panel"
        style={{ width: '100%', maxWidth: isLogin ? '440px' : '520px', padding: '2.5rem 2rem', textAlign: 'center' }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--primary-glow)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Activity size={36} />
          </div>
        </div>

        <h2 style={{ fontSize: '2.2rem', marginBottom: '0.4rem', fontWeight: 800 }}>
          {isLogin ? 'WELCOME BACK' : 'JOIN THE PLATFORM'}
        </h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.75rem', fontSize: '0.9rem' }}>
          {isLogin ? 'Enter your credentials to access your fitness dashboard' : 'Create your athlete account to begin tracking workouts and nutrition'}
        </p>

        {error && (
          <div style={{ background: 'var(--danger-bg)', border: '1px solid var(--danger)', color: 'var(--danger)', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', textAlign: 'left' }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left' }}>
          
          {!isLogin && (
            <>
              {/* Avatar Preset Selector */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>Select Profile Picture / Avatar</label>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  {AVATAR_PRESETS.map((url, i) => (
                    <img 
                      key={i} 
                      src={url} 
                      alt={`Avatar ${i}`}
                      onClick={() => setFormData({ ...formData, avatar: url })}
                      style={{ 
                        width: '45px', 
                        height: '45px', 
                        borderRadius: '50%', 
                        objectFit: 'cover', 
                        cursor: 'pointer',
                        border: formData.avatar === url ? '3px solid var(--primary)' : '2px solid transparent',
                        opacity: formData.avatar === url ? 1 : 0.6,
                        boxShadow: formData.avatar === url ? '0 0 10px var(--primary-glow)' : 'none'
                      }}
                    />
                  ))}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div style={{ position: 'relative' }}>
                  <User style={{ position: 'absolute', top: '50%', left: '0.85rem', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
                  <input 
                    type="text" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    placeholder="Full Name" 
                    className="input-field" 
                    style={{ paddingLeft: '2.5rem', fontSize: '0.9rem' }} 
                    required 
                  />
                </div>

                <div style={{ position: 'relative' }}>
                  <AtSign style={{ position: 'absolute', top: '50%', left: '0.85rem', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
                  <input 
                    type="text" 
                    name="username" 
                    value={formData.username} 
                    onChange={handleChange} 
                    placeholder="Username" 
                    className="input-field" 
                    style={{ paddingLeft: '2.5rem', fontSize: '0.9rem' }} 
                    required 
                  />
                </div>
              </div>
            </>
          )}

          {isLogin ? (
            <div style={{ position: 'relative' }}>
              <Mail style={{ position: 'absolute', top: '50%', left: '0.85rem', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
              <input 
                type="text" 
                name="identifier" 
                value={formData.identifier} 
                onChange={handleChange} 
                placeholder="Email Address or Username" 
                className="input-field" 
                style={{ paddingLeft: '2.5rem' }} 
                required 
              />
            </div>
          ) : (
            <div style={{ position: 'relative' }}>
              <Mail style={{ position: 'absolute', top: '50%', left: '0.85rem', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
              <input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                placeholder="Email Address" 
                className="input-field" 
                style={{ paddingLeft: '2.5rem' }} 
                required 
              />
            </div>
          )}

          <div style={{ position: 'relative' }}>
            <Lock style={{ position: 'absolute', top: '50%', left: '0.85rem', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
            <input 
              type="password" 
              name="password" 
              value={formData.password} 
              onChange={handleChange} 
              placeholder="Password (min 6 chars)" 
              className="input-field" 
              style={{ paddingLeft: '2.5rem' }} 
              required 
            />
          </div>

          {!isLogin && (
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Primary Fitness Goal</label>
              <select 
                name="fitnessGoal" 
                value={formData.fitnessGoal} 
                onChange={handleChange} 
                className="input-field"
                style={{ fontSize: '0.9rem' }}
              >
                <option value="muscle_gain">Muscle Gain / Hypertrophy</option>
                <option value="fat_loss">Fat Loss / Shred</option>
                <option value="endurance">Endurance & Conditioning</option>
                <option value="maintenance">General Health & Fitness</option>
                <option value="athletic_performance">Athletic Performance</option>
              </select>
            </div>
          )}
          
          <button 
            type="submit" 
            className="btn-primary" 
            disabled={isLoading} 
            style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', opacity: isLoading ? 0.7 : 1 }}
          >
            {isLoading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Athlete Account')} <ArrowRight size={18} />
          </button>
        </form>

        <p style={{ marginTop: '1.75rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span 
            onClick={() => { setIsLogin(!isLogin); setError(''); }}
            style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: 600 }}
          >
            {isLogin ? 'Sign up here' : 'Log in here'}
          </span>
        </p>

        {isLogin && (
          <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'var(--surface-light)', borderRadius: '8px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Admin Demo: <strong>admin@fitness.com</strong> / <strong>admin123</strong>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Auth;
