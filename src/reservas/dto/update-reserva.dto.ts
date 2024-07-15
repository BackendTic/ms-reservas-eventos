import { PartialType } from '@nestjs/mapped-types';
import { CreateReservaDto } from './create-reserva.dto';
import { IsUUID } from 'class-validator';

export class UpdateReservaDto extends PartialType(CreateReservaDto) {
  // @IsUUID()
  id: string;
}
