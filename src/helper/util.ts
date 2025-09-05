import { JwtService } from "@nestjs/jwt";
import { ConfigService } from '@nestjs/config';

const configService = new ConfigService();
const jwtService = new JwtService();
const secret = configService.get('SECRET_KEY');
const expiresIn = configService.get('EXPIRES_IN');

export const generateToken = ({ id, role, email, }) => {
    return jwtService.signAsync(
        { sub: id, role, email },
        { secret, expiresIn }
    );
}

export const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
}