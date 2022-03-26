"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.AuthenticatedUser = void 0;
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function AuthenticatedUser(req, res, next) {
    try {
        var authorizationHeader = req.headers.authorization;
        if (authorizationHeader) {
            var token = authorizationHeader.split(' ')[1];
            jsonwebtoken_1["default"].verify(token, process.env.SECRET_TOKEN);
            next();
            return;
        }
        res.json({ 'success': false, 'message': 'unauthenticated' }).status(401);
    }
    catch (e) {
        res.json({ 'success': false, 'message': 'unauthenticated' }).status(401);
    }
}
exports.AuthenticatedUser = AuthenticatedUser;
