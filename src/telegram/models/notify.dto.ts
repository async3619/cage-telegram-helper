import { IsString, IsUUID } from "class-validator";

export class NotifyDto {
    @IsUUID()
    @IsString()
    public token!: string;

    @IsString({ each: true })
    public content!: string[];
}
