"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.UserStore = void 0;
var database_1 = __importDefault(require("../database"));
var bcrypt_1 = __importDefault(require("bcrypt"));
var model_1 = require("./model");
var UserStore = /** @class */ (function (_super) {
    __extends(UserStore, _super);
    function UserStore() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.tableName = 'users';
        return _this;
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
    UserStore.prototype.authenticate = function (username, password) {
        return __awaiter(this, void 0, void 0, function () {
            var conn, userQuery, result, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, database_1["default"].connect()];
                    case 1:
                        conn = _a.sent();
                        return [4 /*yield*/, database_1["default"].query('select * from users where username = ($1)', [username])];
                    case 2:
                        userQuery = _a.sent();
                        conn.release();
                        if (userQuery.rows.length) {
                            result = userQuery.rows[0];
                            if (bcrypt_1["default"].compareSync(password + process.env.BCRYPT_PASSWORD, result.password)) {
                                return [2 /*return*/, result];
                            }
                            return [2 /*return*/, null];
                        }
                        return [2 /*return*/, null];
                    case 3:
                        e_1 = _a.sent();
                        console.log("failed to login user with error ".concat(e_1));
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ;
    UserStore.prototype.create = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            var conn, hash, userQuery, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, database_1["default"].connect()];
                    case 1:
                        conn = _a.sent();
                        hash = bcrypt_1["default"].hashSync(user.password + process.env.BCRYPT_PASSWORD, Number(process.env.SALT_ROUNDS));
                        return [4 /*yield*/, database_1["default"].query('insert into users (username, password, firstName, lastName) values ( ($1) ,($2), ($3), ($4) ) returning *', [user.username, hash, user.firstName, user.lastName])];
                    case 2:
                        userQuery = _a.sent();
                        conn.release();
                        return [2 /*return*/, userQuery.rows[0]];
                    case 3:
                        e_2 = _a.sent();
                        throw new Error("Unable to create (".concat(user.username, "): ").concat(e_2.message));
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ;
    return UserStore;
}(model_1.Model));
exports.UserStore = UserStore;
