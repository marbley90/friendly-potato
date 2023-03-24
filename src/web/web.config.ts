import { Injectable } from "@nestjs/common";
import * as process from "process";

@Injectable()
export class WebConfig {
    private readonly _accessToken: string;

    constructor() {
        this._accessToken = process.env.ACCESS_TOKEN;
    }

    get accessToken() {
        return this._accessToken;
    }
}
