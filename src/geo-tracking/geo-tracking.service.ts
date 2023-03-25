import { Injectable } from "@nestjs/common";
import { getDistanceBetweenTwoPoints } from "calculate-distance-between-coordinates";
import { DbOperationsService } from "./database/db-operations.service";
import { GeoTrackingUtils } from "./utils/geo-tracking-utils";
import { GetDriversSharedLocationResp, GetLocationResponse } from "./domain/geo-tracking.interfaces";

@Injectable()
export class GeoTrackingService {

    constructor(private readonly dbOperationsService: DbOperationsService,
                private readonly geoTrackingUtils: GeoTrackingUtils) {
    }

    async getDriverLocations(driverName: string, dateStart: Date, dateEnd: Date): Promise<GetLocationResponse[]>{
        const limits = this.geoTrackingUtils.formatDateLimits(dateStart, dateEnd);

        return await this.dbOperationsService.getLocationsForDriver(driverName, limits.lowerLimit, limits.upperLimit);
    }

    async getDrivers(location: string, dateStart: Date, dateEnd: Date): Promise<string[]>{
        const limits = this.geoTrackingUtils.formatDateLimits(dateStart, dateEnd);

        return await this.dbOperationsService.getDriversSameSimilarLocations(location, limits.lowerLimit, limits.upperLimit);
    }

    async deleteDriverLocationData(driverName: string, dateStart?: Date, dateEnd?: Date): Promise<string>{
        if (!dateStart || !dateEnd) {
            return await this.dbOperationsService.deleteDriverData(driverName)
        }
        const limits = this.geoTrackingUtils.formatDateLimits(dateStart, dateEnd);

        return await this.dbOperationsService.deleteData(driverName, limits.lowerLimit, limits.upperLimit)
    }

    async getDriversWithSharedLocations(radius: number, latitude: number, longitude: number, dateStart: Date, dateEnd: Date): Promise<GetDriversSharedLocationResp[]>{
        const limits = this.geoTrackingUtils.formatDateLimits(dateStart, dateEnd);
        const driversInfo = await this.dbOperationsService.getAllDriversInSpecificPeriod(limits.lowerLimit, limits.upperLimit)

        let result: GetDriversSharedLocationResp[] = [];
        for (let info of driversInfo) {
            let distance = getDistanceBetweenTwoPoints({lat: latitude, lon: longitude}, {lat: info.latitude, lon: info.longitude});
            if (distance < radius) {
                result.push({
                    driver: info.driver,
                    location: info.location,
                    distanceFromPoint: distance
                })
            }
        }

        return result;
    }
}
