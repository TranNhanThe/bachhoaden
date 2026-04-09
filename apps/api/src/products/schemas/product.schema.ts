import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Product extends Document {
  @Prop({ required: true })
  item_name!: string;

  @Prop({ required: true })
  category_id!: string;

  @Prop([String])
  images!: string[];

  @Prop({ required: true, min: 0 })
  price!: number;

  @Prop({ default: 0 })
  quantity!: number;

  @Prop()
  description!: string;

  @Prop({ default: 0 })
  rating!: number;

  @Prop({ default: 0 })
  discount!: number;

  @Prop({ default: false })
  isDeleted!: boolean;

  @Prop()
  deletedAt?: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
