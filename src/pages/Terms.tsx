
import React from 'react';
import NavigationBar from '@/components/NavigationBar';
import Footer from '@/components/Footer';

const Terms = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <NavigationBar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Terms & Conditions</h1>
        <div className="prose max-w-none">
          <p className="mb-4">Last updated: April 21, 2024</p>
          
          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p>By accessing and using PowerBI Assistant, you agree to be bound by these Terms and Conditions.</p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-4">2. Service Description</h2>
            <p>PowerBI Assistant provides tools and services for Power BI development and optimization. We reserve the right to modify or discontinue any aspect of our services at any time.</p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
            <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.</p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-4">4. Payment Terms</h2>
            <p>All payments are processed securely through Razorpay. Subscription fees are non-refundable unless otherwise required by law.</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;
