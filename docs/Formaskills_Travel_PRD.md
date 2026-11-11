# Product Requirements Document (PRD): Formaskills Travel Platform

**Document Version:** 1.0.0  
**Status:** Approved for Implementation & Production Review  
**Target Release:** Current Production Preview (Build v20261106) & Phase 2 Roadmap  
**Entity:** FORMASKILLS TRAVEL SAS (RCS Montpellier SIREN 990 746 430)  
**Authors:** Product Management, Technical Architecture, and Operations Teams  
**Distribution:** Internal Engineering, Operations, Business Development, Partner Network  

---

## 1. Executive Summary & Vision

### 1.1 Mission & Value Proposition
**Formaskills Travel** is a specialized educational travel, language training, and international group mobility platform coordinated from Sète (Occitanie, France). The platform bridges international educational institutions, vocational training organizations, corporate teams, individual learners, and local French ecosystem partners. 

Guided by the brand motto **"Learn. Explore. Experience. Grow."** and corporate philosophy **"Your journey begins before you land,"** the platform eliminates the rigid, impersonal nature of packaged tourism. Instead, it provides hyper-tailored educational immersion programs, structured Erasmus+ mobility hosting, French as a Foreign Language (FLE) training, and authentic cultural exploration across four featured French regions: Sète, Montpellier, Paris, and Nice.

### 1.2 Core Product Philosophy: "Enquiry != Booking"
A foundational design requirement of the Formaskills Travel web platform is the explicit structural decoupling of **exploration and bespoke inquiry** from **transactional e-commerce booking**:
* The digital platform does not operate a self-checkout cart or immediate payment gateway.
* Because bespoke educational mobility requires human coordination, institutional compliance (e.g., Erasmus+ National Agency criteria), custom host allocation, and group-specific logistical validation, the platform acts as an **intelligent intake, diagnostic, and project planning engine**.
* The software guides users through structured questionnaires, gathers multifaceted requirements, provides instant contextual intelligence, and compiles standardized briefs transmitted directly to the French coordination team for personal human-in-the-loop quoting.

---

## 2. Corporate Governance, Legal Framework & Regulatory Boundaries

| Attribute | Specification |
| :--- | :--- |
| **Legal Entity Name** | FORMASKILLS TRAVEL SAS |
| **Registration Identifiers** | SIREN: `990 746 430` \| SIRET: `990 746 430 00018` \| Trade Register: RCS Montpellier |
| **VAT Number** | `FR28990746430` |
| **Registered Corporate Office** | 10 rue du Micocoulier, 34680 Saint-Georges-d’Orques, France |
| **Operational & Contact Office** | 6 rue Voltaire, 34200 Sète, France |
| **Executive & Operational Team** | **Amel M.** (Administration & Coordination) & **Rohith T.** (Client Relations & Business Development) |
| **Primary Communications** | Email: `contact.skillstravel@gmail.com` \| Tel: `+33 9 75 46 22 81` (Mon–Fri 08:30–16:30 CET) |
| **Social & Messaging Channels** | Instagram (`@formaskills_travels`), TikTok (`@formaskills_travels`), LinkedIn (`formaskills-travel`), WhatsApp / Telegram (in preparation) |

### 2.1 Regulatory Boundaries & Tourism Disclaimers
* **Travel Operator Status**: The company registration number identifies the corporate entity but does not constitute an Atout France tour operator license. The platform explicitly discloses that it does not claim Atout France registration, financial guarantees, or professional travel agency insurance for unbundled travel.
* **International Transport Unbundling**: Formaskills Travel is not authorized to sell or book long-haul international flights. International air transit to/from France must be booked independently by sending organizations or travellers. The platform provides arrival logistics and advisory assistance only for regional French transit (rail stations, local airport transfers).
* **Erasmus+ Grant Governance**: The platform coordinates hosting and logistics but does not evaluate grant eligibility or administer EU funding. Sending institutions remain strictly responsible for their own grant agreements with National Agencies, supervisory ratios, and traveller safeguarding.

---

## 3. User Personas & Journey Mapping

The platform addresses three core customer segments ("The Three Doors"):

```
                        +---------------------------+
                        |  Formaskills Travel Web   |
                        +-------------+-------------+
                                      |
         +----------------------------+---------------------------+
         |                                                        |
+--------v--------+                                      +--------v--------+
|   "FOR ME"      |                                      | "FOR MY ORG"    |
| (B2C / Indiv.)  |                                      | (B2B / Groups)  |
+--------+--------+                                      +--------+--------+
         |                                                        |
         |-- French Online Learning                               |-- Erasmus+ Group Mobility
         |-- Cultural Stays & Excursions                          |-- Group FLE Language Immersion
         |-- Au Pair & Host Family Stays                          |-- Staff Job Shadowing (12 Sectors)
         |-- Bespoke Solo/Family Travel                           |-- Local Logistics & Accommodations
                                      |
                        +-------------v-------------+
                        |   "BECOME A PARTNER"      |
                        |   (Local & Global Supply) |
                        +-------------+-------------+
                                      |
                                      |-- Work Placement Hosts (SMEs)
                                      |-- Accommodation Providers
                                      |-- Cultural Activity Guides
                                      |-- Educational Sending Agents
```

### 3.1 Persona Summary Matrix

| Persona Code | Archetype | Primary Needs | Typical Constraints | Preferred Journey |
| :--- | :--- | :--- | :--- | :--- |
| **IND-01** | **Independent French Learner** | Remote FLE classes, flexible pacing, conversational improvement. | Scheduling across time zones, CEFR level uncertainty. | `/learn-french/` → Diagnostic → Online Platform Inquiry. |
| **IND-02** | **Cultural Explorer / Family** | Authentic Mediterranean stays in Sète/Montpellier, heritage, gastronomy. | Managing multi-age groups, avoidance of tourist traps. | Interactive France Map → `/tourism/` → Experience Builder. |
| **IND-03** | **Au Pair Candidate / Host Family** | Safe, vetted cultural exchange matching in France. | Legal work hours, pocket money guidelines, living amenities. | `/au-pair-and-host-families/` → Au Pair / Family Questionnaire. |
| **ORG-01** | **Erasmus+ VET / School Coordinator** | Structured group mobility hosting, learning agreements, local logistics. | Strict EU grant budgets, documentation compliance, zero named pupil data leakage. | `/for-organisations/plan-group-mobility/` → Experience Builder (`org`). |
| **ORG-02** | **Educational / Corporate Trainer** | Staff job shadowing, workplace observation, peer exchange in France. | Industry-specific company placements, language barriers. | `/for-organisations/#job-shadowing` → Sector Selector → Tailored Brief. |
| **PTR-01** | **Local Business / Host Enterprise** | Welcoming European trainees/interns, intercultural exchange without HR overhead. | Supervision limits, clear legal placement frameworks. | `/partners/` → Partner Intake Form (`partner.js`). |
| **PTR-02** | **Local Lodging / Activity Vendor** | Steady group occupancy outside peak seasons, contracted school groups. | Group size minimums/maximums, seasonal availability. | `/partners/` → Vendor Capacity Registry. |

---

## 4. Product Offerings & Service Portfolio

### 4.1 French as a Foreign Language (FLE)
* **Delivery Formats**:
  1. *Online Learning*: Dedicated asynchronous/synchronous learning platform for individual learners worldwide.
  2. *In-Person Immersion*: On-site face-to-face group training delivered in Sète and partner destinations.
  3. *Blended Programs*: Pre-departure online preparation, intensive on-site immersion in France, and post-stay consolidation.
* **Curriculum Focus**: General conversational French, Intensive French, and Professional/Business French tailored to vocational sectors.

### 4.2 Erasmus+ & Group Mobility Hosting
* **Target Sectors**: School Education, Vocational Education & Training (VET), Higher Education (HE).
* **Mobility Types Supported**: Group pupil mobility, individual learner mobility, vocational apprentice placements, and staff teaching/training mobility.
* **Core Coordination Scope**: Welcoming groups on arrival, local transit passes, vetted student accommodation, meal plans, pedagogical site visits, and structured tutoring.

### 4.3 Job Shadowing & Professional Observation
Structured peer observation allowing educators, trainers, and industry professionals to observe French practices across 12 distinct sectors:
1. Education & Teaching
2. Early Childhood & Youth Work
3. Tourism & Hospitality
4. Culture, Arts & Heritage
5. Business & Administration
6. Health & Social Care
7. Information Technology & Digital
8. Agriculture & Environment
9. Engineering & Technical Trades
10. Languages & Communication
11. Sport & Leisure
12. Custom / Multi-disciplinary

### 4.4 Cultural Activities & Regional Discovery
Custom experiential itineraries centered in four primary focal hubs:
* **Sète (Mediterranean Port)**: Canals, fishing harbour, water jousting traditions, Mont Saint-Clair, Thau Lagoon oyster beds. (Peak: July–August).
* **Montpellier (Dynamic University Hub)**: Écusson historic center, pedestrian squares, Musée Fabre, student life. (Peak: July).
* **Paris (Cultural Heritage Capital)**: Museums (Louvre, Orsay), architectural landmarks, historic quarters (Marais, Montmartre). (Peak: May–June).
* **Nice (French Riviera / Côte d’Azur)**: Promenade des Anglais, Vieux Nice markets, Mediterranean outdoor activities. (Peak: September).

### 4.5 Au Pair & Host Family Exchange Network
Facilitation of long-term cultural stays:
* Candidate Au Pair intake (language skills, childcare experience, preferred cities, duration 3–12+ months).
* Host Family intake (children count/ages, private room/bath amenities, pocket money allowance, transport passes, expected hours).

---

## 5. Functional Requirements: Feature Specifications

### 5.1 FR-1: Dynamic Experience Builder ("Plan My Project" - `/plan-your-stay/`)

The Experience Builder is a client-side, multi-branching project scoping wizard designed to capture detailed requirements across all three personas without requiring user account creation or server-side database storage.

```
                          [Start: Select Persona Door]
                                       |
                 +---------------------+---------------------+
                 |                     |                     |
              "For Me"         "For Organisation"    "Become Partner"
                 |                     |                     |
           Select Purpose         Select Org Type       Select Offered Svc
                 |                     |                     |
         [Branch Logic]        [Branch Logic]         [Capacity & Lang]
         - Au Pair Flow        - Erasmus+ Flow               |
         - Host Family Flow    - School/Group Flow           v
         - Travel/Learn Flow   - Job Shadow Flow        [Place & Terms]
                 |                     |                     |
                 +---------------------+---------------------+
                                       |
                                       v
                              [Timing & Duration]
                                       |
                                       v
                          [Review & In-Place Editing]
                                       |
                 +---------------------+---------------------+
                 |                     |                     |
                 v                     v                     v
          [Launch Mailto]       [Copy to Clipboard]   [Download .txt]
```

#### Detailed Specification
1. **Persona Branching**:
   * If `me`: Routes through personal purpose (`learn`, `culture`, `discover`, `aupair`, `hostfamily`). If `aupair` or `hostfamily` selected, dynamically displays specialized sub-questionnaires (amenities, childcare tasks, pocket money).
   * If `org`: Prompts for organization classification (`erasmus`, `group`, `training`, `other`). Conditional branches dynamically load Erasmus+ accreditation, sector (School, VET, HE), funding status (`grant awarded`, `application submitted`, `preparing application`, `outside Erasmus+`), and participant numbers.
   * If `partner`: Gathers supply offerings (`accommodation`, `meals`, `transport`, `activities`, `french`, `jobshadow`, `agency`), languages spoken, capacity constraints, and job shadowing hosting willingness.
2. **Job Shadowing Field Picker**:
   * Dynamic fieldlist component allowing institutions to select one or multiple industries from the 12 supported fields and allocate specific participant counts to each.
3. **Data Sanitization & Privacy Guards**:
   * Warning prompts explicitly instruct users not to enter passport numbers, health records, or payment information.
4. **Universal English Normalization**:
   * Regardless of whether the user navigates in French, Spanish, German, Italian, Polish, or Chinese, the builder translates all selected option codes into a standardized English plain-text brief. This ensures the operations team receives consistent, actionable data.
5. **Output Actions**:
   * *Open in Email Client*: Launches a formatted `mailto:` URL pre-populated with subject and body (capped at 1,800 characters to prevent OS mail client clipping).
   * *Copy Summary*: Copies the complete structured text to clipboard with visual confirmation feedback.
   * *Download .txt*: Generates a local browser text file download for archival or offline forwarding.

---

### 5.2 FR-2: Formaskills AI Assistant (`chat.js` & `chat_api.py`)

A dual-mode, privacy-first conversational assistant that operates autonomously within the browser or bridges to an LLM backend when connected.

```
                                [User Submits Prompt]
                                          |
                                          v
                              [Sensitive Content Check]
                               (Disallow Health/Cards)
                                          |
                                          v
                             Is Backend API Connected?
                               /                                                  YES                      NO
                             /                                                     v                           v
                  [Remote LLM Stream]         [Local Client TF-IDF Search]
                  - /api/chat Endpoint        - Tokenize Query
                  - System Prompt Guardrails  - Score vs assets/kb/{lang}.json
                  - Structured Response       - Rank Pages & Display Excerpt
                            \                           /
                             +------------+------------+
                                          |
                                          v
                              [Optional Guided Enquiry]
                                (6-Step Structured Flow)
                                          |
                                          v
                              [Generate English Summary]
```

#### Detailed Specification
1. **Dual-Mode Operational Architecture**:
   * **Mode A: Cloud AI (Active Backend)**: Sends a `POST` request to `/api/chat` passing current locale, active pathname, conversation history, and builder context.
   * **Mode B: Local Knowledge-Base Search (Offline Fallback)**: If `/api/chat/status` reports inactive or fails, the assistant switches to local search. It parses the pre-compiled knowledge base (`assets/kb/{lang}.json`) using in-browser tokenization, term-frequency scoring, and cosine-like ranking, returning exact grounded excerpts.
2. **Built-In Guided Enquiry Engine**:
   * Offers users a self-contained 6-question in-chat intake sequence:
     1. Persona (`g_who`: Me, Org, Partner, Unsure)
     2. Primary Interest (`g_int`: Courses, Culture, Mobility, Tourism, Other)
     3. Destination Preference (`g_place`: Sète, Montpellier, Paris, Nice, Unsure)
     4. Timeframe (`g_when`: 3 mo, 3-6 mo, 6-12 mo, Flexible)
     5. Group Size (`g_size`: Numerical headcount)
     6. Notes & Objectives (`g_note`: Free-text field)
   * Automatically generates a synthesized English enquiry summary ready for instant email transmission or direct handoff to the Experience Builder.
3. **Mandatory Guardrails & Policy Filters**:
   * *Zero Direct Booking Disclaimer*: Explicitly responds that it cannot reserve rooms, take payments, or confirm dates.
   * *Zero Fixed Price Disclaimer*: Informs the user that bespoke travel pricing requires tailored human quotation.
   * *No Health / PII Ingestion*: Detects and rejects medical records or passport submissions.
   * *Erasmus+ Funding Clarification*: Warns that enquiry does not guarantee EU funding and directs users to National Agencies.
   * *Atout France Clarification*: Discloses that Formaskills Travel coordinates local services and does not operate as an international air ticket agency.

---

### 5.3 FR-3: Interactive SVG France Regional & City Showcase

An interactive, responsive vector map of France embedded directly on the homepage and destination hubs.

```
+-------------------------------------------------------------------------+
| [SVG MAP OF FRANCE]                                                     |
|                                                                         |
|                * Paris (Île-de-France)                                  |
|                  May - June Recommended                                 |
|                                                                         |
|                                                                         |
|                                     * Nice (PACA)                       |
|                                       September Recommended             |
|                                                                         |
|            * Montpellier (Occitanie)                                    |
|              July Recommended                                           |
|                                                                         |
|       * Sète (Occitanie - Port Hub)                                     |
|         July - August Recommended                                       |
+-------------------------------------------------------------------------+
| Live Card Details:                                                      |
| Sète: Mediterranean Coast | Historic canals | Water jousting | Lagoon   |
+-------------------------------------------------------------------------+
```

#### Detailed Specification
1. **Interactive Elements**:
   * Clean geometric SVG representation of metropolitan France and Corsica.
   * Highlighting vectors for three administrative regions: **Occitanie**, **Île-de-France**, and **Provence-Alpes-Côte d’Azur (PACA)** with custom patterned fills (`patternTransform="rotate(45)"`).
   * Four clickable city anchors with enlarged touch targets (`r=26` hit area, `r=12` visible ring, `r=6` center coordinate): **Sète**, **Montpellier**, **Paris**, **Nice**.
2. **Dynamic Card Synchronization**:
   * Hovering or keyboard-focusing a city or region instantly displays the destination profile card, cultural tags, key highlights, and recommended travel window.
   * Includes fallback selector buttons (`.fm-picks`) ensuring 100% usability on mobile viewports and touchscreens.

---

### 5.4 FR-4: "Find My Project" Rapid Diagnostic Modal (`find.js`)

A 2-step decision tree accessible from primary hero CTA buttons (`data-find`):
1. **Step 1**: "Who is this for?" (For Me, For My Organisation, Become a Partner).
2. **Step 2**: "What interests you most?" (Dynamic options based on Step 1: Learn French, Tourism, Au Pair, Erasmus+, Job Shadowing, Group Mobility).
3. **Resolution**: Suggests the optimal dedicated landing page, provides a direct link to the Experience Builder with pre-populated URL parameters (`?for=org&type=erasmus`), or opens the direct enquiry modal.

---

### 5.5 FR-5: In-Browser Tokenized Search Engine (`search.js`)

1. **Architecture**: Fully client-side search indexing that requires zero server-side querying.
2. **Index Generation**: Reads `assets/kb/{lang}.json` containing structured text and section headings from all pages.
3. **NLP Processing**:
   * Normalizes Unicode diacritics and accented characters (e.g., `é` -> `e`).
   * Strips language-specific stop words (configured per locale).
   * Applies character-length stemming (stem threshold = 6) and CJK bi-gram tokenization for Chinese text.
   * Calculates TF-IDF relevance scoring with weighted bonuses for page titles (weight 2x) and section headings (weight 3x).

---

### 5.6 FR-6: Specialized Intake Subsystems (`partner.js`, `write.js`, `chips.js`)

1. **Partner Intake (`partner.js`)**:
   * Validates organization name, contact person, email, partner category, and service capabilities.
   * Toggles contextual helper notes when a company indicates interest in hosting trainees or job shadowing.
   * Formats a clean, professional English intake record for the partnership desk.
2. **Topic-Seeded Contact Form (`write.js`)**:
   * Accepts deep-link parameters (`?topic=groupmob#write`).
   * Automatically pre-fills topic banners and email subject headers (`Formaskills Enquiry: Plan group mobility`), focusing the user directly into the input area.
3. **Interactive Quick Chips (`chips.js`)**:
   * Accessible popover tooltips on key program terms throughout the UI, enabling instant exploration of definitions without navigational disruption.

---

### 5.7 FR-7: Multilingual Internationalization (i18n) Engine

1. **7 Native Locales**:
   * `fr` (French - Default / Domestic)
   * `en` (English - Universal International Default)
   * `es` (Spanish)
   * `de` (German)
   * `it` (Italian)
   * `pl` (Polish)
   * `zh` (Simplified Chinese)
2. **SEO & Routing**:
   * Strict path prefixes (`/fr/`, `/en/`, `/es/`, etc.).
   * Comprehensive `<link rel="alternate" hreflang="..." />` mapping across all localized pages with `x-default` mapped to `/en/`.

---

## 6. Technical Architecture & Data Specifications

### 6.1 Frontend Stack & Design Standards
* **Core Philosophy**: Zero-bloat, vanilla Jamstack. No external CSS frameworks, no client-side runtime libraries (no React, Angular, or jQuery).
* **Typography**: Self-hosted WOFF2 web fonts to prevent Google Fonts CDN tracking:
  * Primary Body & Navigation: `DM Sans` (Latin & Latin-Ext)
  * Headings & UI Elements: `Manrope` (Latin & Latin-Ext)
  * Editorial Accents: `Fraunces` (Italic Latin & Latin-Ext)
* **CSS Architecture**: CSS Custom Properties (`--brand: #315fc4`, `--linen: #f8f6f0`, `--dark: #1b2538`), responsive flexbox/grid, accessible focus rings, and strict `prefers-reduced-motion` compliance.

### 6.2 Knowledge Base Schema (`assets/kb/{lang}.json`)
The client search engine and offline assistant rely on a standardized static schema:

```json
{
  "lang": "en",
  "contact": {
    "email": "contact.skillstravel@gmail.com",
    "phone": "+33 9 75 46 22 81",
    "hours": "Monday to Friday, 08:30-16:30, France time. Closed on public holidays.",
    "address": "6 rue Voltaire, 34200 Sète, France"
  },
  "ui": {
    "launch": "Open Formaskills AI, the assistant",
    "welcome": "Hello, and welcome! I am Formaskills AI...",
    "price": "Thank you for asking. This website does not show prices...",
    "nobook": "Thank you for asking. I am not able to book..."
  },
  "stop": ["what", "can", "you", "your", "the", "and", "..."],
  "stem": 6,
  "pages": [
    {
      "t": "Page Title",
      "u": "/en/page-path/",
      "s": [
        ["Section Heading", "Paragraph text content..."]
      ]
    }
  ]
}
```

### 6.3 Chat API Interface Specification (`/api/chat`)
When connected to the remote intelligence service (`chat_api.py`), the request/response contract is defined as follows:

#### Endpoint: `POST /api/chat`
* **Request Headers**: `Content-Type: application/json`
* **Request Payload**:
  ```json
  {
    "lang": "en",
    "path": "/en/destinations/sete/",
    "messages": [
      {"role": "user", "content": "What French immersion programs are available in Sète?"}
    ],
    "context": {
      "who": "org",
      "interest": "courses",
      "place": "sete",
      "when": "m3",
      "size": "15"
    }
  }
  ```
* **Response Payload (HTTP 200)**:
  ```json
  {
    "reply": "We offer group FLE immersion courses in Sète combining intensive classroom learning with coastal cultural activities...",
    "citations": [
      {"title": "Sète Destination Hub", "url": "/en/destinations/sete/"},
      {"title": "FLE Group Programs", "url": "/en/for-organisations/#french-and-immersion"}
    ],
    "suggested_actions": ["prepare_enquiry", "open_builder"]
  }
  ```

#### Endpoint: `GET /api/chat/status`
* **Response Payload (HTTP 200)**:
  ```json
  {
    "status": "online",
    "ai": true,
    "model": "gemini-pro-compatible",
    "version": "2026.11"
  }
  ```

---

## 7. Security, Privacy & Compliance (GDPR & WCAG)

### 7.1 Data Protection & Privacy by Design
* **Zero First-Party Tracking**: The website does not store analytics cookies, marketing pixels, or tracking scripts.
* **Storage Isolation**: Browser storage is restricted to ephemeral `sessionStorage` (tab-scoped) for maintaining chat drafts and topic pre-fills across pages. Data is purged upon closing the tab.
* **Consent Gate**: The AI assistant enforces an upfront consent modal disclosing that messages are processed via an external AI service before initiating chat.
* **No Unsolicited PII Collection**: The platform operates on a data minimization principle, advising visitors never to transmit passport copies, medical files, or bank details.

### 7.2 Security Hardening Headers (`_headers`)
```http
/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  X-Frame-Options: SAMEORIGIN
  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; frame-src https://www.google.com https://docs.google.com; frame-ancestors 'self'; base-uri 'self'; form-action 'self'; object-src 'none'

/assets/*
  Cache-Control: public, max-age=31536000, immutable
```

### 7.3 Accessibility Compliance (Target: WCAG 2.2 AA)
* **Keyboard Navigability**: Full tab order traversal, visible focus rings, Escape-key dismissal for dialogs, popovers, and menus.
* **Screen Reader Optimization**: Semantic headings (`<h1>`–`<h3>`), ARIA attributes (`aria-expanded`, `aria-controls`, `aria-selected`, `aria-live="polite"`).
* **Reduced Motion**: All CSS animations, auto-sliding destination carousels, and smooth-scrolling behaviors automatically disable when `(prefers-reduced-motion: reduce)` is signaled.

---

## 8. Operational Workflows & Human-in-the-Loop Fulfillment

```
+-------------------------------------------------------------------------+
| STEP 1: USER SCOPING                                                    |
| User completes Experience Builder, Contact Form, or AI Assistant.       |
| Form compiles standardized English specification.                       |
+-------------------------------------------------------------------------+
                                  |
                                  v
+-------------------------------------------------------------------------+
| STEP 2: INTAKE & TRIAGE (Formaskills Operations)                        |
| - Amel M. logs enquiry, validates project viability & date windows.     |
| - Rohith T. conducts client consultation call / video conference.       |
+-------------------------------------------------------------------------+
                                  |
                                  v
+-------------------------------------------------------------------------+
| STEP 3: BESPOKE PROPOSAL GENERATION                                     |
| Operations team contacts vetted local partners (lodging, FLE, hosts).   |
| Prepares tailored quote: exact inclusions, exclusions, and rates.       |
+-------------------------------------------------------------------------+
                                  |
                                  v
+-------------------------------------------------------------------------+
| STEP 4: INSTITUTIONAL SIGN-OFF & DELIVERY                               |
| Client signs proposal agreement. Sending institution handles flights.   |
| Formaskills Sète team executes on-the-ground hosting & coordination.   |
+-------------------------------------------------------------------------+
```

---

## 9. Success Metrics & Telemetry (Privacy-Preserving)

| Objective | KPI Metric | Target Benchmark | Measurement Method |
| :--- | :--- | :--- | :--- |
| **Intake Efficiency** | Builder Completion Rate | > 35% of started wizards | Local client-side event counter (no PII) |
| **Data Quality** | First-Contact Completeness | > 85% with dates, group size, and sector | Operations CRM audit |
| **Multilingual Reach** | Non-English Inquiries | > 50% across ES, DE, IT, PL, ZH | Incoming email locale attribution |
| **AI Utility** | Assistant Enquiry Assembly | > 20% of total leads initiated via AI | Chat summary payload tag (`#ai-guided`) |
| **Page Performance** | Core Web Vitals (LCP / CLS) | LCP < 1.2s, CLS = 0.00 | Lighthouse audit / RUM testing |

---

## 10. Product Roadmap & Phased Evolution

```
[Phase 1: Foundation (Current)]
  * Jamstack Static Site in 7 Locales
  * Experience Builder with Mailto/Copy/Download Output
  * Dual-Mode Formaskills AI & Client TF-IDF Search
  * SVG Destination Showcase
  * Partner Intake & Sector Checklists

         |
         v

[Phase 2: Operational Scaling (6-Month Horizon)]
  * Direct Secure CRM Webhook Integration (Eliminating client mailto reliance)
  * Interactive Group Itinerary Previewer & Quotation Simulator
  * Partner Extranet Portal (Host availability & placement confirmations)
  * Dedicated Online FLE Classroom Integration (LMS Portal)

         |
         v

[Phase 3: Strategic Expansion (12-Month Horizon)]
  * Atout France Registration Evaluation (Packaged Travel Directive compliance)
  * Integrated Booking & Escrow Deposit Engine for Standardized Modules
  * Additional Regional Hubs (Bordeaux, Lyon, Strasbourg)
  * Dedicated Erasmus+ Mobility Reporting Dashboard for Partner Schools
