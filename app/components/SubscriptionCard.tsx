"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Notification from "./Notification";

interface SubscriptionStatus {
  active: boolean;
  status: string;
  expires_at: string | null;
  provider: string | null;
  plan_type: string | null;
  amount: number | null;
  currency: string | null;
}

interface SubscriptionCardProps {
  subscription: SubscriptionStatus | null;
  onRefresh?: () => void;
}

export default function SubscriptionCard({ subscription, onRefresh }: SubscriptionCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'GHS',
    }).format(amount); 
  };

  const getDaysUntilExpiry = (expiresAt: string) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleCancelSubscription = async () => {
    if (!confirm('Are you sure you want to cancel your subscription? You will continue to have access until the end of your current billing period.')) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/subscription/manage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'cancel' }),
      });

      if (response.ok) {
        setNotification({ message: 'Subscription canceled successfully.', type: 'success' });
        if (onRefresh) {
          onRefresh();
        } else {
          window.location.reload();
        }
      } else {
        const error = await response.json();
        setNotification({ message: `Failed to cancel subscription: ${error.message}`, type: 'error' });
      }
    } catch (error) {
      console.error('Error canceling subscription:', error);
      setNotification({ message: 'An unexpected error occurred. Please try again later.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  if (!subscription || !subscription.active) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Subscription Status
        </h2>
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Subscription</h3>
          <p className="text-gray-600 mb-6">Subscribe to get personalized newsletters delivered to your inbox</p>
          <Link
            href="/subscribe"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Subscribe Now
          </Link>
        </div>
      </div>
    );
  }

  const daysUntilExpiry = subscription.expires_at ? getDaysUntilExpiry(subscription.expires_at) : null;
  const isExpiringSoon = daysUntilExpiry !== null && daysUntilExpiry <= 7;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">
        Subscription Status
      </h2>
      
      <div className="space-y-4">
        {/* Status Badge */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
            <span className="font-medium text-green-700">Active</span>
          </div>
          {isExpiringSoon && (
            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
              Expires Soon
            </span>
          )}
        </div>

        {/* Provider */}
        {subscription.provider && (
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-sm font-medium text-gray-900">Provider</span>
            <span className="text-sm text-gray-600 capitalize flex items-center">
              {subscription.provider === 'smoothpay' && (
                <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              )}
              {subscription.provider === 'smoothpay' ? 'SmoothPay' : subscription.provider}
            </span>
          </div>
        )}

        {/* Plan Type */}
        {subscription.plan_type && (
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-sm font-medium text-gray-900">Plan</span>
            <span className="text-sm text-gray-600 capitalize">{subscription.plan_type}</span>
          </div>
        )}

        {/* Amount */}
        {subscription.amount && subscription.currency && (
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-sm font-medium text-gray-900">Amount</span>
            <span className="text-sm text-gray-600">
              {formatCurrency(subscription.amount, subscription.currency)}
            </span>
          </div>
        )}

        {/* Expiry Date */}
        {subscription.expires_at && (
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-sm font-medium text-gray-900">Expires</span>
            <div className="text-right">
              <div className="text-sm text-gray-600">
                {new Date(subscription.expires_at).toLocaleDateString()}
              </div>
              {daysUntilExpiry !== null && (
                <div className={`text-xs ${isExpiringSoon ? 'text-yellow-600' : 'text-gray-500'}`}>
                  {daysUntilExpiry > 0 ? `${daysUntilExpiry} days left` : 'Expired'}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Renewal Notice */}
        {isExpiringSoon && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <div className="flex">
              <svg className="w-5 h-5 text-yellow-400 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div>
                <h4 className="text-sm font-medium text-yellow-800">Subscription Expiring Soon</h4>
                <p className="text-sm text-yellow-700 mt-1">
                  Your subscription will expire in {daysUntilExpiry} day{daysUntilExpiry !== 1 ? 's' : ''}. 
                  Renew now to continue receiving newsletters.
                </p>
                <Link
                  href="/subscribe"
                  className="inline-flex items-center mt-2 px-3 py-1 border border-transparent text-xs font-medium rounded text-yellow-800 bg-yellow-100 hover:bg-yellow-200"
                >
                  Renew Subscription
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Subscription Actions */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/subscribe"
              className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-blue-300 text-sm font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Upgrade Plan
            </Link>
            <button
              onClick={handleCancelSubscription}
              disabled={isLoading}
              className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <svg className="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
              {isLoading ? 'Canceling...' : 'Cancel Subscription'}
            </button>
          </div>
        </div>
      </div>
      {notification && (
        <Notification 
          message={notification.message} 
          type={notification.type} 
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
}