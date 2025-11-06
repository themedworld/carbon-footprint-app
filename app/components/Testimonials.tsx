// app/components/News.tsx
'use client';
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import './styles/Testimonials.css';

interface NewsArticle {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  image: string;
  tags: string[];
  featured: boolean;
  likes: number;
}

export default function News() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [likedArticles, setLikedArticles] = useState<number[]>([]);
  const [visibleArticles, setVisibleArticles] = useState(3);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const newsArticles: NewsArticle[] = [
    {
      id: 1,
      title: "Nouveau Programme de Compensation Carbone 2024",
      excerpt: "Découvrez notre nouveau programme de compensation avec des taux avantageux pour les agriculteurs engagés dans des pratiques durables.",
      content: "Le programme 2024 introduit des mécanismes innovants pour récompenser les pratiques agricoles durables...",
      category: "innovation",
      author: "Dr. Sarah Chen",
      date: "15 Mars 2024",
      readTime: "4 min",
      image: "/images/news/news2.png",
      tags: ["compensation", "innovation", "durabilité"],
      featured: true,
      likes: 42
    },
    {
      id: 2,
      title: "Fle7etna Eco Carbonne Lance son Application Mobile",
      excerpt: "Suivez vos crédits carbone et effectuez des transactions en temps réel depuis votre smartphone.",
      content: "Notre nouvelle application mobile offre une expérience utilisateur optimisée avec des fonctionnalités avancées...",
      category: "technologie",
      author: "Tech Team",
      date: "12 Mars 2024",
      readTime: "3 min",
      image: "/images/news/news3.png",
      tags: ["mobile", "technologie", "innovation"],
      featured: false,
      likes: 38
    },
    {
      id: 3,
      title: "Partenariat avec le Ministère de l'Agriculture",
      excerpt: "Signature d'un accord stratégique pour promouvoir l'agriculture durable en Tunisie.",
      content: "Ce partenariat historique vise à accélérer la transition écologique du secteur agricole tunisien...",
      category: "partenariat",
      author: "Relations Publiques",
      date: "10 Mars 2024",
      readTime: "5 min",
      image: "/images/news/news4.png",
      tags: ["partenariat", "gouvernement", "écologie"],
      featured: false,
      likes: 56
    }
  ];

  const categories = [
    { id: 'all', name: 'Toutes les actualités', count: newsArticles.length },
    { id: 'innovation', name: 'Innovation', count: newsArticles.filter(a => a.category === 'innovation').length },
    { id: 'technologie', name: 'Technologie', count: newsArticles.filter(a => a.category === 'technologie').length },
    { id: 'partenariat', name: 'Partenariats', count: newsArticles.filter(a => a.category === 'partenariat').length }
  ];

  const filteredArticles = activeCategory === 'all' 
    ? newsArticles 
    : newsArticles.filter(article => article.category === activeCategory);

  const displayedArticles = filteredArticles.slice(0, visibleArticles);

  const handleLike = (articleId: number) => {
    setLikedArticles(prev => 
      prev.includes(articleId) 
        ? prev.filter(id => id !== articleId)
        : [...prev, articleId]
    );
  };

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleArticles < filteredArticles.length) {
          setVisibleArticles(prev => prev + 2);
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => observerRef.current?.disconnect();
  }, [visibleArticles, filteredArticles.length]);

  return (
    <section id="news" className="news-section">
      {/* Background Elements */}
      <div className="news-background">
        <div className="news-orb orb-1"></div>
        <div className="news-orb orb-2"></div>
        <div className="news-grid-pattern"></div>
      </div>

      <div className="news-container">
        {/* Header Section */}
        <div className="news-header">
          <div className="header-badge">
            <span>Actualités</span>
          </div>
          <h1 className="news-main-title">
            L'actualité <span className="title-highlight">Fle7etna</span>
          </h1>
          <p className="news-subtitle">
            Restez informé des dernières innovations, partenariats et succès de notre communauté écologique.
          </p>
        </div>

        {/* Featured Article */}
        <div className="featured-section">
          <h2 className="section-title">À la une</h2>
          <div className="featured-article-main">
            {newsArticles.filter(article => article.featured).map((article) => (
              <div key={article.id} className="featured-card-main">
                <div className="featured-image-main">
                  <Image
                    src={article.image}
                    alt={article.title}
                    width={800}
                    height={400}
                    className="featured-img"
                    priority
                  />
                  <div className="featured-badge-main">Article vedette</div>
                </div>
                <div className="featured-content-main">
                  <div className="article-meta-main">
                    <span className="category-tag-main">{article.category}</span>
                    <span className="read-time-main">{article.readTime}</span>
                  </div>
                  <h2 className="featured-title-main">{article.title}</h2>
                  <p className="featured-excerpt-main">{article.excerpt}</p>
                  <div className="article-footer-main">
                    <div className="author-info-main">
                      <span className="author-main">Par {article.author}</span>
                      <span className="date-main">{article.date}</span>
                    </div>
                    <button 
                      className={`like-btn-main ${likedArticles.includes(article.id) ? 'liked' : ''}`}
                      onClick={() => handleLike(article.id)}
                    >
                      ♥ {article.likes + (likedArticles.includes(article.id) ? 1 : 0)}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Categories Filter */}
        <div className="categories-section">
          <div className="categories-scroll">
            {categories.map(category => (
              <button
                key={category.id}
                className={`category-btn ${activeCategory === category.id ? 'active' : ''}`}
                onClick={() => {
                  setActiveCategory(category.id);
                  setVisibleArticles(3);
                }}
              >
                <span className="category-name">{category.name}</span>
                <span className="category-count">{category.count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* News Grid */}
        <div className="news-grid">
          {displayedArticles.filter(article => !article.featured).map((article) => (
            <article key={article.id} className="news-card">
              <div className="card-inner">
                {/* Card Image */}
                <div className="article-image-container">
                  <Image
                    src={article.image}
                    alt={article.title}
                    width={400}
                    height={250}
                    className="article-image"
                  />
                  <div className="category-badge">{article.category}</div>
                </div>

                {/* Card Content */}
                <div className="card-content">
                  <div className="article-meta">
                    <span className="article-date">{article.date}</span>
                    <span className="read-time">{article.readTime}</span>
                  </div>
                  <h3 className="article-title">{article.title}</h3>
                  <p className="article-excerpt">{article.excerpt}</p>
                  
                  {/* Tags */}
                  <div className="article-tags">
                    {article.tags.map((tag, index) => (
                      <span key={index} className="tag">{tag}</span>
                    ))}
                  </div>
                </div>

                {/* Card Footer */}
                <div className="card-footer">
                  <div className="author-section">
                    <span className="author-name">Par {article.author}</span>
                  </div>
                  <button 
                    className={`like-btn-sm ${likedArticles.includes(article.id) ? 'liked' : ''}`}
                    onClick={() => handleLike(article.id)}
                  >
                    ♥ {article.likes + (likedArticles.includes(article.id) ? 1 : 0)}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Load More Trigger */}
        {visibleArticles < filteredArticles.length && (
          <div ref={loadMoreRef} className="load-more-trigger">
            <div className="loading-spinner"></div>
          </div>
        )}

        {/* Newsletter CTA */}

      </div>
    </section>
  );
}