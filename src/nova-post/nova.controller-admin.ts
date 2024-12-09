import {Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, BadRequestException} from '@nestjs/common';
import { NovaService } from './nova.service';
import { CreateInternetDocumentDto } from './dto/internet-document-create.dto';
import {ApiOperation, ApiQuery, ApiTags} from '@nestjs/swagger';
import {AdminGuard} from '../auth/admin.guard';
import {AdminAuthDecType, AdminDec, AdminRoles} from '../auth/decorators/admin.decorator';
import {AdminRolesEnum} from '../admins/types/admin.types';

@ApiTags('Nova post Admin')
@Controller('nova-post/admin')
export class NovaControllerAdmin {
  constructor(
      private readonly novaService: NovaService
  ) {}

  @Post('/create-internet-document/:orderId')
  @UseGuards(AdminGuard)
  @AdminRoles([AdminRolesEnum.MANAGER])
  @ApiOperation({
    description: `<strong>Roles</strong>: ${AdminRolesEnum.ROOT}, ${AdminRolesEnum.MANAGER}`,
  })
  async createInternetDocument(
        @Body() body: CreateInternetDocumentDto,
        @AdminDec() adminData:AdminAuthDecType,
        @Param('orderId') orderId: string
  ) {

    await this.novaService.createInternetDocument(orderId,body, adminData.admin)
    // return { result: {
    //     "Ref": "07ce58f9-c52d-11ee-a60f-48df37b921db",
    //     "CostOnSite": 50,
    //     "EstimatedDeliveryDate": "07.02.2024",
    //     "IntDocNumber": "20450864567546",
    //     "TypeDocument": "InternetDocument"
    //   } }
  }

  @Get('/get-all-contacts')
  @UseGuards(AdminGuard)
  @AdminRoles([AdminRolesEnum.MANAGER])
  @ApiOperation({
      description: `<strong>Roles</strong>: ${AdminRolesEnum.ROOT}, ${AdminRolesEnum.MANAGER}`,
  })
  async getContacts(
      @AdminDec() adminData:AdminAuthDecType,
  ) {
      if (!adminData.admin.nova_post_api_key){
          throw new BadRequestException('Nova post api key not found')
      }

      return await this.novaService.getContacts(adminData.admin.nova_post_api_key)
  }
}
