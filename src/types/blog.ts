
export interface BlogPost {
  id: number;
  title: string;
  subtitle: string;  
  slug: string;
  excerpt: string;
  embedUrl: string;
  author?: string;     // Added optional author property
  publishDate?: string; // Added optional publishDate property
  linkedinPostUrl?: string; // Added optional linkedinPostUrl property
}
