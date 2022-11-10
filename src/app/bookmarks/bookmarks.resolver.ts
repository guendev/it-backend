import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { BookmarksService } from './bookmarks.service';
import { Bookmark } from './entities/bookmark.entity';
import { CreateBookmarkInput } from './dto/create-bookmark.input';
import { UpdateBookmarkInput } from './dto/update-bookmark.input';

@Resolver(() => Bookmark)
export class BookmarksResolver {
  constructor(private readonly bookmarksService: BookmarksService) {}

  @Mutation(() => Bookmark)
  createBookmark(@Args('createBookmarkInput') createBookmarkInput: CreateBookmarkInput) {
    return this.bookmarksService.create(createBookmarkInput);
  }

  @Query(() => [Bookmark], { name: 'bookmarks' })
  findAll() {
    return this.bookmarksService.findAll();
  }

  @Query(() => Bookmark, { name: 'bookmark' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.bookmarksService.findOne(id);
  }

  @Mutation(() => Bookmark)
  updateBookmark(@Args('updateBookmarkInput') updateBookmarkInput: UpdateBookmarkInput) {
    return this.bookmarksService.update(updateBookmarkInput.id, updateBookmarkInput);
  }

  @Mutation(() => Bookmark)
  removeBookmark(@Args('id', { type: () => Int }) id: number) {
    return this.bookmarksService.remove(id);
  }
}
