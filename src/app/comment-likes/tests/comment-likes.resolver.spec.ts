import { Test, TestingModule } from '@nestjs/testing';
import { CommentLikesResolver } from '../comment-likes.resolver';
import { CommentLikesService } from '../comment-likes.service';

describe('CommentLikesResolver', () => {
  let resolver: CommentLikesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommentLikesResolver, CommentLikesService],
    }).compile();

    resolver = module.get<CommentLikesResolver>(CommentLikesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
