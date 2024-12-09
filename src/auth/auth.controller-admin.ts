import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Res,
  Get,
  Req,
} from "@nestjs/common";
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { Response, Request } from 'express';
import { AdminUserLoginDto } from "./dto/admin-user-login.dto";

@ApiTags('Auth')
@Controller('auth/admin')
export class AuthControllerAdmin {
  constructor(
    private authService: AuthService
  ) {}

  @Post('login')
  async signInAdmin(
      @Body() body: AdminUserLoginDto,
      @Req() req: Request,
      @Res() res: Response
  ) {
    try {
      const loginData = await this.authService.signInAdmin(body)

      res.cookie('refresh_token_admin', loginData.tokens.refreshToken, {
        maxAge: +process.env.ADMIN_REFRESH_TOKEN_EXPIRES_IN,
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      });
      res.cookie('access_token_admin', loginData.tokens.accessToken, {
        maxAge: +process.env.ADMIN_ACCESS_TOKEN_EXPIRES_IN,
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      });

      res.json(loginData.admin);
    }catch (e) {
      console.log('admin login error', e);
      throw e
    }
  }

  @Get('refresh')
  async refresh(
      @Req() req: Request,
      @Res() res: Response
  ) {
    const { refresh_token_admin } = req.cookies;;
    if (!refresh_token_admin) {
      res.status(HttpStatus.UNAUTHORIZED).json({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Refresh token expired',
      });
    }

    const result = await this.authService.refreshTokenAdmin(refresh_token_admin);

    res.cookie('refresh_token_admin', result.tokens.refreshToken, {
      maxAge: +process.env.ADMIN_REFRESH_TOKEN_EXPIRES_IN,
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });

    res.cookie('access_token_admin', result.tokens.accessToken, {
      maxAge: +process.env.ADMIN_ACCESS_TOKEN_EXPIRES_IN,
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });

    res.json(result.admin);
  }
  //
  @HttpCode(HttpStatus.OK)
  @Get('logOut')
  async logOut(
      @Req() req: Request,
      @Res() res: Response
  ) {
    const { refresh_token_admin } = req.cookies;;
    if (!refresh_token_admin) {
      res.status(HttpStatus.UNAUTHORIZED).json({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Refresh token expired',
      });
      return
    }

    await this.authService.logoutAdmin(refresh_token_admin);

    res.cookie("refresh_token_admin", "", { expires: new Date(0) });
    res.cookie("access_token_admin", "", { expires: new Date(0) });
    res.clearCookie("refresh_token_admin");
    res.clearCookie("access_token_admin");

    res.json({
        statusCode: HttpStatus.OK,
        message: 'Logout success',
    });
  }
}
