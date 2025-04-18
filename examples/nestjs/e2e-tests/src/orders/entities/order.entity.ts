import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, Types } from 'mongoose';

@Schema()
export class Order extends Document {
  @Prop({ required: true })
  orderId: string;

  @Prop({ required: true })
  product: string;

  @Prop({ default: new Date() })
  orderDate: Date;

  @Prop({ type: Types.ObjectId, required: true })
  userId: ObjectId;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
