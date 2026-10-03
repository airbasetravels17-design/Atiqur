import { useState, useCallback } from 'react';

export interface NewsletterValidationResult {
  isValid: boolean;
  error: string | null;
}

export interface UseNewsletterValidationReturn {
  email: string;
  setEmail: (email: string) => void;
  error: string | null;
  isSubmitting: boolean;
  isSubscribed: boolean;
  subscribedEmail: string | null;
  promoCode: string;
  validateEmail: (emailToValidate: string) => NewsletterValidationResult;
  handleSubmit: (e?: React.FormEvent) => boolean;
  reset: () => void;
}

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const STORAGE_KEY = '_wf_newsletter_subscribers';

export const useNewsletterValidation = (): UseNewsletterValidationReturn => {
  const [email, setEmailState] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscribedEmail, setSubscribedEmail] = useState<string | null>(null);
  const promoCode = 'WELCOME10';

  const setEmail = useCallback((val: string) => {
    setEmailState(val);
    // Clear error as user types once it starts looking valid
    if (error) {
      setError(null);
    }
  }, [error]);

  const validateEmail = useCallback((emailToValidate: string): NewsletterValidationResult => {
    const trimmed = emailToValidate.trim();

    if (!trimmed) {
      return { isValid: false, error: 'Email address is required.' };
    }

    if (trimmed.length > 254) {
      return { isValid: false, error: 'Email address is too long.' };
    }

    if (!trimmed.includes('@')) {
      return { isValid: false, error: 'Please include an "@" in the email address.' };
    }

    const [localPart, domainPart] = trimmed.split('@');
    if (!localPart || localPart.length === 0) {
      return { isValid: false, error: 'Please enter a username before "@".' };
    }

    if (!domainPart || !domainPart.includes('.')) {
      return { isValid: false, error: 'Please provide a valid domain name (e.g. gmail.com).' };
    }

    if (!EMAIL_REGEX.test(trimmed)) {
      return { isValid: false, error: 'Please enter a valid email format (e.g. name@example.com).' };
    }

    return { isValid: true, error: null };
  }, []);

  const handleSubmit = useCallback((e?: React.FormEvent): boolean => {
    if (e) {
      e.preventDefault();
    }

    const validation = validateEmail(email);
    if (!validation.isValid) {
      setError(validation.error);
      return false;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const normalizedEmail = email.trim().toLowerCase();
      
      // Check existing subscribers in localStorage
      let existingSubscribers: Array<{ email: string; subscribedAt: string }> = [];
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          existingSubscribers = JSON.parse(stored);
        } catch {
          existingSubscribers = [];
        }
      }

      // Record subscriber if not already present
      const alreadySubscribed = existingSubscribers.some(s => s.email === normalizedEmail);
      if (!alreadySubscribed) {
        existingSubscribers.push({
          email: normalizedEmail,
          subscribedAt: new Date().toISOString()
        });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(existingSubscribers));
      }

      setIsSubmitting(false);
      setIsSubscribed(true);
      setSubscribedEmail(normalizedEmail);
      return true;
    } catch {
      setIsSubmitting(false);
      setError('Unable to save subscription. Please try again.');
      return false;
    }
  }, [email, validateEmail]);

  const reset = useCallback(() => {
    setEmailState('');
    setError(null);
    setIsSubmitting(false);
    setIsSubscribed(false);
    setSubscribedEmail(null);
  }, []);

  return {
    email,
    setEmail,
    error,
    isSubmitting,
    isSubscribed,
    subscribedEmail,
    promoCode,
    validateEmail,
    handleSubmit,
    reset
  };
};
