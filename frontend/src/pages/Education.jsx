import React from 'react';
import { PlayCircle, TrendingUp, BookOpen, ShieldCheck } from 'lucide-react';
import './FinancePages.css';
import './Education.css';

const Education = () => {
  const videoCategories = [
    {
      title: "Stock Market Basics",
      icon: <TrendingUp size={24} style={{ color: 'var(--primary-color)' }} />,
      videos: [
        { id: "p7HKvqRI_Bo", title: "How The Stock Market Works (Kurzgesagt)" },
        { id: "MPhMTh4eulE", title: "Stock Market Basics for Beginners" }
      ]
    },
    {
      title: "Personal Finance Rules",
      icon: <BookOpen size={24} style={{ color: 'var(--warning-color)' }} />,
      videos: [
        { id: "5h14gL_1oKk", title: "How To Make The 50/30/20 Budget Work" },
        { id: "m2k50284x9I", title: "How To Manage Your Money (50/30/20 Rule)" }
      ]
    },
    {
      title: "Mutual Funds & Safe Investing",
      icon: <ShieldCheck size={24} style={{ color: 'var(--success-color)' }} />,
      videos: [
        { id: "r1t4a5l3k-E", title: "What Are Mutual Funds? | Beginners" },
        { id: "_2-K9wZf8Hw", title: "Mutual Funds MasterClass" }
      ]
    }
  ];

  return (
    <div className="finance-page education-page">
      <header className="page-header">
        <h1>Investment Education</h1>
        <p className="subtitle">Learn how to grow your wealth with these curated masterclasses.</p>
      </header>

      <div className="finance-content">
        <div className="education-container">
          {videoCategories.map((category, idx) => (
            <div key={idx} className="video-category-section">
              <div className="category-header">
                {category.icon}
                <h2>{category.title}</h2>
              </div>
              <div className="video-grid">
                {category.videos.map((video, vIdx) => (
                  <div key={vIdx} className="video-card">
                    <div className="video-wrapper">
                      <iframe 
                        width="100%" 
                        height="100%" 
                        src={`https://www.youtube.com/embed/${video.id}`} 
                        title={video.title}
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen
                      ></iframe>
                    </div>
                    <div className="video-info">
                      <PlayCircle size={16} />
                      <h4>{video.title}</h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Education;
