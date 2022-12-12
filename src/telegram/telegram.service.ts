import { v4 as generateUuid } from "uuid";
import { marked } from "marked";

import { Context, Telegraf } from "telegraf";
import { Ctx, InjectBot, Start, Update } from "nestjs-telegraf";

import { Injectable } from "@nestjs/common";

@Update()
@Injectable()
export class TelegramService {
    private readonly contextMap: Record<string, Context> = {};
    private readonly tokenMap: Record<string, string> = {};

    public constructor(@InjectBot() private readonly bot: Telegraf<Context>) {}

    public async notify(token: string, messages: string[]) {
        const ctx = this.contextMap[token];
        if (!ctx) {
            return;
        }

        for (let i = 0; i < messages.length; i++) {
            await ctx.reply(marked.parseInline(messages[i]), {
                parse_mode: "HTML",
                disable_web_page_preview: true,
                disable_notification: i > 0,
            });
        }
    }

    @Start()
    public async start(@Ctx() ctx: Context) {
        if (!ctx.from) {
            return;
        }

        if (!this.tokenMap[ctx.from.id]) {
            this.tokenMap[ctx.from.id] = generateUuid();
        }

        const token = this.tokenMap[ctx.from.id];
        this.contextMap[token] = ctx;
        await ctx.reply(`Now you can configure your cage instance with this token:\n\`${token}\``, {
            parse_mode: "MarkdownV2",
        });
    }
}
