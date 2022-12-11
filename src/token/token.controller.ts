import { Controller, Inject, Post } from "@nestjs/common";

import { TokenService } from "@token/token.service";

@Controller()
export class TokenController {
    public constructor(@Inject(TokenService) private readonly tokenService: TokenService) {}

    @Post("/token")
    public token() {
        return this.tokenService.generateToken();
    }
}
