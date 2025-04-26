
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NavigationBar from '@/components/NavigationBar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { MOCK_BLOGS } from '@/data/blogs';

const BlogDetailedPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  const blog = MOCK_BLOGS.find(b => b.slug === slug);
  
  if (!blog) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavigationBar />
        <main className="flex-grow container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-4">Blog Not Found</h1>
            <p className="text-muted-foreground mb-8">The blog post you're looking for doesn't exist.</p>
            <Button onClick={() => navigate('/blogs')}>Back to Blogs</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <NavigationBar />
      <main className="flex-grow container mx-auto px-4 py-16" style={{paddingTop:'8em'}}>
        <div className="max-w-4xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/blogs')} 
            className="mb-6 flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to blogs
          </Button>
          
          <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>
          <p className="text-lg text-muted-foreground mb-8">{blog.subtitle}</p>
          
          <div className="aspect-video w-full">
            <iframe
              src={blog.embedUrl}
              height="100%"
              width="100%"
              frameBorder="0"
              allowFullScreen
              title={blog.title}
              className="w-full h-full"
            ></iframe>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BlogDetailedPage;
