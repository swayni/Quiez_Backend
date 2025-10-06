"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const QuizSchema = new mongoose_1.default.Schema({
    title: { type: String, required: true },
    description: String,
    questions: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Question' }]
});
const Quiz = mongoose_1.default.model('Quiz', QuizSchema);
exports.default = Quiz;
