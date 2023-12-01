"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const app_1 = __importDefault(require("./app"));
const PORT = process.env.PORT || 3333;
app_1.default.listen(PORT, () => {
    console.log(`[SERVER]: API Server is running at https://localhost:${PORT}/api\n[SERVER]: WebSocket Server is running at ws://localhost:${PORT}/ws`);
});
//# sourceMappingURL=server.js.map