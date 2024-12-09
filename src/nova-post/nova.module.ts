import {forwardRef, Module} from '@nestjs/common';
import {NovaService} from './nova.service';
import {NovaController} from './nova.controller';
import {OrdersModule} from '../orders/orders.module';
import {NovaControllerAdmin} from './nova.controller-admin';
import {AdminsModule} from '../admins/admins.module';

@Module({
    imports: [
        forwardRef(() => OrdersModule),
        AdminsModule
    ],
    controllers: [NovaController, NovaControllerAdmin],
    providers: [NovaService],
    exports: [NovaService]
})
export class NovaModule {}
