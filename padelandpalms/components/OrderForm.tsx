import React, { useState, useEffect } from 'react';
import { PackageType, PackageDetails } from '../types';
import { Check, X } from 'lucide-react';

// Custom Padel Racket Icon Component
const PadelRacket: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {/* Racket head - rounded rectangle */}
    <rect x="6" y="2" width="12" height="14" rx="3" ry="3" />
    {/* Holes pattern */}
    <circle cx="9" cy="6" r="0.5" fill="currentColor" />
    <circle cx="12" cy="6" r="0.5" fill="currentColor" />
    <circle cx="15" cy="6" r="0.5" fill="currentColor" />
    <circle cx="9" cy="9" r="0.5" fill="currentColor" />
    <circle cx="12" cy="9" r="0.5" fill="currentColor" />
    <circle cx="15" cy="9" r="0.5" fill="currentColor" />
    <circle cx="9" cy="12" r="0.5" fill="currentColor" />
    <circle cx="12" cy="12" r="0.5" fill="currentColor" />
    <circle cx="15" cy="12" r="0.5" fill="currentColor" />
    {/* Handle */}
    <line x1="12" y1="16" x2="12" y2="22" strokeWidth="2.5" />
    <line x1="10.5" y1="22" x2="13.5" y2="22" strokeWidth="2" />
  </svg>
);

const PACKAGES: PackageDetails[] = [
  {
    id: 'basic',
    name: PackageType.BASIC,
    price: 499,
    features: ['Basic Automation', 'Email Notifications', 'Standard Support']
  },
  {
    id: 'pro',
    name: PackageType.PRO,
    price: 999,
    features: ['Pro Suite', 'WhatsApp Integration', 'AI Receptionist', 'Priority Support']
  },
  {
    id: 'enterprise',
    name: PackageType.ENTERPRISE,
    price: 1899,
    features: ['Full Enterprise Solution', 'Custom CRM Scripting', 'Dedicated Account Manager', '24/7 Support', 'Multi-location Sync']
  }
];

// Service definitions (should match App.tsx) - now with bundles
const SERVICES = [
  { id: 'website', name: 'Custom Website Build', description: 'Fully branded design • Villa booking pages • Court reservations • F&B menu & bar • Photo gallery • Community & events • Blog • Location & directions • Guest reviews • Contact forms • Mobile-responsive', price: 2500, requiresWebsite: false, isOneTime: true, isBundle: false },
  {
    id: 'booking-automation',
    name: 'Booking Automation & Sync',
    description: 'Never miss a booking. All platforms sync automatically.',
    price: 0,
    requiresWebsite: true,
    isBundle: true,
    subServices: [
      { id: 'booking-villas', name: 'Villa Bookings', description: 'Sync all OTA platforms to your master system automatically', price: 299 },
      { id: 'booking-courts', name: 'Court Bookings', description: 'Real-time Playtomic & website sync. Zero double bookings.', price: 149 }
    ]
  },
  {
    id: 'guest-engagement',
    name: 'Notifications Setup',
    description: 'Engage guests before arrival. Increase pre-bookings and satisfaction.',
    price: 0,
    requiresWebsite: false,
    isBundle: true,
    dynamicPricing: true,
    subServices: [
      { id: 'notification-1', name: 'Notification Flow 1', description: 'Pre-built template: Guest Pre-Arrival Engagement (customizable triggers available)', basePrice: 88.5, pricePerCount: { 1: 88.5, 2: 75, 3: 62 } },
      { id: 'notification-2', name: 'Notification Flow 2', description: 'Pre-built template: Post-Game F&B Upsell (customizable triggers available)', basePrice: 88.5, pricePerCount: { 1: 88.5, 2: 75, 3: 62 } },
      { id: 'notification-3', name: 'Notification Flow 3', description: 'Pre-built template: Custom flow for your operation (fully customizable)', basePrice: 88.5, pricePerCount: { 1: 88.5, 2: 75, 3: 62 } }
    ]
  },
  {
    id: 'ai-receptionist',
    name: 'AI Receptionist',
    description: '24/7 support without hiring night staff. Handle requests automatically.',
    price: 0,
    requiresWebsite: false,
    isBundle: true,
    dynamicPricing: true,
    subServices: [
      { id: 'ai-chat', name: 'Text Chat', description: '24/7 intelligent text responses + staff notifications when needed', basePrice: 59, pricePerCount: { 1: 59, 2: 50, 3: 41 } },
      { id: 'ai-voice', name: 'Voice Calls', description: 'Real-time voice support that sounds human + staff alerts', basePrice: 177, pricePerCount: { 1: 177, 2: 150, 3: 124 } },
      { id: 'ai-email', name: 'Email Support', description: 'Automated email responses for common inquiries + escalation', basePrice: 177, pricePerCount: { 1: 177, 2: 150, 3: 124 } }
    ]
  },
  { id: 'content', name: 'Brand Content Engine', description: 'Stay top-of-mind with 40 posts/week across all platforms. Zero effort.', price: 159, requiresWebsite: false, isBundle: false },
  { id: 'dashboard', name: 'Daily Pulse Dashboard', description: 'See your entire operation at a glance. Catch issues before they become problems.', price: 212, setupFee: 500, requiresWebsite: false, isBundle: false },
];

interface OrderFormProps {
  selectedServices?: string[];
  onToggleService?: (serviceId: string) => void;
  totalPrice?: number;
  serviceNotes?: Record<string, string>;
  onUpdateNotes?: (serviceId: string, notes: string) => void;
  currency?: string;
  convertPrice?: (price: number, currency: string) => string;
}

export const OrderForm: React.FC<OrderFormProps> = ({
  selectedServices = [],
  onToggleService,
  totalPrice = 0,
  serviceNotes = {},
  onUpdateNotes,
  currency = 'USD',
  convertPrice = (price) => `$${price}`
}) => {
  const hasCustomServices = selectedServices.length > 0;
  const [email, setEmail] = useState('');
  const [emailLocalPart, setEmailLocalPart] = useState('');
  const [emailProvider, setEmailProvider] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const emailProviders = [
    { name: 'Gmail', domain: '@gmail.com' },
    { name: 'Outlook', domain: '@outlook.com' },
    { name: 'Yahoo', domain: '@yahoo.com' }
  ];

  // Update full email when local part or provider changes
  useEffect(() => {
    if (!emailProvider) {
      // If no provider selected, don't auto-update email
      return;
    }
    if (emailLocalPart) {
      const selectedProvider = emailProviders.find(p => p.name === emailProvider);
      if (selectedProvider && selectedProvider.domain) {
        setEmail(emailLocalPart + selectedProvider.domain);
      }
    } else {
      setEmail('');
    }
  }, [emailLocalPart, emailProvider]);

  // Handle custom email input
  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (value.includes('@')) {
      const [localPart, domain] = value.split('@');
      setEmailLocalPart(localPart);
      // Check if domain matches a known provider
      const matchingProvider = emailProviders.find(p => value.endsWith(p.domain));
      if (matchingProvider) {
        setEmailProvider(matchingProvider.name);
      } else {
        // Custom email - clear provider selection
        setEmailProvider('');
      }
    } else {
      setEmailLocalPart(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!email || !phone) {
      setSubmitMessage({ type: 'error', text: 'Please fill in all required contact fields' });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setSubmitMessage({ type: 'error', text: 'Please enter a valid email address' });
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      // Build the payload with clear labels
      const selectedServiceDetails = SERVICES.filter(service => {
        if (service.isBundle && service.subServices) {
          return service.subServices.some(sub => selectedServices.includes(sub.id));
        }
        return selectedServices.includes(service.id);
      }).map(service => {
        if (service.isBundle && service.subServices) {
          const selectedSubs = service.subServices.filter(sub => selectedServices.includes(sub.id));
          return {
            category: service.name,
            options: selectedSubs.map(sub => ({
              name: sub.name,
              description: sub.description,
              notes: serviceNotes[sub.id] || ''
            }))
          };
        }
        return {
          category: service.name,
          description: service.description,
          notes: serviceNotes[service.id] || ''
        };
      });

      const payload = {
        email,
        phone,
        selectedServices: selectedServiceDetails,
        serviceNotes,
        totalMonthly: (() => {
          let total = 0;
          SERVICES.forEach(service => {
            if (service.isBundle && service.subServices) {
              if (service.dynamicPricing) {
                const selectedCount = service.subServices.filter(sub =>
                  selectedServices.includes(sub.id)
                ).length;
                if (selectedCount > 0) {
                  service.subServices.forEach(sub => {
                    if (selectedServices.includes(sub.id)) {
                      const priceForCount = sub.pricePerCount?.[selectedCount] || sub.basePrice || sub.price || 0;
                      total += priceForCount;
                    }
                  });
                }
              } else {
                service.subServices.forEach(sub => {
                  if (selectedServices.includes(sub.id)) {
                    total += sub.price || 0;
                  }
                });
              }
            } else if (selectedServices.includes(service.id) && !service.isOneTime) {
              total += service.price || 0;
            }
          });
          return total;
        })(),
        totalOneTime: (() => {
          let oneTimeFees = 0;
          let setupFees = 0;
          SERVICES.forEach(service => {
            if (selectedServices.includes(service.id)) {
              if (service.isOneTime) {
                oneTimeFees += service.price || 0;
              }
              if (service.setupFee) {
                setupFees += service.setupFee;
              }
            }
          });
          return oneTimeFees + setupFees;
        })(),
        currency,
        submittedAt: new Date().toISOString()
      };

      // Send to n8n webhook
      const response = await fetch('https://build8.app.n8n.cloud/webhook/eb767d8b-80e1-4eee-9e1d-442e328d6546', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setSubmitMessage({
          type: 'success',
          text: 'Thank you! Your request has been submitted successfully. We\'ll contact you shortly.'
        });
        // Reset form
        setEmail('');
        setEmailLocalPart('');
        setEmailProvider('');
        setPhone('');
      } else {
        throw new Error('Failed to submit form');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitMessage({
        type: 'error',
        text: 'There was an error submitting your request. Please try again or contact us directly.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-3 sm:p-4 md:p-8 rounded-xl sm:rounded-2xl md:rounded-3xl shadow-xl border-t-2 sm:border-t-4 md:border-t-8 border-pp-pink max-w-4xl mx-auto w-full">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-pp-green mb-1 sm:mb-2 text-center">Start Your Transformation</h2>
      <p className="text-center text-xs sm:text-sm md:text-base text-gray-500 mb-4 sm:mb-6 md:mb-8">
        {hasCustomServices ? 'Your custom package is ready below' : 'Build your perfect package by selecting the services you need'}
      </p>

      {/* Build Your Custom Package - Interactive Service Selection */}
      <div className="mb-4 sm:mb-6 md:mb-8">
        <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-pp-green mb-2 sm:mb-3 md:mb-4">
          Build Your Custom Package
        </h3>
        <p className="text-xs sm:text-sm md:text-base text-gray-600 mb-3 sm:mb-4 md:mb-6">
          Select the services that fit your needs. Click any service to add or remove it from your package.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3">
          {SERVICES.map(service => {
            const hasWebsite = selectedServices.includes('website');

            // For bundles, check if any sub-services are selected
            const subServicesSelected = service.isBundle && service.subServices
              ? service.subServices.filter(sub => selectedServices.includes(sub.id))
              : [];
            const allSubsSelected = service.isBundle && service.subServices
              ? service.subServices.every(sub => selectedServices.includes(sub.id))
              : false;
            const someSubsSelected = subServicesSelected.length > 0;

            const isDisabled = service.requiresWebsite && !hasWebsite && !someSubsSelected;

            // For regular services
            const isSelected = !service.isBundle && selectedServices.includes(service.id);

            return (
              <div
                key={service.id}
                className={`p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-xl border-2 transition-all duration-300 ${
                  (isSelected || someSubsSelected)
                    ? 'border-pp-pink bg-pp-pink/10 shadow-md'
                    : isDisabled
                    ? 'border-gray-200 bg-gray-50 opacity-60'
                    : 'border-gray-200 bg-white'
                }`}
              >
                {/* Service Header */}
                <div className="mb-1.5 sm:mb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 sm:gap-2 flex-1 flex-wrap">
                      <p className={`font-bold text-sm sm:text-base md:text-lg ${isDisabled ? 'text-gray-400' : 'text-gray-800'}`}>{service.name}</p>
                      {service.isOneTime && (
                        <span className="text-[10px] sm:text-xs bg-pp-teal text-white px-1.5 py-0.5 sm:px-2 rounded-full font-bold">ONE-TIME</span>
                      )}
                      {service.requiresWebsite && !service.isBundle && (
                        <span className="text-[10px] sm:text-xs bg-gray-200 text-gray-600 px-1.5 py-0.5 sm:px-2 rounded-full font-bold">NEEDS WEBSITE</span>
                      )}
                    </div>
                  </div>
                  <p className={`text-xs sm:text-sm mt-0.5 sm:mt-1 ${isDisabled ? 'text-gray-400' : 'text-gray-500'}`}>{service.description}</p>
                  {isDisabled && (
                    <p className="text-[10px] sm:text-xs text-orange-600 mt-0.5 sm:mt-1 font-semibold">⚠ Select "Custom Website Build" first</p>
                  )}
                </div>

                {/* Bundle - Show "Select All" button and sub-services */}
                {service.isBundle && service.subServices ? (
                  <div className="space-y-1.5 sm:space-y-2">
                    {/* Select All Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (!isDisabled && onToggleService) {
                          onToggleService(service.id);
                        }
                      }}
                      disabled={isDisabled}
                      className={`w-full px-3 py-1.5 sm:px-4 sm:py-2 rounded-md sm:rounded-lg text-xs sm:text-sm font-bold transition-all ${
                        allSubsSelected
                          ? 'bg-pp-pink text-white'
                          : isDisabled
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : 'bg-pp-green text-white hover:bg-pp-green/90'
                      }`}
                    >
                      {allSubsSelected
                        ? '✓ All Selected'
                        : service.subServices && service.subServices.length === 2
                          ? 'Select Both'
                          : `Select All ${service.subServices?.length || ''}`}
                    </button>

                    {/* Dynamic Pricing Info */}
                    {service.dynamicPricing && someSubsSelected && service.subServices && service.subServices[0]?.pricePerCount && (
                      <div className="bg-pp-teal/10 border border-pp-teal/30 rounded-md sm:rounded-lg p-1.5 sm:p-2 text-[10px] sm:text-xs text-gray-700">
                        <strong>Volume Discount:</strong> 1 option = {convertPrice(service.subServices[0].pricePerCount[1], currency)}/mo, 2 options = {convertPrice(service.subServices[0].pricePerCount[2], currency)}/mo each, 3 options = {convertPrice(service.subServices[0].pricePerCount[3], currency)}/mo each
                      </div>
                    )}

                    {/* Sub-services */}
                    {service.subServices.map(subService => {
                      const isSubSelected = selectedServices.includes(subService.id);

                      // Calculate dynamic price
                      const selectedCount = service.dynamicPricing
                        ? service.subServices.filter(sub => selectedServices.includes(sub.id)).length
                        : 0;
                      const displayPrice = service.dynamicPricing && subService.pricePerCount
                        ? subService.pricePerCount[selectedCount] || subService.basePrice
                        : subService.price;

                      return (
                        <div key={subService.id} className="space-y-1.5 sm:space-y-2">
                          <div
                            onClick={() => !isDisabled && onToggleService && onToggleService(subService.id)}
                            className={`flex items-start justify-between gap-2 sm:gap-3 p-2 sm:p-2.5 md:p-3 rounded-md sm:rounded-lg cursor-pointer transition-all ${
                              isSubSelected
                                ? 'bg-pp-pink/20 border border-pp-pink'
                                : isDisabled
                                ? 'bg-gray-100 cursor-not-allowed'
                                : 'bg-white border border-gray-200 hover:border-pp-pink/50'
                            }`}
                          >
                            <div className="flex items-start gap-1.5 sm:gap-2 flex-1">
                              <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                                isSubSelected
                                  ? 'border-pp-pink bg-pp-pink'
                                  : 'border-gray-300 bg-white'
                              }`}>
                                {isSubSelected && <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />}
                              </div>
                              <div>
                                <p className="font-semibold text-xs sm:text-sm text-gray-800">{subService.name}</p>
                                <p className="text-[10px] sm:text-xs text-gray-500">{subService.description}</p>
                              </div>
                            </div>
                            <div className="text-right flex-shrink-0">
                              {displayPrice !== undefined ? (
                                <>
                                  <span className="font-bold text-sm sm:text-base text-pp-green">{convertPrice(displayPrice, currency)}</span>
                                  <span className="text-[10px] sm:text-xs text-gray-500 block">/mo</span>
                                </>
                              ) : null}
                            </div>
                          </div>

                          {/* Notes for sub-service */}
                          {isSubSelected && onUpdateNotes && (
                            <div className="ml-4 sm:ml-6 md:ml-8 p-1.5 sm:p-2 bg-gray-50 rounded-md sm:rounded-lg">
                              <label className="block text-[10px] sm:text-xs font-semibold text-gray-600 mb-0.5 sm:mb-1">
                                Add notes for {subService.name}:
                              </label>
                              <textarea
                                value={serviceNotes[subService.id] || ''}
                                onChange={(e) => onUpdateNotes(subService.id, e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                                placeholder="e.g., Specific use case, custom requirements..."
                                className="w-full px-1.5 py-1 sm:px-2 text-[10px] sm:text-xs border border-gray-300 rounded focus:ring-2 focus:ring-pp-pink focus:border-transparent resize-none transition-all"
                                rows={2}
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  /* Regular service - simple checkbox */
                  <div className="space-y-2">
                    <div
                      onClick={() => !isDisabled && onToggleService && onToggleService(service.id)}
                      className={`flex items-start justify-between gap-3 ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      <div className="flex items-start gap-3 flex-1">
                        <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                          isSelected
                            ? 'border-pp-pink bg-pp-pink'
                            : isDisabled
                            ? 'border-gray-300 bg-gray-100'
                            : 'border-gray-300 bg-white'
                        }`}>
                          {isSelected && <Check className="w-4 h-4 text-white" />}
                        </div>
                        <div className="flex-1">
                          <p className={`text-sm ${isDisabled ? 'text-gray-400' : 'text-gray-600'}`}>Click to select</p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span className={`font-bold text-lg ${isDisabled ? 'text-gray-400' : 'text-pp-green'}`}>{convertPrice(service.price, currency)}</span>
                        <span className="text-xs text-gray-500 block">{service.isOneTime ? 'once' : '/mo'}</span>
                        {service.setupFee && (
                          <span className="text-xs text-pp-teal font-semibold block">+ {convertPrice(service.setupFee, currency)} setup</span>
                        )}
                      </div>
                    </div>

                    {/* Notes for regular service */}
                    {isSelected && onUpdateNotes && (
                      <div className="ml-8 p-2 bg-gray-50 rounded-lg">
                        <label className="block text-xs font-semibold text-gray-600 mb-1">
                          Add notes:
                        </label>
                        <textarea
                          value={serviceNotes[service.id] || ''}
                          onChange={(e) => onUpdateNotes(service.id, e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          placeholder="e.g., Specific requirements, timeline, preferences..."
                          className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-pp-pink focus:border-transparent resize-none transition-all"
                          rows={2}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Pricing Summary Section */}
      <div className="border-t border-gray-100 pt-6 mb-6">
        <div className="text-center">
          {/* Monthly Total */}
          <div className="mb-4">
            <span className="block text-gray-500 text-xs md:text-sm uppercase tracking-wide">Monthly Total</span>
            <span className="text-3xl md:text-4xl font-bold text-pp-green">
              {convertPrice(
                (() => {
                  let total = 0;
                  SERVICES.forEach(service => {
                    if (service.isBundle && service.subServices) {
                      if (service.dynamicPricing) {
                        const selectedCount = service.subServices.filter(sub =>
                          selectedServices.includes(sub.id)
                        ).length;
                        if (selectedCount > 0) {
                          service.subServices.forEach(sub => {
                            if (selectedServices.includes(sub.id)) {
                              const priceForCount = sub.pricePerCount?.[selectedCount] || sub.basePrice || sub.price || 0;
                              total += priceForCount;
                            }
                          });
                        }
                      } else {
                        service.subServices.forEach(sub => {
                          if (selectedServices.includes(sub.id)) {
                            total += sub.price || 0;
                          }
                        });
                      }
                    } else if (selectedServices.includes(service.id) && !service.isOneTime) {
                      total += service.price || 0;
                    }
                  });
                  return total;
                })(),
                currency
              )}
            </span>
            {hasCustomServices && selectedServices.length > 0 && (
              <p className="text-sm text-gray-500 mt-1">Recurring monthly charges</p>
            )}
          </div>

          {/* One-Time Fees */}
          {(() => {
            let oneTimeFees = 0;
            let setupFees = 0;
            SERVICES.forEach(service => {
              if (selectedServices.includes(service.id)) {
                if (service.isOneTime) {
                  oneTimeFees += service.price || 0;
                }
                if (service.setupFee) {
                  setupFees += service.setupFee;
                }
              }
            });
            const totalOneTime = oneTimeFees + setupFees;
            return totalOneTime > 0 ? (
              <div className="pt-4 border-t border-gray-200 inline-block">
                <span className="block text-gray-500 text-xs uppercase tracking-wide">Plus One-Time Fees</span>
                <span className="text-2xl font-bold text-pp-teal">
                  {convertPrice(totalOneTime, currency)}
                </span>
                {oneTimeFees > 0 && setupFees > 0 && (
                  <p className="text-xs text-gray-500 mt-1">
                    Website ({convertPrice(oneTimeFees, currency)}) + Setup ({convertPrice(setupFees, currency)})
                  </p>
                )}
                {oneTimeFees > 0 && setupFees === 0 && (
                  <p className="text-xs text-gray-500 mt-1">Website build fee (paid once)</p>
                )}
                {oneTimeFees === 0 && setupFees > 0 && (
                  <p className="text-xs text-gray-500 mt-1">Setup fees (paid once)</p>
                )}
              </div>
            ) : null;
          })()}
        </div>
      </div>

      {/* Contact Information Section */}
      <div className="border-t border-gray-200 pt-6 mb-6">
        <h3 className="text-lg md:text-xl font-bold text-pp-green mb-4 text-center">Your Contact Information</h3>
        <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
          <div className="relative">
            <label htmlFor="email-local" className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => {
                  const value = e.target.value;
                  handleEmailChange(value);
                  // If user is typing and we have a provider selected, update local part
                  if (emailProvider && value.includes('@')) {
                    const [localPart] = value.split('@');
                    setEmailLocalPart(localPart);
                  }
                }}
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-pp-pink focus:border-transparent transition-all text-base"
                placeholder="your@email.com"
              />
              {/* Email Provider Buttons */}
              <div className="flex flex-wrap gap-2">
                {emailProviders.map(provider => (
                  <button
                    key={provider.name}
                    type="button"
                    onClick={() => {
                      setEmailProvider(provider.name);
                      // Extract local part from current email or use emailLocalPart
                      const localPart = emailLocalPart || (email.includes('@') ? email.split('@')[0] : email) || '';
                      setEmailLocalPart(localPart);
                      if (localPart && provider.domain) {
                        // Set the full email in the main input field
                        setEmail(localPart + provider.domain);
                      } else if (provider.domain) {
                        // If no local part, just show the domain (user can type before @)
                        setEmail(provider.domain);
                      }
                    }}
                    className={`px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold rounded-lg border-2 transition-all ${
                      emailProvider === provider.name
                        ? 'bg-pp-pink text-white border-pp-pink shadow-md'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-pp-pink hover:text-pp-pink hover:bg-pp-pink/5'
                    }`}
                  >
                    {provider.domain}
                  </button>
                ))}
              </div>
              {emailProvider && (
                <button
                  type="button"
                  onClick={() => {
                    const localPart = email.includes('@') ? email.split('@')[0] : email;
                    setEmailLocalPart(localPart);
                    setEmailProvider('');
                    setEmail(localPart);
                  }}
                  className="text-xs text-pp-pink hover:text-pp-green font-semibold underline"
                >
                  Clear provider selection
                </button>
              )}
            </div>
          </div>
          <div className="relative z-0">
            <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-pp-pink focus:border-transparent transition-all text-base"
              placeholder="+63 9XX XXX XXXX"
            />
          </div>
        </div>
      </div>

      {/* Submit Message */}
      {submitMessage && (
        <div className={`mb-4 p-4 rounded-lg max-w-2xl mx-auto ${
          submitMessage.type === 'success'
            ? 'bg-green-50 border-2 border-green-500 text-green-800'
            : 'bg-red-50 border-2 border-red-500 text-red-800'
        }`}>
          <p className="font-semibold text-center">{submitMessage.text}</p>
        </div>
      )}

      {/* Submit Button */}
      <div className="flex justify-center">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`flex items-center justify-center gap-3 bg-pink-600 hover:bg-pink-500 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg transform transition-all hover:scale-105 active:scale-95 ${
            isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <PadelRacket className="w-6 h-6" />
          <span>{isSubmitting ? 'Submitting...' : 'Start Your Transformation'}</span>
        </button>
      </div>
    </form>
  );
};