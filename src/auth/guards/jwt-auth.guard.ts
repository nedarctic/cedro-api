import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    handleRequest(err: any, user: any, info: any, context: any) {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers['authorization'];
        
        if (!authHeader) {
            throw new UnauthorizedException({
                error: 'NO_TOKEN',
                message: 'No token provided'
            });
        }

        if(info?.name === 'TokenExpiredError') {
            throw new UnauthorizedException({
                error: 'TOKEN_EXPIRED',
                message: 'Token has expired'
            });
        }

        if (err || info || !user) {
            throw err || new UnauthorizedException({
                error: 'INVALID_TOKEN',
                message: 'Invalid token'
            });
        }
        
        return user;
    }
}