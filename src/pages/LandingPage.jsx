import React from 'react';
import { ArrowRight, Activity, Users, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)]">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-50 to-red-50 py-20 lg:py-32 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-brand-100 rounded-full blur-3xl opacity-50"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
              Donate Blood, <span className="text-brand-500">Save Lives</span>
            </h1>
            <p className="text-xl text-slate-600 mb-10 leading-relaxed">
              Connect with donors and find blood in emergencies. LifeLine makes the process of blood donation and retrieval seamless, secure, and fast.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/search" className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold rounded-full text-white bg-brand-500 hover:bg-brand-600 shadow-lg hover:shadow-brand-300 transition-all transform hover:-translate-y-1">
                Find Blood Now
              </Link>
              <Link to="/dashboard" className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold rounded-full text-brand-600 bg-white border-2 border-brand-100 hover:border-brand-200 hover:bg-brand-50 shadow-sm transition-all">
                Become a Donor
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Why Choose LifeLine?</h2>
            <p className="mt-4 text-lg text-slate-600">We bridge the gap between donors and those in need.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            <FeatureCard 
              icon={<Activity className="h-10 w-10 text-brand-500" />}
              title="Real-time Availability"
              description="Check blood availability in real-time from verified donors and blood banks near you."
            />
            <FeatureCard 
              icon={<Users className="h-10 w-10 text-brand-500" />}
              title="Community Driven"
              description="Join a growing community of life-savers. Every donation makes a difference."
            />
            <FeatureCard 
              icon={<ShieldCheck className="h-10 w-10 text-brand-500" />}
              title="Verified & Secure"
              description="All donors and requests are verified to ensure safety and trust in the platform."
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="p-8 rounded-2xl bg-slate-50 hover:bg-white border border-slate-100 hover:border-brand-100 shadow-sm hover:shadow-xl transition-all duration-300 group">
      <div className="mb-6 bg-white w-16 h-16 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-600 leading-relaxed">{description}</p>
    </div>
  );
}
