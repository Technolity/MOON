import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { journalPosts } from '@/lib/data/journal';

export async function generateStaticParams() {
  return journalPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = journalPosts.find((p) => p.slug === slug);
  if (!post) return {};
  return {
    title: `${post.title} | MOON Journal`,
    description: post.ogDescription || post.excerpt,
    keywords: post.keywords.join(', '),
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `https://www.moonnaturallyyours.com/journal/${slug}`,
    },
    alternates: {
      canonical: `https://www.moonnaturallyyours.com/journal/${slug}`,
    },
  };
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default async function JournalPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = journalPosts.find((p) => p.slug === slug);
  if (!post) notFound();

  const relatedPosts = journalPosts.filter((p) => p.slug !== slug).slice(0, 2);

  return (
    <main style={{ backgroundColor: '#FAF6EF', minHeight: '100vh' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: post.title,
            description: post.excerpt,
            datePublished: post.date,
            dateModified: post.date,
            author: {
              '@type': 'Organization',
              name: 'MOON Naturally Yours',
              url: 'https://www.moonnaturallyyours.com',
            },
            publisher: {
              '@type': 'Organization',
              name: 'MOON Naturally Yours',
              logo: {
                '@type': 'ImageObject',
                url: 'https://www.moonnaturallyyours.com/og/og-homepage.jpg',
              },
            },
            url: `https://www.moonnaturallyyours.com/journal/${post.slug}`,
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': `https://www.moonnaturallyyours.com/journal/${post.slug}`,
            },
            keywords: post.keywords.join(', '),
            articleSection: post.category,
          }).replace(/</g, '\\u003c'),
        }}
      />
      {/* Prose Styles */}
      <style>{`
        .moon-prose h2 {
          font-family: 'Fraunces', Georgia, serif;
          font-size: 26px;
          font-weight: 600;
          color: #0B0806;
          margin: 2.5rem 0 1rem;
          line-height: 1.3;
        }
        .moon-prose h3 {
          font-family: 'Fraunces', Georgia, serif;
          font-size: 20px;
          font-weight: 600;
          color: #1F1811;
          margin: 2rem 0 0.75rem;
          line-height: 1.3;
        }
        .moon-prose p {
          margin-bottom: 1.25rem;
          color: #1F1811;
        }
        .moon-prose strong {
          font-weight: 700;
          color: #1F1811;
        }
        .moon-prose em {
          font-style: italic;
          color: rgba(31,24,17,0.85);
        }
        .moon-prose ul {
          margin: 0 0 1.25rem 1.5rem;
          padding: 0;
          list-style-type: disc;
        }
        .moon-prose ol {
          margin: 0 0 1.25rem 1.5rem;
          padding: 0;
        }
        .moon-prose li {
          margin-bottom: 0.6rem;
          color: #1F1811;
          line-height: 1.7;
        }
        .moon-prose li strong {
          color: #0B0806;
        }
      `}</style>

      {/* Post Hero */}
      <section
        style={{
          backgroundColor: '#0B0806',
          padding: '80px 24px 72px',
          textAlign: 'center',
        }}
      >
        {/* Back link */}
        <Link
          href="/journal"
          style={{
            display: 'inline-block',
            fontFamily: "'Manrope', sans-serif",
            fontSize: '13px',
            color: 'rgba(194,151,56,0.7)',
            textDecoration: 'none',
            marginBottom: '32px',
            letterSpacing: '0.05em',
          }}
        >
          ← Back to Journal
        </Link>

        {/* Category badge */}
        <div style={{ marginBottom: '20px' }}>
          <span
            style={{
              display: 'inline-block',
              backgroundColor: 'rgba(197,138,30,0.18)',
              color: '#C58A1E',
              fontFamily: "'Manrope', sans-serif",
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              padding: '5px 14px',
              borderRadius: '3px',
            }}
          >
            {post.category}
          </span>
        </div>

        {/* Title */}
        <h1
          style={{
            fontFamily: "'Fraunces', Georgia, serif",
            fontSize: 'clamp(32px, 5vw, 48px)',
            fontWeight: 700,
            color: '#FAF6EF',
            margin: '0 auto 16px',
            maxWidth: '760px',
            lineHeight: 1.15,
          }}
        >
          {post.title}
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontFamily: "'Fraunces', Georgia, serif",
            fontSize: '18px',
            fontStyle: 'italic',
            color: 'rgba(194,151,56,0.8)',
            margin: '0 auto 28px',
            maxWidth: '600px',
            lineHeight: 1.5,
          }}
        >
          {post.subtitle}
        </p>

        {/* Meta */}
        <p
          style={{
            fontFamily: "'Manrope', sans-serif",
            fontSize: '13px',
            color: 'rgba(250,246,239,0.45)',
            letterSpacing: '0.04em',
          }}
        >
          {formatDate(post.date)} &middot; {post.readTime}
        </p>
      </section>

      {/* Article Body */}
      <section
        style={{
          maxWidth: '720px',
          margin: '0 auto',
          padding: '64px 24px 48px',
        }}
      >
        <div
          className="moon-prose"
          style={{
            fontFamily: "'Manrope', sans-serif",
            fontSize: '17px',
            lineHeight: 1.75,
            color: '#1F1811',
          }}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </section>

      {/* CTA */}
      <section
        style={{
          maxWidth: '720px',
          margin: '0 auto 80px',
          padding: '0 24px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            backgroundColor: '#F4EDE2',
            borderRadius: '8px',
            padding: '48px 40px',
            border: '1px solid rgba(197,138,30,0.2)',
          }}
        >
          <p
            style={{
              fontFamily: "'Fraunces', Georgia, serif",
              fontSize: '22px',
              fontWeight: 600,
              color: '#0B0806',
              margin: '0 0 10px',
            }}
          >
            Experience Kashmir's Finest
          </p>
          <p
            style={{
              fontFamily: "'Manrope', sans-serif",
              fontSize: '15px',
              color: 'rgba(31,24,17,0.6)',
              margin: '0 0 28px',
              lineHeight: 1.6,
            }}
          >
            Every product in the MOON range is sourced with the same care described in this article.
          </p>
          <Link
            href="/#rituals"
            style={{
              display: 'inline-block',
              backgroundColor: '#D2571B',
              color: '#FAF6EF',
              fontFamily: "'Manrope', sans-serif",
              fontSize: '14px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              padding: '14px 36px',
              borderRadius: '4px',
            }}
          >
            Shop our products →
          </Link>
        </div>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section
          style={{
            maxWidth: '1100px',
            margin: '0 auto',
            padding: '0 24px 100px',
          }}
        >
          <h2
            style={{
              fontFamily: "'Fraunces', Georgia, serif",
              fontSize: '28px',
              fontWeight: 600,
              color: '#0B0806',
              margin: '0 0 36px',
            }}
          >
            More from the Journal
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '28px',
            }}
          >
            {relatedPosts.map((related) => (
              <article
                key={related.slug}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '8px',
                  boxShadow: '0 2px 10px rgba(11,8,6,0.07)',
                  overflow: 'hidden',
                }}
              >
                <div style={{ height: '4px', backgroundColor: '#D2571B', opacity: 0.5 }} />
                <div style={{ padding: '24px' }}>
                  <span
                    style={{
                      display: 'inline-block',
                      backgroundColor: 'rgba(197,138,30,0.12)',
                      color: '#C58A1E',
                      fontFamily: "'Manrope', sans-serif",
                      fontSize: '10px',
                      fontWeight: 700,
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                      padding: '3px 9px',
                      borderRadius: '3px',
                      marginBottom: '12px',
                    }}
                  >
                    {related.category}
                  </span>
                  <h3
                    style={{
                      fontFamily: "'Fraunces', Georgia, serif",
                      fontSize: '18px',
                      fontWeight: 600,
                      color: '#0B0806',
                      margin: '0 0 8px',
                      lineHeight: 1.3,
                    }}
                  >
                    {related.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: "'Manrope', sans-serif",
                      fontSize: '13px',
                      color: 'rgba(31,24,17,0.6)',
                      margin: '0 0 16px',
                      lineHeight: 1.55,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    } as React.CSSProperties}
                  >
                    {related.excerpt}
                  </p>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingTop: '14px',
                      borderTop: '1px solid rgba(31,24,17,0.08)',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'Manrope', sans-serif",
                        fontSize: '11px',
                        color: 'rgba(31,24,17,0.4)',
                      }}
                    >
                      {related.readTime}
                    </span>
                    <Link
                      href={`/journal/${related.slug}`}
                      style={{
                        fontFamily: "'Manrope', sans-serif",
                        fontSize: '13px',
                        fontWeight: 600,
                        color: '#D2571B',
                        textDecoration: 'none',
                      }}
                    >
                      Read →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
