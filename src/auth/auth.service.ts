import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from '@nestjs/jwt';
import { Admin } from "../admins/entities/admin.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Session } from "./entities/sesion.entity";
import { AdminsService } from "../admins/admins.service";
import * as bcrypt from 'bcrypt';
import { AdminUserLoginDto } from "./dto/admin-user-login.dto";
import { getDate } from "../common/helpers";
import {User} from "../users/entities/user.entity";
import {UsersService} from "../users/users.service";
import {UserRegisterDto} from './dto/user-register.dto';
import {RegistrationType} from '../users/types/admin.types';
import {GoogleLoginDto} from './dto/google-token.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private adminsService: AdminsService,
    private usersService: UsersService,
    @InjectRepository(Session) private readonly sessionRepository: Repository<Session>
  ) {}

  async loginGoogleUser (
      body: GoogleLoginDto
  ): Promise<{ user: User, tokens: {accessToken: string, refreshToken: string} }>{
    if (body.token !== process.env.GOOGLE_LOGIN_SECRET) {
      throw new UnauthorizedException('Invalid token')
    }

    let userCandidate = await this.usersService.findOne({
      where: {
        email: body.email
      }
    })

    if (!userCandidate) {
      userCandidate = await this.usersService.createUser({
        email: body.email,
        first_name: body.first_name,
        last_name: body.last_name,
        registration_type: RegistrationType.GOOGLE
      })
    }

    const tokens = await this.generateTokensUser(userCandidate);

    await this.createSessionUser(userCandidate, tokens.refreshToken)

    delete userCandidate.password;

    return {
        user: userCandidate,
        tokens
    }
  }


  async createSessionAdmin(admin: Admin, refreshToken: string): Promise<Session> {
    return await this.sessionRepository.save({
      refreshToken,
      admin: admin,
      expiresAt: getDate()+ Number(process.env.ADMIN_REFRESH_TOKEN_EXPIRES_IN)
    })
  }

  async generateTokensAdmin(admin: Admin): Promise<{accessToken: string, refreshToken: string}> {
    const { first_name, email, id } = admin;

    const accessToken = await this.jwtService.signAsync(
      { first_name, email, id},
      {
        expiresIn: process.env.ADMIN_ACCESS_TOKEN_EXPIRES_IN,
        secret: process.env.ADMIN_ACCESS_TOKEN_SECRET,
      },
    )

    const refreshToken = await this.jwtService.signAsync(
      { first_name, email, id },
      {
        expiresIn: process.env.ADMIN_REFRESH_TOKEN_EXPIRES_IN,
        secret: process.env.ADMIN_REFRESH_TOKEN_SECRET,
      },
    );
    return { accessToken, refreshToken }
  }

  async verifyRefreshTokenAdmin(refreshToken: string) {
    try {
      return await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.ADMIN_REFRESH_TOKEN_SECRET,
      });
    } catch (error) {
      return false;
    }
  }

  async refreshTokenAdmin(refreshToken: string): Promise< { admin: Admin, tokens: {refreshToken: string, accessToken: string}}> {
    const refreshAdminData = await this.verifyRefreshTokenAdmin(refreshToken);
    if (!refreshAdminData) {
      throw new UnauthorizedException('Refresh token invalid')
    }

    const admin = await this.adminsService.customFindOne({id: refreshAdminData.id});

    if (!admin) {
      throw new UnauthorizedException('Admin not found')
    }

    const session = await this.sessionRepository.findOne({
      where: {
        refreshToken,
        admin: refreshAdminData.id
      }
    })

    if (!session) {
      throw new UnauthorizedException('Session not found')
    }

    const newTokens = await this.generateTokensAdmin(admin);

    await this.sessionRepository.update(session.id, {
      refreshToken: newTokens.refreshToken,
      expiresAt: getDate() + Number(process.env.ADMIN_REFRESH_TOKEN_EXPIRES_IN)
    })
    delete admin.password;
    return {
      admin,
      tokens: newTokens
    }
  }

  async signInAdmin(data:AdminUserLoginDto): Promise<{ admin: Admin, tokens: { accessToken: string, refreshToken: string } }> {
    const adminCandidate = await this.adminsService.createQueryBuilder().select('*').where('email = :email', {email: data.email}).getRawOne();

    if (!adminCandidate) {
      throw new BadRequestException('Invalid email or password');
    }

    const isPasswordCorrect = await bcrypt.compare(
      data.password,
      adminCandidate.password,
    );

    if (!isPasswordCorrect) {
      throw new BadRequestException('Invalid email or password');
    }

    const tokens = await this.generateTokensAdmin(adminCandidate);

    await this.createSessionAdmin(adminCandidate, tokens.refreshToken);

    delete adminCandidate.password;
    return {
      admin: adminCandidate,
      tokens
    }
  }

  async logoutAdmin(refreshToken: string): Promise<void> {
    const refreshAdminData = await this.verifyRefreshTokenAdmin(refreshToken);
    if (!refreshAdminData) {
      throw new UnauthorizedException('Refresh token invalid')
    }

    const admin = await this.adminsService.customFindOne({id: refreshAdminData.id});

    if (!admin) {
      throw new UnauthorizedException('Admin not found')
    }

    const session = await this.sessionRepository.findOne({
      where: {
        refreshToken,
        admin: refreshAdminData.id
      }
    })

    if (!session) {
      throw new UnauthorizedException('Session not found')
    }

    await this.sessionRepository.delete({
      id: session.id
    })
  }

  // User part

  async createSessionUser(user: User, refreshToken: string): Promise<Session> {
    return await this.sessionRepository.save({
      refreshToken,
      user: user,
      expiresAt: getDate()+ Number(process.env.USER_REFRESH_TOKEN_EXPIRES_IN)
    })
  }

  async generateTokensUser(user: User): Promise<{accessToken: string, refreshToken: string}> {
    const { first_name, email, id } = user;

    const accessToken = await this.jwtService.signAsync(
        { first_name, email, id},
        {
          expiresIn: process.env.USER_ACCESS_TOKEN_EXPIRES_IN,
          secret: process.env.USER_ACCESS_TOKEN_SECRET,
        },
    )

    const refreshToken = await this.jwtService.signAsync(
        { first_name, email, id },
        {
          expiresIn: process.env.USER_REFRESH_TOKEN_EXPIRES_IN,
          secret: process.env.USER_REFRESH_TOKEN_SECRET,
        },
    );
    return { accessToken, refreshToken }
  }

  async verifyRefreshTokenUser(refreshToken: string) {
    try {
      return await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.USER_REFRESH_TOKEN_SECRET,
      });
    } catch (error) {
      return false;
    }
  }


  async refreshTokenUser(refreshToken: string): Promise< { user: User, tokens: {refreshToken: string, accessToken: string}}> {
    const refreshUserData = await this.verifyRefreshTokenUser(refreshToken);
    if (!refreshUserData) {
      throw new UnauthorizedException('Refresh token invalid')
    }

    const user = await this.usersService.findOne({
      where: {
        id: refreshUserData.id
      }
    });

    if (!user) {
      throw new UnauthorizedException('User not found')
    }

    const session = await this.sessionRepository.findOne({
      where: {
        refreshToken,
        user: refreshUserData.id
      }
    })

    if (!session) {
      throw new UnauthorizedException('Session not found')
    }

    const newTokens = await this.generateTokensUser(user);

    await this.sessionRepository.update(session.id, {
      refreshToken: newTokens.refreshToken,
      expiresAt: getDate() + Number(process.env.USER_REFRESH_TOKEN_EXPIRES_IN)
    })
    delete user.password;
    return {
      user,
      tokens: newTokens
    }
  }


  async signInUser(data:AdminUserLoginDto): Promise<{ user: User, tokens: { accessToken: string, refreshToken: string } }> {
    const userCandidate = await this.usersService.createQueryBuilder().select('*').where('email = :email', {email: data.email}).getRawOne();

    if (!userCandidate) {
      throw new BadRequestException('Invalid email or password');
    }

    const isPasswordCorrect = await bcrypt.compare(
        data.password,
        userCandidate.password,
    );

    if (!isPasswordCorrect) {
      throw new BadRequestException('Invalid email or password');
    }

    const tokens = await this.generateTokensUser(userCandidate);

    await this.createSessionUser(userCandidate, tokens.refreshToken);

    delete userCandidate.password;
    return {
      user: userCandidate,
      tokens
    }
  }

  async registerUser(data:UserRegisterDto): Promise<{ user: User, tokens: { accessToken: string, refreshToken: string }}> {
    const newUser = await this.usersService.createUser(data);

    const tokens = await this.generateTokensUser(newUser);

    await this.createSessionUser(newUser, tokens.refreshToken);

    delete newUser.password;
    return {
      user: newUser,
      tokens
    }
  }

  async logoutUser(refreshToken: string): Promise<void> {
    const refreshUserData = await this.verifyRefreshTokenUser(refreshToken);
    if (!refreshUserData) {
      throw new UnauthorizedException('Refresh token invalid')
    }

    const user = await this.usersService.findOne({where: {id: refreshUserData.id}});

    if (!user) {
      throw new UnauthorizedException('User not found')
    }

    const session = await this.sessionRepository.findOne({
      where: {
        refreshToken,
        user: refreshUserData.id
      }
    })

    if (!session) {
      throw new UnauthorizedException('Session not found')
    }

    await this.sessionRepository.delete({
      id: session.id
    })
  }
}
