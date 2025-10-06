"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./db"));
require("./models/User");
require("./models/Quiz");
require("./models/Question");
require("./models/Answer");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const quizRoutes_1 = __importDefault(require("./routes/quizRoutes"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = __importDefault(require("./swagger"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use("/api-docs/", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.default));
app.use('/api/auth', authRoutes_1.default);
app.use('/api/quizzes', quizRoutes_1.default);
console.log(process.env.MONGO_URI);
(0, db_1.default)();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Sunucu http://localhost:${PORT}/api/ adresinde çalışıyor.`);
});
