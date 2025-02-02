import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from '../../entities/order.entity';
import { User } from '../../../auth/entities/user.entity';
import { MailService } from '../../../common/services/mail.service';
import { CreateOrderDTO } from '../../dto/create-order.dto';
import { UpdateUserDTO } from '../../../auth/dto/update-user.dto';
import { UpdateOrderDTO } from '../../dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<Order>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly mailService: MailService,
  ) {}

  async create(orderDto: Partial<CreateOrderDTO>): Promise<Order> {
    const order = await this.orderModel.create(orderDto);

    const user = await this.userModel.findById(orderDto.userId).exec();
    if (user) {
      this.mailService.send(
        user.email,
        'Order Confirmation',
        `Your order with ID ${order.orderId} has been received.`,
      );
    }

    return order;
  }

  async findAll(): Promise<Order[]> {
    return this.orderModel.find().exec();
  }

  async findOne(id: string): Promise<Order> {
    return this.orderModel.findById(id).exec();
  }

  async update(
    id: string,
    orderDto: Partial<UpdateOrderDTO>,
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
