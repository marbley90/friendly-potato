import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { GeoTrackingConfig } from "../geo-tracking.config";

@Injectable()
export class AuthGuardService {

    constructor(private readonly config: GeoTrackingConfig) {
    }
    public isAuthorized(req: any): boolean {
        if (!req)
            throw new HttpException('Authorization header is undefined', HttpStatus.UNAUTHORIZED);

        try {
            const valid = req.headers['authorization'] == `Bearer ${this.config.accessToken}`;
            if (valid) {
                return true;
            } else {
                throw new HttpException('Not found', HttpStatus.UNAUTHORIZED);
            }
        } catch (error) {
            console.error(`Authentication failed with: ${error}`);
            throw new HttpException('Not found', HttpStatus.UNAUTHORIZED);
        }
    }
}
