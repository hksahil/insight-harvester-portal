
import React from 'react';
import NavigationBar from '@/components/NavigationBar';
import Footer from '@/components/Footer';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <NavigationBar />
      <main className="flex-grow container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground mb-6">Last updated on Apr 22nd 2025</p>
          
          <div className="prose prose-sm max-w-none">
            <p>
              This privacy policy sets out how SAHIL CHOUDHARY uses and protects any information that you give SAHIL CHOUDHARY when you visit their website and/or agree to purchase from them.
            </p>
            
            <h2 className="text-xl font-bold mt-8 mb-4">We may collect the following information:</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Name</li>
            </ul>
            
            <h2 className="text-xl font-bold mt-8 mb-4">What we do with the information we gather</h2>
            <p>
              We require this information to understand your needs and provide you with a better service, and in particular for the following reasons:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Internal record keeping.</li>
              <li>We may use the information to improve our products and services.</li>
            </ul>
            
            <p className="mt-6">
              We are committed to ensuring that your information is secure. In order to prevent unauthorised access or disclosure we have put in suitable measures.
            </p>
            
            <h2 className="text-xl font-bold mt-8 mb-4">How we use cookies</h2>
            <p>
              A cookie is a small file which asks permission to be placed on your computer's hard drive. Once you agree, the file is added and the cookie helps analyze web traffic or lets you know when you visit a particular site. Cookies allow web applications to respond to you as an individual. The web application can tailor its operations to your needs, likes and dislikes by gathering and remembering information about your preferences.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
