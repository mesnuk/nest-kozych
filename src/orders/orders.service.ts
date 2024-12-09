import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {CreateOrderUserDto} from './dto/create-order-user.dto';
import {UpdateOrderDto} from './dto/update-order.dto';
import {EntityRepository} from '../common/db-entity-repository';
import {User} from '../users/entities/user.entity';
import {Order} from './entities/order.entity';
import {DataSource, In} from 'typeorm';
import {GoodsService} from '../goods/goods.service';
import {OrderStatusEnum, OrderTypesEnum} from './types/order.types';
import {OrdersGoodsService} from './orders-goods.service';
import {UsersService} from '../users/users.service';
import {NovaService} from '../nova-post/nova.service';
import {CreateOrderAdminDto} from './dto/create-order-admin.dto';
import {AdminAuthDecType} from '../auth/decorators/admin.decorator';

@Injectable()
export class OrdersService extends EntityRepository<Order> {

    constructor(
        private goodsService: GoodsService,
        private ordersGoodsService: OrdersGoodsService,
        private usersService: UsersService,
        private novaService: NovaService,
        dataSource: DataSource
    ) {
        super(Order, dataSource);
    }

    async getOrderCode() {
        const getLastOrder = await this.findOne({
            where: {},
            order: {
                id: 'DESC'
            }
        });

        if (!getLastOrder) {
            return '10000000';
        }

        return String(+getLastOrder.code + 1);
    }

    async changeGenerateDeliveryInvoice (orderId: string, admin:AdminAuthDecType){

        const candidateOrder = await this.findOne({
            where: {id: +orderId},
        })

        if (!candidateOrder){
            throw new NotFoundException('Order not found')
        }



    }

    async annulOrder(id: number, userData: User) {
        const candidate = await this.findOne({
            where: {id: +id, user: userData},
        });

        if (!candidate) {
            throw new NotFoundException('Order not found');
        }

        if (candidate.status !== OrderStatusEnum.pending) {
            throw new NotFoundException('Order status is not pending');
        }

        if (candidate.is_used_cash_back) {
            await this.usersService.update({id: userData.id}, {
                cash_back_amount: userData.cash_back_amount + candidate.cash_back
            });
        }

        return await this.update({id: +id}, {
            status: OrderStatusEnum.annulled
        });
    }


    async approveGoodsInOrder(goods: Array<{
        id: number,
        count: number
    }>) {
        const result = {
            goods: [],
            totalPrice: 0
        };

        for (const good of goods) {
            const goodData = await this.goodsService.customFindOne({id: good.id});

            if (!goodData) {
                throw new BadRequestException(`Good with id ${good.id} not found`);
            }

            if (goodData.amount < good.count) {
                throw new BadRequestException(`Not enough goods`);
            }

            result.goods.push({
                id: goodData.id,
                goodData,
                count: good.count
            });
            result.totalPrice += goodData.price * good.count;
        }

        return result;
    }

    async getDeliveryData(delivery_data: any, delivery_type: OrderTypesEnum) {

        let newDeliveryData: {
            areaRef?: any,
            cityRef?: any,
            warehouseRef?: any
        } = {};
        if (delivery_type === OrderTypesEnum.novaPostWarehouse) {
            newDeliveryData.areaRef = await this.novaService.getOneArea(delivery_data.areaRef);
            if (!newDeliveryData.areaRef) {
                throw new BadRequestException('Area not found');
            }


            newDeliveryData.cityRef = await this.novaService.getOneCity(delivery_data.cityRef);
            if (!newDeliveryData.cityRef) {
                throw new BadRequestException('City not found');
            }

            //{
            //                             "Present": "с. Київське, Синельниківський р-н, Дніпропетровська обл.",
            //                             "Warehouses": 0,
            //                             "MainDescription": "Київське",
            //                             "Area": "Дніпропетровська",
            //                             "Region": "Синельниківський",
            //                             "SettlementTypeCode": "с.",
            //                             "Ref": "0e117408-4b3a-11e4-ab6d-005056801329",
            //                             "DeliveryCity": "69da419c-3f5d-11de-b509-001d92f78698",
            //                             "AddressDeliveryAllowed": true,
            //                             "StreetsAvailability": false,
            //                             "ParentRegionTypes": "область",
            //                             "ParentRegionCode": "обл.",
            //                             "RegionTypes": "район",
            //                             "RegionTypesCode": "р-н"
            //                         }
            newDeliveryData.warehouseRef = await this.novaService.getOneWarehouse(delivery_data.warehouseRef)
            if (!newDeliveryData?.warehouseRef) {
                throw new BadRequestException('Warehouse not found');
            }
            //{
            // 			"SiteKey": "7",
            // 			"Description": "Відділення №1: вул. Запорізька, 36",
            // 			"DescriptionRu": "Отделение №1: ул. Запорожская, 36",
            // 			"ShortAddress": "Бориспіль, Запорізька, 36",
            // 			"ShortAddressRu": "Борисполь, Запорожская, 36",
            // 			"Phone": "380800500609",
            // 			"TypeOfWarehouse": "9a68df70-0267-42a8-bb5c-37f427e36ee4",
            // 			"Ref": "1ec09d2d-e1c2-11e3-8c4a-0050568002cf",
            // 			"Number": "1",
            // 			"CityRef": "db5c88d4-391c-11dd-90d9-001a92567626",
            // 			"CityDescription": "Бориспіль",
            // 			"CityDescriptionRu": "Борисполь",
            // 			"SettlementRef": "e714e1ce-4b33-11e4-ab6d-005056801329",
            // 			"SettlementDescription": "Бориспіль",
            // 			"SettlementAreaDescription": "Київська область",
            // 			"SettlementRegionsDescription": "",
            // 			"SettlementTypeDescription": "місто",
            // 			"SettlementTypeDescriptionRu": "город",
            // 			"Longitude": "30.925741200000000",
            // 			"Latitude": "50.384142100000000",
            // 			"PostFinance": "0",
            // 			"BicycleParking": "0",
            // 			"PaymentAccess": "1",
            // 			"POSTerminal": "1",
            // 			"InternationalShipping": "1",
            // 			"SelfServiceWorkplacesCount": "0",
            // 			"TotalMaxWeightAllowed": "0",
            // 			"PlaceMaxWeightAllowed": "1100",
            // 			"SendingLimitationsOnDimensions": {
            // 				"Width": 170,
            // 				"Height": 200,
            // 				"Length": 600
            // 			},
            // 			"ReceivingLimitationsOnDimensions": {
            // 				"Width": 170,
            // 				"Height": 200,
            // 				"Length": 600
            // 			},
            // 			"Reception": {
            // 				"Monday": "08:00-20:00",
            // 				"Tuesday": "08:00-20:00",
            // 				"Wednesday": "08:00-20:00",
            // 				"Thursday": "08:00-20:00",
            // 				"Friday": "08:00-20:00",
            // 				"Saturday": "09:00-18:00",
            // 				"Sunday": "09:00-18:00"
            // 			},
            // 			"Delivery": {
            // 				"Monday": "08:00-20:00",
            // 				"Tuesday": "08:00-20:00",
            // 				"Wednesday": "08:00-20:00",
            // 				"Thursday": "08:00-20:00",
            // 				"Friday": "08:00-20:00",
            // 				"Saturday": "09:00-18:00",
            // 				"Sunday": "09:00-18:00"
            // 			},
            // 			"Schedule": {
            // 				"Monday": "08:00-20:00",
            // 				"Tuesday": "08:00-20:00",
            // 				"Wednesday": "08:00-20:00",
            // 				"Thursday": "08:00-20:00",
            // 				"Friday": "08:00-20:00",
            // 				"Saturday": "09:00-19:00",
            // 				"Sunday": "09:00-19:00"
            // 			},
            // 			"DistrictCode": "БО_В1",
            // 			"WarehouseStatus": "Working",
            // 			"WarehouseStatusDate": "2022-03-16 00:00:00",
            // 			"WarehouseIllusha": "0",
            // 			"CategoryOfWarehouse": "Branch",
            // 			"Direct": "",
            // 			"RegionCity": "КИЇВ СХІД ПОСИЛКОВИЙ",
            // 			"WarehouseForAgent": "0",
            // 			"GeneratorEnabled": "0",
            // 			"MaxDeclaredCost": "0",
            // 			"WorkInMobileAwis": "0",
            // 			"DenyToSelect": "0",
            // 			"CanGetMoneyTransfer": "0",
            // 			"HasMirror": "1",
            // 			"HasFittingRoom": "1",
            // 			"OnlyReceivingParcel": "0",
            // 			"PostMachineType": "",
            // 			"PostalCodeUA": "08301",
            // 			"WarehouseIndex": "13/1",
            // 			"BeaconCode": ""
            // 		},


        }

        return newDeliveryData;
    }

    async userCreateOrder(createOrderDto: CreateOrderUserDto, userData: User | null = null) {
        const goodsData = await this.approveGoodsInOrder(createOrderDto.goods);

        const orderGoods = await this.ordersGoodsService.save(goodsData.goods.map(good => ({
            count: good.count,
            good: good.goodData,
        })));

        let amount: number = goodsData.totalPrice;
        let cashBackAmount = 0;

        const delivery_data = await this.getDeliveryData(createOrderDto.delivery_data, createOrderDto.delivery_type);

        if (createOrderDto.useCashBack && userData) {
            amount = goodsData.totalPrice - (userData ? userData.cash_back_amount : 0);

            if (amount < 0) {
                cashBackAmount = goodsData.totalPrice;
                amount = 0;
            } else {
                cashBackAmount = userData.cash_back_amount;
            }
        }

        if (userData && createOrderDto.useCashBack) {
            await this.usersService.update({id: userData?.id}, {
                cash_back_amount: userData?.cash_back_amount - cashBackAmount
            });
        }

        const result = await this.save({
            ...createOrderDto,
            delivery_data: delivery_data,
            goods_list: orderGoods,
            user: userData ? userData : null,
            status: OrderStatusEnum.pending,
            amount: amount,
            cash_back: cashBackAmount,
            is_used_cash_back: createOrderDto.useCashBack,
            code: await this.getOrderCode(),

        });
        delete result.goods;
        return result;
    }

    async adminCreateOrder(createOrderDto: CreateOrderAdminDto) {
        const userData: User = null;
        if (createOrderDto.user) {
            const userData = await this.usersService.findOne({
                where: {id: createOrderDto.user},
            });

            if (!userData) {
                throw new NotFoundException('User not found');
            }
        }

        return await this.userCreateOrder(createOrderDto, userData);
    }

    async adminUpdateOrder(id: number, updateOrderDto: UpdateOrderDto, adminData: AdminAuthDecType) {
        const candidateOrder: Order = await this.findOne({
            where: {id: id},
            relations: ['user']
        });

        if (!candidateOrder) {
            throw new NotFoundException('Order not found');
        }

        let updateData: any = {
            ...updateOrderDto,
            amount: candidateOrder.amount,
        }
        if (updateOrderDto?.user) {
            const userData = await this.usersService.findOne({
                where: {id: updateOrderDto.user},
            });

            if (!userData) {
                throw new NotFoundException('User not found');
            }

            updateData.user = userData;
        }

        if (updateOrderDto?.goods) {
            const goodsData = await this.approveGoodsInOrder(updateOrderDto.goods);

            updateData.goods_list = await this.ordersGoodsService.save(goodsData.goods.map(good => ({
                count: good.count,
                good: good.goodData
            })))

            updateData.amount = goodsData.totalPrice
        }

        if (updateOrderDto?.useCashBack === false) {
            updateData.is_used_cash_back = updateOrderDto.useCashBack
            updateData.cash_back = 0
        }else if (updateOrderDto?.useCashBack === true) {
            updateData.is_used_cash_back = updateOrderDto.useCashBack
            let userCashBack = 0

            if (updateData.user) {
                userCashBack = updateData.user.cash_back_amount
            }else if (candidateOrder.user) {
                userCashBack = candidateOrder.user.cash_back_amount
            }

            const newAmount = updateData.amount - userCashBack

            if (newAmount < 0) {
                updateData.cash_back = updateData.amount
                updateData.amount = 0
            } else {
                updateData.cash_back = userCashBack;
            }
        }

        if (updateOrderDto?.delivery_data || updateOrderDto?.delivery_type) {
            updateData.delivery_data = await this.getDeliveryData(updateOrderDto.delivery_data, updateOrderDto?.delivery_type || candidateOrder.delivery_type);
        }

        if (updateData.user && candidateOrder.user){
            if(candidateOrder.cash_back){
                await this.usersService.update({id: candidateOrder.user.id}, {
                    cash_back_amount: candidateOrder.user.cash_back_amount + candidateOrder.cash_back
                });
            }

            let userCashBack = 0

            if ((updateData.is_used_cash_back === true && typeof updateOrderDto.useCashBack != 'undefined' ) || candidateOrder.is_used_cash_back){
                if (updateData.cash_back) {
                    userCashBack = updateData.cash_back
                }else {
                    userCashBack = candidateOrder.cash_back
                }
            }

            await this.usersService.update({id: updateData.user.id}, {
                cash_back_amount: updateData.user.cash_back_amount - userCashBack
            });
        }else if (updateData.cash_back && candidateOrder.user){
            await this.usersService.update({id: candidateOrder.user.id}, {
                cash_back_amount: candidateOrder.user.cash_back_amount + candidateOrder.cash_back
            })
        }

        if (updateData.status){
            if (!candidateOrder.admin){
                updateData.admin = adminData.admin
            }

            if(updateData.status === OrderStatusEnum.annulled || updateData.status === OrderStatusEnum.canceled) {
                if (candidateOrder.is_used_cash_back && candidateOrder.user){
                    await this.usersService.update({id: candidateOrder.user.id}, {
                        cash_back_amount: candidateOrder.user.cash_back_amount + candidateOrder.cash_back
                    });
                }
            }

            if (updateData.status === OrderStatusEnum.received) {
                if (candidateOrder.is_used_cash_back && candidateOrder.user){
                    await this.usersService.update({id: candidateOrder.user.id}, {
                        cash_back_amount: candidateOrder.user.cash_back_amount + (candidateOrder.amount * 0.03)
                    });
                }
            }
        }

        return await this.customUpdate({id: id}, updateData, ['goods_list', 'user', 'admin']);
    }

}
