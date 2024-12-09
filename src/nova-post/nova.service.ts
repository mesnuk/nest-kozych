import {BadRequestException, forwardRef, Inject, Injectable} from '@nestjs/common';

import axios from 'axios';
import {GetCityQueryDto, GetStreetQueryDto, GetWarehouseQueryDto} from './dto/nova-post.dto';
import {Admin} from '../admins/entities/admin.entity';
import {CreateInternetDocumentDto} from './dto/internet-document-create.dto';
import {CharacteristicsService} from '../characteristics/characteristics.service';
import {OrdersService} from '../orders/orders.service';
import {OrderTypesEnum} from '../orders/types/order.types';

@Injectable()
export class NovaService {

  constructor(
      @Inject(forwardRef(()=> OrdersService)) private ordersService: OrdersService,
  ) {}
  private readonly NOVA_POST_API_KEY = process.env.NOVA_POST_API_KEY

  async createInternetDocument(orderId: string, body: CreateInternetDocumentDto, admin: Admin) {
    const candidateOrder = await this.ordersService.findOne({
      where: { id: +orderId}
    })

    if (!candidateOrder) {
        throw new BadRequestException('Order not found')
    }

    if (!admin.nova_post_api_key) {
        throw new BadRequestException('Nova post api key not found')
    }
    let result = null

    const sender = await this.getCounterparty(admin.nova_post_api_key)
    console.log('sender', sender);

    if (candidateOrder.delivery_type === OrderTypesEnum.novaPostWarehouse) {

      // city body.CitySender ref
      // ContactSender body.Sender ref
      // get sender
      //
      console.log('body.Description', body.Description);

      const contact  = candidateOrder.recipient_name ? `${candidateOrder.recipient_name} ${candidateOrder.recipient_surname}` : `${candidateOrder.contact_name} ${candidateOrder.contact_surname}`
      result = await axios.post('https://api.novaposhta.ua/v2.0/json/', {
        "apiKey": admin.nova_post_api_key,
        "modelName": "InternetDocument",
        "calledMethod": "save",
        "methodProperties": {
          "PayerType" : "Recipient",
          "PaymentMethod" : "Cash",
          "DateTime" : body.DateTime,
          "CargoType" : "Cargo",
          "Weight" : body.Weight,
          "VolumeGeneral": body.VolumeGeneral,
          "ServiceType" : 'WarehouseWarehouse',
          "SeatsAmount" : "1",
          "Description" : body.Description,
          "Cost" : body.Cost,
          "CitySender" : body.CitySender,
          "Sender" : sender.Ref,
          // "SenderAddress" : "727dfbb8-bddc-11ee-a60f-48df37b921db",
          "SenderWarehouseIndex" : candidateOrder.delivery_data.warehouseRef.WarehouseIndex,
          "ContactSender" : body.Sender,
          "SendersPhone" : body.SendersPhone,
          "RecipientsPhone" : candidateOrder.recipient_phone || candidateOrder.contact_phone,
          "NewAddress" : "1",
          "RecipientCityName" : candidateOrder.delivery_data.warehouseRef.CityDescription,
          "RecipientArea" : "",
          "RecipientAreaRegions" : "",
          "RecipientAddressName" : "",
          "RecipientHouse" : "",
          "RecipientFlat" : "",
          "RecipientName" : contact,
          "RecipientType" : "PrivatePerson",
          //"SettlementType" : "місто",
          "RecipientWarehouseIndex": candidateOrder.delivery_data.warehouseRef.WarehouseIndex,
          //"OwnershipForm" : "00000000-0000-0000-0000-000000000000",
          "RecipientContactName" : contact
          //"EDRPOU" : "12345678"
        }
      })
    }
    console.log('result', result.data);
    return result
  }
  async getCounterparty(apiKey: string) {
    const resultCounterparty = await axios.post('https://api.novaposhta.ua/v2.0/json/', {
      "apiKey": apiKey,
      "modelName": "Counterparty",
      "calledMethod": "getCounterparties",
      "methodProperties": {
        "CounterpartyProperty": "Sender",
        "Page": 1
      }
    })

    if (resultCounterparty.data.success === false) {
      throw new BadRequestException('Nova post Counterparty error')
    }
    return resultCounterparty.data.data[0]
  }

  async getContacts(apiKey: string) {

    const resultCounterparty = await this.getCounterparty(apiKey)

    const result = await axios.post('https://api.novaposhta.ua/v2.0/json/', {
      "apiKey": apiKey,
      "modelName": "Counterparty",
      "calledMethod": "getCounterpartyContactPersons",
      "methodProperties": {
        "Ref": resultCounterparty.Ref
      }
    })
    //{
    // 	"success": true,
    // 	"data": [
    // 		{
    // 			"Description": "Кіселик Олександр Володимирович",
    // 			"Phones": "380960899943",
    // 			"Email": "",
    // 			"Ref": "13b3dd56-d753-11ec-a60f-48df37b921db",
    // 			"LastName": "Кіселик",
    // 			"FirstName": "Олександр",
    // 			"MiddleName": "Володимирович"
    // 		}
    // 	],
    // 	"errors": [],
    // 	"warnings": [],
    // 	"info": {
    // 		"totalCount": 1
    // 	},
    // 	"messageCodes": [],
    // 	"errorCodes": [],
    // 	"warningCodes": [],
    // 	"infoCodes": []
    // }

    return result.data.data
  }

  async getAreas() {
    const result = await axios.post('https://api.novaposhta.ua/v2.0/json/', {
      "apiKey": this.NOVA_POST_API_KEY,
      "modelName": "Address",
      "calledMethod": "getSettlementAreas",
      "methodProperties": {}
    })
    return result.data
  }

  async getOneArea(areaRef: string) {
    const result = await axios.post('https://api.novaposhta.ua/v2.0/json/', {
      "apiKey": this.NOVA_POST_API_KEY,
      "modelName": "Address",
      "calledMethod": "getSettlementAreas",
      "methodProperties": {
        "Ref": areaRef
      }
    })

    if (result.data.success === false) {
      return null
    }

    if (result.data.data.length === 0) {
        return null
    }

    return result.data.data[0]
  }

  async getOneCity(cityRef: string) {
    const result = await axios.post('https://api.novaposhta.ua/v2.0/json/', {
      "apiKey": this.NOVA_POST_API_KEY,
      "modelName": "Address",
      "calledMethod": "getSettlements",
      "methodProperties": {
        "Ref": cityRef
      }
    })

    if (result.data.success === false) {
      return null
    }

    if (result.data.data.length === 0) {
      return null
    }

    return result.data.data[0]
  }

  async getCities(
      params: GetCityQueryDto
  ) {
    const result = await axios.post('https://api.novaposhta.ua/v2.0/json/', {
      "apiKey": this.NOVA_POST_API_KEY,
      "modelName": "Address",
      "calledMethod": "getSettlements",
      "methodProperties": {
        "AreaRef" : params.areaRef,
        "Ref" : params.ref,
        "RegionRef" : params.regionRef,
        "Page" : params.page,
        "Warehouse" : "1",
        "FindByString" : params.cityName,
        "Limit" : params.take,
      }
    })
    return result.data
  }

  async getStreets(params:GetStreetQueryDto){
    console.log('params', params);
    console.log('findByString', params.findByString);
    const result = await axios.post('https://api.novaposhta.ua/v2.0/json/', {
      "apiKey": this.NOVA_POST_API_KEY,
      "modelName": "Address",
      "calledMethod": "searchSettlementStreets",
      "methodProperties": {
        "StreetName" : params.findByString,
        "SettlementRef" : params.cityRef,
        "Limit" : params.take,
      }
    })
    return result.data
  }


  async getWarehouses(
      params: GetWarehouseQueryDto
  ) {
    const result = await axios.post('https://api.novaposhta.ua/v2.0/json/', {
      "apiKey": this.NOVA_POST_API_KEY,
      "modelName": "Address",
      "calledMethod": "getWarehouses",
      "methodProperties": {
        "CityName" : params.cityName,
        "WarehouseId" : params.warehouseId,
        "FindByString" : params.findByString,
        "SettlementRef" : params.cityRef,
        "Page" : params.page,
        "Limit" : params.take,
      }
    })
    return result.data
  }

  async getOneWarehouse(warehouseRef: string) {
    const result = await axios.post('https://api.novaposhta.ua/v2.0/json/', {
      "apiKey": this.NOVA_POST_API_KEY,
      "modelName": "Address",
      "calledMethod": "getWarehouses",
      "methodProperties": {
        "Ref" : warehouseRef
      }
    })

    if (result.data.success === false) {
      return null
    }

    if (result.data.data.length === 0) {
      return null
    }

    return result.data.data[0]

  }

}
