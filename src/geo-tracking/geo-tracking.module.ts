import { CacheModule, MiddlewareConsumer, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { RequestLoggerMiddleware } from "./middleware/request-logger-middleware";
import { AuthGuardService } from "./guards/auth.guard.service";
import { GeoTrackingController } from "./geo-tracking.controller";
import { GeoTrackingService } from "./geo-tracking.service";
import { DbOperationsService } from "./database/db-operations.service";
import { GeoTrackingConfig } from "./geo-tracking.config";
import { Location, LocationSchema } from "./database/models/schemas/location.schema";

@Module({
    imports: [
        CacheModule.register(),
        MongooseModule.forFeature([{ name: Location.name, schema: LocationSchema }])
    ],
    controllers: [
        GeoTrackingController
    ],
    providers: [
        AuthGuardService,
        GeoTrackingService,
        GeoTrackingConfig,
        DbOperationsService
    ]
})
export class GeoTrackingModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(RequestLoggerMiddleware).forRoutes('/');
    }
}
