
export interface BlogPost {
  id: number;
  title: string;
  subtitle: string;
  slug: string;
  author: string;
  publishDate: string;
  linkedinPostUrl: string;
}

// Remove BlogPostDetail since we don't need content anymore
