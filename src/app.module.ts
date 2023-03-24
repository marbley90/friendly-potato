import { Module } from '@nestjs/common';
import { MongooseModule } from "@nestjs/mongoose";
import { GeoTrackingModule } from "./geo-tracking/geo-tracking.module";

@Module({
  imports: [
      MongooseModule.forRoot(process.env.DATABASE_URL, {
          connectionName: 'drivers'
      }),
      GeoTrackingModule
  ]
})
export class AppModule {}
