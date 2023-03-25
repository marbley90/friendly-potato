import { IsDateString, IsNotEmpty, IsString } from "class-validator";
import {ApiProperty, ApiPropertyOptional} from "@nestjs/swagger";

export class DriversDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    location: string;

    @IsNotEmpty()
    @IsDateString()
    @ApiPropertyOptional({
        example: '2022-02-02 14:45:56'
    })
    dateStart: Date;

    @IsNotEmpty()
    @IsDateString()
    @ApiPropertyOptional({
        example: '2022-02-02 14:45:56'
    })
    dateEnd: Date;
}
