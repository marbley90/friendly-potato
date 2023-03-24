import { Module } from '@nestjs/common';
import { GeoTrackingModule } from "./geo-tracking/geo-tracking.module";

@Module({
  imports: [
      GeoTrackingModule
  ]
})
export class AppModule {}
