import { PostService } from '../service/postService';
import { Router } from 'express';
import { User } from '../../user/entity/user';
import { Container, Service } from 'typedi';
import { setCache } from '../../cache/cache';

@Service()
export class PostController {
  private readonly router: Router;

  constructor(private readonly postService: PostService) {
    this.router = Router();
  }

  init() {
    this.router.post('/', async ({ body, user }, res) => {
      res.send(await this.postService.createPost(body, <User>user));
    });

    this.router.get('/', setCache('30 seconds'), async (_req, res) => {
      res.send(await this.postService.getAllPosts());
    });

    this.router.get('/:id', setCache('30 seconds'), async ({ params }, res) => {
      res.send(await this.postService.getPostById(parseInt(params.id)));
    });

    this.router.patch('/:id', async ({ body, params }, res) => {
      res.send(await this.postService.updatePost(parseInt(params.id), body));
    });

    this.router.delete('/:id', async ({ params }, res) => {
      res.send(await this.postService.deletePost(parseInt(params.id)));
    });

    return this.router;
  }
}