import React from 'react';
import './BlogPage.css';

const BlogPage = ({ onPageChange }) => {
  const posts = [
    {
      id: 1,
      title: 'Learning Style Quiz Apps: Your Ultimate Toolkit for VAK Learners',
      date: '2025-09-15',
      // Use an image proxy to avoid potential hotlink/referrer restrictions
      image: 'https://images.weserv.nl/?url=i.pinimg.com/736x/da/75/dc/da75dcba2332dfc9ac0df5a1c8177377.jpg',
      href: '#'
    },
    {
      id: 2,
      title: 'Learning Style Quiz: Science, Myths, & the VAK/VARK Model…',
      date: '2025-09-10',
      image: 'https://images.unsplash.com/photo-1526378722484-bd91ca387e72?q=80&w=1200&auto=format&fit=crop',
      href: '#'
    },
    {
      id: 3,
      title: "Learning Style Quiz for Kids: A Parent's Guide to Empowering…",
      date: '2025-09-03',
      image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?q=80&w=1200&auto=format&fit=crop',
      href: '#'
    },
    {
      id: 4,
      title: 'VAK Learning Styles: 15 Practical Classroom Activities',
      date: '2025-08-27',
      image: 'https://images.unsplash.com/photo-1513258496099-48168024aec0?q=80&w=1200&auto=format&fit=crop',
      href: '#'
    },
    {
      id: 5,
      title: "Free Learning Style Quiz: What's Your VAK Type?",
      date: '2025-08-22',
      image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1200&auto=format&fit=crop',
      href: '#'
    },
    {
      id: 6,
      title: 'Discover Your Blended Learning Style with Our Quiz!',
      date: '2025-08-11',
      image: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=1200&auto=format&fit=crop',
      href: '#'
    }
  ];

  return (
    <div className="blog-page">
      <div className="blog-grid">
        {posts.map((post) => (
          <article key={post.id} className="blog-card">
            <div className="card-media">
              <img 
                src={post.image} 
                alt={post.title} 
                loading="lazy"
                referrerPolicy="no-referrer"
                crossOrigin="anonymous"
                onError={(e) => {
                  const el = e.currentTarget;
                  const level = Number(el.dataset.fallbackLevel || 0);
                  if (level === 0) {
                    el.src = 'https://placehold.co/1200x675/png?text=Blog+Image';
                    el.dataset.fallbackLevel = '1';
                  } else if (level === 1) {
                    el.src = `https://picsum.photos/seed/${post.id}/1200/675`;
                    el.dataset.fallbackLevel = '2';
                  } else if (level >= 2) {
                    el.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675"><rect width="100%" height="100%" fill="%23f3f4f6"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%239ca3af" font-family="Arial" font-size="36">Image unavailable</text></svg>';
                    el.dataset.fallbackLevel = '3';
                  }
                }}
              />
              <span className="badge">Blog</span>
            </div>
            <div className="card-body">
              <h3 className="card-title">{post.title}</h3>
              <div className="card-meta">
                <span className="date">{post.date}</span>
                <a
                  className="read-more"
                  href={post.href}
                  onClick={(e) => {
                    // Navigate to detailed interface for specific cards
                    if (post.id === 1 || post.id === 2 || post.id === 3 || post.id === 4 || post.id === 5 || post.id === 6) {
                      e.preventDefault();
                      const target =
                        post.id === 1 ? 'blog-detail-1' :
                        post.id === 2 ? 'blog-detail-2' :
                        post.id === 3 ? 'blog-detail-3' :
                        post.id === 4 ? 'blog-detail-4' :
                        post.id === 5 ? 'blog-detail-5' :
                        'blog-detail-6';
                      onPageChange && onPageChange(target);
                    }
                  }}
                >
                  Read More →
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default BlogPage;
