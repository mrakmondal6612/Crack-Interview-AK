"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, Send, Github, Linkedin, Twitter, Instagram, Heart, ArrowUp, Globe, Code, Users, Star, Zap, Clock } from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setTimeout(() => {
        setIsSubscribed(false);
        setEmail("");
      }, 3000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-slate-950 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,theme(colors.purple.900/0.3)_0%,transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,theme(colors.blue.900/0.3)_0%,transparent_50%)]"></div>
      </div>

      {/* Main Content */}
      <div className="relative w-full px-4 sm:px-6 py-8 sm:py-12 lg:py-16">
        {/* Top Section with Gradient Border */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-purple-600/20 blur-xl"></div>
          <div className="relative border-t border-b border-white/10 bg-white/5 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 mb-8 sm:mb-12 lg:mb-16">
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 lg:gap-12 items-center">
              
              {/* Brand Section */}
              <div className="text-center lg:text-left order-2 lg:order-1">
                <div className="flex items-center justify-center lg:justify-start gap-2 sm:gap-3 mb-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-purple-600/20 blur-lg rounded-full"></div>
                    <Image src="/logo.svg" alt="InterviewOrbit" width={32} height={32} className="relative" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold">InterviewOrbit</h3>
                    <p className="text-purple-300 text-xs sm:text-sm">AI Interview Platform</p>
                  </div>
                </div>
                
                <p className="text-gray-300 text-sm sm:text-base max-w-sm mx-auto lg:mx-0 mb-4 sm:mb-6">
                  Empowering candidates worldwide with AI-driven interview preparation and real-time feedback.
                </p>

                {/* Stats - Compact on mobile */}
                <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-4 sm:mb-6">
                  <div className="bg-white/5 backdrop-blur-sm rounded-lg p-2 sm:p-3 lg:p-4 border border-white/10">
                    <div className="flex items-center gap-1 sm:gap-2 mb-1">
                      <Users className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400" />
                      <span className="text-lg sm:text-xl lg:text-2xl font-bold text-white">50K+</span>
                    </div>
                    <p className="text-gray-400 text-xs sm:text-sm">Users</p>
                  </div>
                  <div className="bg-white/5 backdrop-blur-sm rounded-lg p-2 sm:p-3 lg:p-4 border border-white/10">
                    <div className="flex items-center gap-1 sm:gap-2 mb-1">
                      <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" />
                      <span className="text-lg sm:text-xl lg:text-2xl font-bold text-white">98%</span>
                    </div>
                    <p className="text-gray-400 text-xs sm:text-sm">Success</p>
                  </div>
                  <div className="bg-white/5 backdrop-blur-sm rounded-lg p-2 sm:p-3 lg:p-4 border border-white/10">
                    <div className="flex items-center gap-1 sm:gap-2 mb-1">
                      <Globe className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
                      <span className="text-lg sm:text-xl lg:text-2xl font-bold text-white">1M+</span>
                    </div>
                    <p className="text-gray-400 text-xs sm:text-sm">Interviews</p>
                  </div>
                  <div className="bg-white/5 backdrop-blur-sm rounded-lg p-2 sm:p-3 lg:p-4 border border-white/10">
                    <div className="flex items-center gap-1 sm:gap-2 mb-1">
                      <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" />
                      <span className="text-lg sm:text-xl lg:text-2xl font-bold text-white">24/7</span>
                    </div>
                    <p className="text-gray-400 text-xs sm:text-sm">Available</p>
                  </div>
                </div>

                {/* Social Links - Compact on mobile */}
                <div className="flex gap-2 sm:gap-3">
                  <a 
                    href="https://linkedin.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-600/20 to-purple-800/20 backdrop-blur-sm border border-purple-500/30 rounded-lg sm:rounded-xl flex items-center justify-center hover:from-purple-600/30 hover:to-purple-800/30 transition-all duration-300 hover:scale-110 group"
                  >
                    <Linkedin className="w-3 h-3 sm:w-4 sm:h-4 sm:w-5 sm:h-5 text-purple-300 group-hover:text-white" />
                  </a>
                  <a 
                    href="https://github.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-600/20 to-blue-800/20 backdrop-blur-sm border border-blue-500/30 rounded-lg sm:rounded-xl flex items-center justify-center hover:from-blue-600/30 hover:to-blue-800/30 transition-all duration-300 hover:scale-110 group"
                  >
                    <Github className="w-3 h-3 sm:w-4 sm:h-4 sm:w-5 sm:h-5 text-blue-300 group-hover:text-white" />
                  </a>
                  <a 
                    href="https://twitter.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-sky-600/20 to-sky-800/20 backdrop-blur-sm border border-sky-500/30 rounded-lg sm:rounded-xl flex items-center justify-center hover:from-sky-600/30 hover:to-sky-800/30 transition-all duration-300 hover:scale-110 group"
                  >
                    <Twitter className="w-3 h-3 sm:w-4 sm:h-4 sm:w-5 sm:h-5 text-sky-300 group-hover:text-white" />
                  </a>
                  <a 
                    href="https://instagram.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-pink-600/20 to-pink-800/20 backdrop-blur-sm border border-pink-500/30 rounded-lg sm:rounded-xl flex items-center justify-center hover:from-pink-600/30 hover:to-pink-800/30 transition-all duration-300 hover:scale-110 group"
                  >
                    <Instagram className="w-3 h-3 sm:w-4 sm:h-4 sm:w-5 sm:h-5 text-pink-300 group-hover:text-white" />
                  </a>
                </div>
              </div>

              {/* Newsletter Section */}
              <div className="text-center lg:text-right order-3">
                <div className="flex items-center justify-center lg:justify-end gap-2 mb-3 sm:mb-4">
                  <div className="w-6 h-6 sm:w-8 h-8 bg-green-600/20 rounded-lg flex items-center justify-center">
                    <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
                  </div>
                  <h4 className="text-base sm:text-lg lg:text-xl font-semibold text-white">Stay Updated</h4>
                </div>
                
                <p className="text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4 hidden sm:block">Get interview tips & updates</p>
                
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 max-w-xs mx-auto lg:ml-auto lg:mr-0">
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors text-sm"
                    required
                  />
                  <button 
                    type="submit" 
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-3 py-2 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 text-sm"
                  >
                    {isSubscribed ? <Star className="w-3 h-3 sm:w-4 sm:h-4" /> : <Send className="w-3 h-3 sm:w-4 sm:h-4" />}
                    {isSubscribed ? "Subscribed!" : "Subscribe"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Links Grid - More compact on mobile */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8 mb-8 sm:mb-12 lg:mb-16">
          
          {/* Product */}
          <div>
            <h5 className="text-white font-semibold mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
              <Code className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400" />
              Product
            </h5>
            <ul className="space-y-1 sm:space-y-2 sm:space-y-3">
              <li><Link href="/interview/create" className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm">Create Interview</Link></li>
              <li><Link href="/interview" className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm">Browse Library</Link></li>
              <li><Link href="/analytics" className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm">Analytics</Link></li>
              <li><Link href="/pricing" className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm">Pricing</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h5 className="text-white font-semibold mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
              <Globe className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" />
              Resources
            </h5>
            <ul className="space-y-1 sm:space-y-2 sm:space-y-3">
              <li><Link href="/blog" className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm">Blog</Link></li>
              <li><Link href="/guides" className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm">Guides</Link></li>
              <li><Link href="/faq" className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm">FAQ</Link></li>
              <li><Link href="/help" className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm">Help Center</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h5 className="text-white font-semibold mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
              <Users className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
              Company
            </h5>
            <ul className="space-y-1 sm:space-y-2 sm:space-y-3">
              <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm">About</Link></li>
              <li><Link href="/careers" className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm">Careers</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm">Contact</Link></li>
              <li><Link href="/partners" className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm">Partners</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h5 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Legal</h5>
            <ul className="space-y-1 sm:space-y-2 sm:space-y-3">
              <li><Link href="/privacy" className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm">Terms of Service</Link></li>
              <li><Link href="/cookies" className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm">Cookie Policy</Link></li>
              <li><Link href="/compliance" className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm">Compliance</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar - More compact on mobile */}
        <div className="border-t border-white/10 pt-4 sm:pt-6 lg:pt-8">
          <div className="flex flex-col gap-3 sm:gap-4 sm:gap-6">
            
            {/* Social Links - Centered on mobile */}
            <div className="flex justify-center sm:hidden">
              <div className="flex gap-2 sm:gap-3">
                <a 
                  href="https://linkedin.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors group"
                >
                  <Linkedin className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 group-hover:text-white" />
                </a>
                <a 
                  href="https://github.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors group"
                >
                  <Github className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 group-hover:text-white" />
                </a>
                <a 
                  href="https://twitter.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors group"
                >
                  <Twitter className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 group-hover:text-white" />
                </a>
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors group"
                >
                  <Instagram className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 group-hover:text-white" />
                </a>
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden sm:flex sm:flex-row sm:justify-between sm:items-center sm:gap-6">
              
              {/* Copyright */}
              <div className="text-center sm:text-left">
                <p className="text-gray-400 text-xs sm:text-sm">
                  {new Date().getFullYear()} InterviewOrbit. All rights reserved.
                </p>
              </div>

              {/* Social Links */}
              <div className="flex gap-3 sm:gap-4">
                <a 
                  href="https://linkedin.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-8 h-8 sm:w-10 sm:h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors group"
                >
                  <Linkedin className="w-3 h-3 sm:w-4 sm:h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-white" />
                </a>
                <a 
                  href="https://github.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-8 h-8 sm:w-10 sm:h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors group"
                >
                  <Github className="w-3 h-3 sm:w-4 sm:h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-white" />
                </a>
                <a 
                  href="https://twitter.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-8 h-8 sm:w-10 sm:h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors group"
                >
                  <Twitter className="w-3 h-3 sm:w-4 sm:h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-white" />
                </a>
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-8 h-8 sm:w-10 sm:h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors group"
                >
                  <Instagram className="w-3 h-3 sm:w-4 sm:h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-white" />
                </a>
              </div>

              {/* Back to Top */}
              <button
                onClick={scrollToTop}
                className="w-8 h-8 sm:w-10 sm:h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors"
                aria-label="Back to top"
              >
                <ArrowUp className="w-3 h-3 sm:w-4 sm:h-4 sm:w-5 sm:h-5 text-gray-400" />
              </button>
            </div>

            {/* Mobile Copyright */}
            <div className="text-center sm:hidden">
              <p className="text-gray-400 text-xs">
                {new Date().getFullYear()} InterviewOrbit. All rights reserved.
              </p>
            </div>

            {/* Mobile Back to Top */}
            <div className="flex justify-center sm:hidden">
              <button
                onClick={scrollToTop}
                className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors"
                aria-label="Back to top"
              >
                <ArrowUp className="w-3 h-3 text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
