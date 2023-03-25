import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Geo, GeoDocument } from "./models/schemas/geo.schema";
import { GeoTrackingUtils } from "../utils/geo-tracking-utils";
import { GetLocationResponse } from "../domain/geo-tracking.interfaces";

@Injectable()
export class DbOperationsService {

    constructor(@InjectModel(Geo.name) private geoModel: Model<GeoDocument>,
                private readonly geoTrackingUtils: GeoTrackingUtils) {
    }

    async getLocationsForDriver(driverName: string, dateStart: number, dateEnd: number): Promise<GetLocationResponse[]> {
        try {
            const queryResult = await this.geoModel.find(
                {$and: [{driver: driverName}, {timestamp: {$gte: dateStart, $lte: dateEnd}}]},
                {"location": 1, "timestamp": 1})
                .sort({"timestamp": 1})
                .exec();

            let responseObj = [];
            for (let info of queryResult) {
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
            const query = {$and: [{timestamp: {$gte: dateStart, $lte: dateEnd}}, {location: { $regex: '.*' + location + '.*' }}]};

            return await this.geoModel.distinct("driver", query).exec();
        } catch (error) {
            throw new Error(`An error occurred during fetching drivers that passed from similar/same locations for specific period of time`);
        }
    }

    async deleteDriverData(driverName: string): Promise<string> {
        return await this.deleteData(driverName);
    }

    async deleteData(driverName: string, timestampStart?: number, timestampEnd?: number): Promise<string> {
        try {
            if (!timestampStart || !timestampEnd) {
                await this.geoModel.deleteMany({driver: driverName}).exec();
            } else {
                await this.geoModel.deleteMany(
                    {$and: [{driver: driverName}, {timestamp: {$gte: timestampStart, $lte: timestampEnd}}]})
                    .exec();
            }

            return 'OK';
        } catch (error) {
            throw new Error(`An error occurred during deletion`);
        }
    }
    
    async getAllDriversInSpecificPeriod(dateStart: number, dateEnd: number): Promise<any> {
        try {
            const queryResult = await this.geoModel.find(
                {$and: [{timestamp: {$gte: dateStart, $lte: dateEnd}}]},
                {"driver": 1, "coordinates": 1, "location": 1})
                .exec();

            let info = [];
            for (let res of queryResult) {
                if (!res.coordinates || !res.coordinates.length || !res.driver || !res.location)
                    continue;

                info.push({
                    driver: res.driver,
                    latitude: res.coordinates[0],
                    longitude: res.coordinates[1],
                    location: res.location
                });
            }

            return info;
        } catch (error) {
            throw new Error(`An error occurred during fetching all drivers`);
        }
    }
}
