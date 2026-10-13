import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Activity, 
  Apple, 
  Flame, 
  TrendingUp, 
  Plus, 
  Calendar, 
  Clock, 
  Award, 
  Dumbbell, 
  Droplet,
  ChevronRight,
  ArrowUpRight,
  Zap,
  Target,
  Sparkles
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useAuth } from './context/AuthContext';

const Dashboard = () => {
  const { user, formatWeight } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('fitTrackToken');

  const fetchDashboard = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/users/dashboard', {
        headers: { 'x-auth-token': token }
      });
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error('Error fetching dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [token]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', color: 'var(--text-muted)' }}>
        <p style={{ fontSize: '1.2rem' }}>Loading athlete dashboard...</p>
      </div>
    );
  }

  const calorieTarget = data?.calorieTarget || user?.preferences?.dailyTargets?.calories || 2200;
  const caloriePercent = Math.min(Math.round(((data?.todayCalories || 0) / calorieTarget) * 100), 100);
  
  const proteinTarget = user?.preferences?.dailyTargets?.protein || 150;
  const carbsTarget = user?.preferences?.dailyTargets?.carbs || 220;
  const fatTarget = user?.preferences?.dailyTargets?.fat || 65;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4 }}
    >
      {/* Top Banner / Athlete Greeting */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '2rem', position: 'relative' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(245, 158, 11, 0.12)', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '0.35rem 1rem', borderRadius: '50px', marginBottom: '0.75rem' }}>
            <Sparkles size={14} color="var(--primary)" />
            <span style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.8rem', letterSpacing: '1.5px', textTransform: 'uppercase', fontFamily: "'Oswald', sans-serif" }}>
              YogaLife &amp; FitTrack Performance Sanctuary
            </span>
          </div>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem', fontFamily: "'Oswald', sans-serif" }}>
            FITNESS <span style={{ color: 'var(--primary)', textShadow: '0 0 25px var(--primary-glow)' }}>OVERVIEW</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.35rem', fontFamily: "'Poppins', sans-serif" }}>
            Track your performance, hit your macro goals, and maintain your momentum.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link to="/workouts" style={{ textDecoration: 'none' }}>
            <button className="btn-primary" style={{ padding: '0.65rem 1.25rem', fontSize: '0.95rem' }}>
              <Plus size={18} /> Log Workout
            </button>
          </Link>
          <Link to="/nutrition" style={{ textDecoration: 'none' }}>
            <button className="btn-outline" style={{ padding: '0.65rem 1.25rem', fontSize: '0.95rem' }}>
              <Apple size={18} /> Log Meal
            </button>
          </Link>
          <Link to="/progress" style={{ textDecoration: 'none' }}>
            <button className="btn-outline" style={{ padding: '0.65rem 1.25rem', fontSize: '0.95rem' }}>
              <TrendingUp size={18} /> Record Weight
            </button>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        
        {/* Workouts Card */}
        <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid var(--primary)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500 }}>Total Workouts</span>
            <div style={{ background: 'rgba(245, 158, 11, 0.15)', padding: '0.4rem', borderRadius: '8px', color: 'var(--primary)' }}>
              <Dumbbell size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: "'Oswald', sans-serif", color: '#ffffff' }}>
            {data?.totalWorkouts || 0}
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Award size={14} color="var(--primary)" /> 
            <span>Latest: {data?.latestWorkout?.name || 'No routines logged'}</span>
          </div>
        </div>

        {/* Calories Card */}
        <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid var(--primary-light)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500 }}>Calories Today</span>
            <div style={{ background: 'rgba(251, 191, 36, 0.15)', padding: '0.4rem', borderRadius: '8px', color: 'var(--primary-light)' }}>
              <Flame size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: "'Oswald', sans-serif", color: 'var(--primary-light)' }}>
            {data?.todayCalories || 0} <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 400 }}>/ {calorieTarget} kcal</span>
          </div>
          <div style={{ width: '100%', height: '8px', background: 'var(--surface-border)', borderRadius: '4px', marginTop: '0.75rem', overflow: 'hidden' }}>
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${caloriePercent}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              style={{ height: '100%', background: 'linear-gradient(90deg, var(--primary) 0%, var(--primary-light) 100%)', borderRadius: '4px' }}
            />
          </div>
        </div>

        {/* Current Weight Card */}
        <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid var(--primary)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500 }}>Current Weight</span>
            <div style={{ background: 'rgba(245, 158, 11, 0.15)', padding: '0.4rem', borderRadius: '8px', color: 'var(--primary)' }}>
              <TrendingUp size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: "'Oswald', sans-serif", color: '#ffffff' }}>
            {formatWeight(data?.latestProgress?.weight || user?.currentWeight || 70)}
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            Target: <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{formatWeight(user?.targetWeight || 68)}</span> 
            {data?.weightDelta !== 0 && (
              <span style={{ marginLeft: '0.5rem', color: Number(data?.weightDelta) < 0 ? 'var(--success)' : 'var(--primary)' }}>
                ({data?.weightDelta > 0 ? `+${data?.weightDelta}` : data?.weightDelta} kg)
              </span>
            )}
          </div>
        </div>

        {/* Water & Consistency Streak */}
        <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid var(--primary-dark)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500 }}>Hydration &amp; Streak</span>
            <div style={{ background: 'rgba(245, 158, 11, 0.15)', padding: '0.4rem', borderRadius: '8px', color: 'var(--primary)' }}>
              <Droplet size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: "'Oswald', sans-serif", color: '#ffffff' }}>
            {data?.todayWater || 0} <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 400 }}>/ 2500 ml</span>
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Zap size={14} color="var(--primary)" /> Active Weekly Consistency: Good
          </div>
        </div>

      </div>

      {/* Main Charts & Analytics Split */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        
        {/* Weekly Calorie Trends */}
        <div className="glass-panel" style={{ padding: '2rem', minHeight: '380px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontFamily: "'Oswald', sans-serif" }}>7-Day Calorie Intake</h3>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Daily consumption vs target</p>
            </div>
            <Link to="/nutrition" style={{ color: 'var(--primary)', textDecoration: 'none', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600 }}>
              Full Nutrition <ChevronRight size={16} />
            </Link>
          </div>

          <div style={{ flex: 1, minHeight: '260px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.chartData || []}>
                <defs>
                  <linearGradient id="calGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.55}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.02}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--surface-border)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-muted)" axisLine={false} tickLine={false} dy={8} />
                <YAxis stroke="var(--text-muted)" axisLine={false} tickLine={false} dx={-8} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--surface)', border: '1px solid var(--surface-border-light)', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: 'var(--primary)' }}
                />
                <Area type="monotone" dataKey="calories" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#calGradient)" />
                <Line type="monotone" dataKey="goal" stroke="rgba(245, 158, 11, 0.35)" strokeDasharray="4 4" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Today's Macronutrient Progress */}
        <div className="glass-panel" style={{ padding: '2rem', minHeight: '380px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontFamily: "'Oswald', sans-serif" }}>Today's Macronutrients</h3>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Daily fuel distribution</p>
            </div>
            <span className="badge" style={{ background: 'rgba(245, 158, 11, 0.12)', color: 'var(--primary)', border: '1px solid rgba(245, 158, 11, 0.25)' }}>
              Targets
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', flex: 1, justifyContent: 'center' }}>
            
            {/* Protein */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.9rem' }}>
                <span style={{ fontWeight: 600, color: 'var(--primary)' }}>Protein</span>
                <span>{data?.todayProtein || 0}g / {proteinTarget}g</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: 'var(--surface-border)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${Math.min(((data?.todayProtein || 0) / proteinTarget) * 100, 100)}%`, height: '100%', background: 'var(--primary)', borderRadius: '4px' }} />
              </div>
            </div>

            {/* Carbs */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.9rem' }}>
                <span style={{ fontWeight: 600, color: 'var(--primary-light)' }}>Carbohydrates</span>
                <span>{data?.todayCarbs || 0}g / {carbsTarget}g</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: 'var(--surface-border)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${Math.min(((data?.todayCarbs || 0) / carbsTarget) * 100, 100)}%`, height: '100%', background: 'var(--primary-light)', borderRadius: '4px' }} />
              </div>
            </div>

            {/* Fats */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.9rem' }}>
                <span style={{ fontWeight: 600, color: 'var(--primary-dark)' }}>Healthy Fats</span>
                <span>{data?.todayFat || 0}g / {fatTarget}g</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: 'var(--surface-border)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${Math.min(((data?.todayFat || 0) / fatTarget) * 100, 100)}%`, height: '100%', background: 'var(--primary-dark)', borderRadius: '4px' }} />
              </div>
            </div>

          </div>

          <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--surface-light)', borderRadius: '10px', display: 'flex', justifyContent: 'space-around', textAlign: 'center', border: '1px solid var(--surface-border)' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>PROTEIN CALS</div>
              <div style={{ fontWeight: 700, marginTop: '2px', color: 'var(--primary)' }}>{(data?.todayProtein || 0) * 4} kcal</div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>CARB CALS</div>
              <div style={{ fontWeight: 700, marginTop: '2px', color: 'var(--primary-light)' }}>{(data?.todayCarbs || 0) * 4} kcal</div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>FAT CALS</div>
              <div style={{ fontWeight: 700, marginTop: '2px', color: 'var(--primary-dark)' }}>{(data?.todayFat || 0) * 9} kcal</div>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Grid: Recent Workouts & Nutrition Logs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
        
        {/* Recent Workouts */}
        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: "'Oswald', sans-serif" }}>
              <Activity size={20} color="var(--primary)" /> Recent Workouts
            </h3>
            <Link to="/workouts" style={{ color: 'var(--primary)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600 }}>
              View All
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {(!data?.recentWorkouts || data.recentWorkouts.length === 0) ? (
              <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                No workouts logged yet.
                <div style={{ marginTop: '0.75rem' }}>
                  <Link to="/workouts">
                    <button className="btn-primary btn-sm">Create First Routine</button>
                  </Link>
                </div>
              </div>
            ) : (
              data.recentWorkouts.slice(0, 4).map(w => (
                <div 
                  key={w._id}
                  style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    padding: '0.85rem 1rem', 
                    background: 'var(--surface-light)', 
                    borderRadius: '10px', 
                    border: '1px solid var(--surface-border)' 
                  }}
                >
                  <div>
                    <h4 style={{ margin: 0, fontSize: '1rem', textTransform: 'capitalize' }}>{w.name}</h4>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                      {new Date(w.date).toLocaleDateString()} • {w.exercises?.length || 0} exercises • {w.duration || 45} mins
                    </p>
                  </div>
                  <span className="badge" style={{ background: 'rgba(245, 158, 11, 0.12)', color: 'var(--primary)', border: '1px solid rgba(245, 158, 11, 0.25)' }}>
                    {w.category}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Today's Meals */}
        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: "'Oswald', sans-serif" }}>
              <Apple size={20} color="var(--primary)" /> Today's Meals
            </h3>
            <Link to="/nutrition" style={{ color: 'var(--primary)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600 }}>
              Log Meal
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {(!data?.todaysNutrition || data.todaysNutrition.length === 0) ? (
              <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                No meals logged today yet.
                <div style={{ marginTop: '0.75rem' }}>
                  <Link to="/nutrition">
                    <button className="btn-outline btn-sm">Log Breakfast / Snack</button>
                  </Link>
                </div>
              </div>
            ) : (
              data.todaysNutrition.map(meal => (
                <div 
                  key={meal._id}
                  style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    padding: '0.85rem 1rem', 
                    background: 'var(--surface-light)', 
                    borderRadius: '10px', 
                    border: '1px solid var(--surface-border)' 
                  }}
                >
                  <div>
                    <h4 style={{ margin: 0, fontSize: '1rem', textTransform: 'capitalize' }}>{meal.mealType}</h4>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                      {meal.foodItems?.map(i => i.name).join(', ') || 'Meal items'}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--primary)' }}>{meal.totalCalories} kcal</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>P: {meal.totalProtein || 0}g • C: {meal.totalCarbs || 0}g</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </motion.div>
  );
};

export default Dashboard;
