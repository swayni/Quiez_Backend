import { Router, Request, Response } from 'express';
import Quiz from '../models/Quiz'; 
import Question from '../models/Question';
import Answer from '../models/Answer';
import { protect } from '../middlewares/auth';
import mongoose from 'mongoose'; 

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
/**
 * @openapi
 * /quiz/{id}/questions:
 *   get:
 *     summary: Belirli bir quiz'in sorularını getir
 *     description: Verilen quiz ID'sine ait tüm soru ObjectId listesini döner. Eğer populate eklersen tam Question dokümanlarını da döndürebilirsin.
 *     tags:
 *       - Quiz
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Quiz ID'si (MongoDB ObjectId)
 *     responses:
 *       200:
 *         description: Quiz soruları başarıyla getirildi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *                 description: Question ObjectId
 *             example: [
 *               "650b3e8f9d1a6f23b89f5a01",
 *               "650b3e8f9d1a6f23b89f5a02"
 *             ]
 *       404:
 *         description: Belirtilen ID'ye ait quiz bulunamadı
 *         content:
 *           application/json:
 *             example:
 *               message: "Anket bulunamadı."
 *       500:
 *         description: Sunucu hatası
 *         content:
 *           application/json:
 *             example:
 *               message: "Sorular yüklenirken bir hata oluştu."
 *               error: "Hata detayı"
 */
router.get("/:id/questions", async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate("questions");

    if (!quiz) {
      return res.status(404).json({ message: "Anket bulunamadı." });
    }

    res.json(quiz.questions); 
  } catch (error) {
    console.error("Anket soruları yüklenirken hata:", error);
    res.status(500).json({
      message: "Sorular yüklenirken bir hata oluştu.",
      error: error instanceof Error ? error.message : 'Bilinmeyen bir hata oluştu',
    });
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