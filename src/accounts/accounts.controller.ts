import { Body, Controller, Delete, Get, Param, Post, Put, Query, UsePipes } from '@nestjs/common';
import { IdValidationPipe } from 'src/appPipes/idValidation.pipe';
import { AccountsService } from './accounts.service';
import { AccountDto, UpdateAccountDto } from './dto/accounts.dto';
import { TutorDataDto } from './dto/tutorData.dto';

@Controller('accounts')
export class AccountsController {
    constructor(
        private readonly accountService: AccountsService
    ){}

    @Get('tutors')
    async getTutors(@Query() params: {subject: string}){
        return await this.accountService.getTutors(params);
    }

    @Get(':id')
    @UsePipes(IdValidationPipe)
    async getAccount(@Param('id') id: string){
        return await this.accountService.getAccountData(Number(id));
    }

    @Post()
    async createAccount(@Body() body: AccountDto){
        return await this.accountService.createAccount(body);
    }

    @Post('tutor-data')
    async postTutorData(@Body() body: TutorDataDto){
        return await this.accountService.addTutorData(body);
    }

    @Put(':id')
    @UsePipes(IdValidationPipe)
    async updateAccountData(@Param('id') id: string, @Body() body: UpdateAccountDto){
        return await this.accountService.updateAccount(Number(id), body);
    }

    @Delete(':id')
    @UsePipes(IdValidationPipe)
    async deleteAccount(@Param('id') id: string){
        return await this.accountService.deleteAccount(Number(id));
    }
}
