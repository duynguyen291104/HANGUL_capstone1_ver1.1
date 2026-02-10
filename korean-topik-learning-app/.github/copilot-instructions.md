# Korean TOPIK 1 Vocabulary Learning Web App

This is a modern web application for learning Korean TOPIK 1 vocabulary with interactive games, audio pronunciation, and progress tracking.

## Tech Stack
- Next.js 14+ with App Router
- TypeScript
- TailwindCSS + shadcn/ui
- Zustand for state management
- IndexedDB for data storage
- Web Speech API for pronunciation
- PWA support

## Project Structure
```
/app
├── page.tsx (Home)
├── import/
├── library/
├── flashcards/
├── games/
├── progress/
└── settings/
/components
/lib
/hooks
/stores
/utils
/data
```

## Development Guidelines
- Use TypeScript strictly
- Mobile-first responsive design
- Implement proper error boundaries
- Use semantic HTML and ARIA labels
- Follow Next.js best practices
- Optimize for performance with 1000+ vocabulary items

## Completed Tasks
- [x] Create Next.js workspace with TypeScript and TailwindCSS
- [x] Setup project configuration