require('dotenv').config();
import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from 'passport-jwt';
import { AccountsService } from "src/accounts/accounts.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly accountsService: AccountsService){
        super({
            secretOrKey: process.env.JWT_KEY,
            ignoreExpiration: false,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        });
    }

    async validate(payload: any){
        const {password, ...rest} = await this.accountsService.getAccountData(payload.id);
        return rest;
    }
}