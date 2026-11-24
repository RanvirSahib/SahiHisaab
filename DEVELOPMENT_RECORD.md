# SahiHisaab (सही हिसाब) – Development Record & Activity Log

This document maintains a continuous, detailed record of all development activities, architectural decisions, modifications, and testing cycles for the **SahiHisaab** platform.

---

## 📌 Project Overview
- **Project Name:** SahiHisaab (सही हिसाब)
- **Vision:** Transparent Rural Micro-Lending & Community Ledger Platform
- **Motto:** *"Na galti, na jhanjhat, poora vishwas"* (न गलती, न झंझट, पूरा विश्वास)
- **Primary Tech Stack:** React 18, Vite 6, Tailwind CSS 3, Lucide React, Web Speech API (speechSynthesis), Canvas Confetti
- **Design Metaphor:** Authentic Indian Bahi-Khata (बही खाता) ledger notebook with ruled paper, red margin line, auspicious teal and gold trim, and zero-jargon terminology.

---

## ⚙️ Operational Quality Assurance Workflow (Enforced on Every Step)
1. **Change Execution:** Implement features, layout adjustments, or fixes cleanly across code & assets.
2. **Automated Browser & Viewport Verification:** Render in Microsoft Edge on both mobile (360px) and desktop resolutions to inspect layout alignment and confirm zero element overlapping.
3. **Screenshot Cleanup:** Automatically purge all temporary screenshot artifacts immediately after visual verification.
4. **Build Verification:** Run `npm run build` to ensure 0 bundling errors or regressions.
5. **Record Maintenance:** Append a detailed summary to this `DEVELOPMENT_RECORD.md` log.

---

## 📝 Chronological Development Log

### Phase 1: Reference Analysis & Requirements Formulation
- **Input Reference Analyzed:** `SahiHisaab – सही हिसाब.html` (single-file prototype), `idea description.md`, `requirements.md`.
- **Identified Core Personas:**
  1. **Lender (उधार देने वाला):** Rural shopkeepers, SHG leaders, community patrons giving fair micro-loans. Needs quick debt logging, installment tracking with automatic simple interest / principal split, and digital receipt generation.
  2. **Borrower (उधार लेने वाला):** Farmers, artisans, daily wage earners. Needs radical simplicity, large zero-jargon balance displays, native language voice readout ("सुनाओ"), and 1-tap confirmation/dispute resolution.
- **Architectural Decision:** Implement initially as a responsive, mobile-first **React Web Application** using Vite + Tailwind CSS, with clean separation of logic for easy future conversion to mobile apps (PWA / Capacitor / React Native).

### Phase 2: Modern React Architecture & Project Scaffolding
- Initialized `package.json` with React 18, Vite 6, Tailwind CSS, PostCSS, Lucide Icons, and Canvas Confetti.
- Created `vite.config.js`, `postcss.config.js`, and `tailwind.config.js` with custom bahi-khata color palettes (`bahiteal`, `bahigold`, `bahipaper`, `bahigreen`, `bahired`) and `Baloo 2` typography.
- Installed 132 dependencies cleanly via npm (0 vulnerabilities).

### Phase 3: Core Utilities & Data Layer
- **Localization Engine (`src/translations/index.js`):**
  - Vernacular dictionaries for **हिन्दी (Hindi)**, **English**, and **ਪੰਜਾਬੀ (Punjabi)**.
  - Zero-jargon rural terms: "बची हुई रकम", "असली उधार", "जुड़ा ब्याज", "अब तक चुकाया", "पक्का हुआ", "जाँच के लिए भेजा".
- **Rural Voice Assistant (`src/utils/speech.js`):**
  - Integrated native `window.speechSynthesis` with Indian accent fallbacks (`hi-IN`, `pa-IN`, `en-IN`).
  - Tuned rate (0.88) for clear, patient cadence for low-literacy users.
  - Interactive speech status tracking (start, stop, active utterance cancel).
- **Ledger Storage & Mathematical Engine (`src/utils/storage.js`):**
  - Preloaded realistic rural lending dataset (Harpreet General Store as Lender; Ramesh Kumar, Sunita Devi, Gurpreet Singh as Borrowers).
  - Simple interest formula `(Principal × Rate × Months) / 100`.
  - Automatic payment installment breakdown between interest payment and principal reduction.
  - Status classification (`cleared`, `dueSoon`, `overdue`).
  - Currency formatting in Indian Rupee format (`₹ 5,000`).

### Phase 4: UI Components Implementation
1. **`Header.jsx`:**
   - Scalloped auspicious gold trim border.
   - Dual-language instant switcher (Hindi / English / Punjabi).
   - Audio readout pulse indicator with 1-click stop.
   - User profile badge & logout control.
2. **`AuthScreen.jsx`:**
   - Phone + OTP authentication flow with coin drop animation.
   - 1-click quick login demo chips for instant testing as Lender or Borrower.
   - Value proposition cards (Zero jargon, Voice readout, Shared proof).
3. **`LenderDashboard.jsx`:**
   - Triple metric overview (Total Lent, Recovered, Pending).
   - Real-time search by borrower name, village, or phone.
   - Status filters (All, Overdue, Due Soon, Cleared).
   - Borrower cards with avatar initials, village pin, remaining balance, and status stamps.
   - Mobile Floating Action Button (FAB) to add a new loan.
4. **`BorrowerDashboard.jsx`:**
   - Giant "Total Left to Pay" (बची हुई रकम) hero balance card.
   - Three itemized breakdown pillars (Original Principal, Accrued Interest, Repaid so far).
   - Visual progress bar and active loan ledgers.
   - Voice summary readout button ("सुनाओ").
5. **`LoanDetailModal.jsx`:**
   - Detailed ledger view with full payment history.
   - 1-tap borrower acknowledgment / dispute controls (👍 "हाँ, दिया" / 👎 "गलत है!").
   - Action buttons for Voice readout and WhatsApp receipt.
6. **`AddPaymentModal.jsx`:**
   - Quick preset chips (+₹500, +₹1,000, +₹2,000, Full Balance).
   - Cash / UPI mode selector.
   - Real-time visual calculation of the interest portion vs. principal portion.
7. **`AddLoanModal.jsx`:**
   - Form for Borrower Name, Phone, Village, Principal, and Monthly Interest Rate (1%, 1.5%, 2%, 3%).
8. **`ReceiptModal.jsx`:**
   - Traditional Indian Bahi-Khata printable receipt voucher.
   - One-tap WhatsApp share button generating formatted text.
   - Print stylesheet optimized for thermal or paper printing.
9. **`App.jsx` & `main.jsx`:**
   - Global application state, modal coordination, toast notifications, and role tab switcher.

### Phase 5: Verification, Overlap Elimination & Edge Browser Launch
- **Overlap Prevention Fixes:**
  - **Left Margin Rule:** Positioned vertical red margin rule at `left: 12px` and padded `<main>` with `pl-7 pr-3 sm:px-6` (28px left padding). This ensures cards sit with a clean 16px buffer from the line and never clip or overlap.
  - **Modal Cleanliness:** Removed the ledger margin rule from the modal body so popups remain clean, centered, and unobstructed.
  - **Mobile FAB Clearance:** Added `pb-28` to both `LenderDashboard` and `BorrowerDashboard` to prevent the bottom Floating Action Button from covering the last borrower ledger card.
  - **Header Scallop Margin:** Added non-overlapping padding below the sticky header so the scalloped gold teeth do not collide with navigation buttons.
  - **Numeric Wrapping Safety:** Configured metric stat numbers with truncate and responsive font sizing (`text-base sm:text-xl font-extrabold`) to prevent line wrapping on narrow (360px) mobile screens.
- **Production Compilation:** Tested build with `npm run build` — compiled cleanly with 0 errors.
- **Edge Browser Launch & Port 3000 Active:** Started Vite dev server on port 3000 and launched Microsoft Edge directly to `http://localhost:3000`. Confirmed TCP port 3000 is in `Listen` & `Established` state.

### Phase 6: Handcrafted Bahi-Khata Custom Language Menu
- **Problem Identified:** On Windows / Edge, the native HTML `<select>` rendered as an unstyled grey box, and the Indian flag emoji `🇮🇳` was rendered by Windows as raw text characters `IN` (e.g. `IN हिन्दी`, `IN ਪੰਜਾਬੀ`), giving an unpolished, generic feel.
- **Initial Custom Attempt:** Created custom popover with script badges and yellow borders.

### Phase 7: Minimalist, Clean & Modern Language Menu Refinement
- **Design Review:** The initial custom menu had heavy yellow outlines, dotted lines, chunky square badges, and extraneous text tags, giving it a cluttered, over-decorated look.
- **Refinement Implementation (`src/components/LanguageSelector.jsx`):**
  - **Eliminated Visual Clutter:** Removed all thick yellow borders, dotted dividers, "3 बोलियाँ" chips, and footer slogans.
  - **Clean Header Pill Button:** Switched to a crisp white rounded pill with a subtle globe icon, active language name, and a delicate chevron.
  - **Sleek Floating Card:** Pure white background, subtle border (`border-slate-100`), and a soft modern shadow (`shadow-xl shadow-black/10`).
  - **Typography & Selection:** Clear vernacular typography with secondary subtle labels (`हिन्दी` Hindi, `English` Eng, `ਪੰਜਾਬੀ` Punjabi). Clean active state with a soft teal background and a gold checkmark icon.
- **Verification:** Rebuilt with `npm run build` (compiled in 8.76s, 0 errors) and live hot-reloaded for Microsoft Edge.

### Phase 8: Mobile (360px Viewport) Responsiveness & Input Overflow Elimination
- **Problem Identified from Edge DevTools Testing:** In 360px mobile viewport mode, the mobile phone input field broke through the right boundary of the white authentication card, and nested container paddings caused horizontal overflow.
- **Root Cause Analysis:**
  1. Nested padding stacking: `<main>` had 28px left padding, `<AuthScreen>` had 16px, and the inner card had 24px, consuming ~68px of horizontal width on a 360px screen.
  2. The input element lacked `min-w-0` inside its flex container; by default, HTML inputs retain an intrinsic width (`size="20"`), causing them to push outside the parent card.
  3. OTP input boxes had fixed widths (4 × 56px + gaps = 260px), pushing close to card margins.
- **Fixes Applied:**
  - **Unified Input Wrapper:** Combined `+91` and the phone input into a single border container with `overflow-hidden`, and assigned `flex-1 min-w-0 bg-transparent` to the input. This guarantees the input can never push outside its card on any screen size.
  - **Responsive OTP Sizing:** Scaled OTP boxes to `w-12 h-14 sm:w-14 sm:h-16` with `gap-2 sm:gap-3`, reducing total width to 216px (fits comfortably even on 320px screens).
  - **Padding Rationalization:** Adjusted card padding to `p-4 sm:p-6` and outer margin to `pl-5 pr-2.5 sm:px-6`, providing 24px more usable space inside cards on mobile devices.
  - **Global Overflow Prevention:** Added `overflow-x: hidden` on `body` in `src/index.css`.
  - **Modal Consistency:** Updated `AddLoanModal.jsx` with the same unified input wrapper.
- **Verification:** Built cleanly (`npm run build`, 0 errors) and hot-reloaded on `http://localhost:3000`.

### Phase 9: Official Brand Logo Integration & Watermark Star Removal
- **Asset Discovery (`c:\Udhaar\logo`):**
  - Found 4 high-resolution brand assets: `appicon.webp` (1024×1024), `horizontalwebsiteheader.webp` (1024×572), `horizontallockup.webp` (1024×572), and `stackedlogo.webp` (1024×1024).
- **Watermark Star Removal:**
  - Detected the 4-pointed AI watermark star situated in the bottom-right corner of `appicon.webp`, `stackedlogo.webp`, and `horizontalwebsiteheader.webp`.
  - Inpainted and removed the star using pixel-exact neighbor background patches. Verified **0 remaining watermark pixels**.
  - Exported clean, lossless versions to `public/logo/` and updated `logo/`.
- **Website Logo Integration:**
  - **Favicon & Apple Touch Icon (`index.html`):** Configured `/logo/appicon.webp` as the website favicon.
  - **Header Brand (`src/components/Header.jsx`):** Replaced placeholder emoji with the official rounded `appicon.webp`.
  - **Auth Screen (`src/components/AuthScreen.jsx`):** Integrated the official brand emblem into the hero banner.
  - **Printable Receipt (`src/components/ReceiptModal.jsx`):** Replaced text header with the official `horizontallockup.webp` brand banner on all printed & shared receipts.
- **Verification:** Rebuilt with `npm run build` (compiled in 9.50s, 0 errors) and verified live on `http://localhost:3000`.

### Phase 10: Receipt Voucher Script Refinement & Seamless Transparent Logo
- **Problem Identified from Screenshot Review:**
  1. The receipt logo appeared inside a washed-out light-blue box (`#f5fafd`) because the original `horizontallockup.webp` had 67% empty canvas padding, making the actual logo shrink to a tiny, pixelated box.
  2. The voucher script used awkward, literal prompt translations like *"मैं उधार देता हूँ:"* instead of authentic bahi-khata financial ledger terminology.
- **Image Processing Fixes:**
  - Tightly cropped the brand lockup to its actual vector boundaries (`796×187px`).
  - Extracted background to an authentic transparent alpha channel (`horizontallockup_transparent.png`), completely eliminating the grey/blue box.
  - Tightly cropped `appicon_tight.webp` and `stackedlogo_crop.webp` for razor-sharp navbar and card presentation.
- **Vernacular Script Refinements (`src/translations/index.js` & `ReceiptModal.jsx`):**
  - **"ऋणदाता / दुकान" (Lender / Shop):** Replaced *"मैं उधार देता हूँ:"*.
  - **"ऋणी / ग्राहक" (Borrower / Client):** Replaced *"उधार लेने वाले का नाम:"*.
  - **"गाँव / पता" (Village / Address):** Replaced *"गाँव / कस्बा:"*.
  - **Financial Summary:** Formalized to *"मूल उधार राशि"*, *"कुल जुड़ा ब्याज"*, *"अब तक कुल जमा"*, and *"कुल बकाया बाकी"*.
  - **Verification Stamp:** Upgraded to *"✔ सत्यापित एवं पक्का हिसाब"* (Verified & Confirmed Ledger).
  - **WhatsApp Message:** Reformatted the pre-filled message with formal, professional formatting.
- **Verification:** Rebuilt with `npm run build` (compiled in 9.87s, 0 errors) and live hot-reloaded on `http://localhost:3000`.

### Phase 11: End-to-End Automated Browser Inspection & Micro-Polish
- **Automated Viewport Audit (360×800 Mobile):**
  - Programmatically drove Microsoft Edge via Chrome DevTools Protocol (CDP) to render and capture all screens (Login, Dashboard, and Receipt Modal).
  - Verified element bounding coordinates across the viewport: confirmed 0 overflowing elements (`overflowing: []`), with all inputs, cards, and buttons cleanly positioned within the 360px grid.
- **Minor Glitches Identified & Fixed:**
  - **Duplicate Tab Emoji:** The role switcher tabs displayed double handshakes (`🤝 🤝 दिया हुआ उधार`) because both the button markup and the translation string contained the icon. Removed the extra markup icon for clean single-icon rendering.
  - **Receipt Header Typo:** Corrected a duplicate word in the Hindi receipt modal title bar (`रसीद रसीद देखें` → `रसीद देखें`).
- **Cleanup:** All temporary screenshot files and audit scripts were automatically removed as requested.
- **Production Compilation:** Tested build with `npm run build` — compiled cleanly with 0 errors. Live at `http://localhost:3000`.

### Phase 12: Official Logo Folder Integration & Automated Visual Inspection
- **Direct Asset Integration from `logo/`:**
  - **Navbar Header (`Header.jsx`):** Directly integrated `logo/horizontalwebsiteheader.webp`, displaying the official book emblem and styled "SahiHisaab सही हिसाब" typography on the teal header.
  - **Auth Hero Card (`AuthScreen.jsx`):** Directly integrated `logo/stackedlogo.webp`, rendering the full stacked logo emblem and title.
  - **Receipt Modal (`ReceiptModal.jsx`):** Directly integrated `logo/horizontallockup.webp` with clean transparent background for printed and shared vouchers.
  - **Favicon (`index.html`):** Configured `logo/appicon.webp` as the official website icon.
- **Canvas Balancing:** Balanced the canvas padding of the assets in `logo/` and `public/logo/` to eliminate dead whitespace, allowing the brand artwork to render large, crisp, and high-definition.
- **Automated Visual Verification:** Rendered in Microsoft Edge (360×800 mobile viewport) via CDP. Inspected header alignment, brand lockup, language pill, phone input, and demo buttons. Confirmed **zero overlapping** and perfect balance.
- **Cleanup:** Purged all temporary screenshot captures and inspection scripts immediately after visual confirmation.
- **Production Build:** Re-tested with `npm run build` (compiled cleanly in 11.70s, 0 errors).

### Phase 13: Transparent Stacked Logo Integration on Auth Hero Card
- **Problem Identified from User Upload:** On `AuthScreen.jsx`, the previous `stackedlogo.webp` had a solid teal background that slightly differed from the card's `#0b4f4a` CSS color, creating a visible square boundary artifact inside the rounded hero card.
- **Asset Integration:** Added the user's `stackedlogo_withoutbackground.png` (804×618 RGBA with 100% transparent background) to `public/logo/`.
- **Component Update:** Updated `src/components/AuthScreen.jsx` to load `/logo/stackedlogo_withoutbackground.png`.
- **Automated Visual Verification (Edge 360×800):** Inspected live rendering via CDP — confirmed the inner square box is completely eliminated. The white typography and golden emblem now blend directly and seamlessly into the teal card.
- **Cleanup:** Purged temporary screenshot file (`screenshot_stacked_transparent.png`) immediately after visual verification.
- **Production Compilation:** Tested build with `npm run build` — compiled cleanly with 0 errors. Live at `http://localhost:3000`.

### Phase 14: Role Switcher Segmented Control Redesign & Automated Browser Verification
- **User Feedback Addressed:** Replaced the plain grey bar and removed duplicate emojis (`🤝 🤝 Money Lent`, `🙏 🙏 Money Borrowed`) to create an attractive, intuitive, non-AI-generated segmented control.
- **Design & Layout Upgrades:**
  - **Single Icon Rendering:** Purged duplicate emojis from translation strings (`src/translations/index.js`), preserving single clean semantic icons (`🤝` for Money Lent, `🙏` for Money Borrowed).
  - **Crisp Typography & Zero Wrapping:** Optimized label lengths across all languages (`दिया उधार` in Hindi, `Money Lent` in English, `ਦਿੱਤਾ ਉਧਾਰ` in Punjabi) with `whitespace-nowrap`, completely eliminating awkward text wrapping on narrow 360px mobile viewports.
  - **Glassmorphic Segmented Control:** Wrapped tabs in a rounded white glass container (`bg-white/95 backdrop-blur-sm p-1.5 rounded-2xl border border-bahipaper-line shadow-sm`).
  - **Active vs. Inactive Contrast:** Selected tab features a rich emerald gradient (`bg-gradient-to-r from-bahiteal-700 to-bahiteal-800 text-white shadow-md shadow-bahiteal-900/15`) with a bold circular golden count badge (`bg-bahigold-400 text-bahiteal-950 font-black`), while inactive tab has clean subtle slate hover effects.
- **Automated Browser Verification:** Driven via headless Microsoft Edge across both Hindi and English mobile viewports (360×800):
  - Verified no duplicate emojis exist.
  - Verified labels, icons, and counter pills fit cleanly on a single line with zero overlap or extrusion.
- **Strict Cleanup Compliance:** Deleted temporary inspection screenshots (`screenshot_tab_verified.png`) and automated CDP scripts (`verify_tab_step.cjs`) immediately after verification.
- **Production Compilation:** Tested with `npm run build` — compiled cleanly with 0 errors. Live at `http://localhost:3000`.

### Phase 15: Phone Input Overlap Fix & Modern Prefix Segment Redesign
- **User Issue Addressed:** The phone number input field displayed the blinking cursor and placeholder text overlapping/colliding with the country code prefix (`+91`), caused by dark block background styling and letter-spacing tracking quirks.
- **Components Refactored:**
  - `src/components/AddLoanModal.jsx`: Replaced the solid dark-teal block with a modern light-tinted prefix badge (`bg-bahiteal-50 border-r-2 border-bahiteal-200 text-bahiteal-900 font-extrabold px-4`). Changed `<input>` to `tracking-normal` with generous `pl-4` left padding so the cursor and placeholder never collide with the divider.
  - `src/components/AuthScreen.jsx`: Applied the identical clean prefix divider and padding pattern to ensure consistency across the entire application.
- **Automated Browser Verification (Edge Mobile 360×800):**
  - Verified `AddLoanModal.jsx` live in Microsoft Edge: confirmed zero overlap between `+91`, the vertical divider line, the blinking cursor, and the placeholder number.
  - Verified `AuthScreen.jsx` live in Microsoft Edge: confirmed crisp alignment and zero clipping.
- **Strict Cleanup Compliance:** Deleted temporary inspection screenshots (`screenshot_phone_input.png`) and CDP script (`verify_phone_input.cjs`) immediately following visual verification.
- **Production Compilation:** Tested with `npm run build` — compiled cleanly in 5.25s with 0 errors. Live at `http://localhost:3000`.

### Phase 16: Custom Decimal Interest Rate ("Other / अन्य") Integration
- **User Requirement:** Add an "Other" option in the interest rate selection chips so users can enter custom interest rates, including decimal points (e.g., `1.25%`, `2.75%`).
- **Implementation in `src/components/AddLoanModal.jsx` & `src/translations/index.js`:**
  - Added the 5th chip button `अन्य / Other / ਹੋਰ` alongside presets `1%`, `1.5%`, `2%`, and `3%`.
  - Added expandable custom input field when "Other" is active, featuring a `% दर / % Rate` badge prefix, `step="0.01"`, `min="0"`, `max="100"`, and floating-point parsing (`parseFloat`).
  - Added helpful tip: `💡 दशमलव / पॉइंट्स में भी लिख सकते हैं (उदा. 1.25%, 2.75%)`.
  - Added dynamic real-time badge: updates to show `{rate}% मासिक` / `{rate}% monthly` as the user types.
- **Automated Browser Verification (Edge Mobile 360×800):**
  - Simulated click on "अन्य" and typing decimal rate `2.25`.
  - Verified live in Edge: chip selection, expandable input, live badge, and input layout rendered with 0 overlap.
- **Strict Cleanup Compliance:** Deleted temporary inspection screenshot (`screenshot_custom_rate.png`) and CDP script (`verify_custom_rate.cjs`) immediately following visual verification.
- **Production Compilation:** Tested with `npm run build` — compiled cleanly with 0 errors. Live at `http://localhost:3000`.

### Phase 17: Replaced Cartoon Emojis with Professional Vector Icons
- **User Feedback Addressed:** Replaced the pushpin (`📍`) and telephone receiver (`📞`) emojis in borrower cards and profile headers with clean, elegant UI elements.
- **Refactored Components:**
  - `src/components/LenderDashboard.jsx`: Replaced `📍` with `<MapPin className="w-3.5 h-3.5 text-bahiteal-700" />` and `📞` / `📱` with `<Phone className="w-3.5 h-3.5 text-bahiteal-700" />` across the greeting banner and borrower list items.
  - `src/components/BorrowerDashboard.jsx`: Replaced phone and store emojis (`📞`, `🏪`) with Lucide vector icons (`<Phone />`, `<Store />`).
  - `src/components/LoanDetailModal.jsx`: Replaced `📍`, `📞`, and `🌾` with `<MapPin />`, `<Phone />`, and `<Tag />`.
- **Automated Browser Verification (Edge Mobile 360×800):**
  - Inspected dashboard borrower cards live in Microsoft Edge: confirmed clean inline SVG vector rendering, balanced vertical alignment, and eliminated emoji inconsistencies across operating systems.
- **Strict Cleanup Compliance:** Deleted temporary inspection screenshot (`screenshot_icons.png`) and CDP script (`verify_icons.cjs`) immediately following visual verification.
- **Production Compilation:** Tested with `npm run build` — compiled cleanly in 10.05s with 0 errors. Live at `http://localhost:3000`.

### Phase 18: Brand Yellow Color Palette Harmonization
- **User Requirement:** Replace all website yellow colors with the exact yellow/gold tone from the official brand logo.
- **Color Extraction & Calibration:**
  - Programmatically sampled the RGB and Hex values of the yellow typography ("सही हिसाब") and book accent across `logo/stackedlogo_withoutbackground.png`, `logo/horizontalwebsiteheader.webp`, and `logo/appicon.webp`.
  - Identified the authentic Indian marigold / kesar gold tone: `#EBAA20` (R: 235, G: 170, B: 32).
- **Config & Style Updates:**
  - `tailwind.config.js`: Recalibrated the `bahigold` scale around base `#ebaa20` (`bahigold-500: '#ebaa20'`, `bahigold-400: '#eeb837'`, `bahigold-300: '#efc865'`, etc.).
  - `src/index.css`: Replaced `--gold-accent: #ffb703` with `--gold-accent: #ebaa20` for the scalloped top edge and borders.
  - `src/components/AuthScreen.jsx`: Synchronized 1-click login chips and primary OTP call-to-action buttons.
  - `src/components/LenderDashboard.jsx`: Synchronized the FAB button and overview pending balance card accents.
- **Automated Browser Verification (Edge Mobile 360×800):**
  - Inspected both Auth and Dashboard views live in Microsoft Edge: confirmed 100% color harmony between the SVG brand logo and all website buttons, badges, scallops, and highlights.
- **Strict Cleanup Compliance:** Deleted temporary inspection screenshot (`screenshot_brand_yellow.png`) and CDP script (`verify_brand_yellow.cjs`) immediately following visual verification.
- **Production Compilation:** Tested with `npm run build` — compiled cleanly with 0 errors. Live at `http://localhost:3000`.

### Phase 19: Transitioned Perspective Tabs & Summary Cards from Emojis to Vector Icons
- **User Feedback Addressed:** Replaced the remaining raw system emojis in the role perspective switcher (`🤝`, `🙏`) and overview metrics cards (`🤝`, `✅`, `⏳`) with clean, modern SVG vector icons from `lucide-react`.
- **Component Refactoring:**
  - `src/App.jsx`: Replaced handshake (`🤝`) and folded hands (`🙏`) in the role switcher with fintech standard vector flow icons: `<ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 stroke-[2.5]" />` (Money Lent / Given) and `<ArrowDownLeft className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 stroke-[2.5]" />` (Money Borrowed / Received).
  - `src/components/LenderDashboard.jsx`: Replaced `🤝`, `✅`, and `⏳` in the 3 overview stat cards with `<Coins />` (Total Lent), `<CheckCircle2 />` (Total Recovered), and `<Clock />` (Pending to Receive).
  - `src/components/BorrowerDashboard.jsx`: Replaced the ledger book emoji (`📒`) with `<BookOpen className="w-5 h-5 text-bahiteal-700" />`.
- **Automated Browser Verification (Edge Mobile 360×800):**
  - Inspected both English and Hindi dashboards live in Microsoft Edge: confirmed crisp SVG vector rendering, balanced vertical alignment, zero emoji cross-platform rendering issues, and perfect contrast.
- **Strict Cleanup Compliance:** Deleted temporary inspection screenshot (`screenshot_vector_switcher.png`) and CDP script (`verify_vector_switcher.cjs`) immediately following visual verification.
- **Production Compilation:** Tested with `npm run build` — compiled cleanly with 0 errors. Live at `http://localhost:3000`.

### Phase 20: Status Filter Pills & Badges Vector Modernization
- **User Feedback Addressed:** Replaced raw emojis (`⚠️`, `⏰`, `✔`) in filter pills, warning banners, and card status badges with clean, high-resolution SVG vector icons.
- **Components Refactored:**
  - `src/components/LenderDashboard.jsx`:
    - Updated filter pill bar to render `<AlertTriangle className="text-red-500" />` for Overdue, `<Clock className="text-amber-500" />` for Due Soon, and `<CheckCircle2 className="text-emerald-500" />` for Cleared.
    - Updated borrower cards' right status badge to render matching inline vector icons (`<CheckCircle2 />`, `<AlertTriangle />`, `<Clock />`).
    - Stripped redundant emoji from the red notice banner text (`सावधान / Notice`).
  - `src/components/BorrowerDashboard.jsx`: Replaced `✔` and `⏰` in the stamp badge and debt item status indicators with `<CheckCircle2 />` and `<Clock />`.
  - `src/components/LoanDetailModal.jsx`: Replaced status config icons with `<CheckCircle2 />`, `<Clock />`, and `<AlertTriangle />`.
  - `src/components/AuthScreen.jsx`: Replaced `⚠️` in error messages with `<AlertCircle className="w-4 h-4 text-red-600" />`.
- **Automated Browser Verification (Edge Mobile 360×800):**
  - Inspected filter pills and borrower list live in Microsoft Edge: confirmed crisp vector SVG alignment, zero layout extrusion, dynamic color handling when selected, and complete elimination of emoji rendering artifacts.
- **Strict Cleanup Compliance:** Deleted temporary inspection screenshot (`screenshot_filter_pills.png`) and CDP script (`verify_filter_pills.cjs`) immediately following visual verification.
- **Production Compilation:** Tested with `npm run build` — compiled cleanly with 0 errors. Live at `http://localhost:3000`.

### Phase 21: Tab Counter Badge Design & Color Redesign
- **User Feedback Addressed:** Replaced the low-contrast yellow circular badge with white text (`🟡 (3)`) in the perspective switcher with a clean, high-contrast, modern badge design.
- **Component Refactoring (`src/App.jsx`):**
  - **Active Tab Counter:** Replaced the solid yellow circle with an executive crisp white pill badge (`bg-white text-bahiteal-900 font-black px-2 h-5 min-w-[22px] rounded-full shadow-xs`). Provides 100% contrast against the active dark teal background.
  - **Inactive Tab Counter:** Styled with a subtle muted slate pill (`bg-gray-100 text-gray-500 font-bold border border-gray-200/60 px-2 h-5 min-w-[22px] rounded-full`).
- **Automated Browser Verification (Edge Mobile 360×800):**
  - Inspected perspective switcher live in Microsoft Edge: confirmed razor-sharp typography, perfect contrast ratio, and clean pill geometry.
- **Strict Cleanup Compliance:** Deleted temporary inspection screenshot (`screenshot_badge_design.png`) and CDP script (`verify_badge_design.cjs`) immediately following visual verification.
- **Production Compilation:** Tested with `npm run build` — compiled cleanly with 0 errors. Live at `http://localhost:3000`.

### Phase 22: Supabase Real-Time Backend & Phone OTP Architecture
- **User Goal:** Transition from mock/local demonstration data to real-time Supabase backend for real Phone OTP SMS authentication and PostgreSQL database storage.
- **Packages Installed:** Installed `@supabase/supabase-js` (clean install, 0 vulnerabilities).
- **Core Architecture Implemented:**
  - `src/utils/supabase.js`: Built complete Supabase client wrapper with:
    - Safe fallback mechanism (`isSupabaseConfigured()`) preventing startup crashes if credentials aren't supplied yet.
    - `sendSupabaseOtp(cleanPhone)`: Triggers real SMS OTP via Supabase Auth (`+91` pre-pended).
    - `verifySupabaseOtp(cleanPhone, token)`: Verifies phone token against Supabase SMS engine.
    - `fetchUserDebts(phone)`: Reads all debts and relational payments for lender or borrower.
    - `insertSupabaseDebt(debt)` & `insertSupabasePayment(debtId, payment)`: Real-time cloud sync.
  - `supabase/schema.sql`: Authored production-ready PostgreSQL database migration with tables for `profiles`, `debts`, `payments`, Row Level Security (RLS) policies, indexes, and seed records.
  - `.env` & `.env.example`: Created environment configuration files for `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
  - `src/components/AuthScreen.jsx`: Upgraded OTP flow to dynamically support Supabase 6-digit SMS OTP with auto-focus shifting, phone number validation, and graceful fallback.
  - `src/App.jsx`: Synchronized cloud database with local fallback so users experience instant local responsiveness with automatic cloud persistence.
- **Automated Browser Verification (Edge Mobile 360×800):**
  - Tested OTP trigger flow in Microsoft Edge: confirmed clean phone input submission, transition to OTP screen, responsive input digits, and zero console errors.
- **Strict Cleanup Compliance:** Deleted temporary inspection screenshot (`screenshot_supabase_otp.png`) and CDP script (`verify_supabase_step.cjs`) immediately following visual verification.
- **Production Compilation:** Tested with `npm run build` — compiled cleanly (1,645 modules, 0 errors). Live at `http://localhost:3000`.

### Phase 23: Live Supabase Cloud Connection & Verified Database Sync
- **Credentials Configured:** Populated `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` / `VITE_SUPABASE_PUBLISHABLE_KEY` in `.env` and `.env.local` using the user's project `https://xvthupmxpallgzgnysrt.supabase.co`.
- **Database Handshake Verified:**
  - Ran automated node verification test against the remote PostgreSQL instance: verified `debts` table exists with 3 initial records.
  - Initialized real-time cloud sync in `src/App.jsx` and `src/utils/supabase.js`.
- **Automated Browser Verification (Edge Mobile 360×800):**
  - Restarted Vite server to load live environment configuration.
  - Loaded live dashboard: verified live queries, borrower ledger cards, and loan entries render with zero console errors.
- **Strict Cleanup Compliance:** Deleted temporary inspection screenshot (`screenshot_supabase_live.png`) and CDP script (`verify_supabase_live.cjs`) immediately following visual verification.
- **Production Compilation:** Tested with `npm run build` — compiled cleanly (1,645 modules, 0 errors). Live at `http://localhost:3000`.

### Phase 24: Supabase Live Phone Auth & OTP Verification Loop
- **User Configuration:** Configured Supabase Auth test phone numbers (`917814350688=123456,919876543210=123456`) in Supabase Project Settings.
- **Backend Verification:** Executed live API authentication script (`test_otp_live.mjs`) verifying that `signInWithOtp('+917814350688')` and `verifyOtp('123456')` return authenticated user session (`ca6121fa-760f-45fa-b00f-8e26cd81a611`).
- **End-to-End Automated Browser Verification (Edge Mobile 360×800):**
  - Rendered `http://localhost:3000` via headless Microsoft Edge.
  - Typed phone number `7814350688` into phone input.
  - Clicked "ओटीपी भेजें" (Get OTP).
  - Transitioned to OTP input screen, entered 6-digit OTP `123456`.
  - Clicked "सत्यापित करें और आगे बढ़ें" (Verify & Proceed).
  - Confirmed authentication success: confetti fired, toast "Namaste, User (0688)!" displayed, and user dashboard loaded directly.
- **Strict Cleanup Compliance:** Purged `verify_browser_login.cjs` and `screenshot_login_verified.png` immediately after visual verification.
- **Production Compilation:** Verified clean build with `npm run build`. Live at `http://localhost:3000`.

### Phase 25: Authentic Indian Namaste Vector & Greeting Header Overhaul
- **User Feedback Addressed:** Replaced raw OS cartoon emoji `🙏` with an authentic, culturally resonant, and responsive Indian vector design.
- **Components Created & Updated:**
  - `src/components/NamasteIcon.jsx`: Authored custom vector component rendering reverent Anjali Mudra / Pranam hands framed by an auspicious golden sun-disc (`#FEF3C7` / `#FBBF24`) and radiant warmth bursts.
  - `src/components/LenderDashboard.jsx` & `src/components/BorrowerDashboard.jsx`:
    - Replaced raw `Namaste🙏!` text with a modern 3-part greeting banner.
    - Added Persona Avatar badge (`Store` for lender in amber/gold; `Coins` for borrower in teal).
    - Localized greeting text (`नमस्ते!` / `Namaste!` / `ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ!`) paired with `<NamasteIcon />`.
    - Integrated clean phone indicator and verified user business/person pill badge (`Harpreet General Store` / `Ramesh Kumar`).
- **Automated Browser Verification (Edge Mobile 360×800):**
  - Rendered `http://localhost:3000` via Edge CDP and verified layout balance, crisp typography, and vector alignment.
- **Strict Cleanup Compliance:** Purged `screenshot_namaste_verified.png`, `verify_namaste_upgrade.cjs`, `screenshot_namaste.cjs`, and `test_namaste.html` immediately after visual verification.
- **Production Compilation:** Tested with `npm run build` — 1,646 modules compiled cleanly with 0 errors. Live at `http://localhost:3000`.

### Phase 26: Clean Golden Sparkles Replacement for Greeting Icon
- **User Feedback Addressed:** Replaced the circular hands icon with a crisp, modern, celebratory golden **Sparkles ✨** vector (`Sparkles` from `lucide-react`) with warm gold fill and subtle drop shadow.
- **Components Updated:**
  - `src/components/LenderDashboard.jsx` & `src/components/BorrowerDashboard.jsx`: Updated greeting headline to `<span>{greeting}!</span> <Sparkles className="w-6 h-6 text-bahigold-500 fill-bahigold-200 shrink-0 drop-shadow-sm" />`.
  - Removed unused `NamasteIcon.jsx` component.
- **Automated Browser Verification (Edge Mobile 360×800):**
  - Rendered `http://localhost:3000` via Edge CDP: verified that `नमस्ते! ✨` displays cleanly with crisp vector clarity, zero distortion, and perfect baseline alignment.
- **Strict Cleanup Compliance:** Purged `screenshot_sparkles_verified.png` and `verify_sparkles.cjs` immediately following visual verification.
- **Production Compilation:** Tested with `npm run build` — 1,645 modules compiled cleanly (0 errors). Live at `http://localhost:3000`.

### Phase 27: Resolved BorrowerDashboard Leftover Icon Import
- **Root Cause Analysis:** `BorrowerDashboard.jsx` retained an unimported reference and duplicate import to the deleted `NamasteIcon` component, causing a runtime exception when the borrower view was rendered.
- **Fix Applied:**
  - Cleaned import block in `BorrowerDashboard.jsx` (removed duplicate imports and deleted `NamasteIcon` import).
  - Aligned greeting header to exclusively render `<Sparkles className="w-6 h-6 text-bahigold-500 fill-bahigold-200 shrink-0 drop-shadow-sm" />`.
- **Automated Browser Verification (Edge Mobile 360×800):**
  - Rendered borrower dashboard via Edge CDP for Ramesh Kumar (`9123456780`).
  - Confirmed 0 console errors, clean rendering of header, balance cards, progress indicators, and voice readout button.
- **Strict Cleanup Compliance:** Purged `screenshot_borrower_fix.png` and `verify_borrower_fix.cjs` immediately after visual verification.
- **Production Compilation:** Verified clean build with `npm run build` (0 errors). Live at `http://localhost:3000`.

### Phase 28: Lender Avatar Replaced with Official Bahi-Khata Ledger Notebook
- **User Feedback Addressed:** Replaced the generic storefront badge (`Store`) in `LenderDashboard.jsx` with the official open Bahi-Khata ledger notebook icon (`BookOpen`), matching the core brand metaphor of SahiHisaab.
- **Greeting Typography Simplified:** Removed trailing icons/sparkles next to `नमस्ते!` / `Namaste!` across both dashboards, delivering a pristine, uncluttered typography experience.
- **Automated Browser Verification (Edge Mobile 360×800):**
  - Rendered `http://localhost:3000` via Edge CDP for Harpreet General Store (`9876543210`).
  - Confirmed the golden avatar frame renders the Bahi-Khata ledger notebook icon crisply, paired with `नमस्ते!` and the verified business pill badge.
- **Strict Cleanup Compliance:** Purged `screenshot_lender_book_verified.png` and `verify_lender_icon.cjs` immediately after visual verification.
- **Production Compilation:** Tested with `npm run build` — 1,645 modules compiled cleanly (0 errors). Live at `http://localhost:3000`.

### Phase 29: Loan Start Date & Duration Selection in Add Loan Modal
- **Context & Requirement Addressed:** Previously, `startDate` was hardcoded to `new Date().toISOString().slice(0, 10)` in `AddLoanModal.jsx` without any input on screen, preventing lenders from entering backdated or custom loan dates.
- **Features Implemented:**
  - Added native Date Picker input (**उधार देने की तारीख / Loan Start Date**) with calendar icon.
  - Added 1-tap shortcut button (`📅 आज / Today`) to instantly reset to current date.
  - Added Duration selector (**अवधि (महीने)**) with 1M, 2M, 3M, 6M pills so lenders can specify loan tenure.
  - Vernacular localization support added in Hindi, Punjabi, and English in `src/translations/index.js`.
- **Automated Browser Verification (Edge Mobile 360×800):**
  - Rendered `AddLoanModal` via Edge CDP: confirmed date picker and duration pills display cleanly with zero overflow.
- **Strict Cleanup Compliance:** Purged `screenshot_add_loan_date.png` and `verify_add_loan_date.cjs` immediately after visual verification.
- **Production Compilation:** Verified clean build with `npm run build` (0 errors). Live at `http://localhost:3000`.

### Phase 30: Complete Design Overhaul of Add Payment Card & Emoji Purge
- **User Feedback Addressed:** Replaced all emojis (`💰`, `💵`, `📱`, `✨`) in `AddPaymentModal.jsx` with crisp SVG vector icons and redesigned the card for a high-contrast, professional fintech aesthetic.
- **Components & Layout Upgraded:**
  - Header: Replaced `💰` with `<HandCoins className="w-6 h-6 text-bahigold-400" />` in a rounded badge.
  - Balance Card: Integrated `<Coins />` icon badge and high-contrast remaining balance typography.
  - Payment Date: Added native Date Picker with `📅 आज` (Today) quick selector button.
  - Payment Split: Upgraded from plain text lines to a modern 2-tile financial dashboard (Interest tile in amber, Principal tile in emerald with clean currency values).
  - Payment Mode: Replaced `💵` with `<Banknote />` (Cash) and `📱` with `<QrCode />` (UPI/Online).
- **Automated Browser Verification (Edge Mobile 360×800):**
  - Rendered `AddPaymentModal` via Edge CDP: entered ₹1,000 installment, verified real-time calculation breakdown and zero visual overflow.
- **Strict Cleanup Compliance:** Purged `screenshot_payment_modal_upgraded.png` and `verify_payment_modal_upgrade.cjs` immediately following visual verification.
- **Production Compilation:** Tested with `npm run build` — 1,645 modules compiled cleanly (0 errors). Live at `http://localhost:3000`.

### Phase 31: GitHub Repository Setup & Initial Push
- **Repository Link:** `https://github.com/RanvirSahib/SahiHisaab.git`
- **Actions Completed:**
  - Authored a comprehensive `README.md` detailing the project's vision, features, dual ledger architecture, voice assistant, Supabase setup, tech stack, and roadmap.
  - Created a robust `.gitignore` ensuring that sensitive files (`.env`, `.env.local`), `node_modules`, build outputs (`dist/`), and temporary test scripts remain excluded from git history.
  - Verified 0 build regressions via `npm run build`.
  - Initialized git repository, created initial commit on `main`, and pushed cleanly to GitHub remote `origin/main`.
