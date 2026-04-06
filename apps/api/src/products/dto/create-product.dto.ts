import { IProduct } from '@repo/shared';
export class CreateProductDto implements Omit<IProduct, 'id'> {
  item_name!: string;
  category_id!: string;
  images!: string[];
  price!: number;
  quantity!: number;
  description!: string;
  rating!: number;
  discount!: number;
}
