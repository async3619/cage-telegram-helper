import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";

import { TelegramMessage } from "@telegram/models/telegram-message.model";

@Entity()
export class TelegramUser extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    public id!: string;

    @Column({ type: "varchar", length: 255 })
    public chatId!: string;

    @CreateDateColumn()
    public createdAt!: Date;

    @UpdateDateColumn()
    public updatedAt!: Date;

    @OneToMany(() => TelegramMessage, message => message.user)
    public messages!: TelegramMessage[];
}
