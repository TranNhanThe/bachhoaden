import { Injectable, NotFoundException } from '@nestjs/common';
import { IProduct } from '@repo/shared';
import { MOCK_PRODUCTS } from './products.mock';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  private products: IProduct[] = [...MOCK_PRODUCTS];
  create(createProductDto: CreateProductDto) {
    const newProduct: IProduct = {
      id: `bh_${Date.now()}`, // Tạo ID tạm thời bằng timestamp
      ...createProductDto,
    };

    this.products.push(newProduct); // Thêm vào "kho"
    return newProduct;
    // return { message: 'Đã thêm hàng mới vào kho!', data: createProductDto };
  }

 findAll(): IProduct[] {
    return this.products;
  }

  findOne(id: string): IProduct {
    const product = this.products.find(p => p.id === id);
    if (!product) throw new NotFoundException('Không tìm thấy hàng này!');
    return product;
  }

  update(id: string, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: string) {
    return `This action removes a #${id} product`;
  }
}
