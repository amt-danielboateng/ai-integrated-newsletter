"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { availablePlans } from "@/lib/plans";
import { useAuth } from "@/app/contexts/AuthContext";
import { useSubscription } from "@/app/hooks/useSubscription";
import SmoothPayButton from "@/app/components/SmoothPayButton";

export default function SubscribePage() {
  const [planChoice, setPlanChoice] = useState<"free" | "basic" | "month" | "year">("free");
  const { user } = useAuth();
  const { subscription } = useSubscription();
  const router = useRouter();

  // Pre-select current plan if user has active subscription
  useEffect(() => {
    if (subscription?.active && subscription.plan_type) {
      setPlanChoice(subscription.plan_type as "free" | "basic" | "month" | "year");
    }
  }, [subscription]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
            <svg
              className="w-8 h-8 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Unlock Your Personalized Newsletter
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the perfect plan to get your AI-powered weekly newsletters
            delivered straight to your inbox
          </p>
        </div>

        {/* Plans Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {availablePlans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl ${
                planChoice === plan.id
                  ? "border-blue-500 shadow-blue-100"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              {/* Popular Badge */}
              {plan.id === "year" && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg whitespace-nowrap">
                    Most Popular
                  </span>
                </div>
              )}
              
              {/* Current Plan Badge */}
              {subscription?.active && subscription.plan_type === plan.id && (
                <div className="absolute -top-4 right-4 z-10">
                  <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium shadow-lg">
                    Current
                  </span>
                </div>
              )}

              <div className="p-6">
                {/* Plan Header */}
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold text-gray-900">
                      ₵{plan.price}
                    </span>
                    <span className="text-gray-500 ml-2">/{plan.interval}</span>
                  </div>
                  {plan.id === "year" && (
                    <p className="text-sm text-green-600 font-medium mt-2">
                      Save 20% compared to monthly
                    </p>
                  )}
                </div>

                {/* Plan Features */}
                <div className="space-y-4 mb-8">
                  <div className="flex items-center">
                    <svg
                      className={`w-5 h-5 mr-3 ${plan.features.newsletterLimit ? 'text-yellow-500' : 'text-green-500'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-gray-700">
                      {plan.features.newsletterLimit ? `${plan.features.newsletterLimit} newsletters` : 'Unlimited newsletters'}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <svg
                      className={`w-5 h-5 mr-3 ${plan.features.newsCategories === 'limited' ? 'text-yellow-500' : 'text-green-500'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-gray-700">
                      {plan.features.newsCategories === 'limited' ? 'Limited news categories' : 'All news categories'}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <svg
                      className={`w-5 h-5 mr-3 ${plan.features.history ? 'text-green-500' : 'text-gray-400'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d={plan.features.history ? "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" : "M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"}
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className={`${plan.features.history ? 'text-gray-700' : 'text-gray-400'}`}>
                      Newsletter history
                    </span>
                  </div>
                </div>

                {/* Select Button */}
                <button
                  onClick={() => setPlanChoice(plan.id)}
                  className={`w-full py-3 px-6 rounded-xl font-medium transition-all duration-200 cursor-pointer ${
                    planChoice === plan.id
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {subscription?.active && subscription.plan_type === plan.id 
                    ? "Current Plan" 
                    : planChoice === plan.id 
                    ? "Selected" 
                    : "Select Plan"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Subscribe Button */}
        <div className="text-center">
          {/* SmoothPay Button */}
          {user?.email && user?.id && (
            <SmoothPayButton
              plan={availablePlans.find(p => p.id === planChoice)!}
              userEmail={user.email}
              userId={user.id}
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              text="Subscribe Now"
            />
          )}

          <p className="text-sm text-gray-500 mt-4">
            Secure payment powered by SmoothPay • Cancel anytime
          </p>

          {/* Skip to Dashboard Button */}
          <div className="mt-6">
            <button
              onClick={() => router.push('/dashboard')}
              className="text-gray-600 hover:text-gray-800 underline text-sm font-medium transition-colors cursor-pointer"
            >
              Skip for now, go to dashboard
            </button>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">
              30-Day Money Back
            </h4>
            <p className="text-sm text-gray-600">
              Not satisfied? Get a full refund
            </p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">
              Secure & Private
            </h4>
            <p className="text-sm text-gray-600">
              Your data is always protected
            </p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3">
              <svg
                className="w-6 h-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">Instant Access</h4>
            <p className="text-sm text-gray-600">
              Start generating newsletters immediately
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}