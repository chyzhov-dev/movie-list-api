import { Request } from 'express';

export interface AuthRequestPayload {
  id: number;
}

export interface AuthRequest extends Request {
  user: AuthRequestPayload;
}

export interface AuthResponse {
 accessToken: string
}
