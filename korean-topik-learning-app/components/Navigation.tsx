'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  BookOpen, 
  CreditCard, 
  Gamepad2, 
  BarChart3, 
  Settings, 
  Upload 
} from 'lucide-react';
import { cn } from '../lib/utils';

const navigation = [
  { name: 'Trang chủ', href: '/', icon: Home },
  { name: 'Thư viện', href: '/library', icon: BookOpen },
  { name: 'Thẻ ghi nhớ', href: '/flashcards', icon: CreditCard },
  { name: 'Trò chơi', href: '/games', icon: Gamepad2 },
  { name: 'Tiến độ', href: '/progress', icon: BarChart3 },
  { name: 'Import', href: '/import', icon: Upload },
  { name: 'Cài đặt', href: '/settings', icon: Settings },
];

interface NavigationProps {
  className?: string;
}

export function Navigation({ className = "" }: NavigationProps) {
  const pathname = usePathname();

  return (
    <nav className={cn("space-y-1", className)}>
      {navigation.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            )}
          >
            <item.icon className="mr-3 h-5 w-5" />
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}

interface MobileNavigationProps {
  className?: string;
}

export function MobileNavigation({ className = "" }: MobileNavigationProps) {
  const pathname = usePathname();

  return (
    <div className={cn(
      "fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50",
      className
    )}>
      <div className="grid grid-cols-4 gap-1 p-2">
        {navigation.slice(0, 4).map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center px-2 py-2 text-xs font-medium rounded-md transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              <item.icon className="h-5 w-5 mb-1" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}