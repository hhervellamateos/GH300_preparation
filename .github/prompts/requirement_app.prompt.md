---
agent: agent
name: GH-300 Practice App - Requirements Specification
version: 1.0
date: 2026-01-30
---

# GH-300 GitHub Copilot Practice Tests - Frontend Application

## 📋 Executive Summary

Transform the existing CLI-based GH-300 practice test system into an interactive React web application with DevContainer support. The goal is to provide an intuitive, engaging, and effective study tool for GitHub Copilot certification candidates.

## 🎯 Project Objectives

### Current State
- CLI-based Python application
- Manual Markdown file editing
- Script execution for grading
- No visual feedback or progress tracking

### Target State
- Modern React SPA with TypeScript
- Interactive UI with real-time feedback
- Integrated 100-minute exam timer
- Visual progress tracking and analytics
- DevContainer-ready for instant development setup

## 🏗️ Technical Architecture

### Frontend Stack
```
Technology Stack:
├── React 18+ (with Vite 5+)
├── TypeScript 5+
├── TailwindCSS 3.4+
├── shadcn/ui components
├── Zustand (state management)
├── React Router v6 (navigation)
├── Recharts (analytics visualization)
├── date-fns (date manipulation)
└── lucide-react (icons)
```

### Backend (Optional - Future Enhancement)
```
├── FastAPI (Python) - reuse existing logic
├── SQLite/PostgreSQL (persistence)
└── JWT authentication
```

### DevOps
```
├── DevContainers (VS Code)
├── Docker Compose
├── Vite dev server (HMR)
└── Nginx (production deployment)
```

## 📐 Functional Requirements

### Module 1: Dashboard
**Priority: HIGH**

**Features:**
- Display both Test 1 and Test 2 as selectable cards
- Show test metadata (50 questions, 100 minutes, 72% pass rate)
- Display attempt history with:
  - Date/time of attempt
  - Score achieved
  - Pass/Fail status
  - Duration taken
- Show overall statistics:
  - Best score
  - Average score
  - Total attempts
  - Improvement trend graph
- Mode selection:
  - Exam Mode (timed, realistic conditions)
  - Practice Mode (untimed, immediate feedback)
  - Review Mode (only previously failed questions)

**Acceptance Criteria:**
- User can select a test and mode in ≤2 clicks
- Statistics load in <1 second
- Responsive design (mobile, tablet, desktop)

### Module 2: Exam Interface
**Priority: HIGH**

**Features:**
- Question display:
  - Clean, readable typography
  - Syntax highlighting for code blocks
  - Image support (if questions contain images)
  - Multi-select checkbox support
- Navigation:
  - Previous/Next buttons
  - Sidebar with question grid (1-50)
  - Visual indicators:
    - ✓ Answered (green)
    - ⚠ Marked for review (yellow)
    - ○ Unanswered (gray)
  - Jump to any question number
- Timer:
  - Countdown from 100:00 minutes
  - Visual alerts at 90, 60, 30, 10, 5 minutes
  - Auto-submit at 0:00
  - Pause option (Practice mode only)
- Progress tracking:
  - Overall progress bar
  - Per-domain progress indicators
  - Question count (e.g., "35/50 answered")
- Review functionality:
  - "Mark for Review" checkbox
  - Filter to show only marked questions
- Accessibility:
  - Keyboard navigation (Tab, Space, Enter)
  - Keyboard shortcuts:
    - N: Next question
    - P: Previous question
    - M: Mark for review
    - 1-5: Select option A-E
  - ARIA labels for screen readers

**Acceptance Criteria:**
- Questions render correctly with formatting
- Timer accuracy within ±1 second
- Navigation is instantaneous (<100ms)
- Keyboard shortcuts work in all contexts
- Mobile-friendly touch interface

### Module 3: Review Screen
**Priority: HIGH**

**Features:**
- Grid view of all 50 questions
- Visual summary:
  - Answered questions highlighted
  - Unanswered questions flagged in red
  - Review-marked questions in amber
- One-click navigation to specific questions
- "Submit Exam" confirmation dialog
- Ability to return to exam without submitting

**Acceptance Criteria:**
- User can identify unanswered questions at a glance
- Confirmation prevents accidental submission
- Can resume exam from review screen

### Module 4: Results Dashboard
**Priority: HIGH**

**Features:**
- Overall score display:
  - Large, prominent score (e.g., "42/50")
  - Percentage (84%)
  - PASS/FAIL indicator (≥36 = PASS)
  - Time taken
- Domain breakdown table:
  - Each domain listed
  - Score per domain (e.g., "Responsible AI: 4/5")
  - Percentage per domain
  - Visual progress bars
- Question-by-question comparison:
  - User's answer vs. Correct answer
  - Color-coded: green (correct), red (incorrect)
  - Expandable explanations
- Analytics:
  - Radar chart showing domain proficiency
  - Comparison with previous attempts
  - Weak areas highlighted
- Export options:
  - PDF report generation
  - JSON export for backup

**Acceptance Criteria:**
- Results appear immediately after submission
- All domain calculations are accurate
- Explanations are fully formatted
- PDF export includes all relevant data

### Module 5: Study Mode
**Priority: MEDIUM**

**Features:**
- Practice by specific domain
- Flashcard-style interface
- Immediate answer feedback
- "Show Explanation" button
- Shuffle questions option
- Bookmark favorite questions

**Acceptance Criteria:**
- Can filter questions by any domain
- Immediate feedback is accurate
- Bookmarks persist across sessions

### Module 6: Settings & Preferences
**Priority: LOW**

**Features:**
- Theme switcher (light/dark/auto)
- Font size adjustment
- Color contrast options
- Timer alert customization
- Sound effects toggle
- Data management:
  - Clear history
  - Export all data
  - Import previous sessions

## 🎨 UI/UX Design Specifications

### Color Palette
```css
:root {
  /* Primary Colors */
  --primary-600: #2563eb;      /* GitHub blue */
  --primary-500: #3b82f6;
  
  /* Semantic Colors */
  --success-600: #10b981;      /* PASS, correct */
  --success-500: #34d399;
  --danger-600: #ef4444;       /* FAIL, incorrect */
  --danger-500: #f87171;
  --warning-600: #f59e0b;      /* Review, alert */
  --warning-500: #fbbf24;
  --neutral-600: #6b7280;      /* Unanswered */
  --neutral-500: #9ca3af;
  
  /* Background */
  --bg-primary: #ffffff;
  --bg-secondary: #f9fafb;
  --bg-tertiary: #f3f4f6;
  
  /* Dark Mode */
  --dark-bg-primary: #1f2937;
  --dark-bg-secondary: #111827;
  --dark-bg-tertiary: #0f172a;
}
```

### Typography
```css
Font Family: 'Inter', 'system-ui', sans-serif
Code Font: 'Fira Code', 'Consolas', monospace

Headings:
- H1: 2.5rem (40px), font-weight: 700
- H2: 2rem (32px), font-weight: 600
- H3: 1.5rem (24px), font-weight: 600

Body:
- Regular: 1rem (16px), font-weight: 400
- Small: 0.875rem (14px)
- Tiny: 0.75rem (12px)
```

### Layout Structure

#### Desktop (≥1024px)
```
┌─────────────────────────────────────────────────────┐
│ Header: [Logo] [Timer] [Progress: 35/50] [Submit]  │
├──────────┬──────────────────────────────────────────┤
│          │                                           │
│ Sidebar  │         Main Content Area                │
│ (240px)  │                                           │
│          │  - Question Display                       │
│ ┌─────┐  │  - Options (checkboxes)                  │
│ │ 1 ✓ │  │  - Navigation buttons                    │
│ │ 2 ✓ │  │                                           │
│ │ 3 ⚠ │  │                                           │
│ │ 4 ○ │  │                                           │
│ │ ... │  │                                           │
│ └─────┘  │                                           │
│          │                                           │
│ Domain   │                                           │
│ Progress │                                           │
└──────────┴──────────────────────────────────────────┘
```

#### Mobile (<768px)
```
┌─────────────────────┐
│ Header (fixed)      │
│ [≡] Timer  [Submit] │
├─────────────────────┤
│                     │
│  Question Content   │
│                     │
│  [ ] A. Option      │
│  [x] B. Option      │
│  [ ] C. Option      │
│                     │
├─────────────────────┤
│ [< Prev] [Review]   │
│         [Next >]    │
└─────────────────────┘
Bottom Sheet: Question Navigator
```

### Component Design Patterns

#### Question Card
```
┌────────────────────────────────────────┐
│ Question 15/50                    ⚠ Mark│
│ Domain: GitHub Copilot Features        │
├────────────────────────────────────────┤
│                                        │
│ What is the primary purpose of...?    │
│                                        │
│ ```javascript                          │
│ function example() { }                 │
│ ```                                    │
│                                        │
│ ☐ A. First option text here           │
│ ☑ B. Second option (selected)          │
│ ☐ C. Third option here                 │
│ ☐ D. Fourth option text                │
│                                        │
└────────────────────────────────────────┘
```

#### Progress Indicator
```
Overall: [████████░░] 80% (40/50)

By Domain:
Responsible AI       [█████] 5/5  100%
Copilot Features     [████░] 8/10  80%
Best Practices       [███░░] 6/10  60%
...
```

#### Timer Display
```
Normal:  ⏱ 85:23

Warning (≤10min):  ⏱ 09:45 (pulsing orange)

Critical (≤5min):  ⏱ 04:30 (pulsing red)
```

## 📊 Data Models

### Question Structure
```typescript
interface Question {
  number: number;
  domain: string;
  text: string;
  options: {
    letter: 'A' | 'B' | 'C' | 'D' | 'E';
    text: string;
  }[];
  correctAnswers: string[]; // e.g., ['B'] or ['A', 'C', 'E']
  explanation: string;
  isMultiSelect: boolean;
}

interface Test {
  id: 1 | 2;
  title: string;
  questions: Question[];
  domains: string[];
  passingScore: number; // 36
  timeLimit: number; // 100 minutes
}
```

### Exam State
```typescript
interface ExamState {
  testId: 1 | 2;
  mode: 'exam' | 'practice' | 'review';
  currentQuestion: number;
  answers: Record<number, string[]>; // questionNumber -> selected options
  markedForReview: Set<number>;
  startTime: Date;
  endTime?: Date;
  timeRemaining: number; // seconds
  isPaused: boolean;
}

interface ExamAttempt {
  id: string;
  testId: 1 | 2;
  mode: 'exam' | 'practice';
  startedAt: Date;
  completedAt: Date;
  duration: number; // minutes
  score: number;
  totalQuestions: number;
  passed: boolean;
  answers: Record<number, string[]>;
  domainScores: {
    [domain: string]: {
      correct: number;
      total: number;
      percentage: number;
    };
  };
}
```

## 🔧 Technical Specifications

### State Management (Zustand)

**examStore.ts**
```typescript
interface ExamStore {
  // State
  currentExam: ExamState | null;
  tests: Test[];
  
  // Actions
  startExam: (testId: number, mode: string) => void;
  selectAnswer: (questionNumber: number, option: string) => void;
  deselectAnswer: (questionNumber: number, option: string) => void;
  markForReview: (questionNumber: number) => void;
  goToQuestion: (questionNumber: number) => void;
  submitExam: () => ExamAttempt;
  pauseExam: () => void;
  resumeExam: () => void;
}
```

**historyStore.ts**
```typescript
interface HistoryStore {
  attempts: ExamAttempt[];
  addAttempt: (attempt: ExamAttempt) => void;
  getAttemptsByTest: (testId: number) => ExamAttempt[];
  getBestScore: (testId: number) => number;
  clearHistory: () => void;
}
```

### Routing Structure
```typescript
const routes = [
  {
    path: '/',
    element: <Dashboard />
  },
  {
    path: '/exam/:testId/:mode',
    element: <ExamPage />,
    children: [
      { path: 'question/:number', element: <QuestionView /> },
      { path: 'review', element: <ReviewScreen /> }
    ]
  },
  {
    path: '/results/:attemptId',
    element: <ResultsPage />
  },
  {
    path: '/study',
    element: <StudyMode />
  },
  {
    path: '/settings',
    element: <Settings />
  }
];
```

### Persistence Strategy

**LocalStorage Keys:**
- `gh300_current_exam` - Active exam state
- `gh300_settings` - User preferences
- `gh300_attempts` - Exam history

**Auto-save:**
- Save state every 30 seconds
- Save on answer selection
- Save on navigation
- Save on page unload

## 📦 File Structure

```
GH300_preparation/
├── .devcontainer/
│   ├── devcontainer.json
│   └── Dockerfile
├── frontend/
│   ├── public/
│   │   └── logo.svg
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── ui/              # shadcn/ui components
│   │   │   │   ├── button.tsx
│   │   │   │   ├── card.tsx
│   │   │   │   ├── checkbox.tsx
│   │   │   │   └── ...
│   │   │   ├── dashboard/
│   │   │   │   ├── TestSelector.tsx
│   │   │   │   ├── StatsOverview.tsx
│   │   │   │   └── AttemptHistory.tsx
│   │   │   ├── exam/
│   │   │   │   ├── QuestionView.tsx
│   │   │   │   ├── NavigationPanel.tsx
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   ├── Timer.tsx
│   │   │   │   └── ProgressBar.tsx
│   │   │   ├── results/
│   │   │   │   ├── ResultsDashboard.tsx
│   │   │   │   ├── DomainBreakdown.tsx
│   │   │   │   ├── QuestionReview.tsx
│   │   │   │   └── ExplanationPanel.tsx
│   │   │   └── layout/
│   │   │       ├── Header.tsx
│   │   │       ├── Footer.tsx
│   │   │       └── Layout.tsx
│   │   ├── hooks/
│   │   │   ├── useExam.ts
│   │   │   ├── useTimer.ts
│   │   │   ├── useKeyboardNav.ts
│   │   │   └── useLocalStorage.ts
│   │   ├── lib/
│   │   │   └── utils.ts
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── ExamPage.tsx
│   │   │   ├── ReviewPage.tsx
│   │   │   ├── ResultsPage.tsx
│   │   │   ├── StudyMode.tsx
│   │   │   └── Settings.tsx
│   │   ├── stores/
│   │   │   ├── examStore.ts
│   │   │   ├── historyStore.ts
│   │   │   └── settingsStore.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── utils/
│   │   │   ├── grading.ts
│   │   │   ├── parser.ts
│   │   │   ├── timer.ts
│   │   │   └── export.ts
│   │   ├── data/
│   │   │   ├── test1.json
│   │   │   └── test2.json
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── .eslintrc.cjs
│   ├── .prettierrc
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   ├── vite.config.ts
│   └── components.json       # shadcn config
├── scripts/
│   └── convert-md-to-json.py  # Convert existing MD to JSON
├── docker-compose.yml
└── README.md
```

## 🐳 DevContainer Configuration

### Requirements
- Node.js 20 LTS
- Python 3.11+ (for conversion scripts)
- VS Code extensions:
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense
  - TypeScript

### Port Forwarding
- 5173: Vite dev server
- 8000: Backend API (future)

### Post-Create Commands
```bash
cd frontend && npm install
python3 scripts/convert-md-to-json.py
```

## 🚀 Development Workflow

### Phase 1: Setup (Week 1)
1. Create DevContainer configuration
2. Initialize React + Vite + TypeScript
3. Configure TailwindCSS + shadcn/ui
4. Set up folder structure
5. Create data conversion script (MD → JSON)

### Phase 2: Core Features (Week 2)
1. Implement Zustand stores
2. Build QuestionView component
3. Create NavigationPanel
4. Implement Timer functionality
5. Add keyboard navigation
6. Implement answer selection logic

### Phase 3: Results & Review (Week 3)
1. Build grading engine
2. Create ResultsDashboard
3. Implement domain breakdown
4. Add explanation panels
5. Create review screen

### Phase 4: Polish & Testing (Week 4)
1. Add animations and transitions
2. Implement dark mode
3. Mobile responsive design
4. Accessibility audit
5. Performance optimization
6. User testing

## ✅ Acceptance Criteria

### Performance
- Initial load: <2 seconds
- Question navigation: <100ms
- Timer accuracy: ±1 second
- Lighthouse score: >90

### Functionality
- All 50 questions render correctly
- Multi-select questions work properly
- Timer counts down accurately
- Grading is 100% accurate
- Data persists across sessions

### Accessibility
- WCAG 2.1 AA compliance
- Keyboard navigation works
- Screen reader compatible
- Sufficient color contrast

### Browser Support
- Chrome 120+
- Firefox 120+
- Safari 17+
- Edge 120+

## 📈 Success Metrics

- **User Engagement:** Average 3+ attempts per user
- **Completion Rate:** >80% complete at least one full test
- **Time to Start:** <30 seconds from clone to first question
- **User Satisfaction:** >4.5/5 rating
- **Performance:** <2s initial load time

## 🔒 Security & Privacy

- No server-side data storage (LocalStorage only)
- No tracking or analytics
- No external API calls
- All data stays in browser
- Export/import for user control

## 📝 Future Enhancements (Post-MVP)

- Multi-language support (ES, FR, DE)
- Custom test creation
- Spaced repetition algorithm
- Social features (compare with friends)
- Mobile app (React Native)
- Offline PWA support
- Backend API for multi-device sync
- AI-powered weak area detection

---

## Implementation Priority Matrix

| Feature | Priority | Effort | Dependencies |
|---------|----------|--------|--------------|
| DevContainer setup | P0 | Low | None |
| React + Vite init | P0 | Low | DevContainer |
| Data conversion | P0 | Medium | None |
| Question display | P0 | Medium | Data |
| Answer selection | P0 | Medium | Question display |
| Navigation | P0 | Medium | Question display |
| Timer | P0 | Medium | None |
| Grading engine | P0 | High | Answer selection |
| Results dashboard | P0 | High | Grading |
| Review screen | P1 | Low | Navigation |
| Dark mode | P1 | Low | UI components |
| Study mode | P2 | Medium | Question display |
| PDF export | P2 | Medium | Results |
| Backend API | P3 | High | All core features |

---

## Technical Debt & Risks

### Known Limitations
- LocalStorage has 5-10MB limit (sufficient for our use case)
- No cross-device synchronization without backend
- Timer may drift on background tabs

### Mitigation Strategies
- Use IndexedDB if LocalStorage fills up
- Clearly communicate local-only nature
- Use Web Workers for timer to prevent drift

---

*This document is the single source of truth for the GH-300 Practice App. All implementation decisions should reference these requirements.*
