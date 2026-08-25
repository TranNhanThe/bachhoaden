import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Category } from './schemas/category.schema';
import slugify from 'slugify';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>,
  ) {}

  async create(createCategoryDto: any) {
    const { name } = createCategoryDto;
    let slug = slugify(name, { lower: true, locale: 'vi' });

    // Kiểm tra và xử lý trùng Slug (Vòng lặp thần thánh của Saul)
    const originalSlug = slug;
    let counter = 1;
    while (await this.categoryModel.findOne({ slug, isDeleted: false })) {
      slug = `${originalSlug}-${counter}`;
      counter++;
    }

    const newCategory = new this.categoryModel({ ...createCategoryDto, slug });
    return await newCategory.save();
  }

  async findAll() {
    return await this.categoryModel.find({ isDeleted: false }).exec();
  }

  async findOne(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('ID danh mục không hợp lệ!');
    }
    const category = await this.categoryModel
      .findOne({ _id: id, isDeleted: false })
      .exec();
    if (!category) throw new NotFoundException('Không tìm thấy danh mục này!');
    return category;
  }

  async update(id: string, updateCategoryDto: any) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('ID không hợp lệ!');
    }

    // Nếu có cập nhật tên, chúng ta phải tính lại Slug
    if (updateCategoryDto.name) {
      let newSlug = slugify(updateCategoryDto.name, {
        lower: true,
        locale: 'vi',
      });

      // Kiểm tra xem slug mới có bị trùng với danh mục khác không
      const existing = await this.categoryModel.findOne({
        slug: newSlug,
        _id: { $ne: id }, // Không tính chính nó
      });

      if (existing) {
        newSlug = `${newSlug}-${Date.now().toString().slice(-4)}`; // Thêm muối cho an toàn
      }
      updateCategoryDto.slug = newSlug;
    }

    const updated = await this.categoryModel
      .findByIdAndUpdate(id, updateCategoryDto, {
        new: true,
        runValidators: true,
      })
      .exec();

    if (!updated) throw new NotFoundException('Không tìm thấy danh mục!');
    return updated;
  }

  async remove(id: string) {
    const deleted = await this.categoryModel.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true },
    );
    if (!deleted) throw new NotFoundException('Không có danh mục để xóa!');
    return { message: 'Đã xóa danh mục thành công' };
  }
}
