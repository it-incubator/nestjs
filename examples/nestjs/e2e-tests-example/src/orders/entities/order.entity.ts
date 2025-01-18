import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Order extends Document {
  @Prop({ required: true })
  orderId: string;

  @Prop({ required: true })
  product: string;

  @Prop({ default: new Date() })
  orderDate: Date;

  @Prop({ type: Types.ObjectId, required: true })
  userId: Types.ObjectId;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
