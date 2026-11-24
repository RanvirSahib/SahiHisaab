# Project SahiHisaab (सही हिसाब): System Requirements & Specifications

---

## 1. System Goals & Scope
**SahiHisaab (सही हिसाब)** is a mobile-first web application enabling transparent, low-interest micro-debt tracking between community lenders and rural/low-income borrowers.

---

## 2. User Roles & Capabilities

### 2.1 Role 1: Lender (Udhaar Dene Wala)
- **Profile Setup**: Name, phone number, village/town, optional business/shop name.
- **Borrower Management**:
  - Add new borrower (Name, Phone number, Village/Address, Photo/Avatar).
  - View list of all active and completed borrower ledgers.
- **Debt / Loan Creation**:
  - Enter principal amount (e.g., ₹5,000).
  - Enter low interest rate (e.g., 1% or 2% per month / year, with simple interest calculation).
  - Set start date and expected repayment period (or flexible open schedule).
  - Add optional audio note or brief note for loan purpose (e.g., seeds, medicine, school fees).
- **Payment Collection Logging**:
  - Record payment installment received (amount, date, payment mode: cash/UPI).
  - Automated split between interest and principal reduction.
  - Generate instant digital receipt / summary shareable via WhatsApp or SMS.
- **Lender Dashboard & Summary**:
  - Total money lent.
  - Total money recovered.
  - Total outstanding amount.

### 2.2 Role 2: Borrower (Udhaar Lene Wala)
- **Simple Login / Access**:
  - Phone number login via one-time PIN (OTP) or simple 4-digit security PIN.
  - Direct QR-code or secure link view provided by the lender.
- **Simplified Borrower View**:
  - Giant card showing **Total Left to Pay (Bachi Hui Rashi)**.
  - Clear breakdown:
    - Original Udhaar: ₹X
    - Interest Added: ₹Y
    - Total Repaid so far: ₹Z
  - List of past installments with dates and receipt badges.
- **Voice Readout ("Sunao" / "Listen")**:
  - Audio button that reads out remaining debt and last payment confirmation in the chosen language.
- **Confirmation / Acknowledgment**:
  - One-tap button to acknowledge "Yes, this payment was made" or flag a discrepancy.

---

## 3. Accessibility & Inclusivity Requirements

### 3.1 Multilingual & Localization (i18n)
- Language switcher available on top of every page with local scripts:
  - English
  - हिन्दी (Hindi)
  - Additional languages planned: বাংলা (Bengali), ਪੰਜਾਬੀ (Punjabi), मराठी (Marathi), தமிழ் (Tamil), etc.
- Number formatting in standard Indian notation (₹ 1,00,000 / 1 Lakh).
- Clean translations avoiding legal/accounting jargon (e.g., using "Bacha Hua Paisa" instead of "Outstanding Amortized Liability").

### 3.2 Visual & Interaction Design
- **Touch Targets**: Minimum 48x48px button touch areas for ease of tapping on cheap touchscreens.
- **Visual Status Cues**:
  - Green: Fully Paid / Payment Success
  - Yellow / Orange: Upcoming Payment
  - Red / Dark Red: Pending / Overdue
- **Iconography**: Every core action paired with a universal, recognizable icon (hand giving cash, checkmark, phone, speaker icon for audio).
- **Responsive Layout**: Designed mobile-first for small screen viewports (360px - 412px standard budget Android devices).

---

## 4. Technical & Architectural Requirements

### 4.1 Frontend Architecture
- **Framework**: Modern React / Next.js or Vite React for fast client-side rendering.
- **Styling**: Tailwind CSS for responsive, lightweight, accessible styling.
- **Localization**: `i18next` / `react-i18next` for seamless client-side language switching without page reloads.
- **Icons**: Lucide Icons or Heroicons (clear, lightweight SVG icons).
- **Speech Synthesis**: Native Web Speech API (`window.speechSynthesis`) for zero-cost audio readout in supported Indian locales (e.g., `hi-IN`).

### 4.2 Backend & Data Storage
- **Data Model**:
  - `Users` (id, phone, role [lender/borrower], name, language_preference, created_at)
  - `Debts / Loans` (id, lender_id, borrower_id, principal, interest_rate_percent, interest_period [monthly/yearly], start_date, status [active/closed])
  - `Transactions` (id, debt_id, amount_paid, payment_date, payment_mode [cash/online], recorded_by, confirmed_by_borrower)
- **Database**: Lightweight relational database (SQLite / PostgreSQL / Supabase or Firebase).

### 4.3 Security & Privacy
- Role-based data separation (borrower can only see debts linked to their phone number).
- Audit trail for all recorded payments to ensure neither party can silently alter past transactions.
