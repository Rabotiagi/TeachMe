import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Query, Req, Res, UploadedFile, UseGuards, UseInterceptors, UsePipes } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtGuard } from 'src/appGuards/jwt-auth.guard';
import { QueryValidationPipe } from 'src/appPipes/queryValidate.pipe';
import { AccountsService } from './accounts.service';
import { AccountDto, UpdateAccountDto } from './dto/accounts.dto';
import { TutorDataDto } from './dto/tutorData.dto';
import { Response } from 'express';
import { IdValidationPipe } from 'src/appPipes/idValidation.pipe';
import { Users } from 'src/database/entities/users.entity';
import { Filter } from './types/filter';
import { iTutorData } from './interfaces/tutorData.interface';
import { DuplicationGuard } from 'src/appGuards/duplication.guard';

@Controller('accounts')
export class AccountsController {
    constructor(
        private readonly accountService: AccountsService
    ){}

    @Get('tutors')
    @UseGuards(JwtGuard)
    @UsePipes(new QueryValidationPipe())
    async getTutors(@Query() params: Filter){
        return await this.accountService.getTutors(params);
    }

    @Get(':id')
    @UseGuards(JwtGuard)
    @UsePipes(new IdValidationPipe(Users))
    async getAccount(@Param('id') id: string){
        return await this.accountService.getAccountData(Number(id));
    }

    @Get(':id/photo')
    @UseGuards(JwtGuard)
    @UsePipes(new IdValidationPipe(Users))
    async getAccountPhoto(@Param('id') id: string, @Res() res: Response){
        await this.accountService.getAccountPhoto(Number(id), res);
    }

    @Post()
    async createAccount(@Body() body: AccountDto){
        return await this.accountService.createAccount(body);
    }

    @Post('tutor-data')
    @UseGuards(JwtGuard, DuplicationGuard)
    async postTutorData(@Req() req, @Body() body: TutorDataDto){
        body.user = req.user.id;
        return await this.accountService.addTutorData(body as iTutorData);
    }

    @Post('photo')
    @UseGuards(JwtGuard, DuplicationGuard)
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
