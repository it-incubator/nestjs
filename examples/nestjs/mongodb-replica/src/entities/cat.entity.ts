import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import {ApiProperty} from "@nestjs/swagger";

export type CatDocument = HydratedDocument<Cat>;

@Schema()
export class Cat {
    @Prop()
    @ApiProperty()
    name: string;

    @Prop()
    @ApiProperty()
    age: number;

    @Prop()
    @ApiProperty()
    breed: string;
}

export const CatSchema = SchemaFactory.createForClass(Cat);