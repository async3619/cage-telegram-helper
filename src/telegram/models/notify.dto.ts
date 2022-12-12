import { IsInt, IsOptional, IsString, IsUUID } from "class-validator";

export class NotifyDto {
    @IsUUID()
    @IsString()
    public token!: string;

    @IsOptional()
    @IsString()
    public followers?: string;

    @IsOptional()
    @IsString()
    public unfollowers?: string;

    @IsOptional()
    @IsString()
    public renames?: string;

    @IsOptional()
    @IsInt()
    public followerCount?: number;

    @IsOptional()
    @IsInt()
    public unfollowerCount?: number;

    @IsOptional()
    @IsInt()
    public renameCount?: number;
}
