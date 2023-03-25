import { redisStore } from 'cache-manager-redis-yet';
import * as process from "process";
import { CacheModule, MiddlewareConsumer, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { RequestLoggerMiddleware } from "./middleware/request-logger-middleware";
import { AuthGuardService } from "./guards/auth.guard.service";
import { GeoTrackingController } from "./geo-tracking.controller";
import { GeoTrackingService } from "./geo-tracking.service";
import { DbOperationsService } from "./database/db-operations.service";
import { GeoTrackingConfig } from "./geo-tracking.config";
import { Geo, GeoSchema } from "./database/models/schemas/geo.schema";
import { GeoTrackingUtils } from "./utils/geo-tracking-utils";

@Module({
    imports: [
        CacheModule.registerAsync({
            useFactory: async () => ({
                store: await redisStore({
                    socket: {
                        host: process.env.REDIS_HOST,
                        port: +process.env.REDIS_PORT
                    },
                    ttl: 60
                })
            })
        }),
        MongooseModule.forFeature([{ name: Geo.name, schema: GeoSchema }])
    ],
    controllers: [
        GeoTrackingController
    ],
    providers: [
        AuthGuardService,
        GeoTrackingService,
        GeoTrackingConfig,
        DbOperationsService,
        GeoTrackingUtils
    ]
})
export class GeoTrackingModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(RequestLoggerMiddleware).forRoutes('/');
    }
}
