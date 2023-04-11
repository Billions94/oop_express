import { Router } from 'express';
import { setCache } from '../../cache/cache';
import { UserService } from '../service/userService';
import { Container, Service } from 'typedi';

@Service()
export class UserController {
  private readonly router: Router;
  private userService: UserService;

  constructor() {
    this.router = Router();
    this.userService =  Container.get(UserService);
  }

  init() {
    // Create/Register new User
    this.router.post('/register', async ({ body }, res) => {
      res.send(await this.userService.createUser(body));
    });

    // Login user
    this.router.post('/login', async ({ body }, res) => {
      res.send(await this.userService.login(body.email, body.password));
    });

    // Get Users
    this.router.get('/', setCache('30 seconds'), async (_req, res) => {
      res.send(await this.userService.getUsers());
    });

    // Get User by Id
    this.router.get('/:id', setCache('30 seconds'), async ({ params }, res) => {
      res.send(
        await this.userService
          .getUserById(parseInt(params.id))
      );
    });

    // Update User
    this.router.patch('/:id', async ({ body, params }, res) => {
      res.send(await this.userService.updateUser(parseInt(params.id), body));
    });

    // Delete User from DB
    this.router.delete('/:id', async ({ params }, res) => {
      res.send(await this.userService.deleteUser(parseInt(params.id)));
    });

    return this.router;
  }
}
