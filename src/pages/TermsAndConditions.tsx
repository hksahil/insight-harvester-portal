
import React from 'react';
import NavigationBar from '@/components/NavigationBar';
import Footer from '@/components/Footer';

const TermsAndConditions: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <NavigationBar />
      <main className="flex-grow container mx-auto px-4 py-32">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Terms & Conditions</h1>
          <p className="text-sm text-muted-foreground mb-6">Last updated on Apr 22nd 2025</p>
          
          <div className="prose prose-sm max-w-none space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-4">1. Use of the Site</h2>
              <ul className="list-disc pl-6">
                <li>You may view, download, and print content for your personal, non-commercial use.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-4">2. User Accounts</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Some features may require registration.</li>
                <li>You are responsible for maintaining the confidentiality of your account credentials and for all activity under your account.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-4">3. Intellectual Property</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>All content on the Site—text, graphics, logos, images, and software—is our property or licensed to us.</li>
                <li>Unauthorized use of any content may violate copyright, trademark, and other laws.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-4">4. Changes to Terms</h2>
              <p>We may update these Terms at any time. We'll post the revised version with a new "Last Updated" date. Continued use constitutes acceptance.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsAndConditions;
