
import { IProduct } from '@repo/shared';

export const MOCK_PRODUCTS: IProduct[] = [
  {
    id: "bh001",
    item_name: "Mì Hảo Hảo Tôm Chua Cay",
    category_id: "cat_food",
    images: ["https://picsum.photos/200/300"],
    price: 4500,
    quantity: 100,
    description: "Món ăn quốc dân của mọi lập trình viên đêm khuya.",
    rating: 4.9,
    discount: 5
  },
  {
    id: "bh002",
    item_name: "Sting Dâu Đỏ",
    category_id: "cat_drink",
    images: ["https://picsum.photos/200/301"],
    price: 10000,
    quantity: 50,
    description: "Nguồn năng lượng để fix bug xuyên màn đêm.",
    rating: 4.8,
    discount: 0
  }
];