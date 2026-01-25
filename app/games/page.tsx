'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Gamepad2, Volume2, Target, Clock, Zap, CheckCircle } from 'lucide-react';
import Link from 'next/link';

const games = [
  {
    id: 'quiz',
    title: 'Trắc nghiệm',
    description: 'Chọn nghĩa đúng cho từ tiếng Hàn',
    icon: Target,
    color: 'from-blue-500 to-purple-600',
    available: true,
  },
  {
    id: 'listening',
    title: 'Nghe hiểu',
    description: 'Nghe và chọn từ tiếng Hàn tương ứng',
    icon: Volume2,
    color: 'from-green-500 to-teal-600',
    available: false,
  },
  {
    id: 'typing',
    title: 'Đánh máy',
    description: 'Gõ từ tiếng Hàn theo nghĩa tiếng Việt',
    icon: Gamepad2,
    color: 'from-orange-500 to-red-600',
    available: false,
  },
  {
    id: 'matching',
    title: 'Ghép đôi',
    description: 'Ghép từ tiếng Hàn với nghĩa tiếng Việt',
    icon: CheckCircle,
    color: 'from-pink-500 to-rose-600',
    available: false,
  },
  {
    id: 'speed',
    title: 'Tốc độ',
    description: 'Trả lời nhanh để ghi điểm cao',
    icon: Zap,
    color: 'from-yellow-500 to-orange-600',
    available: false,
  },
];

export default function GamesPage() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-primary mb-4">
          🎮 Trò chơi học từ vựng
        </h1>
        <p className="text-muted-foreground">
          Học từ vựng tiếng Hàn qua các mini game thú vị
        </p>
      </div>

      {/* Game Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game) => {
          const IconComponent = game.icon;
          
          return (
            <Card key={game.id} className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
              <div className={`absolute inset-0 bg-gradient-to-br ${game.color} opacity-10 group-hover:opacity-20 transition-opacity`} />
              
              <CardHeader className="relative">
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${game.color} flex items-center justify-center mb-4`}>
                  <IconComponent className="h-8 w-8 text-white" />
                </div>
                
                <CardTitle className="text-xl">{game.title}</CardTitle>
                <p className="text-sm text-muted-foreground">{game.description}</p>
              </CardHeader>
              
              <CardContent className="relative">
                {game.available ? (
                  <Link href={`/games/${game.id}`}>
                    <Button className="w-full">
                      Chơi ngay
                    </Button>
                  </Link>
                ) : (
                  <Button disabled className="w-full">
                    Sắp ra mắt
                  </Button>
                )}
                
                {game.available && (
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Điểm cao nhất</span>
                      <span className="font-semibold">0</span>
                    </div>
                    <Progress value={0} className="h-2" />
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Stats */}
      <div className="mt-12">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Thống kê game
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">0</div>
                <div className="text-sm text-muted-foreground">Game đã chơi</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">0</div>
                <div className="text-sm text-muted-foreground">Điểm tổng</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">0%</div>
                <div className="text-sm text-muted-foreground">Tỷ lệ đúng</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">0</div>
                <div className="text-sm text-muted-foreground">Chuỗi thắng</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}