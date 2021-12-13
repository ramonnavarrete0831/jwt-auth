import { HttpModule, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AuthModule } from "../auth/auth.module";
import { WhatsappService } from '../whatsapp/whatsapp.service';
import { WebhookController } from './modules/webhook/webhook.controller';
import { WebhookService } from './modules/webhook/webhook.service';
import { TestController } from './modules/test/test.controller';
import { TestService } from './modules/test/test.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 25000,
    }),
    AuthModule,
    TypeOrmModule.forFeature([]),
  ],
  controllers: [
    TestController
    //WebhookController,
  ],
  providers: [
    TestService,
    //WhatsappService,
    //WebhookService,
  ],
})
export class V1Module {}

/*
nest g module auth
nest g controller v1/modules/account --no-spec
nest g service v1/modules/account --no-spec
*/
