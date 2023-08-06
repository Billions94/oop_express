import { Space } from '../entity/space';

export interface SpaceResponse {
  statusCode: number;
  message: string;
  data: {
    space: Space | null;
  };
}
