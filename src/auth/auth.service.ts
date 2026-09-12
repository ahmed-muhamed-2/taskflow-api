import {
    ConflictException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private readonly prisma: PrismaService, private readonly jwtService: JwtService) { }

    async register(registerDto: RegisterDto) {
        const { name, email, password, role } = registerDto;

        const existingUser = await this.prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            throw new ConflictException('Email already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await this.prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role,
            },
        });

        const payload = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        };

        return {
            accessToken: await this.jwtService.signAsync(payload),
        };
    }

    async login(email: string, password: string) {
        const user = await this.prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            throw new UnauthorizedException('Invalid email or password');
        }

        const passwordMatched = await bcrypt.compare(
            password,
            user.password,
        );

        if (!passwordMatched) {
            throw new UnauthorizedException('Invalid email or password');
        }

        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
        };

        return {
            accessToken: await this.jwtService.signAsync(payload),
        };
    }
}