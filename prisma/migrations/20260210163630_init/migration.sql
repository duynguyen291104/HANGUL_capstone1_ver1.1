-- CreateEnum
CREATE TYPE "DifficultyLevel" AS ENUM ('BEGINNER', 'ELEMENTARY', 'INTERMEDIATE', 'ADVANCED');

-- CreateEnum
CREATE TYPE "GameType" AS ENUM ('FLASHCARDS', 'QUIZ', 'LISTENING', 'TYPING', 'MATCHING', 'SPEED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vocabulary" (
    "id" TEXT NOT NULL,
    "stt" INTEGER,
    "ko" TEXT NOT NULL,
    "vi" TEXT NOT NULL,
    "pronunciation" TEXT,
    "tags" TEXT[],
    "category" TEXT,
    "difficulty" "DifficultyLevel" NOT NULL DEFAULT 'BEGINNER',
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT,

    CONSTRAINT "vocabulary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vocab_progress" (
    "id" TEXT NOT NULL,
    "vocabId" TEXT NOT NULL,
    "userId" TEXT,
    "easeFactor" DOUBLE PRECISION NOT NULL DEFAULT 2.5,
    "intervalDays" INTEGER NOT NULL DEFAULT 0,
    "repetitions" INTEGER NOT NULL DEFAULT 0,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "correctAnswers" INTEGER NOT NULL DEFAULT 0,
    "wrongAnswers" INTEGER NOT NULL DEFAULT 0,
    "lastStudied" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vocab_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "game_results" (
    "id" SERIAL NOT NULL,
    "gameType" "GameType" NOT NULL,
    "score" INTEGER NOT NULL,
    "correctAnswers" INTEGER NOT NULL,
    "totalQuestions" INTEGER NOT NULL,
    "timeSpent" INTEGER NOT NULL,
    "playedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT,

    CONSTRAINT "game_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_stats" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "totalWordsLearned" INTEGER NOT NULL DEFAULT 0,
    "currentStreak" INTEGER NOT NULL DEFAULT 0,
    "bestStreak" INTEGER NOT NULL DEFAULT 0,
    "lastStudyDate" TIMESTAMP(3),
    "totalGamesPlayed" INTEGER NOT NULL DEFAULT 0,
    "averageAccuracy" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalTimeSpent" INTEGER NOT NULL DEFAULT 0,
    "level" INTEGER NOT NULL DEFAULT 1,
    "xp" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_stats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "settings" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "audioEnabled" BOOLEAN NOT NULL DEFAULT true,
    "audioVoice" TEXT,
    "audioRate" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "audioPitch" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "audioAutoplay" BOOLEAN NOT NULL DEFAULT true,
    "theme" TEXT NOT NULL DEFAULT 'light',
    "fontSize" TEXT NOT NULL DEFAULT 'medium',
    "showRomanization" BOOLEAN NOT NULL DEFAULT true,
    "showExamples" BOOLEAN NOT NULL DEFAULT true,
    "dailyGoal" INTEGER NOT NULL DEFAULT 20,
    "notificationsEnabled" BOOLEAN NOT NULL DEFAULT true,
    "reminderTime" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sentences" (
    "id" TEXT NOT NULL,
    "korean" TEXT NOT NULL,
    "vietnamese" TEXT NOT NULL,
    "romanization" TEXT,
    "vocabIds" TEXT[],
    "category" TEXT,
    "difficulty" "DifficultyLevel" NOT NULL DEFAULT 'BEGINNER',
    "audioUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sentences_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "vocabulary_ko_idx" ON "vocabulary"("ko");

-- CreateIndex
CREATE INDEX "vocabulary_category_idx" ON "vocabulary"("category");

-- CreateIndex
CREATE INDEX "vocabulary_difficulty_idx" ON "vocabulary"("difficulty");

-- CreateIndex
CREATE INDEX "vocabulary_userId_idx" ON "vocabulary"("userId");

-- CreateIndex
CREATE INDEX "vocab_progress_dueDate_idx" ON "vocab_progress"("dueDate");

-- CreateIndex
CREATE INDEX "vocab_progress_userId_idx" ON "vocab_progress"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "vocab_progress_vocabId_userId_key" ON "vocab_progress"("vocabId", "userId");

-- CreateIndex
CREATE INDEX "game_results_gameType_idx" ON "game_results"("gameType");

-- CreateIndex
CREATE INDEX "game_results_playedAt_idx" ON "game_results"("playedAt");

-- CreateIndex
CREATE INDEX "game_results_userId_idx" ON "game_results"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "user_stats_userId_key" ON "user_stats"("userId");

-- CreateIndex
CREATE INDEX "user_stats_level_idx" ON "user_stats"("level");

-- CreateIndex
CREATE INDEX "user_stats_xp_idx" ON "user_stats"("xp");

-- CreateIndex
CREATE UNIQUE INDEX "settings_userId_key" ON "settings"("userId");

-- CreateIndex
CREATE INDEX "sentences_category_idx" ON "sentences"("category");

-- CreateIndex
CREATE INDEX "sentences_difficulty_idx" ON "sentences"("difficulty");

-- AddForeignKey
ALTER TABLE "vocabulary" ADD CONSTRAINT "vocabulary_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vocab_progress" ADD CONSTRAINT "vocab_progress_vocabId_fkey" FOREIGN KEY ("vocabId") REFERENCES "vocabulary"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vocab_progress" ADD CONSTRAINT "vocab_progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game_results" ADD CONSTRAINT "game_results_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_stats" ADD CONSTRAINT "user_stats_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
