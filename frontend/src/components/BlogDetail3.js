import React from 'react';
import './BlogDetail3.css';

const BlogDetail3 = ({ onPageChange }) => {
  return (
    <div className="blog-detail">
      <header className="detail-topbar">
        <button className="back-btn" onClick={() => onPageChange('blog')}>
          ← Back to Blogs
        </button>
      </header>

      <article className="detail-article">
        <h1 className="detail-title">Learning Style Quiz for Kids: A Parent's Guide to Empowering Learning</h1>

        <div className="detail-hero">
          <img
            src="https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?q=80&w=1600&auto=format&fit=crop"
            alt="Happy child learning with tablet"
            loading="lazy"
          />
        </div>

        <section className="detail-content">
          <p>
            Are you a parent juggling homework battles, wondering why one study method works wonders while others fall flat?
            Discovering your child's unique learning style profile through a quick, fun quiz can make all the difference.
            Instead of memorization frustration, you can inspire joyful learning at home and in class with a plan that fits
            how their brain prefers to learn.
          </p>

          <h2>Understanding Your Child's Learning Style</h2>
          <p>
            As a parent, you have a front-row seat to your child's development. Recognizing their natural preferences is a
            game-changer: it allows you to tailor homework help, create a supportive environment, and communicate in a way
            that truly resonates with them. This isn't about labeling—it's about empowering them with tools that naturally
            click with how their brain prefers to work.
          </p>

          <h2>What are the VAK Learning Styles for Kids?</h2>
          <p>
            The VAK model is a simple yet effective framework for understanding learning preferences. It categorizes
            learners into three types based on their dominant sense for processing information:
          </p>

          <ul className="bullets">
            <li><strong>Visual learners:</strong> They understand and remember things best by seeing them—charts, colors, pictures, and written notes.</li>
            <li><strong>Auditory learners:</strong> They learn best through hearing and talking—discussions, songs, reading aloud.</li>
            <li><strong>Kinesthetic learners:</strong> They learn by doing—hands-on activities, movement, and real-life examples.</li>
          </ul>

          <h2>How to Identify Your Child's Primary Learning Style</h2>
          <p>
            Observe how your child naturally approaches tasks. Do they draw pictures to explain ideas? Love to talk things
            out? Prefer building or acting things out? A short quiz can reveal the blend that fits them best so you can
            adjust your support at home with confidence.
          </p>

          <div className="detail-figure">
            <img
              src="https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?q=80&w=1600&auto=format&fit=crop"
              alt="VAK diagram"
              loading="lazy"
            />
            <span className="fig-cap">Use visuals, sound, and hands-on activities to make learning click.</span>
          </div>

          <h2>Why Knowing Their Style Makes a Difference</h2>
          <p>
            Matching how you explain and practice new concepts to your child's preferences not only helps them succeed—
            it strengthens your relationship. When your child feels understood, stress goes down and motivation goes up.
          </p>
        </section>

        <footer className="detail-footer">
          <button className="ghost" onClick={() => onPageChange('blog')}>Back to Blogs</button>
        </footer>
      </article>
    </div>
  );
};

export default BlogDetail3;
