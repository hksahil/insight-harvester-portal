// Delete this Page
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationBar from '@/components/NavigationBar';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { MOCK_BLOGS } from '@/data/blogs';

const Learning: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter blog posts based on search term
  const filteredPosts = MOCK_BLOGS.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    post.subtitle.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="min-h-screen flex flex-col">
      <NavigationBar />
      <main className="flex-grow container mx-auto px-4" style={{paddingTop:'8rem'}}>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">Blogs</h1>
          <p className="text-muted-foreground mb-8">A curated list of recent and not so recent blogs</p>
          
          <div className="mb-8">
            <Input 
              type="search" 
              placeholder="Search..." 
              className="max-w-md" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="space-y-6">
            {filteredPosts.map((post) => (
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
