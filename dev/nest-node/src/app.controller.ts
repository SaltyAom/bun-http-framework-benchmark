import {
  Body,
  Controller,
  Get,
  Header,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/')
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/id/:id')
  @Header('x-powered-by', 'Benchmark')
  getCompose(@Param('id') id: string, @Query('name') name: string): string {
    return this.appService.getCompose(id, name);
  }

  @Post('/json')
  postMirror(@Body() body) {
    return body;
  }
}
