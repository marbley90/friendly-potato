import { IsDateString, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class DeleteDataDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    readonly driverName: string;

    @IsOptional()
    @IsDateString()
    @ApiPropertyOptional({
        example: '2022-02-02 14:45:56'
    })
    dateStart: Date;

    @IsOptional()
    @IsDateString()
    @ApiPropertyOptional({
        example: '2022-02-02 14:45:56'
    })
    dateEnd: Date;
}
