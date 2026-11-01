/**
 * Packages & pricing – edit prices here (frontend-only mode) or in the admin
 * dashboard when the backend is connected. Prices are "starting from" values.
 */
export const packages = [
  {
    slug: 'mini-moments',
    name: 'Mini Moments',
    price: 2999,
    subtitle: 'For small, intimate celebrations at home',
    features: [
      'Basic decoration',
      'Balloon setup',
      'Welcome message',
      'Basic event coordination',
    ],
    highlighted: false,
  },
  {
    slug: 'celebration-plus',
    name: 'Celebration Plus',
    price: 5999,
    subtitle: 'Our most-requested themed setup',
    features: [
      'Theme-based decoration',
      'Customized backdrop',
      'Cake table setup',
      'Basic photography coordination',
      'Event-day coordination',
    ],
    highlighted: true,
  },
  {
    slug: 'premium-experience',
    name: 'Premium Experience',
    price: 12999,
    subtitle: 'Premium styling with complete coordination',
    features: [
      'Premium theme decoration',
      'Floral arrangements',
      'Photography coordination',
      'Customized welcome board',
      'Complete event coordination',
    ],
    highlighted: false,
  },
];
