interface Article {
  slug: string;
  title: string;
  description: string;
  body?: string;
  tagList: string[];
  createdAt: string;
  updatedAt: string;
  favoritesCount: number;
  favorited?: boolean;
  author: User;
}

interface User {
  username: string;
  bio: string;
  image: string;
  following?: boolean;
}

interface AuthActionResult {
  token: string;
}
