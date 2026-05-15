// ─── Types ────────────────────────────────────────────────────────────────────

export type Category =
  | 'All'
  | 'About Our Products'
  | 'Ordering & Payments'
  | 'Shipping'
  | 'Returns';

export interface FaqItem {
  id: string;
  category: Exclude<Category, 'All'>;
  question: string;
  answer: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

export const FAQS: FaqItem[] = [
  // About Our Products
  {
    id: 'faq-01',
    category: 'About Our Products',
    question: 'Is your saffron genuinely from Kashmir?',
    answer:
      'Yes. All our saffron is sourced exclusively from Pampore, Jammu & Kashmir — the world\'s most celebrated saffron-growing region. We work directly with farming families and can trace every batch to its source. We do not mix or blend with Iranian or Spanish saffron.',
  },
  {
    id: 'faq-02',
    category: 'About Our Products',
    question: 'What\'s the difference between Kashmiri and Iranian saffron?',
    answer:
      'Kashmiri saffron (ISO Grade 1) is considered the world\'s finest. It has a deeper crimson colour, a stronger aroma, and higher safranal content than Iranian (Persian) saffron. Iranian saffron is more commonly available and significantly cheaper — which is why many brands sell it as \'Kashmiri\' saffron. Ours is verified genuine.',
  },
  {
    id: 'faq-03',
    category: 'About Our Products',
    question: 'How do I know if my shilajit is pure?',
    answer:
      'Pure shilajit dissolves cleanly in warm water, turning it a golden-brown colour with no residue. It should have an earthy, slightly bitter taste and a tar-like consistency at room temperature that becomes fluid when warmed. Our shilajit passes strict purity tests before packaging.',
  },
  {
    id: 'faq-04',
    category: 'About Our Products',
    question: 'Are your products lab-tested?',
    answer:
      'Yes. We conduct batch-level quality testing for our saffron (ISO 3632 standard), shilajit (fulvic acid content, heavy metals), and honey (pollen analysis, moisture content). We are working toward publishing test certificates on our website.',
  },
  // Ordering & Payments
  {
    id: 'faq-05',
    category: 'Ordering & Payments',
    question: 'Do you offer Cash on Delivery (COD)?',
    answer:
      'Yes, we offer COD across most pin codes in India. COD orders may take 1-2 additional days to process. A small COD handling charge may apply.',
  },
  {
    id: 'faq-06',
    category: 'Ordering & Payments',
    question: 'What payment methods do you accept?',
    answer:
      'We accept all major UPI apps (GPay, PhonePe, Paytm), credit/debit cards, net banking, and Cash on Delivery.',
  },
  {
    id: 'faq-07',
    category: 'Ordering & Payments',
    question: 'Can I modify or cancel my order after placing it?',
    answer:
      'Orders can be modified or cancelled within 2 hours of placement. After that, the order enters processing and cannot be changed. Contact us immediately at admin@moonnaturallyyours.com or +91-6005099213 if you need to make changes.',
  },
  // Shipping
  {
    id: 'faq-08',
    category: 'Shipping',
    question: 'How long does delivery take?',
    answer:
      'We ship within 1-2 business days of order confirmation. Standard delivery takes 4-7 business days across India. Express delivery (2-3 days) is available for select pin codes.',
  },
  {
    id: 'faq-09',
    category: 'Shipping',
    question: 'Do you ship internationally?',
    answer:
      'We currently ship within India only. International shipping is coming soon — join our newsletter to be notified.',
  },
  {
    id: 'faq-10',
    category: 'Shipping',
    question: 'How is saffron packaged to maintain quality?',
    answer:
      'Saffron is sealed in double-layered, airtight glass vials and placed in protective cardboard packaging. Every package is labelled with batch number and harvest date.',
  },
  // Returns
  {
    id: 'faq-11',
    category: 'Returns',
    question: 'What is your return policy?',
    answer:
      'We accept returns within 7 days of delivery if the product is unopened and in its original packaging. For quality concerns with opened products, contact us with a photo and we will resolve it — replacement or refund.',
  },
  {
    id: 'faq-12',
    category: 'Returns',
    question: 'How should I store saffron?',
    answer:
      'Store saffron in an airtight container (glass preferred) away from light, heat, and moisture. A kitchen cabinet away from the stove works well. Properly stored, our saffron maintains its quality for 2+ years.',
  },
  {
    id: 'faq-13',
    category: 'Returns',
    question: 'How should I store shilajit?',
    answer:
      'Store at room temperature, away from direct sunlight. Shilajit is stable and does not require refrigeration. Avoid contact with metal spoons — use a wooden or plastic spoon to scoop.',
  },
  {
    id: 'faq-14',
    category: 'Returns',
    question: 'Is the honey raw? Does it crystallize?',
    answer:
      'Yes, our honey is completely raw and unfiltered. Raw honey crystallizes naturally over time — this is a sign of purity, not spoilage. To return it to liquid form, gently warm the jar in warm water (never boil or microwave).',
  },
  {
    id: 'faq-15',
    category: 'Returns',
    question: 'Can I get a bulk discount for gifting or business?',
    answer:
      'Yes, we offer special pricing for bulk orders (10+ units). Email us at admin@moonnaturallyyours.com with your requirements.',
  },
];
