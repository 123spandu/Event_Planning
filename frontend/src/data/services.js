import { img } from './images.js';

/**
 * Service catalogue. When a backend is configured, services are loaded from
 * the database (seeded from this file) and can be edited in the admin dashboard.
 * Icon names refer to lucide-react icons mapped in components/ServiceIcon.jsx.
 */
export const services = [
  {
    slug: 'birthday-parties',
    title: 'Birthday Parties',
    icon: 'Cake',
    image: img.balloons,
    tagline: 'Themed celebrations for every age',
    description:
      'From a first birthday to a milestone fiftieth, we design birthday celebrations around the person being celebrated – their favourite colours, characters, hobbies and memories – and take care of every detail so you can enjoy the day.',
    included: [
      'Theme planning and colour palette',
      'Balloon and backdrop decoration',
      'Cake table styling',
      'Name or age signage',
      'Event-day setup and coordination',
    ],
    customizations: [
      'Character, pastel, minimal or luxury themes',
      'Photo booth and props corner',
      'Return gift coordination',
      'Entertainment such as magicians or game hosts (via partner vendors)',
    ],
  },
  {
    slug: 'surprise-parties',
    title: 'Surprise Parties',
    icon: 'Gift',
    image: img.confetti,
    tagline: 'Secret plans, flawless reveals',
    description:
      'Planning a surprise is exciting – keeping it secret is the hard part. We work quietly with you on timing, setup and the big reveal so your loved one walks into a moment they will never forget.',
    included: [
      'Discreet planning and timeline',
      'Room, home or venue decoration',
      'Reveal moment coordination',
      'Message board or welcome signage',
      'Quick setup before the guest of honour arrives',
    ],
    customizations: [
      'Room decor with balloons, candles and fairy lights',
      'Memory wall with personal photographs',
      'Midnight surprise setups',
      'Cake and flower coordination',
    ],
  },
  {
    slug: 'marriage-proposals',
    title: 'Marriage Proposals',
    icon: 'Heart',
    image: img.rings,
    tagline: 'The perfect setting for "Yes"',
    description:
      'A proposal deserves a setting as special as the question. We help you choose the place, design a romantic setup and coordinate the timing, so all you need to do is say the words.',
    included: [
      'Concept and location planning',
      'Romantic decor with flowers and candles',
      '"Will You Marry Me" signage',
      'Timing coordination with you',
      'Discreet on-site support',
    ],
    customizations: [
      'Rooftop, garden, private dining or at-home setups',
      'Rose petal pathways and floral arches',
      'Photographer coordination to capture the moment',
      'Music or live musician coordination',
    ],
  },
  {
    slug: 'anniversary-celebrations',
    title: 'Anniversary Celebrations',
    icon: 'Sparkles',
    image: img.tableDecor,
    tagline: 'Honouring the years together',
    description:
      'Whether it is a quiet dinner for two or a family celebration of a silver or golden anniversary, we create warm, elegant settings that celebrate your story.',
    included: [
      'Theme and decor planning',
      'Table or stage decoration',
      'Personalised welcome board',
      'Cake table setup',
      'Event-day coordination',
    ],
    customizations: [
      'Candlelight dinner setups',
      'Couple photo timeline display',
      'Family gathering arrangements',
      'Floral styling and centrepieces',
    ],
  },
  {
    slug: 'baby-showers',
    title: 'Baby Showers',
    icon: 'Baby',
    image: img.pastel,
    tagline: 'Soft, joyful welcomes',
    description:
      'Celebrate the mother-to-be with a calm, beautiful baby shower. We can plan a modern shower or a traditional Seemantha / Valaikaapu setup, styled to your family\'s preferences.',
    included: [
      'Theme and colour planning',
      'Backdrop and seating decoration',
      'Welcome signage',
      'Cake and dessert table styling',
      'Event-day coordination',
    ],
    customizations: [
      'Traditional ceremony decor',
      'Pastel, floral or neutral themes',
      'Games and activity planning',
      'Gender-neutral or reveal setups',
    ],
  },
  {
    slug: 'naming-ceremonies',
    title: 'Naming Ceremonies',
    icon: 'Flower2',
    image: img.floralDecor,
    tagline: 'A beautiful first celebration',
    description:
      'Welcome your little one with a naming ceremony that blends tradition with elegant styling. We coordinate decor, seating and the details, leaving you free to be with family.',
    included: [
      'Traditional or contemporary decor',
      'Cradle decoration',
      'Name reveal board',
      'Seating arrangement planning',
      'Event-day coordination',
    ],
    customizations: [
      'Floral cradle and mandap styling',
      'Name reveal ideas',
      'Priest, caterer or photographer coordination (via partner vendors)',
      'Return gift coordination',
    ],
  },
  {
    slug: 'engagement-functions',
    title: 'Engagement Functions',
    icon: 'Gem',
    image: img.couple,
    tagline: 'Elegant beginnings',
    description:
      'An engagement brings two families together. We plan stage decor, entry moments and the flow of the function so that the day feels effortless and looks stunning.',
    included: [
      'Stage and backdrop decoration',
      'Entry and walkway styling',
      'Ring ceremony setup',
      'Vendor coordination',
      'Complete event-day coordination',
    ],
    customizations: [
      'Floral, contemporary or traditional stage themes',
      'Couple entry concepts',
      'Photo booth and selfie corner',
      'Catering and venue coordination (via partner vendors)',
    ],
  },
  {
    slug: 'corporate-events',
    title: 'Corporate Events',
    icon: 'Briefcase',
    image: img.corporate,
    tagline: 'Professional, on-brand, on time',
    description:
      'Team celebrations, office parties, product launches and small conferences – we handle venue setup, branding elements and vendor coordination so your team can focus on the event itself.',
    included: [
      'Event planning and timeline',
      'Venue and stage setup',
      'Branded backdrop and signage coordination',
      'Vendor coordination',
      'On-site event management',
    ],
    customizations: [
      'Office festivals and celebrations',
      'Team outings and offsites',
      'Product launches and award nights',
      'AV, catering and photography coordination (via partner vendors)',
    ],
  },
  {
    slug: 'private-parties',
    title: 'Private Parties',
    icon: 'PartyPopper',
    image: img.partyLights,
    tagline: 'Your party, your way',
    description:
      'Housewarmings, get-togethers, reunions and festive parties – we plan intimate private events with thoughtful decor and smooth coordination.',
    included: [
      'Concept and theme planning',
      'Decor setup',
      'Seating and layout planning',
      'Vendor coordination',
      'Event-day coordination',
    ],
    customizations: [
      'House party and terrace setups',
      'Festive and seasonal themes',
      'Dining table styling',
      'Music and entertainment coordination (via partner vendors)',
    ],
  },
  {
    slug: 'college-community-events',
    title: 'College & Community Events',
    icon: 'Users',
    image: img.partyCrowd,
    tagline: 'Well-run events for groups',
    description:
      'College fests, farewells, freshers\' days, apartment community celebrations and small cultural programmes – we help organisers plan and execute events that run on time and on budget.',
    included: [
      'Event planning support',
      'Stage and venue decoration',
      'Schedule and flow planning',
      'Vendor coordination',
      'Event-day coordination',
    ],
    customizations: [
      'Farewell and freshers\' themes',
      'Apartment festival celebrations',
      'Photo booth and selfie points',
      'Sound and lighting coordination (via partner vendors)',
    ],
  },
];

export const eventTypes = [
  ...services.map((s) => ({ value: s.slug, label: s.title })),
  { value: 'other', label: 'Other' },
];
