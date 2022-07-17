import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from 'passport-local';
import { iAccount } from "src/accounts/interfaces/account.interface";
import { AuthService } from "./auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService){
        super();
    }

    async validate(email: string, password: string): Promise<iAccount>{
        const user = await this.authService.validateUser(email, password);
        if(!user) throw new UnauthorizedException();
        return user;
    }
}