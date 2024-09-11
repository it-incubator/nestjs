import {InjectModel} from "@nestjs/mongoose";
import {Injectable} from "@nestjs/common";
import {Model} from "mongoose";
import {Cat} from "./entities/cat.entity";

@Injectable()
export class CatsService {
    constructor(@InjectModel(Cat.name) private catModel: Model<Cat>) {}

    async create(createCatDto: Cat): Promise<Cat> {
        const createdCat = new this.catModel(createCatDto);
        return createdCat.save();
    }

    async findAll(): Promise<Cat[]> {
        return this.catModel.find().exec();
    }
}
