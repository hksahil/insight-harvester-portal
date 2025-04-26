
export interface BlogPost {
  id: number;
  title: string;
  subtitle: string;
  slug: string;
  author: string;
  publishDate: string;
}

export interface BlogPostDetail extends BlogPost {
  content: string;
}
