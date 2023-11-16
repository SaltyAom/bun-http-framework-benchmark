import {
  Body,
  Controller,
  Get,
  Header,
  Param,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/')
  @Header('content-type', 'text/html')
  getHello() {
    return this.appService.getHello();
  }

  @Get('/id/:id')
  @Header('content-type', 'text/html')
  getCompose(@Param('id') id: string, @Query('name') name: string) {
    return `${id} ${name}`;
  }

  @Post('/json')
  postMirror(@Body() body) {
    return body;
  }
}
