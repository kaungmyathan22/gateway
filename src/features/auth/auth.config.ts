import { Injectable } from '@nestjs/common';
const COGNITO_USER_POOL_ID = 'ap-southeast-1_WciROGcB8';
const COGNITO_CLIENT_ID = '6q8upr2vmcla8ainq097m0usj8';
const COGNITO_REGION = 'ap-southeast-1';

@Injectable()
export class AuthConfig {
  public userPoolId: string = COGNITO_USER_POOL_ID;
  public clientId: string = COGNITO_CLIENT_ID;
  public region: string = COGNITO_REGION;
  public authority = `https://cognito-idp.${COGNITO_REGION}.amazonaws.com/${COGNITO_USER_POOL_ID}`;
  // public userPoolId: string = process.env.COGNITO_USER_POOL_ID;
  // public clientId: string = process.env.COGNITO_CLIENT_ID;
  // public region: string = process.env.COGNITO_REGION;
  // public authority = `https://cognito-idp.${process.env.COGNITO_REGION}.amazonaws.com/${process.env.COGNITO_USER_POOL_ID}`;
}
