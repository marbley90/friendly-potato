import { IsDateString, IsNotEmpty, IsString } from 'class-validator';
import {ApiProperty, ApiPropertyOptional} from "@nestjs/swagger";

export class LocationDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    readonly driverName: string;

    @IsNotEmpty()
    @IsDateString()
    @ApiPropertyOptional({
        example: '2022-02-02 14:45:56'
    })
    readonly dateTimeStart: Date;

    @IsNotEmpty()
    @IsDateString()
    @ApiPropertyOptional({
        example: '2022-02-02 14:45:56'
    })
    readonly dateTimeEnd: Date;
}
