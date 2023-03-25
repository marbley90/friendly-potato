import {
    CACHE_MANAGER,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpException,
    HttpStatus,
    Inject,
    Query,
    UseGuards,
    UsePipes,
    ValidationPipe
} from "@nestjs/common";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Cache } from 'cache-manager';
import { AuthGuard } from "./guards/auth.guard";
import { GetDriversSharedLocationResp, GetLocationResponse } from "./domain/geo-tracking.interfaces";
import { LocationDto } from "./dto/location.dto";
import { GeoTrackingService } from "./geo-tracking.service";
import { DriversDto } from "./dto/drivers.dto";
import { DeleteDataDto } from "./dto/delete-data.dto";
import { SearchSharedLocationDto } from "./dto/search-shared-location.dto";
import {
    latLowerLimit,
    latUpperLimit,
    longLowerLimit,
    longUpperLimit
} from "./domain/constants";
import { GeoTrackingUtils } from "./utils/geo-tracking-utils";

@ApiBearerAuth()
@ApiTags('Geo Tracking')
@Controller('track')
export class GeoTrackingController {

    constructor(@Inject(CACHE_MANAGER) private cacheService: Cache,
                private readonly geoTrackingService: GeoTrackingService,
                private readonly geoTrackingUtils: GeoTrackingUtils) {
    }

    @Get('/location')
    @UsePipes(new ValidationPipe({ transform: true }))
    @UseGuards(AuthGuard)
    @ApiResponse({
        status: 200,
        description: 'Given a driver name and a period of time (in ISO 8601 Format, eg. 2010-01-20 13:45:43), returns all location nodes which the driver visited as a time sorted path',
        type: Array,
    })
    async getLocation(@Query() locationDto: LocationDto): Promise<GetLocationResponse[]> {
        console.info(`Get locations, a driver passed in [${locationDto.dateTimeStart} - ${locationDto.dateTimeEnd}] time period`);

        try {
            const cachePath = this.geoTrackingUtils.constructCachePath(locationDto);
            const cachedResp = await this.cacheService.get(cachePath);
            if (cachedResp)  return cachedResp as GetLocationResponse[];

            const driverLocations = await this.geoTrackingService.getDriverLocations(locationDto.driverName, locationDto.dateTimeStart, locationDto.dateTimeEnd);
            await this.cacheService.set(cachePath, driverLocations, 5 * 60 * 1000);

            return driverLocations;
        } catch (error) {
            console.error(`Failed to retrieve location for driver ${locationDto.driverName}`, error);
            throw new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get('/drivers')
    @UsePipes(new ValidationPipe({ transform: true }))
    @UseGuards(AuthGuard)
    @ApiResponse({
        status: 200,
        description: 'Returns all drivers who during a given time period passed either (i) by exactly the same location name, (ii) by locations whose name contain a keyword',
        type: Array,
    })
    async getDrivers(@Query() driversDto: DriversDto): Promise<string[]> {
        console.info(`Get drivers who passed from a location in [${driversDto.dateStart} - ${driversDto.dateEnd}] time period`);

        try {
            const cachePath = this.geoTrackingUtils.constructCachePath(driversDto);
            const cachedResp = await this.cacheService.get(cachePath);
            if (cachedResp)  return cachedResp as string[];

            const drivers = await this.geoTrackingService.getDrivers(driversDto.location, driversDto.dateStart, driversDto.dateEnd);
            await this.cacheService.set(cachePath, drivers, 5 * 60 * 1000);

            return drivers;
        } catch (error) {
            console.error(`Failed to retrieve drivers`, error);
            throw new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Delete('/delete')
    @HttpCode(HttpStatus.OK)
    @UsePipes(new ValidationPipe({ transform: true }))
    @UseGuards(AuthGuard)
    @ApiResponse({
        status: 200,
        description: `Delete a driver's location data (either all data or data during a given time period)`,
    })
    async deleteData(@Query() dataDto: DeleteDataDto): Promise<HttpStatus> {
        try {
            console.info(`Delete drivers ${dataDto.driverName} location data`);
            await this.geoTrackingService.deleteDriverLocationData(dataDto.driverName, dataDto.dateStart, dataDto.dateEnd);

            return HttpStatus.OK;
        } catch (error) {
            console.error(`Failed to delete driver's ${dataDto.driverName} location data`, error);
            throw new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get('/location/shared')
    @UsePipes(new ValidationPipe({ transform: true }))
    @UseGuards(AuthGuard)
    @ApiResponse({
        status: 200,
        description: 'Returns all drivers who share a location, in a radius of X meters/kilometers distance away from given location coordinates, during a given time period',
        isArray: true
    })
    async searchSharedLocations(@Query() sharedLocationDto: SearchSharedLocationDto): Promise<GetDriversSharedLocationResp[]> {
        console.info(`Get shared location`);

        if (sharedLocationDto.radius < 0)
            throw new HttpException(`Invalid radius input`, HttpStatus.PRECONDITION_FAILED);

        if (sharedLocationDto.longitude < longLowerLimit || sharedLocationDto.longitude > longUpperLimit)
            throw new HttpException(`Invalid longitude input`, HttpStatus.PRECONDITION_FAILED);

        if (sharedLocationDto.latitude < latLowerLimit || sharedLocationDto.latitude > latUpperLimit)
            throw new HttpException(`Invalid latitude input`, HttpStatus.PRECONDITION_FAILED);
        try {
            const cachePath = this.geoTrackingUtils.constructCachePath(sharedLocationDto);
            const cachedResponse = await this.cacheService.get(cachePath);
            if (cachedResponse)  return cachedResponse as GetDriversSharedLocationResp[];

            const sharedLocations = await this.geoTrackingService.getDriversWithSharedLocations(sharedLocationDto.radius, sharedLocationDto.latitude, sharedLocationDto.longitude, sharedLocationDto.dateStart, sharedLocationDto.dateEnd);
            await this.cacheService.set(cachePath, sharedLocations, 5 * 60 * 1000);

            return sharedLocations;
        } catch (error) {
            console.error(`Failed to retrieve shared locations of drivers`, error);
            throw new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
