import type { CatalogItem, ProductStory, ProductKey, ShippingZone } from '../types';

export const productStories: Record<ProductKey, ProductStory> = {
  shilajit: {
    key: 'shilajit',
    title: 'From the Zanskar Ridge.',
    subtitle: 'Gold-grade Himalayan resin — harvested above 4,000 metres.',
    theme: 'shilajit',
    color: '#7C4A2A',
    desc: 'Seeping through ancient rockfaces in the Zanskar range of Ladakh, this resin forms over centuries before it reaches your hands. Purified by traditional methods, rich in fulvic acid and 85+ trace minerals.',
    price: '₹1,999',
    details: 'Gold Grade Resin<br>Third-party lab tested<br>Daily vitality & clarity',
    featureName: 'Shilajit',
    featureDesc: 'The primary ritual product of MOON — built for consistent focus and recovery from the heights of the Himalaya.'
  },
  kashmiriSaffron: {
    key: 'kashmiriSaffron',
    title: 'Pampore at Dawn.',
    subtitle: 'Mongra A++ threads — picked before sunrise in the Valley.',
    theme: 'saffron',
    color: '#F25C2A',
    desc: 'In the crocus fields of Pampore — the saffron bowl of Kashmir — harvest happens in the last hours of darkness. These Mongra threads are hand-sorted at sunrise and sun-dried on rooftop trays above the Dal.',
    price: '₹1,250',
    details: 'Mongra A++ Grade<br>Deep crimson stigmas<br>Hand-sorted & sun-dried',
    featureName: 'Kashmiri Saffron',
    featureDesc: "Hand-selected Mongra threads from Pampore's autumn harvest — the rarest saffron grown on Indian soil."
  },
  kashmiriHoney: {
    key: 'kashmiriHoney',
    title: 'Meadows of Pahalgam.',
    subtitle: 'Wild mountain honey — raw and unfiltered from alpine Kashmir.',
    theme: 'honey',
    color: '#C8960A',
    desc: 'Harvested from beehives set among wildflower meadows above Pahalgam and Gulmarg, where bees forage on alpine clover at 2,500 metres. Bottled within days of harvest — enzyme-alive, never heated.',
    price: '₹1,150',
    details: 'Wild alpine harvested<br>Unfiltered & raw<br>Enzyme-rich purity',
    featureName: 'Kashmiri Honey',
    featureDesc: 'Liquid gold from the high meadows of Kashmir — raw, wild, and bottled close to where the bees live.'
  },
  iraniSaffron: {
    key: 'iraniSaffron',
    title: 'Persian Bloom.',
    subtitle: 'Irani Negin saffron — strong colour, balanced character.',
    theme: 'honey',
    color: '#D8A03F',
    desc: 'Selected Negin grade threads imported from Iran, chosen for consistent colour release and a warm, slightly sweet profile. Ideal for everyday ritual — saffron milk, rice dishes, and morning teas.',
    price: '₹1,050',
    details: 'Negin Grade Threads<br>Strong colour release<br>Everyday premium use',
    featureName: 'Irani Saffron',
    featureDesc: 'Balanced saffron for daily rituals — desserts, teas, and the morning cup.'
  },
  kashmiriAlmonds: {
    key: 'kashmiriAlmonds',
    title: 'Valley Harvest.',
    subtitle: 'Kashmiri almonds — clean fats, natural vitamin E, orchard grown.',
    theme: 'honey',
    color: '#CBA674',
    desc: 'Grown in the orchards of the Kashmir Valley where cool nights and mineral-rich soil produce almonds with a distinctly dense, creamy texture. Unroasted, unsalted, and nothing added.',
    price: '₹899',
    details: 'Premium whole kernels<br>Unroasted & unsalted<br>Protein & vitamin E rich',
    featureName: 'Kashmiri Almonds',
    featureDesc: 'Daily nutrition from Kashmir orchards — a clean snacking staple.'
  },
  walnuts: {
    key: 'walnuts',
    title: 'Lolab Orchards.',
    subtitle: 'Kashmiri walnuts — omega-rich, fresh-crop, orchard select.',
    theme: 'honey',
    color: '#9E7A52',
    desc: "Sourced from the walnut orchards of Lolab Valley — one of Kashmir's most fertile pockets — these fresh-season kernels are known for high omega-3 content and a mild, buttery flavour.",
    price: '₹950',
    details: 'Half & whole kernels<br>Fresh seasonal harvest<br>High omega-3 content',
    featureName: 'Walnuts',
    featureDesc: 'Classic wellness staple from Lolab Valley — for long-term heart and brain support.'
  },
  kashmiriGhee: {
    key: 'kashmiriGhee',
    title: 'Bangus Valley Gold.',
    subtitle: 'Traditional bilona ghee — slow-churned, small-batch.',
    theme: 'saffron',
    color: '#F1B65A',
    desc: 'Crafted in the bilona tradition from cows that graze the pastures of Bangus Valley. The process takes two days of hand-churning cultured curd — producing ghee with a deep, nutty aroma that mass production cannot replicate.',
    price: '₹1,350',
    details: 'Bilona process<br>Small-batch prepared<br>Deep aromatic finish',
    featureName: 'Kashmiri Ghee',
    featureDesc: 'Small-batch clarified butter from Bangus Valley — traditional method, premium taste.'
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
    image: '/moon333/ezgif-frame-162.png',
    alt: 'Pure Shilajit resin jar',
    featured: true,
    productKey: 'shilajit'
  },
  {
    id: 'MOON-KSF-002',
    title: 'Kashmiri Saffron',
    subtitle: 'Mongra A++ Grade',
    price: 1250,
    image: '/moon2222/ezgif-frame-162.png',
    alt: 'Premium saffron',
    productKey: 'kashmiriSaffron'
  },
  {
    id: 'MOON-KHN-007',
    title: 'Kashmiri Honey',
    subtitle: 'Wild Mountain Raw Honey',
    price: 1150,
    image: '/ezgif-2fae6b36993927b6-jpg/ezgif-frame-146.png',
    alt: 'Kashmiri honey jar — liquid gold',
    productKey: 'kashmiriHoney'
  },
  {
    id: 'MOON-IRS-003',
    title: 'Irani Saffron',
    subtitle: 'Negin Grade Threads',
    price: 1050,
    image: '/ezgif-2fae6b36993927b6-jpg/ezgif-frame-146.png',
    alt: 'Irani saffron threads',
    productKey: 'iraniSaffron'
  },
  {
    id: 'MOON-KAL-004',
    title: 'Kashmiri Almonds',
    subtitle: 'Premium Whole Kernels',
    price: 899,
    image: '/moon2222/ezgif-frame-162.png',
    alt: 'Kashmiri almonds',
    productKey: 'kashmiriAlmonds'
  },
  {
    id: 'MOON-WAL-005',
    title: 'Walnuts',
    subtitle: 'Kashmir Orchard Select',
    price: 950,
    image: '/moon333/ezgif-frame-162.png',
    alt: 'Walnuts premium pack',
    productKey: 'walnuts'
  },
  {
    id: 'MOON-KGH-006',
    title: 'Kashmiri Ghee',
    subtitle: 'Bilona Crafted',
    price: 1350,
    image: '/ezgif-2fae6b36993927b6-jpg/ezgif-frame-146.png',
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
