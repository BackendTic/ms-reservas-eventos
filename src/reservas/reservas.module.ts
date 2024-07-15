import { Module } from '@nestjs/common';
import { ReservasService } from './reservas.service';
import { ReservasController } from './reservas.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ESPACIOS_SERVICE, IMPLEMENTOS_SERVICE } from 'src/config/services';
import { envs } from 'src/config/envs';

@Module({
  controllers: [ReservasController],
  providers: [ReservasService],
  imports:[
    ClientsModule.register([
      {
        name: IMPLEMENTOS_SERVICE,
        transport: Transport.TCP,
        options:{
          host: envs.implementosMicroserviceHost,
          port: envs.implementosMicroservicePort,
        }
      },
      {
        name: ESPACIOS_SERVICE,
        transport: Transport.TCP,
        options:{
          host: envs.espaciosMicroserviceHost,
          port: envs.espaciosMicroservicePort,
        }
      }
    ])
  ]
})
export class ReservasModule {}
