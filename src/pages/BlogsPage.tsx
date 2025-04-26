
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationBar from '@/components/NavigationBar';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

// Mock data for blogs
const MOCK_BLOGS = [
  {
    id: 1,
    title: "Mastering Power BI Performance Optimization",
    slug: "power-bi-performance",
    excerpt: "Learn how to optimize your Power BI reports for maximum performance",
    embedUrl: "https://www.linkedin.com/embed/feed/update/urn:li:share:7320067844656742400"
  },
  {
    id: 2,
    title: "Advanced DAX Patterns",
    slug: "advanced-dax",
    excerpt: "Deep dive into advanced DAX patterns and techniques",
    embedUrl: "https://www.linkedin.com/embed/feed/update/urn:li:share:7319002449669738497"
  },
  // Add more mock blogs as needed
];

const ITEMS_PER_PAGE = 5;

const BlogsPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
  // Filter blogs based on search
  const filteredBlogs = MOCK_BLOGS.filter(blog => 
    blog.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredBlogs.length / ITEMS_PER_PAGE);
  const currentBlogs = filteredBlogs.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="min-h-screen flex flex-col">
      <NavigationBar />
      <main className="flex-grow container mx-auto px-4" style={{ paddingTop: '8rem' }}>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Latest Blogs</h1>
          <p className="text-muted-foreground mb-8">Discover insights about Power BI and data analytics</p>
          
          <div className="mb-8">
            <Input 
              type="search" 
              placeholder="Search blogs..." 
              className="max-w-md" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="space-y-6">
            {currentBlogs.map((blog) => (
              <Card 
                key={blog.id} 
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigate(`/blogs/${blog.slug}`)}
              >
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-2">{blog.title}</h2>
                  <p className="text-muted-foreground">{blog.excerpt}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {totalPages > 1 && (
            <div className="mt-8">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      aria-disabled={currentPage === 1}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        isActive={currentPage === page}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      aria-disabled={currentPage === totalPages}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BlogsPage;
