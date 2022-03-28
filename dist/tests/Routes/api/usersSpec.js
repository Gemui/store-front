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
const user_model_1 = require("../../../models/user.model");
const server_1 = __importDefault(require("../../../server"));
const userModel = new user_model_1.UserStore();
const request = (0, supertest_1.default)(server_1.default);
let userToken = '';
describe('User End Point', () => {
    const user = {
        username: 'username',
        password: 'userpassword',
        firstName: 'first',
        lastName: 'second'
    };
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        const createdUser = yield userModel.create(user);
        user.id = createdUser.id;
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        // clean db
        const connection = yield database_1.default.connect();
        yield connection.query('DELETE FROM users');
        connection.release();
    }));
    describe('test auth cycle', () => {
        it('should able to login and get token', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield request.post('/api/users/login').set('Content-type', 'application/json').send({
                username: user.username,
                password: user.password,
            });
            userToken = result.body.token;
            expect(result.status).toBe(200);
            expect(result.body.status).toEqual('success');
            expect(result.body.user.username).toBe(user.username);
        }));
        it('try to login without send required data should return failed with 422 with error message', (done) => {
            request.post('/api/users/login').set('Content-type', 'application/json').send({
                username: 'wrong-username-should-not-exists',
            }).expect(422).then(response => {
                expect(response.body.errors[0].param).toEqual('password');
                expect(response.body.errors[0].msg).toEqual('Invalid password should be 6 character or more');
                done();
            }).catch(error => console.log(error));
        });
        it('try access to wrong details should fail to login and return failed with 401', (done) => {
            request.post('/api/users/login').set('Content-type', 'application/json').send({
                username: 'wrong-username-should-not-exists',
                password: 'wrong-password'
            }).expect(401).then(response => {
                expect(response.body.status).toEqual('failed');
                done();
            }).catch(error => console.log(error));
        });
    });
    describe('Test Crud routes', () => {
        it('Test create many users', () => __awaiter(void 0, void 0, void 0, function* () {
            for (let i = 1; i < 5; i++) {
                const result = yield request
                    .post('/api/users/register')
                    .set('Content-type', 'application/json')
                    .set('Authorization', `Bearer ${userToken}`).send({
                    username: `${user.username}${i}`,
                    password: user.password,
                    firstName: user.firstName,
                    lastName: user.lastName,
                });
                expect(result.status).toBe(200);
                expect(result.body.status).toEqual('success');
            }
        }));
        it('should list all users with count 5', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield request
                .get('/api/users')
                .set('Content-type', 'application/json')
                .set('Authorization', `Bearer ${userToken}`);
            const userData = result.body.data;
            expect(result.status).toBe(200);
            expect(result.body.status).toEqual('success');
            expect(userData.length).toEqual(5);
        }));
    });
});
