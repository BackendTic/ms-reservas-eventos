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

  @MessagePattern('changeNameSpaceTimeSlot')
  changeNameSpaceTimeSlot(@Payload() payload: { espacioId: string, nombre: string }) {
    const { espacioId, nombre } = payload;
    return this.reservasService.updateTimeSlotNames(espacioId, nombre);
  }

  @MessagePattern('viewReservasByespacio')
  viewBookBySpace(@Payload() payload:{espacioId:string}) {
    const { espacioId} = payload;
    return this.reservasService.findTimeSlotsByEspacio(espacioId)
  }

  @MessagePattern('viewReservasBetweenDates')
  viewBookingBetweenDates(@Payload() payload:{fechaInicio: string, fechaFin: string}) {
    const { fechaInicio, fechaFin } = payload;
    return this.reservasService.findTimeSlotsBetweenDates(fechaInicio, fechaFin)
  }

  @MessagePattern('findAllReservas')
  findAllReservas() {
    return this.reservasService.findAllReservas();
  }

  @MessagePattern('findAllEventos')
  findAllEventos() {
    return this.reservasService.findAllEventos();
  }

  @MessagePattern('findAllTimeSlots')
  findAllTimeSlots() {
    return this.reservasService.findAllTimeSlots();
  }

  @MessagePattern('findOneReserva')
  findOne(@Payload() id: string) {
    return this.reservasService.findOne(id);
  }

  @MessagePattern('findOneReservaByUserId')
  findOneByUserId(@Payload() id: string) {
    return this.reservasService.findOneByUserId(id);
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
