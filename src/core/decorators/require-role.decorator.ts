import { SetMetadata } from '@nestjs/common';

export enum Role {
  SUPER_ADMIN = 1, // 超级管理员
  ADMIN = 2, // 管理员
  DEVELOPER = 3, // 开发者
  HUMAN = 4, // 普通用户
}

export const ROLES_KEY = 'roles';
export const RequireRole = (role: Role) => SetMetadata(ROLES_KEY, role);
