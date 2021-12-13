export interface JwtPayload {
  id: number;
  role_id: number;
  role : string;
  username: string;
  last_password_update: number;
  device: string;
}
