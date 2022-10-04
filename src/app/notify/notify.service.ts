import { Injectable } from '@nestjs/common';
import { CreateNotifyInput } from './dto/create-notify.input';
import { UpdateNotifyInput } from './dto/update-notify.input';

@Injectable()
export class NotifyService {
  create(createNotifyInput: CreateNotifyInput) {
    return 'This action adds a new notify';
  }

  findAll() {
    return `This action returns all notify`;
  }

  findOne(id: number) {
    return `This action returns a #${id} notify`;
  }

  update(id: number, updateNotifyInput: UpdateNotifyInput) {
    return `This action updates a #${id} notify`;
  }

  remove(id: number) {
    return `This action removes a #${id} notify`;
  }
}
