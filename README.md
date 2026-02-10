# Korean TOPIK 1 Vocabulary Learning Web App

A modern, interactive web application for learning Korean TOPIK Level 1 vocabulary with games, flashcards, and progress tracking. Built with Next.js, PostgreSQL, and Prisma.

## ✨ Features

### 📚 Core Functionality
- **Vocabulary Management**: Import, organize, and search through 1,164+ Korean vocabulary words
- **Audio Pronunciation**: Web Speech API integration with Korean TTS
- **Progress Tracking**: Spaced repetition system (SRS) with SM-2 algorithm
- **Data Import**: Support for TSV/CSV files with "STT | Từ vựng | Nghĩa" format
- **Database**: PostgreSQL with Prisma ORM for robust data management

### 🎮 Learning Methods
- **Interactive Flashcards**: Spaced repetition system for efficient memorization
- **Mini Games**: 5 engaging games for vocabulary practice
  - Multiple Choice Quiz
  - Listening Comprehension
  - Typing Practice
  - Matching Pairs
  - Speed Run Challenge
- **Library**: Browse and filter vocabulary by tags, levels, and search terms
- **Analytics**: Track your learning progress, streaks, and game statistics

### 🎨 Modern UI/UX
- **Responsive Design**: Optimized for both desktop and mobile devices
- **Dark/Light Mode**: Theme switching with system preference detection
- **Progressive Web App**: Installable with offline capabilities
- **Accessible**: ARIA labels and keyboard navigation support

### 🚀 DevOps & Infrastructure
- **Docker**: Containerized PostgreSQL database
- **CI/CD**: GitHub Actions workflows for automated testing and deployment
- **Database Migrations**: Version-controlled schema changes with Prisma
- **Health Monitoring**: Built-in health check endpoints
- **Production Ready**: Optimized builds and deployment configurations

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16.1.4 with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: TailwindCSS + shadcn/ui components
- **State Management**: Zustand with persistence
- **Audio**: Web Speech API
- **Icons**: Lucide React
- **Animations**: Framer Motion

### Backend & Database
- **Database**: PostgreSQL 16 (Alpine)
- **ORM**: Prisma 6.x
- **API**: Next.js API Routes
- **Cache**: IndexedDB via Dexie (offline support)
- **Optional**: Redis for caching

### DevOps
- **Container**: Docker & Docker Compose
- **CI/CD**: GitHub Actions
- **Deployment**: Vercel / Docker deployment ready
- **Monitoring**: Health check endpoints

## 🚀 Getting Started

### Quick Start with Setup Script

```bash
# Clone the repository
git clone <repository-url>
cd korean-topik-learning-app

# Run automated setup
./setup.sh
```

The setup script will:
- ✅ Check prerequisites (Node.js, Docker)
- ✅ Install dependencies
- ✅ Start PostgreSQL container
- ✅ Run database migrations
- ✅ Seed 1,164 vocabulary words
- ✅ Start development server

### Manual Setup

#### Prerequisites
- Node.js 20+
- Docker & Docker Compose
- npm or yarn

#### Step-by-Step Installation

**1. Clone and install**
```bash
git clone <repository-url>
cd korean-topik-learning-app
npm install
```

**2. Setup environment**
```bash
cp .env.example .env
# Edit .env if needed
```

**3. Start database**
```bash
npm run docker:up
# Wait for PostgreSQL to be ready (~10 seconds)
```

**4. Run migrations and seed**
```bash
npm run db:migrate
npm run db:seed
```

**5. Start development server**
```bash
npm run dev
```

**6. Open your browser**
Navigate to `http://localhost:3000`

### Database Management

**Prisma Studio** (Database GUI)
```bash
npm run db:studio
# Opens at http://localhost:5555
```

**pgAdmin** (Optional, advanced)
```bash
docker-compose --profile dev up -d
# Opens at http://localhost:5050
# Email: admin@topik.local
# Password: admin123
```

### Sample Data

The application includes **1,164 TOPIK Level 1 vocabulary words**:
- Basic greetings (안녕하세요, 감사합니다)
- Family terms (아버지, 어머니, 가족)
- Common verbs (가다, 오다, 먹다, 마시다)
- Question words (어디, 언제, 무엇, 누구)
- Adjectives (크다, 작다, 좋다, 나쁘다)

Use the "Load Sample Data" button on the Import page to quickly populate your vocabulary.

## 📁 Project Structure

```
/app                    # Next.js App Router
├── api/                # API Routes (NEW!)
│   ├── health/         # Health check endpoint
│   ├── vocabulary/     # Vocabulary CRUD operations
│   ├── progress/       # Learning progress tracking
│   ├── stats/          # User statistics
│   └── games/          # Game results
├── page.tsx            # Home dashboard
├── import/             # Data import functionality
├── library/            # Vocabulary browser
├── flashcards/         # Spaced repetition system
├── games/              # Interactive learning games
├── progress/           # Statistics and achievements
├── settings/           # User preferences
└── write/              # Handwriting practice

/components             # Reusable UI components
├── ui/                 # shadcn/ui components
├── Navigation.tsx      # App navigation
├── VocabCard.tsx       # Vocabulary card component
├── AudioPlayer.tsx     # Audio playback
└── HandwritingPad.tsx  # Handwriting canvas

/lib                    # Core utilities
├── types.ts            # TypeScript interfaces
├── database.ts         # IndexedDB wrapper (offline)
├── prisma.ts           # Prisma client (NEW!)
├── srs.ts              # Spaced repetition algorithm
└── utils.ts            # Helper functions

/prisma                 # Database (NEW!)
├── schema.prisma       # Database schema
├── seed.ts             # Seed script
└── migrations/         # Migration history

/stores                 # Zustand state management
├── vocabulary.ts       # Vocabulary data store
├── progress.ts         # Learning progress store
└── settings.ts         # User settings store

/utils                  # Specialized utilities
├── speech.ts           # Web Speech API wrapper
├── romanization.ts     # Korean romanization
├── spaced-repetition.ts # SM-2 algorithm
└── import-parser.ts    # Data parsing utilities

/data                   # Static data
└── vocabulary.ts       # 1,164 TOPIK vocabulary

/.github/workflows      # CI/CD (NEW!)
├── ci-cd.yml           # Main CI/CD pipeline
├── database-migration.yml # Database migrations
└── deploy.yml          # Production deployment

/docker                 # Docker configuration (NEW!)
└── init-db.sql         # Database initialization

docker-compose.yml      # PostgreSQL setup
Dockerfile              # Production container
setup.sh                # Automated setup script
DEPLOYMENT.md           # Deployment guide
```

## 🗄️ Database Schema

### Models
- **User**: User accounts and profiles
- **Vocabulary**: 1,164+ Korean vocabulary items
- **VocabProgress**: SRS progress tracking (SM-2 algorithm)
- **GameResult**: Game performance history
- **UserStats**: Learning statistics and achievements
- **Settings**: User preferences
- **Sentence**: Example sentences

See [prisma/schema.prisma](./prisma/schema.prisma) for details.

## 🔌 API Endpoints

### Health Check
```
GET /api/health
```

### Vocabulary
```
GET    /api/vocabulary          # List with pagination
GET    /api/vocabulary/:id      # Get details
POST   /api/vocabulary          # Add new word
PUT    /api/vocabulary/:id      # Update word
DELETE /api/vocabulary/:id      # Delete word
```

### Progress
```
GET  /api/progress              # Get learning progress
POST /api/progress              # Update progress (SRS)
```

### Statistics
```
GET /api/stats                  # Get user stats
PUT /api/stats                  # Update stats
```

### Games
```
GET  /api/games                 # Get game history
POST /api/games                 # Save game result
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed API documentation.

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
- **Korean (ko)**: Korean vocabulary word/phrase
- **Vietnamese (vi)**: Vietnamese translation
- **Category**: Word category (장소, 음식, 가족, etc.)
- **Difficulty**: BEGINNER, ELEMENTARY, INTERMEDIATE
- **Tags**: Categories array
- **Pronunciation**: Romanized pronunciation (optional)

## 🎯 Learning Features

### Spaced Repetition System (SRS)
- **SM-2 Algorithm**: Proven spaced repetition method
- **Adaptive Scheduling**: Reviews based on your performance
- **Ease Factor**: Adjusts difficulty based on accuracy
- **Interval Days**: Optimized review timing
- **Statistics**: Track correct/wrong answers

### Audio Pronunciation
- Native Korean text-to-speech via Web Speech API
- Adjustable playback speed and pitch
- Repeat functionality for practice
- Auto-play option in settings

## 📜 Available Scripts

### Development
```bash
npm run dev         # Start development server
npm run build       # Build for production
npm run start       # Start production server
npm run lint        # Run ESLint
```

### Database
```bash
npm run db:generate      # Generate Prisma Client
npm run db:push          # Push schema changes (dev)
npm run db:migrate       # Create migration
npm run db:migrate:prod  # Deploy migrations (prod)
npm run db:seed          # Seed database
npm run db:studio        # Open Prisma Studio
npm run db:reset         # Reset database
```

### Docker
```bash
npm run docker:up        # Start containers
npm run docker:down      # Stop containers
npm run docker:logs      # View logs
```

## 🚢 Deployment

### Using Docker

**1. Build image**
```bash
docker build -t topik-learning-app .
```

**2. Run container**
```bash
docker run -p 3000:3000 \
  -e DATABASE_URL="your_database_url" \
  topik-learning-app
```

### Using Docker Compose

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Configure environment variables:
   - `DATABASE_URL`
   - `NEXT_PUBLIC_APP_URL`
3. Deploy automatically on push to main

### GitHub Actions CI/CD

The project includes automated workflows:

**CI/CD Pipeline** (`.github/workflows/ci-cd.yml`)
- ✅ Lint and code quality checks
- ✅ Build with database tests
- ✅ Migration validation
- ✅ Security scanning
- ✅ Docker image building

**Database Migration** (`.github/workflows/database-migration.yml`)
- Manual workflow for database operations
- Support for dev/staging/production environments

**Production Deploy** (`.github/workflows/deploy.yml`)
- Auto-deploy on push to main
- Supports Vercel and Docker deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## 📚 Documentation

- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Complete deployment and setup guide
- **[SETUP_COMPLETE.md](./SETUP_COMPLETE.md)** - Setup completion summary
- **[prisma/schema.prisma](./prisma/schema.prisma)** - Database schema
- **[.github/workflows/](. /.github/workflows/)** - CI/CD workflows

## 🧪 Testing

### Health Check
```bash
curl http://localhost:3000/api/health
```

### Test API Endpoints
```bash
# Get vocabulary
curl http://localhost:3000/api/vocabulary

# Get stats
curl http://localhost:3000/api/stats

# Get health
curl http://localhost:3000/api/health
```

### Database Testing
```bash
# Test connection
npx prisma db pull

# Validate schema
npx prisma validate

# View data
npm run db:studio
```

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
