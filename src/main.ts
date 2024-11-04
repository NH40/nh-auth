import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import * as cookieParser from 'cookie-parser'
import { AppModule } from './app.module'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)

	const config = app.get(ConfigService)

	app.use(cookieParser(config.getOrThrow('COOKIES_SECRET')))

	app.setGlobalPrefix('api')
	await app.listen(4200)
}
bootstrap()
