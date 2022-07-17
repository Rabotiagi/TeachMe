import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './appGuards/local-auth.guard';
import { AuthService } from './auth/auth.service';

@Controller()
export class AppController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@Request() req){
    return await this.authService.login(req.user);
  }

  @Post('refresh')
  async refreshToken(@Body() body: {id: number, refToken: string}){
    return await this.authService.refreshToken(body.id, body.refToken);
  }
}
