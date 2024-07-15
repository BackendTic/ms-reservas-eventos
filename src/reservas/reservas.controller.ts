import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ReservasService } from './reservas.service';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';

@Controller()
export class ReservasController {
  constructor(private readonly reservasService: ReservasService) {}

  @MessagePattern('createReserva')
  create(@Payload() createReservaDto: any) {
    return this.reservasService.create(createReservaDto);
  }

  @MessagePattern('viewReservasBetweenSpace')
  viewBookingBetween(@Payload() payload:{espacioId:string, fechaInicio: string, fechaFin: string}) {
    const { espacioId, fechaInicio, fechaFin } = payload;
    return this.reservasService.findTimeSlotsByEspacioAndDates(espacioId, fechaInicio, fechaFin)
  }

  @MessagePattern('viewReservasBetweenDates')
  viewBookingBetweenDates(@Payload() payload:{fechaInicio: string, fechaFin: string}) {
    const { fechaInicio, fechaFin } = payload;
    return this.reservasService.findTimeSlotsBetweenDates(fechaInicio, fechaFin)
  }

  @MessagePattern('findAllReservas')
  findAll() {
    return this.reservasService.findAll();
  }

  @MessagePattern('findOneReserva')
  findOne(@Payload() id: string) {
    return this.reservasService.findOne(id);
  }

  @MessagePattern('updateReserva')
  update(@Payload() updateReservaDto: any) {
    console.log(updateReservaDto);
    return this.reservasService.updateReserva( updateReservaDto);
  }

  @MessagePattern('removeReserva')
  remove(@Payload() id: string) {
    return this.reservasService.remove(id);
  }
}
