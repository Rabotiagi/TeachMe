import { Injectable } from '@nestjs/common';
import { AccountsService } from 'src/accounts/accounts.service';
import { compare } from 'bcrypt';
import { iAccount } from 'src/accounts/interfaces/account.interface';

@Injectable()
export class AuthService {
    constructor(private readonly accountsService: AccountsService){}

    async validateUser(email: string, pass: string): Promise<iAccount>{
        const user = await this.accountsService.processLogin(email);

        if(user && await compare(pass, user.password)) {
            const {password, ...rest} = user;
            return rest as iAccount;
        }

        return null;
    }
}
