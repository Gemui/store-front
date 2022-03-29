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
const supertest_1 = __importDefault(require("supertest"));
const database_1 = __importDefault(require("../../../database"));
const orderStatus_enum_1 = __importDefault(require("../../../enums/orderStatus.enum"));
const category_model_1 = require("../../../models/category.model");
const order_model_1 = require("../../../models/order.model");
const product_model_1 = require("../../../models/product.model");
const user_model_1 = require("../../../models/user.model");
const server_1 = __importDefault(require("../../../server"));
const userModel = new user_model_1.UserStore();
const categoryStore = new category_model_1.CategoryStore();
const productStore = new product_model_1.ProductStore();
const orderStore = new order_model_1.OrderStore();
const request = (0, supertest_1.default)(server_1.default);
let userToken = '';
describe('Orders Routes', () => {
    const user = {
        username: 'username',
        password: 'userpassword',
        firstName: 'first',
        lastName: 'second'
    };
    const product = {
        name: 'product-0',
        price: 15,
    };
    const order = {
        user_id: user.id,
        status: orderStatus_enum_1.default.active,
    };
    let categoryData;
    let productsData = [];
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        const createdUser = yield userModel.create(user);
        user.id = createdUser.id;
        const result = yield request.post('/api/users/login').set('Content-type', 'application/json').send({
            username: user.username,
            password: user.password,
        });
        userToken = result.body.token;
        categoryData = (yield categoryStore.create({ 'name': 'category-1' }));
        if (categoryData.id) {
            product.category_id = categoryData.id;
        }
        productsData.push(yield productStore.create(product));
        product.name = 'product-10';
        productsData.push(yield productStore.create(product));
        order.user_id = user.id;
        const orderResult = yield orderStore.create(order, [{
                product_id: productsData[0].id,
                product_price: 10,
                product_quantity: 5
            }]);
        order.id = orderResult.id;
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        // clean db
        const connection = yield database_1.default.connect();
        yield connection.query('DELETE FROM users');
        yield connection.query('DELETE FROM categories');
        yield connection.query('DELETE FROM products');
        yield connection.query('DELETE FROM order_products');
        connection.release();
    }));
    describe('Test Crud routes', () => {
        it('Test get user orders with wrong user_id 422 with error ', () => __awaiter(void 0, void 0, void 0, function* () {
            for (let i = 1; i <= 5; i++) {
                const result = yield request
                    .get('/api/orders/500000000')
                    .set('Content-type', 'application/json')
                    .set('Authorization', `Bearer ${userToken}`);
                expect(result.status).toBe(422);
                expect(result.body.errors[0].param).toEqual('user_id');
                expect(result.body.errors[0].msg).toEqual('user_id 500000000 not valid');
            }
        }));
        it('Test get user orders should return all orders of user with status 200', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield request
                .get(`/api/orders/${user.id}`)
                .set('Content-type', 'application/json')
                .set('Authorization', `Bearer ${userToken}`);
            expect(result.status).toBe(200);
            expect(result.body.status).toEqual('success');
            expect(result.body.data[0].id).toEqual(order.id);
            expect(result.body.data[0].status).toEqual(order.status);
            expect(result.body.data[0].user_id).toEqual(user.id);
        }));
        it('Test create many orders should return 200 with order_details every create', () => __awaiter(void 0, void 0, void 0, function* () {
            productsData = productsData.map((value) => {
                return Object.assign(Object.assign({}, value), { product_quantity: '2', product_id: value.id });
            });
            const result = yield request
                .post('/api/orders/create')
                .set('Content-type', 'application/json')
                .set('Authorization', `Bearer ${userToken}`).send({
                user_id: user.id,
                products: productsData
            });
            expect(result.status).toBe(200);
            expect(result.body.data.status).toEqual(orderStatus_enum_1.default.active);
            expect(result.body.data.user_id).toEqual(user.id);
            expect(result.body.data.orderProducts.length).toEqual(productsData.length);
        }));
        it('should get order details and order products with status 200', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield request
                .get(`/api/orders/${order.id}/details`)
                .set('Content-type', 'application/json')
                .set('Authorization', `Bearer ${userToken}`);
            const orderData = result.body.data;
            expect(result.status).toBe(200);
            expect(result.body.status).toEqual('success');
            expect(orderData.user_id).toEqual(user.id);
            expect(orderData.orderProducts[0].order_id).toEqual(order.id);
        }));
        it('Test complete order should return updated and update database', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield request
                .post(`/api/orders/${order.id}/complete`)
                .set('Content-type', 'application/json')
                .set('Authorization', `Bearer ${userToken}`);
            expect(result.status).toBe(200);
            expect(result.body.status).toEqual('success');
            const createdOrder = yield orderStore.getByColumn('id', Number(order.id));
            expect(createdOrder.user_id).toEqual(Number(user.id));
            expect(createdOrder.status).toEqual(orderStatus_enum_1.default.completed);
            if (createdOrder.orderProducts) {
                expect(createdOrder.orderProducts[0].order_id).toEqual(Number(order.id));
            }
        }));
    });
});
