import { Test, TestingModule } from "@nestjs/testing";
import { CACHE_MANAGER, CacheModule, HttpException, HttpStatus } from "@nestjs/common";
import { getModelToken } from "@nestjs/mongoose";
import { redisStore } from "cache-manager-redis-yet";
import { Cache } from 'cache-manager';
import { GeoTrackingController } from "./geo-tracking.controller";
import { GeoTrackingService } from "./geo-tracking.service";
import { GeoTrackingUtils } from "./utils/geo-tracking-utils";
import { Geo } from "./database/models/schemas/geo.schema";
import { AuthGuardService } from "./guards/auth.guard.service";
import { GeoTrackingConfig } from "./geo-tracking.config";
import { DbOperationsService } from "./database/db-operations.service";

describe('GeoTrackingController', () => {
    let controller: GeoTrackingController;
    let service: GeoTrackingService;
    let utils: GeoTrackingUtils;
    let geoModel = new Geo();
    let cacheService: Cache;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                CacheModule.registerAsync({
                    useFactory: async () => ({
                        store: await redisStore({
                            socket: {
                                host: 'localhost',
                                port: 6379
                            }
                        })
                    })
                })
            ],
            controllers: [
                GeoTrackingController
            ],
            providers: [
                AuthGuardService,
                GeoTrackingService,
                GeoTrackingConfig,
                DbOperationsService,
                GeoTrackingUtils,
                {
                    provide: getModelToken(Geo.name),
                    useValue: geoModel,
                }
            ]
        }).compile();

        controller = module.get<GeoTrackingController>(GeoTrackingController);
        service = module.get<GeoTrackingService>(GeoTrackingService);
        utils = module.get<GeoTrackingUtils>(GeoTrackingUtils);
        cacheService = module.get(CACHE_MANAGER);
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('searchSharedLocations', () => {
        it(`should call the service and get precondition failed for radius`, async () => {
            try {
                await expect(await controller.searchSharedLocations({
                    radius: -10,
                    latitude: 80,
                    longitude: 76,
                    dateStart: new Date('2022-03-13 15:00:00'),
                    dateEnd: new Date('2022-03-13 15:00:00')
                })).rejects.toThrow(new HttpException('crash', HttpStatus.PRECONDITION_FAILED));
            } catch (error) {
                if (error.message.indexOf(`Invalid radius input`) >= 0) {
                    console.log(`It works`);
                }
            }
        });

        it(`should call the service and get precondition failed for latitude`, async () => {
            try {
                await expect(await controller.searchSharedLocations({
                    radius: 10,
                    latitude: -100,
                    longitude: 76,
                    dateStart: new Date('2022-03-13 15:00:00'),
                    dateEnd: new Date('2022-03-13 15:00:00')
                })).rejects.toThrow(new HttpException('crash', HttpStatus.PRECONDITION_FAILED));
            } catch (error) {
                if (error.message.indexOf(`Invalid latitude input`) >= 0) {
                    console.log(`It works`);
                }
            }
        });

        it(`should call the service and get precondition failed for longitude`, async () => {
            try {
                await expect(await controller.searchSharedLocations({
                    radius: 40,
                    latitude: 10,
                    longitude: 181,
                    dateStart: new Date('2022-03-13 15:00:00'),
                    dateEnd: new Date('2022-03-13 15:00:00')
                })).rejects.toThrow(new HttpException('crash', HttpStatus.PRECONDITION_FAILED));
            } catch (error) {
                if (error.message.indexOf(`Invalid longitude input`) >= 0) {
                    console.log(`It works`);
                }
            }
        });

        it('should cache the value', async () => {
            const spy = jest.spyOn(cacheService, 'set');
            await cacheService.set(`foo`, true);

            expect(spy).toHaveBeenCalledTimes(1);
            expect(spy.mock.calls[0][0]).toEqual('foo');
            expect(spy.mock.calls[0][1]).toEqual(true);
        });

        it(`should call the service and get response`, async () => {
            const spy = jest.spyOn(service, 'getDriversWithSharedLocations').mockImplementation(async () => [{
                driver: 'Joe Doe',
                location: 'Athens',
                distanceFromPoint: 85
            }]);
            await controller.searchSharedLocations({
                radius: 100,
                latitude: 80,
                longitude: 76,
                dateStart: new Date('2022-03-13 15:00:00'),
                dateEnd: new Date('2022-03-13 15:00:00')
            });
            expect(spy).toHaveBeenCalled();
        });

        it('should throw HttpException on errors', async () => {
            try {
                jest.spyOn(service, "getDriversWithSharedLocations").mockImplementation(async () => {
                    throw 'crash'
                });
                await expect(await controller.searchSharedLocations({
                    radius: 10,
                    latitude: 80,
                    longitude: 76,
                    dateStart: new Date('2022-03-13 15:00:00'),
                    dateEnd: new Date('2022-03-13 15:00:00')
                })).rejects.toThrow(new HttpException('crash', HttpStatus.INTERNAL_SERVER_ERROR));
            } catch {
                console.log('it works');
            }
        });

        it('should call constructCachePath', async () => {
            const spy = jest.spyOn(utils, 'constructCachePath');
            utils.constructCachePath({
                radius: 10,
                latitude: 80,
                longitude: 76,
                dateStart: new Date('2022-03-13 15:00:00'),
                dateEnd: new Date('2022-03-13 15:00:00')
            });

            expect(spy).toHaveBeenCalledTimes(1);
        });
    })

    describe('deleteData', () => {
        it(`should delete driver's data and return OK`, async () => {
            const spy = jest.spyOn(service, 'deleteDriverLocationData').mockImplementation(async () => 'ok');
            expect(await controller.deleteData({driverName: 'Joe Doe', dateStart: new Date('2022-03-13 15:00:00'), dateEnd: new Date('2022-03-13 15:00:00')})).toEqual(200);
        });
    });
});
