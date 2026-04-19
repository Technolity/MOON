import { FormEvent, useEffect, useState } from 'react';
import type { CatalogItem, ProductKey } from '../types';
import { productStories } from '../data/products';

interface Review {
  name: string;
  rating: number;
  comment: string;
  date: string;
  verified?: boolean;
}

const STATIC_REVIEWS: Record<ProductKey, Review[]> = {
  shilajit: [
    { name: 'Aryan S.', rating: 5, comment: 'Absolutely life-changing. My stamina and focus have improved significantly after 3 weeks of daily use.', date: 'March 2025', verified: true },
    { name: 'Mehul P.', rating: 5, comment: 'Gold grade indeed. The consistency and potency are unlike anything I\'ve tried before.', date: 'February 2025', verified: true },
    { name: 'Sunita R.', rating: 4, comment: 'Very good quality. The packaging is premium and the resin dissolves well in warm water.', date: 'January 2025' },
  ],
  kashmiriSaffron: [
    { name: 'Priya K.', rating: 5, comment: 'The color and aroma are incomparable. I use it in everything from biryani to golden milk.', date: 'March 2025', verified: true },
    { name: 'Aisha M.', rating: 5, comment: 'Genuine Mongra threads. The red is so deep and the fragrance fills the entire kitchen.', date: 'February 2025', verified: true },
    { name: 'Vikram T.', rating: 4, comment: 'Excellent quality. A little goes a long way — very cost-effective for daily use.', date: 'December 2024' },
  ],
  kashmiriHoney: [
    { name: 'Rahul M.', rating: 5, comment: 'Wild mountain honey at its finest. Thick, naturally sweet, and unfiltered.', date: 'March 2025', verified: true },
    { name: 'Kavya L.', rating: 5, comment: 'I can taste the difference from regular store honey. This is the real deal — raw and authentic.', date: 'February 2025' },
    { name: 'Deepak N.', rating: 4, comment: 'Good quality honey. The enzymes are clearly intact as it crystallizes naturally in winter.', date: 'January 2025', verified: true },
  ],
  iraniSaffron: [
    { name: 'Fatima Z.', rating: 5, comment: 'Beautiful Negin threads. Strong color release and subtle floral fragrance. Great for daily cooking.', date: 'March 2025', verified: true },
    { name: 'Rohit S.', rating: 4, comment: 'Great value for the price. Thick threads that give excellent color to rice dishes and desserts.', date: 'February 2025' },
    { name: 'Nadia B.', rating: 5, comment: 'Consistent quality batch after batch. Perfect for my daily cooking rituals.', date: 'January 2025', verified: true },
  ],
  kashmiriAlmonds: [
    { name: 'Harpreet K.', rating: 5, comment: 'Fresh and crisp. Far better than what\'s available in local stores. The quality shows in every bite.', date: 'March 2025', verified: true },
    { name: 'Meena G.', rating: 4, comment: 'Good quality almonds. The kernels are whole and the taste is clean and natural.', date: 'February 2025' },
    { name: 'Sanjay V.', rating: 5, comment: 'My kids love these as a healthy snack. Premium quality, well-packaged and fresh.', date: 'January 2025', verified: true },
  ],
  walnuts: [
    { name: 'Arun P.', rating: 5, comment: 'Fresh batch, excellent omega content. You can taste the freshness — nothing like store-bought.', date: 'March 2025', verified: true },
    { name: 'Leena T.', rating: 4, comment: 'Good quality walnuts from Kashmir. Slightly bitter aftertaste which is natural and a sign of quality.', date: 'February 2025' },
    { name: 'Vikrant M.', rating: 5, comment: 'Best walnuts I\'ve ever had. Great for my morning smoothie and overnight soaking.', date: 'January 2025', verified: true },
  ],
  kashmiriGhee: [
    { name: 'Champa D.', rating: 5, comment: 'Incredibly aromatic and rich. The bilona process really shows in the taste and consistency.', date: 'March 2025', verified: true },
    { name: 'Rajesh B.', rating: 5, comment: 'Traditional taste, just like my grandmother used to make. A reminder of pure home cooking.', date: 'February 2025', verified: true },
    { name: 'Ananya S.', rating: 4, comment: 'Premium ghee, beautiful golden color and great aroma. Worth every rupee spent.', date: 'January 2025' },
  ],
};

const GALLERY_IMAGES: Record<ProductKey, string[]> = {
  shilajit: [
    '/moon333/ezgif-frame-125.png',
    '/moon333/ezgif-frame-096.png',
    '/moon333/ezgif-frame-030.png',
    '/moon333/ezgif-frame-060.png',
    '/moon333/ezgif-frame-051.png',
  ],
  kashmiriSaffron: [
    '/moon2222/ezgif-frame-120.png',
    '/moon2222/ezgif-frame-096.png',
    '/moon2222/ezgif-frame-030.png',
    '/moon2222/ezgif-frame-060.png',
    '/moon2222/ezgif-frame-056.png',
  ],
  kashmiriHoney: [
    '/ezgif-2fae6b36993927b6-jpg/ezgif-frame-159.png',
    '/ezgif-2fae6b36993927b6-jpg/ezgif-frame-096.png',
    '/ezgif-2fae6b36993927b6-jpg/ezgif-frame-030.png',
    '/ezgif-2fae6b36993927b6-jpg/ezgif-frame-060.png',
    '/ezgif-2fae6b36993927b6-jpg/ezgif-frame-118.png',
  ],
  iraniSaffron: [
    '/ezgif-2fae6b36993927b6-jpg/ezgif-frame-118.png',
    '/ezgif-2fae6b36993927b6-jpg/ezgif-frame-096.png',
    '/ezgif-2fae6b36993927b6-jpg/ezgif-frame-030.png',
    '/ezgif-2fae6b36993927b6-jpg/ezgif-frame-060.png',
    '/ezgif-2fae6b36993927b6-jpg/ezgif-frame-159.png',
  ],
  kashmiriAlmonds: [
    '/moon2222/ezgif-frame-056.png',
    '/moon2222/ezgif-frame-096.png',
    '/moon2222/ezgif-frame-030.png',
    '/moon2222/ezgif-frame-060.png',
    '/moon2222/ezgif-frame-120.png',
  ],
  walnuts: [
    '/moon333/ezgif-frame-051.png',
    '/moon333/ezgif-frame-096.png',
    '/moon333/ezgif-frame-030.png',
    '/moon333/ezgif-frame-060.png',
    '/moon333/ezgif-frame-125.png',
  ],
  kashmiriGhee: [
    '/ezgif-2fae6b36993927b6-jpg/ezgif-frame-159.png',
    '/ezgif-2fae6b36993927b6-jpg/ezgif-frame-096.png',
    '/ezgif-2fae6b36993927b6-jpg/ezgif-frame-030.png',
    '/ezgif-2fae6b36993927b6-jpg/ezgif-frame-060.png',
    '/ezgif-2fae6b36993927b6-jpg/ezgif-frame-118.png',
  ],
};

interface ProductDetailModalProps {
  item: CatalogItem;
  onClose: () => void;
  onAddToCart: (item: { id: string; title: string; price: number }) => void;
}

export function ProductDetailModal({ item, onClose, onAddToCart }: ProductDetailModalProps) {
  const story = item.productKey ? productStories[item.productKey] : null;
  const images = item.productKey ? GALLERY_IMAGES[item.productKey] : [item.image];
  const staticReviews = item.productKey ? STATIC_REVIEWS[item.productKey] : [];

  const [activeImage, setActiveImage] = useState(0);
  const [userReviews, setUserReviews] = useState<Review[]>([]);
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [addedFeedback, setAddedFeedback] = useState(false);

  const fmt = (price: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const bullets = story ? story.details.split('<br>').filter(Boolean) : [];
  const allReviews = [...staticReviews, ...userReviews];
  const avgRating = allReviews.length
    ? allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length
    : 0;

  const handleAddToCart = () => {
    onAddToCart(item);
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 2000);
  };

  const handleReviewSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewComment.trim()) return;
    setUserReviews((prev) => [
      {
        name: reviewName.trim(),
        rating: reviewRating,
        comment: reviewComment.trim(),
        date: new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }),
      },
      ...prev,
    ]);
    setReviewName('');
    setReviewRating(5);
    setReviewComment('');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 150,
        background: 'rgba(11,8,6,0.72)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        overflowY: 'auto',
        padding: 'clamp(12px, 3vw, 24px)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Product detail: ${item.title}`}
        style={{
          background: 'var(--paper-0, #FAF6EF)',
          width: '100%',
          maxWidth: 1100,
          position: 'relative',
          marginBottom: 24,
          boxShadow: 'var(--shadow-lift, 0 30px 60px -20px rgba(42,27,16,0.28))',
        }}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close product detail"
          style={{
            position: 'absolute', top: 16, right: 16, zIndex: 20,
            background: 'var(--paper-1, #F4EDE2)',
            border: '1px solid var(--hairline, rgba(11,8,6,0.12))',
            width: 40, height: 40,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', transition: 'background 0.2s',
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--paper-2, #ECE2D1)'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--paper-1, #F4EDE2)'; }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 20, color: 'var(--ink-0)' }}>close</span>
        </button>

        {/* ── MAIN PRODUCT SECTION ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        }}>

          {/* Left — Image Gallery */}
          <div style={{
            background: 'var(--paper-1, #F4EDE2)',
            padding: 'clamp(20px, 3vw, 36px)',
            borderRight: '1px solid var(--hairline, rgba(11,8,6,0.12))',
          }}>
            {/* Main image */}
            <div style={{
              aspectRatio: '1',
              overflow: 'hidden',
              background: 'var(--paper-2, #ECE2D1)',
              marginBottom: 12,
            }}>
              <img
                src={images[activeImage]}
                alt={`${item.title} — view ${activeImage + 1}`}
                style={{
                  width: '100%', height: '100%', objectFit: 'cover',
                  display: 'block',
                  transition: 'opacity 0.25s ease',
                }}
              />
            </div>

            {/* Thumbnails */}
            <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
              {images.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveImage(i)}
                  aria-label={`View image ${i + 1}`}
                  style={{
                    width: 68, height: 68, flexShrink: 0,
                    padding: 0, border: 'none', cursor: 'pointer',
                    outline: i === activeImage
                      ? '2px solid var(--ink-0, #0B0806)'
                      : '2px solid transparent',
                    outlineOffset: 2,
                    transition: 'outline-color 0.15s',
                    background: 'none',
                  }}
                >
                  <img
                    src={img}
                    alt={`${item.title} thumbnail ${i + 1}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right — Product Details */}
          <div style={{
            padding: 'clamp(24px, 4vw, 48px)',
            display: 'flex', flexDirection: 'column', gap: 18,
            paddingRight: 'clamp(24px, 5vw, 64px)',
          }}>
            {/* Eyebrow */}
            <div style={{
              fontFamily: 'var(--font-mark, Syncopate, sans-serif)',
              fontSize: '0.5625rem', letterSpacing: '0.28em',
              textTransform: 'uppercase', color: 'var(--ink-3, #8A7A66)',
            }}>
              {item.subtitle || 'Moon · Origin'} · Single Origin
            </div>

            {/* Product name */}
            <h1 style={{
              fontFamily: 'var(--font-serif, Fraunces, serif)',
              fontSize: 'clamp(1.75rem, 3vw, 2.75rem)',
              fontWeight: 400, lineHeight: 1.08, letterSpacing: '-0.01em',
              color: 'var(--ink-0, #0B0806)', margin: 0,
            }}>
              {item.title}
            </h1>

            {/* Rating summary */}
            {allReviews.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div aria-label={`${avgRating.toFixed(1)} out of 5 stars`}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <span key={s} aria-hidden style={{
                      color: s <= Math.round(avgRating) ? 'var(--saffron-500, #D2571B)' : 'var(--paper-3, #E0D3BC)',
                      fontSize: 15,
                    }}>★</span>
                  ))}
                </div>
                <span style={{
                  fontFamily: 'var(--font-sans)', fontSize: '0.8125rem',
                  color: 'var(--ink-2, #4A3E31)',
                }}>
                  {avgRating.toFixed(1)} · {allReviews.length} review{allReviews.length !== 1 ? 's' : ''}
                </span>
              </div>
            )}

            {/* Description */}
            {story && (
              <p style={{
                fontFamily: 'var(--font-sans, Manrope, sans-serif)',
                fontSize: '0.9375rem', lineHeight: 1.75,
                color: 'var(--ink-2, #4A3E31)', margin: 0,
              }}>
                {story.desc}
              </p>
            )}

            {/* Feature tags */}
            {bullets.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {bullets.map((b) => (
                  <span key={b} style={{
                    border: '1px solid var(--hairline-strong, rgba(11,8,6,0.22))',
                    padding: '6px 14px',
                    fontFamily: 'var(--font-mark, Syncopate, sans-serif)',
                    fontSize: '0.5625rem', letterSpacing: '0.16em',
                    textTransform: 'uppercase', color: 'var(--ink-2, #4A3E31)',
                    background: 'var(--paper-1, #F4EDE2)',
                  }}>
                    {b}
                  </span>
                ))}
              </div>
            )}

            {/* Feature desc callout */}
            {story?.featureDesc && (
              <p style={{
                fontFamily: 'var(--font-sans)', fontSize: '0.875rem',
                lineHeight: 1.7, color: 'var(--ink-3, #8A7A66)',
                borderLeft: '2px solid var(--saffron-500, #D2571B)',
                paddingLeft: 16, margin: 0,
              }}>
                {story.featureDesc}
              </p>
            )}

            <div style={{ borderTop: '1px solid var(--hairline, rgba(11,8,6,0.12))' }} />

            {/* Price + Add to cart */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
              <div style={{
                fontFamily: 'var(--font-serif, Fraunces, serif)',
                fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
                fontWeight: 300, color: 'var(--ink-0, #0B0806)',
                letterSpacing: '-0.01em',
              }}>
                {fmt(item.price)}
              </div>
              <button
                type="button"
                onClick={handleAddToCart}
                style={{
                  background: addedFeedback ? 'var(--moss-500, #6B855A)' : 'var(--ink-0, #0B0806)',
                  color: 'var(--paper-0, #FAF6EF)',
                  border: 0, padding: '14px 32px',
                  fontFamily: 'var(--font-mark, Syncopate, sans-serif)',
                  fontSize: '0.5625rem', letterSpacing: '0.18em',
                  textTransform: 'uppercase', fontWeight: 700, cursor: 'pointer',
                  transition: 'background 0.3s, transform 0.2s',
                  minWidth: 160,
                }}
                onMouseEnter={(e) => {
                  if (!addedFeedback) (e.currentTarget as HTMLElement).style.filter = 'brightness(1.15)';
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.filter = '';
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                }}
              >
                {addedFeedback ? '✓ Added to Basket' : 'Add to Basket →'}
              </button>
            </div>

            {/* Trust badges */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
              {['100% Pure', 'Lab Tested', 'Free Shipping ₹999+', 'Cash on Delivery'].map((badge) => (
                <div key={badge} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ color: 'var(--moss-500, #6B855A)', fontSize: 11, fontWeight: 700 }}>✓</span>
                  <span style={{
                    fontFamily: 'var(--font-sans)', fontSize: '0.75rem',
                    color: 'var(--ink-2, #4A3E31)',
                  }}>{badge}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── REVIEWS SECTION ── */}
        <div style={{
          borderTop: '1px solid var(--hairline, rgba(11,8,6,0.12))',
          padding: 'clamp(24px, 4vw, 48px)',
          background: 'var(--paper-0, #FAF6EF)',
        }}>
          {/* Reviews section header */}
          <div style={{ marginBottom: 32 }}>
            <div style={{
              fontFamily: 'var(--font-mark, Syncopate, sans-serif)',
              fontSize: '0.5625rem', letterSpacing: '0.28em',
              textTransform: 'uppercase', color: 'var(--ink-3, #8A7A66)',
              marginBottom: 10,
            }}>
              Customer Reviews · {allReviews.length} {allReviews.length === 1 ? 'Review' : 'Reviews'}
            </div>
            <h2 style={{
              fontFamily: 'var(--font-serif, Fraunces, serif)',
              fontSize: 'clamp(1.25rem, 2.4vw, 1.875rem)',
              fontWeight: 400, color: 'var(--ink-0, #0B0806)', margin: 0,
            }}>
              What our customers say
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 32,
            alignItems: 'start',
          }}>
            {/* Reviews list */}
            <div>
              {allReviews.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {allReviews.map((review, i) => (
                    <div key={i} style={{
                      border: '1px solid var(--hairline, rgba(11,8,6,0.12))',
                      padding: '20px 24px',
                      background: 'var(--paper-0, #FAF6EF)',
                      transition: 'box-shadow 0.2s',
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                        <div aria-label={`${review.rating} stars`}>
                          {[1, 2, 3, 4, 5].map((s) => (
                            <span key={s} aria-hidden style={{
                              color: s <= review.rating ? 'var(--saffron-500, #D2571B)' : 'var(--paper-3, #E0D3BC)',
                              fontSize: 14,
                            }}>★</span>
                          ))}
                        </div>
                        {review.verified && (
                          <span style={{
                            fontFamily: 'var(--font-mark)', fontSize: '0.5rem',
                            letterSpacing: '0.14em', textTransform: 'uppercase',
                            color: 'var(--moss-500, #6B855A)',
                          }}>✓ Verified Purchase</span>
                        )}
                      </div>
                      <blockquote style={{
                        fontFamily: 'var(--font-serif, Fraunces, serif)',
                        fontStyle: 'italic', fontSize: '0.9375rem',
                        lineHeight: 1.65, color: 'var(--ink-1, #1F1811)',
                        margin: '0 0 14px',
                      }}>
                        "{review.comment}"
                      </blockquote>
                      <div style={{
                        display: 'flex', justifyContent: 'space-between',
                        alignItems: 'baseline',
                        borderTop: '1px solid var(--hairline, rgba(11,8,6,0.08))',
                        paddingTop: 10,
                      }}>
                        <strong style={{
                          fontFamily: 'var(--font-sans)', fontSize: '0.8125rem',
                          fontWeight: 700, color: 'var(--ink-0)',
                        }}>{review.name}</strong>
                        <span style={{
                          fontFamily: 'var(--font-mark)', fontSize: '0.5rem',
                          letterSpacing: '0.14em', textTransform: 'uppercase',
                          color: 'var(--ink-3)',
                        }}>{review.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{
                  padding: '40px 0', textAlign: 'center',
                  border: '1px dashed var(--hairline, rgba(11,8,6,0.12))',
                }}>
                  <p style={{
                    fontFamily: 'var(--font-serif, Fraunces, serif)',
                    fontStyle: 'italic', fontSize: '1rem',
                    color: 'var(--ink-3, #8A7A66)', margin: 0,
                  }}>
                    No reviews yet. Be the first to share your thoughts!
                  </p>
                </div>
              )}
            </div>

            {/* Leave a review form */}
            <div style={{
              background: 'var(--paper-1, #F4EDE2)',
              border: '1px solid var(--hairline, rgba(11,8,6,0.12))',
              padding: 'clamp(20px, 3vw, 32px)',
            }}>
              <div style={{
                fontFamily: 'var(--font-mark, Syncopate, sans-serif)',
                fontSize: '0.5625rem', letterSpacing: '0.28em',
                textTransform: 'uppercase', color: 'var(--ink-3, #8A7A66)',
                marginBottom: 20,
              }}>
                Leave a Review
              </div>

              {submitted ? (
                <div style={{ textAlign: 'center', padding: '24px 0' }}>
                  <div style={{
                    fontFamily: 'var(--font-serif, Fraunces, serif)',
                    fontSize: '1.125rem', color: 'var(--moss-500, #6B855A)',
                    marginBottom: 8,
                  }}>✓ Thank you!</div>
                  <p style={{
                    fontFamily: 'var(--font-sans)', fontSize: '0.875rem',
                    color: 'var(--ink-3)', margin: 0,
                  }}>Your review has been submitted.</p>
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {/* Name */}
                  <div>
                    <label style={{
                      display: 'block', marginBottom: 6,
                      fontFamily: 'var(--font-mark, Syncopate, sans-serif)',
                      fontSize: '0.5rem', letterSpacing: '0.18em',
                      textTransform: 'uppercase', color: 'var(--ink-2, #4A3E31)',
                    }}>Your Name *</label>
                    <input
                      type="text"
                      value={reviewName}
                      onChange={(e) => setReviewName(e.target.value)}
                      placeholder="e.g. Priya K."
                      required
                      style={{
                        width: '100%',
                        border: '1px solid var(--hairline-strong, rgba(11,8,6,0.22))',
                        background: 'var(--paper-0, #FAF6EF)',
                        padding: '10px 14px',
                        fontFamily: 'var(--font-sans)', fontSize: '0.875rem',
                        color: 'var(--ink-0)', outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  {/* Rating */}
                  <div>
                    <label style={{
                      display: 'block', marginBottom: 8,
                      fontFamily: 'var(--font-mark, Syncopate, sans-serif)',
                      fontSize: '0.5rem', letterSpacing: '0.18em',
                      textTransform: 'uppercase', color: 'var(--ink-2, #4A3E31)',
                    }}>Your Rating *</label>
                    <div style={{ display: 'flex', gap: 2 }} role="group" aria-label="Rating">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          type="button"
                          aria-label={`${s} star${s !== 1 ? 's' : ''}`}
                          onClick={() => setReviewRating(s)}
                          style={{
                            background: 'none', border: 'none', cursor: 'pointer',
                            padding: '0 3px', fontSize: 28,
                            color: s <= reviewRating ? 'var(--saffron-500, #D2571B)' : 'var(--paper-3, #E0D3BC)',
                            transition: 'color 0.15s, transform 0.15s',
                            lineHeight: 1,
                          }}
                          onMouseEnter={(e) => {
                            (e.currentTarget as HTMLElement).style.transform = 'scale(1.2)';
                          }}
                          onMouseLeave={(e) => {
                            (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
                          }}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Comment */}
                  <div>
                    <label style={{
                      display: 'block', marginBottom: 6,
                      fontFamily: 'var(--font-mark, Syncopate, sans-serif)',
                      fontSize: '0.5rem', letterSpacing: '0.18em',
                      textTransform: 'uppercase', color: 'var(--ink-2, #4A3E31)',
                    }}>Your Review *</label>
                    <textarea
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Share your honest experience with this product…"
                      required
                      rows={4}
                      style={{
                        width: '100%',
                        border: '1px solid var(--hairline-strong, rgba(11,8,6,0.22))',
                        background: 'var(--paper-0, #FAF6EF)',
                        padding: '10px 14px',
                        fontFamily: 'var(--font-sans)', fontSize: '0.875rem',
                        color: 'var(--ink-0)', outline: 'none',
                        resize: 'vertical', boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    style={{
                      background: 'var(--saffron-500, #D2571B)', color: '#fff',
                      border: 'none', padding: '13px 28px',
                      fontFamily: 'var(--font-mark, Syncopate, sans-serif)',
                      fontSize: '0.5625rem', letterSpacing: '0.18em',
                      textTransform: 'uppercase', fontWeight: 700, cursor: 'pointer',
                      transition: 'background 0.2s',
                      alignSelf: 'flex-start',
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--saffron-400, #E67336)'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--saffron-500, #D2571B)'; }}
                  >
                    Submit Review →
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
