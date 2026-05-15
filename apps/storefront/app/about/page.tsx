import type { Metadata } from 'next';

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'MOON Naturally Yours',
  description: 'Premium single-origin Kashmiri wellness products — saffron, shilajit, honey, dry fruits and ghee, sourced directly from farmers in the Kashmir Valley.',
  url: 'https://www.moonnaturallyyours.com',
  email: 'hello@moonnaturallyyours.com',
  telephone: '+91-6005099213',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Kanispora',
    addressLocality: 'Baramulla',
    addressRegion: 'Jammu & Kashmir',
    postalCode: '193101',
    addressCountry: 'IN',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 34.1979,
    longitude: 74.3411,
  },
  sameAs: [
    'https://www.instagram.com/moonnaturallyyours/',
    'https://x.com/moonnaturallyyours',
    'https://www.youtube.com/@moonnaturallyyours',
  ],
};

export const metadata: Metadata = {
  title: "About Us | MOON Naturally Yours — Kashmir's Finest Natural Products",
  description:
    'Discover the story behind MOON Naturally Yours. We source the finest Kashmiri saffron, shilajit, honey, and dry fruits directly from trusted farmers in the Kashmir Valley.',
  keywords:
    'about MOON naturally yours, Kashmiri natural products brand, Kashmir saffron brand, authentic Kashmir products',
  openGraph: {
    title: 'About MOON Naturally Yours',
    description: 'From the valleys of Kashmir to your table — discover our story.',
    url: 'https://www.moonnaturallyyours.com/about',
  },
  alternates: { canonical: 'https://www.moonnaturallyyours.com/about' },
};

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema).replace(/</g, '\\u003c') }}
      />
      <main style={{ fontFamily: "'Manrope', ui-sans-serif, system-ui, sans-serif" }}>

      {/* ── Section 1: Hero ─────────────────────────────────────────── */}
      <section
        style={{
          backgroundColor: '#0B0806',
          minHeight: '60vh',
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
            fontFamily: "'Fraunces', 'Cormorant Garamond', Georgia, serif",
            fontSize: 'clamp(48px, 8vw, 72px)',
            fontWeight: 300,
            lineHeight: 1.02,
            letterSpacing: '-0.02em',
            color: '#FAF6EF',
            margin: '0 0 28px 0',
          }}
        >
          Our Story
        </h1>
        <p
          style={{
            fontFamily: "'Fraunces', Georgia, serif",
            fontStyle: 'italic',
            fontSize: 'clamp(18px, 2.5vw, 24px)',
            fontWeight: 300,
            color: '#C58A1E',
            letterSpacing: '-0.01em',
            maxWidth: '560px',
            lineHeight: 1.4,
            margin: 0,
          }}
        >
          From the valleys of Kashmir, naturally yours.
        </p>
      </section>

      {/* ── Section 2: Brand Story ───────────────────────────────────── */}
      <section
        style={{
          backgroundColor: '#FAF6EF',
          padding: '80px 24px',
        }}
      >
        <div
          style={{
            maxWidth: '1120px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '56px',
            alignItems: 'start',
          }}
        >
          {/* Left: Story text */}
          <div>
            <p
              style={{
                fontFamily: "'Manrope', sans-serif",
                fontSize: '0.6875rem',
                letterSpacing: '0.28em',
                textTransform: 'uppercase',
                color: '#D2571B',
                marginBottom: '20px',
              }}
            >
              The Beginning
            </p>
            <h2
              style={{
                fontFamily: "'Fraunces', Georgia, serif",
                fontSize: 'clamp(28px, 4vw, 40px)',
                fontWeight: 300,
                lineHeight: 1.12,
                letterSpacing: '-0.01em',
                color: '#0B0806',
                margin: '0 0 32px 0',
              }}
            >
              A belief that nature's finest gifts deserve no shortcuts.
            </h2>
            {[
              'MOON was born from a simple belief: nature\'s finest gifts deserve no shortcuts. Nestled in the Kashmir Valley, where the Himalayan air is crisp and the soil is ancient, we work directly with families who have tended these harvests for generations.',
              'Every jar of saffron, every gram of shilajit, every bottle of raw honey carries the fingerprint of a specific mountain, a specific season, a specific family. We do not blend or bulk-buy. We trace every batch back to its origin.',
              'Our founder, raised in Baramulla, grew up watching elders use saffron not as a luxury but as a medicine — a pinch in warm milk for fever, a strand dissolved in water for eyes. That reverence for the ancient wisdom of the valley is what drives every product decision at MOON.',
              'We are not a supplement company. We are storytellers of the land. We exist to bring you the Kashmir that tourists rarely see: the pre-dawn saffron fields of Pampore, the high-altitude shilajit rocks of the Himalayas, the deodar-forested beehives of Pahalgam.',
            ].map((para, i) => (
              <p
                key={i}
                style={{
                  fontFamily: "'Manrope', sans-serif",
                  fontSize: '1rem',
                  lineHeight: 1.75,
                  color: '#4A3E31',
                  marginBottom: '20px',
                  letterSpacing: '0',
                }}
              >
                {para}
              </p>
            ))}
          </div>

          {/* Right: Decorative quote */}
          <div style={{ position: 'sticky', top: '80px' }}>
            <div
              style={{
                backgroundColor: '#1A140F',
                borderLeft: '3px solid #C58A1E',
                padding: '48px 40px',
                borderRadius: '2px',
              }}
            >
              <blockquote
                style={{
                  fontFamily: "'Fraunces', Georgia, serif",
                  fontStyle: 'italic',
                  fontSize: 'clamp(22px, 3vw, 32px)',
                  fontWeight: 300,
                  lineHeight: 1.4,
                  letterSpacing: '-0.01em',
                  color: '#FAF6EF',
                  margin: '0 0 24px 0',
                }}
              >
                "We do not sell products. We carry forward a legacy."
              </blockquote>
              <p
                style={{
                  fontFamily: "'Manrope', sans-serif",
                  fontSize: '0.75rem',
                  letterSpacing: '0.28em',
                  textTransform: 'uppercase',
                  color: '#C58A1E',
                  margin: 0,
                }}
              >
                — MOON Naturally Yours
              </p>
            </div>

            {/* Decorative origin stamp */}
            <div
              style={{
                marginTop: '32px',
                border: '1px solid rgba(11,8,6,0.12)',
                borderRadius: '2px',
                padding: '24px 32px',
                backgroundColor: '#FFFFFF',
              }}
            >
              <p
                style={{
                  fontFamily: "'Manrope', sans-serif",
                  fontSize: '0.6875rem',
                  letterSpacing: '0.28em',
                  textTransform: 'uppercase',
                  color: '#8A7A66',
                  margin: '0 0 8px 0',
                }}
              >
                Origin
              </p>
              <p
                style={{
                  fontFamily: "'Fraunces', Georgia, serif",
                  fontSize: '1.125rem',
                  fontWeight: 300,
                  color: '#0B0806',
                  margin: '0 0 4px 0',
                  lineHeight: 1.4,
                }}
              >
                Kashmir Valley, India
              </p>
              <p
                style={{
                  fontFamily: "'Manrope', sans-serif",
                  fontSize: '0.875rem',
                  color: '#8A7A66',
                  margin: 0,
                  lineHeight: 1.6,
                }}
              >
                Baramulla · Pampore · Pahalgam · Himalayan High Altitudes
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 3: Values ────────────────────────────────────────── */}
      <section
        style={{
          backgroundColor: '#F4EDE2',
          padding: '80px 24px',
        }}
      >
        <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <p
              style={{
                fontFamily: "'Manrope', sans-serif",
                fontSize: '0.6875rem',
                letterSpacing: '0.28em',
                textTransform: 'uppercase',
                color: '#D2571B',
                marginBottom: '16px',
              }}
            >
              Our Principles
            </p>
            <h2
              style={{
                fontFamily: "'Fraunces', Georgia, serif",
                fontSize: 'clamp(28px, 4vw, 40px)',
                fontWeight: 300,
                lineHeight: 1.12,
                letterSpacing: '-0.01em',
                color: '#0B0806',
                margin: 0,
              }}
            >
              What We Stand For
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '24px',
            }}
          >
            {[
              {
                number: '01',
                title: 'Radical Transparency',
                body: 'Every product is traceable to its origin. We share harvest dates, sourcing regions, and batch details openly. If we cannot show you where it came from, we will not sell it.',
              },
              {
                number: '02',
                title: 'Zero Compromise on Quality',
                body: 'We reject batches that do not meet our standards. We would rather go out of stock than ship something we would not give our own family. Quality is not a promise — it is our only option.',
              },
              {
                number: '03',
                title: 'Community First',
                body: 'Fair prices for our farmers, always. We believe prosperity in the valley is inseparable from ours. Every purchase supports the families whose hands do the real work.',
              },
            ].map((card) => (
              <div
                key={card.number}
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid rgba(11,8,6,0.08)',
                  borderRadius: '2px',
                  padding: '40px 32px',
                  boxShadow: '0 4px 14px rgba(42,27,16,0.06)',
                }}
              >
                <p
                  style={{
                    fontFamily: "'Fraunces', Georgia, serif",
                    fontStyle: 'italic',
                    fontSize: '3rem',
                    fontWeight: 300,
                    color: 'rgba(197,138,30,0.25)',
                    lineHeight: 1,
                    margin: '0 0 20px 0',
                  }}
                >
                  {card.number}
                </p>
                <h3
                  style={{
                    fontFamily: "'Fraunces', Georgia, serif",
                    fontSize: '1.25rem',
                    fontWeight: 400,
                    lineHeight: 1.2,
                    letterSpacing: '-0.01em',
                    color: '#0B0806',
                    margin: '0 0 16px 0',
                  }}
                >
                  {card.title}
                </h3>
                <p
                  style={{
                    fontFamily: "'Manrope', sans-serif",
                    fontSize: '0.9375rem',
                    lineHeight: 1.7,
                    color: '#4A3E31',
                    margin: 0,
                  }}
                >
                  {card.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 4: Products at a Glance ─────────────────────────── */}
      <section
        style={{
          backgroundColor: '#FAF6EF',
          padding: '80px 24px',
        }}
      >
        <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <p
              style={{
                fontFamily: "'Manrope', sans-serif",
                fontSize: '0.6875rem',
                letterSpacing: '0.28em',
                textTransform: 'uppercase',
                color: '#D2571B',
                marginBottom: '16px',
              }}
            >
              What We Carry
            </p>
            <h2
              style={{
                fontFamily: "'Fraunces', Georgia, serif",
                fontSize: 'clamp(28px, 4vw, 40px)',
                fontWeight: 300,
                lineHeight: 1.12,
                letterSpacing: '-0.01em',
                color: '#0B0806',
                margin: 0,
              }}
            >
              Our Products at a Glance
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '24px',
            }}
          >
            {[
              {
                initials: 'KS',
                color: '#D2571B',
                title: 'Kashmiri Saffron',
                desc: 'Single-origin Mongra saffron from Pampore, hand-harvested and lab-tested for purity.',
              },
              {
                initials: 'SH',
                color: '#5A3921',
                title: 'Shilajit',
                desc: 'Himalayan resin sourced from high-altitude rock faces, purified using traditional methods.',
              },
              {
                initials: 'RH',
                color: '#C58A1E',
                title: 'Raw Honey',
                desc: 'Cold-extracted mountain honey from deodar-forested beehives in Pahalgam, never heated.',
              },
              {
                initials: 'DN',
                color: '#6B855A',
                title: 'Dry Fruits & Nuts',
                desc: 'Kashmiri almonds, walnuts, and apricots — sun-dried and free of preservatives.',
              },
              {
                initials: 'GH',
                color: '#8A7A66',
                title: 'Kashmiri Ghee',
                desc: 'Bilona-method desi ghee made from the milk of local cows, slow-churned in small batches.',
              },
            ].map((product) => (
              <div
                key={product.initials}
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid rgba(11,8,6,0.08)',
                  borderRadius: '2px',
                  padding: '32px 24px',
                  textAlign: 'center',
                  boxShadow: '0 1px 2px rgba(42,27,16,0.06)',
                }}
              >
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    backgroundColor: product.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 20px auto',
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Fraunces', Georgia, serif",
                      fontStyle: 'italic',
                      fontSize: '1rem',
                      color: '#FAF6EF',
                      fontWeight: 300,
                    }}
                  >
                    {product.initials}
                  </span>
                </div>
                <h3
                  style={{
                    fontFamily: "'Fraunces', Georgia, serif",
                    fontSize: '1.125rem',
                    fontWeight: 400,
                    lineHeight: 1.2,
                    color: '#0B0806',
                    margin: '0 0 12px 0',
                    letterSpacing: '-0.01em',
                  }}
                >
                  {product.title}
                </h3>
                <p
                  style={{
                    fontFamily: "'Manrope', sans-serif",
                    fontSize: '0.875rem',
                    lineHeight: 1.6,
                    color: '#4A3E31',
                    margin: 0,
                  }}
                >
                  {product.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 5: Location / From the Valley ───────────────────── */}
      <section
        style={{
          backgroundColor: '#0B0806',
          padding: '80px 24px',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
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
            Our Home
          </p>
          <h2
            style={{
              fontFamily: "'Fraunces', Georgia, serif",
              fontSize: 'clamp(22px, 3.5vw, 32px)',
              fontWeight: 300,
              lineHeight: 1.12,
              letterSpacing: '-0.01em',
              color: '#FAF6EF',
              margin: '0 0 16px 0',
            }}
          >
            Kanispora, Baramulla,
            <br />
            Jammu & Kashmir — 193101
          </h2>
          <p
            style={{
              fontFamily: "'Manrope', sans-serif",
              fontSize: '1rem',
              lineHeight: 1.75,
              color: 'rgba(250,246,239,0.6)',
              margin: '0 0 40px 0',
            }}
          >
            Baramulla sits at the gateway of the Kashmir Valley, where the Jhelum flows through
            ancient orchards and fields that have fed generations. This is where MOON began — and
            where every sourcing decision is made, by people who know this land intimately.
          </p>
          <a
            href="/#rituals"
            style={{
              display: 'inline-block',
              backgroundColor: '#C58A1E',
              color: '#0B0806',
              fontFamily: "'Manrope', sans-serif",
              fontSize: '0.875rem',
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              padding: '16px 40px',
              borderRadius: '2px',
              transition: 'background-color 280ms cubic-bezier(0.22, 1, 0.36, 1)',
            }}
          >
            Shop Our Products
          </a>
        </div>
      </section>
    </main>
    </>
  );
}
