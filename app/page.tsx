'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { 
  BookOpen, 
  CreditCard, 
  Gamepad2, 
  BarChart3, 
  Upload, 
  Trophy,
  Target,
  Clock,
  Flame
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { useVocabularyStore } from '../stores/vocabulary';
import { useProgressStoreNew } from '@/stores/progress-new';

export default function HomePage() {
  const { 
    vocabulary, 
    isLoading: vocabLoading, 
    loadVocabulary, 
    getVocabularyCount 
  } = useVocabularyStore();
  
  const { 
    xp, 
    level, 
    streak, 
    getTodayStats, 
    getDueWords,
    totalWordsStudied 
  } = useProgressStoreNew();

  useEffect(() => {
    loadVocabulary();
  }, [loadVocabulary]);

  const totalWords = getVocabularyCount();
  const vocabIds = vocabulary.map(v => v.id);
  const dueWords = getDueWords(vocabIds).length;
  const todayStats = getTodayStats();

  // Calculate progress to next level
  const currentLevelXP = Math.pow(level - 1, 2) * 50;
  const nextLevelXP = Math.pow(level, 2) * 50;
  const progressToNextLevel = ((xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;

  const quickActions = [
    {
      title: 'Thư viện từ vựng',
      description: `${totalWords} từ vựng có sẵn`,
      icon: BookOpen,
      href: '/library',
      color: 'bg-blue-500',
    },
    {
      title: 'Thẻ ghi nhớ',
      description: `${dueWords} từ cần ôn tập`,
      icon: CreditCard,
      href: '/flashcards',
      color: 'bg-green-500',
    },
    {
      title: 'Trò chơi',
      description: 'Học qua trò chơi vui nhộn',
      icon: Gamepad2,
      href: '/games',
      color: 'bg-purple-500',
    },
    {
      title: 'Import dữ liệu',
      description: 'Thêm từ vựng mới',
      icon: Upload,
      href: '/import',
      color: 'bg-orange-500',
    },
  ];

  if (vocabLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Học từ vựng TOPIK 1
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Học tiếng Hàn hiệu quả với trò chơi tương tác, phát âm chính xác và hệ thống lặp lại có khoảng cách
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Trophy className="h-8 w-8 text-yellow-500" />
              <div>
                <div className="text-2xl font-bold">{level}</div>
                <p className="text-sm text-muted-foreground">Cấp độ</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Flame className="h-8 w-8 text-orange-500" />
              <div>
                <div className="text-2xl font-bold">{streak}</div>
                <p className="text-sm text-muted-foreground">Ngày liên tục</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Target className="h-8 w-8 text-green-500" />
              <div>
                <div className="text-2xl font-bold">{todayStats.correct}/{todayStats.correct + todayStats.wrong}</div>
                <p className="text-sm text-muted-foreground">Hôm nay</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-8 w-8 text-blue-500" />
              <div>
                <div className="text-2xl font-bold">{dueWords}</div>
                <p className="text-sm text-muted-foreground">Cần ôn tập</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Bắt đầu học</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quickActions.map((action, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
              <Link href={action.href}>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-lg ${action.color} text-white`}>
                      <action.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{action.title}</h3>
                      <p className="text-muted-foreground">{action.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {totalWords === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Chưa có từ vựng nào</h3>
            <p className="text-muted-foreground mb-6">
              Hãy import dữ liệu từ vựng để bắt đầu hành trình học tiếng Hàn của bạn
            </p>
            <Button asChild>
              <Link href="/import">Import từ vựng ngay</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
