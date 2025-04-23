import { Body, Controller, Get, Post } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument, UserModelType } from '../domain/user.entity';
import { UserInputDTO } from './userInputDTO';
import { UsersConfig } from '../config/users.config';

console.log('process.env.MONGO_URI: ', process.env.MONGO_URI);

@Controller('users')
export class UsersController {
  constructor(
    @InjectModel(User.name) private UserModel: UserModelType,
    private usersConfig: UsersConfig,
  ) {}

  @Get('')
  async getAllUsers(): Promise<UserDocument[]> {
    const users = await this.UserModel.find();
    return users;
  }

  @Post('')
  async createUser(@Body() body: UserInputDTO): Promise<UserDocument> {
    const user = new this.UserModel();
    user.login = body.login;
    user.email = body.email;
    user.isConfirmed = this.usersConfig.isAutomaticallyConfirmed;
    await user.save();
    return user;
  }
}
