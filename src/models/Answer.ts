import mongoose from 'mongoose';

const answerSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
    answers: [{
        questionId: { type: mongoose.Schema.Types.ObjectId, required: true },
        selectedOptions: [{ type: Number, required: true }]
    }],
    submittedAt: { type: Date, default: Date.now },
});

const Answer = mongoose.model('Answer', answerSchema);
export default Answer;