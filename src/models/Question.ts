import mongoose from 'mongoose';

const QuestionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  answerOptions: [{ id: Number, text: String }],
  numSelections: Number,
  isSkippingAllowed: Boolean
});

const Question = mongoose.model('Question', QuestionSchema);
export default Question;
