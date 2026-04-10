export interface Dish {
  id: string;
  name: string;
  images: string[];
  category: string;
  description: string;
  steps: string;
  tags: string[];
  rating: number;
  ratingCount: number;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  createTime: number;
  updateTime: number;
  favoriteCount: number;
}

export interface User {
  id: string;
  nickname: string;
  avatar: string;
  publishedCount: number;
  favoriteCount: number;
  totalLikes: number;
}

export interface MenuItem {
  dishId: string;
  dishName?: string;
  dishImage?: string;
  mealType: 'breakfast' | 'lunch' | 'dinner';
  date: string;
}
