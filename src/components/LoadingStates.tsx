// Loading States and Skeleton Components

import React from 'react';
import { Loader2 } from 'lucide-react';

// Generic loading spinner
export function LoadingSpinner({ size = 24, className = '' }: { size?: number; className?: string }) {
  return (
    <Loader2 
      size={size} 
      className={`animate-spin text-blue-500 ${className}`} 
    />
  );
}

// Full page loading
export function PageLoading({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size={48} className="mb-4" />
        <p className="text-dark-muted">{message}</p>
      </div>
    </div>
  );
}

// Card loading skeleton
export function CardSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-dark-card border border-dark-border rounded-lg p-6 animate-pulse ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="h-4 bg-dark-border rounded w-1/3"></div>
        <div className="h-4 bg-dark-border rounded w-16"></div>
      </div>
      <div className="space-y-3">
        <div className="h-3 bg-dark-border rounded w-full"></div>
        <div className="h-3 bg-dark-border rounded w-2/3"></div>
        <div className="h-3 bg-dark-border rounded w-1/2"></div>
      </div>
      <div className="mt-4 pt-4 border-t border-dark-border">
        <div className="h-8 bg-dark-border rounded w-24"></div>
      </div>
    </div>
  );
}

// Pool card skeleton
export function PoolCardSkeleton() {
  return (
    <div className="bg-dark-card border border-dark-border rounded-lg p-6 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-dark-border rounded-full"></div>
          <div>
            <div className="h-4 bg-dark-border rounded w-20 mb-1"></div>
            <div className="h-3 bg-dark-border rounded w-16"></div>
          </div>
        </div>
        <div className="h-6 bg-dark-border rounded w-16"></div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div className="h-3 bg-dark-border rounded w-12 mb-1"></div>
          <div className="h-4 bg-dark-border rounded w-20"></div>
        </div>
        <div>
          <div className="h-3 bg-dark-border rounded w-16 mb-1"></div>
          <div className="h-4 bg-dark-border rounded w-24"></div>
        </div>
      </div>
      
      <div className="h-8 bg-dark-border rounded w-full"></div>
    </div>
  );
}

// Transaction row skeleton
export function TransactionSkeleton() {
  return (
    <div className="flex items-center justify-between p-4 border-b border-dark-border animate-pulse">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-dark-border rounded-full"></div>
        <div>
          <div className="h-4 bg-dark-border rounded w-24 mb-1"></div>
          <div className="h-3 bg-dark-border rounded w-32"></div>
        </div>
      </div>
      <div className="text-right">
        <div className="h-4 bg-dark-border rounded w-16 mb-1"></div>
        <div className="h-3 bg-dark-border rounded w-12"></div>
      </div>
    </div>
  );
}

// Dashboard skeleton
export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="h-8 bg-dark-border rounded w-32 mb-2"></div>
          <div className="h-4 bg-dark-border rounded w-64"></div>
        </div>
        <div className="mt-4 sm:mt-0">
          <div className="h-4 bg-dark-border rounded w-24 mb-1"></div>
          <div className="h-6 bg-dark-border rounded w-32"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          {/* Portfolio overview skeleton */}
          <CardSkeleton />
          
          {/* Pools grid skeleton */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="h-6 bg-dark-border rounded w-40"></div>
              <div className="h-4 bg-dark-border rounded w-20"></div>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <PoolCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Chart skeleton */}
          <CardSkeleton />
          
          {/* Transactions skeleton */}
          <div className="bg-dark-card border border-dark-border rounded-lg">
            <div className="p-4 border-b border-dark-border">
              <div className="h-5 bg-dark-border rounded w-32"></div>
            </div>
            <div>
              {Array.from({ length: 3 }).map((_, i) => (
                <TransactionSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Button loading state
export function LoadingButton({ 
  loading, 
  children, 
  className = '',
  ...props 
}: { 
  loading: boolean; 
  children: React.ReactNode; 
  className?: string;
  [key: string]: any;
}) {
  return (
    <button 
      className={`relative ${className}`} 
      disabled={loading}
      {...props}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <LoadingSpinner size={16} />
        </div>
      )}
      <span className={loading ? 'opacity-0' : 'opacity-100'}>
        {children}
      </span>
    </button>
  );
}

// Progress bar
export function ProgressBar({ 
  progress, 
  className = '',
  showPercentage = false 
}: { 
  progress: number; 
  className?: string;
  showPercentage?: boolean;
}) {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);
  
  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between items-center mb-1">
        {showPercentage && (
          <span className="text-sm text-dark-muted">{clampedProgress.toFixed(0)}%</span>
        )}
      </div>
      <div className="w-full bg-dark-border rounded-full h-2">
        <div 
          className="bg-blue-500 h-2 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
    </div>
  );
}

// Inline loading
export function InlineLoading({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="flex items-center space-x-2 text-dark-muted">
      <LoadingSpinner size={16} />
      <span className="text-sm">{message}</span>
    </div>
  );
}

// Table loading
export function TableLoading({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="animate-pulse">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex space-x-4 p-4 border-b border-dark-border">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div 
              key={colIndex} 
              className={`h-4 bg-dark-border rounded ${
                colIndex === 0 ? 'w-1/4' : 
                colIndex === columns - 1 ? 'w-1/6' : 'w-1/3'
              }`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
