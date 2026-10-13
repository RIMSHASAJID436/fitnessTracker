import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Activity, Mail, Phone, MapPin, Clock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { InstagramIcon, FacebookIcon, TwitterIcon, YoutubeIcon } from './icons/SocialIcons';

const Footer = () => {
  const [subscribedEmail, setSubscribedEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (subscribedEmail) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 5000);
      setSubscribedEmail('');
    }
  };

  return (
    <footer style={{ background: '#0a0a0c', borderTop: '1px solid var(--surface-border)', color: 'var(--text)', paddingTop: '5rem', paddingBottom: '2.5rem' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 2rem' }}>
        
        {/* Main Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '3rem', marginBottom: '4rem' }}>
          
          {/* Brand & Mission */}
          <div>
            <Link to="/" style={{ textDecoration: 'none', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.6rem', fontWeight: 800, fontSize: '1.8rem', fontFamily: "'Oswald', sans-serif", marginBottom: '1.25rem' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Activity size={22} color="#fff" />
              </div>
              YOGA<span style={{ color: 'var(--primary)' }}>LIFE</span> <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 400, marginLeft: '-0.3rem' }}>& FIT</span>
            </Link>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '1.5rem', fontFamily: "'Poppins', sans-serif" }}>
              Experience the perfect harmony of body, mind, and spirit. From high-intensity athletic conditioning to restorative mindful yoga and meditation, unlock your highest physical potential.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {[
                { icon: InstagramIcon, href: '#' },
                { icon: FacebookIcon, href: '#' },
                { icon: TwitterIcon, href: '#' },
                { icon: YoutubeIcon, href: '#' }
              ].map((s, idx) => (
                <a 
                  key={idx} 
                  href={s.href}
                  target="_blank" 
                  rel="noreferrer" 
                  style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--surface-light)', border: '1px solid var(--surface-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', transition: 'all 0.3s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--primary)'; e.currentTarget.style.borderColor = 'var(--primary)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--surface-light)'; e.currentTarget.style.borderColor = 'var(--surface-border)'; }}
                >
                  <s.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Our Programs */}
          <div>
            <h4 style={{ fontSize: '1.15rem', textTransform: 'uppercase', fontFamily: "'Oswald', sans-serif", letterSpacing: '1px', marginBottom: '1.5rem', color: '#fff', position: 'relative', paddingBottom: '0.5rem' }}>
              Our Programs
              <span style={{ position: 'absolute', bottom: 0, left: 0, width: '32px', height: '2px', background: 'var(--primary)' }}></span>
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem', fontSize: '0.95rem', fontFamily: "'Poppins', sans-serif" }}>
              {[
                'Vinyasa Flow Yoga (30-45m)',
                'Hatha Meditation & Breathwork',
                'Ashtanga Power Dynamic',
                'Hypertrophy & Strength',
                'Pilates Core Conditioning',
                'Yin Restorative Yoga'
              ].map((prog, idx) => (
                <li key={idx}>
                  <Link to="/about" style={{ textDecoration: 'none', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'color 0.2s' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                  >
                    <ArrowRight size={14} color="var(--primary)" /> {prog}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '1.15rem', textTransform: 'uppercase', fontFamily: "'Oswald', sans-serif", letterSpacing: '1px', marginBottom: '1.5rem', color: '#fff', position: 'relative', paddingBottom: '0.5rem' }}>
              Quick Links
              <span style={{ position: 'absolute', bottom: 0, left: 0, width: '32px', height: '2px', background: 'var(--primary)' }}></span>
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem', fontSize: '0.95rem', fontFamily: "'Poppins', sans-serif" }}>
              {[
                { name: 'Home Studio', path: '/' },
                { name: 'About & Trainers', path: '/about' },
                { name: 'Studio Contact', path: '/contact' },
                { name: 'Workout Tracker', path: '/login' },
                { name: 'Macro & Nutrition Log', path: '/login' },
                { name: 'Athlete Community', path: '/login' }
              ].map((link, idx) => (
                <li key={idx}>
                  <Link to={link.path} style={{ textDecoration: 'none', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'color 0.2s' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                  >
                    <ArrowRight size={14} color="var(--primary)" /> {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Studio Contact & Hours */}
          <div>
            <h4 style={{ fontSize: '1.15rem', textTransform: 'uppercase', fontFamily: "'Oswald', sans-serif", letterSpacing: '1px', marginBottom: '1.5rem', color: '#fff', position: 'relative', paddingBottom: '0.5rem' }}>
              Studio & Contact
              <span style={{ position: 'absolute', bottom: 0, left: 0, width: '32px', height: '2px', background: 'var(--primary)' }}></span>
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.92rem', color: 'var(--text-muted)', fontFamily: "'Poppins', sans-serif" }}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <MapPin size={20} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>248 Fitness Way, Yoga Boulevard, Suite 101, New York, NY 10001</span>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <Phone size={18} color="var(--primary)" style={{ flexShrink: 0 }} />
                <span>+1 (800) 456-7890</span>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <Mail size={18} color="var(--primary)" style={{ flexShrink: 0 }} />
                <span>support@fittrack.com</span>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <Clock size={18} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div>Mon - Fri: 6:00 AM – 10:00 PM</div>
                  <div>Sat - Sun: 7:00 AM – 8:00 PM</div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Newsletter Subscription Strip */}
        <div style={{ background: 'var(--surface-light)', borderRadius: '14px', border: '1px solid var(--surface-border)', padding: '2rem 2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '3.5rem' }}>
          <div style={{ maxWidth: '500px' }}>
            <h3 style={{ fontSize: '1.35rem', margin: '0 0 0.35rem 0', color: '#fff', textTransform: 'uppercase', fontFamily: "'Oswald', sans-serif" }}>
              Subscribe To Our Newsletter
            </h3>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem', fontFamily: "'Poppins', sans-serif" }}>
              Receive weekly mindfulness guides, workout blueprints, and special workshop passes directly in your inbox.
            </p>
          </div>
          <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: '0.5rem', flex: 1, maxWidth: '440px' }}>
            <input 
              type="email" 
              placeholder="Enter your email address..."
              required
              value={subscribedEmail}
              onChange={(e) => setSubscribedEmail(e.target.value)}
              className="input-field"
              style={{ background: '#121216', border: '1px solid var(--surface-border)', color: '#fff', padding: '0.75rem 1rem', borderRadius: '8px', flex: 1 }}
            />
            <button type="submit" className="btn-primary" style={{ padding: '0.75rem 1.5rem', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              Subscribe <ArrowRight size={16} />
            </button>
          </form>
          {subscribed && (
            <div style={{ width: '100%', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', marginTop: '0.5rem' }}>
              <CheckCircle2 size={16} /> You have successfully subscribed to YogaLife & FitTrack newsletter!
            </div>
          )}
        </div>

        {/* Bottom Bar */}
        <div style={{ borderTop: '1px solid var(--surface-border)', paddingTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)', fontFamily: "'Poppins', sans-serif" }}>
          <div>
            © 2026 FitTrack & YogaLife Studio. All rights reserved. Crafted with passion for mindful health.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <Link to="/contact" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Privacy Policy</Link>
            <Link to="/contact" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Terms of Service</Link>
            <Link to="/contact" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Studio Guidelines</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
