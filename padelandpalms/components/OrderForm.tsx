import React, { useState } from 'react';
import { PackageType, PackageDetails } from '../types';
import { Check, ShoppingCart, X } from 'lucide-react';

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
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!email || !phone) {
      setSubmitMessage({ type: 'error', text: 'Please fill in all required contact fields' });
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

      // Send to Make.com webhook
      const response = await fetch('https://hook.us2.make.com/kdhis7m0gvim2tdkeulflzcgr5f06shx', {
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
                      onClick={() => !isDisabled && onToggleService && onToggleService(service.id)}
                      disabled={isDisabled}
                      className={`w-full px-3 py-1.5 sm:px-4 sm:py-2 rounded-md sm:rounded-lg text-xs sm:text-sm font-bold transition-all ${
                        allSubsSelected
                          ? 'bg-pp-pink text-white'
                          : isDisabled
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : 'bg-pp-green text-white hover:bg-pp-green/90'
                      }`}
                    >
                      {allSubsSelected ? '✓ All Selected' : 'Select Both'}
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

      <div className="border-t border-gray-100 pt-4 md:pt-6 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
        <div className="w-full md:w-auto">
          {/* Monthly Total */}
          <div className="mb-3 text-center md:text-left">
            <span className="block text-gray-500 text-xs md:text-sm uppercase tracking-wide">Monthly Total</span>
            <span className="text-3xl md:text-4xl font-bold text-pp-green">
              {convertPrice(
                (() => {
                  let total = 0;
                  SERVICES.forEach(service => {
                    if (service.isBundle && service.subServices) {
                      if (service.dynamicPricing) {
                        // Count selected sub-services for dynamic pricing
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
              <div className="mt-3 pt-3 border-t border-gray-200">
                <span className="block text-gray-500 text-xs uppercase tracking-wide">Plus One-Time Fees</span>
                <span className="text-2xl font-bold text-pp-teal">
                  {convertPrice(totalOneTime, currency)}
                </span>
                {oneTimeFees > 0 && setupFees > 0 && (
                  <p className="text-xs text-gray-500 mt-1">
                    Website build ({convertPrice(oneTimeFees, currency)}) + Setup fees ({convertPrice(setupFees, currency)})
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

        {/* Contact Information Section */}
        <div className="border-t border-gray-200 pt-6 mb-6">
          <h3 className="text-lg md:text-xl font-bold text-pp-green mb-4">Your Contact Information</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-pp-pink focus:border-transparent transition-all text-base"
                placeholder="your@email.com"
              />
            </div>
            <div>
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
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>
        </div>

        {/* Submit Message */}
        {submitMessage && (
          <div className={`mb-4 p-4 rounded-lg ${
            submitMessage.type === 'success'
              ? 'bg-green-50 border-2 border-green-500 text-green-800'
              : 'bg-red-50 border-2 border-red-500 text-red-800'
          }`}>
            <p className="font-semibold">{submitMessage.text}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full md:w-auto flex items-center justify-center gap-2 md:gap-3 bg-pink-600 hover:bg-pink-500 text-white px-6 md:px-8 py-3 md:py-4 rounded-full font-bold text-base md:text-lg shadow-lg transform transition-all hover:scale-105 active:scale-95 ${
            isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <ShoppingCart className="w-5 h-5 md:w-6 md:h-6" />
          <span className="hidden sm:inline">{isSubmitting ? 'Submitting...' : 'Start Your Transformation'}</span>
          <span className="sm:hidden">{isSubmitting ? 'Submitting...' : 'Get Started'}</span>
        </button>
      </div>
    </form>
  );
};