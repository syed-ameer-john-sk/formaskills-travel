/* ==========================================================================
   FORMASKILLS TRAVEL · AWARD-LEVEL INTERACTIVE APPLICATION ENGINE
   Includes: Lenis Smooth Scroll, GSAP ScrollTrigger, Three.js 3D Globe,
   3D Tilt Cards, Coverflow Deck, Day-by-Day Itinerary Modal, 7-Language i18n
   ========================================================================== */

(function() {
  'use strict';

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- 1. Multilingual i18n Engine (7 Locales: en, fr, es, de, it, pl, zh) ---
  var currentLang = 'en';
  var LANG_INDEX = { fr: 0, es: 1, de: 2, it: 3, pl: 4, zh: 5 };
  
  var I18N_MAP = {
    "Formaskills Travel · Bespoke Educational & Cultural Mobility in France": ["Formaskills Travel · Mobilité éducative et culturelle sur mesure en France", "Formaskills Travel · Movilidad educativa y cultural a medida en Francia", "Formaskills Travel · Maßgeschneiderte Bildungs- und Kulturmobilität in Frankreich", "Formaskills Travel · Mobilità educativa e culturale su misura in Francia", "Formaskills Travel · Szyta na miarę mobilność edukacyjna i kulturowa we Francji", "Formaskills Travel · 法国量身定制的教育与文化交流项目"],
    "France Headquartered": ["Siège en France", "Sede en Francia", "Hauptsitz in Frankreich", "Sede in Francia", "Siedziba we Francji", "总部位于法国"],
    "Coordinated from Sète, Occitanie · Non-binding bespoke educational inquiries": ["Coordonné depuis Sète, Occitanie · Demandes éducatives sur mesure sans engagement", "Coordinado desde Sète, Occitania · Consultas educativas a medida sin compromiso", "Koordiniert aus Sète, Okzitanien · Unverbindliche Bildungsanfragen nach Maß", "Coordinato da Sète, Occitania · Richieste educative su misura senza impegno", "Koordynowane z Sète, Oksytania · Niezobowiązujące zapytania edukacyjne na miarę", "由奥克西塔尼大区塞特协调 · 无约束力的定制教育咨询"],
    "Mon–Fri 08:30–16:30 CET": ["Lun–Ven 08h30–16h30 CET", "Lun–Vie 08:30–16:30 CET", "Mo–Fr 08:30–16:30 MEZ", "Lun–Ven 08:30–16:30 CET", "Pon–Pt 08:30–16:30 CET", "周一至周五 08:30–16:30 法国时间"],
    "France Mobility & FLE": ["Mobilité en France & FLE", "Movilidad en Francia y FLE", "Mobilität in Frankreich & FLE", "Mobilità in Francia e FLE", "Mobilność we Francji i FLE", "法国交流与法语培训 (FLE)"],
    "Destinations": ["Destinations", "Destinos", "Reiseziele", "Destinazioni", "Kierunki", "目的地"],
    "4 Cities": ["4 Villes", "4 Ciudades", "4 Städte", "4 Città", "4 Miasta", "4座城市"],
    "Our Offers": ["Nos offres", "Nuestras ofertas", "Unsere Angebote", "Le nostre offerte", "Nasza oferta", "我们的服务"],
    "Experience Builder": ["Créateur de projet", "Planificador", "Projektplaner", "Configuratore", "Kreator projektu", "项目规划器"],
    "Erasmus+ & Shadowing": ["Erasmus+ & Observation", "Erasmus+ y Observación", "Erasmus+ & Hospitation", "Erasmus+ e Job Shadowing", "Erasmus+ i Job Shadowing", "Erasmus+ 与岗位观摩"],
    "About Team": ["L'équipe", "El equipo", "Über uns", "Il team", "O zespole", "关于团队"],
    "FAQ": ["FAQ", "Preguntas", "FAQ", "FAQ", "FAQ", "常见问题"],
    "Formaskills AI": ["Formaskills IA", "IA Formaskills", "Formaskills KI", "Formaskills IA", "Formaskills AI", "Formaskills 智能助手"],
    "Plan Your Project": ["Préparer mon projet", "Planificar mi proyecto", "Projekt planen", "Pianifica il progetto", "Zaplanuj projekt", "规划您的项目"],
    "Destinations (Sète, Montpellier, Paris, Nice)": ["Destinations (Sète, Montpellier, Paris, Nice)", "Destinos (Sète, Montpellier, París, Niza)", "Reiseziele (Sète, Montpellier, Paris, Nizza)", "Destinazioni (Sète, Montpellier, Parigi, Nizza)", "Kierunki (Sète, Montpellier, Paryż, Nicea)", "目的地（塞特、蒙彼利埃、巴黎、尼斯）"],
    "Programs & Offers": ["Programmes et offres", "Programas y ofertas", "Programme & Angebote", "Programmi e offerte", "Programy i oferty", "项目与服务"],
    "Experience Builder Wizard": ["Assistant de création de projet", "Asistente de planificación de proyecto", "Projektplaner-Assistent", "Procedura guidata progetto", "Kreator planowania projektu", "项目规划向导"],
    "Erasmus+ & Job Shadowing": ["Erasmus+ et observation professionnelle", "Erasmus+ y observación profesional", "Erasmus+ & Job Shadowing", "Erasmus+ e osservazione professionale", "Erasmus+ i obserwacja pracy", "Erasmus+ 与岗位观摩"],
    "About Formaskills Team": ["À propos de l'équipe Formaskills", "Sobre el equipo de Formaskills", "Über das Formaskills-Team", "Chi siamo: il team Formaskills", "O zespole Formaskills", "关于 Formaskills 团队"],
    "Frequently Asked Questions": ["Questions fréquentes", "Preguntas frecuentes", "Häufig gestellte Fragen", "Domande frequenti", "Często zadawane pytania", "常见问题解答"],
    "Tailored Educational & Cultural Stays in France": ["Séjours éducatifs et culturels sur mesure en France", "Estancias educativas y culturales a medida en Francia", "Maßgeschneiderte Bildungs- und Kulturaufenthalte in Frankreich", "Soggiorni educativi e culturali su misura in Francia", "Szyte na miarę pobyty edukacyjne i kulturowe we Francji", "法国量身定制的教育与文化交流之旅"],
    "Your Journey Begins": ["Votre voyage commence", "Tu viaje comienza", "Ihre Reise beginnt,", "Il tuo viaggio inizia", "Twoja podróż zaczyna się", "在您落地之前，"],
    "Before You Land.": ["avant votre arrivée.", "antes de aterrizar.", "bevor Sie landen.", "prima di atterrare.", "zanim wylądujesz.", "旅程已经启程。"],
    "Start a conversation. Discover authentic French territories. Group mobility, Erasmus+ reception, FLE language immersion, and vocational job shadowing built strictly around your goals.": ["Engagez la conversation. Découvrez des territoires français authentiques. Mobilité de groupe, accueil Erasmus+, immersion linguistique FLE et observation professionnelle construits autour de vos objectifs.", "Inicia una conversación. Descubre territorios franceses auténticos. Movilidad en grupo, acogida Erasmus+, inmersión lingüística en francés (FLE) y observación profesional diseñadas según tus objetivos.", "Beginnen Sie ein Gespräch. Entdecken Sie authentische Regionen Frankreichs. Gruppenmobilität, Erasmus+-Empfang, Französisch-Sprachimmersion (FLE) und Job Shadowing ganz nach Ihren Zielen.", "Inizia una conversazione. Scopri territori francesi autentici. Mobilità di gruppo, accoglienza Erasmus+, immersione linguistica FLE e job shadowing costruiti intorno ai tuoi obiettivi.", "Rozpocznij rozmowę. Odkryj autentyczne regiony Francji. Mobilność grupowa, przyjęcia Erasmus+, immersja językowa FLE i job shadowing dopasowane do Twoich celów.", "开启对话，探索真实的法国风土。围绕您的目标量身打造的团队交流、Erasmus+ 接待、法语沉浸式课程 (FLE) 以及职业岗位观摩。"],
    "Target Persona": ["Profil concerné", "Perfil destinatario", "Zielgruppe", "Destinatario", "Profil uczestnika", "适用对象"],
    "Any Group / Individual": ["Tout groupe / Individuel", "Cualquier grupo / Individual", "Alle Gruppen / Einzelpersonen", "Qualsiasi gruppo / Individuale", "Każda grupa / Indywidualnie", "所有团体 / 个人"],
    "For Me (Individual Learner)": ["Pour moi (Apprenant individuel)", "Para mí (Estudiante individual)", "Für mich (Einzellerner)", "Per me (Studente individuale)", "Dla mnie (Uczestnik indywidualny)", "个人学习与旅行"],
    "For Organisation / School": ["Pour mon organisation / École", "Para mi organización / Centro", "Für meine Organisation / Schule", "Per la mia organizzazione / Scuola", "Dla organizacji / Szkoły", "学校与机构团体"],
    "Erasmus+ VET / Pupil": ["Erasmus+ EFP / Élèves", "Erasmus+ FP / Alumnos", "Erasmus+ Berufsbildung / Schüler", "Erasmus+ IFP / Alunni", "Erasmus+ VET / Uczniowie", "Erasmus+ 职业教育与学生"],
    "Become a Partner Host": ["Devenir partenaire d'accueil", "Ser socio anfitrión", "Partner / Gastgeber werden", "Diventa partner ospitante", "Zostań partnerem goszczącym", "成为合作接待方"],
    "Featured Destination": ["Destination phare", "Destino destacado", "Empfohlenes Reiseziel", "Destinazione in evidenza", "Wybrany kierunek", "精选目的地"],
    "All 4 Destinations": ["Les 4 destinations", "Los 4 destinos", "Alle 4 Reiseziele", "Tutte le 4 destinazioni", "Wszystkie 4 kierunki", "全部 4 个目的地"],
    "Sète (Mediterranean Port)": ["Sète (Port méditerranéen)", "Sète (Puerto mediterráneo)", "Sète (Mittelmeerhafen)", "Sète (Porto mediterraneo)", "Sète (Port śródziemnomorski)", "塞特（地中海港口）"],
    "Montpellier (Historic/Youth)": ["Montpellier (Historique & Jeune)", "Montpellier (Histórico y Joven)", "Montpellier (Historisch & Jung)", "Montpellier (Storica e Giovane)", "Montpellier (Historyczne i Młode)", "蒙彼利埃（历史与活力大学城）"],
    "Paris (Heritage & Culture)": ["Paris (Patrimoine & Culture)", "París (Patrimonio y Cultura)", "Paris (Kulturerbe & Kunst)", "Parigi (Patrimonio e Cultura)", "Paryż (Dziedzictwo i Kultura)", "巴黎（文化遗产与艺术之都）"],
    "Nice (French Riviera)": ["Nice (Côte d'Azur)", "Niza (Costa Azul)", "Nizza (Côte d'Azur)", "Nizza (Costa Azzurra)", "Nicea (Riwiera Francuska)", "尼斯（蔚蓝海岸）"],
    "Program Type": ["Type de programme", "Tipo de programa", "Programmtyp", "Tipo di programma", "Rodzaj programu", "项目类型"],
    "Any Program Type": ["Tous les programmes", "Cualquier programa", "Alle Programmtypen", "Qualsiasi programma", "Dowolny program", "所有项目类型"],
    "French Language (FLE)": ["Cours de français (FLE)", "Idioma francés (FLE)", "Französischkurse (FLE)", "Lingua francese (FLE)", "Język francuski (FLE)", "法语课程 (FLE)"],
    "Erasmus+ Group Mobility": ["Mobilité de groupe Erasmus+", "Movilidad de grupo Erasmus+", "Erasmus+ Gruppenmobilität", "Mobilità di gruppo Erasmus+", "Mobilność grupowa Erasmus+", "Erasmus+ 团队交流"],
    "Staff Job Shadowing": ["Observation professionnelle (Staff)", "Job Shadowing para personal", "Job Shadowing für Personal", "Job Shadowing per lo staff", "Job Shadowing dla kadry", "教职工岗位观摩 (Job Shadowing)"],
    "Cultural Discovery Stay": ["Séjour de découverte culturelle", "Estancia de descubrimiento cultural", "Kultureller Entdeckungsaufenthalt", "Soggiorno di scoperta culturale", "Pobyt kulturowo-poznawczy", "文化探索之旅"],
    "Au Pair / Host Family": ["Séjour au pair / Famille d'accueil", "Au Pair / Familia anfitriona", "Au-pair / Gastfamilie", "Au Pair / Famiglia ospitante", "Au Pair / Rodzina goszcząca", "互惠生 / 寄宿家庭"],
    "Explore Stays": ["Explorer les séjours", "Explorar estancias", "Aufenthalte entdecken", "Esplora soggiorni", "Odkryj pobyty", "探索项目"],
    "No booking fees or online charges": ["Aucun frais de réservation ni paiement en ligne", "Sin gastos de reserva ni pagos en línea", "Keine Buchungsgebühren oder Online-Zahlungen", "Nessun costo di prenotazione o pagamento online", "Brak opłat rezerwacyjnych i płatności online", "无预订费，无需在线付款"],
    "Direct personal proposal": ["Proposition personnalisée directe", "Propuesta personalizada directa", "Direktes persönliches Angebot", "Proposta personalizzata diretta", "Bezpośrednia oferta indywidualna", "团队一对一专属方案"],
    "Three Doors to France": ["Trois portes d'entrée vers la France", "Tres puertas hacia Francia", "Drei Zugänge nach Frankreich", "Tre porte d'accesso alla Francia", "Trzy drogi do Francji", "通往法国的三大通道"],
    "For Me": ["Pour moi", "Para mí", "Für mich", "Per me", "Dla mnie", "个人专享"],
    "For My Organisation": ["Pour mon organisation", "Para mi organización", "Für meine Organisation", "Per la mia organizzazione", "Dla mojej organizacji", "机构与学校"],
    "Become a Partner": ["Devenir partenaire", "Ser socio", "Partner werden", "Diventa partner", "Zostań partnerem", "成为合作伙伴"],
    "Explore Our French Destinations": ["Explorez nos destinations en France", "Explora nuestros destinos en Francia", "Entdecken Sie unsere Reiseziele in Frankreich", "Esplora le nostre destinazioni in Francia", "Odkryj nasze kierunki we Francji", "探索我们的法国精选目的地"],
    "What We Offer": ["Ce que nous proposons", "Qué ofrecemos", "Was wir anbieten", "Cosa offriamo", "Co oferujemy", "我们的服务内容"],
    "Job Shadowing Across 12 Key Sectors in France": ["Observation professionnelle (Job Shadowing) dans 12 secteurs en France", "Job Shadowing en 12 sectores clave en Francia", "Job Shadowing in 12 Schlüsselbranchen in Frankreich", "Job Shadowing in 12 settori chiave in Francia", "Job Shadowing w 12 kluczowych branżach we Francji", "法国 12 大核心行业的专业岗位观摩 (Job Shadowing)"]
  };

  var I18N_COPIED = {
    en: ["Brief Copied!", "Copy Brief"],
    fr: ["Dossier copié !", "Copier le dossier"],
    es: ["¡Copiado!", "Copiar resumen"],
    de: ["Kopiert!", "Zusammenfassung kopieren"],
    it: ["Copiato!", "Copia riepilogo"],
    pl: ["Skopiowano!", "Kopiuj podsumowanie"],
    zh: ["已复制简报！", "复制项目简报"]
  };

  var I18N_TOAST = {
    en: "Please provide your name and email so we can reach you.",
    fr: "Veuillez renseigner votre nom et votre adresse email.",
    es: "Por favor indica tu nombre y correo electrónico.",
    de: "Bitte geben Sie Ihren Namen und Ihre E-Mail an.",
    it: "Inserisci il tuo nome e la tua email.",
    pl: "Podaj swoje imię i adres e-mail.",
    zh: "请填写您的姓名与电子邮箱，以便我们与您联系。"
  };

  function tr(key) {
    if (currentLang === 'en') return key;
    var row = I18N_MAP[key];
    if (!row) return key;
    var idx = LANG_INDEX[currentLang];
    return (idx !== undefined && row[idx]) ? row[idx] : key;
  }

  function applyLanguage(lang) {
    currentLang = lang;
    var labels = { en: 'English', fr: 'Français', es: 'Español', de: 'Deutsch', it: 'Italiano', pl: 'Polski', zh: '中文' };
    var labelEl = document.getElementById('current-lang-label');
    if (labelEl) labelEl.textContent = labels[lang] || 'English';

    document.querySelectorAll('[data-lang]').forEach(function(opt) {
      if (opt.getAttribute('data-lang') === lang) {
        opt.classList.add('font-semibold', 'text-amber-400');
      } else {
        opt.classList.remove('font-semibold', 'text-amber-400');
      }
    });

    // Translate DOM text nodes
    function translateNode(node) {
      if (node.nodeType === Node.TEXT_NODE) {
        var trimmed = node.nodeValue.trim();
        if (trimmed && I18N_MAP[trimmed]) {
          var translated = tr(trimmed);
          if (translated !== trimmed) {
            node.nodeValue = node.nodeValue.replace(trimmed, translated);
          }
        }
      } else if (node.nodeType === Node.ELEMENT_NODE && !node.classList.contains('no-translate')) {
        for (var i = 0; i < node.childNodes.length; i++) {
          translateNode(node.childNodes[i]);
        }
      }
    }
    translateNode(document.body);
  }

  // Language Dropdown Handler
  var langMenuBtn = document.getElementById('lang-menu-btn');
  var langDropdown = document.getElementById('lang-dropdown');
  if (langMenuBtn && langDropdown) {
    langMenuBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      langDropdown.classList.toggle('hidden');
    });
    document.addEventListener('click', function() {
      langDropdown.classList.add('hidden');
    });
    document.querySelectorAll('.lang-opt').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var l = btn.getAttribute('data-lang');
        if (l) applyLanguage(l);
      });
    });
  }

  // --- 2. Preloader Dissolve ---
  window.addEventListener('load', function() {
    var preloader = document.getElementById('site-preloader');
    if (preloader) {
      setTimeout(function() {
        preloader.classList.add('loaded');
      }, 400);
    }
  });

  // --- 3. Lenis Smooth Scrolling Integration ---
  var lenis = null;
  if (typeof Lenis !== 'undefined' && !reduceMotion) {
    try {
      lenis = new Lenis({
        duration: 1.2,
        easing: function(t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
        orientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 0.95
      });

      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);

      // Connect Lenis to GSAP ScrollTrigger if available
      if (typeof ScrollTrigger !== 'undefined') {
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add(function(time) {
          lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);
      }
    } catch(e) {
      console.warn("Lenis initialization error:", e);
    }
  }

  // Smooth Anchor Navigation via Lenis or Fallback
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      var targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      var targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        if (lenis) {
          lenis.scrollTo(targetEl, { offset: -70 });
        } else {
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }
        var mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
          mobileMenu.classList.add('hidden');
        }
      }
    });
  });

  // Mobile Menu Toggle
  var mobileMenuBtn = document.getElementById('mobile-menu-toggle');
  var mobileMenu = document.getElementById('mobile-menu');
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', function() {
      mobileMenu.classList.toggle('hidden');
    });
  }

  // --- 4. Sticky Booking / Intent Bar Behavior ---
  var bookingBar = document.getElementById('smart-booking-bar');
  if (bookingBar) {
    window.addEventListener('scroll', function() {
      var top = window.pageYOffset || document.documentElement.scrollTop;
      if (top > 400) {
        bookingBar.classList.add('booking-bar-floating');
      } else {
        bookingBar.classList.remove('booking-bar-floating');
      }
    }, { passive: true });
  }

  // Smart Search Button Action (Jump to Builder with parameters)
  var smartSearchBtn = document.getElementById('smart-search-btn');
  if (smartSearchBtn) {
    smartSearchBtn.addEventListener('click', function() {
      var p = document.getElementById('filter-persona') ? document.getElementById('filter-persona').value : 'all';
      var d = document.getElementById('filter-destination') ? document.getElementById('filter-destination').value : 'all';
      var pr = document.getElementById('filter-program') ? document.getElementById('filter-program').value : 'all';

      // Set builder radio
      if (p !== 'all') {
        var radio = document.querySelector('input[name="builder-target"][value="' + p + '"]');
        if (radio) {
          radio.checked = true;
          updateTargetCards();
        }
      }
      // Set destination checkbox
      if (d !== 'all') {
        var cb = document.querySelector('input[name="builder-city"][value="' + d + '"]');
        if (cb) cb.checked = true;
      }

      var builderEl = document.getElementById('builder');
      if (builderEl) {
        if (lenis) lenis.scrollTo(builderEl, { offset: -40 });
        else builderEl.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // --- 5. Interactive Destination Day-by-Day Itinerary Modal ---
  var DESTINATION_DETAILS = {
    sete: {
      title: "Sète · The Grand Canal & Oyster Lagoon Residency",
      subtitle: "Mediterranean Operational HQ · 5 to 10 Days Tailored Group Stay",
      image: "assets/img/sete.jpg",
      tag: "Operational HQ & Maritime Heritage",
      summary: "Immerse your group into the authentic maritime rhythm of Languedoc. Sète offers canalfront walks, world-famous Thau lagoon oyster ecosystems, intensive French classes, and seamless train links to Montpellier.",
      itinerary: [
        { day: "Day 1", title: "Arrival & Welcome Briefing", desc: "Train or shuttle pickup at Sète Station, check-in to vetted seaside partner residence, welcome orientation at 6 rue Voltaire HQ." },
        { day: "Day 2", title: "Language Immersion & Canal Royal", desc: "Morning specialized FLE group session. Afternoon guided walk along Canal Royal and Mount Saint-Clair panoramic lookout." },
        { day: "Day 3", title: "Thau Lagoon & Oyster Ecosystem", desc: "Private boat excursion to the oyster beds of Bouzigues with local marine biologists and environmental entrepreneurs." },
        { day: "Day 4", title: "Vocational Observation & Workshops", desc: "Direct industry encounters (Tourism, Maritime, Ecology or Tech) followed by traditional French culinary workshop." },
        { day: "Day 5", title: "Synthesis, Certificates & Gala", desc: "Project presentation, European mobility certificates presentation, and sunset dinner overlooking the Mediterranean." }
      ],
      inclusions: ["Dedicated local coordinator 24/7", "Vetted group accommodation & full board", "Intensive FLE coursework / vocational placements", "All local transit passes and excursion admissions", "Europass Mobility documentation alignment"],
      exclusions: ["International airfare (ground reception starts at station/airport)", "Personal shopping & leisure expenses"]
    },
    montpellier: {
      title: "Montpellier · Historic University & Innovation Corridor",
      subtitle: "Academic Excellence & Mediterranean Youth · 5 to 14 Days",
      image: "assets/img/montpellier.jpg",
      tag: "Historic & Youth Capital",
      summary: "One of Europe's oldest academic hubs with the world's oldest practicing medical school. Combines medieval pedestrian alleys in the Écusson with cutting-edge tech incubators and sunlit tramways.",
      itinerary: [
        { day: "Day 1", title: "Arrival & City Tram Transit", desc: "Arrival at Montpellier Saint-Roch / Sud de France. Group orientation and distribution of multi-day transit passes." },
        { day: "Day 2", title: "The Historic Écusson & Faculty", desc: "Architectural guided survey of medieval courtyards, Saint-Pierre Cathedral, and the historical Faculty of Medicine." },
        { day: "Day 3", title: "French Tech & Innovation Labs", desc: "Interactive session at local digital incubators and start-ups, followed by collaborative workshops with local university students." },
        { day: "Day 4", title: "Musée Fabre & Cultural Heritage", desc: "Curated tour of European masterworks at Musée Fabre and conversational French workshops in Place de la Comédie." },
        { day: "Day 5", title: "Coastal Lagoon Transition", desc: "Direct tram excursion to Palavas-les-Flots beaches and synthesis session with local coordinators." }
      ],
      inclusions: ["Centrally located youth residence / hotel", "All urban tram and bus unlimited passes", "Daily breakfast & curated local restaurant dinners", "Full coordinator accompaniment", "Learning agreement certification"],
      exclusions: ["Long-haul international flights", "Individual travel insurance (required)"]
    },
    paris: {
      title: "Paris · Cultural Institutions & Governance Capital",
      subtitle: "World-Class Heritage & Institutional Study Tours · 4 to 8 Days",
      image: "assets/img/paris.jpg",
      tag: "Heritage & Institutions",
      summary: "A masterclass in European culture, international diplomacy, and monumental heritage. Designed specifically for secondary delegations, vocational hospitality students, and cultural discovery groups.",
      itinerary: [
        { day: "Day 1", title: "Arrival in the City of Light", desc: "Welcome meetup at Gare de Lyon / CDG, Navigo transit pass distribution, check-in to secure 3-star group partner hotel." },
        { day: "Day 2", title: "The Louvre & Seine River Navigation", desc: "Private early-access exploration of the Louvre collections, followed by an architectural study cruise along the Seine." },
        { day: "Day 3", title: "Latin Quarter & Academic History", desc: "Walking survey of the Sorbonne, Panthéon, and Saint-Germain intellectual history with bilingual cultural lecturers." },
        { day: "Day 4", title: "Institutions & Contemporary France", desc: "Site visit to French vocational establishments, museums of modern art (Centre Pompidou / Orsay), and student exchange forum." },
        { day: "Day 5", title: "Montmartre & Departure Briefing", desc: "Panoramic morning study at Sacré-Cœur, debriefing, and scheduled station transfers." }
      ],
      inclusions: ["3-Star Parisian group partner hotel", "Metro/RER Navigo weekly passes", "Museum priority skip-the-line admissions", "Bilingual French coordination escort", "Official attendance certificates"],
      exclusions: ["International flights", "Single-room supplements unless requested"]
    },
    nice: {
      title: "Nice · French Riviera Light, Art & Coastal Economy",
      subtitle: "Côte d'Azur Splendour & Hospitality Excellence · 5 to 10 Days",
      image: "assets/img/nice.jpg",
      tag: "French Riviera & Gastronomy",
      summary: "UNESCO-listed Riviera architecture, iconic azure waters, and an unrivaled climate. Ideal for tourism and luxury hospitality vocational study, Mediterranean art history, and active youth groups.",
      itinerary: [
        { day: "Day 1", title: "Arrival on the Bay of Angels", desc: "Meet & greet at Nice-Ville or Nice Côte d'Azur Airport, panoramic check-in, initial briefing on Riviera history." },
        { day: "Day 2", title: "Promenade des Anglais & Old Town", desc: "Architectural study of Belle Époque façades, Cours Saleya flower markets, and regional Provencal tastings." },
        { day: "Day 3", title: "Matisse & Chagall Museums", desc: "Visits to the Cimiez hill monasteries and master artist museums, with French artistic vocabulary workshops." },
        { day: "Day 4", title: "Luxury Hospitality & Coastal Economy", desc: "Behind-the-scenes study tour with regional luxury hotel leaders and coastal tourism professionals." },
        { day: "Day 5", title: "Coastal Coastal Excursion & Farewell", desc: "Train to Villefranche-sur-Mer bay, farewell Mediterranean lunch, and mobility debriefing." }
      ],
      inclusions: ["Riviera sea-view partner lodging", "All local train and tram transport passes", "Museum entries and expert local guides", "24/7 on-call coordinator support", "Full administrative paperwork"],
      exclusions: ["International airline tickets", "Optional personal watersports"]
    }
  };

  // Modal DOM elements
  var modalEl = document.getElementById('itinerary-modal');
  var modalBackdrop = document.getElementById('modal-backdrop');
  var modalCloseBtn = document.getElementById('modal-close-btn');
  var modalTitle = document.getElementById('modal-title');
  var modalSubtitle = document.getElementById('modal-subtitle');
  var modalImg = document.getElementById('modal-img');
  var modalSummary = document.getElementById('modal-summary');
  var modalDaysContainer = document.getElementById('modal-days-container');
  var modalInclusions = document.getElementById('modal-inclusions');
  var modalExclusions = document.getElementById('modal-exclusions');
  var modalEnquireBtn = document.getElementById('modal-enquire-btn');
  var currentModalCity = 'sete';

  function openItineraryModal(cityKey) {
    var data = DESTINATION_DETAILS[cityKey];
    if (!data || !modalEl) return;
    currentModalCity = cityKey;

    if (modalTitle) modalTitle.textContent = data.title;
    if (modalSubtitle) modalSubtitle.textContent = data.subtitle;
    if (modalImg) modalImg.src = data.image;
    if (modalSummary) modalSummary.textContent = data.summary;

    if (modalDaysContainer) {
      modalDaysContainer.innerHTML = '';
      data.itinerary.forEach(function(day) {
        var dayDiv = document.createElement('div');
        dayDiv.className = 'p-4 rounded-2xl bg-slate-900/50 border border-slate-700/60';
        dayDiv.innerHTML = '<div class="flex items-center gap-2 mb-1.5"><span class="px-2.5 py-0.5 rounded text-[10px] font-bold bg-amber-400 text-slate-950 uppercase">' + day.day + '</span><h5 class="text-sm font-bold text-white">' + day.title + '</h5></div><p class="text-xs text-slate-300 leading-relaxed">' + day.desc + '</p>';
        modalDaysContainer.appendChild(dayDiv);
      });
    }

    if (modalInclusions) {
      modalInclusions.innerHTML = '';
      data.inclusions.forEach(function(inc) {
        var li = document.createElement('li');
        li.className = 'flex items-start gap-2 text-xs text-slate-300';
        li.innerHTML = '<span class="text-emerald-400 font-bold">✓</span><span>' + inc + '</span>';
        modalInclusions.appendChild(li);
      });
    }

    if (modalExclusions) {
      modalExclusions.innerHTML = '';
      data.exclusions.forEach(function(exc) {
        var li = document.createElement('li');
        li.className = 'flex items-start gap-2 text-xs text-slate-400';
        li.innerHTML = '<span class="text-rose-400 font-bold">✕</span><span>' + exc + '</span>';
        modalExclusions.appendChild(li);
      });
    }

    modalEl.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    if (lenis) lenis.stop();
  }

  function closeItineraryModal() {
    if (!modalEl) return;
    modalEl.classList.add('hidden');
    document.body.style.overflow = '';
    if (lenis) lenis.start();
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeItineraryModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeItineraryModal);

  // Trigger modal from destination cards
  document.querySelectorAll('.open-itinerary-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var city = btn.getAttribute('data-city');
      if (city) openItineraryModal(city);
    });
  });

  // Modal Enquire action: Pre-fills builder with selected city and scrolls directly
  if (modalEnquireBtn) {
    modalEnquireBtn.addEventListener('click', function() {
      closeItineraryModal();
      var cb = document.querySelector('input[name="builder-city"][value="' + currentModalCity + '"]');
      if (cb) cb.checked = true;
      var builder = document.getElementById('builder');
      if (builder) {
        if (lenis) lenis.scrollTo(builder, { offset: -40 });
        else builder.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // --- 6. Destination Filter & SVG Map Sync ---
  var destCards = document.querySelectorAll('.dest-card');
  var destTabs = document.querySelectorAll('.dest-tab-btn');
  var mapDots = document.querySelectorAll('.map-city-dot');

  function filterDestinations(city) {
    destTabs.forEach(function(tab) {
      if (tab.id === 'dest-filter-' + city) {
        tab.classList.add('bg-amber-400', 'text-slate-950', 'shadow-md');
        tab.classList.remove('bg-white', 'text-slate-600', 'bg-slate-800', 'text-slate-300');
      } else {
        tab.classList.remove('bg-amber-400', 'text-slate-950', 'shadow-md');
        tab.classList.add('bg-slate-800', 'text-slate-300');
      }
    });

    destCards.forEach(function(card) {
      if (city === 'all' || card.getAttribute('data-city') === city) {
        card.style.display = '';
        card.classList.add('reveal-active');
      } else {
        card.style.display = 'none';
      }
    });
  }

  destTabs.forEach(function(tab) {
    tab.addEventListener('click', function() {
      var id = tab.id.replace('dest-filter-', '');
      filterDestinations(id);
    });
  });

  mapDots.forEach(function(dot) {
    dot.addEventListener('click', function() {
      var city = dot.getAttribute('data-city');
      if (city) {
        filterDestinations(city);
        var targetCard = document.querySelector('.dest-card[data-city="' + city + '"]');
        if (targetCard) {
          if (lenis) lenis.scrollTo(targetCard, { offset: -100 });
          else targetCard.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  // Pick Destination buttons (Jump to builder)
  document.querySelectorAll('.pick-dest-btn').forEach(function(b) {
    b.addEventListener('click', function() {
      var city = b.getAttribute('data-pick-city');
      var cb = document.querySelector('input[name="builder-city"][value="' + city + '"]');
      if (cb) cb.checked = true;
      var builder = document.getElementById('builder');
      if (builder) {
        if (lenis) lenis.scrollTo(builder, { offset: -40 });
        else builder.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // --- 7. Experience Builder Wizard State Machine ---
  var currentStep = 1;
  var participantCount = 1;
  var countDec = document.getElementById('count-dec');
  var countInc = document.getElementById('count-inc');
  var countDisplay = document.getElementById('participant-count');

  if (countDec && countInc && countDisplay) {
    countDec.addEventListener('click', function() {
      if (participantCount > 1) {
        participantCount--;
        countDisplay.textContent = participantCount;
      }
    });
    countInc.addEventListener('click', function() {
      participantCount++;
      countDisplay.textContent = participantCount;
    });
  }

  function updateTargetCards() {
    var checkedRadio = document.querySelector('input[name="builder-target"]:checked');
    if (!checkedRadio) return;
    var val = checkedRadio.value;
    ['me', 'org', 'partner'].forEach(function(k) {
      var card = document.getElementById('card-target-' + k);
      if (!card) return;
      var span = card.querySelector('span:last-child');
      if (k === val) {
        card.classList.add('border-amber-400', 'bg-amber-400/10');
        card.classList.remove('border-slate-700');
        if (span) {
          span.textContent = tr('Selected');
          span.classList.add('text-amber-400');
          span.classList.remove('text-slate-400');
        }
      } else {
        card.classList.remove('border-amber-400', 'bg-amber-400/10');
        card.classList.add('border-slate-700');
        if (span) {
          span.textContent = tr('Select');
          span.classList.remove('text-amber-400');
          span.classList.add('text-slate-400');
        }
      }
    });
  }

  document.querySelectorAll('input[name="builder-target"]').forEach(function(r) {
    r.addEventListener('change', updateTargetCards);
  });

  // 12 Sector Badges -> Select & Advance to Step 3 with pre-filled notes
  document.querySelectorAll('.sector-badge').forEach(function(sb) {
    sb.addEventListener('click', function() {
      var titleEl = sb.querySelector('p');
      var sectorName = titleEl ? titleEl.textContent : 'Vocational Field';
      var notes = document.getElementById('builder-notes');
      if (notes) {
        notes.value = "Interested in staff job shadowing in " + sectorName + ".";
      }
      var builder = document.getElementById('builder');
      if (builder) {
        if (lenis) lenis.scrollTo(builder, { offset: -40 });
        else builder.scrollIntoView({ behavior: 'smooth' });
      }
      goToStep(3);
    });
  });

  // Three Doors Selection Handlers
  document.querySelectorAll('.door-select-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var door = btn.getAttribute('data-door');
      var targetRadio = document.querySelector('input[name="builder-target"][value="' + door + '"]');
      if (targetRadio) targetRadio.checked = true;
      updateTargetCards();
      var builder = document.getElementById('builder');
      if (builder) {
        if (lenis) lenis.scrollTo(builder, { offset: -40 });
        else builder.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  var wizardPrevBtn = document.getElementById('wizard-prev-btn');
  var wizardNextBtn = document.getElementById('wizard-next-btn');
  var wizardCopyBtn = document.getElementById('wizard-copy-btn');
  var wizardDownloadBtn = document.getElementById('wizard-download-btn');
  var wizardSubmitBtn = document.getElementById('wizard-submit-btn');

  function goToStep(step) {
    currentStep = step;
    for (var i = 1; i <= 4; i++) {
      var el = document.getElementById('builder-step-' + i);
      var dot = document.getElementById('step-dot-' + i);
      if (!el || !dot) continue;
      if (i === step) {
        el.classList.remove('hidden');
        dot.classList.add('bg-amber-400', 'text-slate-950');
        dot.classList.remove('bg-slate-800', 'text-slate-400', 'bg-emerald-500');
      } else if (i < step) {
        el.classList.add('hidden');
        dot.classList.add('bg-emerald-500', 'text-white');
        dot.classList.remove('bg-slate-800', 'text-slate-400', 'bg-amber-400');
      } else {
        el.classList.add('hidden');
        dot.classList.remove('bg-amber-400', 'bg-emerald-500', 'text-white', 'text-slate-950');
        dot.classList.add('bg-slate-800', 'text-slate-400');
      }
    }

    var bar = document.getElementById('wizard-progress-bar');
    if (bar) bar.style.width = (step * 25) + '%';

    if (wizardPrevBtn) {
      if (step === 1) wizardPrevBtn.classList.add('hidden');
      else wizardPrevBtn.classList.remove('hidden');
    }

    if (step === 4) {
      if (wizardNextBtn) wizardNextBtn.classList.add('hidden');
      if (wizardCopyBtn) wizardCopyBtn.classList.remove('hidden');
      if (wizardDownloadBtn) wizardDownloadBtn.classList.remove('hidden');
      if (wizardSubmitBtn) wizardSubmitBtn.classList.remove('hidden');
      generateSummaryPreview();
    } else {
      if (wizardNextBtn) wizardNextBtn.classList.remove('hidden');
      if (wizardCopyBtn) wizardCopyBtn.classList.add('hidden');
      if (wizardDownloadBtn) wizardDownloadBtn.classList.add('hidden');
      if (wizardSubmitBtn) wizardSubmitBtn.classList.add('hidden');
    }
  }

  if (wizardNextBtn) {
    wizardNextBtn.addEventListener('click', function() {
      if (currentStep < 4) goToStep(currentStep + 1);
    });
  }
  if (wizardPrevBtn) {
    wizardPrevBtn.addEventListener('click', function() {
      if (currentStep > 1) goToStep(currentStep - 1);
    });
  }

  function showToast(msg) {
    var toast = document.getElementById('toast-notification');
    var text = document.getElementById('toast-message');
    if (toast && text) {
      text.textContent = msg;
      toast.classList.remove('translate-y-[-150%]');
      setTimeout(function() {
        toast.classList.add('translate-y-[-150%]');
      }, 3500);
    }
  }

  function buildSummaryText() {
    var targetRadio = document.querySelector('input[name="builder-target"]:checked');
    var target = targetRadio ? targetRadio.value : 'me';
    var cities = [];
    document.querySelectorAll('input[name="builder-city"]:checked').forEach(function(c) {
      cities.push(c.value.toUpperCase());
    });
    var services = [];
    document.querySelectorAll('input[name="builder-service"]:checked').forEach(function(s) {
      services.push(s.value);
    });
    var whenEl = document.getElementById('builder-when');
    var when = whenEl ? whenEl.value : 'Flexible';
    var durationEl = document.getElementById('builder-duration');
    var duration = durationEl ? durationEl.value : '1 week';
    var notesEl = document.getElementById('builder-notes');
    var notes = (notesEl && notesEl.value) ? notesEl.value : 'None specified';
    var nameEl = document.getElementById('contact-name');
    var name = (nameEl && nameEl.value) ? nameEl.value : 'Prospective Traveler / Coordinator';
    var emailEl = document.getElementById('contact-email');
    var email = (emailEl && emailEl.value) ? emailEl.value : 'contact@example.com';

    return [
      "================================================",
      "FORMASKILLS TRAVEL · PROJECT PROPOSAL BRIEF",
      "================================================",
      "Contact Name: " + name,
      "Contact Email: " + email,
      "Client Category: " + (target === 'me' ? 'Individual / Family' : (target === 'org' ? 'School / Organisation / Erasmus+' : 'Partner Provider')),
      "Estimated Group Size: " + participantCount + " participants",
      "Preferred Destinations: " + (cities.join(', ') || 'Flexible'),
      "Timing: " + when + " (" + duration + ")",
      "Requested Services: " + (services.join(', ') || 'To be discussed'),
      "Additional Notes / Context: " + notes,
      "------------------------------------------------",
      "Dispatched from Formaskills Travel Web Platform",
      "Operating Office: 6 rue Voltaire, 34200 Sète, France",
      "Corporate SIREN: 990 746 430 · RCS Montpellier",
      "================================================"
    ].join("\n");
  }

  function generateSummaryPreview() {
    var preview = document.getElementById('builder-summary-preview');
    if (preview) preview.textContent = buildSummaryText();
  }

  if (wizardCopyBtn) {
    wizardCopyBtn.addEventListener('click', function() {
      var text = buildSummaryText();
      var copiedPair = I18N_COPIED[currentLang] || I18N_COPIED.en;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function() {
          wizardCopyBtn.textContent = copiedPair[0];
          setTimeout(function() { wizardCopyBtn.textContent = (I18N_COPIED[currentLang] || I18N_COPIED.en)[1]; }, 2000);
        });
      }
    });
  }

  if (wizardDownloadBtn) {
    wizardDownloadBtn.addEventListener('click', function() {
      var text = buildSummaryText();
      var blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = 'Formaskills_Travel_Project_Brief.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  }

  if (wizardSubmitBtn) {
    wizardSubmitBtn.addEventListener('click', function() {
      var text = buildSummaryText();
      var nameEl = document.getElementById('contact-name');
      var emailEl = document.getElementById('contact-email');
      var name = nameEl ? nameEl.value : '';
      var email = emailEl ? emailEl.value : '';
      if (!name || !email) {
        showToast(I18N_TOAST[currentLang] || I18N_TOAST.en);
        return;
      }
      var mailtoUrl = 'mailto:contact.skillstravel@gmail.com?subject=' + encodeURIComponent('Formaskills Project Brief: ' + name) + '&body=' + encodeURIComponent(text.slice(0, 1800));
      window.location.href = mailtoUrl;
    });
  }

  // --- 8. 3D Fanned Coverflow Card Deck Controller ---
  var cfCards = document.querySelectorAll('.coverflow-card');
  var cfPrev = document.getElementById('coverflow-prev');
  var cfNext = document.getElementById('coverflow-next');
  var cfCounter = document.getElementById('coverflow-counter');
  var wayNodes = document.querySelectorAll('.way-node');
  var activeCf = 2;

  function renderCoverflow(centerIdx) {
    if (!cfCards.length) return;
    activeCf = (centerIdx + cfCards.length) % cfCards.length;
    if (cfCounter) {
      cfCounter.textContent = '0' + (activeCf + 1) + ' / 0' + cfCards.length;
    }
    wayNodes.forEach(function(wn, wIdx) {
      if (wIdx === activeCf) wn.classList.add('active', 'border-amber-400');
      else wn.classList.remove('active', 'border-amber-400');
    });

    cfCards.forEach(function(card, idx) {
      var diff = idx - activeCf;
      if (diff > 2) diff -= cfCards.length;
      if (diff < -2) diff += cfCards.length;

      var absDiff = Math.abs(diff);
      var translateX = diff * 185;
      var translateZ = -absDiff * 130;
      var rotateY = diff * -22;
      var scale = 1 - (absDiff * 0.08);
      var opacity = absDiff > 2 ? 0 : (1 - absDiff * 0.22);
      var zIndex = 30 - absDiff * 5;

      if (window.innerWidth < 640) {
        translateX = diff * 95;
        rotateY = diff * -14;
      }

      card.style.transform = 'translate3d(' + translateX + 'px, 0, ' + translateZ + 'px) rotateY(' + rotateY + 'deg) scale(' + scale.toFixed(2) + ')';
      card.style.opacity = opacity.toFixed(2);
      card.style.zIndex = zIndex;
    });
  }

  if (cfCards.length) {
    renderCoverflow(2);
    window.addEventListener('resize', function() { renderCoverflow(activeCf); });

    cfCards.forEach(function(card, idx) {
      card.addEventListener('click', function(e) {
        if (e.target.closest('.cf-select-btn')) return;
        renderCoverflow(idx);
      });
    });

    if (cfPrev) cfPrev.addEventListener('click', function() { renderCoverflow(activeCf - 1); });
    if (cfNext) cfNext.addEventListener('click', function() { renderCoverflow(activeCf + 1); });

    wayNodes.forEach(function(wn) {
      wn.addEventListener('click', function() {
        var idx = parseInt(wn.getAttribute('data-way-idx') || '0', 10);
        renderCoverflow(idx);
      });
    });

    document.querySelectorAll('.cf-select-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var city = btn.getAttribute('data-cf-city');
        var cb = document.querySelector('input[name="builder-city"][value="' + city + '"]');
        if (cb) cb.checked = true;
        var builder = document.getElementById('builder');
        if (builder) {
          if (lenis) lenis.scrollTo(builder, { offset: -40 });
          else builder.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  // --- 9. 3D Tilt Cards (Vanilla + Specular Glare) ---
  if (!reduceMotion) {
    var tiltCards = document.querySelectorAll('.tilt-card');
    tiltCards.forEach(function(card) {
      card.addEventListener('mousemove', function(e) {
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var cx = rect.width / 2;
        var cy = rect.height / 2;
        var rotX = ((y - cy) / cy) * -6.5;
        var rotY = ((x - cx) / cx) * 6.5;
        card.style.transform = 'perspective(1000px) rotateX(' + rotX.toFixed(2) + 'deg) rotateY(' + rotY.toFixed(2) + 'deg) translateZ(6px)';
        card.style.setProperty('--glare-x', ((x / rect.width) * 100).toFixed(1) + '%');
        card.style.setProperty('--glare-y', ((y / rect.height) * 100).toFixed(1) + '%');
      });
      card.addEventListener('mouseleave', function() {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
      });
    });
  }

  // --- 10. Real-Time Three.js 3D European Mobility Geosphere ---
  (function initThreeScene() {
    var canvas = document.getElementById('hero-3d-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    var renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
    } catch (e) {
      return;
    }

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
    camera.position.set(0, 0, 18);

    var globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // Geodesic Wireframe Shell (Deep Teal & Gold Tone)
    var sphereGeo = new THREE.IcosahedronGeometry(5.8, 3);
    var wireMat = new THREE.MeshBasicMaterial({
      color: 0xC9A24B,
      wireframe: true,
      transparent: true,
      opacity: 0.18
    });
    var wireSphere = new THREE.Mesh(sphereGeo, wireMat);
    globeGroup.add(wireSphere);

    // Core Velvet Glow Sphere (Midnight Ink)
    var coreGeo = new THREE.SphereGeometry(5.65, 32, 32);
    var coreMat = new THREE.MeshBasicMaterial({
      color: 0x0B1320,
      transparent: true,
      opacity: 0.65
    });
    var coreSphere = new THREE.Mesh(coreGeo, coreMat);
    globeGroup.add(coreSphere);

    // Shimmering Champagne Gold Orbit Rings
    var ring1Geo = new THREE.TorusGeometry(7.2, 0.02, 16, 120);
    var ring1Mat = new THREE.MeshBasicMaterial({ color: 0xC9A24B, transparent: true, opacity: 0.45 });
    var ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 2.5;
    ring1.rotation.y = Math.PI / 6;
    globeGroup.add(ring1);

    var ring2Geo = new THREE.TorusGeometry(7.9, 0.015, 16, 120);
    var ring2Mat = new THREE.MeshBasicMaterial({ color: 0x1F5F63, transparent: true, opacity: 0.35 });
    var ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = -Math.PI / 3;
    ring2.rotation.z = Math.PI / 4.5;
    globeGroup.add(ring2);

    // Beacons: Sète (HQ in pure gold) + European Sending Capitals (Madrid, Berlin, Amsterdam, Rome, Warsaw)
    var hubs = [
      { pos: new THREE.Vector3(1.2, 2.4, 4.9), color: 0xC9A24B, size: 0.18 }, // Sète HQ
      { pos: new THREE.Vector3(0.5, 2.1, 5.1), color: 0x74C8CC, size: 0.11 }, // Madrid
      { pos: new THREE.Vector3(1.8, 3.1, 4.3), color: 0xE6C87C, size: 0.11 }, // Berlin
      { pos: new THREE.Vector3(1.1, 3.0, 4.5), color: 0x74C8CC, size: 0.11 }, // Amsterdam
      { pos: new THREE.Vector3(2.0, 2.0, 4.8), color: 0xE6C87C, size: 0.11 }, // Rome
      { pos: new THREE.Vector3(2.5, 3.1, 3.9), color: 0x74C8CC, size: 0.11 }  // Warsaw
    ];

    var setePos = hubs[0].pos;
    var curves = [];
    hubs.forEach(function(h, idx) {
      var dotGeo = new THREE.SphereGeometry(h.size, 16, 16);
      var dotMat = new THREE.MeshBasicMaterial({ color: h.color });
      var dot = new THREE.Mesh(dotGeo, dotMat);
      dot.position.copy(h.pos);
      globeGroup.add(dot);

      if (idx > 0) {
        var mid = h.pos.clone().add(setePos).multiplyScalar(0.5).normalize().multiplyScalar(6.5);
        var curve = new THREE.QuadraticBezierCurve3(h.pos, mid, setePos);
        curves.push(curve);
        var points = curve.getPoints(36);
        var arcGeo = new THREE.BufferGeometry().setFromPoints(points);
        var arcMat = new THREE.LineBasicMaterial({ color: h.color, transparent: true, opacity: 0.55 });
        var arcLine = new THREE.Line(arcGeo, arcMat);
        globeGroup.add(arcLine);
      }
    });

    // Ambient Starlight
    var partCount = 180;
    var partPositions = new Float32Array(partCount * 3);
    for (var i = 0; i < partCount * 3; i++) {
      partPositions[i] = (Math.random() - 0.5) * 36;
    }
    var partGeo = new THREE.BufferGeometry();
    partGeo.setAttribute('position', new THREE.BufferAttribute(partPositions, 3));
    var partMat = new THREE.PointsMaterial({ color: 0xC9A24B, size: 0.08, transparent: true, opacity: 0.6 });
    var particleSystem = new THREE.Points(partGeo, partMat);
    scene.add(particleSystem);

    var heroSection = document.getElementById('hero');
    function resizeRenderer() {
      if (!heroSection) return;
      var w = heroSection.clientWidth || window.innerWidth;
      var h = heroSection.clientHeight || window.innerHeight;
      renderer.setSize(w, h, false);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      camera.aspect = w / Math.max(1, h);
      camera.updateProjectionMatrix();
    }
    resizeRenderer();
    window.addEventListener('resize', resizeRenderer);

    var targetRotX = 0.12;
    var targetRotY = -0.3;
    window.addEventListener('mousemove', function(e) {
      var nx = (e.clientX / Math.max(1, window.innerWidth)) - 0.5;
      var ny = (e.clientY / Math.max(1, window.innerHeight)) - 0.5;
      targetRotY = -0.3 + nx * 0.75;
      targetRotX = 0.12 + ny * 0.45;
    }, { passive: true });

    function animate3D() {
      requestAnimationFrame(animate3D);
      if (!reduceMotion) {
        wireSphere.rotation.y += 0.0016;
        ring1.rotation.z += 0.002;
        ring2.rotation.y -= 0.0018;
        particleSystem.rotation.y += 0.0005;
      }
      var scrollFactor = (window.pageYOffset || 0) * 0.001;
      globeGroup.rotation.y += (targetRotY + scrollFactor - globeGroup.rotation.y) * 0.04;
      globeGroup.rotation.x += (targetRotX - globeGroup.rotation.x) * 0.04;
      renderer.render(scene, camera);
    }
    animate3D();
  })();

  // --- 11. FAQ Accordion Toggle ---
  var faqToggles = document.querySelectorAll('.faq-toggle');
  faqToggles.forEach(function(toggle) {
    toggle.addEventListener('click', function() {
      var content = toggle.nextElementSibling;
      var icon = toggle.querySelector('.faq-icon');
      var isExpanded = !content.classList.contains('hidden');
      
      document.querySelectorAll('.faq-content').forEach(function(c) { c.classList.add('hidden'); });
      document.querySelectorAll('.faq-icon').forEach(function(i) { i.textContent = '▼'; });

      if (!isExpanded) {
        content.classList.remove('hidden');
        if (icon) icon.textContent = '▲';
      }
    });
  });

  // --- 12. AI Concierge Slide-over Drawer ---
  var floatingAiBtn = document.getElementById('floating-ai-btn');
  var openAiModalBtn = document.getElementById('open-ai-modal-btn');
  var closeAiDrawerBtn = document.getElementById('close-ai-drawer-btn');
  var aiDrawer = document.getElementById('ai-chat-drawer');
  var aiChatForm = document.getElementById('ai-chat-form');
  var aiUserInput = document.getElementById('ai-user-input');
  var aiMessages = document.getElementById('ai-messages');

  function openAiDrawer() {
    if (aiDrawer) aiDrawer.classList.remove('translate-x-full');
  }
  function closeAiDrawer() {
    if (aiDrawer) aiDrawer.classList.add('translate-x-full');
  }

  if (floatingAiBtn) floatingAiBtn.addEventListener('click', openAiDrawer);
  if (openAiModalBtn) openAiModalBtn.addEventListener('click', openAiDrawer);
  if (closeAiDrawerBtn) closeAiDrawerBtn.addEventListener('click', closeAiDrawer);

  var aiAnswers = {
    sete: "Sète is our Mediterranean operational headquarters! Located between the sea and Thau Lagoon, it features canals, traditional water jousting in summer, fresh oyster farming, and Paul Valéry cultural sites. It is exceptionally pedestrian and safe for school and training groups.",
    erasmus: "Formaskills Travel acts as a reliable host receiving partner in France for Erasmus+ Key Action 1. We organize vocational placements, school group activities, language preparation, and local logistics. Funding is managed by your sending institution through its National Agency.",
    job: "We coordinate Staff Job Shadowing across 12 specific sectors including Education, IT/Digital, Health & Care, Tourism/Hospitality, Viticulture/Agriculture, and Cultural Heritage. Participants observe French workplace practices for 1 to 4 weeks.",
    flight: "Formaskills Travel coordinates ground reception, accommodation, courses, and activities in France, but does not sell or book long-haul international flights. International air travel is booked independently by your school or group.",
    default: "Thank you for asking! Formaskills Travel designs tailor-made educational mobility, FLE French language immersion, and cultural discovery across Sète, Montpellier, Paris, and Nice. All proposals are prepared personally by our team with no instant booking or hidden charges."
  };

  function addAiMessage(text, isUser) {
    if (!aiMessages) return;
    var msgDiv = document.createElement('div');
    msgDiv.className = isUser 
      ? 'p-3 bg-amber-400 text-slate-950 font-medium rounded-2xl ml-8 text-xs leading-relaxed shadow'
      : 'p-3 bg-slate-800 text-slate-200 rounded-2xl mr-8 text-xs leading-relaxed border border-slate-700';
    msgDiv.textContent = text;
    aiMessages.appendChild(msgDiv);
    aiMessages.scrollTop = aiMessages.scrollHeight;
  }

  if (aiChatForm && aiUserInput) {
    aiChatForm.addEventListener('submit', function(e) {
      e.preventDefault();
      var q = aiUserInput.value.trim();
      if (!q) return;
      addAiMessage(q, true);
      aiUserInput.value = '';

      setTimeout(function() {
        var lower = q.toLowerCase();
        var reply = aiAnswers.default;
        if (lower.indexOf('sete') >= 0 || lower.indexOf('sète') >= 0) reply = aiAnswers.sete;
        else if (lower.indexOf('erasmus') >= 0 || lower.indexOf('mobility') >= 0) reply = aiAnswers.erasmus;
        else if (lower.indexOf('shadow') >= 0 || lower.indexOf('sector') >= 0) reply = aiAnswers.job;
        else if (lower.indexOf('flight') >= 0 || lower.indexOf('plane') >= 0) reply = aiAnswers.flight;

        addAiMessage(reply, false);
      }, 400);
    });
  }

  document.querySelectorAll('.ai-prompt-chip').forEach(function(chip) {
    chip.addEventListener('click', function() {
      if (aiUserInput && aiChatForm) {
        aiUserInput.value = chip.textContent;
        aiChatForm.dispatchEvent(new Event('submit'));
      }
    });
  });

})();
