import React from 'react';
import { useNewsletterValidation } from '../hooks/useNewsletterValidation';
import { Mail, CheckCircle2, AlertCircle, ArrowRight, Sparkles, Copy, Check } from 'lucide-react';

interface NewsletterSubscriptionProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

export const NewsletterSubscription: React.FC<NewsletterSubscriptionProps> = ({
  title = 'Stay In The Loop',
  subtitle = 'Sign up to receive 10% off your first order, private sale invites, and new collection previews.',
  className = ''
}) => {
  const {
    email,
    setEmail,
    error,
    isSubmitting,
    isSubscribed,
    subscribedEmail,
    promoCode,
    handleSubmit,
    reset
  } = useNewsletterValidation();

  const [copied, setCopied] = React.useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(promoCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center gap-2">
        <h4 className="text-xs font-extrabold text-stone-900 uppercase tracking-wider">
          {title}
        </h4>
        <span className="bg-[#FFF1F2] text-[#FF3F6C] text-[10px] font-bold px-2 py-0.5 rounded-full border border-pink-100 flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          <span>10% OFF</span>
        </span>
      </div>

      <p className="text-xs text-stone-500 leading-relaxed max-w-sm">
        {subtitle}
      </p>

      {isSubscribed ? (
        <div 
          className="p-3.5 bg-emerald-50/90 border border-emerald-200 rounded-xl text-xs space-y-2 animate-fade-in max-w-sm"
          role="status"
          aria-live="polite"
        >
          <div className="flex items-start gap-2 text-emerald-800 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <div>You're subscribed!</div>
              <div className="text-[11px] font-normal text-emerald-700 break-all">
                Confirmation sent to {subscribedEmail}
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-emerald-200/80 flex items-center justify-between gap-2">
            <span className="text-[11px] text-emerald-800">
              Use code: <strong className="font-mono bg-white px-2 py-0.5 rounded border border-emerald-300 text-emerald-900">{promoCode}</strong>
            </span>
            <button
              type="button"
              onClick={handleCopyCode}
              className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 hover:text-emerald-900 flex items-center gap-1 bg-white/80 px-2 py-1 rounded border border-emerald-200 hover:bg-white transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          <button
            type="button"
            onClick={reset}
            className="text-[10px] text-emerald-700 hover:text-emerald-900 underline block pt-0.5"
          >
            Subscribe with another email
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-2 max-w-sm">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                <Mail className="w-3.5 h-3.5" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                aria-label="Email address for newsletter"
                aria-invalid={error ? 'true' : 'false'}
                aria-describedby={error ? 'newsletter-error-message' : undefined}
                disabled={isSubmitting}
                className={`bg-white border rounded-lg pl-9 pr-3 py-2.5 text-xs text-stone-900 placeholder-stone-400 w-full transition-all focus:outline-none focus:ring-2 ${
                  error
                    ? 'border-red-400 focus:ring-red-200'
                    : 'border-stone-300 focus:border-[#7C3AED] focus:ring-purple-100 hover:border-stone-400'
                } disabled:bg-stone-50 disabled:text-stone-400`}
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2.5 bg-[#FF3F6C] hover:bg-[#E11D48] text-white font-bold rounded-lg text-xs uppercase tracking-wider shrink-0 transition-colors shadow-sm flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer group"
            >
              <span>{isSubmitting ? 'Joining...' : 'Subscribe'}</span>
              {!isSubmitting && (
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              )}
            </button>
          </div>

          {error && (
            <div
              id="newsletter-error-message"
              role="alert"
              className="flex items-center gap-1.5 text-red-600 text-[11px] font-medium animate-fade-in pt-0.5"
            >
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="text-[10px] text-stone-400 flex items-center gap-1">
            <span>🔒 We respect your privacy. Unsubscribe anytime.</span>
          </div>
        </form>
      )}
    </div>
  );
};
