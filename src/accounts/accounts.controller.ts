import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UploadedFile, UseGuards, UseInterceptors, UsePipes } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtGuard } from 'src/appGuards/jwt-auth.guard';
import { QueryValidationPipe } from 'src/appPipes/queryValidate.pipe';
import { AccountsService } from './accounts.service';
import { AccountDto, UpdateAccountDto } from './dto/accounts.dto';
import { TutorDataDto } from './dto/tutorData.dto';

@Controller('accounts')
export class AccountsController {
    constructor(
        private readonly accountService: AccountsService
    ){}

    @Get()
    @UseGuards(JwtGuard)
    async getAccount(@Req() req){
        return await this.accountService.getAccountData(req.user.id);
    }

    @Get('tutors')
    @UseGuards(JwtGuard)
    @UsePipes(new QueryValidationPipe())
    async getTutors(@Query() params: {subject: string, grade: number, minPrice: number, maxPrice: number}){
        return await this.accountService.getTutors(params);
    }

    @Post()
    async createAccount(@Body() body: AccountDto){
        return await this.accountService.createAccount(body);
    }

    @Post('tutor-data')
    @UseGuards(JwtGuard)
    async postTutorData(@Req() req, @Body() body: TutorDataDto){
        body.user = req.user.id;
        return await this.accountService.addTutorData(body);
    }

    @Post('photo')
    @UseGuards(JwtGuard)
    @UseInterceptors(FileInterceptor('photo', {dest: './src/database/files'}))
    async uploadAccountPhoto(@Req() req, @UploadedFile() file: Express.Multer.File){
        if(!file) throw new BadRequestException('Missing file');
        return await this.accountService.uploadAccountPhoto(req.user.id, file.filename);
    }

    @Put()
    @UseGuards(JwtGuard)
    async updateAccountData(@Req() req, @Body() body: UpdateAccountDto){
        return await this.accountService.updateAccount(req.user.id, body);
    }

    @Put('photo')
    @UseGuards(JwtGuard)
    @UseInterceptors(FileInterceptor('photo', {dest: './src/database/files'}))
    async updateAccountPhoto(@Req() req, @UploadedFile() file: Express.Multer.File){
        if(!file) throw new BadRequestException('Missing file');
        return await this.accountService.updateAccountPhoto(req.user.id, file.filename);
    }

    @Delete()
    @UseGuards(JwtGuard)
    async deleteAccount(@Req() req){
        return await this.accountService.deleteAccount(req.user.id);
    }
}
