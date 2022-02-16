import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@src/prisma.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { SignInDto } from './dto/sign-in.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  generateToken(id: string, email: string) {
    const payload = { id: id, email: email };

    const token = this.jwtService.sign(payload);

    return token;
  }

  async signIn(signInDto: SignInDto) {
    const { email, password } = signInDto;
    const user = await this.prisma.user.findFirst({ where: { email } });

    if (!user)
      throw new BadRequestException('Incorrect email/password combination');

    const passwordMatched = await bcrypt.compare(password, user.password);

    if (!passwordMatched)
      throw new BadRequestException('Incorrect email/password combination');

    const token = this.generateToken(user.id.toString(), email);

    return {
      user,
      token,
    };
  }

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findFirst({ where: { email } });

    if (!user) throw new BadRequestException('Invalid email');

    const token = crypto.randomBytes(30).toString('hex'); // token que será enviado via email.

    const now = new Date();

    now.setHours(now.getHours() + 2);

    /*     await user.updateOne({
      passwordResetToken: token,
      passwordResetExpires: now,
    });
 */
    const sendMailObj = {
      context: { name: `${user.firstName} ${user.lastName}`, token: token },
      template: 'forgotPassword',
      subject: 'Forgot Password',
      to: user.email,
    };

    throw new HttpException('Ok', HttpStatus.OK);
  }

  async resetPassword(email: string, password: string, token: string) {
    const user = await this.prisma.user.findFirst({ where: { email } });

    if (!user) throw new HttpException('Invalid email', HttpStatus.BAD_REQUEST);

    /*     if (token !== user.passwordResetToken)
      throw new HttpException('Token is invalid', HttpStatus.BAD_REQUEST);

    const now = new Date();

    if (now > new Date(user.passwordResetExpires))
      throw new HttpException('Token expired', HttpStatus.BAD_REQUEST);

    const passwordHash = await bcrypt.hash(password, 10);

    await user.updateOne({ password: passwordHash, passwordResetToken: null });
 */
    throw new HttpException('Ok', HttpStatus.OK);
  }
}
