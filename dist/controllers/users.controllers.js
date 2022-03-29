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
exports.register = exports.login = exports.getAll = exports.getOne = void 0;
const express_validator_1 = require("express-validator");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = require("../models/user.model");
const userStore = new user_model_1.UserStore();
const getOne = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        const userData = yield userStore.getByColumn('id', req.params.id);
        res.json({
            status: 'success',
            data: userData,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.getOne = getOne;
const getAll = (_, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userData = yield userStore.getAll();
        res.json({
            status: 'success',
            data: userData || [],
        });
    }
    catch (err) {
        next(err);
    }
});
exports.getAll = getAll;
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        const data = yield userStore.authenticate(req.body.username, req.body.password);
        if (!data) {
            return res
                .status(401)
                .json({ status: 'failed', message: 'invalid user data' });
        }
        try {
            const token = jsonwebtoken_1.default.sign({ user: data }, process.env.SECRET_TOKEN);
            res.json({ status: 'success', user: data, token: token });
        }
        catch (e) {
            res.status(401).json({ status: 'failed', message: 'invalid data' });
        }
    }
    catch (err) {
        next(err);
    }
});
exports.login = login;
const register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        const userData = {
            username: req.body.username,
            password: req.body.password,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
        };
        const userExists = (yield userStore.getByColumn('username', userData.username));
        if (userExists != null) {
            res.json({ status: 'failed', message: 'username exists' }).status(422);
            return;
        }
        const data = yield userStore.create(userData);
        res.json({ status: 'success', user: data });
    }
    catch (err) {
        next(err);
    }
});
exports.register = register;
