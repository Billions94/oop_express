import { Message } from '../entity/message';

export interface MessageResponse {
  statusCode: number;
  errorMessage: string;
  data: {
    message: Message;
  } | null;
}
