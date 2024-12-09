import {BadRequestException, Injectable} from '@nestjs/common';
import {CreateAdminDto} from './dto/create-admin.dto';
import {UpdateAdminDto} from './dto/update-admin.dto';
import {DataSource} from 'typeorm';
import {Admin} from './entities/admin.entity';
import * as bcrypt from 'bcrypt';
import {EntityRepository} from '../common/db-entity-repository';


@Injectable()
export class AdminsService extends EntityRepository<Admin> {
  constructor(dataSource: DataSource) {
    super(Admin, dataSource);
  }

  async createAdmin(createAdminDto: CreateAdminDto) {
    const candidate = await this.findOne({
      where:{
        email: createAdminDto.email
      }
    })

    if (candidate) {
      throw new BadRequestException('Admin with this email already exists')
    }

    const hashPassword = await bcrypt.hash(createAdminDto.password, Number(process.env.HASH_SALT_ROUNDS));

    return this.save({
      ...createAdminDto,
      password: hashPassword
    })
  }
  async updateAdmin (id: number, updateAdminDto: UpdateAdminDto) {
    const adminCandidate = await this.createQueryBuilder().select('*').where('id = :id', {id}).getRawOne();
    if (!adminCandidate) {
        throw new BadRequestException('Admin not found')
    }

    if (updateAdminDto.email) {
      const candidate = await this.customFindOne({
        email: updateAdminDto.email
      })
      if (candidate) {
        throw new BadRequestException('Admin with this email already exists')
      }
    }
    if (updateAdminDto.password) {
      const isSamePassword = await bcrypt.compare(
          updateAdminDto.password,
          adminCandidate.password,
      );

      if (isSamePassword) {
          throw new BadRequestException('New password must be different from the old one')
      }

      updateAdminDto.password = await bcrypt.hash(updateAdminDto.password, Number(process.env.HASH_SALT_ROUNDS))
    }

    return this.customUpdate({id}, updateAdminDto)
  }

  findAll() {
    return `This action returns all admins`;
  }

  // findOne(filter: any) {
  //   return this.adminRepository.findOne({
  //     where: filter,
  //   })
  // }

  // update(id: number, updateAdminDto: UpdateAdminDto) {
  //   return `This action updates a #${id} admin`;
  // }
  //
  // remove(id: number) {
  //   return `This action removes a #${id} admin`;
  // }
}
