import { Body, Controller, Delete, Get, Param, Post, Put, Redirect, Req, UseGuards, UsePipes } from '@nestjs/common';
import { AuthorshipGuard } from 'src/appGuards/authorship.guard';
import { JwtGuard } from 'src/appGuards/jwt-auth.guard';
import { IdValidationPipe } from 'src/appPipes/idValidation.pipe';
import { Services } from 'src/database/entities/services.entity';
import { Users } from 'src/database/entities/users.entity';
import { ServiceDto, UpdateServiceDto } from './dto/service.dto';
import { iPurchaseItem, iService } from './interfaces/service.interface';
import { TutorServicesService } from './tutor-services.service';

@Controller('services')
@UseGuards(JwtGuard)
export class TutorServicesController {
    constructor(private readonly tutorServicesService: TutorServicesService){}

    @Get('payment/success')
    async paymentSuccess(){
        return 'Payment proceded successfuly';
    }

    @Get('payment/cancel')
    paymentFailed(){
        return 'Sth went wrong';
    }

    @Get(':tutorDataId')
    @UsePipes(new IdValidationPipe(Users))
    async getServices(@Param('tutorDataId') id: number){
        return await this.tutorServicesService.getServices(id);
    }

    @Post('payment')
    @Redirect()
    async payforService(@Body() body: {items: iPurchaseItem[]}){
        const checkoutUrl = await this.tutorServicesService.createCheckout(body.items);
        return {url: checkoutUrl};
    }

    @Post()
    async createService(@Req() req , @Body() newService: ServiceDto){
        return await this.tutorServicesService.createService(req.user.id, newService as iService);
    }

    @Put(':serviceId')
    @UseGuards(new AuthorshipGuard(Services))
    @UsePipes(new IdValidationPipe(Services))
    async updateService(@Param('serviceId') id: number, @Body() updateData: UpdateServiceDto){
        return await this.tutorServicesService.updateService(id, updateData);
    }

    @Delete(':serviceId')
    @UseGuards(new AuthorshipGuard(Services))
    @UsePipes(new IdValidationPipe(Services))
    async deleteService(@Param('serviceId') id: number){
        return await this.tutorServicesService.deleteService(id);
    }
}
