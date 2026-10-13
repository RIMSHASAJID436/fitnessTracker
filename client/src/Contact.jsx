import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle, 
  AlertCircle, 
  MessageSquare, 
  Sparkles, 
  Coffee, 
  ShieldCheck, 
  HeartHandshake 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from './Footer';

const Contact = () => {
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    phone: '', 
    subject: 'General Inquiry', 
    message: '' 
  });
  const [status, setStatus] = useState({ sent: false, error: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ sent: false, error: '' });

    try {
      const res = await fetch('http://localhost:5000/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: `${formData.subject} - Phone: ${formData.phone || 'N/A'}`,
          message: formData.message,
          category: 'support'
        })
      });

      if (res.ok) {
        setStatus({ sent: true, error: '' });
        setFormData({ name: '', email: '', phone: '', subject: 'General Inquiry', message: '' });
      } else {
        const err = await res.json();
        setStatus({ sent: false, error: err.message || 'Failed to submit inquiry' });
      }
    } catch (err) {
      setStatus({ sent: false, error: 'Connection error. Please try again later.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--background)', color: 'var(--text)' }}>
      
      {/* 1. HERO BANNER */}
      <section style={{ 
        position: 'relative', 
        padding: '160px 2rem 80px 2rem', 
        background: 'linear-gradient(rgba(10, 10, 12, 0.8), rgba(10, 10, 12, 0.95)), url("https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=2070&auto=format&fit=crop") center/cover no-repeat',
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
              Get In Touch With Us
            </span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            style={{ fontSize: 'clamp(3rem, 6vw, 4.8rem)', fontWeight: 900, textTransform: 'uppercase', marginBottom: '1rem', fontFamily: "'Oswald', sans-serif" }}
          >
            CONTACT <span style={{ color: 'var(--primary)' }}>YOGALIFE</span>
          </motion.h1>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            style={{ display: 'flex', justifyContent: 'center', gap: '0.6rem', fontSize: '0.95rem', color: 'var(--text-muted)' }}
          >
            <Link to="/" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Home</Link>
            <span>/</span>
            <span>Contact Us</span>
          </motion.div>
        </div>
      </section>

      {/* 2. MAIN 2-COLUMN CONTACT SECTION */}
      <section style={{ padding: '6rem 2rem', maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '4rem', alignItems: 'flex-start' }}>
          
          {/* Left Column: Form */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="glass-panel"
            style={{ padding: '3rem 2.5rem', borderRadius: '16px', border: '1px solid var(--surface-border)' }}
          >
            <div style={{ marginBottom: '2rem' }}>
              <span style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem', letterSpacing: '2px', textTransform: 'uppercase', fontFamily: "'Oswald', sans-serif" }}>
                WRITE TO US
              </span>
              <h2 style={{ fontSize: '2.2rem', textTransform: 'uppercase', margin: '0.35rem 0 0.5rem 0', fontFamily: "'Oswald', sans-serif" }}>
                SEND US A <span style={{ color: 'var(--primary)' }}>MESSAGE</span>
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', margin: 0 }}>
                Have questions regarding class passes, private personal training, or studio workshops? Fill out the form below and our studio guides will respond within 24 hours.
              </p>
            </div>

            {status.sent && (
              <div style={{ background: 'var(--success-bg)', border: '1px solid var(--success)', color: 'var(--success)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.92rem' }}>
                <CheckCircle size={20} /> Thank you! Your message has been received by our studio front desk.
              </div>
            )}

            {status.error && (
              <div style={{ background: 'var(--danger-bg)', border: '1px solid var(--danger)', color: 'var(--danger)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.92rem' }}>
                <AlertCircle size={20} /> {status.error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.4rem', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>Your Full Name *</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="e.g. John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required 
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.4rem', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>Email Address *</label>
                  <input 
                    type="email" 
                    className="input-field" 
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required 
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.4rem', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>Phone Number</label>
                  <input 
                    type="tel" 
                    className="input-field" 
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.4rem', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>Subject</label>
                  <select 
                    className="input-field"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  >
                    <option value="General Inquiry">General Studio Inquiry</option>
                    <option value="Class Pass Questions">Class Pass & Pricing</option>
                    <option value="Private Coaching">Private Coaching & Yoga</option>
                    <option value="Workshop Booking">Upcoming Workshops</option>
                    <option value="Technical Support">FitTrack App Support</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>Your Message *</label>
                <textarea 
                  className="input-field" 
                  rows="5" 
                  placeholder="How can we support your fitness and yoga journey today?"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                ></textarea>
              </div>

              <button 
                type="submit" 
                className="btn-primary" 
                disabled={loading}
                style={{ padding: '1rem', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', marginTop: '0.5rem' }}
              >
                {loading ? 'Sending Message...' : (
                  <>
                    <Send size={18} /> Send Message To Studio
                  </>
                )}
              </button>
            </form>
          </motion.div>

          {/* Right Column: Studio Information & Amenities */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
          >
            {/* Contact Details Card */}
            <div className="glass-panel" style={{ padding: '2.5rem', borderRadius: '16px', border: '1px solid var(--surface-border)' }}>
              <span style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem', letterSpacing: '2px', textTransform: 'uppercase', fontFamily: "'Oswald', sans-serif" }}>
                STUDIO HEADQUARTERS
              </span>
              <h3 style={{ fontSize: '1.8rem', textTransform: 'uppercase', margin: '0.35rem 0 1.5rem 0', fontFamily: "'Oswald', sans-serif" }}>
                CONTACT <span style={{ color: 'var(--primary)' }}>INFORMATION</span>
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', flexShrink: 0 }}>
                    <MapPin size={22} />
                  </div>
                  <div>
                    <h4 style={{ margin: '0 0 0.2rem 0', fontSize: '1.05rem', fontFamily: "'Oswald', sans-serif" }}>Main Studio Location</h4>
                    <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                      248 Fitness Way, Yoga Boulevard, Suite 101<br />New York, NY 10001, United States
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', flexShrink: 0 }}>
                    <Phone size={22} />
                  </div>
                  <div>
                    <h4 style={{ margin: '0 0 0.2rem 0', fontSize: '1.05rem', fontFamily: "'Oswald', sans-serif" }}>Phone & Inquiries</h4>
                    <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                      Toll Free: +1 (800) 456-7890<br />
                      Studio Desk: +1 (212) 555-0199
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', flexShrink: 0 }}>
                    <Mail size={22} />
                  </div>
                  <div>
                    <h4 style={{ margin: '0 0 0.2rem 0', fontSize: '1.05rem', fontFamily: "'Oswald', sans-serif" }}>Email Support</h4>
                    <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                      info@yogalife.com<br />
                      support@fittrack.com
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', flexShrink: 0 }}>
                    <Clock size={22} />
                  </div>
                  <div>
                    <h4 style={{ margin: '0 0 0.2rem 0', fontSize: '1.05rem', fontFamily: "'Oswald', sans-serif" }}>Studio Hours</h4>
                    <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                      Monday – Friday: 6:00 AM – 10:00 PM<br />
                      Saturday – Sunday: 7:00 AM – 8:00 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Studio Amenities Card */}
            <div className="glass-panel" style={{ padding: '2rem 2.5rem', borderRadius: '16px', border: '1px solid var(--surface-border)' }}>
              <h4 style={{ fontSize: '1.2rem', textTransform: 'uppercase', marginBottom: '1rem', fontFamily: "'Oswald', sans-serif" }}>
                Complimentary Studio Perks
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {[
                  { icon: Coffee, text: 'Cold Pressed Juice & Tea' },
                  { icon: ShieldCheck, text: 'Eco Cork Mats & Props' },
                  { icon: HeartHandshake, text: 'Free 15-min Form Check' },
                  { icon: Clock, text: 'Steam Sauna & Rain Showers' }
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                    <item.icon size={18} color="var(--primary)" />
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive Map Embed */}
            <div style={{ borderRadius: '16px', overflow: 'hidden', height: '220px', border: '1px solid var(--surface-border)' }}>
              <iframe 
                title="Studio Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.15830869428!2d-74.119763973046!3d40.69766374874431!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY!5e0!3m2!1sen!2sus!4v1655000000000!5m2!1sen!2sus"
                width="100%" 
                height="100%" 
                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }} 
                allowFullScreen="" 
                loading="lazy"
              ></iframe>
            </div>

          </motion.div>

        </div>
      </section>

      {/* FOOTER */}
      <Footer />

    </div>
  );
};

export default Contact;
