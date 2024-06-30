import { UserEntity } from '@/models/entity/user.entity';

declare global {
  interface Request {
    user?: UserEntity;
  }
}
