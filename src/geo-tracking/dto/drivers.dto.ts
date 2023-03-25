import { IsNotEmpty, IsString } from "class-validator";

export class DriversDto {
    @IsNotEmpty()
    @IsString()
    location: string;

    @IsNotEmpty()
    @IsString()
    dateStart: string;

    @IsNotEmpty()
    @IsString()
    dateEnd: string;
}
