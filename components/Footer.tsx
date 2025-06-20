"use client";
import React, { useState } from "react";

export default function Footer() {
  const [email, setEmail] = useState("");
  return (
    <footer className="w-full bg-gradient-to-r from-primary-900 to-primary-700 text-white py-12 px-4 mt-10 shadow-2xl relative z-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-10">
        {/* Exclusive/Subscribe Section */}
        <div className="md:col-span-2 flex flex-col gap-4">
          <h3 className="font-bold text-lg mb-2">Exclusive</h3>
          <p className="text-primary-200 text-sm">Subscribe<br />Get 10% off your first order</p>
          <form className="flex flex-col sm:flex-row gap-2 mt-2">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="rounded px-3 py-2 text-dark-900 focus:outline-none focus:ring-2 focus:ring-primary-400 w-full sm:w-auto"
            />
            <button type="submit" className="bg-primary-500 hover:bg-primary-400 text-white px-4 py-2 rounded font-semibold transition">Subscribe</button>
          </form>
        </div>
        {/* Support Section */}
        <div className="flex flex-col gap-2">
          <h3 className="font-bold text-lg mb-2">Support</h3>
          <p className="text-primary-200 text-sm">1, Khan Road Mankundu<br />Hooghly - 720012</p>
          <a href="mailto:xyzabcgmail.com" className="text-primary-100 hover:underline text-sm">xyzabcgmail.com</a>
          <a href="tel:+9101584369999" className="text-primary-100 hover:underline text-sm">+91 015-8436-9999</a>
        </div>
        {/* Account Section */}
        <div className="flex flex-col gap-2">
          <h3 className="font-bold text-lg mb-2">Account</h3>
          <a href="/profile" className="text-primary-100 hover:underline text-sm">My Account</a>
          <a href="/sign-in" className="text-primary-100 hover:underline text-sm">Login / Register</a>
          <a href="/cart" className="text-primary-100 hover:underline text-sm">Cart</a>
          <a href="/wishlist" className="text-primary-100 hover:underline text-sm">Wishlist</a>
          <a href="/shop" className="text-primary-100 hover:underline text-sm">Shop</a>
        </div>
        {/* Quick Link Section */}
        <div className="flex flex-col gap-2">
          <h3 className="font-bold text-lg mb-2">Quick Link</h3>
          <a href="/privacy" className="text-primary-100 hover:underline text-sm">Privacy Policy</a>
          <a href="/terms" className="text-primary-100 hover:underline text-sm">Terms Of Use</a>
          <a href="/faq" className="text-primary-100 hover:underline text-sm">FAQ</a>
          <a href="/contact" className="text-primary-100 hover:underline text-sm">Contact</a>
        </div>
        {/* Social Section */}
        <div className="flex flex-col gap-2 items-start">
          <h3 className="font-bold text-lg mb-2">Follow Us</h3>
          <div className="flex gap-4">
            <a href="https://www.linkedin.com/in/ajay-ai" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <img src="/tech/linkedin.svg" alt="LinkedIn" className="w-7 h-7 hover:scale-110 transition" />
            </a>
            <a href="https://github.com/ajay-ai/ai_mock_interviews" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <img src="/tech/github.svg" alt="GitHub" className="w-7 h-7 hover:scale-110 transition" />
            </a>
            <a href="https://instagram.com/ajay.ai" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <img src="/tech/instagram.svg" alt="Instagram" className="w-7 h-7 hover:scale-110 transition" />
            </a>
          </div>
        </div>
      </div>
      <div className="mt-10 text-center text-xs text-primary-300">
        &copy; {new Date().getFullYear()} AI Mock Interviews. Crafted with <span className="text-pink-400">&#10084;&#65039;</span> by Mr. AK
      </div>
      <div className="absolute left-0 bottom-0 w-full h-2 bg-gradient-to-r from-primary-500 via-primary-300 to-primary-500 blur-sm opacity-60" />
    </footer>
  );
}
