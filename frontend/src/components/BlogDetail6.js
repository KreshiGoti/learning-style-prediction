import React from 'react';
import './BlogDetail6.css';

const BlogDetail6 = ({ onPageChange }) => {
  return (
    <div className="blog-detail">
      <header className="detail-topbar">
        <button className="back-btn" onClick={() => onPageChange('blog')}>
          ← Back to Blogs
        </button>
      </header>

      <article className="detail-article">
        <h1 className="detail-title">Discover Your Blended Learning Style with Our Quiz!</h1>

        <div className="detail-hero">
          <img
            src="https://images.unsplash.com/photo-1511988617509-a57c8a288659?q=80&w=1600&auto=format&fit=crop"
            alt="Abstract learning pathways illustration"
            loading="lazy"
          />
        </div>

        <section className="detail-content">
          <p>
            Have you ever taken a test that labeled you “just a visual learner,” even though you know you also love
            listening to podcasts and working with your hands? If you’ve ever felt limited by a single label, you’re not
            alone. Most of us are a rich tapestry of learning preferences. This guide explores why you are likely a unique
            mix, and how understanding your blended learning style can unlock more effective, engaging, and enjoyable
            learning.
          </p>

          <div className="detail-figure">
            <img
              src="https://images.unsplash.com/photo-1617296534789-17c7080f06d9?q=80&w=1600&auto=format&fit=crop"
              alt="Colorful abstract lines representing blended styles"
              loading="lazy"
            />
            <span className="fig-cap">Real learning blends multiple preferences depending on task and context.</span>
          </div>

          <h2>Understanding Your Blended Learning Style</h2>
          <p>
            While a single, dominant learning style is a useful starting point, it rarely tells the full story. Human
            cognition is complex and dynamic. We don’t operate in just one mode. Embracing a blended perspective means
            acknowledging that you may have a primary style supported by secondary preferences that you use in different
            situations.
          </p>

          <h2>Beyond Simple Labels: Visual, Auditory, Kinesthetic, and More</h2>
          <ul className="bullets">
            <li><strong>Visual learners</strong> prefer charts, diagrams, and written information.</li>
            <li><strong>Auditory learners</strong> prefer listening, discussion, and verbal reasoning.</li>
            <li><strong>Kinesthetic learners</strong> prefer experimentation, movement, and hands-on projects.</li>
          </ul>

          <h2>How to Identify Your Unique Mixed Learning Styles</h2>
          <p>
            Observation and reflection are key. Try different study tactics and note what works best for each subject or
            task. Over time, you’ll spot patterns that reveal your strongest combinations.
          </p>
        </section>

        <footer className="detail-footer">
          <button className="ghost" onClick={() => onPageChange('blog')}>Back to Blogs</button>
        </footer>
      </article>
    </div>
  );
};

export default BlogDetail6;
