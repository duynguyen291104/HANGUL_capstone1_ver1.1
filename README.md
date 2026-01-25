# Korean TOPIK 1 Vocabulary Learning Web App

A modern, interactive web application for learning Korean TOPIK Level 1 vocabulary with games, flashcards, and progress tracking.

## ✨ Features

### 📚 Core Functionality
- **Vocabulary Management**: Import, organize, and search through Korean vocabulary
- **Audio Pronunciation**: Web Speech API integration with Korean TTS
- **Progress Tracking**: Track learning progress with spaced repetition algorithms
- **Data Import**: Support for TSV/CSV files with "STT | Từ vựng | Nghĩa" format

### 🎮 Learning Methods
- **Interactive Flashcards**: Spaced repetition system for efficient memorization
- **Mini Games**: 5 engaging games for vocabulary practice
  - Multiple Choice Quiz
  - Listening Comprehension
  - Typing Practice
  - Matching Pairs
  - Speed Run Challenge
- **Library**: Browse and filter vocabulary by tags, levels, and search terms

### 🎨 Modern UI/UX
- **Responsive Design**: Optimized for both desktop and mobile devices
- **Dark/Light Mode**: Theme switching with system preference detection
- **Progressive Web App**: Installable with offline capabilities
- **Accessible**: ARIA labels and keyboard navigation support

## 🛠️ Tech Stack

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: TailwindCSS + shadcn/ui components
- **State Management**: Zustand with persistence
- **Database**: IndexedDB via Dexie
- **Audio**: Web Speech API
- **Icons**: Lucide React
- **Deployment**: Vercel-ready configuration

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd topik_learn
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

4. **Open your browser**
Navigate to `http://localhost:3000`

### Sample Data

The application includes 50 sample Korean vocabulary words to get you started immediately:
- Basic greetings (안녕하세요, 감사합니다)
- Family terms (아버지, 어머니, 가족)
- Common verbs (가다, 오다, 먹다, 마시다)
- Question words (어디, 언제, 무엇, 누구)
- Adjectives (크다, 작다, 좋다, 나쁘다)

Use the "Load Sample Data" button on the Import page to quickly populate your vocabulary.

## 📁 Project Structure

```
/app                 # Next.js App Router pages
├── page.tsx         # Home dashboard
├── import/          # Data import functionality
├── library/         # Vocabulary browser
├── flashcards/      # Spaced repetition system
├── games/           # Interactive learning games
├── progress/        # Statistics and achievements
└── settings/        # User preferences

/components          # Reusable UI components
├── ui/              # shadcn/ui components
└── Navigation.tsx   # App navigation

/lib                 # Core utilities and types
├── types.ts         # TypeScript interfaces
├── database.ts      # IndexedDB wrapper
└── utils.ts         # Helper functions

/stores              # Zustand state management
├── vocabulary.ts    # Vocabulary data store
├── progress.ts      # Learning progress store
└── settings.ts      # User settings store

/utils               # Specialized utilities
├── speech.ts        # Web Speech API wrapper
├── romanization.ts  # Korean romanization
├── spaced-repetition.ts # SM-2 algorithm
└── import-parser.ts # Data parsing utilities

/data                # Static data and samples
└── sample-vocab.ts  # Sample vocabulary data
```

## 📊 Data Format

### Import Format
The application accepts vocabulary data in TSV (Tab-Separated Values) format:

```
STT	Từ vựng	Nghĩa
1	안녕하세요	Hello (formal)
2	감사합니다	Thank you
3	죄송합니다	I'm sorry
```

### Supported File Types
- `.tsv` files (recommended)
- `.csv` files with tab or comma separation
- Copy/paste from Excel or Google Sheets

### Data Structure
Each vocabulary entry includes:
- **STT**: Sequential number
- **Korean**: Korean vocabulary word/phrase
- **Meaning**: English translation
- **Level**: TOPIK level (1-6)
- **Tags**: Categories (greeting, verb, noun, etc.)
- **Pronunciation**: Romanized pronunciation (auto-generated)

## 🎯 Learning Features

### Spaced Repetition System
- Based on the proven SM-2 algorithm
- Adaptive scheduling based on your performance
- Optimal review intervals for long-term retention

### Audio Pronunciation
- Native Korean text-to-speech
- Adjustable playback speed
- Repeat functionality for practice

### Progress Tracking
- Overall learning statistics
- Performance metrics per category
- Achievement system with milestones

## 🌐 Deployment

### Deploy to Vercel
1. **Connect to Vercel**
```bash
npx vercel
```

2. **Configure environment** (if needed)
```bash
# No environment variables required for basic functionality
```

3. **Deploy**
```bash
vercel --prod
```

### Build for Production
```bash
npm run build
npm start
```

## 📱 PWA Features

The app includes Progressive Web App capabilities:
- **Offline functionality**: Core features work without internet
- **Install prompt**: Add to home screen on mobile devices
- **Background sync**: Sync progress when connection returns

## 🔧 Configuration

### Settings Available
- **Theme**: Light/Dark/System preference
- **Language**: Korean TTS voice selection
- **Audio**: Playback speed and volume
- **Learning**: Spaced repetition intervals
- **Data**: Export/import user progress

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

- **Issues**: Report bugs and feature requests via GitHub Issues
- **Documentation**: Check the `/docs` folder for detailed guides

## 🔄 Version History

### v1.0.0 (Current)
- ✅ Complete Next.js setup with TypeScript
- ✅ Vocabulary import and management system
- ✅ Audio pronunciation with Web Speech API
- ✅ Responsive UI with dark/light mode
- ✅ IndexedDB data storage
- ✅ Sample vocabulary data (50 words)
- 🔄 Flashcards system (in progress)
- 🔄 Learning games (in progress)
- 🔄 PWA implementation (planned)

---

**Happy Learning! 🇰🇷 화이팅!**
