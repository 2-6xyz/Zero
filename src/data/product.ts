export interface GalleryImage {
  src: string;
  alt: string;
  caption: string;
}

export interface HeroImage {
  src: string;
  alt: string;
}

export interface SpecRow {
  label: string;
  value: string;
}

/** Price in AED. 60 − 20 = 40; the discount is derived, never typed twice. */
export const price = {
  compareAt: 60,
  sale: 40,
  savings: 60 - 40,
} as const;

export const product = {
  id: 'zforce-zf-435',
  brand: 'ZFORCE',
  model: 'ZF-435',
  name: 'ZFORCE ZF-435 Wireless Earbuds',
  shortName: 'ZF-435 Wireless Earbuds',
  tagline: 'True wireless stereo earbuds in matte black, opening to a vivid orange case interior.',
  description:
    'A compact charging case in matte black with a bright orange interior, holding a pair of black earbuds with silicone tips and chrome-finish stem accents. The inside of the lid is marked Case Battery: 400mAh.',
  colourway: 'Matte black / orange',
  price,
} as const;

export const heroImage: HeroImage = {
  src: '/images/zforce-zf435-hero-studio.png',
  alt: 'ZFORCE ZF-435 earbuds lifted from an open charging case on a lit studio pedestal, with orange light sweeping across the background.',
};

export const campaignImage: HeroImage = {
  src: '/images/zforce-zf435-hero-lifestyle.png',
  alt: 'ZFORCE ZF-435 earbuds beside their open charging case on a pale marble table, with a glass vase and a book in the background.',
};

export const galleryImages: GalleryImage[] = [
  {
    src: '/images/zforce-zf435-front.png',
    alt: 'Front view of the ZFORCE ZF-435 charging case open, showing two black earbuds in a vivid orange interior.',
    caption: 'Open case, front view',
  },
  {
    src: '/images/zforce-zf435-details.png',
    alt: 'ZFORCE ZF-435 details: the open case with one earbud seated inside, both earbuds shown loose, the closed case with its charging port, and a close view of an earbud.',
    caption: 'Earbuds, case and details',
  },
  {
    src: '/images/zforce-zf435-angles.png',
    alt: 'ZFORCE ZF-435 views: the open case from two angles, the closed matte black case, and a pair of black earbuds with chrome-finish stem accents.',
    caption: 'Case and earbud angles',
  },
];

export const confirmedDetails: SpecRow[] = [
  { label: 'Brand', value: 'ZFORCE' },
  { label: 'Model', value: 'ZF-435' },
  { label: 'Type', value: 'True Wireless Stereo earbuds' },
  { label: 'Colour', value: 'Matte black, orange case interior' },
  { label: 'Finish', value: 'Chrome stem accents' },
  { label: 'Case marking', value: 'Case Battery: 400mAh' },
];

export const faqs = [
  {
    question: 'How do I place an order?',
    answer:
      'Add the ZF-435 to your bag and submit an order request with your delivery details. You will receive a reference number to keep.',
  },
  {
    question: 'When do I pay?',
    answer:
      'Nothing is collected on this site. The merchant confirms payment, shipping cost and delivery after receiving your order request.',
  },
  {
    question: 'What is included?',
    answer:
      'The supplied references show the earbuds and the charging case. A charging cable, spare tips and other accessories are not specified.',
  },
] as const;
