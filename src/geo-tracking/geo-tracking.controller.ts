import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpException,
    HttpStatus,
    Req,
    UseGuards,
    UsePipes,
    ValidationPipe
} from "@nestjs/common";
import { AuthGuard } from "./guards/auth.guard";
import { GetLocationResponse } from "./domain/geo-tracking.interfaces";
import { LocationDto } from "./dto/location.dto";
import { GeoTrackingService } from "./geo-tracking.service";
import { DriversDto } from "./dto/drivers.dto";
import { DeleteDataDto } from "./dto/delete-data.dto";
import { SearchSharedLocationDto } from "./dto/search-shared-location.dto";

@Controller('track')
export class GeoTrackingController {

    constructor(private readonly geoTrackingService: GeoTrackingService) {
    }

    @Get('/location')
    @UsePipes(new ValidationPipe({ transform: true }))
    @UseGuards(AuthGuard)
    async getLocation(@Body() locationDto: LocationDto, @Req() request: any): Promise<GetLocationResponse[]> {
        try {
            return await this.geoTrackingService.getDriverLocations(locationDto.driverName, locationDto.dateTimeStart, locationDto.dateTimeEnd);
        } catch (error) {
            console.error(`Failed to retrieve location for driver ${locationDto.driverName}`);
            throw new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get('/drivers')
    @UsePipes(new ValidationPipe({ transform: true }))
    @UseGuards(AuthGuard)
    async getDrivers(@Body() driversDto: DriversDto, @Req() request: any): Promise<string[]> {
        try {
            return await this.geoTrackingService.getDrivers(driversDto.location, driversDto.dateStart, driversDto.dateEnd);
        } catch (error) {
            console.error(`Failed to retrieve drivers`);
            throw new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Delete('/deletion')
    @HttpCode(HttpStatus.OK)
    @UsePipes(new ValidationPipe({ transform: true }))
    @UseGuards(AuthGuard)
    async deleteData(@Body() dataDto: DeleteDataDto, @Req() request: any): Promise<void> {
        try {
            return await this.geoTrackingService.deleteDriverLocationData(dataDto.driverName, dataDto.dateStart, dataDto.dateEnd);
        } catch (error) {
            console.error(`Failed to delete driver's ${dataDto.driverName} location data`);
            throw new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get('/shared/location')
    @UsePipes(new ValidationPipe({ transform: true }))
    @UseGuards(AuthGuard)
    async searchSharedLocations(@Body() sharedLocationDto: SearchSharedLocationDto, @Req() request: any): Promise<string[]> {
        try {
            return await this.geoTrackingService.getDriversWithSharedLocations(sharedLocationDto.radius, sharedLocationDto.coordinates, sharedLocationDto.timePeriod);
        } catch (error) {
            console.error(`Failed to retrieve shared locations of drivers`);
            throw new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
