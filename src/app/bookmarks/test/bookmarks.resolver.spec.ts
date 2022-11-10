import { Test, TestingModule } from '@nestjs/testing';
import { BookmarksResolver } from '../bookmarks.resolver';
import { BookmarksService } from '../bookmarks.service';

describe('BookmarksResolver', () => {
  let resolver: BookmarksResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BookmarksResolver, BookmarksService],
    }).compile();

    resolver = module.get<BookmarksResolver>(BookmarksResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
