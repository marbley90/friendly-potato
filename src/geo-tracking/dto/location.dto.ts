import { IsNotEmpty, IsString } from 'class-validator';

export class LocationDto {
    @IsNotEmpty()
    @IsString()
    readonly driverName: string;

    @IsNotEmpty()
    @IsString()
    readonly dateTimeStart: string;

    @IsNotEmpty()
    @IsString()
    readonly dateTimeEnd: string;
}
