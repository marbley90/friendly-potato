import { MiddlewareConsumer, Module } from "@nestjs/common";
import { RequestLoggerMiddleware } from "./middleware/request-logger-middleware";
import { AuthGuardService } from "./guards/auth.guard.service";
import { GeoTrackingController } from "./geo-tracking.controller";
import {GeoTrackingService} from "./geo-tracking.service";

@Module({
    imports: [],
    controllers: [GeoTrackingController],
    providers: [
        AuthGuardService,
        GeoTrackingService
    ]
})
export class GeoTrackingModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(RequestLoggerMiddleware).forRoutes('/');
    }
}
