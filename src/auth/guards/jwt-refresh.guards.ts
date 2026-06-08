import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "../auth.service";

@Injectable()
export class JwtRefreshGuard implements CanActivate {
    constructor(private readonly authService: AuthService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest();

        const accessToken = req.cookies.access_token;

        if (!accessToken) {
            throw new UnauthorizedException();
        }

        const payload = this.authService.verifyAccessToken(accessToken);

        req.user = payload;

        return true;
    }
}