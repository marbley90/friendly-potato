import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Days } from "../domain/geo-tracking.types";

export class LocationDto {
    @IsNotEmpty()
    @IsString()
    readonly driverName: string;

    @IsNotEmpty()
    @IsEnum(Days)
    readonly day: Days;
}
