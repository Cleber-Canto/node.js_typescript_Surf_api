import { DefaultMongoDBRepository } from './defaultMongoDBRepository';
import { User } from '../models/user';
import { UserRepository } from '.';

export class UserMongoDBRepository
  extends DefaultMongoDBRepository<User>
  implements UserRepository
{
  constructor(userModel = User) {
    super(userModel);
  }

  async findOneById(id: string) {
    return await this.findOne({ _id: id });
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    return await this.findOne({ email });
  }
}
