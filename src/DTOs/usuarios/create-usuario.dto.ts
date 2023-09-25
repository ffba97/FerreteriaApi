import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, isNotEmpty } from "class-validator";

export class CreateUsuarioDto {

    @ApiProperty()
    @IsNotEmpty()
    ruc: string;

    @ApiProperty()
    @IsNotEmpty()
    nombre: string;

    @ApiProperty()
    @IsNotEmpty()
    password: string;

    @ApiProperty()
    @IsNotEmpty()
    telefono: string;

    @ApiProperty()
    @IsNotEmpty()
    direccion: string;

}