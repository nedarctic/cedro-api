import { Body, Controller, Logger, Post, Req, Request, Res, Response, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { type Request as ExpressRequest, type Response as ExpressResponse } from 'express';

@Controller('auth')
export class AuthController {

    constructor(
        private authService: AuthService,
        private readonly configService: ConfigService
    ) { }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request() req: ExpressRequest, @Response({ passthrough: true }) res: ExpressResponse) {
        const user = req.user;
        const { access_token, refresh_token } = await this.authService.login(req.user);
        return { user, access_token, refresh_token };
    }

    @Post('refresh')
    async refresh(@Body() dto: { refresh_token: string }, @Request() req: ExpressRequest, @Response({ passthrough: true }) res: ExpressResponse) {
        const refreshToken = dto.refresh_token;

        const { access_token, refresh_token } = await this.authService.rotateRefreshToken(refreshToken);

        return { access_token, refresh_token };
    }
}