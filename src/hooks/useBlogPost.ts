
import { useState, useEffect } from 'react';
import { BlogPostDetail } from '@/types/blog';
import { blogPostsData } from '@/data/blogPosts';

export function useBlogPost(slug: string | undefined) {
  const [post, setPost] = useState<BlogPostDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchBlogPost() {
      if (!slug) {
        setError(new Error('No slug provided'));
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        
        // In the future, this would be an API call to your Hugo.io CMS
        // const response = await fetch(`https://your-hugo-api-endpoint/posts/${slug}`);
        // const data = await response.json();
        
        // For now, we'll use the mock data
        const postData = blogPostsData[slug as keyof typeof blogPostsData];
        
        if (!postData) {
          setError(new Error('Blog post not found'));
          setPost(null);
        } else {
          setPost(postData as BlogPostDetail);
          setError(null);
        }
      } catch (err) {
        console.error('Error fetching blog post:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch blog post'));
      } finally {
        setIsLoading(false);
      }
    }

    fetchBlogPost();
  }, [slug]);

  return { post, isLoading, error };
}
