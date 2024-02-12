import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  RegisterDTO,
  ResendConfirmationCodeDTO,
  VerifyAccountDTO,
} from './dto/auth.dto';

@Controller('api/v1/authentication')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() payload: RegisterDTO) {
    return await this.authService.registerUser(payload);
  }

  @Post('login')
  async login(@Body() authenticateRequest: { name: string; password: string }) {
    try {
      return await this.authService.authenticateUser(authenticateRequest);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  @Post('resend-verification-code')
  async resendVerificationCode(@Body() payload: ResendConfirmationCodeDTO) {
    return await this.authService.resendConfirmationCode(payload);
  }

  @Post('verify-email')
  async verify(@Body() payload: VerifyAccountDTO) {
    return await this.authService.verifyAccount(payload);
  }
}
