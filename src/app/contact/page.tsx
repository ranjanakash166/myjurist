'use client';

import React from 'react';
import { Users, Mail, Linkedin, Twitter, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const ContactPage: React.FC = () => {
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
            
            <div className="max-w-4xl mx-auto text-center">
              <div className="bg-gray-800 p-12 rounded-3xl border border-gray-700">
                {/* Profile image */}
                <div className="mb-8">
                  <div className="w-32 h-32 bg-blue-500 rounded-full mx-auto flex items-center justify-center">
                    <Users className="h-16 w-16 text-white" />
                  </div>
                </div>
                
                <h3 className="text-3xl font-bold mb-4 text-white">Shashank</h3>
                <p className="text-xl text-gray-300 mb-6 leading-relaxed">
                  Shashank holds degrees in Law and Business Administration and is dedicated to developing 
                  innovative legal AI solutions that enable teams to perform at their highest potential.
                </p>
                
                <p className="text-lg text-blue-400 font-semibold mb-8">
                  Reach out to him for partnership and business inquiries.
                </p>
                
                {/* Social links */}
                <div className="flex justify-center space-x-6">
                  <a href="mailto:contact@myjurist.com" className="p-3 bg-blue-500/20 rounded-xl border border-blue-500/30 hover:border-blue-400/50 transition-all duration-300">
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
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-ai-blue-500 focus:ring-1 focus:ring-ai-blue-500"
                      placeholder="Enter your first name"
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
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-ai-blue-500 focus:ring-1 focus:ring-ai-blue-500"
                      placeholder="Enter your last name"
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
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-ai-blue-500 focus:ring-1 focus:ring-ai-blue-500"
                    placeholder="Enter your email address"
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
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-ai-blue-500 focus:ring-1 focus:ring-ai-blue-500"
                    placeholder="Enter your company name"
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
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-ai-blue-500 focus:ring-1 focus:ring-ai-blue-500"
                    placeholder="Tell us about your legal due diligence needs..."
                  ></textarea>
                </div>
                
                <div className="text-center">
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-ai-blue-600 to-ai-purple-600 hover:from-ai-blue-700 hover:to-ai-purple-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-ai-blue-500/25 ai-shadow"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ContactPage; 