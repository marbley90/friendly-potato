import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type LocationDocument = HydratedDocument<Location>;
@Schema()
export class Location {
    @Prop()
    name: string;

    @Prop()
    latitude: number;

    @Prop()
    longitude: number;
}
export const LocationSchema = SchemaFactory.createForClass(Location);
