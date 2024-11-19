import { Body, Controller, Get, Module, Param, Post, Query, Res } from '@nestjs/common'
import type { Response } from 'express'
import type { FastifyReply } from 'fastify'

@Controller()
class AppController {
	@Get('/')
	getHello(@Res() res: FastifyReply | Response) {
		res.header('content-type', 'text/plain').send('Hi')
	}

	@Get('/id/:id')
	getCompose(
		@Res() res: FastifyReply,
		@Param('id') id: string,
		@Query('name') name: string
	) {
		res.header('x-powered-by', 'benchmark')
			.header('content-type', 'text/plain')
			.send(`${id} ${name}`)
	}

	@Post('/json')
	postMirror(@Body() body: unknown) {
		return body
	}
}

@Module({ controllers: [AppController] })
export class AppModule {}
