import {Injectable, Logger, NestMiddleware} from "@nestjs/common";
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
    private logger = new Logger('HTTP');
    constructor() {
    }

    use(req: Request, res: Response, next: NextFunction) {
        this.logger.log(`[${req.originalUrl}]`);
        next();
    }
}
