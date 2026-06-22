import React from 'react';
import './BlogDetail5.css';

const BlogDetail5 = ({ onPageChange }) => {
  return (
    <div className="blog-detail">
      <header className="detail-topbar">
        <button className="back-btn" onClick={() => onPageChange('blog')}>
          ← Back to Blogs
        </button>
      </header>

      <article className="detail-article">
        <h1 className="detail-title">Free Learning Style Quiz: What's Your VAK Type?</h1>

        <div className="detail-hero">
          <img
            src="https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?q=80&w=1600&auto=format&fit=crop"
            alt="Brain illustration for VAK learning styles"
            loading="lazy"
          />
        </div>

        <section className="detail-content">
          <p>
            Do you ever feel like you're studying for hours but nothing sticks? Or perhaps you're a parent or teacher wondering why a student excels in one subject but struggles in another. The secret might be your unique way of taking in, storing, and applying information.
          </p>
          <p>
            The VAK model introduces three primary learning styles—Visual, Auditory, and Kinesthetic. Understanding your blend can be a major step toward unlocking your full potential.
          </p>

          <h2>What Are Learning Styles and Why Do They Matter?</h2>
          <p>
            Learning style refers to the unique way an individual prefers to receive, process, and retain new information. It's not about intelligence or ability—it's about compatibility with certain formats. Recognizing these differences makes learning more engaging and effective.
          </p>

          <div className="detail-figure">
            <img
              src="https://images.unsplash.com/photo-1559757175-08fda9f6f7d5?q=80&w=1600&auto=format&fit=crop"
              alt="Colorful brain diagram"
              loading="lazy"
            />
            <span className="fig-cap">Align teaching and study methods with how the brain prefers to work.</span>
          </div>

          <h2>It's a Preference, Not a Label</h2>
          <p>
            Your learning style is a preference—not a fixed identity. You may prefer one mode but benefit from all three. The goal is to leverage your strengths while building flexible study habits.
          </p>

          <h2>The 3 Core Learning Styles: Visual, Auditory, & Kinesthetic</h2>
          <ul className="bullets">
            <li><strong>Visual:</strong> Learns best through diagrams, charts, and reading/writing.</li>
            <li><strong>Auditory:</strong> Learns best through listening, speaking, and discussion.</li>
            <li><strong>Kinesthetic:</strong> Learns best by doing—projects, labs, movement.</li>
          </ul>
        </section>

        <footer className="detail-footer">
          <button className="ghost" onClick={() => onPageChange('blog')}>Back to Blogs</button>
        </footer>
      </article>
    </div>
  );
};

export default BlogDetail5;
