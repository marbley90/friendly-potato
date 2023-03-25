import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsDateString, IsInt, IsNotEmpty } from "class-validator";
import { Type } from "class-transformer";

export class SearchSharedLocationDto {
    @IsNotEmpty()
    @Type(() => Number)
    @IsInt()
    @ApiProperty()
    radius: number;

    @IsNotEmpty()
    @Type(() => Number)
    @IsInt()
    @ApiProperty({
        minimum: -90,
        maximum: 90
    })
    latitude: number;

    @IsNotEmpty()
    @Type(() => Number)
    @IsInt()
    @ApiProperty({
        minimum: 0,
        maximum: 180
    })
    longitude: number;

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
