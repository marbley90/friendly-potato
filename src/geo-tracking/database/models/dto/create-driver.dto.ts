export class CreateDriverDto {
    readonly driver: string; // driver name
    readonly location: string; // name of location
    readonly coordinates: number[]; // format [lat, long]
    readonly timestamp: number; // unix timestamp
}
