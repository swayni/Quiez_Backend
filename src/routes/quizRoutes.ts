import { Router, Request, Response } from 'express';
import Quiz from '../models/Quiz';
import Question from '../models/Question';
import Answer from '../models/Answer';
import { protect } from '../middlewares/auth';

const router = Router();

// The list of all quizzes
router.get('/', async (req: Request, res: Response) => {
    try {
        const quizzes = await Quiz.find().select('title description');
        res.json(quizzes);
    } catch (error) {
        res.status(500).json({ message: 'Anketler yüklenirken bir hata oluştu.', error });
    }
});

// The questions of a specific quiz
router.get('/:id/questions', async (req: Request, res: Response) => {
    try {
        const quiz = await Quiz.findById(req.params.id).populate('questions');
        if (!quiz) {
            return res.status(404).json({ message: 'Anket bulunamadı.' });
        }
        res.json(quiz.questions);
    } catch (error) {
        res.status(500).json({ message: 'Sorular yüklenirken bir hata oluştu.', error });
    }
});

// User's answer send and save
router.post('/:id/submit', protect, async (req: Request, res: Response) => {
    const { answers } = req.body;
    const userId = (req as any).user;
    const quizId = req.params.id;
    try {
        const existingAnswer = await Answer.findOne({ userId, quizId });
        if (existingAnswer) {
            return res.status(400).json({ message: 'Bu anket zaten daha önce gönderildi.' });
        }
        const newAnswer = new Answer({ userId, quizId, answers });
        await newAnswer.save();
        res.status(201).json({ message: 'Cevaplarınız başarıyla kaydedildi.' });
    } catch (error) {
        res.status(500).json({ message: 'Cevaplar kaydedilirken bir hata oluştu.', error });
    }
});

export default router;