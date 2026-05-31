import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthService {
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

        return user;
    }

    async login(user: any) {
        const payload = { email: user.email, sub: user.id, role: user.role };

        const access_token = this.jwtService.sign(payload, { expiresIn: '1h' });
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

            return this.login(user);
        } catch (e) {
            throw new UnauthorizedException('Invalid token');
        }
    }

}