export type Post = {
  id: string;
  slug: string;
  title: string;
  date: string;
  image: string;
  category: string;
  excerpt?: string;
  content?: string;
  featured_media?: {
    source_url: string;
  },

  categories?:
  {
    count: number;
    id: string;
    name: string;
    slug: string;
  }[],

  isFirst?: boolean;
}
