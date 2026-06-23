import { Injectable, Logger } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthService {

    private readonly logger = new Logger(AuthService.name);

    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService
    ) { }

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.usersService.findUserByEmail(email);
        const isMatch = await bcrypt.compare(password, user.password);

        if (!user || !isMatch) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const {password: pass, createdAt, refreshToken, updatedAt, ...safeUser} = user;
        return safeUser;
    }

    async login(user: any) {
        const payload = { email: user.email, sub: user.id, role: user.role };

        const access_token = this.jwtService.sign(payload, { expiresIn: '5m' });
        const refresh_token = this.jwtService.sign(payload, { expiresIn: '7d' });

        this.usersService.updateRefreshToken(user.id, refresh_token);

        return {
            access_token,
            refresh_token
        };
    };

    async refreshToken(token: string){
        try {
            const payload = this.jwtService.verify(token);
            const user = await this.usersService.findUserById(payload.sub);

            if (!user || !user.refreshToken || !(await bcrypt.compare(token, user.refreshToken))) {
                throw new UnauthorizedException('Invalid token');
            }

            this.logger.log('Refresh token called.')

            return this.login(user);
        } catch (e) {
            throw new UnauthorizedException('Invalid token');
        }
    }

    verifyAccessToken(token: string) {
        try {
            return this.jwtService.verify(token);
        } catch {
            throw new UnauthorizedException('Invalid or expired access token');
        }
    }

    async rotateRefreshToken(refreshToken: string) {
    try {
        const payload = this.jwtService.verify(refreshToken);

        const user = await this.usersService.findUserById(payload.sub);

        if (!user || !user.refreshToken) {
            throw new UnauthorizedException('Invalid token');
        }

        const isValid = await bcrypt.compare(refreshToken, user.refreshToken);

        if (!isValid) {
            throw new UnauthorizedException('Invalid token');
        }

        return this.login(user); // generates new tokens
    } catch {
        throw new UnauthorizedException('Invalid token');
    }
}

}