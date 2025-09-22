import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
    text: { type: String, required: true },
    answerOptions: [{
        text: { type: String, required: true },
        id: { type: Number, required: true }
    }],
    isSkippingAllowed: { type: Boolean, default: false },
    numSelections: { type: Number, default: 1 }
});

const Question = mongoose.model('Question', questionSchema);
export default Question;