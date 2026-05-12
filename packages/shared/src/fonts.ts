import { Space_Grotesk, Manrope, Fraunces, Syncopate, Bebas_Neue, Plus_Jakarta_Sans, Inter } from 'next/font/google';

export const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-headline',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
});

export const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

export const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
  style: ['normal', 'italic'],
  axes: ['opsz'],
});

export const syncopate = Syncopate({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['400', '700'],
});

export const bebasNeue = Bebas_Neue({
  subsets: ['latin'],
  variable: '--font-mobile-hero',
  display: 'swap',
  weight: '400',
});

export const allFontVars = [
  spaceGrotesk.variable,
  manrope.variable,
  fraunces.variable,
  syncopate.variable,
  bebasNeue.variable,
].join(' ');

export const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

export const adminFontVars = [
  spaceGrotesk.variable,
  manrope.variable,
  fraunces.variable,
  plusJakartaSans.variable,
  inter.variable,
].join(' ');
