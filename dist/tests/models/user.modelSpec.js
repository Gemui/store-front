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
const database_1 = __importDefault(require("../../database"));
const user_model_1 = require("../../models/user.model");
const server_1 = __importDefault(require("../../server"));
const userModel = new user_model_1.UserStore();
const request = (0, supertest_1.default)(server_1.default);
describe('Test User Model', () => {
    const user = {
        username: 'username',
        password: 'userpassword',
        firstname: 'first',
        lastname: 'second'
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
    describe('Test Methods exists', () => {
        it('should have method authenticate in user class', () => {
            expect(userModel.authenticate).toBeDefined();
        });
        it('should have method create in user class', () => {
            expect(userModel.create).toBeDefined();
        });
    });
    describe('Test Model methods logic', () => {
        it('should create user data and return all user info', () => __awaiter(void 0, void 0, void 0, function* () {
            const isCreatedUser = yield userModel.create({
                username: 'newusername',
                password: 'userpassword',
                firstname: 'first',
                lastname: 'second'
            });
            expect(isCreatedUser.username).toEqual('newusername');
            expect(isCreatedUser.firstname).toEqual('first');
            expect(isCreatedUser.lastname).toEqual('second');
        }));
        it('should authenticate user data and return all user info', () => __awaiter(void 0, void 0, void 0, function* () {
            const isUserAutencticated = yield userModel.authenticate(user.username, user.password);
            expect(isUserAutencticated.id).toEqual(user.id);
            expect(isUserAutencticated.username).toEqual(user.username);
            expect(isUserAutencticated.firstname).toEqual(user.firstname);
            expect(isUserAutencticated.lastname).toEqual(user.lastname);
        }));
    });
});
