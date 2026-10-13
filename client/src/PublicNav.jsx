import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Activity, Menu, X } from 'lucide-react';

const PublicNav = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '1.5rem 5%', 
        background: scrolled ? 'var(--background)' : 'transparent', 
        borderBottom: scrolled ? '1px solid var(--surface-border)' : 'none',
        position: 'fixed', 
        top: 0, 
        width: '100%', 
        zIndex: 100,
        transition: 'all 0.3s ease'
      }}>
        <Link to="/" style={{ textDecoration: 'none', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.6rem', fontWeight: 800, fontSize: '1.8rem', fontFamily: "'Oswald', sans-serif" }}>
          <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Activity size={20} color="#fff" />
          </div>
          YOGA<span style={{ color: 'var(--primary)' }}>LIFE</span> <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 400, marginLeft: '-0.3rem' }}>& FIT</span>
        </Link>
        
        {/* Desktop Menu */}
        <div className="desktop-menu" style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
          {[
            { label: 'Home', path: '/' },
            { label: 'Programs', path: '/#programs' },
            { label: 'About', path: '/about' },
            { label: 'Contact', path: '/contact' }
          ].map(item => {
            const isActive = location.pathname === item.path;
            return (
              <a 
                key={item.label} 
                href={item.path} 
                style={{ textDecoration: 'none', color: isActive ? 'var(--primary)' : '#fff', fontWeight: 600, fontFamily: "'Oswald', sans-serif", fontSize: '1.1rem', letterSpacing: '1px', textTransform: 'uppercase', transition: 'color 0.3s' }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'}
                onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.color = '#fff'; }}
              >
                {item.label}
              </a>
            )
          })}
          <Link to="/login" style={{ textDecoration: 'none' }}>
            <button className="btn-primary" style={{ padding: '0.5rem 1.5rem', fontSize: '1rem' }}>MEMBER LOGIN</button>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button className="mobile-toggle" onClick={() => setMobileMenuOpen(true)} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}>
          <Menu size={32} />
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'var(--background)', zIndex: 200, display: 'flex', flexDirection: 'column', padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button onClick={() => setMobileMenuOpen(false)} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}>
              <X size={40} />
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', alignItems: 'center', marginTop: '4rem' }}>
            {[
              { label: 'Home', path: '/' },
              { label: 'Programs', path: '/#programs' },
              { label: 'About', path: '/about' },
              { label: 'Contact', path: '/contact' }
            ].map(item => (
              <a 
                key={item.label} 
                href={item.path} 
                onClick={() => setMobileMenuOpen(false)} 
                style={{ textDecoration: 'none', color: '#fff', fontSize: '2rem', fontFamily: "'Oswald', sans-serif", textTransform: 'uppercase' }}
              >
                {item.label}
              </a>
            ))}
            <Link to="/login" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none', marginTop: '2rem' }}>
              <button className="btn-primary" style={{ padding: '1rem 3rem', fontSize: '1.5rem' }}>LOGIN</button>
            </Link>
          </div>
        </div>
      )}

      <style>{`
        .mobile-toggle { display: none; }
        @media (max-width: 768px) {
          .desktop-menu { display: none !important; }
          .mobile-toggle { display: block; }
        }
      `}</style>
    </>
  );
};

export default PublicNav;
