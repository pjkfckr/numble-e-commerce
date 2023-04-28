import { User } from '../../common/structures/user';

export interface IUserService {
  create: () => Promise<User>;
}
