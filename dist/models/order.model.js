"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderStore = void 0;
const database_1 = __importDefault(require("../database"));
const orderStatus_enum_1 = __importDefault(require("../enums/orderStatus.enum"));
const model_1 = require("./model");
const product_model_1 = require("./product.model");
const productStore = new product_model_1.ProductStore();
class OrderStore extends model_1.Model {
    constructor() {
        super(...arguments);
        this.tableName = 'orders';
    }
    create(order, orderProducts) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield database_1.default.connect();
                const orderQuery = yield database_1.default.query(`insert into ${this.tableName}
             (user_id) values ( ($1) ) returning *`, [order.user_id]);
                const orderData = orderQuery.rows[0];
                const createdProducts = [];
                for (var i = 0; i < orderProducts.length; i++) {
                    let orderProduct = orderProducts[i];
                    const databaseProduct = yield productStore.getByColumn('id', orderProduct.product_id);
                    let insertedProduct = (yield database_1.default.
                        query('insert into order_products (order_id, product_id, product_quantity, product_price) values ( ($1), ($2), ($3), ($4) ) returning *', [orderData.id, orderProduct.product_id, orderProduct.product_quantity, databaseProduct.price])).rows[0];
                    createdProducts.push(insertedProduct);
                }
                conn.release();
                orderData['orderProducts'] = createdProducts;
                return orderData;
            }
            catch (e) {
                throw new Error(`unable to create order with error : ${e.message}`);
            }
        });
    }
    ;
    completeOrder(orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield database_1.default.connect();
                yield database_1.default.query(`update ${this.tableName} set status =  ($1) where id = ($2)`, [orderStatus_enum_1.default.completed, orderId]);
                conn.release();
            }
            catch (e) {
                throw new Error(`unable to complete order with error : ${e.message}`);
            }
        });
    }
    ;
    getUserOrders(user_id, status = null) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield database_1.default.connect();
                const queryData = [user_id];
                let clientQuery = `select * from orders where user_id = ($1)`;
                if (status) {
                    clientQuery += 'and status = ($2)';
                    queryData.push(status);
                }
                const userOrders = yield database_1.default.query(clientQuery, queryData);
                conn.release();
                return userOrders.rows;
            }
            catch (e) {
                throw new Error(`unable to getUserOrders with error : ${e.message}`);
            }
        });
    }
    ;
    getOrderDetails(order_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield database_1.default.connect();
                const order = yield this.getByColumn('id', order_id);
                order.orderProducts = (yield conn.query('select * from order_products where order_id = ($1)', [order.id])).rows;
                conn.release();
                return order;
            }
            catch (e) {
                throw new Error(`unable to getOrderDetails with error : ${e.message}`);
            }
        });
    }
    ;
}
exports.OrderStore = OrderStore;
