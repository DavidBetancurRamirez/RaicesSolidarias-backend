import { User } from '@/user/user.schema';

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  data: User;
}
