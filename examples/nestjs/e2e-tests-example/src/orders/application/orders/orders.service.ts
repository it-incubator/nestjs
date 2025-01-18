import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from '../../entities/order.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<Order>,
  ) {}

  async create(orderDto: Partial<Order>): Promise<Order> {
    return this.orderModel.create(orderDto);
  }

  async findAll(): Promise<Order[]> {
    return this.orderModel.find().exec();
  }

  async findOne(id: string): Promise<Order> {
    return this.orderModel.findById(id).exec();
  }

  async update(
    id: string,
    orderDto: Partial<Order>,
    userId: string,
  ): Promise<Order> {
    const order = await this.orderModel.findById(id).exec();
    if (order.userId.toString() !== userId) {
      throw new ForbiddenException('You cannot update this order');
    }
    return this.orderModel
      .findByIdAndUpdate(id, orderDto, { new: true })
      .exec();
  }

  async delete(id: string): Promise<Order> {
    return this.orderModel.findByIdAndDelete(id).exec();
  }
}
