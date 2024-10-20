interface Image {
  url: string;
  width: number;
  height: number;
  name: string;
  alt_text: string;
  aspect_ratio: string;
}

interface Author {
  name: string;
  author_title: string;
  author_image: Image;
}

export interface NewsNewsLetter {
  _id: string;
  _type: string;
  title: string;
  scheduled_date: string;
  slug: string;
  feature_content: boolean;
  description: string;
  authors: Array<Author>;
  content?: string;
  category: string;
  news_image: Image;
}

export interface OldNewsletter {
  letter_fyi: Array<{ title: string; description: string }>;
  letter_tech_insights: Array<{ title: string; description: string }>;
  letter_info: Array<{ title: string; description: string }>;
  letter_title: string;
  letter_description: string;
  scheduled_post_date: string;
  letter_member_highlight: {
    title: string;
    description: string;
  };
  slug: string;
}
