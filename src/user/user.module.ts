import { Module } from '@nestjs/common';
import { InjectionToken } from './providers/injection.token';
import { UserService } from './providers/user.service';
import { UserController } from './interface/user.controller';

@Module({
  providers: [{ provide: InjectionToken.USER_SERVICE, useClass: UserService }],
  controllers: [UserController],
})
export class UserModule {}
