import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class DeleteDataDto {
    @IsNotEmpty()
    @IsString()
    readonly driverName: string;

    @IsOptional()
    @IsString()
    dateStart: string;

    @IsOptional()
    @IsString()
    dateEnd: string;
}
