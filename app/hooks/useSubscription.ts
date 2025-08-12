"use client";

import { useState, useEffect } from 'react';

interface SubscriptionStatus {
  active: boolean;
  status: string;
  expires_at: string | null;
  provider: string | null;
  plan_type: string | null;
  amount: number | null;
  currency: string | null;
}

export function useSubscription() {
  const [subscription, setSubscription] = useState<SubscriptionStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscription = async (force = false) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/subscription-status', {
        cache: force ? 'no-cache' : 'default'
      });
      
      if (response.ok) {
        const data = await response.json();
        setSubscription(data);
        setError(null);
      } else {
        setError('Failed to fetch subscription status');
      }
    } catch (err) {
      setError('Network error');
      console.error('Error fetching subscription:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscription();
  }, []);

  const refreshSubscription = () => {
    fetchSubscription(true);
  };

  return {
    subscription,
    isLoading,
    error,
    refreshSubscription,
  };
}