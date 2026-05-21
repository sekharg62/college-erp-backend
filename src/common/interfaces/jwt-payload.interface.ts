export interface AdminJwtPayload {
  sub: string;
  instituteId: string;
  role: 'ADMIN';
}
