import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Matches, MaxLength } from "class-validator";

export class UpdateProductColorDto {

    @ApiProperty({ example: 'Black' })
    @IsString()
    @IsNotEmpty({ message: 'Color is required' })
    @MaxLength(50)
    color: string;

    @ApiProperty({ example: '#000000', description: 'Mã màu hex, có thể có/không # ở đầu' })
    @IsString()
    @IsNotEmpty({ message: 'Color code is required' })
    @MaxLength(20)
    @Matches(/^#?([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, {
        message: 'code phải là mã màu hex 3 hoặc 6 ký tự',
    })
    code: string;
}