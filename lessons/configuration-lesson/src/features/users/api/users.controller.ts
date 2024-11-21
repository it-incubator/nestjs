import { Body, Controller, Get, Post } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument, UserModelType } from '../domain/user.entity';
import { UserInputDTO } from './userInputDTO';

console.log('process.env.MONGO_URI: ', process.env.MONGO_URI)

@Controller()
export class UsersController {
  constructor(@InjectModel(User.name) private UserModel: UserModelType) {}

  @Get('users')
  async getAllUsers(): Promise<UserDocument[]> {
    const users = await this.UserModel.find();
    return users;
  }

  @Post('users')
  async createUser(@Body() body: UserInputDTO): Promise<UserDocument> {
    const user = new this.UserModel();
    user.login = body.login;
    user.email = body.email;
    user.isConfirmed = false;
    await user.save()
    return user;
  }

  @Get('env')
  async getEnv() {
    return {
      PORT: process.env.PORT,
      MONGO_URI: process.env.MONGO_URI,
      SHELL: process.env.SHELL,
    };
  }
}
