import React from 'react';
import { motion } from 'framer-motion';
import { 
  Dumbbell, 
  Sparkles, 
  Activity, 
  Target, 
  Zap, 
  Award, 
  Users, 
  Check, 
  ShieldCheck, 
  Flame, 
  ArrowRight, 
  BookOpen, 
  Clock
} from 'lucide-react';
import { InstagramIcon, TwitterIcon, LinkedinIcon } from './icons/SocialIcons';
import { Link } from 'react-router-dom';
import Footer from './Footer';

const About = () => {
  // Zacson-style Trainer / Discipline Cards
  const trainers = [
    {
      name: 'Marcus Vance',
      discipline: 'Body Building & Hypertrophy',
      role: 'Head Strength Coach (CSCS)',
      experience: '11 Years Experience',
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop',
      bio: 'Former competitive powerlifter specializing in compound movement biomechanics, progressive overload protocols, and maximal hypertrophy.'
    },
    {
      name: 'Elena Rostova',
      discipline: 'Muscle Gain & Functional Strength',
      role: 'Athletic Conditioning Lead',
      experience: '8 Years Experience',
      image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=800&auto=format&fit=crop',
      bio: 'Olympic lifting specialist focused on explosion, posterior chain development, and injury prevention through joint resilience.'
    },
    {
      name: 'Sarah Jenkins',
      discipline: 'Weight Loss & High-Intensity Cardio',
      role: 'Metabolic Conditioning Coach',
      experience: '9 Years Experience',
      image: 'https://images.unsplash.com/photo-1508215885820-4523e45a3d7f?q=80&w=800&auto=format&fit=crop',
      bio: 'Passionate about high-energy circuit training, VO2 max optimization, and sustainable nutritional habit building for fat loss.'
    },
    {
      name: 'David Chen',
      discipline: 'Yoga, Mobility & Posture Alignment',
      role: 'Master Ashtanga Instructor (ERYT-500)',
      experience: '14 Years Experience',
      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop',
      bio: 'Dedicated to helping heavy lifters and athletes reclaim spinal mobility, open stiff hips, and master diaphragmatic breathing.'
    }
  ];

  // Blog / Fitness Insights (Zacson style)
  const articles = [
    {
      title: 'The Science of Hypertrophy: Progressive Overload Explained',
      category: 'Body Building',
      date: 'OCT 04, 2026',
      readTime: '5 min read',
      image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800&auto=format&fit=crop',
      excerpt: 'Discover why tracking mechanical tension, volume load, and rep reserve is far more effective than just chasing muscle soreness.'
    },
    {
      title: 'Unlocking Joint Health: Why Every Heavy Lifter Needs Yoga',
      category: 'Yoga & Mobility',
      date: 'SEP 28, 2026',
      readTime: '6 min read',
      image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=800&auto=format&fit=crop',
      excerpt: 'How integrating twice-weekly Vinyasa and Yin holds restores connective tissue hydration and expands your bench & squat range.'
    },
    {
      title: 'Macro Balancing 101: Fueling Hard Training & Deep Sleep',
      category: 'Nutrition',
      date: 'SEP 21, 2026',
      readTime: '4 min read',
      image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=800&auto=format&fit=crop',
      excerpt: 'A practical framework to calculate your daily grams of protein, complex carbs, and healthy fats without obsessing over perfection.'
    }
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--background)', color: 'var(--text)' }}>
      
      {/* 1. HERO BANNER */}
      <section style={{ 
        position: 'relative', 
        padding: '160px 2rem 80px 2rem', 
        background: 'linear-gradient(rgba(10, 10, 12, 0.8), rgba(10, 10, 12, 0.95)), url("https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop") center/cover no-repeat',
        textAlign: 'center',
        borderBottom: '1px solid var(--surface-border)'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.35)', padding: '0.35rem 1.25rem', borderRadius: '50px', marginBottom: '1.25rem' }}
          >
            <Sparkles size={16} color="var(--primary)" />
            <span style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem', letterSpacing: '2px', textTransform: 'uppercase', fontFamily: "'Oswald', sans-serif" }}>
              Our Philosophy & Trainers
            </span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            style={{ fontSize: 'clamp(3rem, 6vw, 4.8rem)', fontWeight: 900, textTransform: 'uppercase', marginBottom: '1rem', fontFamily: "'Oswald', sans-serif" }}
          >
            ABOUT <span style={{ color: 'var(--primary)' }}>OUR STUDIO</span>
          </motion.h1>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            style={{ display: 'flex', justifyContent: 'center', gap: '0.6rem', fontSize: '0.95rem', color: 'var(--text-muted)' }}
          >
            <Link to="/" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Home</Link>
            <span>/</span>
            <span>About Us</span>
          </motion.div>
        </div>
      </section>

      {/* 2. WHO WE ARE & WHAT WE DO (ZACSON SPLIT SECTION) */}
      <section style={{ padding: '7rem 2rem', maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '4rem', alignItems: 'center' }}>
          
          {/* Left Media with Experience Tag */}
          <div style={{ position: 'relative' }}>
            <div style={{ borderRadius: '20px', overflow: 'hidden', border: '1px solid var(--surface-border)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)' }}>
              <img 
                src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1000&auto=format&fit=crop" 
                alt="Studio Story" 
                style={{ width: '100%', height: '540px', objectFit: 'cover', display: 'block' }}
              />
            </div>
            {/* Zacson-style Experience Callout */}
            <div style={{ position: 'absolute', bottom: '-20px', left: '-15px', background: 'var(--primary)', color: '#000', padding: '1.75rem 2rem', borderRadius: '16px', boxShadow: '0 20px 40px rgba(245, 158, 11, 0.4)', maxWidth: '260px' }}>
              <div style={{ fontSize: '3rem', fontWeight: 900, fontFamily: "'Oswald', sans-serif", lineHeight: 1 }}>12+</div>
              <div style={{ fontSize: '1rem', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '1px', marginTop: '0.35rem' }}>YEARS OF FITNESS EXCELLENCE</div>
            </div>
          </div>

          {/* Right Content */}
          <div>
            <span style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.9rem', letterSpacing: '2px', textTransform: 'uppercase', fontFamily: "'Oswald', sans-serif" }}>
              WHO WE ARE & WHAT WE DO
            </span>
            <h2 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.5rem)', fontWeight: 800, textTransform: 'uppercase', lineHeight: 1.15, margin: '0.5rem 0 1.5rem 0', fontFamily: "'Oswald', sans-serif" }}>
              WE BUILD STRONGER BODIES & <br />
              <span style={{ color: 'var(--primary)' }}>CALMER MINDS</span>
            </h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, fontSize: '1rem', marginBottom: '1.5rem', fontFamily: "'Poppins', sans-serif" }}>
              Founded with the conviction that high-performance strength and mindful restoration belong together, FitTrack & YogaLife provides an unmatched holistic training environment. We eliminate guesswork by combining barbell mastery, Vinyasa flows, macro nutrition planning, and automated PR analytics in one unified ecosystem.
            </p>

            {/* Checklist */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
              {[
                'Olympic Grade Free Weights & Racks',
                'Heated Bamboo Yoga & Sound Studio',
                'Custom Macro & Calorie Blueprint',
                'Real-Time Set & PR Volume Tracking',
                'Certified Exercise Physiologists',
                'Warm, Supportive Member Culture'
              ].map((feat, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Check size={12} color="var(--primary)" />
                  </div>
                  <span style={{ fontSize: '0.88rem', fontWeight: 500 }}>{feat}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              <Link to="/contact" style={{ textDecoration: 'none' }}>
                <button className="btn-primary" style={{ padding: '0.95rem 2rem' }}>
                  Schedule Consultation
                </button>
              </Link>
              <Link to="/login" style={{ textDecoration: 'none' }}>
                <button className="btn-outline" style={{ padding: '0.95rem 2rem' }}>
                  Explore Member App
                </button>
              </Link>
            </div>
          </div>

        </div>

        {/* Counter Stats Grid */}
        <div style={{ marginTop: '5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', background: 'var(--surface-light)', border: '1px solid var(--surface-border)', borderRadius: '16px', padding: '2.5rem 2rem' }}>
          {[
            { num: '15,000+', label: 'Athletes Trained' },
            { num: '45+', label: 'Certified Coaches' },
            { num: '12+', label: 'Years Experience' },
            { num: '120,000+', label: 'Logged Workouts' }
          ].map((item, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--primary)', fontFamily: "'Oswald', sans-serif" }}>
                {item.num}
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '0.2rem' }}>
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. EXPERT TRAINERS & DISCIPLINES (ZACSON THEME CARDS) */}
      <section style={{ padding: '7rem 2rem', background: '#0e0e12', borderTop: '1px solid var(--surface-border)', borderBottom: '1px solid var(--surface-border)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <span style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.9rem', letterSpacing: '2px', textTransform: 'uppercase', fontFamily: "'Oswald', sans-serif" }}>
              MEET OUR MASTERS
            </span>
            <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 3.8rem)', fontWeight: 800, textTransform: 'uppercase', marginTop: '0.5rem', marginBottom: '1rem', fontFamily: "'Oswald', sans-serif" }}>
              EXPERT TRAINERS & <span style={{ color: 'var(--primary)' }}>DISCIPLINES</span>
            </h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto', fontSize: '1rem' }}>
              World-renowned coaches in bodybuilding, functional hypertrophy, metabolic conditioning, and mindful mobility.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            {trainers.map((t, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
                className="glass-panel"
                style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', border: '1px solid var(--surface-border)', transition: 'transform 0.3s' }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-6px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ position: 'relative', height: '320px', overflow: 'hidden' }}>
                  <img 
                    src={t.image} 
                    alt={t.name} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{ position: 'absolute', top: '1rem', left: '1rem', background: 'var(--primary)', color: '#000', padding: '0.3rem 0.8rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {t.discipline}
                  </div>
                  <div style={{ position: 'absolute', bottom: '1rem', right: '1rem', background: 'rgba(10, 10, 12, 0.85)', backdropFilter: 'blur(8px)', padding: '0.25rem 0.65rem', borderRadius: '4px', fontSize: '0.75rem', color: '#fff' }}>
                    {t.experience}
                  </div>
                </div>

                <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <h3 style={{ fontSize: '1.45rem', margin: '0 0 0.25rem 0', fontFamily: "'Oswald', sans-serif" }}>
                    {t.name}
                  </h3>
                  <div style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600, marginBottom: '1rem' }}>
                    {t.role}
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.6, flex: 1, marginBottom: '1.5rem' }}>
                    {t.bio}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--surface-border)', paddingTop: '1rem' }}>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      <a href="#" style={{ color: 'var(--text-muted)', transition: 'color 0.2s' }}><InstagramIcon size={17} /></a>
                      <a href="#" style={{ color: 'var(--text-muted)', transition: 'color 0.2s' }}><TwitterIcon size={17} /></a>
                      <a href="#" style={{ color: 'var(--text-muted)', transition: 'color 0.2s' }}><LinkedinIcon size={17} /></a>
                    </div>
                    <Link to="/contact" style={{ textDecoration: 'none' }}>
                      <span style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                        Book 1-on-1 <ArrowRight size={13} />
                      </span>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. FITNESS & YOGA INSIGHTS / BLOG (ZACSON STYLE) */}
      <section style={{ padding: '7rem 2rem', maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.9rem', letterSpacing: '2px', textTransform: 'uppercase', fontFamily: "'Oswald', sans-serif" }}>
            FROM OUR BLOG
          </span>
          <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 3.8rem)', fontWeight: 800, textTransform: 'uppercase', marginTop: '0.5rem', marginBottom: '1rem', fontFamily: "'Oswald', sans-serif" }}>
            LATEST FITNESS <span style={{ color: 'var(--primary)' }}>INSIGHTS</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto', fontSize: '1rem' }}>
            Evidence-backed coaching guides on muscular growth, mobility routines, and nutritional habits.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          {articles.map((art, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15 }}
              className="glass-panel"
              style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', border: '1px solid var(--surface-border)' }}
            >
              <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
                <img 
                  src={art.image} 
                  alt={art.title} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', top: '1rem', left: '1rem', background: 'var(--primary)', color: '#fff', padding: '0.3rem 0.8rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>
                  {art.category}
                </div>
              </div>

              <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                  <span>{art.date}</span>
                  <span>•</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Clock size={12} /> {art.readTime}</span>
                </div>

                <h3 style={{ fontSize: '1.3rem', lineHeight: 1.35, marginBottom: '0.75rem', fontFamily: "'Oswald', sans-serif" }}>
                  {art.title}
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, flex: 1, marginBottom: '1.5rem' }}>
                  {art.excerpt}
                </p>

                <div style={{ borderTop: '1px solid var(--surface-border)', paddingTop: '1.25rem' }}>
                  <Link to="/contact" style={{ textDecoration: 'none', color: 'var(--primary)', fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    Read Full Article <ArrowRight size={15} />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <Footer />

    </div>
  );
};

export default About;
