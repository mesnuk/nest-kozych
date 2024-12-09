import {Controller, Get, Post, Body, Patch, Param, Delete, Query} from '@nestjs/common';
import { NovaService } from './nova.service';
import {ApiQuery, ApiTags} from '@nestjs/swagger';
import {GetCityQueryDto, GetStreetQueryDto, GetWarehouseQueryDto} from './dto/nova-post.dto';

@ApiTags('Nova post')
@Controller('nova-post')
export class NovaController {
  constructor(
      private readonly novaService: NovaService
  ) {}

  @Get('/get-all-areas')
  async getRegions(
  ) {
    return await this.novaService.getAreas()
  }

  @Get('/get-all-cities')
  async getCities(
      @Query() query:GetCityQueryDto ,
  ) {
      return await this.novaService.getCities(query)
  }

  @Get('/get-all-streets')
  async getStreets(
      @Query() query:GetStreetQueryDto ,
  ){

      console.log(query)
      return await this.novaService.getStreets(query)
  }

  @Get('/get-all-warehouses')
  async getWarehouses(
      @Query() query:GetWarehouseQueryDto ,
  ){
    return await this.novaService.getWarehouses(query)
  }
}
