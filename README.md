# 🎯 AI-Powered Interview Assistant (Crisp)

[![React](https://img.shields.io/badge/React-18.2-blue.svg)](https://reactjs.org/)
[![Redux](https://img.shields.io/badge/Redux-Toolkit-purple.svg)](https://redux-toolkit.js.org/)
[![Ant Design](https://img.shields.io/badge/Ant%20Design-5.12-red.svg)](https://ant.design/)

An intelligent, AI-powered interview platform built with React that conducts automated technical interviews for Full Stack Developer positions. Features real-time chat, AI-generated questions, automatic scoring, advanced analytics dashboard, and comprehensive candidate management with hiring recommendations.

## ✨ Features

### 🎯 Core Functionality
- **⚡ Sample Data Mode**: Try the full application instantly without an API key!
- **📄 Smart Resume Upload**: Upload PDF/DOCX resumes with automatic information extraction
- **🤖 AI-Powered Interview**: Dynamic question generation tailored to the candidate's resume
- **⏱️ Timed Questions**: Automatic timers (Easy: 20s, Medium: 60s, Hard: 120s)
- **💾 Persistent Storage**: All data saved locally with Redux Persist - survives page refreshes
- **🔄 Session Recovery**: Welcome Back modal for resuming incomplete interviews
- **🎨 Neo Dark Mode**: Beautiful dark theme with perfect contrast and glassmorphism effects
- **🎊 Celebration Confetti**: Delightful animation on interview completion

### 📊 Advanced Analytics Dashboard (NEW!)
- **Real-Time Metrics**: 4 key performance indicators at a glance
  - Total Candidates
  - Completion Rate
  - Average Score
  - Average Time per Question
- **Top Performer Highlighting**: Instantly identify best candidates
- **Hiring Recommendations**: AI-powered hiring guidance for each candidate
- **Performance Breakdown**: Detailed analysis by difficulty level
- **Time Management Scores**: Evaluate candidate efficiency
- **Visual Progress Indicators**: Charts and progress bars for quick insights

### 💼 Interviewee Tab
- Resume upload with drag-and-drop support
- **Sample Data Button**: Test instantly without uploading
- Automatic extraction of Name, Email, and Phone
- Chatbot collects missing information before starting
- 6 AI-generated questions (2 Easy, 2 Medium, 2 Hard)
- Real-time countdown timer for each question
- Auto-submit when time expires
- Live progress tracking
- Final score and AI-generated summary
- **Celebration Confetti**: Rewarding visual feedback on completion

### 📈 Interviewer Dashboard (Enhanced!)

**Overview Cards:**
- Total Candidates count
- Completion Rate with visual progress
- Average Score with color-coded indicators
- Average Time per Question metric

**Top Performer Card:**
- Highlights best candidate with star icon
- Quick access to top performer's profile
- One-click view details

**Candidate Table:**
- Sortable by score, name, or date
- Filter by status (Collecting Info, In Progress, Completed)
- Color-coded score tags
- Responsive design for all screen sizes

**Detailed Candidate Analytics:**
- **Hiring Recommendation Badge**:
  - "Highly Recommended" (80+ score)
  - "Recommended" (65-79 score)
  - "Consider" (50-64 score)
  - "Not Recommended" (<50 score)
- **Answer Completion Rate**: Engagement tracking
- **Time Management Score**: Efficiency analysis
- **Performance by Difficulty**:
  - Easy Questions performance
  - Medium Questions performance
  - Hard Questions performance
- Complete profile information
- All questions and answers
- Full chat history
- AI-generated summary

## 🚀 Tech Stack

- **Frontend**: React 18 with Vite
- **State Management**: Redux Toolkit with Redux Persist
- **UI Library**: Ant Design 5 (with custom theming)
- **AI Integration**: OpenAI GPT-4 Turbo
- **Markdown Rendering**: React Markdown
- **Resume Parsing**: Custom parser for PDF/DOCX files
- **Styling**: CSS3 with responsive design, glassmorphism, and neo-dark theme
- **Performance**: useMemo for optimized analytics calculations
- **Data Visualization**: Progress bars, statistics, and charts

## 📦 Installation

### Prerequisites
- Node.js 16+ and npm/yarn
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

### Setup Instructions

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd STRIP\ PROJECT
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
# Copy the example file
cp .env.example .env

# Edit .env and add your OpenAI API key
VITE_OPENAI_API_KEY=your_actual_api_key_here
```

4. **Start the development server**
```bash
npm run dev
```

5. **Open your browser**
Navigate to `http://localhost:3000`

## 🎬 Quick Start

### Option 1: Test with Sample Data (No Setup!)
1. Open the application
2. Click **"Try Sample Data"** button
3. Complete the interview
4. View results in Dashboard

### Option 2: Use with OpenAI API
1. Add your OpenAI API key to `.env`
2. Upload your resume
3. Complete real AI-powered interview

## 🎬 Usage Guide

### For Candidates (Interviewee Tab)

1. **Upload Resume**
   - Click "Upload Resume" button
   - Select a PDF or DOCX file
   - System automatically extracts Name, Email, Phone

2. **Provide Missing Information**
   - If any information is missing, chatbot will ask for it
   - Type your response and press Enter or click Send

3. **Take the Interview**
   - AI generates 6 questions based on your resume
   - Answer each question before the timer runs out
   - Questions get progressively harder
   - Timer automatically submits when time expires

4. **View Results**
   - After completing all questions, receive final score
   - AI provides a summary of your performance

### For Interviewers (Dashboard Tab)

1. **Overview Dashboard**
   - View 4 key metrics at a glance
   - See completion rates and average scores
   - Monitor average time per question
   - Identify top performer instantly

2. **View Candidates**
   - See list of all candidates with status
   - Sort by score, name, or date
   - Filter by interview status
   - Color-coded score indicators

3. **Detailed Analytics**
   - Click "View Details" on any candidate
   - See **Hiring Recommendation** (Highly Recommended, Recommended, etc.)
   - Check **Answer Completion Rate**
   - Review **Time Management Score**
   - Analyze **Performance by Difficulty** (Easy, Medium, Hard)
   - View all questions, answers, and chat history
   - Read AI-generated summary

4. **Make Data-Driven Decisions**
   - Use analytics to compare candidates
   - Identify strengths and weaknesses
   - Fast-track top performers
   - Make informed hiring decisions

## 🏗️ Project Structure

```
STRIP PROJECT/
├── src/
│   ├── components/
│   │   ├── IntervieweeTab.jsx      # Candidate interview interface
│   │   ├── InterviewerTab.jsx      # Dashboard for viewing candidates
│   │   ├── ChatMessage.jsx         # Chat message component
│   │   ├── QuestionCard.jsx        # Question display component
│   │   └── *.css                   # Component styles
│   ├── services/
│   │   ├── aiService.js            # OpenAI integration
│   │   └── resumeParser.js         # Resume parsing logic
│   ├── store/
│   │   ├── store.js                # Redux store configuration
│   │   └── interviewSlice.js       # Interview state management
│   ├── App.jsx                     # Main application component
│   ├── main.jsx                    # Application entry point
│   └── index.css                   # Global styles
├── index.html                      # HTML template
├── vite.config.js                  # Vite configuration
├── package.json                    # Dependencies
└── README.md                       # This file
```

## 🎨 Design & Features

### Neo Dark Mode
- Deep space gradient background
- Glassmorphism effects with semi-transparent cards
- Purple/violet accent colors
- Perfect text contrast for readability
- Smooth theme transitions
- All components fully themed

### Analytics Dashboard
- **Real-time calculations** using useMemo for performance
- **Visual indicators** with progress bars and charts
- **Color-coded metrics** for quick understanding
- **Responsive layout** adapting to all screen sizes
- **Business intelligence** for hiring decisions

### User Experience
- **Sample Data Mode**: Test without setup
- **Celebration Confetti**: Rewarding completion animation
- **Dark Mode Toggle**: Eye-friendly theme option
- **Responsive Design**: Works on all devices
- **Professional UI**: Enterprise-level quality

## 🎨 Technical Decisions

### State Management
- **Redux Toolkit**: Chosen for predictable state management with less boilerplate
- **Redux Persist**: Ensures data survives page refreshes and browser closures
- Used `localStorage` for persistence - works across sessions

### AI Integration
- **OpenAI GPT-4 Turbo**: For intelligent question generation and answer evaluation
- Fallback questions included if API is unavailable
- Structured JSON responses for consistent parsing

### Timer Implementation
- Real-time countdown using `setInterval`
- Auto-submission when time expires
- Timer state persisted in Redux for resume capability

### Resume Parsing
- Client-side parsing for privacy and speed
- Regex-based information extraction
- Support for both PDF and DOCX formats

### UI/UX
- **Ant Design**: Professional, accessible components out of the box
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Real-time Feedback**: Progress bars, timers, and status indicators
- **Smooth Animations**: Fade-in effects for messages

## 🔒 Security Considerations

- API keys stored in environment variables (not committed to repo)
- Client-side API calls marked with `dangerouslyAllowBrowser` for demo purposes
- **Production Recommendation**: Move AI calls to backend server
- Resume data never sent to external servers (parsed locally)

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Visit [Vercel](https://vercel.com)
3. Import your repository
4. Add environment variable: `VITE_OPENAI_API_KEY`
5. Deploy!

### Deploy to Netlify

1. Build the project: `npm run build`
2. Deploy the `dist` folder to Netlify
3. Add environment variable in Netlify dashboard
4. Or use Netlify CLI:
```bash
npm install -g netlify-cli
netlify deploy --prod
```

## 📹 Demo Video Guidelines

Create a 2-5 minute video covering:
1. **Opening** - Show the application homepage
2. **Resume Upload** - Upload a sample resume
3. **Information Collection** - Show chatbot collecting missing fields
4. **Interview Process** - Answer a few questions, show timer
5. **Completion** - Show final score and summary
6. **Dashboard** - Switch to Interviewer tab, view candidates
7. **Candidate Details** - Open modal to show detailed view
8. **Persistence** - Refresh page to show data persistence

## 🛠️ Build & Production

```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 🧪 Testing Locally

1. Use sample resume PDFs from online (or create your own)
2. Test with missing information (remove name/email/phone)
3. Test timer expiration by waiting
4. Test session recovery by refreshing mid-interview
5. Test dashboard with multiple candidates

## 📝 Assignment Submission Checklist

- ✅ Resume upload with PDF/DOCX support
- ✅ Extract Name, Email, Phone from resume
- ✅ Chatbot collects missing information
- ✅ AI generates 6 questions (2E, 2M, 2H)
- ✅ Timed questions with auto-submit
- ✅ Interviewee tab with chat interface
- ✅ Interviewer dashboard with candidate list
- ✅ Detailed candidate view with chat history
- ✅ Local data persistence
- ✅ Welcome Back modal for resume
- ✅ Final AI score and summary
- ✅ Responsive, modern UI
- ✅ Error handling
- ✅ README with instructions
- ✅ GitHub repository
- ✅ Live demo deployment
- ✅ Demo video

## 🤝 Contributing

This project was created as part of the Swipe Internship Assignment. Feel free to fork and improve!

## 📄 License

MIT License - feel free to use this project for learning purposes.

## 👨‍💻 Author

Created with ❤️ for the Swipe Internship Program

---

**Note**: Make sure to add your OpenAI API key in the `.env` file before running the application!

## 🐛 Troubleshooting

### Resume parsing not working
- Ensure file is valid PDF or DOCX
- Try a different resume format
- Check browser console for errors

### AI questions not generating
- Verify OpenAI API key is set correctly
- Check API quota/billing status
- Fallback questions will be used if API fails

### Timer not working
- Check browser console for errors
- Ensure Redux state is properly initialized
- Try refreshing the page

### Data not persisting
- Check localStorage in browser DevTools
- Clear cache and try again
- Verify redux-persist is configured correctly

## 🎯 Future Enhancements

- [ ] Video interview recording
- [ ] Multiple interview templates
- [ ] Email notifications
- [ ] Export candidate reports as PDF
- [ ] Integration with ATS systems
- [ ] Voice-to-text for answers
- [ ] Multi-language support
- [ ] Interview analytics and insights
