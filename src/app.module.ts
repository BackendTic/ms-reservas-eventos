import { Module } from '@nestjs/common';
import { ReservasModule } from './reservas/reservas.module';

@Module({
  imports: [ReservasModule],
})
export class AppModule {}
