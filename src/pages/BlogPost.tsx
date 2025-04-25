
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NavigationBar from '@/components/NavigationBar';
import Footer from '@/components/Footer';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Mock blog post data - in a real app, this would come from an API or CMS
const blogPostsData = {
  'evolving-landscape-data-storage': {
    title: 'Evolving landscape of Data storage solutions',
    publishDate: 'April 15, 2025',
    author: 'Sahil Choudhary',
    content: `
      <p>The proliferation of data feedback loops in virtually every arena has increased the use cases for data storage. Cloud providers like Amazon Web Services, Microsoft Azure, and Google Cloud Platform have all rushed for a competitive foothold in what JP Morgan calls using hubs is the infrastructure of the digital age. After decades of practical fundamentals of the centralized model that went into the MVS (Multiple Virtual Storage), there is very much room for innovation.</p>
      
      <p>The iPod upended the model daily editorial count for each car stereo. When a node's disk or network connection fails (or a power outage, fire suppression system would harm the average empirical burst of heat, requiring fail-over for the day from their room, someone at the new event cause), and then return the standard form of functionality. Additionally, it would take over the return time. Many new datastores are also distributed systems built with shareability in mind.</p>
      
      <p>JSON is a magical document the sky will match any and every data key.</p>
      
      <img src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2134&q=80" alt="Data center" class="w-full h-auto rounded-lg my-6" />
    `,
  },
  'power-bi-under-hood': {
    title: 'How Power BI works under the hood',
    publishDate: 'March 28, 2025',
    author: 'Sahil Choudhary',
    content: `
      <p>Microsoft Power BI is a powerful business analytics tool that helps organizations transform their data into actionable insights. But what makes it tick? In this deep dive, we'll explore the architecture that powers this robust platform.</p>
      
      <h2 class="text-2xl font-bold mt-8 mb-4">The Core Components</h2>
      
      <p>Power BI's architecture consists of several key components working together:</p>
      
      <ul class="list-disc pl-6 space-y-2 mt-4 mb-6">
        <li><strong>Power Query</strong>: The data transformation and preparation engine</li>
        <li><strong>Power Pivot</strong>: The in-memory data modeling component</li>
        <li><strong>Power View</strong>: The data visualization technology</li>
        <li><strong>Power Map</strong>: The 3D geospatial data visualization tool</li>
        <li><strong>Power Q&A</strong>: The natural language query interface</li>
      </ul>
      
      <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80" alt="Data visualization" class="w-full h-auto rounded-lg my-6" />
      
      <h2 class="text-2xl font-bold mt-8 mb-4">The Data Flow</h2>
      
      <p>Understanding how data flows through the Power BI ecosystem is crucial to leveraging its full potential. Here's a simplified overview:</p>
      
      <ol class="list-decimal pl-6 space-y-2 mt-4">
        <li>Data is imported or connected to via Power Query</li>
        <li>The data is transformed and loaded into the in-memory data model (Power Pivot)</li>
        <li>Data relationships are established in the model</li>
        <li>DAX (Data Analysis Expressions) measures and calculated columns are created</li>
        <li>Visualizations are built using the processed data</li>
        <li>Reports and dashboards are published to the Power BI Service</li>
        <li>Users interact with the published content</li>
      </ol>
    `,
  },
  'quick-guide-microsoft-fabric': {
    title: 'Quick No-BS Guide to Microsoft Fabric',
    publishDate: 'April 5, 2025',
    author: 'Sahil Choudhary',
    content: `
      <p>Microsoft Fabric is an all-in-one analytics solution for enterprises that covers everything from data movement to data science, real-time analytics, and business intelligence. This guide cuts through the marketing jargon to give you the essentials.</p>
      
      <h2 class="text-2xl font-bold mt-8 mb-4">What Exactly Is Microsoft Fabric?</h2>
      
      <p>Simply put, Microsoft Fabric is a unified platform that brings together:</p>
      
      <ul class="list-disc pl-6 space-y-2 mt-4 mb-6">
        <li>Data Lake (OneLake)</li>
        <li>Data Engineering</li>
        <li>Data Integration (Dataflows)</li>
        <li>Data Science</li>
        <li>Real-Time Analytics</li>
        <li>Power BI</li>
      </ul>
      
      <p>Instead of juggling multiple tools and platforms, Fabric aims to provide a single, integrated experience.</p>
      
      <h2 class="text-2xl font-bold mt-8 mb-4">Key Benefits Without the Fluff</h2>
      
      <ol class="list-decimal pl-6 space-y-2 mt-4">
        <li><strong>Simplified Data Stack</strong>: Less tools to learn, maintain, and integrate</li>
        <li><strong>Reduced Data Movement</strong>: Data stays in one place, accessible by different services</li>
        <li><strong>Consistent Security Model</strong>: One security model across all analytics workloads</li>
        <li><strong>Familiar Experience</strong>: If you know Power BI, the learning curve is less steep</li>
      </ol>
      
      <img src="https://images.unsplash.com/photo-1543286386-2e659306cd6c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80" alt="Data analytics" class="w-full h-auto rounded-lg my-6" />
    `,
  }
};

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  // Get the blog post data based on the slug
  const post = slug ? blogPostsData[slug as keyof typeof blogPostsData] : null;
  
  if (!post) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavigationBar />
        <main className="flex-grow container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-4">Blog Post Not Found</h1>
            <p className="text-muted-foreground mb-8">The blog post you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate('/learning')}>Back to Blog List</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <NavigationBar />
      <main className="flex-grow container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/learning')} 
            className="mb-6 flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to blogs
          </Button>
          
          <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8">
            <span>By {post.author}</span>
            <span>•</span>
            <span>{post.publishDate}</span>
          </div>
          
          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPost;
