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

export const heroImages: HeroImage[] = [
  {
    src: '/images/zforce-zf435-hero-studio.png',
    alt: 'ZFORCE ZF-435 earbuds lifted from an open charging case on a lit studio pedestal, with orange light sweeping across the background.',
  },
  {
    src: '/images/zforce-zf435-hero-lifestyle.png',
    alt: 'ZFORCE ZF-435 earbuds resting beside an open charging case on a marble table, next to the words True Wireless Freedom.',
  },
];

export const galleryImages: GalleryImage[] = [
  {
    src: '/images/zforce-zf435-front.png',
    alt: 'Front view of the ZFORCE ZF-435 charging case open, showing two black earbuds in a vivid orange interior.',
    caption: 'Open case, front view',
  },
  {
    src: '/images/zforce-zf435-details.png',
    alt: 'ZFORCE ZF-435 detail collage: an open case with both earbuds lifted out, the orange interior and a 400mAh battery marking.',
    caption: 'Earbuds, case and details',
  },
  {
    src: '/images/zforce-zf435-angles.png',
    alt: 'ZFORCE ZF-435 views: the closed matte black case beside a pair of black earbuds with chrome-finish stem accents.',
    caption: 'Closed case and earbuds',
  },
];

export const highlights = [
  { title: 'Matte black shell', copy: 'A soft matte black charging case with a single front LED indicator.' },
  { title: 'Orange interior', copy: 'The lid opens onto a vivid orange cradle shaped around each earbud.' },
  { title: 'Chrome stem accents', copy: 'Black stems finished with chrome caps and the ZFORCE name printed alongside.' },
  { title: '400mAh case marking', copy: 'The inside of the lid carries the marking Case Battery: 400mAh.' },
] as const;

export const specs: SpecRow[] = [
  { label: 'Brand', value: 'ZFORCE' },
  { label: 'Model', value: 'ZF-435' },
  { label: 'Product type', value: 'True Wireless Stereo (TWS) earbuds' },
  { label: 'Colourway', value: 'Matte black case and earbuds, orange case interior' },
  { label: 'Earbud finish', value: 'Black with silicone tips and chrome-finish stem caps' },
  { label: 'Case marking', value: 'Case Battery: 400mAh' },
  { label: 'Connectivity', value: 'Not specified' },
  { label: 'Battery runtime', value: 'Not specified' },
  { label: 'Charging input', value: 'Not specified' },
  { label: 'Water resistance', value: 'Not specified' },
  { label: 'In the box', value: 'Earbuds and charging case; other accessories not specified' },
  { label: 'Warranty', value: 'Not specified' },
];

export const faqs = [
  {
    question: 'How do I place an order?',
    answer:
      'Choose a quantity, add the ZF-435 to your bag and continue to the order form. You will review the price, add delivery details and submit an order request. No payment is collected on this site.',
  },
  {
    question: 'Which devices is the ZF-435 compatible with?',
    answer:
      'The ZF-435 is a true wireless stereo (TWS) earbud set. Bluetooth version, supported codecs and device-specific features are not specified in the product information supplied for this store, so we do not claim them here.',
  },
  {
    question: 'How does the charging case work?',
    answer:
      'The case shows a marking of Case Battery: 400mAh inside the lid. Charging cable, input rating, charging time and playtime are not specified, so they are not published as specifications.',
  },
  {
    question: 'What is included with the earbuds?',
    answer:
      'The supplied product references show the pair of earbuds and the charging case. Any additional accessories, such as a charging cable or spare tips, are not specified.',
  },
  {
    question: 'Is another colour available?',
    answer:
      'The ZF-435 is shown in a single colourway: a matte black case and earbuds with an orange case interior and chrome-finish stem accents.',
  },
  {
    question: 'What happens after I submit an order request?',
    answer:
      'Your request is recorded with the details you enter and a reference number is generated. Payment, shipping cost and delivery timing are confirmed separately by the merchant — nothing is charged on this site.',
  },
] as const;
