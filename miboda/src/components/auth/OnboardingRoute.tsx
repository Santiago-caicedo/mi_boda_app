import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useWeddingProfile } from '@/hooks/useWeddingProfile';
import { Skeleton } from '@/components/ui/skeleton';

interface OnboardingRouteProps {
  children: ReactNode;
}

export function OnboardingRoute({ children }: OnboardingRouteProps) {
  const { data: profile, isLoading } = useWeddingProfile();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="space-y-4 w-full max-w-md px-6">
          <Skeleton className="h-8 w-3/4 mx-auto" />
          <Skeleton className="h-4 w-1/2 mx-auto" />
          <Skeleton className="h-32 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  // If no profile exists, redirect to onboarding
  if (!profile) {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
}
