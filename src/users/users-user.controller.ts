import {Controller, Get, Post, Body, Patch, Param, Query, UseGuards} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto} from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {ApiOperation, ApiTags} from '@nestjs/swagger';
import {paginateQueryDto} from '../common/main.dto';
import {AdminGuard} from '../auth/admin.guard';
import {AdminAuthDecType, AdminDec} from '../auth/decorators/admin.decorator';
import {UserGuard} from '../auth/user.guard';
import {UserAuthDecType, UserDec} from '../auth/decorators/user.decorator';
import {UpdateUserUserDto} from './dto/update-user-user.dto';
import {UpdatePasswordUserDto} from './dto/update-password-user.dto';

@ApiTags('Users')
@Controller('users/user')
export class UsersUserController {
  constructor(
    private readonly usersService: UsersService
  ) {}

  @Get('/get-profile')
  @UseGuards(UserGuard)
  async findOne(
      @UserDec() userData: UserAuthDecType
  ) {

    return await this.usersService.customFindOne({
      id: userData.user.id
    })
  }

  @Patch()
  @UseGuards(UserGuard)
  async update(
      @Body() updateDto: UpdateUserUserDto,
      @UserDec() userData: UserAuthDecType
  ) {
    return await  this.usersService.updateProfileUser(userData.user.id, updateDto);
  }


  @Patch('/update-password')
  @UseGuards(UserGuard)
  @ApiOperation({
    description: 'Does`t not work yet'
  })
  updatePassword(
      @Body() updateDto: UpdatePasswordUserDto,
      @UserDec() userData: UserAuthDecType
  ) {
    return this.usersService.userUpdatePassword(userData.user, updateDto)
  }
}
