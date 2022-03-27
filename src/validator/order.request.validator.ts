import { body, check, checkSchema, param } from "express-validator";
import OrderStatus from "../enums/orderStatus.enum";
import { OrderStore } from "../models/order.model";
import { ProductStore } from "../models/product.model";
import { UserStore } from "../models/user.model";


const productStore = new ProductStore();
const userStore = new UserStore();
const orderStore = new OrderStore();

export class OrderRequestValidator {

    public validateCreate = [
        body('user_id', 'user_id should exists and valid').exists().bail().notEmpty().bail().custom( async (value) => {
            const isUserExists = await userStore.getByColumn('id',value);
            if(!isUserExists) {
                return Promise.reject(`user_id ${value} not valid`)
            }
        } ),
        body('products', 'products should be an array').isArray(),
        check('products.*.product_id', 'product_id should be int and exists').isInt().bail().custom( async (value) => {
            const isProductExists = await productStore.getByColumn('id',value);
            if(!isProductExists) {
                return Promise.reject(`product_id ${value} not valid`)
            }
        } ),
        check('products.*.product_quantity', 'product_quantity greater than 0 and less than 10000')
        .exists()
        .bail().isNumeric()
        .bail().custom( (value) => value > 0 && value < 10000 ),
    ];
    

    public validateOrderParam = [
        param('id').exists().bail().notEmpty().bail().custom( async (value) => {
            const isOrderExists = await orderStore.getByColumn('id',value);
            if(!isOrderExists) {
                return Promise.reject(`order_id ${value} not valid`)
            }
        } ),
    ]
    
    public validateUserOrders = [
        param('user_id').exists().bail().notEmpty().bail().custom( async (value) => {
            const isUserExists = await userStore.getByColumn('id',value);
            if(!isUserExists) {
                return Promise.reject(`user_id ${value} not valid`)
            }
        } ),
        check('order_status')
        .custom((value) => {
            if(value && !Object.values(OrderStatus).includes(value)) {

                return false;
            }
            return true;
        })
    ]

}