import type { CatalogItem, ProductStory, ProductKey, ShippingZone } from '../types';

export const productStories: Record<ProductKey, ProductStory> = {
  shilajit: {
    key: 'shilajit',
    title: 'Mountain Strength.',
    subtitle: 'Pure Himalayan resin for daily stamina, clarity, and recovery.',
    theme: 'shilajit',
    color: '#7C4A2A',
    desc: 'Sourced from high-altitude Himalayan rocks and purified for potency. Our Shilajit is rich in fulvic acid and trace minerals.',
    price: '₹1,999',
    details: 'Gold Grade Resin<br>Third-party tested<br>Daily vitality support',
    featureName: 'Shilajit',
    featureDesc: 'The primary ritual product of MOON, built for consistent performance and focus.'
  },
  kashmiriSaffron: {
    key: 'kashmiriSaffron',
    title: 'Crimson Ritual.',
    subtitle: "Kashmiri Mongra threads with rich aroma and color.",
    theme: 'saffron',
    color: '#F25C2A',
    desc: "Hand-picked from Pampore and graded for deep red stigmas. Ideal for milk infusions, wellness blends, and culinary use.",
    price: '₹1,250',
    details: 'Mongra A++ Grade<br>Deep red stigmas<br>Hand sorted threads',
    featureName: 'Kashmiri Saffron',
    featureDesc: "Hand-selected Mongra threads from Pampore's autumn harvest."
  },
  kashmiriHoney: {
    key: 'kashmiriHoney',
    title: 'Liquid Gold.',
    subtitle: 'Raw Kashmiri honey — wild mountain harvested.',
    theme: 'honey',
    color: '#C8960A',
    desc: 'Pure raw honey harvested from high-altitude Kashmir meadows. Unfiltered, enzyme-rich, and deeply nourishing.',
    price: '₹1,150',
    details: 'Wild mountain sourced<br>Unfiltered & raw<br>Enzyme-rich purity',
    featureName: 'Kashmiri Honey',
    featureDesc: 'Liquid gold from the meadows of Kashmir — raw, wild, and deeply nourishing.'
  },
  iraniSaffron: {
    key: 'iraniSaffron',
    title: 'Persian Bloom.',
    subtitle: 'Irani Negin saffron for balanced flavor and vibrant infusion.',
    theme: 'honey',
    color: '#D8A03F',
    desc: 'Selected Negin saffron threads imported from Iran with strict aroma and color standards for consistent quality.',
    price: '₹1,050',
    details: 'Negin Grade<br>Strong color release<br>Daily premium use',
    featureName: 'Irani Saffron',
    featureDesc: 'Balanced profile saffron for desserts, teas, and everyday rituals.'
  },
  kashmiriAlmonds: {
    key: 'kashmiriAlmonds',
    title: 'Valley Crunch.',
    subtitle: 'Kashmiri almonds packed with clean fats and natural vitamin E.',
    theme: 'honey',
    color: '#CBA674',
    desc: 'Naturally grown almonds from Kashmir, cleaned and graded for a crisp texture and nutrient-dense snacking.',
    price: '₹899',
    details: 'Premium whole kernels<br>Unroasted and unsalted<br>Protein-rich',
    featureName: 'Kashmiri Almonds',
    featureDesc: 'Daily nutrition staple for balanced snacking and wellness plans.'
  },
  walnuts: {
    key: 'walnuts',
    title: 'Brain Fuel.',
    subtitle: 'Kashmiri walnuts known for omega-rich nourishment.',
    theme: 'honey',
    color: '#9E7A52',
    desc: 'Fresh crop walnuts sourced from Kashmir orchards with naturally high omega content for daily nutritional support.',
    price: '₹950',
    details: 'Half and whole kernels<br>Fresh seasonal batch<br>Omega-rich',
    featureName: 'Walnuts',
    featureDesc: 'Classic wellness dry fruit for long-term heart and brain support.'
  },
  kashmiriGhee: {
    key: 'kashmiriGhee',
    title: 'Golden Nourish.',
    subtitle: 'Traditional Kashmiri bilona ghee with deep aroma.',
    theme: 'saffron',
    color: '#F1B65A',
    desc: 'Slow-crafted bilona-style ghee inspired by traditional methods, ideal for daily cooking and wellness routines.',
    price: '₹1,350',
    details: 'Bilona process<br>Small-batch prepared<br>Rich aromatic finish',
    featureName: 'Kashmiri Ghee',
    featureDesc: 'Small-batch clarified butter for premium taste and nourishment.'
  }
};

export const productOrder: ProductKey[] = [
  'shilajit',
  'kashmiriSaffron',
  'kashmiriHoney',
  'iraniSaffron',
  'kashmiriAlmonds',
  'walnuts',
  'kashmiriGhee'
];

export const catalogItems: CatalogItem[] = [
  {
    id: 'MOON-SHL-001',
    title: 'Shilajit',
    subtitle: 'Himalayan Gold Grade Resin',
    price: 1999,
    image: '/moon333/ezgif-frame-125.jpg',
    alt: 'Pure Shilajit resin jar',
    featured: true,
    productKey: 'shilajit'
  },
  {
    id: 'MOON-KSF-002',
    title: 'Kashmiri Saffron',
    subtitle: 'Mongra A++ Grade',
    price: 1250,
    image: '/moon2222/ezgif-frame-120.jpg',
    alt: 'Premium saffron',
    productKey: 'kashmiriSaffron'
  },
  {
    id: 'MOON-KHN-007',
    title: 'Kashmiri Honey',
    subtitle: 'Wild Mountain Raw Honey',
    price: 1150,
    image: '/ezgif-2fae6b36993927b6-jpg/ezgif-frame-159.jpg',
    alt: 'Kashmiri honey jar — liquid gold',
    productKey: 'kashmiriHoney'
  },
  {
    id: 'MOON-IRS-003',
    title: 'Irani Saffron',
    subtitle: 'Negin Grade Threads',
    price: 1050,
    image: '/ezgif-2fae6b36993927b6-jpg/ezgif-frame-118.jpg',
    alt: 'Irani saffron threads',
    productKey: 'iraniSaffron'
  },
  {
    id: 'MOON-KAL-004',
    title: 'Kashmiri Almonds',
    subtitle: 'Premium Whole Kernels',
    price: 899,
    image: '/moon2222/ezgif-frame-056.jpg',
    alt: 'Kashmiri almonds',
    productKey: 'kashmiriAlmonds'
  },
  {
    id: 'MOON-WAL-005',
    title: 'Walnuts',
    subtitle: 'Kashmir Orchard Select',
    price: 950,
    image: '/moon333/ezgif-frame-051.jpg',
    alt: 'Walnuts premium pack',
    productKey: 'walnuts'
  },
  {
    id: 'MOON-KGH-006',
    title: 'Kashmiri Ghee',
    subtitle: 'Bilona Crafted',
    price: 1350,
    image: '/ezgif-2fae6b36993927b6-jpg/ezgif-frame-159.jpg',
    alt: 'Kashmiri ghee jar',
    productKey: 'kashmiriGhee'
  }
];

export const shippingZones: ShippingZone[] = [
  {
    zone: 'North',
    states: ['Delhi', 'Punjab', 'Haryana', 'Himachal Pradesh', 'Jammu and Kashmir'],
    cost: 50,
    eta: '2-3 days'
  },
  {
    zone: 'South',
    states: ['Karnataka', 'Tamil Nadu', 'Telangana', 'Andhra Pradesh'],
    cost: 60,
    eta: '3-4 days'
  },
  {
    zone: 'West',
    states: ['Maharashtra', 'Gujarat', 'Goa', 'Rajasthan'],
    cost: 50,
    eta: '2-3 days'
  },
  {
    zone: 'East',
    states: ['West Bengal', 'Odisha', 'Bihar', 'Jharkhand'],
    cost: 80,
    eta: '4-5 days'
  },
  {
    zone: 'Northeast',
    states: ['Assam', 'Manipur', 'Mizoram', 'Tripura'],
    cost: 100,
    eta: '5-7 days'
  }
];

export const shippingStateOptions = [
  '',
  'Delhi',
  'Punjab',
  'Haryana',
  'Himachal Pradesh',
  'Jammu and Kashmir',
  'Karnataka',
  'Tamil Nadu',
  'Telangana',
  'Andhra Pradesh',
  'Maharashtra',
  'Gujarat',
  'Goa',
  'Rajasthan',
  'West Bengal',
  'Odisha',
  'Bihar',
  'Jharkhand',
  'Assam',
  'Manipur',
  'Mizoram',
  'Tripura'
];
