'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FAQS, type FaqItem, type Category } from '@/lib/data/faqs';

const CATEGORIES: Category[] = [
  'All',
  'About Our Products',
  'Ordering & Payments',
  'Shipping',
  'Returns',
];

// ─── Accordion Item ───────────────────────────────────────────────────────────

function AccordionItem({
  faq,
  isOpen,
  onToggle,
}: {
  faq: FaqItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      style={{
        borderBottom: '1px solid rgba(11, 8, 6, 0.1)',
      }}
    >
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          padding: '22px 0',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        <span
          style={{
            fontFamily: "'Fraunces', Georgia, serif",
            fontSize: '1.0625rem',
            fontWeight: 400,
            lineHeight: 1.35,
            letterSpacing: '-0.01em',
            color: '#0B0806',
            flex: 1,
          }}
        >
          {faq.question}
        </span>
        <span
          aria-hidden="true"
          style={{
            flexShrink: 0,
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            border: '1.5px solid #C58A1E',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#C58A1E',
            fontFamily: "'Manrope', sans-serif",
            fontSize: '1.25rem',
            lineHeight: 1,
            fontWeight: 300,
            transition: 'transform 220ms ease',
            transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
          }}
        >
          +
        </span>
      </button>

      {/* Answer — show/hide with max-height transition */}
      <div
        style={{
          overflow: 'hidden',
          maxHeight: isOpen ? '600px' : '0',
          transition: 'max-height 320ms cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <p
          style={{
            fontFamily: "'Manrope', sans-serif",
            fontSize: '0.9375rem',
            lineHeight: 1.75,
            color: '#4A3E31',
            margin: '0 0 24px 0',
            paddingRight: '44px',
          }}
        >
          {faq.answer}
        </p>
      </div>
    </div>
  );
}

// ─── Main Client Component ────────────────────────────────────────────────────

export function FaqsClient() {
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());

  const filtered =
    activeCategory === 'All'
      ? FAQS
      : FAQS.filter((f) => f.category === activeCategory);

  function toggleFaq(id: string) {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  return (
    <main style={{ fontFamily: "'Manrope', sans-serif" }}>

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section
        style={{
          backgroundColor: '#0B0806',
          minHeight: '50vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '80px 24px',
        }}
      >
        <p
          style={{
            fontFamily: "'Manrope', sans-serif",
            fontSize: '0.6875rem',
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: '#C58A1E',
            marginBottom: '24px',
            opacity: 0.8,
          }}
        >
          MOON Naturally Yours
        </p>
        <h1
          style={{
            fontFamily: "'Fraunces', Georgia, serif",
            fontSize: 'clamp(36px, 7vw, 56px)',
            fontWeight: 300,
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
            color: '#FAF6EF',
            margin: '0 0 24px 0',
          }}
        >
          Frequently Asked Questions
        </h1>
        <p
          style={{
            fontFamily: "'Fraunces', Georgia, serif",
            fontStyle: 'italic',
            fontSize: 'clamp(17px, 2.2vw, 22px)',
            fontWeight: 300,
            color: '#C58A1E',
            letterSpacing: '-0.01em',
            maxWidth: '480px',
            lineHeight: 1.45,
            margin: 0,
          }}
        >
          Everything you need to know — and more.
        </p>
      </section>

      {/* ── Category Tabs ─────────────────────────────────────────────── */}
      <section
        style={{
          backgroundColor: '#F4EDE2',
          padding: '32px 24px',
          borderBottom: '1px solid rgba(11, 8, 6, 0.08)',
        }}
      >
        <div
          style={{
            maxWidth: '800px',
            margin: '0 auto',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px',
            justifyContent: 'center',
          }}
        >
          {CATEGORIES.map((cat) => {
            const isActive = cat === activeCategory;
            return (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setOpenIds(new Set());
                }}
                style={{
                  fontFamily: "'Manrope', sans-serif",
                  fontSize: '0.8125rem',
                  fontWeight: isActive ? 700 : 500,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  padding: '9px 20px',
                  borderRadius: '2px',
                  border: isActive
                    ? '1.5px solid #C58A1E'
                    : '1.5px solid rgba(11, 8, 6, 0.2)',
                  backgroundColor: isActive ? '#C58A1E' : 'transparent',
                  color: isActive ? '#0B0806' : '#4A3E31',
                  cursor: 'pointer',
                  transition: 'all 200ms ease',
                  whiteSpace: 'nowrap',
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </section>

      {/* ── FAQ Accordion ─────────────────────────────────────────────── */}
      <section
        style={{
          backgroundColor: '#FAF6EF',
          padding: '56px 24px 72px',
        }}
      >
        <div
          style={{
            maxWidth: '800px',
            margin: '0 auto',
          }}
        >
          {filtered.length === 0 ? (
            <p
              style={{
                textAlign: 'center',
                color: '#8A7A66',
                fontFamily: "'Manrope', sans-serif",
                fontSize: '1rem',
                padding: '40px 0',
              }}
            >
              No questions found in this category.
            </p>
          ) : (
            filtered.map((faq) => (
              <AccordionItem
                key={faq.id}
                faq={faq}
                isOpen={openIds.has(faq.id)}
                onToggle={() => toggleFaq(faq.id)}
              />
            ))
          )}
        </div>
      </section>

      {/* ── Still Have Questions CTA ──────────────────────────────────── */}
      <section
        style={{
          backgroundColor: '#0B0806',
          padding: '80px 24px',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: '560px', margin: '0 auto' }}>
          <p
            style={{
              fontFamily: "'Manrope', sans-serif",
              fontSize: '0.6875rem',
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              color: '#C58A1E',
              marginBottom: '20px',
              opacity: 0.8,
            }}
          >
            We're Here For You
          </p>
          <h2
            style={{
              fontFamily: "'Fraunces', Georgia, serif",
              fontSize: 'clamp(26px, 4vw, 38px)',
              fontWeight: 300,
              lineHeight: 1.12,
              letterSpacing: '-0.02em',
              color: '#FAF6EF',
              margin: '0 0 16px 0',
            }}
          >
            Still have questions?
          </h2>
          <p
            style={{
              fontFamily: "'Manrope', sans-serif",
              fontSize: '0.9375rem',
              lineHeight: 1.7,
              color: 'rgba(250, 246, 239, 0.6)',
              margin: '0 0 40px 0',
            }}
          >
            Our team is based in Kashmir and responds within a few hours.
            Reach us on email or WhatsApp.
          </p>

          <div
            style={{
              display: 'flex',
              gap: '16px',
              justifyContent: 'center',
              flexWrap: 'wrap',
              marginBottom: '32px',
            }}
          >
            {/* Email Us */}
            <a
              href="mailto:admin@moonnaturallyyours.com"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontFamily: "'Manrope', sans-serif",
                fontSize: '0.875rem',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                padding: '14px 32px',
                borderRadius: '2px',
                border: '1.5px solid #C58A1E',
                backgroundColor: 'transparent',
                color: '#C58A1E',
                transition: 'all 220ms ease',
              }}
            >
              Email Us
            </a>

            {/* WhatsApp Us */}
            <a
              href="https://wa.me/916005099213"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontFamily: "'Manrope', sans-serif",
                fontSize: '0.875rem',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                padding: '14px 32px',
                borderRadius: '2px',
                border: '1.5px solid rgba(250, 246, 239, 0.3)',
                backgroundColor: 'transparent',
                color: '#FAF6EF',
                transition: 'all 220ms ease',
              }}
            >
              WhatsApp Us
            </a>
          </div>

          {/* Phone */}
          <p
            style={{
              fontFamily: "'Manrope', sans-serif",
              fontSize: '0.875rem',
              color: 'rgba(250, 246, 239, 0.45)',
              letterSpacing: '0.04em',
              margin: 0,
            }}
          >
            +91-6005099213
          </p>
        </div>
      </section>
    </main>
  );
}
