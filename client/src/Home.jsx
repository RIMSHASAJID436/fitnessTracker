import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, 
  Dumbbell, 
  Zap, 
  Target, 
  Apple, 
  Sparkles, 
  Play, 
  X, 
  Check, 
  Calendar, 
  Clock, 
  Flame, 
  Heart, 
  Star, 
  ChevronRight, 
  ArrowRight, 
  ShieldCheck, 
  Users, 
  Award, 
  Compass,
  CheckCircle2
} from 'lucide-react';
import Footer from './Footer';

const Home = () => {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [programFilter, setProgramFilter] = useState('all');
  const [galleryFilter, setGalleryFilter] = useState('all');
  const [annualBilling, setAnnualBilling] = useState(false);

  // Programs Data
  const programs = [
    {
      id: 1,
      category: 'yoga',
      title: 'Vinyasa Flow Yoga',
      desc: 'Dynamic, breath-synchronized sequence designed to build graceful mobility, core stamina, and mental presence.',
      duration: '45 Min',
      level: 'Beginner - Int.',
      calories: '280 kcal',
      trainer: 'Maya Lin',
      image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 2,
      category: 'yoga',
      title: 'Power Ashtanga Dynamic',
      desc: 'Structured, high-heat traditional series cultivating deep inner heat, joint endurance, and physical discipline.',
      duration: '60 Min',
      level: 'Advanced',
      calories: '420 kcal',
      trainer: 'David Chen',
      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 3,
      category: 'mindfulness',
      title: 'Hatha Breath & Meditation',
      desc: 'Gentle, foundational postures with intentional pranayama breathwork to balance your nervous system.',
      duration: '35 Min',
      level: 'All Levels',
      calories: '180 kcal',
      trainer: 'Sarah Jenkins',
      image: 'https://images.unsplash.com/photo-1508215885820-4523e45a3d7f?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 4,
      category: 'strength',
      title: 'Hypertrophy & Strength',
      desc: 'Progressive overload weight training focusing on compound lifts, muscular density, and peak power output.',
      duration: '55 Min',
      level: 'Intermediate',
      calories: '490 kcal',
      trainer: 'Marcus Vance',
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 5,
      category: 'strength',
      title: 'Pilates Core Sculpt',
      desc: 'Precise isometric contractions and spinal alignment exercises targeting deep pelvic and core stabilizers.',
      duration: '40 Min',
      level: 'All Levels',
      calories: '310 kcal',
      trainer: 'Elena Rostova',
      image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 6,
      category: 'mindfulness',
      title: 'Yin Restorative Sound Bath',
      desc: 'Long meditative floor postures targeting connective tissues, paired with soothing acoustic sound vibrations.',
      duration: '50 Min',
      level: 'All Levels',
      calories: '150 kcal',
      trainer: 'Kavita Patel',
      image: 'https://images.unsplash.com/photo-1552196563-5524e3a88410?q=80&w=800&auto=format&fit=crop'
    }
  ];

  const filteredPrograms = programFilter === 'all' 
    ? programs 
    : programs.filter(p => p.category === programFilter);

  // Gallery Data
  const galleryItems = [
    { id: 1, cat: 'yoga', title: 'Sunset Vinyasa Session', img: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=800&auto=format&fit=crop' },
    { id: 2, cat: 'strength', title: 'Powerlifting Training Floor', img: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop' },
    { id: 3, cat: 'meditation', title: 'Pranayama Morning Circle', img: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop' },
    { id: 4, cat: 'studio', title: 'Eco Bamboo Studio Hall', img: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=800&auto=format&fit=crop' },
    { id: 5, cat: 'yoga', title: 'Partner Alignment & Assists', img: 'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?q=80&w=800&auto=format&fit=crop' },
    { id: 6, cat: 'strength', title: 'Dumbbell Hypertrophy Zone', img: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800&auto=format&fit=crop' },
    { id: 7, cat: 'meditation', title: 'Sound Healing Singing Bowls', img: 'https://images.unsplash.com/photo-1552196563-5524e3a88410?q=80&w=800&auto=format&fit=crop' },
    { id: 8, cat: 'studio', title: 'Locker Lounge & Juice Bar', img: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=800&auto=format&fit=crop' },
  ];

  const filteredGallery = galleryFilter === 'all'
    ? galleryItems
    : galleryItems.filter(g => g.cat === galleryFilter);

  // Pricing Tiers (Matching Yogalife specs: $20, $40, $70, $150)
  const pricingPlans = [
    {
      name: 'Trial Week',
      duration: '7 Days Access',
      price: annualBilling ? 16 : 20,
      description: 'The ideal sampler pass to experience our signature morning yoga and fitness routines.',
      popular: false,
      features: [
        'Unlimited morning yoga flow classes',
        'Complimentary studio mat & towel',
        'FitTrack mobile workout logging',
        '1 initial fitness assessment',
        'Access to community forum'
      ],
      buttonText: 'Start Trial',
      buttonVariant: 'btn-outline'
    },
    {
      name: '10 Days Pass',
      duration: '10 Studio Days',
      price: annualBilling ? 32 : 40,
      description: 'Flexible punch card for busy professionals wanting high-quality workouts at their own pace.',
      popular: false,
      features: [
        'Access to any 10 studio sessions',
        'Free towel & locker service',
        'Full Nutrition & Macro tracking',
        'Weekend workshop priority',
        'Personal PR & progress analytics'
      ],
      buttonText: 'Get 10 Days',
      buttonVariant: 'btn-outline'
    },
    {
      name: '20 Days Pass',
      duration: '20 Studio Days',
      price: annualBilling ? 56 : 70,
      description: 'Our most popular tier. Consistent frequency to achieve visible body toning and mental serenity.',
      popular: true,
      features: [
        '20 all-access studio visits',
        '2 private 1-on-1 coaching check-ins',
        'Custom Macro meal plan generator',
        'VIP locker & fresh juice bar coupon',
        'Comprehensive progress scans',
        'Community challenges participation'
      ],
      buttonText: 'Claim Most Popular',
      buttonVariant: 'btn-primary'
    },
    {
      name: '30 Days VIP',
      duration: 'Full Month Unlimited',
      price: annualBilling ? 120 : 150,
      description: 'The ultimate unlimited pass with personal training, sound baths, and priority amenities.',
      popular: false,
      features: [
        'Unlimited daily classes & gym access',
        'Weekly private coaching session',
        'Direct chat with certified nutritionist',
        'Complimentary YogaLife merch & shaker',
        'Unlimited guest passes (2 per month)',
        'Full analytics exports & support'
      ],
      buttonText: 'Join VIP Club',
      buttonVariant: 'btn-outline'
    }
  ];

  // Testimonials
  const testimonials = [
    {
      name: 'Chloe Bennett',
      role: 'Yoga Practitioner (8 Months)',
      quote: 'YogaLife transformed my mental calmness and cured my chronic lower back tension. The combination of peaceful instructors and data tracking made health second nature.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop'
    },
    {
      name: 'Alexander Ward',
      role: 'CrossFit Athlete & Lifter',
      quote: 'I used to skip mobility, and my joints paid for it. Having the weightlifting logs side-by-side with Vinyasa yoga sessions in one platform has taken my PRs to another level.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop'
    },
    {
      name: 'Priya Sharma',
      role: 'Marathon Runner',
      quote: 'The restorative Yin classes and macronutrient breakdown keep my recovery on point after 20-mile weeks. I could not ask for a more inspiring community and studio!',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200&auto=format&fit=crop'
    }
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--background)', color: 'var(--text)', overflowX: 'hidden' }}>
      
      {/* 1. HERO SLIDER / BANNER SECTION */}
      <section style={{ 
        position: 'relative', 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '120px 2rem 80px 2rem',
        background: 'linear-gradient(rgba(10, 10, 12, 0.75), rgba(10, 10, 12, 0.9)), url("https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=2070&auto=format&fit=crop") center/cover no-repeat',
        backgroundAttachment: 'fixed'
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'radial-gradient(circle at 50% 50%, rgba(245, 158, 11, 0.14) 0%, transparent 70%)' }}></div>
        
        <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 2 }}>
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.35)', padding: '0.4rem 1.25rem', borderRadius: '50px', marginBottom: '1.5rem' }}
          >
            <Sparkles size={16} color="var(--primary)" />
            <span style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem', letterSpacing: '2px', textTransform: 'uppercase', fontFamily: "'Oswald', sans-serif" }}>
              Welcome to YogaLife & FitTrack Studio
            </span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{ fontSize: 'clamp(3rem, 7vw, 6.5rem)', fontWeight: 900, lineHeight: 1.05, textTransform: 'uppercase', marginBottom: '1.5rem', fontFamily: "'Oswald', sans-serif" }}
          >
            YOGA & FITNESS <br />
            <span style={{ color: 'var(--primary)', textShadow: '0 0 40px rgba(245, 158, 11, 0.45)' }}>FOR REAL LIFE</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)', color: '#d1d5db', maxWidth: '750px', margin: '0 auto 2.5rem auto', lineHeight: 1.7, fontFamily: "'Poppins', sans-serif" }}
          >
            Energize your mornings, sculpt functional athletic strength, and restore peace of mind. Combine mindfulness, progressive workout tracking, and macro nutrition in one unified sanctuary.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            style={{ display: 'flex', gap: '1.25rem', justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center' }}
          >
            <a href="#programs" style={{ textDecoration: 'none' }}>
              <button className="btn-primary" style={{ padding: '1.1rem 2.5rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                Explore Programs <ArrowRight size={18} />
              </button>
            </a>

            <button 
              onClick={() => setIsVideoModalOpen(true)}
              style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)', border: '1px solid var(--surface-border)', color: '#fff', padding: '1.1rem 2rem', borderRadius: '8px', fontSize: '1.1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', transition: 'all 0.3s' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; e.currentTarget.style.borderColor = '#fff'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor = 'var(--surface-border)'; }}
            >
              <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Play size={14} color="#fff" fill="#fff" style={{ marginLeft: '2px' }} />
              </div>
              Watch Studio Story
            </button>
          </motion.div>

          {/* Quick Metrics Floating Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.6 }}
            style={{ marginTop: '5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.5rem', background: 'rgba(18, 18, 22, 0.75)', backdropFilter: 'blur(15px)', border: '1px solid var(--surface-border)', borderRadius: '16px', padding: '1.75rem 2rem' }}
          >
            {[
              { val: '15,000+', label: 'Mindful Athletes' },
              { val: '40+', label: 'Yoga & Fit Instructors' },
              { val: '100+', label: 'Classes Every Week' },
              { val: '99.4%', label: 'Positive Life Changes' }
            ].map((stat, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.4rem', fontWeight: 900, color: 'var(--primary)', fontFamily: "'Oswald', sans-serif" }}>{stat.val}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 2. STUDIO WELCOME / ABOUT INTRO SECTION */}
      <section style={{ padding: '8rem 2rem', maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '4rem', alignItems: 'center' }}>
          
          {/* Left Media Image with Floating Card */}
          <div style={{ position: 'relative' }}>
            <div style={{ borderRadius: '20px', overflow: 'hidden', border: '1px solid var(--surface-border)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)' }}>
              <img 
                src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1000&auto=format&fit=crop" 
                alt="Yoga Studio Welcome" 
                style={{ width: '100%', height: '520px', objectFit: 'cover', display: 'block' }}
              />
            </div>
            {/* Floating Badge */}
            <div style={{ position: 'absolute', bottom: '-25px', right: '-15px', background: 'var(--surface-light)', border: '1px solid var(--primary)', padding: '1.5rem', borderRadius: '16px', backdropFilter: 'blur(12px)', boxShadow: '0 15px 30px rgba(0,0,0,0.5)', maxWidth: '240px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <Award color="var(--primary)" size={28} />
                <span style={{ fontWeight: 800, fontSize: '1.2rem', fontFamily: "'Oswald', sans-serif" }}>12+ YEARS</span>
              </div>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Inspiring mindful strength and balanced living worldwide.</p>
            </div>
          </div>

          {/* Right Text Content */}
          <div>
            <div style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.9rem', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '0.5rem', fontFamily: "'Oswald', sans-serif" }}>
              WELCOME TO YOGALIFE
            </div>
            <h2 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.5rem)', fontWeight: 800, textTransform: 'uppercase', lineHeight: 1.15, marginBottom: '1.5rem', fontFamily: "'Oswald', sans-serif" }}>
              A SANCTUARY FOR YOUR <br />
              <span style={{ color: 'var(--primary)' }}>BODY, MIND & SOUL</span>
            </h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, fontSize: '1rem', marginBottom: '1.5rem', fontFamily: "'Poppins', sans-serif" }}>
              YogaLife isn’t just a fitness studio; it is an integrated sanctuary where ancient yogic traditions harmonize with state-of-the-art strength training and nutritional science. Whether your goal is touching your toes, benching your bodyweight, or finding stillness amidst a hectic day, our expert guides support every breath.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' }}>
              {[
                'Certified Master Yogis & Elite Sports Conditioning Coaches',
                'Comprehensive tracking of sets, reps, macros, and mindfulness hours',
                'Eco-friendly bamboo studio rooms with ambient acoustic soundscapes',
                'Empowering, supportive community of positive fitness enthusiasts'
              ].map((point, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Check size={14} color="var(--primary)" />
                  </div>
                  <span style={{ fontSize: '0.95rem', fontWeight: 500 }}>{point}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
              <Link to="/about" style={{ textDecoration: 'none' }}>
                <button className="btn-primary" style={{ padding: '0.9rem 2rem' }}>About Our Studio</button>
              </Link>
              <Link to="/contact" style={{ textDecoration: 'none' }}>
                <button className="btn-outline" style={{ padding: '0.9rem 2rem' }}>Visit In Person</button>
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* 3. OUR PROGRAMS SECTION */}
      <section id="programs" style={{ padding: '7rem 2rem', background: '#0e0e12', borderTop: '1px solid var(--surface-border)', borderBottom: '1px solid var(--surface-border)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.9rem', letterSpacing: '2px', textTransform: 'uppercase', fontFamily: "'Oswald', sans-serif" }}>
              CHOOSE YOUR PRACTICE
            </span>
            <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 3.8rem)', fontWeight: 800, textTransform: 'uppercase', marginTop: '0.5rem', marginBottom: '1rem', fontFamily: "'Oswald', sans-serif" }}>
              OUR SIGNATURE <span style={{ color: 'var(--primary)' }}>PROGRAMS</span>
            </h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto', fontSize: '1rem' }}>
              Crafted by world-class yogis and conditioning trainers to align posture, unlock mobility, and build functional power.
            </p>

            {/* Filter Tabs */}
            <div style={{ display: 'inline-flex', gap: '0.5rem', background: 'var(--surface-light)', padding: '0.4rem', borderRadius: '12px', marginTop: '2rem', border: '1px solid var(--surface-border)', flexWrap: 'wrap', justifyContent: 'center' }}>
              {[
                { id: 'all', label: 'All Programs' },
                { id: 'yoga', label: 'Yoga & Flow' },
                { id: 'strength', label: 'Strength & Sculpt' },
                { id: 'mindfulness', label: 'Meditation & Breath' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setProgramFilter(tab.id)}
                  style={{
                    padding: '0.6rem 1.4rem',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    fontFamily: "'Oswald', sans-serif",
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase',
                    transition: 'all 0.3s',
                    background: programFilter === tab.id ? 'var(--primary)' : 'transparent',
                    color: programFilter === tab.id ? '#fff' : 'var(--text-muted)'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Programs Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem' }}>
            {filteredPrograms.map((p) => (
              <motion.div 
                key={p.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="glass-panel"
                style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', border: '1px solid var(--surface-border)', transition: 'transform 0.3s, border-color 0.3s' }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.45)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'var(--surface-border)'; }}
              >
                <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
                  <img 
                    src={p.image} 
                    alt={p.title} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  />
                  <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(10, 10, 12, 0.85)', backdropFilter: 'blur(8px)', padding: '0.3rem 0.8rem', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', border: '1px solid rgba(255,77,0,0.3)', textTransform: 'uppercase' }}>
                    {p.level}
                  </div>
                  <div style={{ position: 'absolute', bottom: '1rem', left: '1rem', display: 'flex', gap: '0.5rem' }}>
                    <span style={{ background: 'rgba(0,0,0,0.75)', padding: '0.25rem 0.6rem', borderRadius: '6px', fontSize: '0.75rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Clock size={12} color="var(--primary)" /> {p.duration}
                    </span>
                    <span style={{ background: 'rgba(0,0,0,0.75)', padding: '0.25rem 0.6rem', borderRadius: '6px', fontSize: '0.75rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Flame size={12} color="#f97316" /> {p.calories}
                    </span>
                  </div>
                </div>

                <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--primary)', textTransform: 'uppercase', fontWeight: 600, marginBottom: '0.4rem', letterSpacing: '1px' }}>
                    Instructor: {p.trainer}
                  </div>
                  <h3 style={{ fontSize: '1.45rem', marginBottom: '0.75rem', fontFamily: "'Oswald', sans-serif" }}>
                    {p.title}
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem', flex: 1 }}>
                    {p.desc}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--surface-border)', paddingTop: '1.25rem' }}>
                    <Link to="/workouts" style={{ textDecoration: 'none', width: '100%' }}>
                      <button className="btn-primary" style={{ width: '100%', padding: '0.65rem 1rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                        Join Practice Routine <ArrowRight size={15} />
                      </button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. WATCH VIDEO / STUDIO EXPERIENCE BANNER */}
      <section style={{ 
        position: 'relative', 
        padding: '10rem 2rem', 
        background: 'linear-gradient(rgba(10, 10, 12, 0.85), rgba(10, 10, 12, 0.95)), url("https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=2070&auto=format&fit=crop") center/cover no-repeat',
        backgroundAttachment: 'fixed',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '850px', margin: '0 auto' }}>
          
          <button 
            onClick={() => setIsVideoModalOpen(true)}
            style={{ 
              width: '90px', 
              height: '90px', 
              borderRadius: '50%', 
              background: 'var(--primary)', 
              border: '4px solid rgba(255, 255, 255, 0.3)', 
              color: '#000', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              margin: '0 auto 2.5rem auto',
              cursor: 'pointer',
              boxShadow: '0 0 50px rgba(245, 158, 11, 0.6)',
              transition: 'transform 0.3s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <Play size={36} fill="#000" color="#000" style={{ marginLeft: '4px' }} />
          </button>

          <span style={{ color: 'var(--primary)', letterSpacing: '3px', textTransform: 'uppercase', fontSize: '0.9rem', fontWeight: 700, fontFamily: "'Oswald', sans-serif" }}>
            WATCH THE STUDIO EXPERIENCE
          </span>
          <h2 style={{ fontSize: 'clamp(2.4rem, 5vw, 4.2rem)', fontWeight: 900, textTransform: 'uppercase', margin: '1rem 0 1.5rem 0', fontFamily: "'Oswald', sans-serif" }}>
            DISCOVER THE PURE ENERGY <br />
            <span style={{ color: 'var(--primary)' }}>WITHIN YOU</span>
          </h2>
          <p style={{ color: '#d1d5db', fontSize: '1.1rem', lineHeight: 1.8, maxWidth: '700px', margin: '0 auto 2.5rem auto' }}>
            Step into an environment carefully curated with fresh botanical air, calibrated ambient temperature, and expert coaches dedicated to your lifelong vitality.
          </p>

          <Link to="/contact" style={{ textDecoration: 'none' }}>
            <button className="btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.05rem' }}>
              Book A Free In-Studio Tour
            </button>
          </Link>
        </div>
      </section>

      {/* 5. YOGA & FITNESS FEATURES SECTION */}
      <section style={{ padding: '8rem 2rem', maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <span style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.9rem', letterSpacing: '2px', textTransform: 'uppercase', fontFamily: "'Oswald', sans-serif" }}>
            WHY CHOOSE YOGALIFE
          </span>
          <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 3.8rem)', fontWeight: 800, textTransform: 'uppercase', marginTop: '0.5rem', marginBottom: '1rem', fontFamily: "'Oswald', sans-serif" }}>
            YOGA & FITNESS <span style={{ color: 'var(--primary)' }}>FEATURES</span>
          </h2>
          <div style={{ width: '60px', height: '4px', background: 'var(--primary)', margin: '0 auto' }}></div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          {[
            {
              icon: Sparkles,
              title: 'Peace of Mind',
              desc: 'Relieve chronic mental fatigue and reset your autonomic nervous system through scientifically designed guided meditations.'
            },
            {
              icon: Compass,
              title: 'Mindfulness & Meditation',
              desc: 'Learn ancient Pranayama breathing techniques that regulate heart rate variability, sleep patterns, and daily emotional balance.'
            },
            {
              icon: ShieldCheck,
              title: 'Authentic Yoga Mats & Gear',
              desc: 'Practice on non-toxic, high-density natural tree rubber mats with cork blocks, bolsters, and straps for safe postural alignment.'
            },
            {
              icon: Apple,
              title: 'Macro & Nutrition Tracking',
              desc: 'Synchronize your daily meals, calories, and protein requirements with our built-in macro tracker to maximize physical recovery.'
            }
          ].map((feat, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15 }}
              className="glass-panel"
              style={{ padding: '3rem 2rem', textAlign: 'center', borderTop: '4px solid var(--primary)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            >
              <div style={{ width: '75px', height: '75px', borderRadius: '50%', background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', color: 'var(--primary)' }}>
                <feat.icon size={36} />
              </div>
              <h3 style={{ fontSize: '1.4rem', textTransform: 'uppercase', marginBottom: '1rem', fontFamily: "'Oswald', sans-serif" }}>
                {feat.title}
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.7, margin: 0, fontFamily: "'Poppins', sans-serif" }}>
                {feat.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 6. YOGA PRICING SECTION (MATCHING COLORLIB YOGALIFE TIERS) */}
      <section id="pricing" style={{ padding: '8rem 2rem', background: '#0e0e12', borderTop: '1px solid var(--surface-border)', borderBottom: '1px solid var(--surface-border)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.9rem', letterSpacing: '2px', textTransform: 'uppercase', fontFamily: "'Oswald', sans-serif" }}>
              TRANSPARENT PASSES
            </span>
            <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 3.8rem)', fontWeight: 800, textTransform: 'uppercase', marginTop: '0.5rem', marginBottom: '1rem', fontFamily: "'Oswald', sans-serif" }}>
              YOGA & FITNESS <span style={{ color: 'var(--primary)' }}>PRICING</span>
            </h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 2rem auto', fontSize: '1rem' }}>
              No hidden enrollment fees or long-term lock-ins. Flexible studio passes designed for both beginners and dedicated athletes.
            </p>

            {/* Monthly / Annual Billing Toggle */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '1rem', background: 'var(--surface-light)', padding: '0.5rem 1.25rem', borderRadius: '50px', border: '1px solid var(--surface-border)' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: !annualBilling ? 700 : 400, color: !annualBilling ? '#fff' : 'var(--text-muted)' }}>Standard</span>
              <button 
                onClick={() => setAnnualBilling(!annualBilling)}
                style={{ width: '48px', height: '26px', borderRadius: '50px', background: annualBilling ? 'var(--primary)' : '#374151', border: 'none', position: 'relative', cursor: 'pointer', transition: 'background 0.3s' }}
              >
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#fff', position: 'absolute', top: '3px', left: annualBilling ? '25px' : '3px', transition: 'left 0.3s' }}></div>
              </button>
              <span style={{ fontSize: '0.9rem', fontWeight: annualBilling ? 700 : 400, color: annualBilling ? '#fff' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                Annual Membership <span style={{ background: 'var(--primary)', color: '#fff', fontSize: '0.7rem', fontWeight: 800, padding: '0.15rem 0.5rem', borderRadius: '50px' }}>SAVE 20%</span>
              </span>
            </div>
          </div>

          {/* Pricing Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: '2rem', alignItems: 'stretch' }}>
            {pricingPlans.map((plan, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="glass-panel"
                style={{ 
                  padding: '2.5rem 2rem', 
                  borderRadius: '16px', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  position: 'relative',
                  border: plan.popular ? '2px solid var(--primary)' : '1px solid var(--surface-border)',
                  background: plan.popular ? 'linear-gradient(180deg, rgba(245, 158, 11, 0.1) 0%, rgba(18, 18, 22, 0.8) 100%)' : 'var(--surface)'
                }}
              >
                {plan.popular && (
                  <div style={{ position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)', background: 'var(--primary)', color: '#000', padding: '0.3rem 1.2rem', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', boxShadow: '0 4px 12px rgba(245, 158, 11, 0.4)' }}>
                    Most Popular Choice
                  </div>
                )}

                <h3 style={{ fontSize: '1.5rem', textTransform: 'uppercase', margin: '0 0 0.5rem 0', fontFamily: "'Oswald', sans-serif" }}>
                  {plan.name}
                </h3>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                  {plan.duration}
                </div>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.3rem', marginBottom: '1.5rem' }}>
                  <span style={{ fontSize: '3.5rem', fontWeight: 900, color: '#fff', fontFamily: "'Oswald', sans-serif" }}>${plan.price}</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>/ period</span>
                </div>

                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '2rem', minHeight: '44px' }}>
                  {plan.description}
                </p>

                <div style={{ borderTop: '1px solid var(--surface-border)', paddingTop: '1.5rem', marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '0.85rem', flex: 1 }}>
                  {plan.features.map((f, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem', fontSize: '0.88rem' }}>
                      <CheckCircle2 size={16} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>

                <Link to="/login" style={{ textDecoration: 'none' }}>
                  <button 
                    className={plan.buttonVariant} 
                    style={{ width: '100%', padding: '0.9rem', fontSize: '1rem', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}
                  >
                    {plan.buttonText}
                  </button>
                </Link>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* 7. OUR GALLERY SECTION */}
      <section style={{ padding: '8rem 2rem', maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.9rem', letterSpacing: '2px', textTransform: 'uppercase', fontFamily: "'Oswald', sans-serif" }}>
            MOMENTS IN MOTION
          </span>
          <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 3.8rem)', fontWeight: 800, textTransform: 'uppercase', marginTop: '0.5rem', marginBottom: '1rem', fontFamily: "'Oswald', sans-serif" }}>
            OUR STUDIO <span style={{ color: 'var(--primary)' }}>GALLERY</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 2rem auto', fontSize: '1rem' }}>
            A glimpse into the daily dedication, peaceful breathwork, and vibrant camaraderie of our community.
          </p>

          {/* Gallery Category Filter */}
          <div style={{ display: 'inline-flex', gap: '0.5rem', background: 'var(--surface-light)', padding: '0.4rem', borderRadius: '12px', border: '1px solid var(--surface-border)', flexWrap: 'wrap', justifyContent: 'center' }}>
            {[
              { id: 'all', label: 'All Photos' },
              { id: 'yoga', label: 'Yoga & Flow' },
              { id: 'strength', label: 'Weights & Power' },
              { id: 'meditation', label: 'Meditation' },
              { id: 'studio', label: 'Studio Space' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setGalleryFilter(tab.id)}
                style={{
                  padding: '0.55rem 1.25rem',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  fontFamily: "'Oswald', sans-serif",
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase',
                  transition: 'all 0.3s',
                  background: galleryFilter === tab.id ? 'var(--primary)' : 'transparent',
                  color: galleryFilter === tab.id ? '#fff' : 'var(--text-muted)'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {filteredGallery.map((item) => (
            <motion.div 
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              style={{ 
                position: 'relative', 
                height: '280px', 
                borderRadius: '14px', 
                overflow: 'hidden', 
                border: '1px solid var(--surface-border)',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                const img = e.currentTarget.querySelector('img');
                const overlay = e.currentTarget.querySelector('.gallery-overlay');
                if (img) img.style.transform = 'scale(1.1)';
                if (overlay) overlay.style.opacity = '1';
              }}
              onMouseLeave={(e) => {
                const img = e.currentTarget.querySelector('img');
                const overlay = e.currentTarget.querySelector('.gallery-overlay');
                if (img) img.style.transform = 'scale(1)';
                if (overlay) overlay.style.opacity = '0';
              }}
            >
              <img 
                src={item.img} 
                alt={item.title} 
                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
              />
              <div 
                className="gallery-overlay"
                style={{ 
                  position: 'absolute', 
                  top: 0, 
                  left: 0, 
                  right: 0, 
                  bottom: 0, 
                  background: 'linear-gradient(to top, rgba(10, 10, 12, 0.9) 0%, rgba(245, 158, 11, 0.4) 100%)',
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'flex-end', 
                  padding: '1.5rem',
                  opacity: 0,
                  transition: 'opacity 0.3s ease'
                }}
              >
                <span style={{ fontSize: '0.75rem', color: 'var(--primary)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '1px' }}>
                  {item.cat}
                </span>
                <h4 style={{ margin: '0.25rem 0 0 0', color: '#fff', fontSize: '1.2rem', fontFamily: "'Oswald', sans-serif" }}>
                  {item.title}
                </h4>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 8. UPCOMING EVENTS & WORKSHOPS */}
      <section style={{ padding: '7rem 2rem', background: '#0e0e12', borderTop: '1px solid var(--surface-border)', borderBottom: '1px solid var(--surface-border)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '3.5rem' }}>
            <div>
              <span style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.9rem', letterSpacing: '2px', textTransform: 'uppercase', fontFamily: "'Oswald', sans-serif" }}>
                COMMUNITY GATHERINGS
              </span>
              <h2 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.5rem)', fontWeight: 800, textTransform: 'uppercase', marginTop: '0.4rem', marginBottom: 0, fontFamily: "'Oswald', sans-serif" }}>
                UPCOMING <span style={{ color: 'var(--primary)' }}>WORKSHOPS</span>
              </h2>
            </div>
            <Link to="/contact" style={{ textDecoration: 'none' }}>
              <button className="btn-outline" style={{ padding: '0.75rem 1.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                View All Workshops <ArrowRight size={16} />
              </button>
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            {[
              {
                date: 'OCT 18',
                time: '6:30 PM - 8:30 PM',
                title: 'Full Moon Sound Bath & Candlelight Yin',
                coach: 'Elena Rostova & David Chen',
                desc: 'Immerse yourself in 90 minutes of Tibetan singing bowls and deep myofascial release under soft candlelight.'
              },
              {
                date: 'OCT 24',
                time: '10:00 AM - 12:30 PM',
                title: 'Functional Deadlift & Barbell Mastery Clinic',
                coach: 'Marcus Vance (CSCS)',
                desc: 'Optimize hip hinge mechanics, brace your core safely, and eliminate lower back discomfort in heavy pulling.'
              },
              {
                date: 'NOV 02',
                time: '8:00 AM - 10:00 AM',
                title: 'Pranayama Breathwork & Cold Immersion',
                coach: 'Maya Lin & Dr. Andrew Blake',
                desc: 'Supercharge your immune system and mental grit with hyper-oxygenation breathing followed by guided ice plunge.'
              }
            ].map((ev, i) => (
              <div key={i} className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', border: '1px solid var(--surface-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <div style={{ background: 'var(--primary)', color: '#000', padding: '0.4rem 0.9rem', borderRadius: '8px', fontWeight: 800, fontFamily: "'Oswald', sans-serif", fontSize: '0.95rem' }}>
                    {ev.date}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Clock size={14} color="var(--primary)" /> {ev.time}
                  </div>
                </div>

                <h3 style={{ fontSize: '1.35rem', marginBottom: '0.75rem', fontFamily: "'Oswald', sans-serif" }}>
                  {ev.title}
                </h3>
                <div style={{ fontSize: '0.85rem', color: 'var(--primary)', marginBottom: '0.75rem', fontWeight: 600 }}>
                  Led by {ev.coach}
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, flex: 1, marginBottom: '1.5rem' }}>
                  {ev.desc}
                </p>

                <Link to="/contact" style={{ textDecoration: 'none' }}>
                  <button className="btn-outline btn-sm" style={{ width: '100%', padding: '0.6rem', textAlign: 'center' }}>
                    Reserve Workshop Spot
                  </button>
                </Link>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 9. TESTIMONIALS / WHAT PEOPLE SAY */}
      <section style={{ padding: '8rem 2rem', maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <span style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.9rem', letterSpacing: '2px', textTransform: 'uppercase', fontFamily: "'Oswald', sans-serif" }}>
            TESTIMONIALS
          </span>
          <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 3.8rem)', fontWeight: 800, textTransform: 'uppercase', marginTop: '0.5rem', marginBottom: '1rem', fontFamily: "'Oswald', sans-serif" }}>
            WHAT OUR <span style={{ color: 'var(--primary)' }}>MEMBERS SAY</span>
          </h2>
          <div style={{ width: '60px', height: '4px', background: 'var(--primary)', margin: '0 auto' }}></div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          {testimonials.map((t, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15 }}
              className="glass-panel"
              style={{ padding: '2.5rem 2rem', display: 'flex', flexDirection: 'column', border: '1px solid var(--surface-border)' }}
            >
              <div style={{ display: 'flex', gap: '0.3rem', color: '#f59e0b', marginBottom: '1.25rem' }}>
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} size={18} fill="#f59e0b" />
                ))}
              </div>

              <p style={{ color: '#e5e7eb', fontSize: '0.98rem', lineHeight: 1.7, fontStyle: 'italic', flex: 1, marginBottom: '2rem', fontFamily: "'Poppins', sans-serif" }}>
                "{t.quote}"
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderTop: '1px solid var(--surface-border)', paddingTop: '1.25rem' }}>
                <img 
                  src={t.avatar} 
                  alt={t.name} 
                  style={{ width: '52px', height: '52px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary)' }}
                />
                <div>
                  <h4 style={{ margin: 0, fontSize: '1.1rem', fontFamily: "'Oswald', sans-serif" }}>{t.name}</h4>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 10. CALL TO ACTION STRIP */}
      <section style={{ 
        padding: '6rem 2rem', 
        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.95) 0%, rgba(217, 119, 6, 0.95) 100%)', 
        color: '#000', 
        textAlign: 'center' 
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(2.4rem, 5vw, 4rem)', fontWeight: 900, textTransform: 'uppercase', marginBottom: '1rem', fontFamily: "'Oswald', sans-serif", color: '#000' }}>
            START YOUR MINDFUL JOURNEY TODAY
          </h2>
          <p style={{ fontSize: '1.15rem', color: '#1a1a1a', lineHeight: 1.7, marginBottom: '2.5rem', fontFamily: "'Poppins', sans-serif", fontWeight: 500 }}>
            Join thousands of individuals cultivating athletic resilience and inner peace with YogaLife & FitTrack.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/login" style={{ textDecoration: 'none' }}>
              <button style={{ background: '#09090b', color: 'var(--primary)', padding: '1rem 2.5rem', borderRadius: '8px', border: 'none', fontWeight: 800, fontSize: '1.1rem', fontFamily: "'Oswald', sans-serif", letterSpacing: '1px', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.3s' }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.5)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                Join FitTrack Free
              </button>
            </Link>
            <Link to="/contact" style={{ textDecoration: 'none' }}>
              <button style={{ background: 'transparent', color: '#000', padding: '1rem 2.5rem', borderRadius: '8px', border: '2px solid #000', fontWeight: 800, fontSize: '1.1rem', fontFamily: "'Oswald', sans-serif", letterSpacing: '1px', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.3s' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.1)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
              >
                Schedule Studio Tour
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* VIDEO MODAL */}
      <AnimatePresence>
        {isVideoModalOpen && (
          <div 
            className="modal-overlay" 
            onClick={() => setIsVideoModalOpen(false)}
            style={{ zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              style={{ background: '#121216', border: '1px solid var(--surface-border)', borderRadius: '16px', overflow: 'hidden', width: '100%', maxWidth: '900px', boxShadow: '0 25px 50px rgba(0,0,0,0.8)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem', borderBottom: '1px solid var(--surface-border)' }}>
                <span style={{ fontWeight: 700, fontFamily: "'Oswald', sans-serif", letterSpacing: '1px', textTransform: 'uppercase' }}>
                  YogaLife Studio Experience Preview
                </span>
                <button 
                  onClick={() => setIsVideoModalOpen(false)}
                  style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}
                >
                  <X size={24} />
                </button>
              </div>

              {/* Video Embed */}
              <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, background: '#000' }}>
                <iframe 
                  src="https://www.youtube-nocookie.com/embed/inpok4MKVLM?autoplay=1&mute=0" 
                  title="Yoga Life Studio Experience" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                ></iframe>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FOOTER */}
      <Footer />

    </div>
  );
};

export default Home;
