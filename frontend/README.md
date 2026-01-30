# GH-300 GitHub Copilot Practice App

A modern, interactive React application for preparing for the GitHub Copilot (GH-300) certification exam.

## 🚀 Features

- **Two Complete Practice Tests**: 50 questions each covering all exam domains
- **Multiple Study Modes**:
  - Exam Mode: Timed 100-minute realistic exam simulation
  - Practice Mode: Untimed practice with immediate feedback
- **Comprehensive Tracking**:
  - Real-time progress monitoring
  - Performance analytics by domain
  - Attempt history and statistics
- **Interactive UI**:
  - Clean, modern interface built with React and TailwindCSS
  - Dark mode support
  - Responsive design for all devices
- **Smart Features**:
  - Mark questions for review
  - Navigate between questions easily
  - Visual question status indicators
  - Auto-save progress

## 📋 Prerequisites

- Node.js 20 or higher
- npm or pnpm
- Python 3.11+ (for data conversion script)

## 🛠️ Quick Start

### Option 1: Using DevContainer (Recommended)

1. Open this project in VS Code
2. Click "Reopen in Container" when prompted
3. Wait for the container to build
4. Dependencies will install automatically
5. Navigate to `http://localhost:5173`

### Option 2: Local Development

1. **Convert test data from Markdown to JSON:**

   ```bash
   python3 scripts/convert-md-to-json.py
   ```

2. **Install dependencies:**

   ```bash
   cd frontend
   npm install
   ```

3. **Start development server:**

   ```bash
   npm run dev
   ```

4. **Open in browser:**
   Navigate to `http://localhost:5173`

## 📁 Project Structure

```
GH300_preparation/
├── .devcontainer/          # DevContainer configuration
│   ├── devcontainer.json
│   └── Dockerfile
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── ui/         # shadcn/ui components
│   │   │   └── exam/       # Exam-specific components
│   │   ├── pages/          # Page components
│   │   ├── stores/         # Zustand state management
│   │   ├── types/          # TypeScript types
│   │   ├── utils/          # Utility functions
│   │   ├── data/           # Test data (JSON)
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── public/
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
├── scripts/
│   └── convert-md-to-json.py  # Data conversion script
├── docs/                   # Test answers and explanations
└── README.md
```

## 🎮 How to Use

### Taking a Test

1. **Select a Test**: On the dashboard, choose Test 1 or Test 2
2. **Choose Mode**:
   - **Exam Mode**: 100-minute timer, submit all at once
   - **Practice Mode**: No timer, review anytime
3. **Start**: Click "Start Exam" or "Start Practice"

### During the Exam

- **Answer Questions**: Click on options to select (multi-select questions support multiple answers)
- **Navigate**: Use Previous/Next buttons or click question numbers in the sidebar
- **Mark for Review**: Flag questions you want to revisit
- **Monitor Progress**: Check the sidebar for overall and domain-specific progress
- **Watch the Timer**: In Exam Mode, keep track of remaining time (alerts at 90, 60, 30, 10, 5 minutes)

### Submitting

1. Click "Review & Submit"
2. Review unanswered questions
3. Confirm submission
4. View detailed results

### Reviewing Results

- **Overall Score**: See if you passed (36/50 required)
- **Domain Breakdown**: Identify weak areas
- **Question-by-Question Review**: See correct answers and explanations

## 🎨 Customization

### Theme

Change between Light, Dark, or Auto mode in Settings

### Font Size

Adjust text size for better readability in Settings

### Timer Alerts

Configure when you want to receive time warnings

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
npm run type-check   # Check TypeScript types
```

### Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite 7
- **Styling**: TailwindCSS 3.4
- **UI Components**: shadcn/ui (Radix UI)
- **State Management**: Zustand
- **Routing**: React Router v6
- **Icons**: Lucide React
- **Date Handling**: date-fns

## 📊 Data Structure

Tests are stored in JSON format in `frontend/src/data/`:

```typescript
{
  "id": 1,
  "title": "GH-300 Practice Test 1",
  "questions": [...],
  "domains": ["Responsible AI", "GitHub Copilot Features", ...],
  "passingScore": 36,
  "timeLimit": 100
}
```

## 💾 Data Persistence

All data is stored in browser LocalStorage:

- `gh300_current_exam`: Active exam state (auto-saved every answer)
- `gh300_attempts`: Complete attempt history
- `gh300_settings`: User preferences

## 🐛 Troubleshooting

### Data not loading

Run the conversion script: `python3 scripts/convert-md-to-json.py`

### Port already in use

Change port in `vite.config.ts` or kill process on port 5173

### Dependencies not installing

Try: `rm -rf node_modules package-lock.json && npm install`

## 📝 License

This is an educational project for GitHub Copilot certification preparation.

## 🤝 Contributing

This is a practice/study tool. Feel free to fork and customize for your needs.

## 📚 Resources

- [GitHub Copilot Documentation](https://docs.github.com/en/copilot)
- [GH-300 Exam Information](https://learn.microsoft.com/en-us/credentials/certifications/github-copilot/)

---

**Good luck with your certification! 🚀**
