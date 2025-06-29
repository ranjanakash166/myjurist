'use client';

import React, { useState } from 'react';
import { Users, Mail, Linkedin, Twitter, ArrowLeft, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  message: string;
}

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      alert('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate form submission (replace with actual API call later)
    setTimeout(() => {
      setIsSubmitted(true);
      setIsSubmitting(false);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        company: '',
        message: ''
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header with back button */}
      <div className="fixed top-0 w-full z-50 glass-effect border-b border-ai-blue-500/20 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-3 group cursor-pointer">
              <ArrowLeft className="h-6 w-6 text-ai-blue-400 group-hover:text-ai-cyan-400 transition-colors duration-300" />
              <span className="text-lg font-semibold text-slate-300 group-hover:text-ai-blue-400 transition-colors duration-300">
                Back to Home
              </span>
            </Link>
            <div className="text-2xl font-bold gradient-text-animate">
              Contact Us
            </div>
          </div>
        </div>
      </div>

      {/* Main content with padding for fixed header */}
      <div className="pt-20">
        {/* Team Section */}
        <section id="team" className="py-20 bg-gray-900">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-bold mb-4 text-white">
                Meet Our Expert Team
              </h2>
              <div className="w-24 h-1 bg-blue-500 mx-auto rounded-full"></div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {/* Shashank */}
              <div className="bg-gray-800 p-8 rounded-3xl border border-gray-700 text-center">
                {/* Profile image */}
                <div className="mb-6">
                  <div className="w-32 h-32 bg-blue-500 rounded-full mx-auto flex items-center justify-center overflow-hidden">
                    <Image 
                      src="/images/shashank.jpeg" 
                      alt="Shashank" 
                      width={128} 
                      height={128} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback to icon if image fails to load
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                    <Users className="h-16 w-16 text-white hidden" />
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold mb-2 text-white">Shashank</h3>
                <p className="text-lg text-blue-400 font-semibold mb-4">Co-Founder & CEO</p>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  Shashank holds degrees in Law and Business Administration and is dedicated to developing 
                  innovative legal AI solutions that enable teams to perform at their highest potential.
                </p>
                
                <p className="text-sm text-blue-400 font-semibold mb-6">
                  Reach out to him for partnership and business inquiries.
                </p>
                
                {/* Social links */}
                <div className="flex justify-center space-x-4">
                  <a href="mailto:support@myjurist.io" className="p-3 bg-blue-500/20 rounded-xl border border-blue-500/30 hover:border-blue-400/50 transition-all duration-300">
                    <Mail className="h-5 w-5 text-blue-400" />
                  </a>
                  <a href="https://linkedin.com/company/myjurist" target="_blank" rel="noopener noreferrer" className="p-3 bg-purple-500/20 rounded-xl border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300">
                    <Linkedin className="h-5 w-5 text-purple-400" />
                  </a>
                  <a href="https://twitter.com/myjurist" target="_blank" rel="noopener noreferrer" className="p-3 bg-cyan-500/20 rounded-xl border border-cyan-500/30 hover:border-cyan-400/50 transition-all duration-300">
                    <Twitter className="h-5 w-5 text-cyan-400" />
                  </a>
                </div>
              </div>

              {/* Gaurav */}
              <div className="bg-gray-800 p-8 rounded-3xl border border-gray-700 text-center">
                {/* Profile image */}
                <div className="mb-6">
                  <div className="w-32 h-32 bg-purple-500 rounded-full mx-auto flex items-center justify-center overflow-hidden">
                    <Image 
                      src="/images/gaurav.jpeg" 
                      alt="Gaurav Suman" 
                      width={128} 
                      height={128} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback to icon if image fails to load
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                    <Users className="h-16 w-16 text-white hidden" />
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold mb-2 text-white">Gaurav Suman</h3>
                <p className="text-lg text-purple-400 font-semibold mb-4">Co-Founder & CTO</p>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  Gaurav leads our technology and product development. Contact him for technical questions, integrations, or support.
                </p>
                
                <p className="text-sm text-purple-400 font-semibold mb-6">
                  Reach out to him for technical inquiries and support.
                </p>
                
                {/* Social links */}
                <div className="flex justify-center space-x-4">
                  <a href="mailto:support@myjurist.io" className="p-3 bg-purple-500/20 rounded-xl border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300">
                    <Mail className="h-5 w-5 text-purple-400" />
                  </a>
                  <a href="https://linkedin.com/company/myjurist" target="_blank" rel="noopener noreferrer" className="p-3 bg-blue-500/20 rounded-xl border border-blue-500/30 hover:border-blue-400/50 transition-all duration-300">
                    <Linkedin className="h-5 w-5 text-blue-400" />
                  </a>
                  <a href="https://twitter.com/myjurist" target="_blank" rel="noopener noreferrer" className="p-3 bg-cyan-500/20 rounded-xl border border-cyan-500/30 hover:border-cyan-400/50 transition-all duration-300">
                    <Twitter className="h-5 w-5 text-cyan-400" />
                  </a>
                </div>
              </div>
            </div>
            
            {/* Team values */}
            <div className="mt-16 grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-xl font-bold text-blue-400 mb-2">Expertise</h4>
                <p className="text-gray-300">Deep knowledge in law and AI technology</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-xl font-bold text-purple-400 mb-2">Innovation</h4>
                <p className="text-gray-300">Pioneering AI solutions for legal industry</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-xl font-bold text-cyan-400 mb-2">Vision</h4>
                <p className="text-gray-300">Transforming legal due diligence globally</p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="py-20 bg-gray-800">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-bold mb-4 text-white">
                Get In Touch
              </h2>
              <div className="w-24 h-1 bg-blue-500 mx-auto rounded-full"></div>
              <p className="text-xl text-gray-300 mt-6">
                Ready to transform your legal due diligence process? Let's discuss how My Jurist can help.
              </p>
            </div>
            
            <div className="bg-gray-900 p-8 rounded-2xl border border-gray-700">
              {isSubmitted ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold mb-4 text-white">
                    Thank You!
                  </h3>
                  <p className="text-xl text-gray-300 mb-6">
                    Your query has been submitted successfully.
                  </p>
                  <p className="text-lg text-blue-400">
                    Our team will get back to you soon.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="mt-8 bg-gradient-to-r from-ai-blue-600 to-ai-purple-600 hover:from-ai-blue-700 hover:to-ai-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-ai-blue-500 focus:ring-1 focus:ring-ai-blue-500"
                        placeholder="Enter your first name"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-ai-blue-500 focus:ring-1 focus:ring-ai-blue-500"
                        placeholder="Enter your last name"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-ai-blue-500 focus:ring-1 focus:ring-ai-blue-500"
                      placeholder="Enter your email address"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-2">
                      Company
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-ai-blue-500 focus:ring-1 focus:ring-ai-blue-500"
                      placeholder="Enter your company name"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={6}
                      value={formData.message}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-ai-blue-500 focus:ring-1 focus:ring-ai-blue-500"
                      placeholder="Tell us about your legal due diligence needs..."
                      required
                    ></textarea>
                  </div>
                  
                  <div className="text-center">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`bg-gradient-to-r from-ai-blue-600 to-ai-purple-600 hover:from-ai-blue-700 hover:to-ai-purple-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-ai-blue-500/25 ai-shadow ${
                        isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ContactPage; 