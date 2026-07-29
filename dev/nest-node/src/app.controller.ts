import {
  Body,
  Controller,
  Get,
  Header,
  Param,
  Post,
  Query,
  Res,
  StreamableFile,
} from '@nestjs/common';
import { createReadStream } from 'node:fs';
import { AppService } from './app.service';
import { extraRoutes } from '../../../src/extra-routes.mjs';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/')
  @Header('content-type', 'text/plain')
  getHello() {
    return this.appService.getHello();
  }

  @Get('/video')
  getVideo() {
    return new StreamableFile(createReadStream('public/kyuukurarin.mp4'), {
      type: 'video/mp4',
    });
  }

  @Get('/id/:id')
  @Header('content-type', 'text/plain')
  @Header('x-powered-by', 'benchmark')
  getCompose(@Param('id') id: string, @Query('name') name: string) {
    return `${id} ${name ?? ''}`;
  }

  @Post('/json')
  postMirror(@Body() body) {
    return body;
  }
}

for (const [index, route] of extraRoutes.entries()) {
  for (const [method, path, prefix] of [
    [Get, route, 'extraGet'],
    [Post, `${route}/submit`, 'extraPost'],
  ] as const) {
    const name = `${prefix}${index}`;
    Object.defineProperty(AppController.prototype, name, {
      configurable: true,
      value: () => 'ok',
    });
    method(path)(
      AppController.prototype,
      name,
      Object.getOwnPropertyDescriptor(AppController.prototype, name)!,
    );
  }
}

for (const name of ['getHello', 'getVideo', 'getCompose', 'postMirror'] as const) {
  const descriptor = Object.getOwnPropertyDescriptor(AppController.prototype, name)!;
  Reflect.deleteProperty(AppController.prototype, name);
  Object.defineProperty(AppController.prototype, name, descriptor);
}
