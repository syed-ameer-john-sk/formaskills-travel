import * as C from './content.mjs';
import { esc, icon, btn, notice, faqList, picture, franceMap, pageHero, ctaBand, logo, crumbs } from './layout.mjs';

const { SITE, NOTICE, DESTINATIONS, DEST_SHARED } = C;
const sec = (inner, cls = '', attrs = '') => `<section class="sec ${cls}" ${attrs}><div class="wrap">${inner}</div></section>`;
const head2 = (t, sub = '', cls = '') => `<header class="sec__head ${cls}"><h2 class="sec__title">${t}</h2>${sub ? `<p class="sec__sub">${sub}</p>` : ''}</header>`;
const steps = (arr, cls = '') => `<ol class="steps ${cls}">${arr.map((s, i) => `<li class="steps__i"><span class="steps__n" aria-hidden="true">${i + 1}</span><div>${typeof s === 'string' ? `<p>${s}</p>` : `<h3>${s.t}</h3><p>${s.d}</p>`}</div></li>`).join('')}</ol>`;
const ticks = (arr, cls = '') => `<ul class="ticks ${cls}">${arr.map(t => `<li>${icon('check')}<span>${t}</span></li>`).join('')}</ul>`;
const linkList = (arr) => `<ul class="linklist">${arr.map(([h, l]) => `<li><a href="${h}"><span>${l}</span>${icon('arrow')}</a></li>`).join('')}</ul>`;
const destUrl = (d) => `/destinations/${d.slug}/`;

// =============== Shared blocks ===============
const destPanel = (d, i, { full = true } = {}) => `
<article class="dpanel" id="map-${d.slug}" data-dest-panel="${d.slug}" ${i ? 'hidden' : ''} role="tabpanel" aria-labelledby="tab-${d.slug}">
  <figure class="dpanel__fig">${picture(d.img, d.alt, '(min-width: 900px) 40vw, 100vw')}</figure>
  <div class="dpanel__body">
    <p class="tag">${d.tag}</p>
    <h3 class="dpanel__name">${d.name}</h3>
    ${full ? `<p>${d.summary}</p>${ticks(d.highlights, 'ticks--compact')}` : ''}
    <p class="period">${icon('clock')}<span>Recommended period <b>${d.period}</b></span></p>
    ${btn(destUrl(d), `Explore ${d.name}`, 'secondary')}
  </div>
</article>`;

const mapSection = ({ full = true, title = 'Explore our destinations on the map', id = 'destinations', after = '' } = {}) => sec(`
  <div class="mapx" data-map>
    <div class="mapx__intro">
      <p class="kicker">Featured destinations</p>
      <h2 class="sec__title">${title}</h2>
      <p class="sec__sub">Select a destination to discover its atmosphere and recommended period.</p>
      <div class="mapx__tabs" role="tablist" aria-label="Choose a destination">
        ${DESTINATIONS.map((d, i) => `<button type="button" role="tab" id="tab-${d.slug}" aria-selected="${i === 0}" aria-controls="map-${d.slug}" data-dest-tab="${d.slug}">${d.name}</button>`).join('')}
      </div>
      <div class="mapx__map">${franceMap()}</div>
    </div>
    <div class="mapx__panels">${DESTINATIONS.map((d, i) => destPanel(d, i, { full })).join('')}</div>
  </div>
  ${after}`, 'sec--map', `id="${id}"`);

const orgService = (s, { cta = 'Submit tailored request', orgOnly = true } = {}) => `
<div class="svc">
  <div class="svc__main">
    <h3 class="svc__title">${s.t}</h3>
    ${s.intro.map((p, i) => `<p class="${i ? 'svc__note' : 'svc__lead'}">${p}</p>`).join('')}
    ${orgOnly && s.orgOnlyIntro ? s.orgOnlyIntro.map(p => `<p class="svc__note">${p}</p>`).join('') : ''}
    <dl class="svc__suits"><dt>Who it suits</dt><dd>${s.suits}</dd></dl>
    <div class="svc__cols">
      <div><h4 class="mini">Aims you can set with us</h4><ul class="aims">${s.aims.map(a => `<li>${a}</li>`).join('')}</ul></div>
      <div><h4 class="mini">What we can arrange</h4>${ticks(s.arrange, 'ticks--compact')}</div>
    </div>
    ${s.online ? `<div class="svc__online"><h4>${s.online.t}</h4><p>${s.online.d}</p></div>` : ''}
    <h4 class="mini">From first message to the programme</h4>
    <ol class="route">${s.steps.map((t, i) => `<li><span aria-hidden="true">${i + 1}</span>${t}</li>`).join('')}</ol>
  </div>
  <aside class="svc__side">
    <div class="good"><h4>Good to know</h4><p>${s.good}</p></div>
    ${btn(`/contact/?topic=${s.topic}#write`, s.offerCta && !orgOnly ? s.offerCta : cta)}
    ${notice('notice--sm')}
    ${s.official ? `<div class="good good--plain"><h4>Official information</h4><p>${s.official}</p></div>` : ''}
    ${faqList(s.faq, 'faq--compact')}
  </aside>
</div>`;

const orgTabs = (order, opts) => {
  const list = order.map(id => C.ORG_SERVICES.find(s => s.id === id));
  return `<div class="tabs" data-tabs>
    <div class="tabs__list" role="tablist" aria-label="What your organisation can do with us">
      ${list.map((s, i) => `<button type="button" role="tab" id="t-${s.id}" aria-controls="${s.id}" aria-selected="${i === 0}" data-tab="${s.id}">${s.tab}</button>`).join('')}
      <a class="tabs__link" href="/contact/#write">Others</a>
    </div>
    ${list.map((s, i) => `<div class="tabs__panel" role="tabpanel" id="${s.id}" aria-labelledby="t-${s.id}" tabindex="0" ${i ? 'hidden' : ''}>${orgService(s, opts)}</div>`).join('')}
  </div>`;
};

const clearStart = () => sec(`${head2('Clear from the start')}
  <div class="trio">${C.CLEAR_START.map((c, i) => `<div class="trio__i trio__i--${i}"><h3>${c.t}</h3><p>${c.d}</p></div>`).join('')}</div>`, 'sec--tint');

const meOffer = (o, i, { detailed = false } = {}) => `
<article class="offer" id="${o.id}">
  <div class="offer__head">
    <span class="offer__n" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>
    <h3>${o.t}</h3>
    ${detailed ? `<span class="badge badge--${o.statusKey}">${o.status}</span>` : ''}
  </div>
  <p>${o.forMeText && !detailed ? o.forMeText : o.short}</p>
  ${o.id === 'o-learn' ? `<p class="muted">${C.FORMAT_NOTE}</p><p class="muted">${C.FORMAT_NOTE2}</p>` : ''}
  ${detailed ? `<dl class="facts">${o.details.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>` : ''}
  ${btn(o.href, detailed ? o.cta2 : o.cta, 'secondary')}
</article>`;

const forMeBlocks = ({ detailed = false } = {}) => `
${sec(`<div class="split split--if"><div>${head2('This is for you if…')}</div>${ticks(C.FOR_ME_IF, 'ticks--lg')}</div>`)}
${sec(`${head2('Our offers for you', detailed ? 'Pick the offer that fits you. For Erasmus+ projects, see the Erasmus+ tab.' : 'Three ways we can help. Pick one to start.')}
  <div class="offers ${detailed ? 'offers--detailed' : ''}">${C.ME_OFFERS.map((o, i) => meOffer(o, i, { detailed })).join('')}</div>
  <div class="aside-card">
    <div><h3>Have a specific request?</h3><p>Something that does not fit a standard offer? Tell us what you have in mind and we shape it with you.</p></div>
    ${btn('/contact/#write', 'Make a tailor-made request')}
    ${detailed ? '' : `<p class="muted">Taking part in Erasmus+? It goes through your school or organisation. <a href="/for-organisations/">Start the organisation path</a></p>`}
  </div>`, 'sec--tint')}
${sec(`<div class="split">
  <div>${head2('How it works')}${steps(C.HOW_ME)}</div>
  <div>${head2('What helps us reply well')}${ticks(C.HELPS_REPLY)}</div></div>`)}
${sec(`<div class="split"><div>${head2('Common questions')}</div>${faqList(C.FAQ_ME)}</div>`)}
${sec(`<div class="split"><div>${head2('Before you travel')}</div>${linkList([['/practical-information/', 'Practical information'], ['/arriving-in-sete/', 'Arriving in Sète'], ['/destinations/', 'Destinations']])}</div>`, 'sec--tight')}`;

// =============== HOME ===============
const flightHero = () => `
<section class="flight" data-flight aria-labelledby="flight-h1">
  <div class="flight__stage" data-stage>
    <div class="fl-sky" aria-hidden="true"><div class="fl-stars"></div></div>
    <div class="fl-view" aria-hidden="true" data-view>
      <img class="fl-clouds" src="/assets/img/hero-clouds-hq.webp" width="2000" height="1116" alt="" fetchpriority="high" decoding="async" data-clouds>
      <div class="fl-france" data-france><img src="/assets/img/sete-aerial-hq.webp" width="2000" height="1116" alt="" decoding="async" data-france-img><div class="fl-haze" data-haze></div></div>
      <canvas class="fl-cloudlayer" data-cloudlayer></canvas>
      <canvas class="fl-birds" data-flock></canvas>
    </div>
    <div class="fl-cabin" aria-hidden="true" data-cabin><canvas data-cabin-canvas></canvas></div>

    <div class="fl-intro" data-intro>
      <div class="fl-intro__logo" data-intro-logo>${logo('logo--intro')}<img class="logo fl-intro__white" src="/assets/img/logo.png" width="2000" height="467" alt="" aria-hidden="true" data-intro-white></div>
      <p class="fl-intro__tag"><span>${SITE.tagline}</span></p>
    </div>

    <div class="fl-copy fl-copy--window" data-copy1>
      <p class="fl-eyebrow">${SITE.tagline}</p>
      <h1 id="flight-h1" class="fl-h1">Your journey begins before you land.</h1>
      <p class="fl-lead">Start a conversation. Discover a place. Come back with a new outlook. Group programmes, mobility projects, cultural stays and French learning, built around your goals.</p>
      <div class="actions actions--center">${btn('/plan-your-stay/', 'Find my project', 'light')}</div>
      <p class="fl-small">In person, online or through a stay.</p>
    </div>

    <div class="fl-copy fl-copy--france" data-copy2 aria-hidden="true">
      <p class="fl-big">France begins<br>before you land.</p>
    </div>

    <div class="fl-copy fl-copy--land" data-copy3 aria-hidden="true">
      <p class="fl-place">${icon('pin')}<span>Sète, Mediterranean coast</span></p>
      <p class="fl-land">Learn. Explore.<br>Experience. Grow.</p>
    </div>

    <div class="fl-hud" aria-hidden="true">
      <div class="fl-alt"><span>Altitude</span><b data-alt>10 670</b><span>m</span></div>
      <div class="fl-bar"><i data-bar></i></div>
    </div>
    <div class="fl-scrollhint" data-cue aria-hidden="true">
      <span class="fl-scrollhint__mouse"><i></i></span>
      <span class="fl-scrollhint__label" data-cue-label>Scroll to begin your journey</span>
      <span class="fl-scrollhint__chev"><i></i><i></i><i></i></span>
    </div>
    <button class="fl-skip" type="button" data-skip>Skip intro</button>
  </div>
</section>`;

const home = () => `
${flightHero()}
<div class="after-flight" id="explore">
${sec(`
  <div class="paths">
    ${[
      ['For me', 'Learn French, explore France and plan a stay around your interests.', '/what-we-offer/#me', 'Explore for me', 'users'],
      ['For my organisation', 'Plan a group programme or mobility project for your learners or staff.', '/what-we-offer/#org', 'Explore for organisations', 'building'],
      ['Become a partner', 'Offer your classes, accommodation or activities to learners and visitors.', '/partners/', 'Explore for partners', 'handshake'],
    ].map(([k, h, href, l, ic]) => `<article class="path"><p class="path__k">${icon(ic)}<span>${k}</span></p><h2 class="path__h">${h}</h2><a class="path__a" href="${href}"><span>${l}</span>${icon('arrow')}</a></article>`).join('')}
  </div>
  ${notice()}`, 'sec--paths')}

${sec(`<div class="why">
  <div class="why__head">${head2('Why Formaskills Travel?')}<figure class="why__fig">${'<img src="/assets/img/experience_sete.jpg" alt="Four young travellers walking along a harbour wall in Sète" loading="lazy" decoding="async">'}</figure></div>
  <div class="why__grid">${C.WHY.map(w => `<div class="why__i">${icon(w.icon)}<h3>${w.t}</h3><p>${w.d}</p></div>`).join('')}</div>
</div>`)}

${mapSection({ after: `<div class="actions actions--map">${btn('/destinations/', 'Explore All Destinations')}${btn('/contact/#write', 'Make a personalised request', 'ghost')}</div>` })}

${sec(`<div class="how">
  <div><p class="kicker">How it works</p><h2 class="sec__title">Three simple steps</h2></div>
  ${steps(C.STEPS3, 'steps--flight')}
</div>`)}

${ctaBand()}
</div>`;

// =============== WHAT WE OFFER ===============
const bubbles = (lines) => `<ul class="bubbles" aria-label="Introduction">${lines.map((l, i) => `<li style="--i:${i}">${l}</li>`).join('')}</ul>`;
const whatWeOffer = () => `
${pageHero({ crumb: [['/what-we-offer/', 'Our offers']], title: 'What we offer',
  lead: ['Language, educational, professional and cultural programmes in France, for groups, schools, universities, training organisations and companies. Choose one service or combine several. Each service shows how available it is today.'] })}
<section class="sec sec--switch"><div class="wrap">
  <h2 class="mini mini--lg">Where would you like to start?</h2>
  <div class="aud" role="tablist" aria-label="Where would you like to start?" data-aud>
    <button type="button" role="tab" id="aud-me" aria-controls="me" aria-selected="true" data-aud-tab="me">${icon('users')}<span>For me</span></button>
    <button type="button" role="tab" id="aud-org" aria-controls="org" aria-selected="false" data-aud-tab="org">${icon('building')}<span>For my organisation</span></button>
  </div>
</div></section>
<div id="me" role="tabpanel" aria-labelledby="aud-me" data-aud-panel="me">
  ${sec(`<div class="split"><div><p class="lead">Learn French, explore France and plan a stay around your interests.</p></div>${bubbles(['Hello! Want to learn French, or plan a stay in France?', 'Tell us your level, your interests and your dates.', 'We will suggest what could fit. An enquiry is not a booking.'])}</div>`, 'sec--tight')}
  ${forMeBlocks({ detailed: true })}
</div>
<div id="org" role="tabpanel" aria-labelledby="aud-org" data-aud-panel="org" hidden>
  ${sec(`<div class="split"><div><p class="lead">Plan a group programme or mobility project for your learners or staff.</p></div>${bubbles(['Hello! Planning a group programme or a mobility project?', 'Tell us about your learners or staff, your goals and your timing.', 'We will outline what is possible and what still needs confirming.'])}</div>`, 'sec--tight')}
  ${sec(`${head2('What your organisation can do with us', 'Choose an option to see how it works.')}${orgTabs(C.ORG_ORDER_OFFERS, { cta: 'Request a tailored proposal', orgOnly: false })}`, '', 'id="offers"')}
  ${clearStart()}
</div>
${ctaBand()}`;

// =============== FOR ME ===============
const forMe = () => `
${pageHero({ crumb: [['/for-me/', 'For me']], title: 'Your French, your stay, your pace.',
  lead: ['Learn French, discover France and plan a stay around your interests.'],
  actions: `${btn('/destinations/', 'Destinations', 'ghost')}`,
  media: `<div class="collage"><div class="collage__a">${picture('/assets/img/photos/sete', 'The beach at Sète', '(min-width: 900px) 30vw, 70vw')}</div><div class="collage__b">${picture('/assets/img/photos/montpellier', 'The Château d’eau du Peyrou in Montpellier', '(min-width: 900px) 20vw, 50vw')}</div></div>` })}
${sec(`<ul class="jump">${C.ME_OFFERS.map(o => `<li><a href="#${o.id}">${o.t}</a></li>`).join('')}</ul>`, 'sec--tight')}
${forMeBlocks()}
${ctaBand()}`;

// =============== LEARN FRENCH ===============
const learnFrench = () => `
${pageHero({ crumb: [['/learn-french/', 'Learn French']], title: 'French courses for individuals and groups',
  lead: ['Learn French online as an individual, or organise a face-to-face or blended programme for your group in France. We help you identify a suitable format based on your level, objectives and availability.', C.FORMAT_NOTE, C.FORMAT_NOTE2],
  actions: `${btn('/plan-your-stay/?for=me&purpose=learn', 'Plan my stay')}${btn('/contact/', 'Enquire', 'ghost')}` })}
${sec(`<div class="split"><div>${head2('From class to conversation', 'French as a foreign language (FLE) is for people learning French as a new language, for daily life, study or work. Your goals shape the course.')}</div>
  <div class="trio trio--stack">${[['Your level', 'Beginner or confident speaker: tell us what you know and what you want to improve.'], ['Your goal', 'Speak, understand, write or prepare for a specific situation.'], ['Your pace', 'Learn online at a pace that fits your dates and availability.']].map(([t, d], i) => `<div class="trio__i trio__i--${i}"><h3>${t}</h3><p>${d}</p></div>`).join('')}</div></div>`)}
${sec(`<div class="formats">
  <div class="formats__i"><h2 class="sec__title">Course formats</h2><p>Online learning for individual learners. Face-to-face and blended FLE programmes in France are for groups.</p>${ticks(['French learning online, and FLE programmes in France for groups'])}</div>
  <div class="formats__i"><h2 class="sec__title">For every level</h2><p>From complete beginners to advanced learners.</p><div class="levels" aria-hidden="true">${['No French yet', 'Beginner', 'Intermediate', 'Advanced'].map((l, i) => `<span style="--l:${i + 1}">${l}</span>`).join('')}</div></div>
</div>`, 'sec--tint')}
${sec(`<div class="split"><div>${head2('Online learning, and a stay if you wish', 'Alongside your online learning, you can ask about cultural activities and a stay in Sète, Montpellier, Paris or Nice. We look at activities and stay services for each enquiry. You can also suggest another destination.')}${btn('/destinations/', 'Destinations', 'ghost')}</div>${ticks(['Accommodation, transfers and local transport help'], 'ticks--lg')}</div>`)}
${sec(`<div class="split"><div>${head2('Good questions, practical answers')}</div>${faqList([
  ['Do you offer online French courses?', 'Yes. French can be learned online through our learning platform, which is open to individual learners. Face-to-face FLE programmes in France are for groups.'],
  ['Are classes suitable for my level?', 'Share your estimated level and when you want to use French. If you do not know your level, just tell us.'],
  ['Can you arrange classes for a school group?', 'Yes, on request. Share the group size, ages, levels, goals, period and destination. Content and arrangements are agreed after discussion.']])}</div>`)}
${ctaBand({ title: 'Ready to ask?', text: 'Describe what you need and a member of our team will reply.', actions: `${btn('/plan-your-stay/?for=me', 'Plan my stay', 'light')}${btn('/contact/', 'Enquire', 'ghost-light')}` })}`;

// =============== FOR ORGANISATIONS ===============
const forOrg = () => `
${pageHero({ crumb: [['/for-organisations/', 'For my organisation']], title: 'Programmes shaped around your learners.',
  lead: ['Programmes for schools, universities, training providers, language schools and mobility organisations. Tell us who is coming, when, and what they should gain.'],
  actions: `<a class="inline-cta" href="/for-organisations/plan-group-mobility/">${icon('check')}<span>Planning a group mobility? Use our step-by-step checklist</span>${icon('arrow')}</a>`,
  media: `<div class="collage"><div class="collage__a">${picture('/assets/img/photos/montpellier', 'The Château d’eau du Peyrou in Montpellier', '(min-width: 900px) 30vw, 70vw')}</div><div class="collage__b">${picture('/assets/img/photos/sete', 'The beach at Sète', '(min-width: 900px) 20vw, 50vw')}</div></div>` })}
${sec(`${head2('What your organisation can do with us', 'Choose an option to see how it works.')}${orgTabs(['french-and-immersion', 'cultural-experiences', 'job-shadowing', 'erasmus-plus', 'accommodation-and-transport', 'local-coordination', 'group-programmes'], { cta: 'Submit tailored request', orgOnly: true })}`, '', 'id="offers"')}
${clearStart()}
${ctaBand()}`;

const groupMobility = () => `
${pageHero({ crumb: [['/for-organisations/', 'For my organisation'], ['/for-organisations/plan-group-mobility/', 'Plan group mobility']], title: 'A group to support. A project to prepare together.',
  lead: ['Schools, training organisations and teams: use this checklist before asking for a proposal.', 'You do not need to have every detail ready. Share what you already know, and we will identify the points that need clarification.'] })}
${sec(`<div class="checklist" data-checklist>
  <div class="checklist__meter"><span data-check-count>0</span> of ${C.GROUP_MOBILITY.length} ready <i><b data-check-bar></b></i></div>
  <ol class="checklist__list">${C.GROUP_MOBILITY.map(([t, d], i) => `<li><label><input type="checkbox" data-check="${i}"><span class="checklist__box" aria-hidden="true">${icon('check')}</span><span><h2>${t}</h2><p>${d}</p></span></label></li>`).join('')}</ol>
  <p class="muted">There is no need to send named pupil data in a first enquiry. Ticking items here only helps you prepare; nothing is sent or stored.</p>
</div>`)}
${ctaBand({ title: 'Tell us about your organisation.', text: 'Share what you already know. We identify the points that need clarification.', actions: `${btn('/contact/?topic=groupmob#write', 'Submit tailored request', 'light')}${btn('/plan-your-stay/?for=org&type=group&topic=groupmob', 'Plan my project', 'ghost-light')}` })}`;

// =============== DESTINATIONS ===============
const destinations = () => `
${pageHero({ crumb: [['/destinations/', 'Destinations']], title: 'Discover our main destinations in France',
  lead: ['Explore our featured destinations in France and find a setting that suits your project. Looking for somewhere else? Send us a personalised request.'],
  actions: btn('/contact/#write', 'Make a personalised request') })}
<section class="sec" id="cards"><div class="wrap"><h2 class="sr-only">Destination cards</h2>
  <div class="dests">${DESTINATIONS.map((d, i) => `
    <article class="dest ${i % 2 ? 'dest--flip' : ''}">
      <a class="dest__fig" href="${destUrl(d)}" tabindex="-1" aria-hidden="true"><div data-parallax>${picture(d.img, d.alt, '(min-width: 900px) 55vw, 100vw')}</div></a>
      <div class="dest__body">
        <p class="tag">${d.tag}</p>
        <h3 class="dest__name"><a href="${destUrl(d)}">${d.name}</a></h3>
        <p>${d.summary}</p>
        ${ticks(d.highlights, 'ticks--compact')}
        <p class="period">${icon('clock')}<span>Recommended period <b>${d.period}</b></span></p>
        ${btn(destUrl(d), `Explore ${d.name}`, 'secondary')}
      </div>
    </article>`).join('')}</div>
</div></section>
${mapSection({ full: false, id: 'map' })}
${ctaBand({ title: 'Looking for another destination?', text: 'Submit a personalised request for another destination in France or elsewhere, depending on what can realistically be organised. Tell us what you have in mind and our team will look at it.', actions: btn('/contact/', 'Make a personalised request', 'light') })}`;

const destination = (d) => {
  const others = DESTINATIONS.filter(o => o !== d);
  return `
<section class="dhero" data-dhero>
  <div class="dhero__img" data-parallax-hero>${picture(d.img, d.alt, '100vw', '', true)}</div>
  <div class="wrap dhero__in">
    ${crumbs([['/destinations/', 'Destinations'], [destUrl(d), d.name]])}
    <p class="tag tag--light">${d.tag}</p>
    <h1 class="dhero__name" data-split>${d.name}</h1>
  </div>
</section>
${sec(`<div class="split">
  <div><p class="lead">${d.summary}</p><div class="actions">${btn(`/plan-your-stay/?for=me&city=${d.slug}`, d.meCta)}${btn('/contact/', 'Enquire', 'ghost')}</div></div>
  <aside class="factcard"><p class="period">${icon('clock')}<span>Recommended period <b>${d.period}</b></span></p>${ticks(d.highlights, 'ticks--compact')}</aside>
</div>`)}
${sec(`${head2('Famous for')}<div class="famous">${d.famous.map(f => `<div class="famous__i"><h3>${f.t}</h3><p>${f.d}</p></div>`).join('')}</div>`, 'sec--tint')}
${sec(`${head2(`Build your project in ${d.name}`, `Beyond the visit, here is how a group project can take shape in ${d.name}.`)}
  <div class="quad">${[['Who it suits', DEST_SHARED.suits, 'users'], ['Best period', d.best, 'clock'], ['French course options', DEST_SHARED.french, 'chat'], ['Possible activities', d.activities, 'compass']].map(([t, p, ic]) => `<div class="quad__i">${icon(ic)}<h3>${t}</h3><p>${p}</p></div>`).join('')}</div>`)}
${sec(`<div class="split">
  <div>${head2(`Plan your programme in ${d.name}`, DEST_SHARED.plan)}<div class="actions">${btn(`/plan-your-stay/?for=org&city=${d.slug}`, 'Plan your programme')}${btn('/contact/', 'Enquire', 'ghost')}</div></div>
  <div class="example"><h2 class="example__t">${d.example.t}</h2><p>${d.example.d}</p></div>
</div>`)}
${d.practical ? sec(`<div class="split"><div>${head2('Practical information')}</div>${linkList([['/practical-information/', 'Practical information'], ['/arriving-in-sete/', 'Arriving in Sète']])}</div>`, 'sec--tight') : ''}
${ctaBand({ title: 'How an enquiry works', text: 'Tell us what you have in mind. A member of our team replies.', actions: `${btn(`/plan-your-stay/?for=me&city=${d.slug}`, d.meCta, 'light')}${btn('/contact/', 'Enquire', 'ghost-light')}` })}
${sec(`${head2('Destinations')}<div class="minidests">${others.map(o => `<a class="minidest" href="${destUrl(o)}">${picture(o.img, '', '(min-width: 900px) 25vw, 50vw')}<span class="minidest__t"><b>${o.name}</b><small>${o.tag}</small></span></a>`).join('')}<a class="minidest minidest--all" href="/destinations/"><span class="minidest__t"><b>Explore All Destinations</b>${icon('arrow')}</span></a></div>`)}`;
};

// =============== TOURISM / AU PAIR ===============
const tourism = () => `
${pageHero({ crumb: [['/tourism/', 'Cultural activities and local experiences']], title: 'The pleasure of discovery, pure and simple.',
  lead: ['Visits and activities, with or without French classes.', 'Tell us which of our featured destinations interests you and what you would like to discover, with or without French classes.'],
  media: `<figure class="phero__photo">${picture('/assets/img/photos/nice', 'A narrow street in the old town of Nice', '(min-width: 900px) 45vw, 100vw')}</figure>` })}
${sec(`<div class="status-line"><span class="badge badge--dev">In development</span><p><b>Cultural activities and local experiences.</b> Tourism programmes are in development. You can register your interest. Nothing is confirmed until we reply.</p></div>
<div class="trio">${[['Heritage and neighbourhoods', 'Explore the places and stories that give a destination its character.'], ['Culture and flavours', 'Share your interests in visits, local culture and food.'], ['At your pace', 'A programme for an individual, a family or a group.']].map(([t, d], i) => `<div class="trio__i trio__i--${i}"><h2>${t}</h2><p>${d}</p></div>`).join('')}</div>
<p class="muted">Activities, reservations and availability are set out in a proposal.</p>`)}
${ctaBand({ title: 'Tell us what you would like to discover', text: 'Register your interest and our team will reply.', actions: `${btn('/plan-your-stay/?for=me&purpose=discover', 'Tell us your interests', 'light')}${btn('/contact/', 'Register your interest', 'ghost-light')}` })}`;

const auPair = () => `
${pageHero({ crumb: [['/for-me/', 'For me'], ['/au-pair-and-host-families/', 'Au pair and host-family stays']], title: 'Au pair and host-family stays', lead: ['Arranged on request.'] })}
${sec(`<h2 class="sr-only">Au pair and host-family stays</h2><div class="choice">
  <a class="choice__i" href="/plan-your-stay/?for=me&purpose=aupair">${icon('users')}<span><b>Au pair stay (I would be the au pair)</b><small>Register your interest in a cultural exchange in France.</small></span>${icon('arrow')}</a>
  <a class="choice__i" href="/plan-your-stay/?for=me&purpose=hostfamily">${icon('building')}<span><b>Host family looking for an au pair</b><small>Tell us about your family, duties and home.</small></span>${icon('arrow')}</a>
</div>
<p class="muted">Our au pair and host-family network is in development. Registration does not guarantee a match or a placement.</p>
${notice()}`)}`;

// =============== PLANNER ===============
const planner = () => `
${pageHero({ crumb: [['/plan-your-stay/', 'Plan my project']], title: 'Plan my project', lead: ['Tell us what you need. Every question is optional. Skip anything you like.'] })}
<section class="sec sec--planner"><div class="wrap">
  <div class="planner" data-planner>
    <noscript><p>The project planner needs JavaScript. You can email us instead. <a href="mailto:${SITE.email}">Email us</a></p></noscript>
  </div>
</div></section>`;

// =============== PARTNERS ===============
const partners = () => `
${pageHero({ crumb: [['/partners/', 'Become a partner']], title: 'Let’s connect and create opportunities.',
  lead: ['Provide a service, host trainees or professionals, or build a long-term collaboration. One service or several: tell us what you can offer.'],
  actions: `${btn('#enquiry', 'Become a partner')}`,
  media: `<div class="collage"><div class="collage__a">${picture('/assets/img/photos/sete', 'The beach at Sète', '(min-width: 900px) 30vw, 70vw')}</div><div class="collage__b">${picture('/assets/img/photos/nice', 'A narrow street in the old town of Nice', '(min-width: 900px) 20vw, 50vw')}</div></div>` })}
${sec(ticks(['One service or several', 'Occasional or recurring', 'Host trainees, job shadowing or visits', 'A first contact does not commit you'], 'ticks--row'), 'sec--tight')}
${sec(`${head2('Who can partner with us?')}<div class="ptypes">${C.PARTNER_TYPES.map(([t, d], i) => `<article class="ptype"><h3>${t}</h3><p>${d}</p><a href="#enquiry" data-partner-cat="${i}"><span>Enquire as this partner</span>${icon('arrow')}</a></article>`).join('')}</div>`, '', 'id="fit"')}
${sec(`<div class="split"><div>${head2('Why partner with us?', 'We connect international groups with authentic local experiences, and put your expertise at the centre.')}<p class="muted">Opportunities depend on each project, your availability and the fit.</p></div>
  <div class="quad quad--2">${C.PARTNER_WHY.map(([t, d]) => `<div class="quad__i"><h3>${t}</h3><p>${d}</p></div>`).join('')}</div></div>`, 'sec--tint', 'id="why"')}
${sec(`<div class="split">
  <div>${head2('Host international trainees & professionals', 'Depending on the project: a work placement, professional observation, job shadowing or an educational visit.')}
    <p>Fresh ideas, intercultural exchange, and the chance to share your expertise with future professionals. You may also meet international profiles, with no automatic recruitment commitment.</p>
    <p>Every project is discussed individually. Profile, objectives, tasks, duration, working conditions, supervision and documents are agreed before a placement is confirmed.</p>
    ${btn('#enquiry', 'Become a host organisation')}</div>
  <div class="versus"><h3 class="versus__h">Two different experiences</h3>
    <div class="versus__i"><h4>Work placement / traineeship</h4><p>The participant carries out defined tasks within an educational or professional framework.</p></div>
    <div class="versus__i"><h4>Job shadowing</h4><p>The participant comes primarily to observe, exchange and discover professional practices.</p></div></div>
</div>`, '', 'id="host"')}
${sec(`${head2('How partnership works')}${steps(C.PARTNER_PROCESS.map(([t, d]) => ({ t, d })), 'steps--row')}<p class="muted">Sending an enquiry does not automatically create a partnership.</p>`, 'sec--tint', 'id="process"')}
${sec(`<div class="split split--form">
  <div>${head2('Partnership enquiry', 'Tell us who you are and what you would like to discuss. This opens an email in your own email app. Nothing is sent from this website.')}</div>
  <form class="form" data-mailform="partner" novalidate>
    <div class="field"><label for="pf-org">Organisation name</label><input id="pf-org" name="Organisation" required autocomplete="organization"></div>
    <div class="field"><label for="pf-name">Contact person</label><input id="pf-name" name="Contact person" required autocomplete="name"></div>
    <div class="field"><label for="pf-email">Email</label><input id="pf-email" name="Email" type="email" required autocomplete="email"></div>
    <div class="field"><label for="pf-cat">Partner category</label><select id="pf-cat" name="Partner category" data-pf-cat><option value="">Choose…</option>${C.PARTNER_CATEGORIES.map(c => `<option value="${esc(c)}">${c}</option>`).join('')}</select>
      <p class="hint" data-pf-hint hidden>For companies interested in hosting trainees, job shadowing participants, professional visits, meetings or other work-based learning experiences.</p></div>
    <fieldset class="field"><legend>How would you like to work with us?</legend>
      <details class="multi"><summary>Choose…</summary><div class="multi__list">${C.PARTNER_WAYS.map((w, i) => `<label class="check"><input type="checkbox" name="How we could work together" value="${esc(w)}"><span>${w}</span></label>`).join('')}</div></details>
      <p class="hint">Select all that apply.</p></fieldset>
    <div class="field"><label for="pf-msg">Short message</label><textarea id="pf-msg" name="Message" rows="5"></textarea></div>
    <label class="check check--consent"><input type="checkbox" required data-consent><span>I agree that Formaskills Travel may use the details I enter to reply to this enquiry, as explained in the privacy policy (GDPR). <a href="/legal/privacy/">Privacy notice</a></span></label>
    <p class="form__err" data-form-err role="alert"></p>
    <div class="actions"><button class="btn btn--primary" type="submit"><span>Send enquiry</span>${icon('arrow')}</button><button class="btn btn--ghost" type="button" data-copy-form>${icon('copy')}<span>Copy message</span></button></div>
    <p class="fine">This opens your email app with your enquiry ready to send. Nothing is sent until you send the email.</p>
  </form>
</div>`, '', 'id="enquiry"')}
${sec(`<div class="split"><div>${head2('Common questions')}</div>${faqList(C.PARTNER_FAQ)}</div>`)}`;

// =============== PRACTICAL / ARRIVING / GUIDES ===============
const practical = () => `
${pageHero({ crumb: [['/for-me/', 'For me'], ['/practical-information/', 'Practical information']], title: 'Prepare for departure. Enjoy the experience.',
  lead: ['General guidance on health, insurance, documents and arrangements. Exact requirements depend on your situation and project.'] })}
${sec(`<p class="checked">${icon('clock')}<span>Last checked: November 2026. Rules can change — confirm current requirements with the relevant authorities or providers.</span></p>
<div class="prose-grid">
  <article><h2>The EHIC and travel insurance: two separate checks</h2><p>For a temporary stay in Europe, ask your health insurer whether you are entitled to a European Health Insurance Card (EHIC) and whether it is valid for your trip. The EHIC is not travel insurance and does not cover repatriation.</p><p>Check that your travel insurance suits your destination, duration and activities, including limits and exclusions. For a group, agree who checks cover.</p></article>
  <article><h2>Documents and participants</h2><p>Check identity documents, entry requirements and any permissions for minors with the relevant authorities.</p><p>Do not send medical records or copies of insurance cards in a first enquiry.</p></article>
  <article><h2>Before confirming</h2><p>Review included services, exclusions and the payment, change and cancellation conditions. A suggested visit or a photograph on this website is not an included service.</p></article>
</div>`)}
${sec(`<div class="split"><div>${head2('Frequently asked questions')}</div>${faqList([
  ['Can you advise on visas or funding?', 'We share general information only. Visa applications are completed by the traveller or their organisation, and funding decisions remain with the relevant organisation and National Agency. See <a href="/contact/#faq-4">Travel documents</a> and <a href="/contact/#faq-2">Erasmus+</a> in our FAQ.'],
  ['Does the EHIC replace travel insurance?', 'No. It helps with necessary healthcare in covered situations but does not cover repatriation. Check your cover and consider travel insurance. See Practical information.']])}</div>`)}`;

const arriving = () => `
${pageHero({ crumb: [['/for-me/', 'For me'], ['/arriving-in-sete/', 'Arriving in Sète']], title: 'The journey is part of the plan.',
  lead: ['Arriving by train, bus, car or air? Start here. Check times, fares and access conditions on the operators’ websites.'] })}
${sec(`<div class="quad">${[['Train', 'Plan your arrival at Sète station. Check routes, connections and accessibility with the operator before you travel.', 'arrow'], ['Local buses', 'Use the local transport authority’s journey planner for current routes, stops and times.', 'pin'], ['Car and group travel', 'Tell us your arrival point, group size and drop-off or parking needs.', 'users'], ['From an airport', 'Choose your airport around the whole journey, then check onward travel to Sète. Transfers are included only when stated in your proposal.', 'plane']].map(([t, d, ic]) => `<div class="quad__i">${icon(ic)}<h2>${t}</h2><p>${d}</p></div>`).join('')}</div>
<p class="muted">Transport information is provided to help you prepare your journey. Check current routes, timetables and fares directly with the transport operator. A transfer is included only when it is expressly listed in your confirmed programme.</p>`)}
${sec(`<div class="split"><div>${head2('Contact address in Sète', 'Please arrange your visit with the team. Classes and activities do not always take place at this address.')}</div><div class="addr"><p class="addr__l">${icon('pin')}<span>${SITE.address}</span></p>${btn('/contact/', 'Contact & FAQ', 'secondary')}</div></div>`, 'sec--tint')}`;

const guides = () => `
${pageHero({ crumb: [['/guides-and-resources/', 'Guides and resources']], title: 'Prepare carefully. Look forward to discovery.', lead: ['Guides and official sources for the next steps of your project.'] })}
${sec(`<p class="checked">${icon('clock')}<span>Last checked: November 2026. Requirements and links can change — always confirm with the official source before you rely on them.</span></p>
<div class="guides">${[['/for-organisations/plan-group-mobility/', 'Plan group mobility', 'A checklist for institutions, teams and accompanying adults.', 'users'], ['/practical-information/', 'Practical information', 'Checks to make before each stay.', 'check'], ['/arriving-in-sete/', 'Arriving in Sète', 'Operators and information to check for your journey.', 'plane']].map(([h, t, d, ic]) => `<a class="guide" href="${h}">${icon(ic)}<h2>${t}</h2><p>${d}</p>${icon('arrow', 'guide__go')}</a>`).join('')}</div>`)}
${sec(`<div class="split"><div>${head2('Official Erasmus+ guide, by sector')}<p class="muted">These links open official external websites. We do not control their content.</p></div>
<ul class="linklist">${[['https://erasmus-plus.ec.europa.eu/programme-guide/part-b/key-action-1/school-pupils-and-staff', 'School education'], ['https://erasmus-plus.ec.europa.eu/programme-guide/part-b/key-action-1/vet-learners-and-staff', 'Vocational education'], ['https://erasmus-plus.ec.europa.eu/programme-guide/part-b/key-action-1/higher-education-mobility-projects', 'Higher education']].map(([h, l]) => `<li><a href="${h}" target="_blank" rel="noopener"><span>${l}<span class="sr-only"> (opens in a new tab)</span></span>${icon('external')}</a></li>`).join('')}</ul></div>`, 'sec--tint')}`;

// =============== ABOUT ===============
const about = () => `
${pageHero({ crumb: [['/about/', 'About']], title: 'Learn. Connect.<br>Open up.',
  lead: ['We design and coordinate tailor-made learning, mobility and cultural programmes for schools, universities, training organisations, companies, mobility partners and organised groups.', 'Every project is built around your group, objectives and destination.'],
  actions: `${btn('/what-we-offer/', 'Explore our offers')}${btn('/plan-your-stay/?for=org', 'Plan your project', 'ghost')}`,
  media: `<figure class="phero__photo">${picture('/assets/img/photos/sete', 'The beach at Sète', '(min-width: 900px) 45vw, 100vw')}<figcaption>Tailor-made programmes</figcaption></figure>` })}
${sec(`<div class="split"><div>${head2('Who we are')}</div><div class="prose"><p>We are a France-based team specializing in international group programmes. We work with educational institutions, training organisations, companies, mobility partners and other organised groups looking for a reliable local contact in France.</p><p>Our role is to understand your project, identify suitable solutions and coordinate the agreed services with you from the preparation stage onwards.</p></div></div>`)}
${sec(`${head2('What we do', 'Choose one service or combine several into a programme tailored to your group.')}
<div class="quad">${[
  ['FLE – French for groups', 'French as a Foreign Language programmes designed for schools, universities, training organisations, companies and organised groups, with general, intensive and professional French options.', '/for-organisations/#french-and-immersion', 'Explore FLE programmes', 'chat'],
  ['Educational & professional mobility', 'Group mobility, job shadowing, professional observation and educational visits built around your learning or professional objectives.', '/for-organisations/#job-shadowing', 'Explore mobility programmes', 'building'],
  ['Cultural stays & local experiences', 'Cultural visits, heritage, gastronomy, activities and excursions selected according to your destination and the interests of your group.', '/for-organisations/#cultural-experiences', 'Explore cultural stays', 'compass'],
  ['Tailor-made group programmes', 'Combine language learning, accommodation coordination, meals, local transport, activities and local support according to your project.', '/for-organisations/#group-programmes', 'Plan a group programme', 'users'],
].map(([t, d, h, l, ic]) => `<div class="quad__i">${icon(ic)}<h3>${t}</h3><p>${d}</p><a class="more" href="${h}"><span>${l}</span>${icon('arrow')}</a></div>`).join('')}</div>
<div class="aside-card"><p>${C.FORMAT_NOTE}</p><p>Also available: online French courses (online FLE), to learn French online before, during or after a stay.</p>${btn('/for-organisations/#french-and-immersion', 'Explore FLE programmes', 'secondary')}</div>`, 'sec--tint')}
${sec(`<div class="where">
  <div>${head2('Where we work')}<div class="prose"><p>Our programmes can be organised across France, depending on your project, group profile, dates and the availability of suitable local partners and services.</p><p>Sète, Montpellier, Paris and Nice are currently our featured destinations, but other locations in France can be considered on request.</p><p><b>Looking for another destination in France? Tell us about your project.</b></p></div>
  <div class="actions">${btn('/destinations/', 'Explore our destinations')}${btn('/contact/#write', 'Request another destination', 'ghost')}</div></div>
  <div class="where__map">${franceMap(false)}</div></div>`)}
${sec(`${head2('How we work', 'Every project starts with your group and your objectives.')}${steps([
  { t: 'Tell us about your project', d: 'Share your group profile, objectives, dates, preferred destination and the services you need.' },
  { t: 'We shape your programme', d: 'We take the time to understand your priorities, constraints and expectations before identifying suitable services and local options. No two groups are the same, so the programme is built around your project rather than taken from a standard package.' },
  { t: 'We coordinate with you', d: 'Once the direction is clear, we coordinate the agreed elements of the programme and keep you informed about what is confirmed, what remains subject to availability and the next steps.' }], 'steps--row')}`, 'sec--tint')}
${sec(`<div class="split"><div>${head2('Our team')}<div class="prose"><p>At Formaskills Travel, every project starts with a conversation. Our team takes the time to understand your group, your objectives, your constraints and what you really expect from your experience in France.</p><p>We are not here to fit your project into a ready-made programme. We help turn your ideas into a clear, realistic and personalised experience, then coordinate the agreed services with you.</p><p>From the first inquiry to the preparation of your programme, you know who you are speaking to and who is following your project.</p></div></div>
<div class="team">${C.TEAM.map(m => `<article class="member"><span class="member__a" aria-hidden="true">${m.n[0]}</span><div><h3>${m.n}</h3><p class="member__r">${m.r}</p><p>${m.d}</p></div></article>`).join('')}<p class="muted">Different roles, one shared objective: making your project clear, relevant and well coordinated.</p></div></div>`)}
${ctaBand({ title: 'Have a project in mind?', text: `Tell us about your group, your objectives and your destination. Phone hours: ${SITE.hours}`, actions: `${btn('/plan-your-stay/?for=org', 'Plan your project', 'light')}${btn('/contact/', 'Contact us', 'ghost-light')}` })}`;

// =============== CONTACT ===============
const contact = () => `
${pageHero({ crumb: [['/contact/', 'Contact & FAQ']], title: 'Contact', lead: ['Write to us, call us, or start an enquiry. Our team replies personally.'] })}
${sec(`<div class="split split--form">
  <form class="form" id="write" data-mailform="contact" novalidate>
    <h2 class="sec__title">Write to us</h2>
    <div class="field"><label for="cf-email">Email</label><input id="cf-email" name="Email" type="email" required autocomplete="email"></div>
    <div class="field"><label for="cf-subject">Subject</label><input id="cf-subject" name="Subject" data-subject required></div>
    <div class="field"><label for="cf-msg">Your message</label><textarea id="cf-msg" name="Message" rows="7" required></textarea></div>
    <label class="check check--consent"><input type="checkbox" required data-consent><span>I agree that Formaskills Travel may contact me about this enquiry. <a href="/legal/privacy/">Privacy notice</a></span></label>
    <p class="form__err" data-form-err role="alert"></p>
    <div class="actions"><button class="btn btn--primary" type="submit"><span>Open in my email app</span>${icon('arrow')}</button><button class="btn btn--ghost" type="button" data-copy-form>${icon('copy')}<span>Copy message</span></button></div>
    <p class="fine">This opens your email app with your enquiry ready to send. Nothing is sent until you send the email.</p>
  </form>
  <aside class="reach">
    <h2 class="sec__title">Other ways to reach us</h2>
    <dl class="reach__dl"><div><dt>${icon('mail')}Email</dt><dd><a href="mailto:${SITE.email}">${SITE.email}</a></dd></div><div><dt>${icon('phone')}Phone</dt><dd><a href="tel:${SITE.tel}">${SITE.phone}</a></dd></div></dl>
    <p>Write to us in your language.</p>
    ${btn('/plan-your-stay/', 'Start planning my project', 'secondary')}
    <p class="fine">Sending an enquiry is not a booking. Nothing is reserved or charged. We use your details only to reply to your enquiry. <a href="/legal/privacy/">Privacy notice</a></p>
  </aside>
</div>`)}
${sec(`${head2('Frequently asked questions')}
<div class="faqcat" data-faqcat>
  <nav class="faqcat__nav" aria-label="FAQ categories"><ul>${C.FAQ_CONTACT.map((c, i) => `<li><a href="#${c.id}" ${i === 0 ? 'aria-current="true"' : ''}><span>${c.t}</span><small>${c.items.length}</small></a></li>`).join('')}</ul></nav>
  <div class="faqcat__body">${C.FAQ_CONTACT.map(c => `<section class="faqcat__sec" id="${c.id}"><h3 class="faqcat__h">${c.t}</h3>${faqList(c.items)}</section>`).join('')}</div>
</div>`, 'sec--tint')}
${sec(`${head2('Directions')}<div class="dir">
  <div class="dir__info">
    <h3>Address</h3><p class="addr__l">${icon('pin')}<span data-address>${SITE.address}</span></p>
    <div class="actions"><button class="btn btn--ghost" type="button" data-copy-text="${SITE.address}">${icon('copy')}<span>Copy address</span></button><a class="btn btn--ghost" href="${SITE.mapsDir}" target="_blank" rel="noopener">${icon('external')}<span>Open in Google Maps<span class="sr-only"> (opens in a new tab)</span></span></a></div>
    <p class="muted">Please arrange your visit with the team. Classes and activities do not always take place at this address.</p>
    <h3>Operating hours</h3>
    <dl class="hours"><div><dt>Weekdays</dt><dd>08:30 AM - 04:30 PM</dd></div><div><dt>Weekends</dt><dd>Closed</dd></div></dl><p class="muted">France time</p>
  </div>
  <div class="dir__map" data-gmap="${SITE.mapsEmbed}">
    <div class="dir__consent">${icon('pin')}<p>The map connects to Google only after your choice. You can also open directions in a new tab.</p><button class="btn btn--secondary" type="button" data-gmap-show>Show Google Maps</button></div>
  </div>
</div>`)}`;

// =============== LEGAL ===============
const legal = (title, path, body) => `${pageHero({ crumb: [['/legal/legal-notices/', 'Legal'], [path, title]], title, cls: 'phero--compact' })}${sec(`<div class="prose prose--legal">${body}</div>`)}`;
const legalNotices = () => legal('Legal notices', '/legal/legal-notices/', `
<dl class="ldl">${[['Publisher', 'FORMASKILLS TRAVEL'], ['Legal form', 'SAS'], ['Share capital', '[share capital] euros — to be completed before publication'], ['SIREN', '990 746 430'], ['SIRET', '990 746 430 00018'], ['Trade register', 'Montpellier'], ['VAT number', 'FR28990746430'], ['Registered office', '10 rue du Micocoulier, 34680 Saint-Georges-d’Orques, France'], ['Contact address in Sète', SITE.address], ['Person responsible for publication', '[Full name and capacity] — to be completed before publication'], ['Hosting provider', '[Hosting provider’s legal name, postal address and telephone number] — to be completed before publication'], ['Contact', `<a href="mailto:${SITE.email}">${SITE.email}</a> · <a href="tel:${SITE.tel}">${SITE.phone}</a>`]].map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>
<h2>Website scope</h2><p>This website presents offers and prepares email enquiries. It does not conclude bookings or accept online payments. Services and conditions are set out in the applicable proposal.</p>
<h2>Tourism services and insurance</h2><p>The business registration number identifies the company. It is not a travel-operator registration. This website does not claim an Atout France registration, a financial guarantee, professional liability insurance or a travel insurance policy. Requirements depend on the services actually organised or sold and must be checked before they are marketed.</p>`);
const privacy = () => legal('Privacy notice', '/legal/privacy/', `
<h2>Data controller</h2><p>FORMASKILLS TRAVEL (SAS), registered office 10 rue du Micocoulier, 34680 Saint-Georges-d'Orques, France. Contact: <a href="mailto:${SITE.email}">${SITE.email}</a> · <a href="tel:${SITE.tel}">${SITE.phone}</a>.</p>
<h2>What we collect</h2><p>We only collect what you choose to give us: your contact details (such as name, email and phone), your organisation when relevant, and the information you provide about your project or enquiry. If you tick the optional marketing box, we also record that choice. We do not ask for health, passport or payment details, and we ask you not to send them.</p>
<h2>Why we use it and our legal basis</h2><ul><li>To answer your enquiry and discuss your project — on the basis of steps taken at your request before any contract, and our legitimate interest in replying.</li><li>To send occasional news and offers, only if you opt in — on the basis of your consent, which you can withdraw at any time.</li><li>To meet our legal obligations, where applicable.</li></ul>
<h2>How enquiries are sent</h2><p>The enquiry tools on this website prepare a message in your own email app; it is then sent from your email account to our address. This website does not store your planner answers on a server.</p>
<h2>Recipients and processors</h2><p>Your data is handled by our team. We use a small number of service providers to run the website and reply to you, for example our website host and our email provider. If you use the website assistant, your messages are sent to an external AI service to generate replies. [Name the AI provider and any other processors — to be confirmed before publication.] We do not sell your data.</p>
<h2>Transfers outside the European Union</h2><p>Some providers may process data outside the European Union. Where this happens, we rely on appropriate safeguards such as the European Commission's standard contractual clauses. [Confirm which providers and safeguards apply.]</p>
<h2>How long we keep it</h2><p>We keep enquiry data only as long as needed to handle your request and for a reasonable period afterwards, then delete or anonymise it. Marketing consent is kept until you withdraw it. [Confirm exact retention periods before publication.]</p>
<h2>Your rights</h2><p>You have the right to access, correct, delete or restrict your data, to object to certain processing, to data portability, and to withdraw consent at any time. You can also lodge a complaint with the French data protection authority (CNIL).</p>
<h2>How to exercise your rights</h2><p>Email us at <a href="mailto:${SITE.email}">${SITE.email}</a>. We will reply within the time limits set by law.</p>`);
const cookies = () => legal('Cookie policy', '/legal/cookies/', `
<p>This website does not set advertising or analytics cookies and does not track you across other websites.</p>
<h2>Local storage on your device</h2><p>We use your browser's local storage only to remember your choices on this site, such as the assistant notice you have accepted or your language preference. This information stays on your device and is not shared with us or third parties.</p>
<h2>Maps</h2><p>The contact map is provided by Google Maps and loads only when you choose to display it. When it loads, Google may set its own cookies. You can choose not to display the map.</p>
<h2>If this changes</h2><p>We keep this page under review. If we add a tool that requires consent, we will ask for your consent first, block it until you accept, make refusing as easy as accepting, and let you change your choice at any time.</p>`);
const accessibility = () => legal('Accessibility statement', '/legal/accessibility/', `
<p>We want this website to be usable by everyone. Our target is level AA of the Web Content Accessibility Guidelines (WCAG 2.2).</p>
<h2>Current status</h2><p>This website has not yet been formally tested with assistive technology.</p>
<h2>Report a problem</h2><p>If you cannot use part of this website, please email us and we will help. <a href="mailto:${SITE.email}">${SITE.email}</a></p>
<h2>Known limits</h2><p>We have carried out our own checks during development; no formal external audit has been done yet. Known limits we are aware of include: the interactive destinations map and the AI assistant have not been fully tested with screen readers or keyboard-only navigation; some embedded third-party content, such as maps, may not meet the same standards; and formal testing with assistive technologies is still to be completed. We will update this statement as checks are carried out.</p>
<h2>Motion</h2><p>The home page opens with a scroll-driven flight animation. If your device asks for reduced motion, the animation is replaced by a still view, and you can skip it at any time with the “Skip intro” button.</p>
<p class="muted">Last reviewed: November 2026.</p>`);
const credits = () => legal('Photography credits and licences', '/legal/photo-credits/', `
<p>These photographs show real places. Each is used under its original licence.</p>
<p>Adaptations: resizing, compression and display cropping. Adaptations of CC BY-SA photographs are shared under the same licence.</p>
<ul class="credits">${C.PHOTO_CREDITS.map(c => `<li><img src="${c.img}" alt="" loading="lazy"><div><b>${c.place}</b><span>Photograph by ${c.by}</span><span><a href="${c.fileHref}" target="_blank" rel="noopener">${c.file}</a> · <a href="${c.licHref}" target="_blank" rel="noopener">${c.lic}</a></span></div></li>`).join('')}</ul>
<p class="muted">Other images on this website, including the aerial view of Sète and the cloud scenery, are supplied by Formaskills Travel.</p>`);

const search = () => `
${pageHero({ crumb: [['/search/', 'Search']], title: 'Search', cls: 'phero--compact' })}
${sec(`<form class="search__form search__form--page" action="/search/" role="search" data-search-form><label class="sr-only" for="q-page">Search</label>${icon('search')}<input id="q-page" name="q" type="search" placeholder="For example: Sète, Erasmus+, au pair, courses" data-search-input data-search-page></form>
<ol class="search__results search__results--page" data-search-results aria-live="polite"></ol>`)}`;

const notFound = () => `
<section class="nf"><div class="wrap nf__in">
  <p class="nf__code" aria-hidden="true">404</p>
  <h1>This page has flown elsewhere.</h1>
  <p class="lead">The page you are looking for does not exist or has moved.</p>
  <div class="actions">${btn('/', 'Back to the home page')}${btn('/search/', 'Search the site', 'ghost')}</div>
</div></section>`;

// =============== REGISTRY ===============
export const PAGES = [
  { path: '/', title: 'Your journey begins before you land. | Formaskills Travel', desc: 'Group programmes, mobility projects, cultural experiences and French learning in France, coordinated from Sète. Enquire online.', body: home, home: true, scripts: ['/assets/js/skygen.js', '/assets/js/flight.js'] },
  { path: '/what-we-offer/', title: 'What we offer', desc: 'Language, educational, professional and cultural programmes in France, for individuals, groups, schools, universities, training organisations and companies.', body: whatWeOffer },
  { path: '/for-me/', title: 'For me', desc: 'Learn French online, discover France and plan a stay around your interests.', body: forMe },
  { path: '/learn-french/', title: 'Learn French online', desc: 'French courses for individuals online and FLE programmes in France for groups.', body: learnFrench },
  { path: '/for-organisations/', title: 'Programmes for organisations in France', desc: 'FLE courses, cultural programmes, job shadowing, Erasmus+ group mobility, logistics and local coordination for organisations.', body: forOrg },
  { path: '/for-organisations/plan-group-mobility/', title: 'Plan group mobility', desc: 'A checklist for schools, training organisations and teams before asking for a proposal.', body: groupMobility },
  { path: '/destinations/', title: 'Destinations', desc: 'Sète, Montpellier, Paris and Nice: our featured destinations in France.', body: destinations },
  ...DESTINATIONS.map(d => ({ path: `/destinations/${d.slug}/`, title: `${d.name}: ${d.slug === 'sete' ? 'Mediterranean coast' : 'programmes on request'}`, desc: d.summary, body: () => destination(d) })),
  { path: '/tourism/', title: 'Cultural activities and local experiences', desc: 'Visits and activities, with or without French classes.', body: tourism },
  { path: '/au-pair-and-host-families/', title: 'Au pair and host-family stays', desc: 'Au pair and host-family stays, arranged on request.', body: auPair },
  { path: '/plan-your-stay/', title: 'Plan my project', desc: 'Tell us what you need. Every question is optional.', body: planner, scripts: ['/assets/js/planner.js'] },
  { path: '/partners/', title: 'Become a partner', desc: 'Provide a service, host trainees or professionals, or build a long-term collaboration with Formaskills Travel.', body: partners },
  { path: '/practical-information/', title: 'Practical information', desc: 'General guidance on health, insurance, documents and arrangements.', body: practical },
  { path: '/arriving-in-sete/', title: 'Arriving in Sète', desc: 'Arriving by train, bus, car or air: start here.', body: arriving },
  { path: '/guides-and-resources/', title: 'Guides and resources', desc: 'Guides and official sources for the next steps of your project.', body: guides },
  { path: '/about/', title: 'About Formaskills Travel', desc: 'A France-based team designing and coordinating tailor-made learning, mobility and cultural programmes.', body: about },
  { path: '/contact/', title: 'Contact and FAQ', desc: 'Write to us, call us, or start an enquiry. Frequently asked questions.', body: contact },
  { path: '/legal/legal-notices/', title: 'Legal notices', desc: 'Legal notices for Formaskills Travel SAS.', body: legalNotices },
  { path: '/legal/privacy/', title: 'Privacy notice', desc: 'How Formaskills Travel handles your data.', body: privacy },
  { path: '/legal/cookies/', title: 'Cookie policy', desc: 'Cookies and local storage on this website.', body: cookies },
  { path: '/legal/accessibility/', title: 'Accessibility statement', desc: 'Accessibility statement for this website.', body: accessibility },
  { path: '/legal/photo-credits/', title: 'Photo credits', desc: 'Photography credits and licences.', body: credits },
  { path: '/search/', title: 'Search', desc: 'Search the Formaskills Travel website.', body: search },
  { path: '/404', file: '404.html', title: 'Page not found', desc: 'Page not found.', body: notFound, noindex: true },
];
