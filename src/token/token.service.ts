import { Injectable } from "@nestjs/common";
import { v4 as generateUuid } from "uuid";

interface Token {
    token: string;
    expires: number;
}

const TOKEN_EXPIRATION = 1000 * 60 * 60; // 1 hour

@Injectable()
export class TokenService {
    private tokenStorage: Token[] = [];

    public generateToken() {
        // remove old expired tokens
        this.tokenStorage = this.tokenStorage.filter(t => t.expires > Date.now());

        while (true) {
            const token = generateUuid();
            const matched = this.tokenStorage.find(t => t.token === token);
            if (!matched) {
                const expires = Date.now() + TOKEN_EXPIRATION;
                this.tokenStorage.push({ token, expires });

                return { token, expires };
            }
        }
    }
    public checkToken(token: string) {
        const matched = this.tokenStorage.find(t => t.token === token);
        if (!matched) {
            return false;
        }

        if (matched.expires < Date.now()) {
            this.tokenStorage.splice(this.tokenStorage.indexOf(matched), 1);
            return false;
        }

        return true;
    }
}
