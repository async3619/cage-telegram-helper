import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { TelegramService } from "@telegram/telegram.service";
import { TelegramController } from "@telegram/telegram.controller";

import { TelegramUser } from "@telegram/models/telegram-user.model";
import { TelegramMessage } from "@telegram/models/telegram-message.model";

@Module({
    imports: [TypeOrmModule.forFeature([TelegramUser, TelegramMessage])],
    providers: [TelegramService],
    controllers: [TelegramController],
})
export class TelegramModule {}
