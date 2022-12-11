import { Global, Module } from "@nestjs/common";

import { TokenService } from "@token/token.service";
import { TokenController } from "@token/token.controller";

@Global()
@Module({
    providers: [TokenService],
    controllers: [TokenController],
    exports: [TokenService],
})
export class TokenModule {}
