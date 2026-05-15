import type { Metadata } from 'next';
import { FaqsClient } from './FaqsClient';
import { FAQS } from '@/lib/data/faqs';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions | MOON Naturally Yours',
  description:
    'Got questions about our Kashmiri saffron, shilajit, honey, or dry fruits? Find answers about authenticity, shipping, returns, and more.',
  keywords:
    'MOON FAQ, Kashmiri saffron questions, shilajit FAQ, Kashmir products questions, natural products FAQ',
  openGraph: {
    title: 'FAQs | MOON Naturally Yours',
    description: 'Common questions about our products and brand.',
    url: 'https://www.moonnaturallyyours.com/faqs',
  },
  alternates: { canonical: 'https://www.moonnaturallyyours.com/faqs' },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.filter(f => f.category !== 'All').map(faq => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
};

export default function FaqsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, '\\u003c') }}
      />
      <FaqsClient />
    </>
  );
}
