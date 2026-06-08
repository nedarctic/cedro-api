import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-jwt";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy){
    constructor(private readonly configService: ConfigService){
        super({
            secretOrKey: configService.get<string>('JWT_SECRET')!,
            jwtFromRequest: (req) => {
                return req?.cookies?.access_token;
            },
        })
    }

    async validate(payload: any){
        return payload;
    }
}