import { Injectable } from '@nestjs/common';
import moment = require('moment-timezone');
import { neutralDateTimeFormat } from "../domain/constants";

@Injectable()
export class GeoTrackingUtils {

    constructor() {
    }

    public formatDate(date: Date): string {
        return moment(date).format(neutralDateTimeFormat);
    }

    public formatDateLimits(dateStart: Date, dateEnd: Date): { upperLimit: number; lowerLimit: number } {
        /**
         *  The .getTime() function returns the timestamp in milliseconds,
         *  but true unix timestamps are always in seconds
         */
        const lowerLimit = parseInt((new Date(dateStart).getTime() / 1000).toFixed(0));
        const upperLimit = parseInt((new Date(dateEnd).getTime() / 1000).toFixed(0));

        return {
            lowerLimit: lowerLimit,
            upperLimit: upperLimit
        }
    }

    public constructCachePath(dataObj: any) {
        let cachePath= '';
        for (let [key, value] of Object.entries(dataObj)) {
            cachePath += `${value.toString().trim()}:`;
        }

        return `${cachePath}cached`.replace(/\s+/g, '');
    }
}

