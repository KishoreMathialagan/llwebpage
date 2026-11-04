export type NavItem = { label: string; href: string; id: string }

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '#top', id: 'top' },
  { label: 'About', href: '#about', id: 'about' },
  { label: 'Services', href: '#services', id: 'services' },
  { label: 'Work', href: '#work', id: 'work' },
  { label: 'Insights', href: '#insights', id: 'insights' },
  { label: 'Contact', href: '#contact', id: 'contact' },
]

/* ---------------------------------------------------------------------------
   Company details — edit these values to go live.
   Email and phone are intentionally generic placeholders.
--------------------------------------------------------------------------- */
export const SITE = {
  name: 'LeadLoom',
  email: 'hello@leadloom.com',
  location: 'Remote-first — working worldwide',
  shortStatement: 'Strategy, creativity and digital thinking for ambitious brands.',
  socials: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/' },
    { label: 'Instagram', href: 'https://www.instagram.com/' },
    { label: 'Facebook', href: 'https://www.facebook.com/' },
  ],
}

export type Service = {
  index: string
  title: string
  shortTitle: string
  description: string
  capabilities: string[]
  glyph: 'orbit' | 'signal' | 'wave' | 'search' | 'mark' | 'frame'
}

export const SERVICES: Service[] = [
  {
    index: '01',
    title: 'Digital Strategy',
    shortTitle: 'Digital Strategy',
    description:
      'Build a clear direction for your digital presence with audience research, competitive understanding, positioning and strategic planning.',
    capabilities: [
      'Digital Marketing Strategy',
      'Audience Research',
      'Competitor Analysis',
      'Brand Positioning',
      'Marketing Roadmaps',
    ],
    glyph: 'orbit',
  },
  {
    index: '02',
    title: 'Performance Marketing',
    shortTitle: 'Performance Marketing',
    description:
      'Reach the right audience through carefully structured advertising campaigns designed around business objectives.',
    capabilities: [
      'Google Ads',
      'Meta Ads',
      'Paid Campaign Management',
      'Campaign Optimization',
      'Conversion Tracking',
    ],
    glyph: 'signal',
  },
  {
    index: '03',
    title: 'Social Media & Content',
    shortTitle: 'Social Media & Content',
    description:
      'Create a consistent digital voice through meaningful content, creative storytelling and strategic social media execution.',
    capabilities: [
      'Social Media Management',
      'Content Strategy',
      'Creative Direction',
      'Campaign Content',
      'Community Engagement',
    ],
    glyph: 'wave',
  },
  {
    index: '04',
    title: 'Search Engine Optimization',
    shortTitle: 'Search Engine Optimization',
    description:
      'Improve discoverability and build a stronger organic digital presence through search-focused optimization.',
    capabilities: [
      'Technical SEO',
      'On-page SEO',
      'Keyword Research',
      'Content Optimization',
      'Organic Growth Strategy',
    ],
    glyph: 'search',
  },
  {
    index: '05',
    title: 'Branding & Creative',
    shortTitle: 'Branding & Creative',
    description:
      'Build a recognizable identity and communicate your brand through thoughtful creative direction and visual consistency.',
    capabilities: [
      'Brand Identity',
      'Visual Design',
      'Campaign Creatives',
      'Art Direction',
      'Brand Communication',
    ],
    glyph: 'mark',
  },
  {
    index: '06',
    title: 'Website & Conversion Experience',
    shortTitle: 'Website & Conversion',
    description:
      'Create digital experiences that communicate your value clearly and guide visitors towards meaningful actions.',
    capabilities: [
      'Website Design',
      'Landing Page Design',
      'UX/UI Design',
      'Conversion Optimization',
      'Website Development',
    ],
    glyph: 'frame',
  },
]

export type ProcessStage = { index: string; title: string; description: string }

export const PROCESS: ProcessStage[] = [
  {
    index: '01',
    title: 'Discover',
    description: 'Understand your business, audience, challenges and growth opportunities.',
  },
  {
    index: '02',
    title: 'Strategize',
    description: 'Build a focused marketing direction aligned with your business objectives.',
  },
  {
    index: '03',
    title: 'Create & Execute',
    description: 'Turn strategy into campaigns, content and digital experiences.',
  },
  {
    index: '04',
    title: 'Analyze & Optimize',
    description: 'Study performance, identify opportunities and continuously improve.',
  },
]

export type Project = {
  id: string
  index: string
  title: string
  industry: string
  category: string
  description: string
  concept: string
  art: 'aurelia' | 'northline' | 'marrow' | 'fieldwork'
  ratio: string
  note: string
}

export const PROJECTS: Project[] = [
  {
    id: 'aurelia',
    index: '01',
    title: 'Aurelia',
    industry: 'Wellness & ritual',
    category: 'Brand Identity',
    description:
      'A quiet identity system built around ritual, tactility and considered restraint — designed to make a small-batch skincare label feel collectible.',
    concept:
      'The identity uses a single editorial letterform as a flexible mark, paired with warm paper tones, a precise grid and one orbital gesture. Packaging, art direction and launch assets extend the same visual grammar across every touchpoint.',
    art: 'aurelia',
    ratio: 'landscape',
    note: 'Self-initiated demonstration concept',
  },
  {
    id: 'northline',
    index: '02',
    title: 'Northline',
    industry: 'Logistics & infrastructure',
    category: 'Performance Campaigns',
    description:
      'A demand-generation concept for a B2B logistics platform — turning a complex operational offer into a sharp, measurable acquisition system.',
    concept:
      'The campaign architecture pairs a single-minded proposition with modular creative territories, tested across search and paid social. Landing page, qualification flow and reporting were designed as one continuous system rather than disconnected pieces.',
    art: 'northline',
    ratio: 'portrait',
    note: 'Self-initiated demonstration concept',
  },
  {
    id: 'marrow',
    index: '03',
    title: 'Marrow',
    industry: 'Hospitality & food',
    category: 'Social Media & Content',
    description:
      'A content direction for a contemporary fire-led restaurant — warm, direct and rooted in the theatre of the kitchen.',
    concept:
      'A social-first editorial language built from close crops, open flame, imperfect plating and confident typography. Content pillars, shoot direction and community responses were defined so the brand could stay consistent without becoming repetitive.',
    art: 'marrow',
    ratio: 'square',
    note: 'Self-initiated demonstration concept',
  },
  {
    id: 'fieldwork',
    index: '04',
    title: 'Fieldwork',
    industry: 'Architecture & interiors',
    category: 'Website Experiences',
    description:
      'A digital portfolio concept for an architecture practice — spatial, unhurried and built around the work rather than the agency.',
    concept:
      'The site treats navigation as a floor plan: projects unfold as rooms, with generous image scale, restrained wayfinding and a materials-led palette. The experience is designed to feel architectural on both desktop and mobile.',
    art: 'fieldwork',
    ratio: 'wide',
    note: 'Self-initiated demonstration concept',
  },
]

export type Differentiator = { index: string; title: string; description: string }

export const DIFFERENTIATORS: Differentiator[] = [
  {
    index: '01',
    title: 'Think before we execute',
    description:
      'Every action begins with understanding the business objective. We define the problem before we design the answer.',
  },
  {
    index: '02',
    title: 'Creative with purpose',
    description:
      'Visual creativity should support a meaningful communication goal — not exist simply for decoration.',
  },
  {
    index: '03',
    title: 'Data-informed decisions',
    description:
      'We use measurable signals to evaluate and improve campaigns, while leaving room for human judgement.',
  },
  {
    index: '04',
    title: 'Partnership over transactions',
    description:
      'We build collaborative relationships focused on long-term progress, not one-off deliverables.',
  },
]

export type Insight = {
  index: string
  title: string
  topic: string
  excerpt: string[]
  takeaway: string
}

export const INSIGHTS: Insight[] = [
  {
    index: '01',
    title: 'Attention is rented. Trust compounds.',
    topic: 'Brand & positioning',
    excerpt: [
      'Paid reach can buy a moment of attention. It cannot buy the accumulated familiarity that makes a brand the default choice.',
      'The businesses that grow with less friction tend to treat every campaign as a deposit into a larger reputation: consistent positioning, recognisable art direction, and a clear promise repeated until it becomes familiar.',
      'Performance matters. But performance without a coherent brand is a series of expensive introductions.',
    ],
    takeaway: 'Build the brand while you buy the attention.',
  },
  {
    index: '02',
    title: 'The quiet metrics behind visible growth',
    topic: 'Strategy & measurement',
    excerpt: [
      'Dashboards tend to reward what is easy to count: impressions, clicks, follows. Growth is usually sitting one layer beneath those numbers.',
      'We look for assisted conversations, returning visitors, direct traffic, reply rates, and the quality of the enquiry — signals that are less dramatic but closer to revenue.',
      'The useful question is not “what went up?” but “what changed in how people behave?”',
    ],
    takeaway: 'Measure the behaviour, not the applause.',
  },
  {
    index: '03',
    title: 'Designing for trust before conversion',
    topic: 'Digital experience',
    excerpt: [
      'A landing page has one job: to make the next step feel obvious and safe. Most convert poorly because they ask for commitment before they have earned it.',
      'Clarity, proof of competence, and a believable sense of what happens next do more work than another animated headline.',
      'Restraint is a conversion strategy. Every element should either reduce uncertainty or create momentum.',
    ],
    takeaway: 'Remove doubt, then ask for the click.',
  },
]

export const EXPERTISE_STRIP = [
  'Strategy',
  'Creative Direction',
  'Performance',
  'Search',
  'Content',
  'Digital Experience',
]
