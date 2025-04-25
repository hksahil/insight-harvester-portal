
import React from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationBar from '@/components/NavigationBar';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

const blogPosts = [
  {
    id: 1,
    title: 'Evolving landscape of Data storage solutions',
    subtitle: 'An overview of modern data storage solutions',
    slug: 'evolving-landscape-data-storage'
  },
  {
    id: 2,
    title: 'How Power BI works under the hood',
    subtitle: 'Understand the architecture of Microsoft PowerBI to build cool applications on top of it',
    slug: 'power-bi-under-hood'
  },
  {
    id: 3,
    title: 'Quick No-BS Guide to Microsoft Fabric',
    subtitle: 'A straightforward guide to using Power BI effectively',
    slug: 'quick-guide-microsoft-fabric'
  }
];

const Learning: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col">
      <NavigationBar />
      <main className="flex-grow container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Blogs*</h1>
          <p className="text-muted-foreground mb-8">A curated list of recent and not so recent blogs</p>
          
          <div className="mb-8">
            <Input type="search" placeholder="Search..." className="max-w-md" />
          </div>
          
          <div className="space-y-6">
            {blogPosts.map((post) => (
              <Card 
                key={post.id} 
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigate(`/learning/${post.slug}`)}
              >
                <CardContent className="p-6 flex justify-between items-center">
                  <div className="flex items-start gap-4">
                    <span className="text-2xl font-bold text-muted-foreground">{post.id}</span>
                    <div>
                      <h2 className="font-medium text-lg">{post.title}</h2>
                      <p className="text-sm text-muted-foreground">{post.subtitle}</p>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="flex items-center justify-center mt-8 gap-2">
            <button className="w-8 h-8 rounded-md flex items-center justify-center bg-primary text-primary-foreground">1</button>
            <button className="w-8 h-8 rounded-md flex items-center justify-center hover:bg-accent">2</button>
            <button className="w-8 h-8 rounded-md flex items-center justify-center hover:bg-accent">3</button>
            <button className="w-8 h-8 rounded-md flex items-center justify-center hover:bg-accent">4</button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Learning;
