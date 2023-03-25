export interface GetLocationResponse {
    location: string,
    timestamp: string
}

export interface GetDriversSharedLocationResp {
    driver: string,
    location: string,
    distanceFromPoint: number
}
