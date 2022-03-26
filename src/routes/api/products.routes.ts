import {Router} from 'express';
import * as controllers from '../../controllers/products.controllers'
import { AuthenticatedUser } from '../../middleware/authenticate';
import { ProductRequestValidator } from '../../validator/product.request.validator';

const routes = Router();
const validator = new  ProductRequestValidator();


routes.route('/').get(controllers.getAll);
routes.route('/:id').get(controllers.getOne);
routes.route('/create').post(AuthenticatedUser, validator.validateCreate ,controllers.create);


export default routes;