import { SpaceService } from '../service/spaceService';
import { Service } from 'typedi';
import { Router } from 'express';
import { User } from '../../user/entity/user';

@Service()
export class SpaceController {
  private readonly router: Router;

  constructor(private readonly spaceService: SpaceService) {
    this.router = Router();
  }

  init() {
    this.router.post('/', async ({ body, user }, res) => {
      res.send(await this.spaceService.createSpace(<User>user, body));
    });

    this.router.get('/', async ({ user }, res) => {
      console.log(user);
      res.send(await this.spaceService.getSpaces());
    });

    this.router.get('/:id', async ({ params }, res) => {
      res.send(await this.spaceService.getSpaceById(parseInt(params.id)));
    });

    this.router.patch('/:id', async ({ body, params }, res) => {
      res.send(await this.spaceService.updateSpace(parseInt(params.id), body));
    });

    this.router.patch('/:id/:userId', async ({ body, params }, res) => {
      res.send(
        await this.spaceService.updateSpace(
          parseInt(params.id),
          body,
          parseInt(params.userId)
        )
      );
    });

    this.router.delete('/:id', async ({ params, user }, res) => {
      res.send(
        await this.spaceService.deleteSpace(parseInt(params.id), <User>user)
      );
    });

    return this.router;
  }
}
