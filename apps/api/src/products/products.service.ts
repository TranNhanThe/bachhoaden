import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './schemas/product.schema';
import { Types } from 'mongoose';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}
  // private products: IProduct[] = [...MOCK_PRODUCTS];

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const createdProduct = new this.productModel(createProductDto);
    return createdProduct.save(); // Dữ liệu sẽ bay thẳng vào MongoDB
  }

  async findAll(): Promise<any[]> {
    const findAllProducts = await this.productModel
      .find({ isDeleted: false })
      .lean()
      .exec();
    return findAllProducts;
  }

  async findOne(id: string): Promise<Product> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Định dạng ID không hợp lệ!'); // Trả về 400 thay vì 500
    }
    const product = await this.productModel.findById({ _id: id, isDeleted: false }).exec();
    if (!product) throw new NotFoundException('Không tìm thấy hàng này!');
    return product;
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const updatedProduct = await this.productModel
      .findByIdAndUpdate(id, updateProductDto, {
        new: true, 
        runValidators: true, 
      })
      .exec();

    if (!updatedProduct) {
      throw new NotFoundException(
        `Không tìm thấy sản phẩm có ID ${id} để cập nhật!`,
      );
    }

    return updatedProduct;
  }

  async remove(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('ID không hợp lệ!');
    }

    const deletedProduct = await this.productModel
      .findByIdAndUpdate(
        id,
        { isDeleted: true, deletedAt: new Date() },
        { new: true },
      )
      .exec();

    if (!deletedProduct) {
      throw new NotFoundException(`Không tìm thấy sản phẩm ID ${id} để xóa!`);
    }

    return deletedProduct;
  }
}
