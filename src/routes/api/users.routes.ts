import {Router} from 'express';
import * as controllers from '../../controllers/users.controllers'
import { AuthenticatedUser } from '../../middleware/authenticate';
import { UserRequestValidator } from '../../validator/user.request.validator';

const routes = Router();
const validator = new UserRequestValidator()

routes.route('/').get(AuthenticatedUser, controllers.getAll)
routes.route('/register').post(AuthenticatedUser, validator.validateRegister, controllers.register)
routes.route('/login').post(AuthenticatedUser , validator.validateLogin, controllers.login)

export default routes;
