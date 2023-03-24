import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type DriverDocument = HydratedDocument<Driver>;

@Schema()
export class Driver {
    @Prop()
    driver: string;

    @Prop()
    location: string;

    @Prop([Number])
    coordinates: number[];

    @Prop()
    timestamp: number;
}

export const CatSchema = SchemaFactory.createForClass(Driver);
