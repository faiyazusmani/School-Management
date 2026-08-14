import React from 'react';
import { Navbar } from '../components/landing/Navbar';
import { Hero } from '../components/landing/Hero';
import { Features } from '../components/landing/Features';
import { AboutSchool } from '../components/landing/AboutSchool';
import { Statistics } from '../components/landing/Statistics';
import { TeachersSection } from '../components/landing/TeachersSection';
import { Testimonials } from '../components/landing/Testimonials';
import { Gallery } from '../components/landing/Gallery';
import { FAQ } from '../components/landing/FAQ';
import { Contact } from '../components/landing/Contact';
import { Footer } from '../components/landing/Footer';

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      <Navbar />
      <Hero />
      <Features />
      <AboutSchool />
      <Statistics />
      <TeachersSection />
      <Testimonials />
      <Gallery />
      <FAQ />
      <Contact />
      <Footer />
    </div>
  );
};
