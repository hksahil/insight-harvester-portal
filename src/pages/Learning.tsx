
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationBar from '@/components/NavigationBar';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

const allBlogPosts = [
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
  },
  {
    id: 4,
    title: 'Advanced DAX Formulas Explained',
    subtitle: 'Master complex DAX formulas for better Power BI reporting',
    slug: 'advanced-dax-formulas'
  },
  {
    id: 5,
    title: 'Optimizing Power BI Performance',
    subtitle: 'Tips and tricks for faster Power BI dashboards',
    slug: 'optimizing-power-bi-performance'
  },
  {
    id: 6,
    title: 'Power BI and AI Integration',
    subtitle: 'How to leverage AI capabilities within Power BI',
    slug: 'power-bi-ai-integration'
  }
];

const POSTS_PER_PAGE = 2;

const Learning: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
  // Filter blog posts based on search term
  const filteredPosts = useMemo(() => {
    return allBlogPosts.filter(post => 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.subtitle.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);
  
  // Get current posts for pagination
  const indexOfLastPost = currentPage * POSTS_PER_PAGE;
  const indexOfFirstPost = indexOfLastPost - POSTS_PER_PAGE;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  
  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  
  // Calculate total pages
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  
  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <NavigationBar />
      <main className="flex-grow container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Blogs*</h1>
          <p className="text-muted-foreground mb-8">A curated list of recent and not so recent blogs</p>
          
          <div className="mb-8">
            <Input 
              type="search" 
              placeholder="Search..." 
              className="max-w-md"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          
          <div className="space-y-6">
            {currentPosts.length > 0 ? (
              currentPosts.map((post) => (
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
              ))
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No blogs found matching your search. Try a different keyword.
              </p>
            )}
          </div>
          
          {totalPages > 1 && (
            <Pagination className="mt-8">
              <PaginationContent>
                {currentPage > 1 && (
                  <PaginationItem>
                    <PaginationPrevious onClick={() => paginate(currentPage - 1)} />
                  </PaginationItem>
                )}
                
                {Array.from({ length: totalPages }).map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink 
                      isActive={currentPage === i + 1}
                      onClick={() => paginate(i + 1)}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
                {currentPage < totalPages && (
                  <PaginationItem>
                    <PaginationNext onClick={() => paginate(currentPage + 1)} />
                  </PaginationItem>
                )}
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Learning;
