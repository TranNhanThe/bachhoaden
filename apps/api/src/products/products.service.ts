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
    const product = this.products.find((p) => p.id === id);
    if (!product) throw new NotFoundException('Không tìm thấy hàng này!');
    return product;
  }

  update(id: string, updateProductDto: UpdateProductDto) {
    const index = this.products.findIndex((p) => p.id === id);

    if (index === -1) {
      throw new NotFoundException(
        `Không tìm thấy hàng có ID ${id} để cập nhật!`,
      );
    }

    this.products[index] = {
      ...this.products[index],
      ...updateProductDto,
    };

    return this.products[index];
  }

  remove(id: string) {
    const index = this.products.findIndex((p) => p.id === id);

    if (index === -1) {
      throw new NotFoundException(`Không tìm thấy hàng có ID ${id} để xóa!`);
    }

    this.products = this.products.filter((p) => p.id !== id);

    return {
      message: `Đã xóa thành công sản phẩm có ID: ${id}`,
      deletedId: id,
    };
  }
}
