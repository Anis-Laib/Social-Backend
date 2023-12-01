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
const posts = __importStar(require("../controllers/post.controller"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const routes = (0, express_1.Router)();
routes.get('/:id', posts.getById);
routes.post('/', auth_middleware_1.verifyToken, posts.create);
routes.post('/:id/like', auth_middleware_1.verifyToken, posts.like);
routes.post('/:id/unlike', auth_middleware_1.verifyToken, posts.unlike);
routes.delete('/:id', auth_middleware_1.verifyToken, posts.remove);
exports.default = routes;
//# sourceMappingURL=post.routes.js.map