"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Quiz_1 = __importDefault(require("../models/Quiz"));
const Answer_1 = __importDefault(require("../models/Answer"));
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
// The list of all quizzes
router.get('/', async (req, res) => {
    try {
        const quizzes = await Quiz_1.default.find().select('title description');
        res.json(quizzes);
    }
    catch (error) {
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
        const quiz = await Quiz_1.default.findById(req.params.id).populate("questions");
        if (!quiz) {
            return res.status(404).json({ message: "Anket bulunamadı." });
        }
        res.json(quiz.questions);
    }
    catch (error) {
        console.error("Anket soruları yüklenirken hata:", error);
        res.status(500).json({
            message: "Sorular yüklenirken bir hata oluştu.",
            error: error instanceof Error ? error.message : 'Bilinmeyen bir hata oluştu',
        });
    }
});
// User's answer send and save
router.post('/:id/submit', auth_1.protect, async (req, res) => {
    const { answers } = req.body;
    const userId = req.user;
    const quizId = req.params.id;
    try {
        const existingAnswer = await Answer_1.default.findOne({ userId, quizId });
        if (existingAnswer) {
            return res.status(400).json({ message: 'Bu anket zaten daha önce gönderildi.' });
        }
        const newAnswer = new Answer_1.default({ userId, quizId, answers });
        await newAnswer.save();
        res.status(201).json({ message: 'Cevaplarınız başarıyla kaydedildi.' });
    }
    catch (error) {
        res.status(500).json({ message: 'Cevaplar kaydedilirken bir hata oluştu.', error });
    }
});
exports.default = router;
