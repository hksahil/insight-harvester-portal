
import React from 'react';
import NavigationBar from '@/components/NavigationBar';
import Footer from '@/components/Footer';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <NavigationBar />
      <main className="flex-grow container mx-auto px-4 py-32">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground mb-6">Last updated on Apr 22nd 2025</p>
          
          <div className="prose prose-sm max-w-none space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-4">1. Information We Collect</h2>
              
              <div className="ml-4 space-y-4">
                <div>
                  <h3 className="font-bold">a. Personal Information You Provide</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Name</li>
                    <li>Email address</li>
                    <li>Payment information (processed by our secure payment gateway)</li>
                    <li>Account credentials (username, password)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold">b. Automatically Collected Information</h3>
                  <ul className="list-disc pl-6">
                    <li>Pages viewed and time spent on pages</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold">c. Cookies & Tracking Technologies</h3>
                  <ul className="list-disc pl-6">
                    <li>Analytics tools (e.g., Google Analytics)</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-4">2. How We Use Your Information</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Order Fulfillment:</strong> Process and fulfill your orders, send order confirmations, and provide customer support.</li>
                <li><strong>Account Management:</strong> Create, maintain, and secure your account.</li>
                <li><strong>Marketing & Communications:</strong> Send promotional materials, newsletters, and updates (you can opt out at any time).</li>
                <li><strong>Legal Obligations:</strong> Comply with applicable laws, regulations, and enforce our Terms of Service.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-4">3. Data Security</h2>
              <p>We implement reasonable administrative, technical, and physical safeguards to protect your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure. We cannot guarantee absolute security.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
