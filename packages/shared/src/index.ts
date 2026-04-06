export interface IProduct {
  id: string;
  item_name: string;
  category_id: string;
  images: string[];
  price: number;
  quantity: number;
  description: string;
  rating: number;
  discount: number;
}

export interface ICategory {
  id: string;
  name: string;
  slug: string;
}