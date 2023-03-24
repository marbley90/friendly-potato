import { MiddlewareConsumer, Module } from "@nestjs/common";
import { RequestLoggerMiddleware } from "./middleware/request-logger-middleware";
import { AuthGuardModule } from "./guards/auth.guard.module";

@Module({
    imports: [AuthGuardModule],
    controllers: [],
    providers: []
})
export class WebModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(RequestLoggerMiddleware).forRoutes('/');
    }
}
