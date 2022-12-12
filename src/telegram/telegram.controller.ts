import { Body, Controller, Inject, Post, UseGuards } from "@nestjs/common";

import { TelegramService } from "@telegram/telegram.service";
import { NotifyDto } from "@telegram/models/notify.dto";

import { TokenGuard } from "@token/guards/token.guard";

@Controller()
export class TelegramController {
    public constructor(@Inject(TelegramService) private readonly telegramService: TelegramService) {}

    @UseGuards(TokenGuard)
    @Post("/notify")
    public async notify(@Body() data: NotifyDto) {
        await this.telegramService.notify(data);

        return {
            success: true,
        };
    }
}
