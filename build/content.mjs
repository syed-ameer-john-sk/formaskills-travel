// Formaskills Travel — single source of truth for site content.
// Every section of https://skillstravelscontent.netlify.app/en/ is represented here.

export const SITE = {
  name: 'Formaskills Travel',
  url: 'https://formaskills-travel.fr',
  tagline: 'Learn. Explore. Experience. Grow.',
  email: 'contact.skillstravel@gmail.com',
  phone: '+33 9 75 46 22 81',
  tel: '+33975462281',
  address: '6 rue Voltaire, 34200 Sète, France',
  mapsDir: 'https://www.google.com/maps/dir/?api=1&destination=6%20rue%20Voltaire%2C%2034200%20S%C3%A8te%2C%20France',
  mapsEmbed: 'https://www.google.com/maps?q=6%20rue%20Voltaire%2C%2034200%20S%C3%A8te%2C%20France&output=embed',
  hours: 'Monday to Friday, 08:30-16:30, France time. Closed on public holidays.',
  company: 'Formaskills Travel · FORMASKILLS TRAVEL SAS · SIREN 990 746 430 · RCS Montpellier',
  socials: [
    { name: 'Instagram', href: 'https://www.instagram.com/formaskills_travels/' },
    { name: 'TikTok', href: 'https://www.tiktok.com/@formaskills_travels' },
    { name: 'LinkedIn', href: 'https://www.linkedin.com/company/formaskills-travel/' },
    // Facebook: add the page URL to show it in the social rail and footer (see CONTENT_GAPS.md)
    { name: 'Facebook', href: '' },
  ],
};

export const NOTICE = 'Sending an enquiry is not a booking. Nothing is reserved or charged. Our team reads your enquiry and replies personally.';
export const FORMAT_NOTE = 'Learn French face-to-face in France, 100% online through our learning platform, or combine both formats for a flexible blended programme.';
export const FORMAT_NOTE2 = 'Face-to-face and blended programmes in France are organised for groups. Individual learners can join the online platform.';

export const NAV = [
  { href: '/', label: 'Home' },
  { href: '/what-we-offer/', label: 'Our offers' },
  { href: '/destinations/', label: 'Destinations' },
  { href: '/partners/', label: 'Become a partner' },
  { href: '/about/', label: 'About' },
  { href: '/contact/', label: 'Contact & FAQ' },
];

export const FOOTER_COLS = [
  { title: 'For individuals', links: [
    ['/for-me/', 'For me'], ['/learn-french/', 'Learn French'], ['/destinations/', 'Destinations'],
    ['/practical-information/', 'Practical information'], ['/arriving-in-sete/', 'Arriving in Sète'] ] },
  { title: 'For organisations', links: [
    ['/for-organisations/', 'For my organisation'], ['/for-organisations/plan-group-mobility/', 'Plan group mobility'],
    ['/for-organisations/#job-shadowing', 'Job shadowing'], ['/partners/', 'Become a partner'] ] },
  { title: 'Explore', links: [
    ['/what-we-offer/', 'What we offer'], ['/tourism/', 'Cultural activities and local experiences'],
    ['/au-pair-and-host-families/', 'Au pair and host families'],
    ['/guides-and-resources/', 'Guides and resources'], ['/plan-your-stay/', 'Plan my project'],
    ['/search/', 'Search'], ['/about/', 'About'], ['/contact/', 'Contact & FAQ'] ] },
  { title: 'Legal', links: [
    ['/legal/legal-notices/', 'Legal notices'], ['/legal/privacy/', 'Privacy'], ['/legal/cookies/', 'Cookies'],
    ['/legal/accessibility/', 'Accessibility'], ['/legal/photo-credits/', 'Photo credits'] ] },
];

export const WHY = [
  { t: 'Support at each step', d: 'We help you plan the practical side and follow up with you personally.', icon: 'compass' },
  { t: 'Proposals based on your budget', d: 'Each proposal is prepared from your wishes, your pace and your budget.', icon: 'scale' },
  { t: 'Local discovery', d: 'We look for experiences built around local places, people and traditions. What is included is always set out in your proposal.', icon: 'pin' },
  { t: 'A team you can write to', d: 'A question at any stage? Write or call us.', icon: 'chat' },
];

export const STEPS3 = [
  'Tell us what you are looking for, in your own words or through our guided questions.',
  'Our team reads your enquiry and replies personally.',
  'We outline what is possible and what still needs confirming. You decide what happens next.',
];

export const DESTINATIONS = [
  {
    slug: 'sete', name: 'Sète', tag: 'Mediterranean coast',
    img: '/assets/img/photos/hero', alt: 'The Canal Royal in Sète, with boats along the quays',
    aerial: '/assets/img/sete-aerial-hq.webp',
    summary: 'A lively port city between the Mediterranean Sea and the Thau Lagoon, Sète offers a relaxed coastal setting, local traditions and easy access to cultural and outdoor activities. It is particularly well suited to groups looking for a Mediterranean experience on a human scale.',
    highlights: ['Canals and harbour atmosphere', 'Beaches and coastal activities', 'Local traditions and gastronomy', 'Compact and easy to explore'],
    period: 'July - August',
    famous: [
      { t: 'The “Venice of Languedoc”', d: 'A fishing port crossed by canals, with boats along the quays.' },
      { t: 'Poets and songs', d: 'Birthplace of the poet Paul Valéry and the singer Georges Brassens.' },
      { t: 'Water jousting', d: 'A local tradition on the canals, seen especially in summer.' },
    ],
    best: 'Programmes can run across the year. Spring and early autumn are especially pleasant on the Mediterranean coast; summer is lively with local traditions.',
    activities: 'Guided discovery of the port and canals, local culture and food, the coast and the Thau Lagoon, and excursions nearby. Activities are confirmed in your proposal.',
    example: { t: 'Example programme: French and local discovery in Sète', d: 'A group programme could combine French learning with guided discovery, local culture and time to explore the city. The schedule, teaching hours, visits and practical arrangements are agreed before confirmation. This is an illustration, not a bookable package.' },
    meCta: 'Plan my stay', map: { lon: 3.70, lat: 43.40 }, practical: true,
  },
  {
    slug: 'montpellier', name: 'Montpellier', tag: 'Historic and dynamic',
    img: '/assets/img/photos/montpellier', alt: 'The Château d’eau du Peyrou in Montpellier, reflected in its pool',
    summary: 'Montpellier combines a historic city centre with a young, lively and international atmosphere. Its pedestrian streets, cultural venues and proximity to the Mediterranean make it a versatile destination for educational stays and group programmes.',
    highlights: ['Historic city centre', 'Young and cultural atmosphere', 'Easy access to the Mediterranean coast', 'Wide range of activities and visits'],
    period: 'July',
    famous: [
      { t: 'A lively student city', d: 'A young, international atmosphere in the centre.' },
      { t: 'The Écusson old town', d: 'Pedestrian streets, squares and historic façades.' },
      { t: 'Gardens and museums', d: 'Home to the Jardin des Plantes and the Musée Fabre.' },
    ],
    best: 'Programmes can run across the year. Late spring and early autumn are especially pleasant, and the student atmosphere is lively during term time.',
    activities: 'Guided discovery of the Écusson old town, museums and gardens, student and cultural life, and easy day trips to the Mediterranean coast. Activities are confirmed in your proposal.',
    example: { t: 'Example programme: French and local discovery in Montpellier', d: 'A group programme could combine French learning with guided discovery of the old town, museums and student life, and time to explore the city. The schedule, teaching hours, visits and practical arrangements are agreed before confirmation. This is an illustration, not a bookable package.' },
    meCta: 'Ask about Montpellier', map: { lon: 3.88, lat: 43.61 },
  },
  {
    slug: 'paris', name: 'Paris', tag: 'Culture and heritage',
    img: '/assets/img/photos/paris', alt: 'The Sacré-Cœur basilica in Paris',
    summary: 'Paris offers an exceptional concentration of museums, heritage sites, cultural institutions and educational opportunities. It is an ideal destination for groups looking for a rich programme combining learning, culture and major landmarks.',
    highlights: ['World-famous museums and landmarks', 'Major cultural institutions', 'Extensive educational opportunities', 'Excellent public transport network'],
    period: 'May and June',
    famous: [
      { t: 'Famous landmarks', d: 'The Eiffel Tower, the Louvre and the banks of the Seine.' },
      { t: 'Neighbourhoods with character', d: 'Montmartre, the Marais and the Latin Quarter.' },
      { t: 'Museums and cafés', d: 'A city for art, history and long conversations.' },
    ],
    best: 'Programmes can run across the year. Spring, especially May and June, is a particularly pleasant time to visit the capital.',
    activities: 'Guided discovery of world-famous museums and landmarks, major cultural institutions and historic neighbourhoods, supported by an extensive public transport network. Activities are confirmed in your proposal.',
    example: { t: 'Example programme: French and cultural discovery in Paris', d: 'A group programme could combine French learning with guided discovery of museums, landmarks and neighbourhoods, and time to explore the city. The schedule, teaching hours, visits and practical arrangements are agreed before confirmation. This is an illustration, not a bookable package.' },
    meCta: 'Ask about Paris', map: { lon: 2.35, lat: 48.86 },
  },
  {
    slug: 'nice', name: 'Nice', tag: 'French Riviera',
    img: '/assets/img/photos/nice', alt: 'A narrow street in the old town of Nice',
    summary: 'Nice combines Mediterranean scenery, historic neighbourhoods and an active cultural life. With the sea, the old town and easy access to the French Riviera, it is especially suited to programmes combining culture, outdoor activities and discovery.',
    highlights: ['Seafront and Mediterranean setting', 'Historic old town', 'Cultural and outdoor activities', 'Easy access to the French Riviera'],
    period: 'September',
    famous: [
      { t: 'The Promenade des Anglais', d: 'A famous seafront walk along the Bay of Angels.' },
      { t: 'Vieux Nice and the Cours Saleya', d: 'Colourful old streets and a flower and food market.' },
      { t: 'Light and art', d: 'Home to the Matisse and Chagall museums.' },
    ],
    best: 'Programmes can run across the year. Early autumn, especially September, is particularly pleasant on the French Riviera.',
    activities: 'Guided discovery of the seafront and old town, cultural and outdoor activities, and easy access to the wider French Riviera. Activities are confirmed in your proposal.',
    example: { t: 'Example programme: French and local discovery in Nice', d: 'A group programme could combine French learning with guided discovery of the old town, the seafront and the Riviera, and time to explore the city. The schedule, teaching hours, visits and practical arrangements are agreed before confirmation. This is an illustration, not a bookable package.' },
    meCta: 'Ask about Nice', map: { lon: 7.27, lat: 43.70 },
  },
];

export const DEST_SHARED = {
  suits: 'School groups, student groups, adult and professional groups, and organisations planning a group mobility. Tell us your project and we confirm what fits.',
  french: 'Add French lessons to your stay, from a few sessions to a full course, in a face-to-face or blended format for your group.',
  plan: 'Tell us your group size, preferred dates, objectives and the services you need. Your proposal will identify the activities, locations, practical arrangements and conditions that apply to your project.',
};

// ---------- For me ----------
export const FOR_ME_IF = [
  'You want to learn French online.',
  'You want to discover a place and its culture, with or without classes.',
  'You are planning a stay and want help with the practical side.',
  'You have an idea that does not fit a standard package.',
];
export const HELPS_REPLY = ['Your French level, if you know it', 'What you want to do: learn, discover or both', 'A destination, or none yet', 'Preferred period and length of stay', 'Who is travelling'];
export const HOW_ME = [
  { t: 'Choose', d: 'Pick what interests you.' },
  { t: 'Tell us', d: 'Answer a few optional questions, or write in your own words.' },
  { t: 'We reply', d: 'Our team reads your enquiry and replies personally.' },
];
export const FAQ_ME = [
  ['What if I do not know my French level?', 'Share your estimated level and when you want to use French. If you do not know your level, just tell us.'],
  ['Can you help with accommodation and transport?', 'Yes. We help coordinate accommodation, transfers and local transport. Details are agreed with you for each enquiry.'],
  ['Does sending an enquiry book or charge anything?', 'No. Sending an enquiry is not a booking. Nothing is reserved or charged.'],
  ['Can I write to you in my own language?', 'Yes, please write in your language.'],
];

export const ME_OFFERS = [
  {
    id: 'o-learn', t: 'Learn French online', tab: 'Learn French online', status: 'Available', statusKey: 'ok',
    short: 'French courses on our online learning platform, matched to your level. FLE programmes in France are organised for groups.',
    forMeShort: true,
    href: '/plan-your-stay/?for=me&purpose=learn', cta: 'Start with French', cta2: 'Request a tailored proposal',
    details: [
      ['Who it is for', 'Individuals who want to learn French online, from complete beginners to advanced learners.'],
      ['Objectives', 'Improve your French around your level, goals and availability.'],
      ['Format', 'Online for individuals; face-to-face or blended in France for groups.'],
      ['Location', 'Online, and in France for group programmes.'],
      ['Duration and numbers', 'Agreed with you and confirmed in your proposal.'],
      ['What it can include', 'French learning online through our learning platform. Face-to-face FLE in France is organised for groups only.'],
      ['Options and exclusions', 'A stay, activities and accommodation can be added for groups. We do not promise a specific level or qualification.'],
      ['Availability', 'This service is currently offered. Contact us for dates, conditions and availability.'],
    ],
  },
  {
    id: 'o-cult', t: 'Cultural activities, local experiences and excursions', tab: 'Cultural activities and excursions', status: 'In development', statusKey: 'dev',
    short: 'Guided tours, local activities, food and excursions. In development: register your interest.',
    href: '/plan-your-stay/?for=me&purpose=discover', cta: 'Register my interest', cta2: 'Register your interest',
    details: [
      ['Who it is for', 'Individuals, families and groups who want to discover a place and its culture, with or without French classes.'],
      ['Objectives', 'Discover a place, its culture and daily life, with or without French lessons.'],
      ['Format', 'In person in France.'],
      ['Location', 'Our featured destinations in France, or another on request.'],
      ['Duration and numbers', 'Confirmed in your proposal.'],
      ['What it can include', 'Guided tours, local culture and food, and excursions, with or without French lessons.'],
      ['Options and exclusions', 'Activities, reservations and availability are set out in a proposal. A visit shown on this website is not an included service.'],
      ['Availability', 'This service is not yet available to book. You can register your interest in future updates.'],
    ],
  },
  {
    id: 'o-aupair', t: 'Au pair and host families', tab: 'Au pair and host families', status: 'In development', statusKey: 'dev',
    short: 'Register your interest in a cultural exchange in France. Our au pair network is in development.',
    forMeText: 'Our au pair and host-family network is in development. You can register your interest in future opportunities. Registration does not guarantee a match or a placement.',
    href: '/plan-your-stay/?for=me&purpose=aupair', cta: 'Register your interest', cta2: 'Register your interest',
    details: [
      ['Who it is for', 'Future au pairs and host families.'],
      ['Objectives', 'Take part in a cultural exchange between au pairs and host families in France.'],
      ['Format', 'In person, with host families in France.'],
      ['Location', 'France.'],
      ['Duration and numbers', 'Confirmed as the network develops.'],
      ['What it can include', 'Au pair and host-family registration, profile and availability information, and future matching as the network grows.'],
      ['Options and exclusions', 'Registration does not guarantee a match or a placement.'],
      ['Availability', 'This service is not yet available to book. You can register your interest in future updates.'],
    ],
  },
];

// ---------- For organisations ----------
export const ORG_SERVICES = [
  {
    id: 'french-and-immersion', tab: 'FLE French courses', t: 'FLE: French courses for groups', topic: 'orgfr',
    intro: ['Improve your French while living life in France. Courses are adapted to each group’s level, goals and time available.', FORMAT_NOTE, FORMAT_NOTE2],
    suits: 'Schools, universities, training organisations, companies, Erasmus+ groups and other organised groups.',
    aims: ['Speak with more confidence', 'Understand everyday French', 'Prepare for a specific purpose'],
    arrange: ['General French: speaking, listening, everyday communication', 'Intensive French', 'Business French for the workplace', 'Cultural activities and excursions'],
    online: { t: 'Learn French online', d: 'The online format can be used to prepare participants before their stay, continue learning after their return, or follow a fully remote French programme. It can be adapted to the group’s level and learning objectives.' },
    steps: ['Level and goals', 'Course and immersion plan', 'Learning in France'],
    good: 'Accommodation, meals and local transport can be added. Course format, level and length are agreed with you and confirmed in your proposal. We do not promise a specific level or qualification.',
    faq: [
      ['Can learners of different levels join together?', 'Tell us the range of levels. We look at how to group learners and confirm it in your proposal.'],
      ['Are courses in person or online?', 'Both are possible. French courses are offered in person in Sète and online.'],
      ['Can we add cultural visits?', 'Yes, tell us. Cultural and educational activities are in development, and we say what can be arranged.'],
    ],
  },
  {
    id: 'cultural-experiences', tab: 'Educational & cultural programmes', t: 'Educational and cultural programmes', topic: 'orgcult', offerCta: 'Register your interest',
    intro: ['Tailor-made group trips to discover France through its culture, heritage, gastronomy and local life. French lessons and Erasmus+ are not required.'],
    suits: 'Schools, universities, training organisations, companies and other groups.',
    aims: ['Link language to places', 'Learn from the place itself', 'Create shared group moments'],
    arrange: ['Guided tours and cultural visits', 'Local activities and experiences', 'Gastronomy, markets and restaurants', 'Nature and outdoor activities'],
    steps: ['Your interests', 'Ideas to review', 'Added to your programme'],
    good: 'Accommodation, meals and local transport can be added. We say what can be arranged before anything is planned. A visit shown on this website is not an included service.',
    faq: [
      ['Can we do cultural activities without French classes?', 'Yes. Cultural discovery can be a project on its own. It is in development: you can register your interest.'],
      ['Can you adapt activities to different ages?', 'Tell us the ages and general needs. We suggest activities and say what is confirmed.'],
      ['Are reservations and entry fees included?', 'Only what your proposal states. Activities, reservations and availability are set out in a proposal.'],
    ],
  },
  {
    id: 'job-shadowing', tab: 'Professional mobility & job shadowing', t: 'Job shadowing and professional observation', topic: 'jobshadow',
    intro: ['Observe professionals and discover how a sector works, around goals agreed with you.'],
    suits: 'Schools, universities, training organisations, student groups, teachers, trainers and companies.',
    aims: ['Observe real practice', 'Exchange with peers', 'Bring ideas home'],
    arrange: ['Observation of professional practices', 'Meetings with French professionals', 'Visits to working environments', 'Cultural activities and local experiences'],
    steps: ['Your goals', 'A host and programme', 'Observation and exchange'],
    good: 'Erasmus+ funding is not required. Availability depends on suitable host organisations. An enquiry does not confirm a host or funding.',
    faq: [
      ['How is it different from accompanying pupils?', 'Job shadowing is professional observation by staff. Accompanying adults support a group of learners. List these roles separately in your enquiry.'],
      ['Who is job shadowing for?', 'Staff who want to observe professional practice and exchange with peers. The field, goals and hosting possibilities are agreed together.'],
      ['Can we combine it with other programmes?', 'Tell us your idea. We look at each request on its merits and say what is possible.'],
    ],
  },
  {
    id: 'erasmus-plus', tab: 'Erasmus+ group mobility', t: 'Erasmus+ group mobility', topic: 'erasmus',
    intro: ['Structured educational mobility for groups of learners, with learning activities, cultural discovery and local immersion.'],
    orgOnlyIntro: [
      'Tell us your education sector, action type and planned activities. We will identify the services we can provide for your project. Eligibility and funding decisions remain with the relevant organisation and National Agency.',
      'Your organisation retains responsibility for the core tasks of its Erasmus+ project. Our agreed services and responsibilities are described in a written agreement.',
    ],
    suits: 'Sending organisations bringing a group of learners to France: schools, vocational providers and higher education.',
    aims: ['A welcome on arrival', 'Practical coordination', 'Language and tutoring support'],
    arrange: ['Learning activities', 'FLE French courses', 'Cultural and local discovery', 'Professional or sector visits'],
    steps: ['Your institution', 'A programme outline', 'Agreed details'],
    good: 'For eligible Erasmus+ VET projects. Funding is managed by the sending organisation, not by Formaskills Travel. An enquiry does not confirm funding, a host or a place on a programme.',
    official: 'We do not assess funding eligibility. For official Erasmus+ rules and contacts, use the Erasmus+ agencies’ own websites.',
    faq: [
      ['Is Erasmus+ only for study exchanges?', 'No. Depending on the sector and project it can involve group learning, individual mobility, study or staff activities. Your institution identifies the framework for its mobility.'],
      ['What should our institution tell you?', 'Your education sector, sending country, planned activities, goals, destination, period and practical needs. List learners, accompanying adults and staff on their own mobility separately.'],
      ['Does an enquiry confirm funding?', 'No. An enquiry lets us assess your project. Funding follows the programme rules, which your institution checks with its National Agency.'],
    ],
  },
  {
    id: 'accommodation-and-transport', tab: 'Accommodation, meals & transport', t: 'Accommodation, meals and local logistics', topic: 'orgstay',
    intro: ['Already have your programme but need help with the practical side of the stay? We can coordinate selected local services for your group.'],
    suits: 'Schools, universities, training providers, language schools and mobility organisations.',
    aims: ['A clear picture', 'Fewer loose ends', 'Options that suit your group'],
    arrange: ['Group accommodation', 'Meals and restaurant arrangements', 'Local transport', 'Activity and excursion logistics'],
    steps: ['Your needs', 'Options to review', 'Arrangements agreed'],
    good: 'Choose only what you need. Travel to and from France is arranged independently by your group or organisation: Formaskills Travel does not book flights or airport transfers. We confirm what is included in your proposal.',
    faq: [
      ['Do you book our flights?', 'Formaskills Travel is not authorised to book long-haul international flights, but we can advise you on getting good fares. Flights to and from France are not included unless your proposal says so, so you find flights to suit your budget and dates.'],
      ['Can you help with arrival at a station or airport?', 'Tell us your arrival point, group size and drop-off needs. Transfers are included only when stated in your proposal.'],
      ['Can accommodation suit specific needs?', 'Describe general adjustments such as access, pace or transport. Strictly necessary personal details can be shared through a suitable channel.'],
    ],
  },
  {
    id: 'local-coordination', tab: 'Local coordination', t: 'Local coordination and support in France', topic: 'orgcoord',
    intro: ['One team coordinates the practical side locally, so your staff can focus on the learners.'],
    suits: 'Schools, universities, training providers, language schools and mobility organisations.',
    aims: ['Staff free to focus', 'Everything connected', 'Clear roles'],
    arrange: ['A local contact', 'Practical help', 'Coordination', 'A clear split of roles'],
    steps: ['Your plan', 'Who does what', 'Support on the ground'],
    good: 'The level of support is agreed with you. Supervision, funding checks and travel documents stay with your institution.',
    faq: [
      ['Is someone available during the stay?', 'Our team stays in touch during the stay. The level of support is agreed with you.'],
      ['Do you supervise the learners?', 'No. Supervision stays with your institution. We coordinate the practical side.'],
      ['What should we send before arrival?', 'Your programme, dates, number of people and contacts on your side. The more you share, the better we coordinate.'],
    ],
  },
  {
    id: 'group-programmes', tab: 'Tailor-made groups', t: 'Tailor-made group programmes', topic: 'groups',
    intro: ['A project that does not fit a standard format? Tell us who is travelling, why they are coming to France and what you want to achieve. We build the programme from only the services your group needs.'],
    suits: 'Classes, teams and mixed groups, and individual participants joining an organisation’s wider project.',
    aims: ['One proposal', 'Built from your brief', 'One main contact'],
    arrange: ['FLE courses and educational activities', 'Professional observation or visits', 'Culture, tourism and excursions', 'Accommodation, meals and local transport'],
    steps: ['Your brief', 'A programme outline', 'Coordination'],
    good: 'You can come with Erasmus+ funding, another funding source or none. Learners, accompanying adults and staff have different roles: list them separately in your brief so we can plan each one.',
    faq: [
      ['How large can the group be?', 'Tell us the number. We look at what is possible and say so in your proposal.'],
      ['Can individual participants join a wider project?', 'Yes. Tell us how they fit into your organisation’s project.'],
      ['Do you work with accompanying adults?', 'Yes. List learners, accompanying adults and staff separately so we can plan their roles.'],
    ],
  },
];
export const ORG_ORDER_OFFERS = ['french-and-immersion', 'cultural-experiences', 'accommodation-and-transport', 'local-coordination', 'group-programmes', 'erasmus-plus', 'job-shadowing'];

export const CLEAR_START = [
  { t: 'What we coordinate', d: 'Courses, stay, activities and local support, as set out in your proposal.' },
  { t: 'What stays with you', d: 'Funding checks with your National Agency, supervision, and information for families, documents and cover.' },
  { t: 'What we do not do', d: 'We do not promise funding, a host or a place from an enquiry. This website takes no bookings or payments.' },
];

export const GROUP_MOBILITY = [
  ['Objectives', 'Learning goals, education sector and planned activities.'],
  ['Participants and age ranges', 'Number of participants and broad age ranges.'],
  ['Accompanying adults', 'Number of accompanying adults and staff, counted separately from learners.'],
  ['Dates and duration', 'Preferred period, duration and how flexible they are.'],
  ['Destination', 'Your preferred destination in France, or none yet.'],
  ['Services wanted', 'Classes, activities, accommodation, meals and transport you would like to explore.'],
  ['Indicative budget', 'An approximate budget and your main priorities.'],
  ['Funding', 'Erasmus+, another funding source, or self-funded.'],
  ['Split of responsibilities', 'Who prepares, supervises and informs families, and which documents and cover need checking.'],
];

// ---------- Partners ----------
export const PARTNER_TYPES = [
  ['Schools, universities & training organisations', 'Build educational exchanges, group mobility, study visits and learning projects with partners and participants across different countries.'],
  ['Companies & host organisations', 'Welcome learners, students or professionals for work placements, professional observation, job shadowing, educational visits or other international mobility experiences.'],
  ['Accommodation providers', 'Welcome individuals or groups taking part in educational, professional, cultural or mobility programmes.'],
  ['Cultural activities, guides & experience providers', 'Share your destination through guided visits, workshops, heritage, gastronomy, cultural activities and authentic local experiences.'],
  ['Travel agencies & international partners', 'Develop programmes together, refer or receive groups, coordinate services and create new opportunities across destinations and countries.'],
  ['Restaurants, catering, local transport & practical service providers', 'Provide meals, transportation or other practical services supporting participants and groups during their programmes.'],
  ['Other businesses & organisations', 'If your activity can contribute to an educational, professional, cultural or international mobility project, tell us what you do and how you would like to collaborate.'],
];
export const PARTNER_WHY = [
  ['Meet new international audiences', 'Schools, training providers, companies and mobility projects from other countries.'],
  ['Open new business opportunities', 'Group programmes, one-off projects or lasting collaborations, matched to your services.'],
  ['Build lasting connections', 'Professionals and organisations from many countries and sectors.'],
  ['Stay in control', 'You choose the projects, the timing, the capacity and the terms.'],
];
export const PARTNER_PROCESS = [
  ['Tell us about your organisation', 'Introduce your activity, location, services and the type of collaboration you are interested in.'],
  ['We review the fit', 'We look at your offer, capacity, location, availability and how it could fit our current or future projects.'],
  ['We agree the conditions', 'If there is a potential fit, we discuss practical and commercial conditions, responsibilities and the way we will work together.'],
  ['We collaborate when a suitable project arises', 'When a project matches your services and availability, we contact you to confirm the details before anything is booked or committed.'],
];
export const PARTNER_CATEGORIES = ['French language school / FLE provider', 'School / university / training organisation', 'Company / employer / professional organisation', 'Erasmus+ / mobility / international education organisation', 'Accommodation provider', 'Cultural activity / guide / experience provider', 'Travel agency / educational travel partner', 'Restaurant / catering provider', 'Local transport / practical service provider', 'Association / NGO / public organisation', 'Other business or organisation'];
export const PARTNER_WAYS = ['Provide FLE / language-learning programmes', 'Provide accommodation', 'Provide cultural activities, guided visits or excursions', 'Provide meals / catering', 'Provide local transport or practical services', 'Take part in educational or international mobility projects', 'Host trainees / work placements', 'Host job shadowing / professional observation', 'Host company visits / professional visits', 'Host professional meetings or sector discovery activities', 'Welcome groups for educational or professional experiences', 'Send, receive or refer groups / participants', 'Develop a joint programme or international project', 'Become a local service or activity partner', 'Other'];
export const PARTNER_FAQ = [
  ['Who can become a partner?', 'Any organisation or business whose work supports learning, travel or cultural experiences in France, such as language schools, accommodation providers, activity organisers, educational institutions and local service businesses.'],
  ['Can small businesses and independent providers join the network?', 'Yes. We can work with independent professionals, small local businesses and larger organisations depending on the project.'],
  ['Can my company host international trainees?', 'Yes. Companies and other professional organisations can express interest in hosting learners or students for structured work placements when the participant profile, objectives and applicable framework are suitable.'],
  ['What are the benefits of hosting an international trainee?', 'Hosting can bring international perspectives, intercultural exchange and new ideas to your team while allowing you to share your expertise and discover potential future talent.'],
  ['Can we discuss a one-time project?', 'Yes. We can talk about a single activity or event as well as a longer programme.'],
  ['Do you accept international partners?', 'Yes. Organisations from other countries are welcome to get in touch, especially for mobility and exchange projects.'],
  ['Does an enquiry automatically create a partnership?', 'No. An enquiry starts a conversation. A partnership exists only if both sides agree on it.'],
  ['How can we discuss partnership conditions?', 'Conditions are not fixed in advance. We discuss them with you for each project, after the first conversation.'],
  ['Can our logo appear on your website?', 'Only with your explicit approval. Any use of a partner’s name, logo, images or branding should be agreed beforehand.'],
];

// ---------- Contact FAQ ----------
const ext = (href, label) => `<a href="${href}" target="_blank" rel="noopener">${label}<span class="sr-only"> (opens in a new tab)</span></a>`;
export const FAQ_CONTACT = [
  { id: 'faq-0', t: 'Planning and enquiries', items: [
    ['What happens after I send an enquiry?', 'Our team reads your enquiry and replies personally. We outline what is possible and what still needs confirming. You decide what happens next.'],
    ['Does sending an enquiry book or charge anything?', 'No. Sending an enquiry is not a booking. Nothing is reserved or charged.'],
    ['How far in advance should I contact you?', 'As early as possible, especially for group stays and busy travel periods. It gives us more options for accommodation, activities, transport and scheduling. Last-minute requests can still be considered, depending on availability.'],
    ['How do I get a proposal and a price for my project?', 'Tell us your goals, destination, number of people and preferred period. We discuss your needs, then set out services, options and prices in a proposal.'],
    ['Why are prices not displayed?', 'A tailored trip cannot be priced in advance. To send you a precise proposal, we need a detailed request through our <a href="/plan-your-stay/">travel enquiry form</a>. You can then change it: add or remove steps or activities, dates and length, number of participants, accommodation category or services such as guides and transport. Each change affects the price, so each quote is prepared for your own request.'],
    ['Can you adapt the programme to our budget?', 'Yes. Tell us your approximate budget and your priorities. We can suggest different options and adapt the programme, accommodation, activities or services to fit.'],
    ['What does a stay include?', 'It depends on the services you choose. Classes, visits, accommodation, meals and transport are each set out in the proposal. A photo or suggested visit on this website is not an included service.'],
    ['What types of accommodation can you arrange?', 'Depending on the destination, dates, group profile and budget, we look for suitable options such as hotels, residences, hostels or other group accommodation. For a whole group, tell us the number of participants, ages, room preferences, dates and budget.'],
    ['Can you help with accommodation and transport?', 'Yes. We help coordinate accommodation, transfers and local transport. Details are agreed with you for each enquiry.'],
    ['When do I need to pay?', 'Payment deadlines are shown in your proposal, booking documents or invoice. Sending an enquiry never charges anything.'],
    ['Can I write to you in my own language?', 'Yes, please write in your language.'],
    ['Does your group include participants under 18?', 'Please tell us whether your group includes participants under 18. Supervision, safeguarding, authorisations and any applicable formalities must be agreed before the programme is confirmed. Do not include individual children’s personal documents in your first enquiry.'],
  ] },
  { id: 'faq-1', t: 'French classes', items: [
    ['What if I do not know my French level?', 'Share your estimated level and when you want to use French. If you do not know your level, just tell us.'],
    ['Do you accept complete beginners?', 'Yes. French courses can be organised for complete beginners as well as for learners who already speak French.'],
    ['Can you arrange French classes for a school or group?', 'Yes, on request. Share the group size, ages, levels, goals, period and destination. Content and arrangements are agreed after discussion.'],
    ['Can French classes be combined with cultural activities?', 'Yes. French lessons can be combined with visits, cultural activities, local experiences and chances to practise French outside the classroom. A visit shown on this website is not an included service until it is in your proposal.'],
  ] },
  { id: 'faq-2', t: 'Erasmus+', items: [
    ['What is Erasmus+?', 'Erasmus+ is the European Union programme for education, training, youth and sport. It funds organisations to run international mobility and cooperation projects. The funding goes to the organisations, not to Formaskills Travel. For official rules, use your National Agency.'],
    ['Is Erasmus+ only for study exchanges?', 'No. Depending on the sector and project it can involve group learning, individual mobility, study or staff activities. Your institution identifies the framework for its mobility.'],
    ['Does our organisation need to be Erasmus+ accredited to work with you?', 'No. Accreditation is not required to contact us or to plan a programme. We can work with organisations that have Erasmus+ accreditation, organisations taking part in an Erasmus+ project, and schools, companies, associations or other organisations using their own funding or another source. For an Erasmus+ project we can help organise services such as accommodation, activities, local logistics, French courses and job shadowing.'],
    ['Do we need an educational reason for an Erasmus+ trip?', 'Yes. Erasmus+ supports learning mobility, not holidays or sightseeing. Cultural visits and activities can be part of a mobility when they support the educational goals, for example to practise French or to understand French society. Your organisation checks the rules with its National Agency.'],
    ['Where does our organisation apply for Erasmus+ funding?', 'To the Erasmus+ National Agency of the country where your organisation is established. For example, an organisation in France applies through the French National Agency, and one in Spain, Italy or Germany through its own country’s agency. The National Agency publishes the deadlines, eligibility rules and funding. We do not assess eligibility.'],
    ['Does Erasmus+ accreditation automatically give us funding?', 'No. Accreditation gives simplified access to Erasmus+ mobility funding, but your organisation must still submit a funding request for the activities it wants to organise. Check the details with your National Agency.'],
    ['What is job shadowing?', 'Job shadowing means spending time in another organisation to observe how professionals work. For example, a teacher or trainer can visit a French organisation, observe its methods and exchange with colleagues. It is a professional learning experience, not a tourist visit. Availability depends on suitable host organisations.'],
  ] },
  { id: 'faq-3', t: 'During your stay', items: [
    ['Can I call you if there is a problem during my stay?', `Yes, of course, but mind the time difference! You can reach our team on <a href="tel:${SITE.tel}">${SITE.phone}</a>. Monday to Friday, 08:30-16:30, France time. Closed on public holidays.`],
  ] },
  { id: 'faq-4', t: 'Travel documents', items: [
    ['Where do I apply for a visa?', `There are several ways. You can often apply online on the official website of the embassy or consulate, or go to the consulate of the country concerned. Online services such as ${ext('https://www.action-visas.com/', 'Action Visas')} also exist.`],
    ['How do I know whether I need a visa?', `Check the entry requirements of the country you are visiting, starting with its consulate. They depend on your nationality and the purpose of your stay. You can also follow current requirements on ${ext('https://visas-express.fr/', 'Visas Express')}. Some countries ask for a tourist card instead of a visa. This is general information, not legal or immigration advice.`],
    ['Can you apply for a visa on my behalf?', 'No. Visa applications must be completed by the traveller or their organisation. When it applies, we can provide supporting documents for confirmed services.'],
    ['How do I get a passport for my trip?', '<p>A passport proves your identity and nationality abroad. Start renewal several weeks before it expires.</p><p>If you are in France, apply for a first passport at your town hall (mairie) with:</p><ul><li>The original and a copy of your identity card</li><li>One identity photo</li><li>A completed CERFA form no. 12100*02</li><li>Fiscal stamps of €86</li><li>Proof of address (original and photocopy)</li></ul><p>If you live outside France, apply with your local administration or your embassy or consulate, with:</p><ul><li>An identity document or birth certificate</li><li>A compliant identity photo</li><li>The completed official form</li><li>Proof of address</li><li>Payment of the application fee</li></ul>'],
  ] },
  { id: 'faq-5', t: 'Flights', items: [
    ['Who books my flight?', 'Formaskills Travel is not authorised to book long-haul international flights, but we can advise you on getting good fares. Flights to and from France are not included unless your proposal says so, so you find flights to suit your budget and dates.'],
    ['Do I need to book my flight before contacting you?', 'No. You can contact us before booking transport. It is often useful to discuss the programme first, so that arrival and departure times can be coordinated.'],
    ['How do I book an international flight?', `Searching for a flight is easy online. You can use flight comparison sites such as ${ext('https://www.ebookers.fr/Vols', 'Ebookers')}, ${ext('https://www.liligo.fr/', 'Liligo')}, ${ext('https://www.opodo.fr/', 'Opodo')}, ${ext('https://www.skyscanner.fr/', 'Skyscanner')}, ${ext('https://www.kiwi.com/fr/', 'Kiwi')}, or a travel agency near you.`],
    ['When should I book my flight?', 'Last minute is rarely the best time to book a flight, low-cost or scheduled. Book well in advance: each aircraft usually has a limited number of seats at the lowest fares, and once they are sold you rarely find a good price.'],
  ] },
  { id: 'faq-6', t: 'Health and insurance', items: [
    ['Is insurance included in the price of my stay?', 'Not automatically. Insurance is included only when your quotation or programme clearly says so. Otherwise participants or their sending organisation must make sure suitable cover is in place. Always check your proposal to see exactly what is and is not included.'],
    ['How do I tell you about accessibility needs?', 'Please describe the practical adjustments you may need without sending medical documents. We will review the accessibility of the proposed services with you before confirmation.'],
    ['Should I include health documents in my enquiry?', 'No. The first enquiry is for general needs. Do not send medical records, EHIC copies or unnecessary health data. Anything required is set by the contract and shared through a suitable channel.'],
  ] },
];

export const TEAM = [
  { n: 'Amel M.', r: 'Administration & Coordination', d: 'Amel supports the practical and administrative side of your project. She follows documents, practical information and day-to-day coordination, helping make sure the different elements of your programme remain clear and organised.' },
  { n: 'Rohith T.', r: 'Client Relations & Business Development', d: 'Rohith helps turn a first idea into a structured project. He discusses your group, objectives and requirements with you and supports the development of programmes and partnership opportunities.' },
];

export const PHOTO_CREDITS = [
  { img: '/assets/img/photos/hero-sm.jpg', place: 'Sète', by: 'GFreihalter', file: 'Sète (34) Canal Royal 263.jpg', fileHref: 'https://commons.wikimedia.org/wiki/File:S%C3%A8te_(34)_Canal_Royal_263.jpg', lic: 'CC BY-SA 4.0', licHref: 'https://creativecommons.org/licenses/by-sa/4.0' },
  { img: '/assets/img/photos/sete-sm.jpg', place: 'Sète', by: 'Christian Ferrer', file: 'La Plage de Sète, Hérault 02.jpg', fileHref: 'https://commons.wikimedia.org/wiki/File:La_Plage_de_S%C3%A8te,_H%C3%A9rault_02.jpg', lic: 'CC BY-SA 3.0', licHref: 'https://creativecommons.org/licenses/by-sa/3.0' },
  { img: '/assets/img/photos/montpellier-sm.jpg', place: 'Montpellier', by: 'Christian Ferrer', file: 'Château d’eau du Peyrou, Montpellier 02.jpg', fileHref: 'https://commons.wikimedia.org/wiki/File:Ch%C3%A2teau_d%27eau_du_Peyrou,_Montpellier_02.jpg', lic: 'CC BY 4.0', licHref: 'https://creativecommons.org/licenses/by/4.0' },
  { img: '/assets/img/photos/paris-sm.jpg', place: 'Paris', by: 'Taxiarchos228', file: 'Paris - Sacré-Cœur.jpg', fileHref: 'https://commons.wikimedia.org/wiki/File:Paris_-_Sacr%C3%A9-C%C5%93ur.jpg', lic: 'CC BY 3.0', licHref: 'https://creativecommons.org/licenses/by/3.0' },
  { img: '/assets/img/photos/nice-sm.jpg', place: 'Nice', by: 'Zairon', file: 'Nice Vieux-Nice 1.jpg', fileHref: 'https://commons.wikimedia.org/wiki/File:Nice_Vieux-Nice_1.jpg', lic: 'CC BY-SA 4.0', licHref: 'https://creativecommons.org/licenses/by-sa/4.0' },
];
