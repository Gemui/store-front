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
const category_model_1 = require("../../../models/category.model");
const product_model_1 = require("../../../models/product.model");
const user_model_1 = require("../../../models/user.model");
const server_1 = __importDefault(require("../../../server"));
const userModel = new user_model_1.UserStore();
const categoryStore = new category_model_1.CategoryStore();
const productStore = new product_model_1.ProductStore();
const request = (0, supertest_1.default)(server_1.default);
let userToken = '';
describe('Products End Point', () => {
    const user = {
        username: 'username',
        password: 'userpassword',
        firstName: 'first',
        lastName: 'second'
    };
    let categoryData;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        const createdUser = yield userModel.create(user);
        user.id = createdUser.id;
        const result = yield request.post('/api/users/login').set('Content-type', 'application/json').send({
            username: user.username,
            password: user.password,
        });
        userToken = result.body.token;
        categoryData = (yield categoryStore.create({ 'name': 'category-1' }));
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        // clean db
        const connection = yield database_1.default.connect();
        yield connection.query('DELETE FROM users');
        yield connection.query('DELETE FROM categories');
        yield connection.query('DELETE FROM products');
        connection.release();
    }));
    describe('Test Crud routes', () => {
        it('Test create with missing required data should return 422 with error ', () => __awaiter(void 0, void 0, void 0, function* () {
            for (let i = 1; i <= 5; i++) {
                const result = yield request
                    .post('/api/products/create')
                    .set('Content-type', 'application/json')
                    .set('Authorization', `Bearer ${userToken}`);
                expect(result.status).toBe(422);
                expect(result.body.errors[0].param).toEqual('name');
                expect(result.body.errors[0].msg).toEqual('name should be exists and not empty');
            }
        }));
        it('Test get product details should return excat product data with status 200', () => __awaiter(void 0, void 0, void 0, function* () {
            const createdProduct = yield productStore.create({
                name: 'product-0',
                category_id: categoryData.id,
                price: 15,
            });
            const result = yield request
                .get(`/api/products/${createdProduct.id}`)
                .set('Content-type', 'application/json')
                .set('Authorization', `Bearer ${userToken}`);
            expect(result.status).toBe(200);
            expect(result.body.status).toEqual('success');
            expect(result.body.data.category_id).toEqual(categoryData.id);
            expect(result.body.data.price).toEqual(15);
            expect(result.body.data.name).toEqual('product-0');
        }));
        it('Test get product details with wrong product_id', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield request
                .get(`/api/products/500000000`)
                .set('Content-type', 'application/json')
                .set('Authorization', `Bearer ${userToken}`);
            expect(result.status).toBe(403);
            expect(result.body.status).toEqual('failed');
        }));
        it('Test create many products should return 200 with category every create', () => __awaiter(void 0, void 0, void 0, function* () {
            for (let i = 1; i <= 5; i++) {
                let productName = `product-${i}`;
                let randomPrice = (i + 1) * 2;
                const result = yield request
                    .post('/api/products/create')
                    .set('Content-type', 'application/json')
                    .set('Authorization', `Bearer ${userToken}`).send({
                    name: productName,
                    category_id: categoryData.id,
                    price: randomPrice,
                });
                expect(result.status).toBe(200);
                expect(result.body.status).toEqual('success');
                expect(result.body.data.category_id).toEqual(categoryData.id);
                expect(result.body.data.price).toEqual(randomPrice);
                expect(result.body.data.name).toEqual(productName);
            }
        }));
        it('should list all products with count 6', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield request
                .get('/api/products')
                .set('Content-type', 'application/json')
                .set('Authorization', `Bearer ${userToken}`);
            const productData = result.body.data;
            expect(result.status).toBe(200);
            expect(result.body.status).toEqual('success');
            expect(productData.length).toEqual(6);
        }));
    });
});
