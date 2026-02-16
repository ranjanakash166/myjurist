'use client';

import React, { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { submitContactForm, ContactFormData } from '@/lib/contactApi';
import CtaArrowIcon from '@/components/landing/CtaArrowIcon';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  message: string;
}

interface ContactFormSectionProps {
  title?: string;
  subtitle?: string;
  showBackButton?: boolean;
  buttonText?: string;
  inlineMode?: boolean;
  useLandingStyle?: boolean;
  disableButtonAnimation?: boolean;
}

const inputLandingClass =
  'border-slate-200 bg-white text-[#0f172a] placeholder:text-slate-500 focus-visible:ring-[#2563eb] focus-visible:border-[#2563eb]';
const labelLandingStyle = { color: 'var(--text-primary, #0f172a)' };
const loginButtonBlueStyle = { backgroundColor: '#2F80ED', color: '#ffffff' };

const ContactFormSection: React.FC<ContactFormSectionProps> = ({ 
  title = "Get In Touch",
  subtitle = "Ready to transform your legal due diligence process? Let's discuss how My Jurist can help.",
  showBackButton = false,
  buttonText = "Send Message",
  inlineMode = false,
  useLandingStyle = false,
  disableButtonAnimation = false,
}) => {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if all fields are filled
    const isFormValid = Object.values(formData).every(value => value.trim() !== '');
    
    if (!isFormValid) {
      setError('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    
    try {
      // Transform form data to match API format
      const apiFormData: ContactFormData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        company: formData.company,
        message: formData.message
      };

      const response = await submitContactForm(apiFormData);
      
      if (response.success) {
        setIsSubmitted(true);
        setSuccessMessage(response.message);
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          company: '',
          message: ''
        });
      } else {
        setError('Failed to submit form. Please try again.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const content = (
    <>
      {!inlineMode && (
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {title}
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full mb-4"></div>
          <p className="text-base md:text-lg text-muted-foreground">
            {subtitle}
          </p>
        </div>
      )}
      
      {inlineMode && (
        <div className="mb-6">
          <h2
            className="text-2xl md:text-3xl font-bold mb-2"
            style={useLandingStyle ? labelLandingStyle : undefined}
          >
            {title}
          </h2>
          <p
            className="text-sm md:text-base mb-6"
            style={useLandingStyle ? { color: 'var(--text-secondary, #475569)' } : undefined}
          >
            {subtitle}
          </p>
        </div>
      )}
      
      <Card
        className={
          useLandingStyle
            ? 'bg-white border border-slate-200/80 shadow-xl rounded-2xl overflow-hidden'
            : 'border-2 shadow-lg'
        }
      >
        <CardContent className="p-6 md:p-8">
            {isSubmitted ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="h-10 w-10 text-white" />
                </div>
                <h3
                  className="text-3xl font-bold mb-4"
                  style={useLandingStyle ? labelLandingStyle : undefined}
                >
                  Thank You!
                </h3>
                <p
                  className="text-xl mb-6"
                  style={useLandingStyle ? { color: 'var(--text-secondary, #475569)' } : undefined}
                >
                  {successMessage || 'Your query has been submitted successfully.'}
                </p>
                <p
                  className="text-lg font-medium mb-6"
                  style={useLandingStyle ? { color: 'var(--blue-600, #2563eb)' } : undefined}
                >
                  Our team will get back to you soon.
                </p>
                <Button
                  onClick={() => {
                    setIsSubmitted(false);
                    setSuccessMessage('');
                    setError(null);
                  }}
                  className={
                    useLandingStyle
                      ? `landing-cta-button landing-cta-blue landing-cta-text mt-8 rounded-full font-medium gap-3 ${
                          disableButtonAnimation
                            ? ""
                            : "transition-all duration-200 ease-out hover:scale-105 hover:shadow-xl hover:brightness-110 active:scale-100"
                        }`
                      : 'mt-8'
                  }
                  style={useLandingStyle ? loginButtonBlueStyle : undefined}
                >
                  {useLandingStyle ? (
                    <span className="inline-flex items-center gap-3">
                      Send Another Message
                      <CtaArrowIcon size={36} className="shrink-0" />
                    </span>
                  ) : (
                    'Send Another Message'
                  )}
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="firstName"
                      className={useLandingStyle ? 'font-medium' : ''}
                      style={useLandingStyle ? labelLandingStyle : undefined}
                    >
                      First Name
                    </Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="Enter your first name"
                      required
                      className={useLandingStyle ? inputLandingClass : ''}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="lastName"
                      className={useLandingStyle ? 'font-medium' : ''}
                      style={useLandingStyle ? labelLandingStyle : undefined}
                    >
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Enter your last name"
                      required
                      className={useLandingStyle ? inputLandingClass : ''}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className={useLandingStyle ? 'font-medium' : ''}
                    style={useLandingStyle ? labelLandingStyle : undefined}
                  >
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email address"
                    required
                    className={useLandingStyle ? inputLandingClass : ''}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label
                    htmlFor="company"
                    className={useLandingStyle ? 'font-medium' : ''}
                    style={useLandingStyle ? labelLandingStyle : undefined}
                  >
                    Company
                  </Label>
                  <Input
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    placeholder="Enter your company name"
                    required
                    className={useLandingStyle ? inputLandingClass : ''}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label
                    htmlFor="message"
                    className={useLandingStyle ? 'font-medium' : ''}
                    style={useLandingStyle ? labelLandingStyle : undefined}
                  >
                    Message
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Tell us about your needs..."
                    rows={6}
                    required
                    className={useLandingStyle ? inputLandingClass : ''}
                  />
                </div>
                
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className={
                    useLandingStyle
                      ? `landing-cta-button landing-cta-blue landing-cta-text w-full rounded-full font-medium gap-3 ${
                          disableButtonAnimation
                            ? ""
                            : "transition-all duration-200 ease-out hover:scale-105 hover:shadow-xl hover:brightness-110 active:scale-100"
                        } disabled:opacity-70 disabled:hover:scale-100 disabled:hover:brightness-100`
                      : 'w-full'
                  }
                  style={useLandingStyle ? loginButtonBlueStyle : undefined}
                >
                  {useLandingStyle ? (
                    <span className="inline-flex items-center justify-center gap-3">
                      {isSubmitting ? 'Sending...' : buttonText}
                      {!isSubmitting && (
                        <CtaArrowIcon size={36} className="shrink-0" />
                      )}
                    </span>
                  ) : (
                    isSubmitting ? 'Sending...' : buttonText
                  )}
                </Button>
              </form>
            )}
        </CardContent>
      </Card>
    </>
  );

  if (inlineMode) {
    return <div className="w-full">{content}</div>;
  }

  return (
    <section className="section-legal bg-background">
      <div className="container-legal max-w-4xl">
        {content}
      </div>
    </section>
  );
};

export default ContactFormSection;
