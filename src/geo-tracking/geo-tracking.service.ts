import { Injectable } from "@nestjs/common";
import { DbOperationsService } from "./database/db-operations.service";
import {GeoTrackingUtils} from "./utils/geo-tracking-utils";

@Injectable()
export class GeoTrackingService {

    constructor(private readonly dbOperationsService: DbOperationsService,
                private readonly geoTrackingUtils: GeoTrackingUtils) {
    }

    async getDriverLocations(driverName: string, dateStart: string, dateEnd: string): Promise<any>{
        //TODO PASS the below to signature
        // const limits = this.geoTrackingUtils.formatDateLimits(dateStart, dateEnd);

        return await this.dbOperationsService.getLocationsForDriver(driverName, dateStart, dateEnd);
    }

    async getDrivers(location: string, dateStart: string, dateEnd: string): Promise<string[]>{
        // TODO add redis logic, store for 5 mins
        const limits = this.geoTrackingUtils.formatDateLimits(dateStart, dateEnd);
        await this.dbOperationsService.getDriversSameSimilarLocations(location, limits.lowerLimit, limits.upperLimit);

        return [];
    }

    async deleteDriverLocationData(driverName: string, dateStart?: string, dateEnd?: string): Promise<void>{
        await this.dbOperationsService.deleteData(driverName);
    }

    async getDriversWithSharedLocations(radius: number, coordinates: number[],timePeriod: string): Promise<string[]>{
        // TODO add redis logic, store for 5 mins
        return [];
    }
}
