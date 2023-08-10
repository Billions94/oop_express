import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { Message } from '../entity/message';
import { DB } from '../../db/dbConnect';
import { UpdateMessageInput } from '../interfaces/messageInput';

@Service()
export class MessageRepository extends Repository<Message> {
  constructor() {
    super(Message, DB.dataSource.createEntityManager());
  }

  async findById(id: number): Promise<Message | null> {
    return await this.findOne({ where: { id: id } });
  }

  async findByIdAndUpdate(
    id: number,
    update: UpdateMessageInput
  ): Promise<Message | null> {
    const message = await this.findById(id);

    if (!message) return null;

    message.content = update.content;
    message.media = update.media ? update.media : '';
    await this.save(message);

    return message;
  }

  async isExists(id: number): Promise<boolean> {
    const message = await this.findOne({ where: { id: id } });
    return !!message;
  }

  async deleteById(id: number): Promise<void> {
    await this.delete({ id: id });
  }
}
