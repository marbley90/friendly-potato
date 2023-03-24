import { HttpException, HttpStatus, Injectable, LoggerService } from "@nestjs/common";
import { request } from "express";
import { WebConfig } from "../web.config";

@Injectable()
export class AuthGuardService {

    constructor(private readonly loggerService: LoggerService,
                private readonly config: WebConfig) {
    }

    public isAuthorized(req: any): boolean {
        try {
            if ( !req )
                throw new HttpException('Authorization header is undefined', HttpStatus.UNAUTHORIZED);

            const valid = request.headers['authorization'] == `Bearer ${this.config.accessToken}`;

            if (valid)
                return true;
            else
                throw new HttpException('Not found', HttpStatus.UNAUTHORIZED);
        } catch (error) {
            this.loggerService.error(`Authentication failed with: ${error}`);
            throw new HttpException('Not found', HttpStatus.UNAUTHORIZED);
        }
    }
}
