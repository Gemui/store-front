"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorMiddleware = (error, _, res
// next: NextFunction
) => {
    const status = error.status || 500;
    const message = error.message || 'Whoops!! something went wrong';
    res.status(status).json({ status, message });
};
exports.default = errorMiddleware;
