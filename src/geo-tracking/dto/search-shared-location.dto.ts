import { IsArray, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class SearchSharedLocationDto {
    @IsNotEmpty()
    @IsNumber()
    radius: number;

    @IsNotEmpty()
    @IsArray()
    coordinates: number[];

    @IsNotEmpty()
    @IsString()
    timePeriod: string;
}
