import { Observable } from "rxjs";
import { Request } from "express";

import { CanActivate, ExecutionContext, Inject, Injectable } from "@nestjs/common";
import { TokenService } from "@token/token.service";

@Injectable()
export class TokenGuard implements CanActivate {
    private validateRequest(request: Request): boolean {
        const authorization = request.headers["authorization"];
        if (!authorization) {
            return false;
        }

        const token = authorization.split(" ")[1];
        if (!token) {
            return false;
        }

        return this.tokenService.checkToken(token);
    }

    public constructor(@Inject(TokenService) private readonly tokenService: TokenService) {}

    public canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();

        return this.validateRequest(request);
    }
}
