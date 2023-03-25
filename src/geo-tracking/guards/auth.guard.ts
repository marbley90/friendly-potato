import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuardService } from "./auth.guard.service";

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private readonly authGuardService: AuthGuardService) {
    }

    async canActivate(context: ExecutionContext): Promise<boolean>  {
        const request = context.switchToHttp().getRequest();

        return this.authGuardService.isAuthorized(request);
    }
}
