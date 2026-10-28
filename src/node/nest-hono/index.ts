import { NestFactory } from '@nestjs/core'
import { HonoAdapter } from '@mnigos/platform-hono'
import { AppModule } from './src/app.module'

async function bootstrap() {
	const app = await NestFactory.create(AppModule, new HonoAdapter())
	await app.listen(3000)
}
bootstrap()
