import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hi';
  }

  getCompose(id: string, name: string): string {
    return `${id} ${name}`;
  }
}
