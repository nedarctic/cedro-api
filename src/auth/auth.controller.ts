import { Controller, Post, Body, Request, Req, Res, UseGuards, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { type Response, type Request as ExpressRequest } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private readonly configService: ConfigService
    ) { }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request() req, @Res({ passthrough: true }) res: Response) {
        const { access_token, refresh_token } = await this.authService.login(req.user);

        return { access_token, refresh_token };
    }

    @Post('refresh')
    async refresh(@Body() body: { refresh_token: string } ) {
        
        if (!body.refresh_token) {
            throw new UnauthorizedException('No refresh token provided');
        }
        const { access_token, refresh_token: newRefreshToken } = await this.authService.refreshToken(body.refresh_token);
        
        return { access_token, newRefreshToken };
    }
}