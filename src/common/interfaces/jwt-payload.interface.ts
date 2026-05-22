export interface AdminJwtPayload {
  sub: string;
  instituteId: string;
  role: 'ADMIN';
}

export interface TeacherJwtPayload {
  sub: string;
  instituteId: string;
  adminId: string;
  departmentId: string;
  role: 'TEACHER';
}
