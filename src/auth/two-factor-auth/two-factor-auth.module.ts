import { MailService } from '@/libs/mail/mail.service'
import { Module } from '@nestjs/common'
import { TwoFactorAuthService } from './two-factor-auth.service'

@Module({
	providers: [TwoFactorAuthService, MailService],
})
export class TwoFactorAuthModule {}
