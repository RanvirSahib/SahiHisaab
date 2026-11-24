# SahiHisaab (सही हिसाब)

<div align="center">

![SahiHisaab Banner](public/logo/horizontalwebsiteheader.webp)

### **पारदर्शी ग्रामीण बही-खाता एवं माइक्रो-लेंडिंग प्लेटफॉर्म**
*“Na galti, na jhanjhat, poora vishwas”* (न गलती, न झंझट, पूरा विश्वास)

[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database_%26_Auth-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

</div>

---

## 📖 परिचय (About SahiHisaab)

**SahiHisaab (सही हिसाब)** भारत के ग्रामीण क्षेत्रों, छोटे कस्बों, स्वयं सहायता समूहों (SHGs), ग्रामीण दुकानदारों और किसानों के लिए बनाया गया एक पारदर्शी, शून्य-जार्गन (Zero-Jargon) माइक्रो-लेंडिंग एवं बही-खाता प्लेटफॉर्म है।

पारंपरिक बही-खाते की लाल जिल्द, धारीदार कागज़ और सरल हिसाब की पवित्रता को आधुनिक क्लाउड तकनीक, फोन OTP प्रमाणीकरण और **ध्वनि सहायक (Voice Assistant)** के साथ प्रस्तुत किया गया है।

---

## ✨ मुख्य विशेषताएँ (Key Features)

### 1. 🔄 दोहरा दृष्टिकोण (Dual-Perspective Ledger)
* **उधार देने वाला (Lender Dashboard):**
  - कुल दिया उधार, अब तक वापस मिली रकम और शेष बकाया राशि का तुरंत हिसाब।
  - नाम, गाँव और स्थिति (तारीख निकल गई / जल्दी देना है / चुकता) के आधार पर खोज और फ़िल्टर।
  - नया उधार दर्ज करते समय **शुरू होने की तारीख (Start Date)** और **अवधि (Months)** चुनने की सुविधा।
  - साधारण ब्याज दर (1%, 1.5%, 2%, 3% या मनचाही दशमलव दर उदा. 1.25%, 2.75%) का चयन।
* **उधार लेने वाला (Borrower Dashboard):**
  - विशाल और स्पष्ट **"बची हुई रकम"** कार्ड।
  - ब्याज और मूलधन का पारदर्शी विभाजन (असली उधार, जुड़ा ब्याज, अब तक चुकाया)।
  - 1-क्लिक पावती एवं विवाद दर्ज करने की सुविधा (👍 "हाँ, दिया" / 👎 "गलत है!")।

### 2. 🔊 ग्रामीण ध्वनि सहायक (Rural Voice Assistant - "सुनाओ")
* कम पढ़े-लिखे या बुजुर्ग उपयोगकर्ताओं के लिए ब्राउज़र के नेटिव **Web Speech API** का उपयोग।
* धीमी, धैर्यवान और स्पष्ट आवाज में खाता विवरण पढ़कर सुनाने की सुविधा।
* तीन भाषाओं में समर्थित:
  - 🇮🇳 **हिन्दी (`hi-IN`)**
  - 🇮🇳 **ਪੰਜਾਬੀ (`pa-IN`)**
  - 🇮🇳 **भारतीय अंग्रेज़ी (`en-IN`)**

### 3. 🌐 त्रिभाषी समर्थन (Native Multilingual Engine)
* बिना किसी पेज रीलोड के एक टैप में भाषा परिवर्तन:
  - **हिन्दी (Hindi)**
  - **ਪੰਜਾਬੀ (Punjabi)**
  - **English**

### 4. ⚡ किस्त का पारदर्शी बँटवारा (Transparent Payment Split)
* जब भी कोई किस्त (नकद या यूपीआई द्वारा) दर्ज की जाती है, सिस्टम स्वचालित रूप से उसे दो स्पष्ट टाइल्स में बाँटता है:
  - **ब्याज का हिस्सा (Interest Portion)**
  - **मूलधन (उधार) कटौती (Principal Portion)**

### 5. ☁️ Supabase रियल-टाइम डेटाबेस एवं SMS OTP Auth
* **PostgreSQL क्लाउड डेटाबेस:** `profiles`, `debts`, `payments` टेबल्स, Row Level Security (RLS) और स्वचालित रिलेशनल क्वेरीज़।
* **Phone SMS OTP Auth:** 6-अंकों का सुरक्षित प्रमाणीकरण।
* **ऑफ़लाइन/डेमो फ़ॉलबैक:** इंटरनेट या Supabase न होने पर भी लोकलस्टोरेज पर बिना किसी रुकावट के काम करता है।

### 6. 🧾 डिजिटल रसीदें एवं ऑडिट ट्रेल
* **व्हाट्सऐप रसीद:** 1-क्लिक में प्री-फॉर्मेटेड व्हाट्सऐप समरी साझा करें।
* **प्रिंट योग्य बही-खाता वाउचर:** दुकानदारों और ग्राहकों के लिए रसीद का प्रिंट और डिजिटल रिकॉर्ड।

---

## 🛠️ तकनीकी संरचना (Tech Stack)

| भाग | प्रयुक्त तकनीक |
| :--- | :--- |
| **Frontend** | React 18, Vite 6, Tailwind CSS 3 |
| **Icons & UI** | Lucide React (100% SVG Vector Icons, Zero Cartoon Emojis), Canvas Confetti |
| **Typography** | Google Fonts Baloo 2 (देवनगरी, गुरमुखी एवं लैटिन के लिए अनुकूलित) |
| **Database & Auth** | Supabase (PostgreSQL, Realtime Subscriptions, Phone OTP) |
| **Voice & Speech** | HTML5 Web Speech API (`window.speechSynthesis`) |
| **Storage & State** | Supabase Cloud Sync + LocalStorage Resilient Fallback |

---

## 📂 प्रोजेक्ट डायरेक्टरी संरचना (Folder Structure)

```text
SahiHisaab/
├── public/
│   └── logo/                   # ब्रांड लोगो और हेडर एसेट्स (.webp / .png)
├── src/
│   ├── components/
│   │   ├── AddLoanModal.jsx       # नया उधार दर्ज करने का फ़ॉर्म (तारीख व अवधि सहित)
│   │   ├── AddPaymentModal.jsx    # किस्त दर्ज करने का कार्ड (पारदर्शी 2-टाइल बँटवारा)
│   │   ├── AuthScreen.jsx         # फोन OTP ऑथेंटिकेशन व 1-क्लिक डेमो प्रोफाइल्स
│   │   ├── BorrowerDashboard.jsx  # उधार लेने वाले का बही-खाता
│   │   ├── Header.jsx             # शीर्ष हेडर, ब्रांड लोगो व भाषा चयन
│   │   ├── LanguageSelector.jsx   # कस्टम भारतीय भाषा ड्रॉपर
│   │   ├── LenderDashboard.jsx    # उधार देने वाले का डैशबोर्ड व स्टेटिस्टिक्स
│   │   ├── LoanDetailModal.jsx    # लोन की विस्तृत जानकारी व इतिहास
│   │   └── ReceiptModal.jsx       # व्हाट्सऐप व प्रिंट रसीद वाउचर
│   ├── translations/
│   │   └── index.js            # हिन्दी, पंजाबी और अंग्रेज़ी शब्दकोश
│   ├── utils/
│   │   ├── speech.js           # ग्रामीण वॉयस असिस्टेंट इंजन
│   │   ├── storage.js          # वित्तीय गणनाएँ (सरल ब्याज, किस्त बँटवारा)
│   │   └── supabase.js         # Supabase क्लाइंट, Auth व डेटाबेस सिंक
│   ├── App.jsx                 # मुख्य रूट कंटेनर व नेविगेशन
│   ├── index.css               # बही-खाता रूल्ड पेपर व शैडो शैलियाँ
│   └── main.jsx                # एप्लिकेशन एंट्रीपॉइंट
├── supabase/
│   └── schema.sql              # PostgreSQL स्कीमा, RLS नीतियाँ व सीड डेटा
├── .env.example                # पर्यावरण चर टेम्पलेट
├── package.json
├── tailwind.config.js
└── vite.config.js
```

---

## 🚀 स्थानीय सेटअप और रन करने की विधि (Getting Started)

### 1. पूर्वापेक्षाएँ (Prerequisites)
- [Node.js](https://nodejs.org/) (वर्जन 18 या उससे अधिक)
- npm या pnpm या yarn

### 2. क्लोन करें (Clone Repository)
```bash
git clone https://github.com/RanvirSahib/SahiHisaab.git
cd SahiHisaab
```

### 3. पैकेज इंस्टॉल करें (Install Dependencies)
```bash
npm install
```

### 4. पर्यावरण चर कॉन्फ़िगर करें (Configure Environment)
`.env.example` की कॉपी बनाकर `.env` फ़ाइल तैयार करें:
```bash
cp .env.example .env
```
अपनी Supabase क्रेडेंशियल्स दर्ज करें:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-publishable-key
```

### 5. डेटाबेस सेटअप (Supabase Database Setup)
Supabase डैशबोर्ड में **SQL Editor** खोलें और `supabase/schema.sql` में दिया गया SQL कोड पेस्ट करके **Run** करें।

### 6. डेवलपमेंट सर्वर शुरू करें (Start Dev Server)
```bash
npm run dev
```
ब्राउज़र में **`http://localhost:3000`** खोलें।

### 7. प्रोडक्शन बिल्ड (Production Build)
```bash
npm run build
npm run preview
```

---

## 📱 भविष्य की रूपरेखा (Future Roadmap)

- [ ] **PWA (Progressive Web App):** ऑफ़लाइन कैशिंग और होम-स्क्रीन ऐप इंस्टॉल।
- [ ] **Capacitor Android APK:** गूगल प्ले स्टोर के लिए सीधे नेटिव एंड्रॉइड ऐप रैपिंग।
- [ ] **SMS Gateway Integration:** वोनेज (Vonage) / ट्विलियो (Twilio) लाइव सेल्युलर एसएमएस ब्रॉडकास्ट।
- [ ] **UPI Deep Linking:** सीधे गूगल पे / फोनपे / पेटीएम से 1-टैप भुगतान पावती लिंक।

---

## 📄 लाइसेंस (License)

यह प्रोजेक्ट [MIT License](LICENSE) के अंतर्गत ओपन-सोर्स है।

---

<div align="center">
  <b>SahiHisaab – सही हिसाब</b><br/>
  <i>भारतीय गाँवों और व्यापारियों के विश्वास का सच्चा साथी</i> 🇮🇳
</div>
