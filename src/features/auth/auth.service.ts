import { CognitoErrorConstants } from '@/common/constants/cognito-error.constants';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool,
} from 'amazon-cognito-identity-js';
import { AuthConfig } from './auth.config';
import {
  RegisterDTO,
  ResendConfirmationCodeDTO,
  VerifyAccountDTO,
} from './dto/auth.dto';

@Injectable()
export class AuthService {
  private userPool: CognitoUserPool;
  constructor(
    @Inject('AuthConfig')
    private readonly authConfig: AuthConfig,
  ) {
    this.userPool = new CognitoUserPool({
      UserPoolId: this.authConfig.userPoolId,
      ClientId: this.authConfig.clientId,
    });
  }

  registerUser(registerRequest: RegisterDTO) {
    const { email, password } = registerRequest;
    return new Promise((resolve, reject) => {
      return this.userPool.signUp(
        email,
        password,
        [new CognitoUserAttribute({ Name: 'email', Value: email })],
        null,
        (err: any, result) => {
          if (!result) {
            if (err.code === CognitoErrorConstants.UsernameExistsException) {
              reject(new HttpException(err.message, HttpStatus.CONFLICT));
            }
            reject(err);
          } else {
            resolve({
              message:
                'Successfully created account. A verification code has been sent to your account.',
            });
          }
        },
      );
    });
  }

  authenticateUser(user: { name: string; password: string }) {
    const { name, password } = user;

    const authenticationDetails = new AuthenticationDetails({
      Username: name,
      Password: password,
    });
    const userData = {
      Username: name,
      Pool: this.userPool,
    };

    const newUser = new CognitoUser(userData);

    return new Promise((resolve, reject) => {
      return newUser.authenticateUser(authenticationDetails, {
        onSuccess: result => {
          resolve({
            accessToken: result.getAccessToken().getJwtToken(),
            refreshToken: result.getRefreshToken().getToken(),
          });
        },
        onFailure: err => {
          reject(err);
        },
      });
    });
  }

  resendConfirmationCode({ email }: ResendConfirmationCodeDTO) {
    const userData = {
      Username: email,
      Pool: this.userPool,
    };
    const user = new CognitoUser(userData);
    return new Promise((resolve, reject) => {
      user.resendConfirmationCode(err => {
        if (err) {
          console.error(err);
          reject(
            new HttpException('Something went wrong', HttpStatus.BAD_REQUEST),
          );
        } else {
          resolve({
            message: 'A confirmation code has been sent to your email address.',
          });
        }
      });
    });
  }

  verifyAccount({ email, code }: VerifyAccountDTO) {
    const userData = {
      Username: email,
      Pool: this.userPool,
    };

    const user = new CognitoUser(userData);
    return new Promise((resolve, reject) => {
      user.confirmRegistration(code, true, (err, result) => {
        if (err) {
          reject(new HttpException(err.message, HttpStatus.BAD_REQUEST));
        } else {
          resolve({
            message: 'Successfully verified your account. Please login.',
          });
        }
      });
    });
  }
}
