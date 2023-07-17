"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRefreshToken = exports.createAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv/config");
const createAccessToken = (user) => {
    return jsonwebtoken_1.default.sign({ userId: user.id, username: user.username }, `${process.env.ACCESS_TOKEN_SECRET}`, {
        expiresIn: "15m",
    });
};
exports.createAccessToken = createAccessToken;
const createRefreshToken = (user) => {
    return jsonwebtoken_1.default.sign({ userId: user.id, username: user.username }, `${process.env.REFRESH_TOKEN_SECRET}`, {
        expiresIn: "4d",
    });
};
exports.createRefreshToken = createRefreshToken;
