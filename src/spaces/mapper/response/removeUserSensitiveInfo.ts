import { Space } from '../../entity/space';

export function removeUserSensitiveInfo(space: Space): void {
  space.users.forEach(user => {
    // @ts-ignore
    delete user.password;
    // @ts-ignore
    delete user.refreshToken;
    // @ts-ignore
    delete user.deletedAt
  })
}