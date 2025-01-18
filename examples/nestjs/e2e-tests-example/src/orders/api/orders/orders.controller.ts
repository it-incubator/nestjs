import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from '../../application/orders/orders.service';
import { Order } from '../../entities/order.entity';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { UserId } from '../../../auth/decorators/user-id.decorator';

@Controller('orders')
export class OrdersController {
  constructor(private readonly orderService: OrdersService) {}

  @Post()
  async create(@Body() order: Order) {
    return this.orderService.create(order);
  }

  @Get()
  async findAll() {
    return this.orderService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async updateOrder(
    @Param('id') id: string,
    @Body() orderDto: Partial<Order>,
    @UserId() userId: string,
  ) {
    return this.orderService.update(id, orderDto, userId);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.orderService.delete(id);
  }
}
