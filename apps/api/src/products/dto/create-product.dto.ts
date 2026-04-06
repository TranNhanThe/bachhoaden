import { IProduct } from '@repo/shared';
import {
  IsString,
  IsNumber,
  IsArray,
  IsUrl,
  Min,
  Max,
  IsNotEmpty,
} from 'class-validator';
export class CreateProductDto implements Omit<IProduct, 'id'> {
  @IsString({ message: 'Tên sản phẩm phải là chuỗi ký tự' })
  @IsNotEmpty({ message: 'Tên sản phẩm không được để trống' })
  item_name!: string;

  @IsString()
  category_id!: string;

  @IsArray()
  @IsUrl(
    {},
    { each: true, message: 'Mỗi hình ảnh phải là một đường link hợp lệ' },
  )
  images!: string[];

  @IsNumber()
  @Min(0, { message: 'Giá không được nhỏ hơn 0' })
  price!: number;

  @IsNumber()
  @Min(0, { message: 'Số lượng không được nhỏ hơn 0' })
  quantity!: number;

  @IsString()
  description!: string;

  @IsNumber()
  @Min(0)
  @Max(5)
  rating!: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  discount!: number;
}
