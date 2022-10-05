import { Injectable } from '@nestjs/common';
import { CreatePlatformInput } from './dto/create-platform.input';
import { UpdatePlatformInput } from './dto/update-platform.input';

@Injectable()
export class PlatformsService {
  create(createPlatformInput: CreatePlatformInput) {
    return 'This action adds a new platform';
  }

  findAll() {
    return `This action returns all platforms`;
  }

  findOne(id: number) {
    return `This action returns a #${id} platform`;
  }

  update(id: number, updatePlatformInput: UpdatePlatformInput) {
    return `This action updates a #${id} platform`;
  }

  remove(id: number) {
    return `This action removes a #${id} platform`;
  }
}
