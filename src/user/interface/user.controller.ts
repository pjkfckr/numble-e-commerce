import { Controller, Inject, Post } from '@nestjs/common';
import { IUserService } from '../providers/user.service.interface';
import { Response } from '../../common/structures/http';
import { InjectionToken } from '../providers/injection.token';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserResponseDto } from './dto/create-user.response.dto';

@Controller('users')
@ApiTags('User')
export class UserController {
  private readonly userService: IUserService;
  constructor(
    @Inject(InjectionToken.USER_SERVICE) private service: IUserService,
  ) {
    this.userService = service;
  }

  @Post('sign-up')
  @ApiOperation({ summary: 'Create User' })
  async signUp(): Promise<Response<CreateUserResponseDto>> {
    const result = await this.userService.create();
    return { data: result, message: 'create user' };
  }
}
