import { Injectable } from "@nestjs/common";
import { Days } from "./domain/geo-tracking.types";
import { GetLocationResponse } from "./domain/geo-tracking.interfaces";
import { DbOperationsService } from "./database/db-operations.service";

@Injectable()
export class GeoTrackingService {

    constructor(private readonly dbOperationsService: DbOperationsService) {
    }

    //TODO for test
    async getAllLocations(): Promise<any>{
        const locations = await this.dbOperationsService.getAllLocations();

        return locations;
    }

    async getDriverLocations(driverName?: string, day?: Days): Promise<GetLocationResponse[]>{
        // TODO add redis logic, store for 5 mins
        return [];
    }

    async getDrivers(timePeriod: string): Promise<string[]>{
        // TODO add redis logic, store for 5 mins
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
        // TODO add redis logic, store for 5 mins
        return [];
    }
}
