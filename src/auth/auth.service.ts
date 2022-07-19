import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AccountsService } from 'src/accounts/accounts.service';
import { compare } from 'bcrypt';
import { iAccount } from 'src/accounts/interfaces/account.interface';
import { Repository } from 'typeorm';
import { RefTokens } from 'src/database/entities/refTokens.entity';
import AppDataSource from 'src/database/connection';

type JwtPayload = {id: number, name: string};

@Injectable()
export class AuthService {
    constructor(
        private readonly accountsService: AccountsService,
        private readonly jwtService: JwtService,
        private readonly refTokensRepo: Repository<RefTokens>
    ){
        this.refTokensRepo = AppDataSource.getRepository(RefTokens);
    }

    async validateUser(email: string, pass: string): Promise<iAccount>{
        const user = await this.accountsService.processLogin(email);

        if(user && await compare(pass, user.password)) {
            const {password, ...rest} = user;
            return rest as iAccount;
        }

        return null;
    }

    async login(user: iAccount): Promise<{accessToken: string, refToken: string}>{
        const payload = {id: user.id, name: user.firstName};
        const accessToken = this.jwtService.sign(payload);
        const refToken = this.jwtService.sign(payload, {expiresIn: '2h'});

        const oldRefToken = await this.refTokensRepo
            .createQueryBuilder('ref_tokens')
            .where('ref_tokens.user = :userId', {userId: user.id})
            .getOne();

        if(oldRefToken) await this.refTokensRepo.delete(oldRefToken.id);
        const tokenRecord = this.refTokensRepo.create({refToken, user});
        await this.refTokensRepo.save(tokenRecord);


        return {
            accessToken,
            refToken
        };
    }

    async refreshToken(id: number, refToken: string): Promise<{accessToken: string}>{
        const tokenRecord = await this.refTokensRepo.findOne({
            where: {refToken},
            relations: {user: true}
        });

        if(tokenRecord && tokenRecord.user.id === id){
            const payload = this.jwtService.decode(tokenRecord.refToken) as JwtPayload;
            return {
                accessToken: this.jwtService.sign({
                    id: payload.id,
                    name: payload.name
                })
            };
        }

        throw new UnauthorizedException();
    }
}
