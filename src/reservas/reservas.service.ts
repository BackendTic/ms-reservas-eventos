import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';
import { ESPACIOS_SERVICE, IMPLEMENTOS_SERVICE } from 'src/config/services';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { PrismaClient } from '@prisma/client';
import { envs } from 'src/config/envs';

@Injectable()
export class ReservasService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger();

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Database conected');
  }

  constructor(
    @Inject(IMPLEMENTOS_SERVICE)
    private readonly implementosClient: ClientProxy,
    @Inject(ESPACIOS_SERVICE) 
    private readonly espaciosClient: ClientProxy,
  ) {
    super();
  }

  /*
  async create(createReservaDto: CreateReservaDto) {
    const {
      usuarioId,
      espacioId,
      fechaInicio,
      fechaFin,
      horaInicio,
      estado,
      implemento_req,
    } = createReservaDto;

    let implementoId: string | null = null;

    if (implemento_req) {
      // Obtener disciplina del espacio
      const espacio = await this.espaciosClient
        .send('findOneEspacio', espacioId)
        .toPromise();
      const disciplina = espacio?.disciplina;

      if (disciplina) {
        // Obtener implementos disponibles para la disciplina
        const implementos = await this.implementosClient
          .send('findImplementsDiscipline', disciplina)
          .toPromise();

        if (implementos && implementos.length > 0) {
          // Seleccionar un implemento al azar
          const implemento =
            implementos[Math.floor(Math.random() * implementos.length)];
          implementoId = implemento.id;
        }
      }
    }

    // Convertir fechas de inicio y fin a Date
    const startDate = new Date(fechaInicio);
    const endDate = new Date(fechaFin);

    // Verificar si hay conflictos de reservas existentes en el mismo espacio y rango de fechas
    const conflictingReservations = await this.reserva.findMany({
      where: {
        espacioId,
        horaInicio: createReservaDto.horaInicio,
        OR: [
          {
            fechaInicio: {
              lte: endDate,
            },
            fechaFin: {
              gte: startDate,
            },
          },
        ],
      },
    });

    if (conflictingReservations.length > 0) {
      return {
        error: 'Existe un conflicto con alguna reserva anterior',
      };
    }

    // Crear un array de fechas para cada día entre fechaInicio y fechaFin
    const dates = this.getDatesBetween(startDate, endDate);

    // Verificar si el usuario tiene reservas en alguna de las fechas entre fechaInicio y fechaFin
    for (const date of dates) {
      const existingTimeSlot = await this.timeSlot.findMany({
        where: {
          usuarioId,
          fecha: date,
        },
      });

      if (existingTimeSlot.length > 0) {
        return {
          error: 'Usuario alcanzó el límite de reservas por hoy',
        };
      }
    }

    // Crear la nueva reserva ya que no se encontraron reservas existentes en las fechas dadas
    const reserva = await this.reserva.create({
      data: {
        usuarioId,
        espacioId,
        fechaInicio,
        fechaFin,
        horaInicio,
        estado,
        implementoId, // Incluye el implementoId si se seleccionó uno
      },
      include: {
        TimeSlot: true, // Incluye los TimeSlots asociados a la reserva creada
      },
    });

    // Crear TimeSlots para cada día entre fechaInicio y fechaFin
    for (const date of dates) {
      await this.timeSlot.create({
        data: {
          fecha: date,
          horaInicio,
          reservaId: reserva.id, // Asegúrate de conectar con el campo correcto
          usuarioId, // Almacena el usuarioId en el TimeSlot
        },
      });
    }

    return reserva;
  }
*/

  async create(createReservaDto: CreateReservaDto) {
    const {
      usuarioId,
      espacioId,
      fechaInicio,
      fechaFin,
      horaInicio,
      estado,
      implemento_req,
      isAdmin
    } = createReservaDto;

    let implementoId: string | null = null;

    if (implemento_req) {
      // Obtener disciplina del espacio
      const espacio = await this.espaciosClient
        .send('findOneEspacio', espacioId)
        .toPromise();
      const disciplina = espacio?.disciplina;

      if (disciplina) {
        // Obtener implementos disponibles para la disciplina
        const implementos = await this.implementosClient
          .send('findImplementsDiscipline', disciplina)
          .toPromise();

        if (implementos && implementos.length > 0) {
          // Seleccionar un implemento al azar
          const implemento =
            implementos[Math.floor(Math.random() * implementos.length)];
          implementoId = implemento.id;
        }
      }
    }

    // Convertir fechas de inicio y fin a Date
    const startDate = new Date(fechaInicio);
    const endDate = new Date(fechaFin);

    // Verificar si hay conflictos de reservas existentes en el mismo espacio, rango de fechas y hora
    const conflictingReservations = await this.reserva.findMany({
      where: {
        espacioId,
        OR: [
          {
            fechaInicio: {
              lte: endDate,
            },
            fechaFin: {
              gte: startDate,
            },
          },
        ],
      },
      include: {
        TimeSlot: true, // Incluir los TimeSlots para verificar las horas
      },
    });

    for (const reservation of conflictingReservations) {
      const conflictingTimeSlots = reservation.TimeSlot.filter(
        (slot) =>
          slot.horaInicio === horaInicio &&
          slot.fecha >= startDate &&
          slot.fecha <= endDate,
      );

      if (conflictingTimeSlots.length > 0) {
        return {
          error: 'Existe un conflicto con alguna reserva anterior',
        };
      }
    }

    // Crear un array de fechas para cada día entre fechaInicio y fechaFin
    const dates = this.getDatesBetween(startDate, endDate);

    // Verificar si el usuario tiene reservas en alguna de las fechas entre fechaInicio y fechaFin
    for (const date of dates) {
      const existingTimeSlot = await this.timeSlot.findMany({
        where: {
          usuarioId,
          fecha: date,
        },
      });

      if (existingTimeSlot.length > 0 && isAdmin === false) {
        return {
          error: 'Usuario alcanzó el límite de reservas por hoy',
        };
      }
    }

    // Crear la nueva reserva ya que no se encontraron reservas existentes en las fechas dadas
    const reserva = await this.reserva.create({
      data: {
        usuarioId,
        espacioId,
        fechaInicio,
        fechaFin,
        horaInicio,
        estado,
        implementoId, // Incluye el implementoId si se seleccionó uno
      },
      include: {
        TimeSlot: true, // Incluye los TimeSlots asociados a la reserva creada
      },
    });

    const espacio = await this.espaciosClient
        .send('findOneEspacio', espacioId)
        .toPromise();

    // Crear TimeSlots para cada día entre fechaInicio y fechaFin
    for (const date of dates) {
      await this.timeSlot.create({
        data: {
          fecha: date,
          horaInicio,
          reservaId: reserva.id, // Asegúrate de conectar con el campo correcto
          usuarioId, // Almacena el usuarioId en el TimeSlot
          espacio: espacio.nombre,
          disciplina: espacio.disciplina
        },
      });
    }

    return reserva;
  }

  private getDatesBetween(startDate: Date, endDate: Date): Date[] {
    const dates = [];
    let currentDate = new Date(startDate);
    endDate = new Date(endDate);

    while (currentDate <= endDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  }


  async findOneByUserId(id:string) {
    const reservas = await this.reserva.findMany({
      where: {
        estado: "Activa",
        usuarioId: id
      },
    });
  
    return reservas.filter(reserva => reserva.fechaInicio.getTime() === reserva.fechaFin.getTime());
  }

  async findAllReservas() {
    const reservas = await this.reserva.findMany({
      where: {
        estado: "Activa",
      },
    });
  
    const reservasFiltradas = reservas.filter(
      (reserva) => reserva.fechaInicio.getTime() === reserva.fechaFin.getTime()
    );
  
    const reservasConDetalles = await Promise.all(
      reservasFiltradas.map(async (reserva) => {
        const espacio = await this.espaciosClient
          .send("findOneEspacio", reserva.espacioId)
          .toPromise();
  
        const reservaDetalle: any = {
          ...reserva,
          disciplina: espacio.disciplina,
          nombreEspacio: espacio.nombre,
          imagen: `${envs.gatewayHost}/files/espacios/${espacio.imagen}`,
        };
  
        if (reserva.implementoId !== null) {
          const implemento = await this.implementosClient
            .send("findOneImplemento", reserva.implementoId)
            .toPromise();
  
          reservaDetalle.nombreImplemento = implemento.nombre;
        }
  
        return reservaDetalle;
      })
    );
  
    return reservasConDetalles;
  }
  


  async findAllEventos() {
    const reservas = await this.reserva.findMany({
      where: {
        estado: "Activa",
      },
    });
  
    const reservasFiltradas = reservas.filter(
      (reserva) => reserva.fechaInicio.getTime() !== reserva.fechaFin.getTime()
    );
  
    const reservasConDetalles = await Promise.all(
      reservasFiltradas.map(async (reserva) => {
        const espacio = await this.espaciosClient
          .send("findOneEspacio", reserva.espacioId)
          .toPromise();
  
        const reservaDetalle: any = {
          ...reserva,
          disciplina: espacio.disciplina,
          nombreEspacio: espacio.nombre,
          imagen: `${envs.gatewayHost}/files/espacios/${espacio.imagen}`,
        };
  
        if (reserva.implementoId !== null) {
          const implemento = await this.implementosClient
            .send("findOneImplemento", reserva.implementoId)
            .toPromise();
  
          reservaDetalle.nombreImplemento = implemento.nombre;
        }
  
        return reservaDetalle;
      })
    );
  
    return reservasConDetalles;
  }
  
  
  
  
  async findAllTimeSlots() {
    return this.timeSlot.findMany({})
  }

  findOne(id: string) {
    return `This action returns a #${id} reserva`;
  }

  async remove(id: string) {
    // Buscar la reserva por ID, incluyendo los TimeSlots
    const reserva = await this.reserva.findUnique({
      where: { id },
      include: { TimeSlot: true },
    });
  
    if (!reserva) {
      throw new Error('Reserva no encontrada');
    }
  
    // Cambiar el estado de la reserva a "Cancelada"
    const updatedReserva = await this.reserva.update({
      where: { id },
      data: {
        estado: "Cancelada",
      },
    });
  
    // Eliminar los TimeSlots asociados a la reserva
    for (const slot of reserva.TimeSlot) {
      await this.timeSlot.delete({
        where: { id: slot.id },
      });
    }
  
    return updatedReserva;
  }
  

  async findTimeSlotsByEspacioAndDates(
    espacioId: string,
    fechaInicio: string,
    fechaFin: string,
  ) {
    // Convertir fechas de inicio y fin a Date
    const startDate = new Date(fechaInicio);
    const endDate = new Date(fechaFin);

    // Encontrar todos los TimeSlots de un espacio específico entre las fechas dadas
    const timeSlots = await this.timeSlot.findMany({
      where: {
        fecha: {
          gte: startDate,
          lte: endDate,
        },
        Reserva: {
          espacioId,
        },
      },
    });

    return timeSlots;
  }


  async findTimeSlotsByEspacio(
    espacioId: string
  ) {

    // Encontrar todos los TimeSlots de un espacio específico entre las fechas dadas
    const timeSlots = await this.timeSlot.findMany({
      where: {
        Reserva: {
          espacioId,
        },
      },
    });

    return timeSlots;
  }

  async findTimeSlotsBetweenDates(fechaInicio: string, fechaFin: string) {
    // Convertir fechas de inicio y fin a Date
    const startDate = new Date(fechaInicio);
    const endDate = new Date(fechaFin);

    // Encontrar todos los TimeSlots entre las fechas dadas
    const timeSlots = await this.timeSlot.findMany({
      where: {
        fecha: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        Reserva: {
          select: {
            espacioId: true,
          },
        },
      },
    });

    // Añadir el espacioId a cada objeto del resultado
    const timeSlotsWithEspacioId = timeSlots.map((timeSlot) => ({
      id: timeSlot.id,
      fecha: timeSlot.fecha,
      horaInicio: timeSlot.horaInicio,
      reservaId: timeSlot.reservaId,
      usuarioId: timeSlot.usuarioId,
      espacioId: timeSlot.Reserva?.espacioId || null,
    }));

    return timeSlotsWithEspacioId;
  }

  async updateReserva(updateReservaDto: UpdateReservaDto) {
    const { id, espacioId, fechaInicio, fechaFin, horaInicio, estado } =
      updateReservaDto;

    const reserva = await this.reserva.findUnique({
      where: { id },
      include: { TimeSlot: true },
    });

    if (!reserva) {
      throw new Error('Reserva no encontrada');
    }

    // Validaciones
    if (fechaInicio && fechaFin && new Date(fechaInicio) > new Date(fechaFin)) {
      throw new Error(
        'La fecha de inicio no puede ser posterior a la fecha de fin',
      );
    }

    if (horaInicio !== undefined) {
      const timeSlotConflict = await this.timeSlot.findFirst({
        where: {
          fecha: {
            in: this.getDatesBetween(reserva.fechaInicio, reserva.fechaFin),
          },
          horaInicio,
          Reserva: {
            espacioId: reserva.espacioId,
          },
        },
      });

      if (timeSlotConflict) {
        throw new Error('El TimeSlot solicitado no está disponible');
      }
    }

    if (espacioId) {
      const dateRange = this.getDatesBetween(
        fechaInicio || reserva.fechaInicio,
        fechaFin || reserva.fechaFin,
      );

      for (const date of dateRange) {
        const conflict = await this.timeSlot.findFirst({
          where: {
            fecha: date,
            horaInicio: horaInicio || reserva.horaInicio,
            Reserva: {
              espacioId,
            },
          },
        });

        if (conflict) {
          throw new Error(
            'Existe conflicto al momento de hacer la modificación de la reserva',
          );
        }
      }
    }

    const startDate = fechaInicio ? new Date(fechaInicio) : reserva.fechaInicio;
    const endDate = fechaFin ? new Date(fechaFin) : reserva.fechaFin;

    const updatedReserva = await this.reserva.update({
      where: { id },
      data: {
        espacioId: espacioId || reserva.espacioId,
        fechaInicio: startDate,
        fechaFin: endDate,
        horaInicio: horaInicio !== undefined ? horaInicio : reserva.horaInicio,
        estado,
      },
    });

    // Actualizar o crear TimeSlots dentro del nuevo rango de fechas
    const dates = this.getDatesBetween(startDate, endDate);
    for (const date of dates) {
      await this.timeSlot.upsert({
        where: {
          id:
            reserva.TimeSlot.find(
              (slot) => slot.fecha.getTime() === date.getTime(),
            )?.id || '',
        },
        update: {
          horaInicio:
            horaInicio !== undefined ? horaInicio : reserva.horaInicio,
          usuarioId: reserva.usuarioId,
        },
        create: {
          fecha: date,
          horaInicio:
            horaInicio !== undefined ? horaInicio : reserva.horaInicio,
          reservaId: id,
          usuarioId: reserva.usuarioId,
          espacio: reserva.TimeSlot[0].espacio,
          disciplina: reserva.TimeSlot[0].disciplina
        },
      });
    }

    // Eliminar TimeSlots que ya no estén dentro del nuevo rango de fechas
    const datesToKeep = dates.map((d) => d.getTime());
    for (const slot of reserva.TimeSlot) {
      if (!datesToKeep.includes(slot.fecha.getTime())) {
        await this.timeSlot.delete({
          where: { id: slot.id },
        });
      }
    }

    return updatedReserva;
  }


  async updateTimeSlotNames(espacioId: string, nombre: string) {
    // Encontrar todas las reservas que tienen el espacioId proporcionado
    const reservas = await this.reserva.findMany({
      where: {
        espacioId,
      },
      include: {
        TimeSlot: true, // Incluir los TimeSlots para actualizarlos
      },
    });

    // Recorrer todas las reservas y actualizar el atributo espacio de los TimeSlots
    for (const reserva of reservas) {
      for (const timeSlot of reserva.TimeSlot) {
        await this.timeSlot.update({
          where: {
            id: timeSlot.id,
          },
          data: {
            espacio: nombre,
          },
        });
      }
    }

    return { message: `TimeSlots actualizados para espacioId: ${espacioId}` };
  }

}
