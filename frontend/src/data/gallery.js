import { img } from './images.js';

export const galleryCategories = [
  'Birthday Decorations',
  'Surprise Setups',
  'Romantic Proposals',
  'Anniversary Celebrations',
  'Baby Showers',
  'Engagement Events',
  'Corporate Events',
];

/**
 * Sample / inspiration images. `isSample: true` shows a "Sample" label on the
 * image. Replace with real event photographs (set isSample to false) or manage
 * the gallery from the admin dashboard.
 */
export const galleryImages = [
  { src: img.balloons, title: 'Balloon celebration setup', category: 'Birthday Decorations', isSample: true },
  { src: img.birthdayCake, title: 'Birthday cake table', category: 'Birthday Decorations', isSample: true },
  { src: img.balloonsParty, title: 'Colourful balloon decor', category: 'Birthday Decorations', isSample: true },
  { src: img.confetti, title: 'Confetti surprise moment', category: 'Surprise Setups', isSample: true },
  { src: img.sparklers, title: 'Sparkler celebration', category: 'Surprise Setups', isSample: true },
  { src: img.lights, title: 'Fairy light ambience', category: 'Surprise Setups', isSample: true },
  { src: img.rings, title: 'Proposal ring moment', category: 'Romantic Proposals', isSample: true },
  { src: img.couple2, title: 'Romantic outdoor setting', category: 'Romantic Proposals', isSample: true },
  { src: img.tableDecor, title: 'Candlelit anniversary table', category: 'Anniversary Celebrations', isSample: true },
  { src: img.dinner, title: 'Private anniversary dinner', category: 'Anniversary Celebrations', isSample: true },
  { src: img.pastel, title: 'Pastel baby shower styling', category: 'Baby Showers', isSample: true },
  { src: img.babyShower, title: 'Soft baby shower decor', category: 'Baby Showers', isSample: true },
  { src: img.couple, title: 'Engagement celebration', category: 'Engagement Events', isSample: true },
  { src: img.floralDecor, title: 'Floral engagement decor', category: 'Engagement Events', isSample: true },
  { src: img.weddingTable, title: 'Elegant reception tables', category: 'Engagement Events', isSample: true },
  { src: img.corporate, title: 'Corporate gathering', category: 'Corporate Events', isSample: true },
  { src: img.conference, title: 'Conference stage setup', category: 'Corporate Events', isSample: true },
];
