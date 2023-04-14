import { SpaceInput } from '../../interfaces/spaceInput';
import { Space } from '../../entity/space';
import { User } from '../../../user/entity/user';

export function spaceRequestMapper(spaceInput: SpaceInput, user: User): Space {
  const space = new Space();
  space.name = spaceInput.name;
  space.isActive = true;
  space.users = [user]
  return space;
}
