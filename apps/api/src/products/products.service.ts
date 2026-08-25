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
import slugify from 'slugify';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}
  // private products: IProduct[] = [...MOCK_PRODUCTS];

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const { item_name } = createProductDto;
    let slug = slugify(item_name, { lower: true, locale: 'vi' });

    // Kiểm tra và xử lý trùng Slug (Vòng lặp thần thánh của Saul)
    const originalSlug = slug;
    let counter = 1;
    while (await this.productModel.findOne({ slug, isDeleted: false })) {
      slug = `${originalSlug}-${counter}`;
      counter++;
    }

    const createdProduct = new this.productModel({ ...createProductDto, slug });
    return createdProduct.save();
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
    const product = await this.productModel
      .findById({ _id: id, isDeleted: false })
      .exec();
    if (!product) throw new NotFoundException('Không tìm thấy hàng này!');
    if (product.isDeleted) {
      // if (userRole === 'admin') {
      //   return product; // Admin vẫn thấy nhưng kèm flag isDeleted: true
      // } else {
      throw new NotFoundException('Không tìm thấy sản phẩm!');
      // }
    }
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
