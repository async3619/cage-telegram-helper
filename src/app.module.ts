import { TelegrafModule } from "nestjs-telegraf";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { TelegramModule } from "@telegram/telegram.module";

import { TokenModule } from "@token/token.module";

@Module({
    imports: [
        ConfigModule.forRoot(),
        TelegrafModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => {
                const token = configService.get("TELEGRAM_BOT_TOKEN");
                if (!token) {
                    throw new Error("environment variable TELEGRAM_BOT_TOKEN is not set");
                }

                return { token };
            },
            inject: [ConfigService],
        }),
        TelegramModule,
        TokenModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
