import { EstadoReserva } from "@prisma/client";
import { Transform } from "class-transformer";
import { IsBoolean, IsDate, IsEnum, IsInt, IsOptional, IsString, IsUUID, isBoolean } from "class-validator"

export class CreateReservaDto {
    @IsString()
    usuarioId: string

    @IsUUID()
    espacioId: string

    @IsDate()
    @Transform(({ value }) => {
      if (typeof value === 'string') {
        const [day, month, year] = value.split('-');
        return new Date(`${year}-${month}-${day}`);
      }
      return value;
    }, { toClassOnly: true })
    fechaInicio: Date;
    
    @IsOptional()
    @IsDate()
    @Transform(({ value }) => {
      if (typeof value === 'string') {
        const [day, month, year] = value.split('-');
        return new Date(`${year}-${month}-${day}`);
      }
      return value;
    }, { toClassOnly: true })
    fechaFin: Date;
  
    @IsInt()
    horaInicio: number;
  
    @IsEnum(EstadoReserva)
    estado: EstadoReserva;

    @IsBoolean()
    implemento_req: Boolean
}
