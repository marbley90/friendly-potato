import {IsNotEmpty, IsString} from "class-validator";

export class DriversDto {
    @IsNotEmpty()
    @IsString()
    timePeriod: string;
}
