# Feature Specification: Intello Bilingual Marketing Website

**Feature Branch**: `001-intello-marketing-website`

**Created**: 2026-11-17

**Status**: Draft

**Input**: User description: "Build a website for Intello, a company that provides back office and shipment tracking services for logistics companies, plus technology services and data analysis, both supported by AI. Use the Intello design system, with the cleanest structure and mood of the reference site in the attached screenshot (a clean, simple, tech-feeling logistics site with large imagery). The reference is in Russian; the site must be in Spanish and English as set out in the constitution. Imagery may be generated with the Higgsfield connector to keep imagery as the predominant visual element, as in the reference."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Understand what Intello does from the homepage (Priority: P1)

A decision-maker at a courier, 3PL operator or freight company lands on the homepage. Within seconds they see who Intello is, what it offers (back office, shipment tracking, technology services, AI data analysis), and how to take the next step. The page feels calm, precise and technical, like the reference: a light page, a large two-tone headline, strong muted-colour imagery, and a white rounded panel that rises over the hero to carry the about and services content.

**Why this priority**: The homepage is the first impression and the minimum viable site. A visitor who cannot tell what Intello does in a few seconds will leave.

**Independent Test**: Open the homepage in each language and ask a first-time visitor to say what Intello offers and who it is for, without scrolling past the services section. Delivers value on its own even if no other page exists.

**Acceptance Scenarios**:

1. **Given** a first-time visitor on the homepage, **When** the page finishes loading, **Then** the first screen shows the Intello logo, the main navigation, an eyebrow line, a two-tone headline, a short supporting paragraph, a primary call to action, four capability highlights and a large muted-colour image.
2. **Given** the first screen, **When** the visitor scrolls, **Then** a white rounded panel overlaps the bottom of the hero and contains, in order: the about block (heading, short text, two images, link to more), a divider, and the services block (heading, link to all services, four service cards).
3. **Given** any service card, **When** the visitor selects its arrow or title, **Then** they reach that service's section on the Services page.
4. **Given** the homepage, **When** the visitor scrolls to the end, **Then** they find a closing call to action to contact Intello and a footer with navigation, contact details and the language selector.

---

### User Story 2 - Contact Intello or request a demo (Priority: P1)

A visitor who is interested wants to talk to Intello. They reach the contact form from any page, fill in their details and message, send it, and receive a clear confirmation. The Intello team receives the enquiry by email and can reply directly to the visitor.

**Why this priority**: This is the site's single conversion goal. Without it the site informs but generates no business.

**Independent Test**: Submit the form with valid details and confirm the Intello team's inbox receives the enquiry and the visitor sees a confirmation; submit with invalid details and confirm clear, field-level messages appear. Delivers value even if only the homepage and contact page exist.

**Acceptance Scenarios**:

1. **Given** a visitor on any page, **When** they select the primary call to action ("Solicitar demo" / "Request a demo") or the Contact link, **Then** they arrive at the contact form in no more than two selections.
2. **Given** a completed valid form, **When** the visitor sends it, **Then** they see a confirmation in their language and the Intello team receives an email containing every field, the language the visitor used, and a reply address that is the visitor's.
3. **Given** a form with a missing required field or an invalid email, **When** the visitor sends it, **Then** the form is not sent, each problem is explained next to its field in the visitor's language, and the visitor's other entries are preserved.
4. **Given** the email cannot be delivered, **When** the visitor sends the form, **Then** they are told it did not go through, are offered the phone number as an alternative, and are never shown a false confirmation.
5. **Given** an automated or abusive submission, **When** it is sent, **Then** it is rejected without reaching the team's inbox and without harming real visitors.

---

### User Story 3 - Read the site in my own language (Priority: P2)

A visitor whose browser is set to English sees the site in English on first arrival; a visitor whose browser is set to Spanish, or to any other language, sees it in Spanish. At any time they can switch language with a visible control, and their choice is remembered.

**Why this priority**: The audience spans Spanish-speaking markets and English-speaking partners. Both languages are required at release, but a single-language version still demonstrates the site's value, so this ranks just below the core pages.

**Independent Test**: Visit the site with browsers set to English, Spanish and an unsupported language; confirm the language served each time, switch language, return later, and confirm the choice persists.

**Acceptance Scenarios**:

1. **Given** a first-time visitor whose browser prefers English, **When** they open the site's main address, **Then** they see the English site.
2. **Given** a first-time visitor whose browser prefers Spanish, has no language preference, or prefers only unsupported languages, **When** they open the site's main address, **Then** they see the Spanish site.
3. **Given** a visitor on any page, **When** they select the other language in the language selector, **Then** they land on the same page in that language, the choice is remembered for later visits, and it overrides their browser's language.
4. **Given** a visitor who follows a link that names a specific language, **When** the page opens, **Then** it is shown in that language regardless of their browser's language.
5. **Given** a visitor with scripts disabled, **When** they use the language selector, **Then** switching still works.

---

### User Story 4 - Explore services and the technology behind them (Priority: P2)

A prospective client wants more detail than the homepage gives. On the Services page they find each of Intello's four services described by what is done and what they receive; on the Technology page they see how AI and data analysis support shipment tracking, alerts, forecasting and reporting.

**Why this priority**: Buyers in logistics compare providers on specifics. This deepens trust and qualifies leads, but the homepage and contact form already work without it.

**Independent Test**: From the homepage, follow a service card to its section, then to the Technology page; confirm a reader can say what each service delivers and what the AI actually does.

**Acceptance Scenarios**:

1. **Given** the Services page, **When** it opens, **Then** it presents four service sections (logistics back office, shipment tracking, technology services, AI data analysis), each with a short description, concrete deliverables, a muted-colour image and a link to contact Intello.
2. **Given** the Technology page, **When** it opens, **Then** it explains in plain language what AI does for the client (for example alerts to end customers, demand forecasts, KPI dashboards) without presenting AI as decoration or as a mascot.
3. **Given** any service or technology section, **When** the visitor wants to proceed, **Then** a call to action leads them to the contact form with the relevant topic offered or pre-selected.

---

### User Story 5 - Build confidence with About and FAQ (Priority: P3)

A cautious buyer wants to know who they would be working with and how it works. The About page explains Intello's approach and the kinds of companies it works with. The FAQ answers common questions about services, onboarding, data handling and how to get started.

**Why this priority**: Supports trust and reduces repeated questions, but is not needed for first contact.

**Independent Test**: Open About and FAQ; confirm every statement is factual and every FAQ question can be opened and read by keyboard alone.

**Acceptance Scenarios**:

1. **Given** the About page, **When** it opens, **Then** it describes Intello's operation, how a client engagement works, and the types of clients it serves, using only facts the client has confirmed.
2. **Given** the FAQ page, **When** the visitor selects a question, **Then** its answer opens, and they can open and close questions using only the keyboard.
3. **Given** the FAQ page, **When** the visitor cannot find their answer, **Then** a call to action leads to the contact form.

---

### Edge Cases

- A browser lists several languages, for example English first and Spanish second. The first supported language in the visitor's preference order wins.
- A browser prefers only languages the site does not offer (for example Portuguese). The Spanish site is shown.
- A visitor with a remembered language choice opens a link that names the other language. The link's language is shown.
- A visitor submits the contact form twice in a row. Only one enquiry reaches the team, and the visitor is not shown conflicting messages.
- A visitor enters very long text, special characters or line breaks in any field. The form stays usable, the email arrives intact, and nothing in the entry can alter the email's recipients or headers.
- Scripts are disabled or fail to load. All pages are readable, the language can be switched, the contact form can be sent, and navigation works.
- Images fail to load or are slow. Layout does not jump, and every image has a meaningful text alternative in the page's language.
- The visitor uses a very narrow screen (360 px wide) or a large desktop screen. No horizontal scrolling, overlapping or clipped text appears at any width, in either language.
- A visitor navigates to a page that does not exist. They see a branded, bilingual page that explains the problem and offers the way home and the contact link.
- The visitor navigates by keyboard or screen reader only. Every interactive element is reachable, has a visible focus indicator and a clear name, and form errors are announced.

## Requirements *(mandatory)*

### Functional Requirements

**Pages and navigation**

- **FR-001**: The site MUST provide these pages in both languages: Home, Services, About, Technology, FAQ and Contact, plus a privacy notice page, a not-found page and a server-error page (also used for oversized submissions).
- **FR-002**: Every page MUST show the main navigation: the Intello logo at the left; links to Home, Services, About, Technology, FAQ and Contact centred, with a dot marker beneath the current page; and, at the right, the language selector, the phone number with opening hours, and the primary call to action.
- **FR-003**: On narrow screens the navigation MUST collapse into a menu that can be opened and closed by touch and keyboard and that still exposes the language selector and the primary call to action.
- **FR-004**: Every page MUST end with a footer containing the logo, the main links, contact details, the language selector and a link to the privacy notice.
- **FR-005**: The primary call to action ("Solicitar demo" / "Request a demo") MUST be visible in the navigation on every page and MUST lead to the contact form.

**Homepage structure and mood**

- **FR-006**: The homepage hero MUST sit directly on the light page background and contain, in this order: an eyebrow line, a two-tone headline (claim in the main text colour, qualifier in the softer tone), a supporting paragraph, a primary call to action with an arrow, and a row of four capability highlights with line icons.
- **FR-007**: The hero MUST carry one large, dominant muted-colour image spanning the full width of the hero, with a floating shipment-status card and a capability chip layered over it, as in the design system's Hero.
- **FR-008**: The shipment-status card MUST be labelled as an illustrative example and MUST NOT present a fictional shipment as real client data.
- **FR-009**: A white rounded panel MUST overlap the bottom of the hero and contain the about block followed by the services block, separated by a hairline divider.
- **FR-010**: The about block MUST contain an eyebrow, a two-tone heading, a short paragraph, a one-line note on who Intello works with, two muted-colour images and an outlined link to the About page.
- **FR-011**: The services block MUST contain a heading, a link to all services, and four cards (logistics back office, shipment tracking, technology services, AI data analysis), each with a muted-colour image, a title, two short bullet points and an arrow link to that service's section.
- **FR-012**: The homepage MUST end with a closing call to action band inviting the visitor to contact Intello.
- **FR-013**: A secondary "see how it works" video link in the hero MUST appear only when a company video has been supplied; otherwise it MUST be omitted.

**Other pages**

- **FR-014**: The Services page MUST have one section per service stating what is done, concrete deliverables and a call to action to the contact form with the matching topic.
- **FR-015**: The Technology page MUST explain in plain language what AI and data analysis do for clients, naming concrete capabilities such as end-customer alerts, demand forecasts and KPI dashboards.
- **FR-016**: The About page MUST describe Intello's operation, how an engagement works and the types of clients served, using only client-confirmed facts.
- **FR-017**: The FAQ page MUST present questions that open to reveal answers, operable by keyboard, and MUST end with a call to action to the contact form.

**Contact form and email**

- **FR-018**: The Contact page MUST provide a form with: name, company, email, phone (optional), topic (the four services or "other"), and message. Name, email and message are required.
- **FR-019**: The form MUST validate input and, for each problem, show a message beside the affected field in the visitor's language while preserving what the visitor already entered.
- **FR-020**: When a valid form is sent, the Intello team MUST receive an email at the configured recipient address or addresses containing all submitted fields and the language the visitor used, and replying to that email MUST address the visitor.
- **FR-021**: The visitor MUST see a confirmation only after the message has actually been accepted for delivery; on failure they MUST see a clear message and the phone number as an alternative, with no technical details.
- **FR-022**: The form MUST resist automated and repeated abusive submissions, and any entry MUST be prevented from altering the email's recipients, sender or other headers.
- **FR-023**: The form MUST state, in the visitor's language, what personal data it collects and why, and MUST link to the privacy notice.
- **FR-024**: The form MUST work without scripts, and scripts MAY only improve it.
- **FR-025**: The site MUST NOT keep a copy of submitted enquiries beyond what is required to send the email, unless a later specification says otherwise.

**Language**

- **FR-026**: Every page, message, form label, error, confirmation, image text alternative and page title and description shown to visitors MUST exist in both Spanish and English at release, with no mixed-language pages. The notification email goes to the Intello team, not to the visitor: its labels are in Spanish (the team's working language) and it states the language the visitor used. No email is sent to the visitor in this release.
- **FR-027**: For a first visit to the site's main address with no saved preference, the site MUST show English when the browser's language preference favours English, and Spanish in every other case.
- **FR-028**: A language selector showing the codes ES and EN MUST be present on every page, MUST override browser detection, MUST take the visitor to the same page in the other language, MUST remember the choice, and MUST work without scripts.
- **FR-029**: Each language MUST have its own page addresses, so a link always shows the language it names, and search engines can find and relate both versions.
- **FR-030**: Dates, numbers and phone numbers MUST follow the conventions of the language shown.

**Brand, design and content**

- **FR-031**: All visual elements (colours, typography, spacing, shapes, logo, icons, components) MUST come from the Intello design system. Any pattern the design system lacks, including the form controls this feature needs, MUST be added to the design system first.
- **FR-032**: Copy MUST follow the design system's voice: sentence case, no exclamation marks or emoji, verb-first buttons with an arrow, *tú* in Spanish and "you/we" in English, and AI described by what it does.
- **FR-033**: The site MUST NOT show invented figures. Statistics, client counts and percentages appear only if real and sourced; otherwise a stated capability is used.
- **FR-034**: Imagery MUST be the dominant visual element of the homepage and a strong element of the Services, About and Technology pages, as in the reference: large, photographic in quality, high-key with soft daylight, in colour with a restrained, slightly desaturated palette close to the design system (deep navy, steel blue, warm light greys, at most a small soft yellow accent; no bright or saturated colours), showing logistics operations such as warehouses, ports, container ships, trucks, air cargo, operations floors and people working with dashboards.
- **FR-035**: Images MUST NOT contain embedded text, third-party logos or recognisable people's faces that could be mistaken for real clients or staff, MUST NOT use a cartoon, clip-art or obviously synthetic style, and each MUST have a text alternative in both languages.
- **FR-036**: Pictures use the muted brand palette described in FR-034; the brand accents (a yellow point, a navy card floating over the image) stay the strongest colour on the page.

**Quality**

- **FR-037**: Every page MUST be usable from 360 px to large desktop widths, in both languages, without horizontal scrolling or overlapping content.
- **FR-038**: Every page MUST meet WCAG 2.1 level AA, including keyboard operation, visible focus, sufficient contrast, labelled form fields and announced errors.
- **FR-039**: Every page MUST have a unique title and description in each language, and the content MUST be present when the page first loads, so it can be read, shared and indexed without running scripts.
- **FR-040**: The site MUST NOT load third-party scripts, trackers or embeds in this release.

### Key Entities

- **Page**: A public page (Home, Services, About, Technology, FAQ, Contact, Privacy) or an error page (Not found, Server error) with its title, description and content in each language.
- **Service**: One of four offerings (logistics back office, shipment tracking, technology services, AI data analysis) with a title, short bullets, deliverables and an image, in each language.
- **Enquiry**: A message sent through the contact form: name, company, email, optional phone, topic, message, the language used and the time sent. Exists only long enough to be emailed.
- **Language preference**: The visitor's chosen language (Spanish or English), remembered between visits.
- **FAQ entry**: A question and its answer, in each language.
- **Image asset**: A muted-colour image with its art-direction brief, where it is used, and a text alternative in each language.
- **Site settings**: Phone number, opening hours, enquiry recipient address or addresses and sending mailbox, supplied by the client and not hard-coded into pages.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In a test with at least 5 representative visitors (people working in logistics), at least 4 can correctly say what Intello offers and who it is for within 10 seconds of seeing the first screen of the homepage, in each language.
- **SC-002**: A visitor can find and send the contact form in under 2 minutes, and at least 90% of test participants complete it without help.
- **SC-003**: In a delivery test of at least 10 consecutive valid submissions on the deployed site, every message reaches the team's inbox within 2 minutes (with the visitor as the reply address), and 100% of simulated failed deliveries show the visitor a failure message rather than a confirmation.
- **SC-004**: 100% of pages, messages and emails are available in both Spanish and English at release, with zero untranslated or mixed-language strings.
- **SC-005**: Across a test set of browser language settings (English, Spanish, mixed, missing, unsupported), the first-visit language is correct in 100% of cases, and a chosen language persists on the next visit in 100% of cases.
- **SC-006**: All pages display correctly with no horizontal scrolling or overlapping content at 360 px, 768 px and 1240 px widths in both languages.
- **SC-007**: All pages pass an automated accessibility check with zero serious or critical issues and are fully operable by keyboard alone.
- **SC-008**: On the standard Lighthouse mobile test profile (simulated mid-range phone on a typical mobile connection), the main content of the homepage is visible within 2.5 seconds.
- **SC-009**: A design review against the Intello design system finds zero unapproved deviations in colour, typography, spacing, logo use or components on any page.
- **SC-010**: The contact form is reachable from every page in no more than 2 selections.
- **SC-011**: Reviewers comparing the homepage with the reference confirm it matches the reference's structure and mood (light page, two-tone headline, dominant muted-colour imagery, overlapping white panel, four service cards) while using Intello's own brand.

## Assumptions

- **Positioning (owner decision, 2026-11-18)**: Intello provides cargo monitoring and business intelligence for logistics companies (with technology services and back office support). Intello is **not** a logistics, transport or warehousing company, and no copy may say or imply that it moves, stores or delivers cargo. The About page and the FAQ say so plainly. Pictures of warehouses, ships and trucks show the clients' world.
- **Audience**: Decision-makers at courier, 3PL, freight and other logistics companies in Spanish-speaking Latin America, plus English-speaking partners. The site is business-to-business.
- **Site type**: A marketing and lead-generation site. There is no customer login, portal or live shipment lookup in this release; the shipment-status card is an illustration.
- **Pages**: The six pages in the design system's navigation (Home, Services, About, Technology, FAQ, Contact), plus a not-found page and a privacy notice. Each service is a section on the Services page, not a separate page. This is the largest scope lever and can be trimmed.
- **Starting copy**: The Spanish and English copy in the design system's homepage reference is the baseline. The client reviews and corrects all copy, and every claim must be true before launch. Copy for the other pages is drafted from the client's description and the same voice rules.
- **Client-supplied facts**: Phone number, opening hours, enquiry recipient address or addresses, the sending mailbox, and the privacy notice text come from the client before launch. Until then pages show clearly marked placeholders that are never published. No "5000+ clients" style statistic is shown. A "24/7" claim is used only if the client confirms the service is available around the clock.
- **Company video**: No video exists. The "see how it works" link is omitted until the client supplies one.
- **Imagery**: Images are generated with the Higgsfield connector from art-direction briefs derived from the client description, to keep imagery dominant as in the reference. The connector is available and has credits; the project owner approves each batch before it runs. Each generated image is reviewed against FR-034 to FR-036 before use.
- **Constitution**: Principle I (v1.3.0) permits reviewed, photographic-quality imagery generated with the Higgsfield connector, subject to the rules in FR-034 to FR-036. Each generation batch needs the project owner's approval first, because it spends credits.
- **Theme**: The site launches in the light theme only, matching the reference. The design system's dark theme is not enabled in this release.
- **Cookies and analytics**: Only a language-preference cookie is used. No analytics or tracking in this release, so no consent banner is planned.
- **Content upkeep**: Content changes are made by developers; there is no editing interface for non-technical staff in this release.
- **Out of scope**: Customer accounts, live tracking, pricing calculators, blog or news, online payments, additional languages, and search.
- **Dependencies**: The Intello design system (including the language toggle in link mode and new form controls to be added); the client's contact details; the Higgsfield connector for imagery; and the hosting and email constraints set in the constitution, to be resolved at planning.
