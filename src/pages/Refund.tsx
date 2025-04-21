
import React from 'react';
import NavigationBar from '@/components/NavigationBar';
import Footer from '@/components/Footer';

const Refund = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <NavigationBar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Return & Refund Policy</h1>
        <div className="prose max-w-none">
          <p className="mb-4">Last updated: April 21, 2024</p>
          
          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-4">1. Digital Services</h2>
            <p>PowerBI Assistant provides digital services through a subscription model. Due to the nature of our services:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>All purchases are final and non-refundable</li>
              <li>Subscriptions can be cancelled at any time, but no partial refunds will be issued</li>
              <li>Service access continues until the end of the billing period</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-4">2. Exceptions</h2>
            <p>Refunds may be considered in exceptional circumstances, such as:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Technical issues preventing service access</li>
              <li>Billing errors</li>
              <li>Service unavailability</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-4">3. Contact Us</h2>
            <p>If you have any questions about our refund policy, please contact our support team.</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Refund;
