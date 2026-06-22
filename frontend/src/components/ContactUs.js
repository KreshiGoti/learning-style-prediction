import React, { useState } from 'react';
import './ContactUs.css';

const ContactUs = ({ onPageChange, theme, toggleTheme, isLoggedIn, onLogin, onLogout, userProfile }) => {
  console.log('ContactUs component rendered');
  
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    console.log('Form submitted:', form);
  };

  const handleNavClick = (page) => {
    console.log('Navigation clicked:', page);
    if (onPageChange) {
      onPageChange(page);
    }
  };

  const handleLogout = () => {
    onLogout();
  };

  return (
    <div className="contact-page">

      {/* Contact Form */}
      <div className="contact-container">
        <form className="contact-form" onSubmit={handleSubmit}>
          <h2 className="contact-title">
            <span className="contact-icon">📨</span>
            Send us a Message
          </h2>
          
          <div className="contact-row">
            <div className="contact-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Your Full Name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="contact-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Your Email Address"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="contact-group">
            <label htmlFor="subject">Subject</label>
            <input
                type="text"
                id="subject"
                name="subject"
                placeholder="Your Subject"
                value={form.subject}
                onChange={handleChange}
                required
              />
          </div>
          
          <div className="contact-group">
            <label htmlFor="message">Message</label>
            <textarea
                id="message"
                name="message"
                placeholder="Your Message"
                value={form.message}
                onChange={handleChange}
                rows={5}
                required
              />
          </div>
          
          <button className="contact-submit" type="submit">
            Send Message
            <span className="send-icon">🛫</span>
          </button>
          
          {submitted && (
            <div className="contact-success">
              Thank you for your message! We'll get back to you soon.
            </div>
          )}
        </form>
      </div>

      {/* FAQ Section */}
      <div className="faq-section">
        <div className="faq-container">
          <h2 className="faq-title">Frequently Asked Questions</h2>
          <p className="faq-subtitle">Quick answers to common questions about our platform.</p>
          
          <div className="faq-items">
            <div className="faq-item">
              <div className="faq-icon">❓</div>
              <div className="faq-content">
                <h3 className="faq-question">How accurate is the learning style assessment?</h3>
                <p className="faq-answer">Our assessment has a 95% accuracy rate based on extensive research and validation studies.</p>
              </div>
            </div>
            
            <div className="faq-item">
              <div className="faq-icon">👥</div>
              <div className="faq-content">
                <h3 className="faq-question">Can institutions use this platform?</h3>
                <p className="faq-answer">Yes! We offer enterprise solutions for schools, universities, and training organizations.</p>
              </div>
            </div>
            
            <div className="faq-item">
              <div className="faq-icon">💬</div>
              <div className="faq-content">
                <h3 className="faq-question">How long does the quiz take?</h3>
                <p className="faq-answer">The complete assessment typically takes 15-20 minutes to ensure accurate results.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;