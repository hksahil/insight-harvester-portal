
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationBar from '@/components/NavigationBar';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Tag } from 'lucide-react';
import { MOCK_BLOGS } from '@/data/blogs';
import { Badge } from '@/components/ui/badge';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const ITEMS_PER_PAGE = 5;

const BlogsPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  
  // Get unique tags
  const uniqueTags = useMemo(() => {
    const tags = MOCK_BLOGS.map(blog => blog.tag);
    return Array.from(new Set(tags));
  }, []);

  // Filter blogs based on search and selected tag
  const filteredBlogs = MOCK_BLOGS.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = selectedTag ? blog.tag === selectedTag : true;
    return matchesSearch && matchesTag;
  });
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredBlogs.length / ITEMS_PER_PAGE);
  const currentBlogs = filteredBlogs.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Handle tag selection
  const handleTagClick = (tag: string) => {
    setSelectedTag(selectedTag === tag ? null : tag);
    setCurrentPage(1); // Reset to first page when filtering
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavigationBar />
      <main className="flex-grow container mx-auto px-4" style={{ paddingTop: '8rem' }}>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Blog</h1>
          <p className="text-muted-foreground mb-8">Find the No BS, niche articles around the data domain which will help you build expertise</p>
          
          <div className="mb-4">
            <Input 
              type="search" 
              placeholder="Search blogs..." 
              className="max-w-md" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Tags Section */}
          <div className="flex flex-wrap gap-2 mb-8">
            {uniqueTags.map((tag) => (
              <Badge
                key={tag}
                variant={selectedTag === tag ? "default" : "secondary"}
                className="cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => handleTagClick(tag)}
              >
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>
          
          <div className="space-y-6">
            {currentBlogs.map((blog) => (
              <Card 
                key={blog.id} 
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigate(`/blogs/${blog.slug}`)}
              >
                <CardContent className="p-4 flex justify-between items-center">
                  <div className="flex items-start gap-4">
                    <span className="text-2xl font-bold text-muted-foreground">{blog.id}</span>
                    <div>
                      <h2 className="font-medium text-lg">{blog.title}</h2>
                      <p className="text-sm text-muted-foreground">{blog.subtitle}</p>
                      <Badge variant="secondary" className="mt-2">
                        <Tag className="w-3 h-3 mr-1" />
                        {blog.tag}
                      </Badge>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
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
