import {Router} from 'express';
import * as controllers from '../../controllers/users.controllers'
import { AuthenticatedUser } from '../../middleware/authenticate';
import { UserRequestValidator } from '../../validator/user.request.validator';

const routes = Router();
const validator = new UserRequestValidator()
routes.route('/').get(AuthenticatedUser, controllers.getAll)

routes.route('/:id').get(AuthenticatedUser, validator.validateUserId, controllers.getOne)
routes.route('/register').post(validator.validateRegister, controllers.register)
routes.route('/login').post(validator.validateLogin, controllers.login)


export default routes;
