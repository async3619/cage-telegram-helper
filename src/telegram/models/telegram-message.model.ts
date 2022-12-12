import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { TelegramUser } from "@telegram/models/telegram-user.model";

@Entity()
export class TelegramMessage extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id!: number;

    @Column({ type: "text", nullable: true })
    public followers?: string;

    @Column({ type: "text", nullable: true })
    public unfollowers?: string;

    @Column({ type: "text", nullable: true })
    public renames?: string;

    @Column({ type: "int", nullable: true })
    public messageId!: number;

    @ManyToOne(() => TelegramUser, user => user.messages)
    public user!: TelegramUser;
}
