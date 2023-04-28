import { User } from '../../../common/structures/user';

export class CreateUserResponseDto implements User {
  id!: string;
}
