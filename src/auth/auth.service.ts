import { UserService } from '@/user/user.service'
import {
	ConflictException,
	Injectable,
	InternalServerErrorException,
} from '@nestjs/common'
import { AuthMethod } from '@prisma/__generated__'
import { User } from '@prisma/__generated__/edge'
import { Request } from 'express'
import { RegisterDto } from './dto/register.dto'

@Injectable()
export class AuthService {
	public constructor(private readonly userService: UserService) {}

	public async register(req: Request, dto: RegisterDto) {
		const isExist = await this.userService.findByEmail(dto.email)

		if (isExist) {
			throw new ConflictException(
				'Регистрация не удалась. Пользователь с таким email уже существует. Пожалуйста, используйте другой email или войдите в систему.'
			)
		}

		const newUser = await this.userService.create(
			dto.email,
			dto.password,
			dto.name,
			'',
			AuthMethod.CREDENTIALS,
			false
		)

		return this.saveSession(req, newUser)
	}

	public async login() {}

	public async logout() {}

	private async saveSession(req: Request, user: User) {
		return new Promise((resolver, reject) => {
			req.session.userId = user.id
			req.session.save(err => {
				if (err) {
					return reject(
						new InternalServerErrorException(
							'Не удалось схоронить сессию. Проверьте, правильно ли настроены параметры сессии'
						)
					)
				}

				resolver({
					user,
				})
			})
		})
	}
}
