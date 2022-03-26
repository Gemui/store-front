import {Router} from 'express';
import * as controllers from '../../controllers/categories.controllers'
import { AuthenticatedUser } from '../../middleware/authenticate';
import { CategoryRequestValidator } from '../../validator/category.request.validator';

const routes = Router();
const validator = new  CategoryRequestValidator();


routes.route('/').get(controllers.getAll);
routes.route('/create').post(AuthenticatedUser, validator.validateCreate ,controllers.create);


export default routes;