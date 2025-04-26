
import React from 'react';
import NavigationBar from '@/components/NavigationBar';
import Footer from '@/components/Footer';

const RefundPolicy: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <NavigationBar />
      <main className="flex-grow container mx-auto px-4 py-32">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Cancellation & Refund Policy</h1>
          <p className="text-sm text-muted-foreground mb-6">Last updated on Apr 22nd 2025</p>
          
          <div className="prose prose-sm max-w-none space-y-6">
            <div>
              <p className="mb-4">All purchases are final. Once an order is placed and payment is processed, you may not cancel your order for any reason.</p>
              <p>We recommend reviewing your order carefully before completing the checkout process.</p>
            </div>

            <div>
              <h2 className="text-xl font-bold mt-8 mb-4">No Refund</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>We do not offer refunds under any circumstances.</li>
                <li>Once payment is received, the transaction is considered complete and irreversible.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold mt-8 mb-4">Exceptions</h2>
              <p>While our standard policy is no cancellation and no refund, we may, at our sole discretion, consider exceptional cases in the event of:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Duplicate charges due to technical errors</li>
                <li>Fraudulent transactions</li>
                <li>Failure to deliver digital products due to technical issues on our end</li>
              </ul>
              <p className="mt-4">Any exception must be requested in writing within 7 days of the original purchase date and will only be granted if we determine that an error or extenuating circumstance occurred.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RefundPolicy;
