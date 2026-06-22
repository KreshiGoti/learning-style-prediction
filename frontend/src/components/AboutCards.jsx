import React from 'react';
import './AboutCards.css';

const cards = [
  {
    title: 'Our Mission',
    icon: <span className="about-card-icon">🎯</span>,
    text: 'To revolutionize education by helping every learner discover their unique learning style and reach their full potential.'
  },
  {
    title: 'Our Vision',
    icon: <span className="about-card-icon">🌍</span>,
    text: 'A world where education is personalized for every individual, making learning more effective and enjoyable.'
  },
  {
    title: 'Our Values',
    icon: <span className="about-card-icon">💡</span>,
    text: 'We believe in inclusive, accessible, and scientifically-backed approaches to understanding how people learn best.'
  }
];

const AboutCards = () => (
  <section className="about-cards-bg">
    <div className="about-cards-wrapper">
      {cards.map((card, idx) => (
        <div className="about-card" key={idx}>
          <div className="about-card-icon-circle">{card.icon}</div>
          <h3 className="about-card-title">{card.title}</h3>
          <p className="about-card-text">{card.text}</p>
        </div>
      ))}
    </div>
  </section>
);

export default AboutCards; 