import {HydratedDocument} from "mongoose";
import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";

export type GeoDocument = HydratedDocument<Geo>;
@Schema()
export class Geo {
    @Prop()
    driver: string;

    @Prop()
    location: number;

    @Prop([Number])
    coordinates: number[];

    @Prop()
    timestamp: number;
}
export const GeoSchema = SchemaFactory.createForClass(Geo);
