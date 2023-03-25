import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { LocationDocument, Location } from "./models/schemas/location.schema";

@Injectable()
export class DbOperationsService {

    constructor(@InjectModel(Location.name) private locationModel: Model<LocationDocument>) {
    }

    async getAllLocations() {
        return await this.locationModel.find().exec();
    }
}
