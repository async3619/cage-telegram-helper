import { Repository } from "typeorm";
import * as pluralize from "pluralize";
import { marked } from "marked";

import { Context, Telegraf } from "telegraf";
import { Key, Keyboard, CallbackButton } from "telegram-keyboard";
import { Action, Ctx, InjectBot, Start, Update } from "nestjs-telegraf";

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { TelegramUser } from "@telegram/models/telegram-user.model";
import { NotifyDto } from "@telegram/models/notify.dto";

import { Required } from "@utils/types";
import { TelegramMessage } from "@telegram/models/telegram-message.model";

type SendMessageOptions = Parameters<Context["telegram"]["sendMessage"]>[2];

@Update()
@Injectable()
export class TelegramService {
    public constructor(
        @InjectBot() private readonly bot: Telegraf<Context>,
        @InjectRepository(TelegramUser) private readonly userRepository: Repository<TelegramUser>,
        @InjectRepository(TelegramMessage) private readonly messageRepository: Repository<TelegramMessage>,
    ) {}

    public async notify(data: NotifyDto) {
        const user = await this.getUserByToken(data.token);
        const message = this.messageRepository.create({
            followers: data.followers,
            unfollowers: data.unfollowers,
            renames: data.renames,
            user,
        });

        await this.messageRepository.save(message);

        const titleContents: string[] = [];
        const menuItems: CallbackButton[] = [];
        if (data.followerCount && data.followers) {
            const item = pluralize("New Follower", data.followerCount, true);

            titleContents.push(`🎉 ${item}`);
            menuItems.push(Key.callback(`🎉 Show ${item}`, "view-followers"));
        }

        if (data.unfollowerCount && data.unfollowers) {
            const item = pluralize("Unfollower", data.unfollowerCount, true);

            titleContents.push(`❌ ${item}`);
            menuItems.push(Key.callback(`❌ Show ${item}`, "view-unfollowers"));
        }

        if (data.renameCount && data.renames) {
            const item = pluralize("Rename", data.renameCount, true);

            titleContents.push(`✏️ ${item}`);
            menuItems.push(Key.callback(`✏️ Show ${item}`, "view-renames"));
        }

        const result = await this.sendMessage(
            user,
            marked.parseInline(`_**🦜 Cage Report**_\n\n${titleContents.join("\n")}`),
            {
                parse_mode: "HTML",
                ...Keyboard.make([menuItems]).inline(),
            },
        );

        message.messageId = result.message_id;
        await this.messageRepository.save(message);
    }

    @Action(["view-followers", "view-unfollowers", "view-renames"])
    private async viewFollowers(@Ctx() ctx: Context) {
        if (!ctx.from || !ctx.callbackQuery?.message) {
            return;
        }

        const user = await this.getUser(ctx.from);
        const message = await this.getMessage(ctx.callbackQuery.message.message_id);
        if (!user || !message || message.messageId !== ctx.callbackQuery.message.message_id) {
            return;
        }

        if (!("callback_query" in ctx.update) || !("data" in ctx.update.callback_query)) {
            return;
        }

        let data: string | undefined = undefined;
        switch (ctx.update.callback_query.data) {
            case "view-followers":
                data = message.followers;
                break;

            case "view-unfollowers":
                data = message.unfollowers;
                break;

            case "view-renames":
                data = message.renames;
                break;
        }

        if (!data) {
            return;
        }

        await ctx.reply(marked.parseInline(data), {
            parse_mode: "HTML",
            disable_web_page_preview: true,
        });

        await ctx.answerCbQuery();
    }

    @Start()
    public async start(@Ctx() ctx: Context) {
        if (!ctx.from) {
            return;
        }

        const user = await this.ensureUserByFrom(ctx.from);
        await this.sendMessage(user, `Now you can configure your cage instance with this token:\n\`${user.id}\``, {
            parse_mode: "MarkdownV2",
        });
    }

    private async sendMessage(user: TelegramUser, message: string, options?: SendMessageOptions) {
        return this.bot.telegram.sendMessage(user.chatId, message, options);
    }

    private async getMessage(messageId: number) {
        return this.messageRepository.findOne({
            where: {
                messageId,
            },
        });
    }
    private async getUser(from: Required<Context["from"]>) {
        return this.userRepository.findOne({
            where: {
                chatId: from.id.toString(),
            },
        });
    }
    private async getUserByToken(token: string) {
        const user = await this.userRepository.findOne({
            where: {
                id: token,
            },
        });

        if (!user) {
            throw new Error(`Given user with token ${token} does not exist.`);
        }

        return user;
    }
    private async ensureUserByFrom(from: Required<Context["from"]>) {
        let user = await this.userRepository.findOne({
            where: {
                chatId: from.id.toString(),
            },
        });

        if (user) {
            return user;
        }

        user = await this.userRepository.create({
            chatId: from.id.toString(),
        });

        return this.userRepository.save(user);
    }
}
