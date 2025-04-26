
import { useState, useEffect } from 'react';
import { BlogPost } from '@/types/blog';
import { MOCK_BLOGS } from '@/data/blogs';

export function useBlogPosts() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchBlogPosts() {
      try {
        setIsLoading(true);
        setBlogPosts(MOCK_BLOGS);
        setError(null);
      } catch (err) {
        console.error('Error fetching blog posts:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch blog posts'));
      } finally {
        setIsLoading(false);
      }
    }

    fetchBlogPosts();
  }, []);

  return { blogPosts, isLoading, error };
}
