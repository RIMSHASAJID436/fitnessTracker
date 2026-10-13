import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Download, 
  Printer, 
  Calendar, 
  Activity, 
  Apple, 
  TrendingUp, 
  Award,
  CheckCircle,
  Clock,
  Dumbbell
} from 'lucide-react';
import { useAuth } from './context/AuthContext';

const Reports = () => {
  const { user, formatWeight } = useAuth();
  const token = localStorage.getItem('fitTrackToken');

  const [dateRange, setDateRange] = useState('30'); // '7', '30', '90', 'all'
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchReport = async () => {
    setLoading(true);
    try {
      let url = 'http://localhost:5000/api/reports/summary?';
      if (dateRange !== 'all') {
        const days = Number(dateRange);
        const start = new Date();
        start.setDate(start.getDate() - days);
        url += `startDate=${start.toISOString()}&endDate=${new Date().toISOString()}`;
      }

      const res = await fetch(url, {
        headers: { 'x-auth-token': token }
      });
      if (res.ok) {
        const data = await res.json();
        setReportData(data);
      }
    } catch (err) {
      console.error('Fetch report err:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [dateRange]);

  const handleExportCSV = async (type) => {
    try {
      const res = await fetch(`http://localhost:5000/api/reports/export/csv?type=${type}`, {
        headers: { 'x-auth-token': token }
      });
      if (!res.ok) throw new Error('Download failed');

      const blob = await res.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `${type}_export_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error('Export CSV err:', err);
      alert('Failed to download CSV export');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <FileText color="var(--primary)" size={36} /> REPORTING & <span style={{ color: 'var(--primary)' }}>DATA EXPORT</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.35rem' }}>
            Generate executive fitness & nutrition reports, export data to CSV, or print a formatted PDF summary.
          </p>
        </div>

        <button onClick={handlePrint} className="btn-outline">
          <Printer size={18} /> Print / Save PDF
        </button>
      </div>

      {/* Date Range Selector & CSV Export Buttons */}
      <div className="glass-panel no-print" style={{ padding: '1.5rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem' }}>
        
        {/* Date Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Report Period:</span>
          {[
            { label: 'Past 7 Days', val: '7' },
            { label: 'Past 30 Days', val: '30' },
            { label: 'Past 90 Days', val: '90' },
            { label: 'All Time', val: 'all' }
          ].map(opt => (
            <button 
              key={opt.val}
              className={`filter-pill ${dateRange === opt.val ? 'active' : ''}`}
              onClick={() => setDateRange(opt.val)}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* CSV Downloads */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button onClick={() => handleExportCSV('workouts')} className="btn-outline btn-sm">
            <Download size={15} /> Workouts (CSV)
          </button>
          <button onClick={() => handleExportCSV('nutrition')} className="btn-outline btn-sm">
            <Download size={15} /> Nutrition (CSV)
          </button>
          <button onClick={() => handleExportCSV('progress')} className="btn-outline btn-sm">
            <Download size={15} /> Progress (CSV)
          </button>
        </div>

      </div>

      {/* Formal Printable Fitness Summary Report */}
      <div className="glass-panel print-report-container" style={{ padding: '2.5rem', marginBottom: '2rem' }}>
        
        {/* Report Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid var(--surface-border)', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontWeight: 800, fontSize: '1.5rem', fontFamily: "'Oswald', sans-serif" }}>
              <Activity size={28} /> FITTRACK PRO • ATHLETE PERFORMANCE REPORT
            </div>
            <h2 style={{ fontSize: '1.8rem', margin: '0.5rem 0 0.2rem 0' }}>{user?.name || 'Athlete'}</h2>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Username: @{user?.username} • Goal: {user?.fitnessGoal?.replace('_', ' ')} • Date Generated: {new Date().toLocaleDateString()}
            </p>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span className="badge" style={{ background: 'var(--primary-glow)', color: 'var(--primary)', padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
              PERIOD: {dateRange === 'all' ? 'ALL TIME' : `LAST ${dateRange} DAYS`}
            </span>
          </div>
        </div>

        {loading ? (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '3rem' }}>Compiling report data...</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* High Level Summary Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              
              <div style={{ background: 'var(--surface-light)', padding: '1.25rem', borderRadius: '10px', border: '1px solid var(--surface-border)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Workouts Completed</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: "'Oswald', sans-serif", color: 'var(--primary)', marginTop: '0.2rem' }}>
                  {reportData?.totalWorkouts || 0}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Total Duration: {reportData?.totalWorkoutMinutes || 0} mins
                </div>
              </div>

              <div style={{ background: 'var(--surface-light)', padding: '1.25rem', borderRadius: '10px', border: '1px solid var(--surface-border)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Volume Lifted</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: "'Oswald', sans-serif", color: 'var(--info)', marginTop: '0.2rem' }}>
                  {reportData?.totalVolume || 0} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>kg</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Cumulative Sets × Reps × Weight
                </div>
              </div>

              <div style={{ background: 'var(--surface-light)', padding: '1.25rem', borderRadius: '10px', border: '1px solid var(--surface-border)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Average Daily Calories</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: "'Oswald', sans-serif", color: 'var(--warning)', marginTop: '0.2rem' }}>
                  {reportData?.avgDailyCalories || 0} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>kcal</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Avg Protein: {reportData?.avgDailyProtein || 0}g/day
                </div>
              </div>

              <div style={{ background: 'var(--surface-light)', padding: '1.25rem', borderRadius: '10px', border: '1px solid var(--surface-border)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Net Weight Progress</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: "'Oswald', sans-serif", color: 'var(--success)', marginTop: '0.2rem' }}>
                  {reportData?.weightChange !== undefined ? `${reportData.weightChange > 0 ? `+${reportData.weightChange}` : reportData.weightChange} kg` : '0 kg'}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Current: {formatWeight(user?.currentWeight || 70)}
                </div>
              </div>

            </div>

            {/* Workouts History Table */}
            <div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Dumbbell size={20} color="var(--primary)" /> Workout History ({reportData?.workouts?.length || 0})
              </h3>
              {(!reportData?.workouts || reportData.workouts.length === 0) ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No workouts recorded during this period.</p>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--surface-border)', color: 'var(--text-muted)', textAlign: 'left' }}>
                        <th style={{ padding: '0.6rem 0.75rem' }}>DATE</th>
                        <th style={{ padding: '0.6rem 0.75rem' }}>NAME</th>
                        <th style={{ padding: '0.6rem 0.75rem' }}>CATEGORY</th>
                        <th style={{ padding: '0.6rem 0.75rem' }}>DURATION</th>
                        <th style={{ padding: '0.6rem 0.75rem' }}>VOLUME</th>
                        <th style={{ padding: '0.6rem 0.75rem' }}>EXERCISES</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.workouts.map(w => (
                        <tr key={w._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                          <td style={{ padding: '0.6rem 0.75rem' }}>{new Date(w.date).toLocaleDateString()}</td>
                          <td style={{ padding: '0.6rem 0.75rem', fontWeight: 600 }}>{w.name}</td>
                          <td style={{ padding: '0.6rem 0.75rem', textTransform: 'capitalize' }}>{w.category}</td>
                          <td style={{ padding: '0.6rem 0.75rem' }}>{w.duration || 45}m</td>
                          <td style={{ padding: '0.6rem 0.75rem', color: 'var(--primary)', fontWeight: 600 }}>{w.totalVolume || 0} kg</td>
                          <td style={{ padding: '0.6rem 0.75rem', color: 'var(--text-muted)' }}>
                            {(w.exercises || []).map(e => e.name).join(', ') || '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Nutrition Log Table */}
            <div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Apple size={20} color="var(--warning)" /> Nutrition & Meals Logged ({reportData?.nutrition?.length || 0})
              </h3>
              {(!reportData?.nutrition || reportData.nutrition.length === 0) ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No meals recorded during this period.</p>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--surface-border)', color: 'var(--text-muted)', textAlign: 'left' }}>
                        <th style={{ padding: '0.6rem 0.75rem' }}>DATE</th>
                        <th style={{ padding: '0.6rem 0.75rem' }}>MEAL TYPE</th>
                        <th style={{ padding: '0.6rem 0.75rem' }}>CALORIES</th>
                        <th style={{ padding: '0.6rem 0.75rem' }}>PROTEIN</th>
                        <th style={{ padding: '0.6rem 0.75rem' }}>CARBS</th>
                        <th style={{ padding: '0.6rem 0.75rem' }}>FAT</th>
                        <th style={{ padding: '0.6rem 0.75rem' }}>FOOD ITEMS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.nutrition.map(n => (
                        <tr key={n._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                          <td style={{ padding: '0.6rem 0.75rem' }}>{new Date(n.date).toLocaleDateString()}</td>
                          <td style={{ padding: '0.6rem 0.75rem', textTransform: 'capitalize', fontWeight: 600 }}>{n.mealType}</td>
                          <td style={{ padding: '0.6rem 0.75rem', color: 'var(--warning)', fontWeight: 600 }}>{n.totalCalories} kcal</td>
                          <td style={{ padding: '0.6rem 0.75rem' }}>{n.totalProtein || 0}g</td>
                          <td style={{ padding: '0.6rem 0.75rem' }}>{n.totalCarbs || 0}g</td>
                          <td style={{ padding: '0.6rem 0.75rem' }}>{n.totalFat || 0}g</td>
                          <td style={{ padding: '0.6rem 0.75rem', color: 'var(--text-muted)' }}>
                            {(n.foodItems || []).map(f => f.name).join(', ') || '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Performance & Progress Benchmarks */}
            <div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <TrendingUp size={20} color="var(--info)" /> Progress & Body Measurements History
              </h3>
              {(!reportData?.progress || reportData.progress.length === 0) ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No progress entries recorded during this period.</p>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--surface-border)', color: 'var(--text-muted)', textAlign: 'left' }}>
                        <th style={{ padding: '0.6rem 0.75rem' }}>DATE</th>
                        <th style={{ padding: '0.6rem 0.75rem' }}>WEIGHT</th>
                        <th style={{ padding: '0.6rem 0.75rem' }}>BODY FAT %</th>
                        <th style={{ padding: '0.6rem 0.75rem' }}>CHEST / WAIST / ARMS</th>
                        <th style={{ padding: '0.6rem 0.75rem' }}>BENCH / SQUAT / DL</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.progress.map(p => (
                        <tr key={p._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                          <td style={{ padding: '0.6rem 0.75rem' }}>{new Date(p.date).toLocaleDateString()}</td>
                          <td style={{ padding: '0.6rem 0.75rem', fontWeight: 600 }}>{formatWeight(p.weight)}</td>
                          <td style={{ padding: '0.6rem 0.75rem' }}>{p.bodyFatPercentage ? `${p.bodyFatPercentage}%` : '-'}</td>
                          <td style={{ padding: '0.6rem 0.75rem', color: 'var(--text-muted)' }}>
                            {p.measurements?.chest || '-'}cm / {p.measurements?.waist || '-'}cm / {p.measurements?.arms || '-'}cm
                          </td>
                          <td style={{ padding: '0.6rem 0.75rem', color: 'var(--text-muted)' }}>
                            {p.performanceMetrics?.benchPress || '-'}kg / {p.performanceMetrics?.squat || '-'}kg / {p.performanceMetrics?.deadlift || '-'}kg
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Report Footer */}
            <div style={{ borderTop: '1px solid var(--surface-border)', paddingTop: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
              FitTrack Pro • Complete Health & Fitness Management Platform • Generated on {new Date().toLocaleString()}
            </div>

          </div>
        )}

      </div>
    </motion.div>
  );
};

export default Reports;
