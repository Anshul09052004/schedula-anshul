import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  private users: any[] = [];

  signup(user: any) {
    this.users.push(user);
    return {
      message: 'User registered successfully',
      user,
    };
  }

  login(email: string, password: string) {
    const user = this.users.find(
      (u) => u.email === email && u.password === password,
    );

    if (!user) {
      return { message: 'Invalid credentials' };
    }

    const token = this.jwtService.sign({
      email: user.email,
      role: user.role,
    });

    return {
      access_token: token,
      role: user.role,
    };
  }

  getUsers() {
    return this.users;
  }
}