import { CACHE_MANAGER, Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Geo, GeoDocument } from "./models/schemas/geo.schema";
import {LocationByDriverResp} from "./database-domain/database-domain.interfaces";
import {GeoTrackingUtils} from "../utils/geo-tracking-utils";

@Injectable()
export class DbOperationsService {

    constructor(@InjectModel(Geo.name) private geoModel: Model<GeoDocument>,
                private readonly geoTrackingUtils: GeoTrackingUtils) {
    }

    async getLocationsForDriver(driverName: string, dateStart: string, dateEnd: string): Promise<any> {
        try {
            const locationInfo = await this.geoModel.find(
                {$and: [{driver: driverName}, {timestamp: {$gte: dateStart, $lte: dateEnd}}]},
                'location timestamp')
                .sort('timestamp')
                .exec();

            let responseObj = [{
                location: null,
                timestamp: null
            }];
            for (let info of locationInfo) {
                responseObj.push({
                    location: info.location,
                    timestamp: this.geoTrackingUtils.formatDate(new Date(info.timestamp))
                });
            }

            return responseObj;
        } catch (error) {
            throw new Error(`An error occurred during fetching locations for driver ${driverName}`);
        }
    }

    async getDriversSameSimilarLocations(location: string, dateStart: number, dateEnd: number): Promise<string[]> {
        try {
            const driversSameSimilarLocations = await this.geoModel.find(
                {$and: [{timestamp: {$gte: dateStart, $lte: dateEnd}}, {location: `/${location}/`}]},
                'driver')
                .exec();

            let responseObj = []
            for (let driver of driversSameSimilarLocations) {
                responseObj.push(driver.driver);
            }

            return responseObj;
        } catch (error) {
            throw new Error(`An error occurred during fetching drivers that passed from similar/same locations for specific period of time`);
        }
    }

    async deleteData(driverName: string, timestampStart?: number, timestampEnd?: number) {
        try {
            if (!timestampStart || !timestampEnd) {
                await this.geoModel.deleteMany({driver: driverName}).exec();
            } else {
                await this.geoModel.deleteMany(
                    {$and: [{driver: driverName}, {timestamp: {$gte: timestampStart, $lte: timestampEnd}}]})
                    .exec();
            }
        } catch (error) {
            throw new Error(`An error occurred during deletion`);
        }
    }
}
