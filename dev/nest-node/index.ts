import { NestFactory } from '@nestjs/core';
import { Module, Res } from '@nestjs/common';
import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import type { Response } from 'express';

@Controller()
class AppController {
  @Get('/')
  getHello(@Res() res: Response) {
    res.header('content-type', 'text/plain').send('Hi');
  }

  @Get('/id/:id')
  getCompose(
    @Res() res: Response,
    @Param('id') id: string,
    @Query('name') name: string,
  ) {
    res.header('content-type', 'text/plain').send(`${id} ${name}`);
  }

  @Post('/json')
  postMirror(@Body() body) {
    return body;
  }
}

@Module({ controllers: [AppController] })
class AppModule {}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
