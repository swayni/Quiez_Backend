"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const QuestionSchema = new mongoose_1.default.Schema({
    text: { type: String, required: true },
    answerOptions: [{ id: Number, text: String }],
    numSelections: Number,
    isSkippingAllowed: Boolean
});
const Question = mongoose_1.default.model('Question', QuestionSchema);
exports.default = Question;
