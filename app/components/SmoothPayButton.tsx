"use client";

import { useState } from 'react';
import { Plan } from '@/lib/plans';
import Notification from './Notification';

interface SmoothPayButtonProps {
  plan: Plan;
  userEmail: string;
  userId: string;
  className?: string;
  text?: string;
}

export default function SmoothPayButton({ 
  plan, 
  userEmail,
  userId, 
  className = "bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors",
  text = "Subscribe Now"
}: SmoothPayButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  const handlePayment = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/smoothpay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan_type: plan.id,
          user_id: userId,
          email: userEmail
        })
      });

      if (response.ok) {
        setNotification({ message: 'Payment successful!', type: 'success' });
        // Small delay to ensure database is updated
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1000);
      } else {
        const error = await response.json();
        setNotification({ message: `Payment failed: ${error.message}`, type: 'error' });
      }
    } catch (error) {
      console.error('Payment error:', error);
      setNotification({ message: 'An unexpected error occurred. Please try again.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={handlePayment}
        disabled={isLoading}
        className={`${className} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isLoading ? 'Processing...' : text}
      </button>
      {notification && (
        <Notification 
          message={notification.message} 
          type={notification.type} 
          onClose={() => setNotification(null)}
        />
      )}
    </>
  );
}