import mongoose from 'mongoose';
import Question from './Question';

const quizSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    questions: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Question' }
    ],
});

const Quiz = mongoose.model('Quiz', quizSchema);
export default Quiz;