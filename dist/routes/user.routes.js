"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users = __importStar(require("../controllers/user.controller"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const routes = (0, express_1.Router)();
routes.get('/', users.getAll);
routes.get('/:id', users.getUser);
routes.get('/search', users.search);
routes.get('/:id/followers', users.getFollowers);
routes.get('/:id/following', users.getFollowing);
routes.get('/followers', auth_middleware_1.verifyToken, users.getOwnFollowers);
routes.get('/following', auth_middleware_1.verifyToken, users.getOwnFollowing);
routes.get('/groups', auth_middleware_1.verifyToken, users.getOwnGroups);
routes.get('/feed', auth_middleware_1.verifyToken, users.getFeed);
routes.post('/', users.create);
routes.post('/:id/follow', auth_middleware_1.verifyToken, users.follow);
routes.post('/:id/unfollow', auth_middleware_1.verifyToken, users.unfollow);
routes.put('/', auth_middleware_1.verifyToken, users.update);
// routes.get('/email-confirmation/:token', users.emailConfirmation);
// routes.post('/forgot-password', users.forgotPassword);
// routes.patch('/reset-password/:token', users.resetPassword);
exports.default = routes;
//# sourceMappingURL=user.routes.js.map