export type ProductKey =
  | 'shilajit'
  | 'kashmiriSaffron'
  | 'kashmiriHoney'
  | 'iraniSaffron'
  | 'kashmiriAlmonds'
  | 'walnuts'
  | 'kashmiriGhee';

export type ThemeKey = 'saffron' | 'honey' | 'shilajit';

export interface ProductStory {
  key: ProductKey;
  title: string;
  subtitle: string;
  theme: ThemeKey;
  color: string;
  desc: string;
  price: string;
  details: string;
  featureName: string;
  featureDesc: string;
}

export interface CatalogItem {
  id: string;
  title: string;
  subtitle: string;
  price: number;
  image: string;
  alt: string;
  featured?: boolean;
  productKey?: ProductKey;
}

export interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image?: string;
  itemId?: string;
}

export interface ShippingZone {
  zone: 'North' | 'South' | 'West' | 'East' | 'Northeast';
  states: string[];
  cost: number;
  eta: string;
}
