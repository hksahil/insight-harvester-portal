
import React from 'react';
import NavigationBar from '@/components/NavigationBar';
import Footer from '@/components/Footer';
import { Mail, Linkedin } from 'lucide-react';

const ContactUs: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <NavigationBar />
      <main className="flex-grow container mx-auto px-4 py-32">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
          <p className="text-sm text-muted-foreground mb-6">Last updated on Apr 22nd 2025</p>
          
          <div className="prose prose-sm max-w-none">
            <p>If you have questions or need assistance, please contact us at:</p>
            
            <div className="space-y-4 mt-8">
              <div className="p-6 border rounded-lg shadow-sm flex items-center">
                <Mail className="h-6 w-6 mr-3 text-primary" />
                <div>
                  <p className="font-medium">Email:</p>
                  <a href="mailto:officialhksahil@gmail.com" className="text-primary hover:underline">
                    officialhksahil@gmail.com
                  </a>
                </div>
              </div>

              <div className="p-6 border rounded-lg shadow-sm flex items-center">
                <Linkedin className="h-6 w-6 mr-3 text-primary" />
                <div>
                  <p className="font-medium">LinkedIn:</p>
                  <a 
                    href="https://www.linkedin.com/in/offiicialhksahil/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    linkedin.com/in/offiicialhksahil
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ContactUs;
