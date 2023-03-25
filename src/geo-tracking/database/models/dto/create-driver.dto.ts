import {CreateLocationDto} from "./create-location.dto";

export class CreateDriverDto {
    readonly name: string; // driver name
    readonly location: string; // name of location
    readonly timestamp: number; // unix timestamp
}
