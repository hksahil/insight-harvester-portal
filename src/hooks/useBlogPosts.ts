
import { useState, useEffect } from 'react';
import { BlogPost } from '@/types/blog';
import { blogPostsData } from '@/data/blogPosts';

// This hook could fetch data from your Hugo.io API in the future
export function useBlogPosts() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchBlogPosts() {
      try {
        setIsLoading(true);
        
        // In the future, this would be an API call to your Hugo.io CMS
        // const response = await fetch('https://your-hugo-api-endpoint/posts');
        // const data = await response.json();
        
        // For now, we'll use the mock data
        const posts: BlogPost[] = Object.entries(blogPostsData).map(([slug, post], index) => ({
          id: index + 1,
          title: post.title,
          subtitle: post.subtitle || '',
          slug,
          author: post.author,
          publishDate: post.publishDate
        }));
        
        setBlogPosts(posts);
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
