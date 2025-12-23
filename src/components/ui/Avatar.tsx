'use client';

import React from 'react';
import { cn, getInitials } from '@/lib/utils';

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  src?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Avatar({ name, src, size = 'md', className, ...props }: AvatarProps) {
  const sizes = {
    sm: 'avatar-sm',
    md: '',
    lg: 'avatar-lg',
  };

  if (src) {
    return (
      <div
        className={cn('avatar overflow-hidden', sizes[size], className)}
        {...props}
      >
        <img src={src} alt={name} className="w-full h-full object-cover" />
      </div>
    );
  }

  return (
    <div className={cn('avatar', sizes[size], className)} {...props}>
      {getInitials(name)}
    </div>
  );
}

interface AvatarGroupProps {
  users: { name: string; src?: string }[];
  max?: number;
  size?: 'sm' | 'md' | 'lg';
}

export function AvatarGroup({ users, max = 4, size = 'sm' }: AvatarGroupProps) {
  const visibleUsers = users.slice(0, max);
  const remainingCount = users.length - max;

  return (
    <div className="flex -space-x-2">
      {visibleUsers.map((user, index) => (
        <Avatar
          key={index}
          name={user.name}
          src={user.src}
          size={size}
          className="ring-2 ring-white"
        />
      ))}
      {remainingCount > 0 && (
        <div
          className={cn(
            'avatar ring-2 ring-white bg-zinc-200 text-zinc-600',
            size === 'sm' && 'avatar-sm',
            size === 'lg' && 'avatar-lg'
          )}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  );
}
