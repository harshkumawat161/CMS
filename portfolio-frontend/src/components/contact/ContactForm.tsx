'use client';

import React, { useState, useRef, ChangeEvent, FormEvent } from 'react';
import portfolioApi from '@/lib/api';
import {
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RefreshCw,
  User,
  Mail,
  FileText,
  MessageSquare,
} from 'lucide-react';

interface FormValues {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const ContactForm = () => {
  const [values, setValues] = useState<FormValues>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [touched, setTouched] = useState<Record<keyof FormValues, boolean>>({
    name: false,
    email: false,
    subject: false,
    message: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccessfully, setSubmittedSuccessfully] = useState(false);
  const [banner, setBanner] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  // Concurrency guard ref to prevent duplicate clicks/submissions
  const isSubmittingRef = useRef(false);

  // Client validation routine
  const validateField = (field: keyof FormValues, value: string): string | undefined => {
    const trimmed = value.trim();

    switch (field) {
      case 'name':
        if (!trimmed) return 'Name is required.';
        if (trimmed.length < 2) return 'Name must be at least 2 characters.';
        if (trimmed.length > 100) return 'Name cannot exceed 100 characters.';
        return undefined;

      case 'email':
        if (!trimmed) return 'Email address is required.';
        if (!EMAIL_REGEX.test(trimmed)) return 'Please provide a valid email address (e.g. name@domain.com).';
        if (trimmed.length > 150) return 'Email cannot exceed 150 characters.';
        return undefined;

      case 'subject':
        if (!trimmed) return 'Subject is required.';
        if (trimmed.length < 3) return 'Subject must be at least 3 characters.';
        if (trimmed.length > 200) return 'Subject cannot exceed 200 characters.';
        return undefined;

      case 'message':
        if (!trimmed) return 'Message body is required.';
        if (trimmed.length < 10) return 'Message must be at least 10 characters.';
        if (trimmed.length > 5000) return 'Message cannot exceed 5000 characters.';
        return undefined;

      default:
        return undefined;
    }
  };

  const validateAll = (): { isValid: boolean; newErrors: FormErrors } => {
    const newErrors: FormErrors = {};
    (Object.keys(values) as Array<keyof FormValues>).forEach((field) => {
      const err = validateField(field, values[field]);
      if (err) newErrors[field] = err;
    });
    return {
      isValid: Object.keys(newErrors).length === 0,
      newErrors,
    };
  };

  const handleChange = (field: keyof FormValues) => (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newVal = e.target.value;
    setValues((prev) => ({ ...prev, [field]: newVal }));

    // Real-time clearance of error once user corrects typing
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }

    if (banner.type === 'error') {
      setBanner({ type: null, message: '' });
    }
  };

  const handleBlur = (field: keyof FormValues) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const err = validateField(field, values[field]);
    if (err) {
      setErrors((prev) => ({ ...prev, [field]: err }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Guard against duplicate / concurrent submissions
    if (isSubmittingRef.current || isSubmitting) {
      return;
    }

    // Touch all fields
    setTouched({
      name: true,
      email: true,
      subject: true,
      message: true,
    });

    const { isValid, newErrors } = validateAll();
    if (!isValid) {
      setErrors(newErrors);
      setBanner({
        type: 'error',
        message: 'Please resolve the highlighted field errors before submitting.',
      });
      return;
    }

    // Lock submission
    isSubmittingRef.current = true;
    setIsSubmitting(true);
    setBanner({ type: null, message: '' });

    try {
      const payload = {
        name: values.name.trim(),
        email: values.email.trim(),
        subject: values.subject.trim(),
        message: values.message.trim(),
      };

      const result = await portfolioApi.submitContact(payload);

      if (result.success) {
        setSubmittedSuccessfully(true);
        setBanner({
          type: 'success',
          message:
            result.message ||
            'Thank you! Your message has been sent successfully.',
        });
        setValues({ name: '', email: '', subject: '', message: '' });
        setErrors({});
        setTouched({ name: false, email: false, subject: false, message: false });
      } else {
        // Handle server validation field errors if returned
        if (result.fieldErrors && Object.keys(result.fieldErrors).length > 0) {
          setErrors(result.fieldErrors);
        }
        setBanner({
          type: 'error',
          message: result.message,
        });
      }
    } catch {
      setBanner({
        type: 'error',
        message:
          'Could not deliver your inquiry right now due to a network connection issue. Please try again shortly.',
      });
    } finally {
      setIsSubmitting(false);
      isSubmittingRef.current = false;
    }
  };

  const handleResetForm = () => {
    setSubmittedSuccessfully(false);
    setBanner({ type: null, message: '' });
    setValues({ name: '', email: '', subject: '', message: '' });
    setErrors({});
    setTouched({ name: false, email: false, subject: false, message: false });
  };

  return (
    <div className="p-8 sm:p-10 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl shadow-2xl relative overflow-hidden transition-all duration-300">
      {/* Decorative ambient glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Success banner */}
      {banner.type === 'success' && (
        <div
          role="status"
          aria-live="polite"
          className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-xs sm:text-sm flex items-start gap-3 animate-fade-in shadow-lg shadow-emerald-950/20"
        >
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-emerald-200">Message Delivered</p>
            <p className="leading-relaxed text-emerald-300/90">{banner.message}</p>
          </div>
        </div>
      )}

      {/* Error banner */}
      {banner.type === 'error' && (
        <div
          role="alert"
          aria-live="assertive"
          className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/25 text-rose-300 text-xs sm:text-sm flex items-start gap-3 animate-fade-in shadow-lg shadow-rose-950/20"
        >
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-rose-200">Submission Attention</p>
            <p className="leading-relaxed text-rose-300/90">{banner.message}</p>
          </div>
        </div>
      )}

      {/* Dedicated Success State View */}
      {submittedSuccessfully ? (
        <div className="py-8 text-center space-y-6 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600/20 to-teal-500/20 border border-emerald-500/30 text-emerald-400 shadow-xl shadow-emerald-950/50">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Inquiry Sent Successfully!
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Thank you for reaching out. Your inquiry has been securely stored in the CMS database. You will receive a response as soon as possible, typically within 24–48 hours.
            </p>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={handleResetForm}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-medium text-xs sm:text-sm transition-all focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none"
            >
              <RefreshCw className="w-4 h-4 text-indigo-400" />
              <span>Send Another Message</span>
            </button>
          </div>
        </div>
      ) : (
        /* Form View */
        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Name input */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="contact-name"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5"
                >
                  <User className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Your Name</span>
                  <span className="text-indigo-400" aria-hidden="true">*</span>
                </label>
                <span className="text-[10px] text-slate-500 font-mono">
                  {values.name.length}/100
                </span>
              </div>
              <input
                id="contact-name"
                name="name"
                type="text"
                required
                disabled={isSubmitting}
                autoComplete="name"
                maxLength={100}
                value={values.name}
                onChange={handleChange('name')}
                onBlur={handleBlur('name')}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? 'contact-name-error' : undefined}
                placeholder="e.g. Alex Morgan"
                className={`w-full px-4 py-3 bg-slate-950/70 rounded-xl text-sm text-white placeholder-slate-500 outline-none transition-all border ${
                  errors.name
                    ? 'border-rose-500/80 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/30'
                    : 'border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              />
              {errors.name && (
                <p
                  id="contact-name-error"
                  role="alert"
                  className="mt-1.5 text-xs text-rose-400 flex items-center gap-1 animate-fade-in"
                >
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.name}</span>
                </p>
              )}
            </div>

            {/* Email input */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="contact-email"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Your Email Address</span>
                  <span className="text-indigo-400" aria-hidden="true">*</span>
                </label>
                <span className="text-[10px] text-slate-500 font-mono">
                  {values.email.length}/150
                </span>
              </div>
              <input
                id="contact-email"
                name="email"
                type="email"
                required
                disabled={isSubmitting}
                autoComplete="email"
                maxLength={150}
                value={values.email}
                onChange={handleChange('email')}
                onBlur={handleBlur('email')}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'contact-email-error' : undefined}
                placeholder="alex@company.com"
                className={`w-full px-4 py-3 bg-slate-950/70 rounded-xl text-sm text-white placeholder-slate-500 outline-none transition-all border ${
                  errors.email
                    ? 'border-rose-500/80 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/30'
                    : 'border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              />
              {errors.email && (
                <p
                  id="contact-email-error"
                  role="alert"
                  className="mt-1.5 text-xs text-rose-400 flex items-center gap-1 animate-fade-in"
                >
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.email}</span>
                </p>
              )}
            </div>
          </div>

          {/* Subject input */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label
                htmlFor="contact-subject"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5 text-indigo-400" />
                <span>Subject</span>
                <span className="text-indigo-400" aria-hidden="true">*</span>
              </label>
              <span className="text-[10px] text-slate-500 font-mono">
                {values.subject.length}/200
              </span>
            </div>
            <input
              id="contact-subject"
              name="subject"
              type="text"
              required
              disabled={isSubmitting}
              maxLength={200}
              value={values.subject}
              onChange={handleChange('subject')}
              onBlur={handleBlur('subject')}
              aria-invalid={!!errors.subject}
              aria-describedby={errors.subject ? 'contact-subject-error' : undefined}
              placeholder="e.g. Distributed Systems Architecture Inquiry"
              className={`w-full px-4 py-3 bg-slate-950/70 rounded-xl text-sm text-white placeholder-slate-500 outline-none transition-all border ${
                errors.subject
                  ? 'border-rose-500/80 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/30'
                  : 'border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            />
            {errors.subject && (
              <p
                id="contact-subject-error"
                role="alert"
                className="mt-1.5 text-xs text-rose-400 flex items-center gap-1 animate-fade-in"
              >
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.subject}</span>
              </p>
            )}
          </div>

          {/* Message textarea */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label
                htmlFor="contact-message"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                <span>Message Details</span>
                <span className="text-indigo-400" aria-hidden="true">*</span>
              </label>
              <span className="text-[10px] text-slate-500 font-mono">
                {values.message.length}/5000
              </span>
            </div>
            <textarea
              id="contact-message"
              name="message"
              rows={5}
              required
              disabled={isSubmitting}
              maxLength={5000}
              value={values.message}
              onChange={handleChange('message')}
              onBlur={handleBlur('message')}
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? 'contact-message-error' : undefined}
              placeholder="Describe your project, timeline, technical requirements, or consultation goals..."
              className={`w-full px-4 py-3 bg-slate-950/70 rounded-xl text-sm text-white placeholder-slate-500 outline-none transition-all resize-y border ${
                errors.message
                  ? 'border-rose-500/80 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/30'
                  : 'border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            />
            {errors.message && (
              <p
                id="contact-message-error"
                role="alert"
                className="mt-1.5 text-xs text-rose-400 flex items-center gap-1 animate-fade-in"
              >
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.message}</span>
              </p>
            )}
          </div>

          {/* Actions & Submit */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2">
            <p className="text-[11px] text-slate-500">
              * All fields are required. Inquiries are protected by server-side validation.
            </p>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold text-sm shadow-xl shadow-indigo-600/30 transition-all hover:shadow-indigo-600/50 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 focus-visible:outline-none"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Sending Inquiry...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ContactForm;
