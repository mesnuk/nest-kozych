import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateUserDto} from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from "@nestjs/typeorm";
import {Repository, DataSource, InsertResult} from 'typeorm';
import { User } from "./entities/user.entity";
import * as bcrypt from 'bcrypt';
import {UserRegisterDto} from '../auth/dto/user-register.dto';
import {EntityRepository} from '../common/db-entity-repository';
import {UpdateUserUserDto} from './dto/update-user-user.dto';
import {UpdatePasswordUserDto} from './dto/update-password-user.dto';
import {BlockUserDto} from './dto/block-user.dto';



@Injectable()
export class UsersService extends EntityRepository<User>{

  constructor(dataSource: DataSource) {
    super(User, dataSource);
  }

  async createUser(createUserDto: CreateUserDto | UserRegisterDto) {
    const candidate = await this.findOne({
      where:{
        email: createUserDto.email
      }
    })

    if (candidate) {
      throw new BadRequestException('User with this email already exists')
    }

    let password: string  = null

    if (createUserDto.password){
      password = await bcrypt.hash(createUserDto.password, Number(process.env.HASH_SALT_ROUNDS));
    }


    const result: User = await this.save({
      ...createUserDto,
      password: password
    })
    delete result.password
    return result
  }

  async updateUser(id: number,updateUserDto: UpdateUserDto ) {
    let newPassword: string | undefined = undefined
    if (updateUserDto?.password){
      newPassword = await bcrypt.hash(updateUserDto.password, Number(process.env.HASH_SALT_ROUNDS))
    }
    if (updateUserDto?.email){
        const candidate = await this.customFindOne({email: updateUserDto.email})
        if (candidate) {
            throw new BadRequestException('User with this email already exists')
        }
    }

    const update = {...updateUserDto, password: newPassword}
    return await this.customUpdate({id}, update)
  }

  async updateProfileUser(id: number, updateDto: UpdateUserUserDto ) {
    if (updateDto?.email){
      const candidate = await this.customFindOne({email: updateDto.email})
      if (candidate) {
        throw new BadRequestException('User with this email already exists')
      }
    }
    return await this.customUpdate({id}, updateDto)
  }

  async userUpdatePassword(userData: User, updateData: UpdatePasswordUserDto) {

    const userPassword = await this.findOne({
        where: {
            id: userData.id
        },
        select: ['password']
    })

    const isPasswordCorrect = await bcrypt.compare(
        updateData.prevPassword,
        userPassword.password,
    );

    if (!isPasswordCorrect) {
        throw new BadRequestException('Invalid password');
    }

    const hashPassword = await bcrypt.hash(updateData.newPassword, Number(process.env.HASH_SALT_ROUNDS));

    return await this.customUpdate({id: userData.id}, {password: hashPassword})
  }
  async blockUser(id: number, updateDto: BlockUserDto ) {
    return await this.customUpdate({id}, updateDto)
  }
}
