import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Location } from "./location.schema";

export type DriverDocument = HydratedDocument<Driver>;

@Schema()
export class Driver {
    @Prop()
    name: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Location' })
    location: Location;

    @Prop()
    timestamp: number;
}

export const DriverSchema = SchemaFactory.createForClass(Driver);
