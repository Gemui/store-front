import {Router} from 'express';
import * as controllers from '../../controllers/orders.controllers'
import { AuthenticatedUser } from '../../middleware/authenticate';
import { OrderRequestValidator } from '../../validator/order.request.validator';

const routes = Router();
const validator = new  OrderRequestValidator();


// routes.route('/').get(controllers.getAll);
routes.route('/:user_id').get(AuthenticatedUser, controllers.getOrderByUser);
routes.route('/create').post(AuthenticatedUser, validator.validateCreate ,controllers.create);
routes.route('/:id/complete').post(AuthenticatedUser, validator.validateComplete ,controllers.completeOrder);


export default routes;