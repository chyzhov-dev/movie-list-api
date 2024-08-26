import { AuthGuard } from '@modules/auth/guards/auth.guard';
import { UsersCreateRequest } from '@modules/users/requests/users-create.request';
import { UsersService } from '@modules/users/services/users.service';
import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  public constructor(private readonly usersService: UsersService) {}

  @Post()
  public async create(@Body() _body: UsersCreateRequest): Promise<void> {
    return;
  }

  @Get(':id')
  public list(@Param('id') _id: string): Promise<void> {
    return;
  }
}
