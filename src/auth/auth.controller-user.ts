import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Res,
  Get,
  Req, Ip, UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {ApiResponse, ApiTags} from '@nestjs/swagger';
import {AdminUserLoginDto} from './dto/admin-user-login.dto';
import { Response, Request } from 'express';
import {UserRegisterDto} from './dto/user-register.dto';
import {GoogleLoginDto} from './dto/google-token.dto';


@ApiTags('Auth')
@Controller('auth/user')
export class AuthControllerUser {
  constructor(private authService: AuthService) {}

  @Post('google/login')
  async googleLogin(
      @Body() body: GoogleLoginDto,
      @Req() req: Request,
      @Res() res: Response,
      @Ip() ip: string
  ) {
    try {
      const loginData = await this.authService.loginGoogleUser(body)

      res.cookie('refresh_token_user', loginData.tokens.refreshToken, {
        maxAge: +process.env.USER_REFRESH_TOKEN_EXPIRES_IN,
        httpOnly: false,
        secure: true,
        sameSite: 'none',
      });
      res.cookie('access_token_user', loginData.tokens.accessToken, {
        maxAge: +process.env.USER_ACCESS_TOKEN_EXPIRES_IN,
        httpOnly: false,
        secure: true,
        sameSite: 'none',
      });
      res.json({
        user: loginData.user,
        accessToken: loginData.tokens.accessToken,
        refreshToken: loginData.tokens.refreshToken
      });
    }catch (e) {
      console.log('User login error', e);
      throw e
    }
  }

  @Post('login')
  async signInUser(
      @Body() body: AdminUserLoginDto,
      @Req() req: Request,
      @Res() res: Response
  ) {
    try {
      const loginData = await this.authService.signInUser(body)

      res.cookie('refresh_token_user', loginData.tokens.refreshToken, {
        maxAge: +process.env.USER_REFRESH_TOKEN_EXPIRES_IN,
        httpOnly: false,
        secure: true,
        sameSite: 'none',
      });
      res.cookie('access_token_user', loginData.tokens.accessToken, {
        maxAge: +process.env.USER_ACCESS_TOKEN_EXPIRES_IN,
        httpOnly: false,
        secure: true,
        sameSite: 'none',
      });

      res.json({
        user: loginData.user,
        accessToken: loginData.tokens.accessToken,
        refreshToken: loginData.tokens.refreshToken
      });
    }catch (e) {
      console.log('User login error', e);
      throw e
    }
  }

  @Post('register')
  @ApiResponse({
    status: 201,
    description: 'User created',
    type: UserRegisterDto
  })
  async registerUser(
      @Body() body: UserRegisterDto,
      @Req() req: Request,
      @Res() res: Response
  ) {
    try {
      const registerData = await this.authService.registerUser(body)
      res.cookie('refresh_token_user', registerData.tokens.refreshToken, {
        maxAge: +process.env.USER_REFRESH_TOKEN_EXPIRES_IN,
        httpOnly: false,
        secure: true,
        sameSite: 'none',
      });
      res.cookie('access_token_user', registerData.tokens.accessToken, {
        maxAge: +process.env.USER_ACCESS_TOKEN_EXPIRES_IN,
        httpOnly: false,
        secure: true,
        sameSite: 'none',
      });

      res.json({
        user: registerData.user,
        accessToken: registerData.tokens.accessToken,
        refreshToken: registerData.tokens.refreshToken
      });
    }catch (e) {
      console.log('User login error', e);
      throw e
    }
  }

  @Get('refresh')
  async refresh(
      @Req() req: Request,
      @Res() res: Response
  ) {
    const refresh_token_user = req.headers.authorization;

    if (!refresh_token_user) {
      res.status(HttpStatus.UNAUTHORIZED).json({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Refresh token expired',
      });
    }

    const result = await this.authService.refreshTokenUser(refresh_token_user)

    res.cookie('refresh_token_user', result.tokens.refreshToken, {
      maxAge: +process.env.USER_REFRESH_TOKEN_EXPIRES_IN,
      httpOnly: false,
      secure: true,
      sameSite: 'none',
    });

    res.cookie('access_token_user', result.tokens.accessToken, {
      maxAge: +process.env.USER_ACCESS_TOKEN_EXPIRES_IN,
      httpOnly: false,
      secure: true,
      sameSite: 'none',
    });

    res.json({
      user: result.user,
      accessToken: result.tokens.accessToken,
      refreshToken: result.tokens.refreshToken
    })
  }

  @HttpCode(HttpStatus.OK)
  @Get('logOut')
  async logOut(
      @Req() req: Request,
      @Res() res: Response
  ) {
    const { refresh_token_user } = req.cookies;;
    if (!refresh_token_user) {
      res.status(HttpStatus.UNAUTHORIZED).json({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Refresh token expired',
      });
      return
    }

    await this.authService.logoutUser(refresh_token_user);

    res.cookie("refresh_token_user", "", { expires: new Date(0) });
    res.cookie("access_token_user", "", { expires: new Date(0) });
    res.clearCookie("refresh_token_user");
    res.clearCookie("access_token_user");

    res.json({
      statusCode: HttpStatus.OK,
      message: 'Logout success',
    });
  }
}
