import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsNumber, Length } from "class-validator";

export class SignUpDto {

    @IsNotEmpty({ message: 'Email is required' })
    @IsEmail({}, { message: 'Invalid email' })
    @ApiProperty()
    email: string;

    @IsNotEmpty({ message: 'Password is required' })
    @ApiProperty()
    @Length(6, 50, { message: 'Password must be between 6 and 50 characters' })
    password: string;

    @IsNotEmpty({ message: 'Full name is required' })
    @ApiProperty()
    fullName: string;

    @IsNumber({}, { message: 'OTP must be a number' })
    @IsNotEmpty({ message: 'OTP is required' })
    @ApiProperty()
    otp: number;

    @ApiProperty({ required: false })
    avatarUrl?: string;
}
