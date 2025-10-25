import axiosInstance from '@/lib/axios';
import { AuthResponse, LoginCredentials, RegisterCredentials, User } from '@/types/auth';

class AuthService {
  private readonly AUTH_PREFIX = '/auth';

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await axiosInstance.post<AuthResponse>(
      `${this.AUTH_PREFIX}/login`,
      credentials
    );
    return response.data;
  }

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const response = await axiosInstance.post<AuthResponse>(
      `${this.AUTH_PREFIX}/register`,
      credentials
    );
    return response.data;
  }

  async getCurrentUser(): Promise<User> {
    const response = await axiosInstance.get<User>(`${this.AUTH_PREFIX}/me`);
    return response.data;
  }

  async logout(): Promise<void> {
    await axiosInstance.post(`${this.AUTH_PREFIX}/logout`);
  }

  async refreshToken(): Promise<{ token: string }> {
    const response = await axiosInstance.post<{ token: string }>(
      `${this.AUTH_PREFIX}/refresh`
    );
    return response.data;
  }
}

export const authService = new AuthService();
