import { Router } from 'express';
import { setCache } from '../../cache/cache';
import { UserService } from '../service/userService';
import { Service } from 'typedi';

@Service()
export class UserController {
  private readonly router: Router;

  constructor(private readonly userService: UserService) {
    this.router = Router();
  }

  init() {
    this.router.post('/register', async ({ body }, res) => {
      res.send(await this.userService.createUser(body));
    });

    this.router.post('/login', async ({ body }, res) => {
      res.send(await this.userService.login(body.email, body.password));
    });

    this.router.get('/', setCache('30 seconds'), async (_req, res) => {
      res.send(await this.userService.getUsers());
    });

    this.router.get('/:id', setCache('30 seconds'), async ({ params }, res) => {
      res.send(await this.userService.getUserById(parseInt(params.id)));
    });

    this.router.patch('/:id', async ({ body, params }, res) => {
      res.send(await this.userService.updateUser(parseInt(params.id), body));
    });

    this.router.delete('/:id', async ({ params }, res) => {
      res.send(await this.userService.deleteUser(parseInt(params.id)));
    });

    return this.router;
  }
}
