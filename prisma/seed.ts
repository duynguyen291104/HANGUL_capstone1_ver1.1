import { PrismaClient } from '@prisma/client';
import { TOPIK1_VOCABULARY } from '../data/vocabulary';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create a default user (for development)
  const defaultUser = await prisma.user.upsert({
    where: { email: 'demo@topik.local' },
    update: {},
    create: {
      email: 'demo@topik.local',
      name: 'Demo User',
    },
  });

  console.log('✅ Created default user:', defaultUser.email);

  // Create user stats for default user
  const userStats = await prisma.userStats.upsert({
    where: { userId: defaultUser.id },
    update: {},
    create: {
      userId: defaultUser.id,
      totalWordsLearned: 0,
      currentStreak: 0,
      bestStreak: 0,
      totalGamesPlayed: 0,
      averageAccuracy: 0,
      totalTimeSpent: 0,
      level: 1,
      xp: 0,
    },
  });

  console.log('✅ Created user stats');

  // Create default settings
  const settings = await prisma.settings.upsert({
    where: { userId: defaultUser.id },
    update: {},
    create: {
      userId: defaultUser.id,
      audioEnabled: true,
      audioRate: 1.0,
      audioPitch: 1.0,
      audioAutoplay: true,
      theme: 'light',
      fontSize: 'medium',
      showRomanization: true,
      showExamples: true,
      dailyGoal: 20,
      notificationsEnabled: true,
    },
  });

  console.log('✅ Created default settings');

  // Seed vocabulary data
  console.log('📚 Seeding vocabulary data...');
  
  let createdCount = 0;
  const batchSize = 100;
  
  for (let i = 0; i < TOPIK1_VOCABULARY.length; i += batchSize) {
    const batch = TOPIK1_VOCABULARY.slice(i, i + batchSize);
    
    const vocabularyData = batch.map((item, index) => ({
      ko: item.korean,
      vi: item.vietnamese,
      stt: i + index + 1,
      category: item.category || 'general',
      difficulty: item.difficulty.toUpperCase() as 'BEGINNER' | 'ELEMENTARY' | 'INTERMEDIATE',
      tags: item.category ? [item.category] : [],
    }));

    await prisma.vocabulary.createMany({
      data: vocabularyData,
      skipDuplicates: true,
    });

    createdCount += batch.length;
    console.log(`  ✓ Created ${createdCount}/${TOPIK1_VOCABULARY.length} vocabulary items`);
  }

  console.log('✅ Vocabulary seeding completed!');

  // Seed some sample sentences
  console.log('📝 Seeding sample sentences...');

  const sampleSentences = [
    {
      korean: '안녕하세요?',
      vietnamese: 'Xin chào!',
      romanization: 'Annyeonghaseyo?',
      category: 'greeting',
      difficulty: 'BEGINNER' as const,
    },
    {
      korean: '감사합니다.',
      vietnamese: 'Cảm ơn.',
      romanization: 'Gamsahamnida.',
      category: 'greeting',
      difficulty: 'BEGINNER' as const,
    },
    {
      korean: '저는 학생입니다.',
      vietnamese: 'Tôi là học sinh.',
      romanization: 'Jeoneun haksaengimnida.',
      category: 'introduction',
      difficulty: 'BEGINNER' as const,
    },
    {
      korean: '이것은 무엇입니까?',
      vietnamese: 'Đây là cái gì?',
      romanization: 'Igeoseun mueosimnikka?',
      category: 'question',
      difficulty: 'BEGINNER' as const,
    },
    {
      korean: '오늘 날씨가 좋아요.',
      vietnamese: 'Hôm nay thời tiết đẹp.',
      romanization: 'Oneul nalssiga joayo.',
      category: 'weather',
      difficulty: 'BEGINNER' as const,
    },
  ];

  await prisma.sentence.createMany({
    data: sampleSentences,
    skipDuplicates: true,
  });

  console.log('✅ Sample sentences seeding completed!');

  // Create some sample game results
  console.log('🎮 Creating sample game results...');

  const gameTypes = ['FLASHCARDS', 'QUIZ', 'LISTENING', 'TYPING', 'MATCHING', 'SPEED'] as const;
  
  for (const gameType of gameTypes) {
    await prisma.gameResult.create({
      data: {
        userId: defaultUser.id,
        gameType,
        score: Math.floor(Math.random() * 100),
        correctAnswers: Math.floor(Math.random() * 20),
        totalQuestions: 20,
        timeSpent: Math.floor(Math.random() * 300) + 60,
      },
    });
  }

  console.log('✅ Sample game results created!');

  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
