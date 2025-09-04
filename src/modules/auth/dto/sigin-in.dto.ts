import { ApiProperty } from "@nestjs/swagger";

export class SiginInDto {

    @ApiProperty()
    email: string;

    @ApiProperty()
    password: string;

    @ApiProperty()
    accessToken: string;
}
