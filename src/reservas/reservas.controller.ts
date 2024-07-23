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
    // console.log(updateReservaDto);
    return this.reservasService.updateReserva( updateReservaDto);
  }

  @MessagePattern('removeReserva')
  remove(@Payload() id: string) {
    return this.reservasService.remove(id);
  }
  
  /////////////// informacion ////////////////////
  @MessagePattern('createInformation')
  createInformation(@Payload() createInformacionDto: any) {
    return this.reservasService.createInformation(createInformacionDto); 
  }

  @MessagePattern('findOneInformacion')
  findOneInformation(@Payload() id: string) {
    return this.reservasService.findOneInformation(id);
  }

  @MessagePattern('findAllInformacion')
  findAllInformation() {
    return this.reservasService.findAllInformation(); 
  }
  
  @MessagePattern('updateInformacion')
  updateInformacion(@Payload() updateInformationDto: any) {
    return this.reservasService.updateInformation(updateInformationDto.id, updateInformationDto); 
  }

  @MessagePattern('removeInformation')
  deleteInformation(@Payload() id: string) {
    return this.reservasService.deleteInformation(id);
  }

  /////////////// noticias ////////////////////
  @MessagePattern('createNoticias')
  createNoticia(@Payload() createNoticiaDto: any) {
    return this.reservasService.createNoticias(createNoticiaDto); 
  }

  @MessagePattern('findOneNoticias')
  findOneNoticia(@Payload() id: string) {
    return this.reservasService.findOneNoticias(id);
  }

  @MessagePattern('findAllNoticias')
  findAllNoticia() {
    return this.reservasService.findAllNoticias(); 
  }
  
  @MessagePattern('updateNoticias')
  updateNoticia(@Payload() updateNoticiaDto: any) {
    return this.reservasService.updateNoticias(updateNoticiaDto.id, updateNoticiaDto); 
  }

  @MessagePattern('removeNoticias')
  deleteNoticia(@Payload() id: string) {
    return this.reservasService.deleteNoticias(id);
  }

  /////////////// representante ////////////////////
  @MessagePattern('createRepresentantes')
  createRepresentante(@Payload() createRepresentanteDto: any) {
    return this.reservasService.createRepresentantes(createRepresentanteDto); 
  }

  @MessagePattern('findOneRepresentantes')
  findOneRepresentante(@Payload() id: string) {
    return this.reservasService.findOneRepresentantes(id);
  }

  @MessagePattern('findAllRepresentantes')
  findAllRepresentante() {
    return this.reservasService.findAllRepresentantes(); 
  }
  
  @MessagePattern('updateRepresentantes')
  updateRepresentante(@Payload() updateRepresentantesDto: any) {
    return this.reservasService.updateRepresentantes(updateRepresentantesDto.id, updateRepresentantesDto); 
  }

  @MessagePattern('removeRepresentantes')
  deleteRepresentante(@Payload() id: string) {
    return this.reservasService.deleteRepresentantes(id);
  }
}
