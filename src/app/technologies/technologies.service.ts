import { Injectable } from '@nestjs/common';
import { CreateTechnologyInput } from './dto/create-technology.input';
import { UpdateTechnologyInput } from './dto/update-technology.input';

@Injectable()
export class TechnologiesService {
  create(createTechnologyInput: CreateTechnologyInput) {
    return 'This action adds a new technology';
  }

  findAll() {
    return `This action returns all technologies`;
  }

  findOne(id: number) {
    return `This action returns a #${id} technology`;
  }

  update(id: number, updateTechnologyInput: UpdateTechnologyInput) {
    return `This action updates a #${id} technology`;
  }

  remove(id: number) {
    return `This action removes a #${id} technology`;
  }
}
