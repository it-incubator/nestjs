import {InjectModel} from "@nestjs/mongoose";
import {Injectable} from "@nestjs/common";
import {Model} from "mongoose";
import {Cat} from "./entities/cat.entity";

@Injectable()
export class CatsService {
    constructor(
        @InjectModel(Cat.name, 'write') private catModelWrite: Model<Cat>,
        @InjectModel(Cat.name, 'read') private catModelRead: Model<Cat>,
        ) {}

    async create(createCatDto: Cat): Promise<Cat> {
        const createdCat = new this.catModelWrite(createCatDto);
        console.log('before save')
        const saveResult = await createdCat.save();
        console.log('save result')
        return saveResult;
    }

    async findAll(): Promise<Cat[]> {
        return this.catModelRead.find().exec();
    }
}
