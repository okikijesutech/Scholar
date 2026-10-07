# NaijaLessonPlan 🇳🇬
### Inspection-Ready Lesson Note & Educational Content Generator for Nigerian Schools

**NaijaLessonPlan** is a specialized curriculum and lesson planning web tool designed specifically for Nigerian educators across:
- **Primary Education:** Basic 1 to 6 (Primary 1–6)
- **Junior Secondary Education:** Basic 7 to 9 (JSS 1–3)
- **Senior Secondary Education:** Senior Secondary 1 to 3 (SSS 1–3)

Aligned with the pedagogical structure of the **NERDC (Nigerian Educational Research and Development Council)** curriculum standards and the official inspection format mandated by State Universal Basic Education Boards (**SUBEB**) and the Federal Ministry of Education.

> **Note:** *NaijaLessonPlan is an independent educational planning tool designed to support teachers. It is not officially affiliated with or endorsed by NERDC or SUBEB.*

---

## 🌟 Key Features

1. **Standard Nigerian Lesson Note Format:**
   - **Administrative Header:** School Name, Teacher's Name, Subject, Class, Term, Week, Duration, Period, Average Age, Topic, and Sub-Topic.
   - **Instructional Objectives:** Formulated using Bloom's Taxonomy action verbs (*"By the end of the lesson, pupils/students should be able to: 1. ..., 2. ..."*).
   - **Entry Behaviour / Previous Knowledge:** Explicitly links previous lessons to new content.
   - **Instructional Materials / Teaching Aids:** Concrete objects, charts, and locally available Nigerian resources (realia, bottle tops, abacus, flashcards, market specimens).
   - **Reference Books:** Standard textbooks approved by Nigerian Ministries of Education (e.g., *New General Mathematics*, *Evans Effective English*, *Essential Biology*, *STAN Basic Science*).
   - **Presentation Steps (Content Delivery):** Phased table breakdown with distinct **Teacher's Activity** and **Pupils'/Students' Activity** columns.
   - **Formative Evaluation:** Formative questions to measure concept acquisition.
   - **Summary & Conclusion:** Wrap-up and key takeaways.
   - **Homework / Take-Home Assignment:** Textbook exercises and applied home drills.
   - **Quality Assurance Section:** Official signature and date blocks for Teacher, Head of Department (HOD), Vice Principal (Academics), and Principal's Official Stamp.

2. **NERDC Scheme of Work Browser:**
   - Preloaded 12-week syllabus breakdown for 1st, 2nd, and 3rd terms across core subjects.
   - One-click button to load any week's topic and generate the complete note instantly.

3. **Dual Generation Engine (Works 100% Offline):**
   - **Intelligent Local Curriculum Generator:** Runs without internet or API keys, using Nigerian cultural context (Naira ₦, Nigerian names, local foods, landmarks).
   - **Google Gemini AI Integration:** Optional API key input for custom teacher prompts (e.g. "Focus on hands-on lab experiments" or "Differentiate for visual learners").

4. **Multi-Format Exporting:**
   - **Print to PDF:** Dedicated `@media print` layout fitting A4 paper with neat borders and headers matching official school notebooks.
   - **Word Document (.docx):** Direct browser download of an editable `.docx` file for offline submission.
   - **Plain Text / WhatsApp Format:** One-click copy for WhatsApp staff groups or email.

5. **Local Library & Persistence:**
   - Automatically saves notes to browser storage with schema validation.
   - Search, filter by class/term, edit, duplicate for subsequent weeks, or delete.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v20 or higher recommended)
- npm or yarn

### Installation & Development
1. Clone the repository:
   ```bash
   git clone https://github.com/okikijesutech/Scholar.git
   cd Scholar
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

---

## 🛠️ Built With
- **Framework:** React 19 + TypeScript + Vite
- **Styling:** Tailwind CSS v4 with custom print stylesheets
- **Document Generation:** `docx` (Client-side Microsoft Word file generator)
- **Icons:** Lucide React
- **Celebration Feedback:** Canvas Confetti
