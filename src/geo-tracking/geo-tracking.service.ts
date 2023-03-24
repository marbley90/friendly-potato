import { Injectable } from "@nestjs/common";
import {Days} from "./domain/geo-tracking.types";
import {GetLocationResponse} from "./domain/geo-tracking.interfaces";

@Injectable()
export class GeoTrackingService {

    constructor() {
    }

    async getDriverLocations(driverName: string, day: Days): Promise<GetLocationResponse[]>{
        return [];
    }

    async getDrivers(timePeriod: string): Promise<string[]>{
        return [];
    }

    async deleteDriverLocationData(driverName: string, timePeriod?: string): Promise<void>{
        if (timePeriod) {
            // delete specific period
        } else {
            // erase all data
        }
    }

    async getDriversWithSharedLocations(radius: number, coordinates: number[],timePeriod: string): Promise<string[]>{
        return [];
    }
}
