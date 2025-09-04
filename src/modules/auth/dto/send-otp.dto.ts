import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class SendOtpDto {
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty()
    email: string;
}