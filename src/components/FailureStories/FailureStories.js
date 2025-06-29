import React from 'react';
import './FailureStories.css';

const FailureStories = () => {
  const stories = [
    {
      id: 1,
      title: "How Netflix Almost Failed with Qwikster",
      category: "Business Strategy",
      image: "https://via.placeholder.com/300x200/2D2E36/F59E0B?text=Netflix",
      excerpt: "In 2011, Netflix announced they would split their DVD and streaming services into two separate companies...",
      readTime: "5 min read",
      lessons: 3,
      date: "2024-06-15"
    },
    {
      id: 2,
      title: "Google Glass: The Future That Wasn't Ready",
      category: "Product Innovation",
      image: "https://via.placeholder.com/300x200/2D2E36/6B46C1?text=Google",
      excerpt: "Google Glass promised to revolutionize how we interact with technology, but privacy concerns and social acceptance...",
      readTime: "7 min read",
      lessons: 5,
      date: "2024-06-12"
    },
    {
      id: 3,
      title: "Theranos: When Innovation Becomes Deception",
      category: "Healthcare Tech",
      image: "https://via.placeholder.com/300x200/2D2E36/14B8A6?text=Theranos",
      excerpt: "Elizabeth Holmes built a $9 billion company on promises of revolutionary blood testing technology...",
      readTime: "10 min read",
      lessons: 8,
      date: "2024-06-10"
    }
  ];

  return (
    <section className="failure-stories">
      <div className="stories-container">
        <div className="stories-header">
          <h2 className="stories-title">Latest Failure Stories</h2>
          <p className="stories-subtitle">
            Learn from the mistakes of industry giants and innovative startups
          </p>
        </div>

        <div className="stories-grid">
          {stories.map((story) => (
            <article key={story.id} className="story-card">
              <div className="story-image">
                <img src={story.image} alt={story.title} />
                <div className="story-category">{story.category}</div>
              </div>
              
              <div className="story-content">
                <h3 className="story-title">{story.title}</h3>
                <p className="story-excerpt">{story.excerpt}</p>
                
                <div className="story-meta">
                  <div className="story-stats">
                    <span className="read-time">{story.readTime}</span>
                    <span className="lessons-count">{story.lessons} lessons</span>
                  </div>
                  <span className="story-date">{story.date}</span>
                </div>
                
                <button className="read-more-btn">
                  Read Full Story
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </button>
              </div>
            </article>
          ))}
        </div>

        <div className="stories-footer">
          <button className="view-all-btn">
            View All Stories
          </button>
        </div>
      </div>
    </section>
  );
};

export default FailureStories;
