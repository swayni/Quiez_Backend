import mongoose from 'mongoose';

const QuizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }]
});

const Quiz = mongoose.model('Quiz', QuizSchema);
export default Quiz;
