"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const answerSchema = new mongoose_1.default.Schema({
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    quizId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Quiz', required: true },
    answers: [{
            questionId: { type: mongoose_1.default.Schema.Types.ObjectId, required: true },
            selectedOptions: [{ type: Number, required: true }]
        }],
    submittedAt: { type: Date, default: Date.now },
});
const Answer_1 = mongoose_1.default.model('Answer', answerSchema);
exports.default = Answer_1;
