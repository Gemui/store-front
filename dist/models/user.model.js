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
exports.UserStore = void 0;
const database_1 = __importDefault(require("../database"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const model_1 = require("./model");
class UserStore extends model_1.Model {
    constructor() {
        super(...arguments);
        this.tableName = 'users';
        // async getByColumn(column : String, value : String, operator = '='): Promise<User|null|undefined> {
        //     try {
        //         const conn = await Client.connect();
        //         const userQuery = await Client.query(`select * from  users where ${column} ${operator} ($1)`,[value]);
        //         conn.release();
        //         if(userQuery.rows.length) {
        //             return  userQuery.rows[0] as unknown as  User;
        //         }
        //         return null;
        //     } catch(e) {
        //         console.log(`unable to create user with error ${e}`)
        //     }
        // };
    }
    authenticate(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield database_1.default.connect();
                const userQuery = yield database_1.default.query('select * from users where username = ($1)', [username]);
                conn.release();
                if (userQuery.rows.length) {
                    const result = userQuery.rows[0];
                    if (bcrypt_1.default.compareSync(password + process.env.BCRYPT_PASSWORD, result.password)) {
                        return result;
                    }
                    return null;
                }
                return null;
            }
            catch (e) {
                console.log(`failed to login user with error ${e}`);
            }
        });
    }
    ;
    create(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield database_1.default.connect();
                const hash = bcrypt_1.default.hashSync(user.password + process.env.BCRYPT_PASSWORD, Number(process.env.SALT_ROUNDS));
                const userQuery = yield database_1.default.query('insert into users (username, password, firstName, lastName) values ( ($1) ,($2), ($3), ($4) ) returning *', [user.username, hash, user.firstName, user.lastName]);
                conn.release();
                return userQuery.rows[0];
            }
            catch (e) {
                throw new Error(`Unable to create (${user.username}): ${e.message}`);
            }
        });
    }
    ;
}
exports.UserStore = UserStore;
