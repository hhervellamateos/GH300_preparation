# GH-300 GitHub Copilot — Practice Tests

This repository contains **two simulation preparatory tests** for the **GH-300 (GitHub Copilot) certification**.

## 🚀 NEW: Interactive Web Application!

We now offer **two ways** to practice for the exam:

### Option 1: 🌐 Web App (Recommended)

A modern, interactive React application with:
- ✅ Real-time exam simulation with 100-minute timer
- ✅ Visual progress tracking and navigation
- ✅ Instant feedback and detailed results
- ✅ Dark mode support
- ✅ Mobile-friendly responsive interface
- ✅ Automatic progress saving
- ✅ Attempt history and statistics

**Quick Start:**
```bash
# 1. Generate test data from markdown files
python3 scripts/convert-md-to-json.py

# 2. Install dependencies and run
cd frontend
npm install
npm run dev

# 3. Open in browser
# http://localhost:5173
```

📖 **[Full Web App Documentation](frontend/README.md)**  
⚡ **[Quick Start Guide](QUICKSTART.md)**  
📊 **[Implementation Summary](IMPLEMENTATION_SUMMARY.md)**

---

### Option 2: 📝 CLI Method (Original)

Traditional markdown-based testing with command-line grading.

## How to Take a Test (CLI)

1. Open one of the question files:
    - `copilot_test_1_questions.md`
    - `copilot_test_2_questions.md`

2. For each question, mark the correct option(s) by changing the checkbox to an `x`:
    - Example: change `#### [ ] B. ...` to `#### [x] B. ...`

    Notes:
    - Some questions are multi-select; mark **all** correct options.
    - Upper/lowercase both work (`x` or `X`).

3. Save the file after you finish the test:
    - In VS Code: `Ctrl + S`

4. Timing (recommended)
    - The official exam time limit is **100 minutes**, so it's recommended to **set a 100-minute timer** and complete the test under realistic conditions.

## Generate the Report (CLI)

After you finish marking answers, run the report generator with the test number (1 or 2):

```bash
python3 generate_report.py 1
```

or:

```bash
python3 generate_report.py 2
```

This will generate:

- `copilot_test_1_report.md` (or `copilot_test_2_report.md`) in the repository root.

The report includes:

- Overall totals (answered, unanswered, correct, incorrect)
- A breakdown **by domain**, including which questions were incorrect/unanswered
- An appended `## Explanations` section containing the full explanations for each question

### Validation condition (PASS/FAIL)

- Passing requires getting **at least 36 out of 50 questions correct** (72%).

## Project Structure

```
GH300_preparation/
├── frontend/                    # 🌐 React Web Application
│   ├── src/
│   │   ├── components/         # UI components
│   │   ├── pages/              # Main pages (Dashboard, Exam, Results)
│   │   ├── stores/             # State management (Zustand)
│   │   └── data/               # Test data (JSON)
│   └── README.md
├── scripts/
│   └── convert-md-to-json.py  # Convert MD → JSON
├── docs/
│   ├── copilot_test_1_answers.md
│   ├── copilot_test_1_explanations.md
│   ├── copilot_test_2_answers.md
│   └── copilot_test_2_explanations.md
├── copilot_test_1_questions.md
├── copilot_test_2_questions.md
├── generate_report.py          # 📝 CLI grading script
└── QUICKSTART.md               # Quick start guide
```

## Test Coverage

Both tests cover **50 questions** across **7 domains**:

1. **Responsible AI** - Ethics, bias, and responsible use of AI
2. **GitHub Copilot plans and features** - Subscription tiers and capabilities
3. **GitHub Copilot Best Practices** - Optimal usage patterns
4. **GitHub Copilot for IDEs and CLI** - Tool integration
5. **GitHub Copilot Extensions and Agents** - Extensibility
6. **Code Security with GitHub Copilot** - Security considerations
7. **Productivity Enhancement** - Workflow optimization

## DevContainer Support

This project includes a complete DevContainer configuration for instant development:

1. Open in VS Code
2. Click "Reopen in Container"
3. Everything is pre-configured and ready to use!

Includes:
- Node.js 20 LTS
- Python 3.11
- All VS Code extensions
- Pre-configured linting and formatting

## Tech Stack (Web App)

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite 7
- **Styling**: TailwindCSS 3.4
- **UI Components**: shadcn/ui (Radix UI)
- **State Management**: Zustand
- **Routing**: React Router v6
- **Icons**: Lucide React
- **Date Handling**: date-fns

## Features Comparison

| Feature | Web App | CLI |
|---------|---------|-----|
| Interactive UI | ✅ | ❌ |
| Timer | ✅ Auto | ⏱️ Manual |
| Navigation | ✅ Visual | ❌ |
| Progress Tracking | ✅ Real-time | ❌ |
| Results | ✅ Interactive | 📄 Markdown |
| Mobile Support | ✅ | ❌ |
| Dark Mode | ✅ | ❌ |
| Auto-save | ✅ | ❌ |
| History | ✅ | ❌ |

## Contributing

This is an educational project. Feel free to:
- Report issues
- Suggest improvements
- Submit pull requests
- Fork for personal use

## License

Educational use for GitHub Copilot certification preparation.

## Resources

- [GitHub Copilot Documentation](https://docs.github.com/en/copilot)
- [GH-300 Certification Info](https://learn.microsoft.com/en-us/credentials/certifications/github-copilot/)
- [Microsoft Learn - GitHub Copilot](https://learn.microsoft.com/en-us/training/github/)

---

## 🎯 Good luck with your certification!

**Remember**: Practice makes perfect. Use both the web app and CLI method to maximize your preparation.

💡 **Pro Tip**: Take the web app exam in "Exam Mode" for the most realistic experience, then review your weak areas in "Practice Mode".
