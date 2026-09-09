import React from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export function GlassCard({ children, className, hoverEffect = true, ...props }: GlassCardProps) {
  return (
    <div
      className={cn(
        hoverEffect ? 'glass-card' : 'glass-panel',
        'p-6 text-foreground relative overflow-hidden',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

