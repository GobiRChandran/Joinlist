/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ChevronUp, X } from 'lucide-react';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
        <nav className="navbar">
          <a href="#" className="brand">
            JoinList<span className="brand-reg">®</span>
          </a>
          <button
            className={`menu-btn ${isOpen ? 'open' : ''}`}
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? 'Close' : 'Menu'} {isOpen ? <X size={16} /> : <ChevronUp size={16} />}
          </button>
        </nav>
      </header>

      <div className={`drawer ${isOpen ? 'open' : ''}`}>
        <div className="drawer-nav">
          <a href="#" className="drawer-link">How it works</a>
          <a href="#" className="drawer-link">Use cases</a>
          <a href="#" className="drawer-link">Pricing</a>
          <a href="#" className="drawer-link">For teams</a>
          <a href="#" className="drawer-link">Join the waitlist</a>
        </div>
        <div className="drawer-footer">
          © 2026 JoinList Inc.
        </div>
      </div>
    </>
  );
}

function WaitlistForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      if (res.ok) {
        setIsSubmitted(true);
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to join waitlist.");
    }
  }

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="btn-primary">
        Join the waitlist
      </button>

      {isOpen && (
        <div className="modal-overlay" onClick={() => setIsOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setIsOpen(false)}>
              <X size={20} />
            </button>
            
            {isSubmitted ? (
              <div className="modal-state">
                <h3 className="modal-title">You're on the list!</h3>
                <p className="modal-desc">While you wait, would you like to discuss your subscription fatigue with the founder?</p>
                <button onClick={() => window.open('https://calendly.com/gobic7061', '_blank')} className="btn-primary" style={{ width: '100%', marginBottom: '12px', background: '#fff', color: '#000', border: '1px solid #e5e5e5' }}>
                  Book a quick call
                </button>
                <button onClick={() => setIsOpen(false)} className="btn-primary" style={{ width: '100%', background: 'transparent', color: 'var(--muted)', boxShadow: 'none', border: 'none' }}>
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="modal-state">
                <h3 className="modal-title">
                  Show interest for <span className="brand" style={{ display: 'inline-flex', fontSize: 'inherit', color: 'inherit' }}>JoinList<span className="brand-reg" style={{ fontSize: '0.4em', marginTop: '0.2em' }}>®</span></span>
                </h3>
                <p className="modal-desc">Be the first to know when we launch.</p>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="modal-input"
                  required
                  autoFocus
                />
                <button type="submit" className="btn-primary" style={{ width: '100%' }}>
                  Submit
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function Hero() {
  const tickerItems = [
    "Free trials",
    "SaaS subscriptions",
    "Design contests",
    "Courses & apps",
    "Bills & renewals"
  ];

  return (
    <section className="hero">
      <div className="ticker-container">
        <div className="ticker-track">
          {[...Array(4)].map((_, groupIdx) => (
            <div key={groupIdx} style={{ display: 'flex', alignItems: 'center' }}>
              {tickerItems.map((item, i) => (
                <div key={`${groupIdx}-${i}`} style={{ display: 'flex', alignItems: 'center' }}>
                  <div className="ticker-item">{item}</div>
                  <div className="ticker-star" style={{ color: 'var(--muted)', fontSize: '12px', marginRight: '12px' }}>✦</div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <h1 className="hero-title">
        Stop surprise charges.<br />
        <span className="serif italic">JoinList</span><sup>®</sup> keeps you ahead.
      </h1>

      <p className="hero-subtitle">
        A simple tracker for trials, contests, and subscriptions. Log signups, see end & renewal dates, and get reminders before money leaves your account.
      </p>

      <div className="cta-row">
        <WaitlistForm />
        <a href="https://calendly.com/gobic7061" target="_blank" rel="noopener noreferrer" className="btn-book">
          <img
            src="https://framerusercontent.com/images/hfneFL6CHBi5BnNvCeOaqU9HqE4.png"
            alt="Avatar"
            className="book-avatar"
          />
          <div className="book-text">
            <div className="book-primary">
              Open to discuss? <span className="book-dot"></span>
            </div>
            <div className="book-secondary">
              Facing subscription fatigue?
            </div>
          </div>
        </a>
      </div>

      <div className="hero-blur"></div>
    </section>
  );
}

export default function App() {
  const [isAdmin, setIsAdmin] = useState(window.location.pathname === '/admin');

  useEffect(() => {
    const handleLocationChange = () => {
      setIsAdmin(window.location.pathname === '/admin');
    };
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  if (isAdmin) {
    return <AdminPanel />;
  }

  return (
    <main>
      <Navbar />
      <Hero />
    </main>
  );
}

function AdminPanel() {
  const [entries, setEntries] = useState<{ id: number, email: string, createdAt: string }[]>([]);

  useEffect(() => {
    fetch('/api/waitlist')
      .then(r => r.json())
      .then(setEntries)
      .catch(console.error);
  }, []);

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', fontFamily: 'var(--font-sans)' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '24px' }}>Waitlist Submissions ({entries.length})</h1>
      <a href="/" style={{ color: 'var(--muted)', textDecoration: 'none', marginBottom: '24px', display: 'inline-block' }}>&larr; Back to home</a>
      
      <div style={{ border: '1px solid #e5e5e5', borderRadius: '12px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#fafafa', borderBottom: '1px solid #e5e5e5' }}>
              <th style={{ padding: '12px 16px', fontWeight: 500 }}>ID</th>
              <th style={{ padding: '12px 16px', fontWeight: 500 }}>Email</th>
              <th style={{ padding: '12px 16px', fontWeight: 500 }}>Date Joined</th>
            </tr>
          </thead>
          <tbody>
            {entries.map(entry => (
              <tr key={entry.id} style={{ borderBottom: '1px solid #e5e5e5' }}>
                <td style={{ padding: '12px 16px', color: 'var(--muted)' }}>{entry.id}</td>
                <td style={{ padding: '12px 16px' }}>{entry.email}</td>
                <td style={{ padding: '12px 16px', color: 'var(--muted)' }}>{new Date(entry.createdAt).toLocaleString()}</td>
              </tr>
            ))}
            {entries.length === 0 && (
              <tr>
                <td colSpan={3} style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--muted)' }}>No waitlist entries yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

