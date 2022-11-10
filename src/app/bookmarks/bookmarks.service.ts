import { Injectable } from '@nestjs/common';
import { CreateBookmarkInput } from './dto/create-bookmark.input';
import { UpdateBookmarkInput } from './dto/update-bookmark.input';

@Injectable()
export class BookmarksService {
  create(createBookmarkInput: CreateBookmarkInput) {
    return 'This action adds a new bookmark';
  }

  findAll() {
    return `This action returns all bookmarks`;
  }

  findOne(id: number) {
    return `This action returns a #${id} bookmark`;
  }

  update(id: number, updateBookmarkInput: UpdateBookmarkInput) {
    return `This action updates a #${id} bookmark`;
  }

  remove(id: number) {
    return `This action removes a #${id} bookmark`;
  }
}
