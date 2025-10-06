import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import User from '../models/User';
import { protect } from '../middlewares/auth';

const router = Router();

/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Yeni kullanıcı kaydı
 *     description: E-posta ve şifre ile yeni bir kullanıcı kaydı oluşturur. Aynı email tekrar kullanılamaz.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: test@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "123456"
 *     responses:
 *       201:
 *         description: Kullanıcı başarıyla oluşturuldu, JWT token döner
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Email zaten kayıtlı
 *       500:
 *         description: Sunucu hatası
 */
router.post('/register', async (req: Request, res: Response) => {
    console.log("run register");
    const { email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Bu email zaten kullanılıyor.' });
        }
        const user = new User({ email, password });
        await user.save();
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, { expiresIn: '1d' });
        res.status(201).json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Kayıt işlemi başarısız.', error });
    }
});

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: post login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Returns a token
 */
router.post('/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Geçersiz email veya şifre.' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Geçersiz email veya şifre.' });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, { expiresIn: '1d' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Giriş işlemi başarısız.', error });
    }
});

/**
 * @openapi
 * /profile:
 *   get:
 *     summary: Get user profile
 *     responses:
 *       200:
 *         description: Returns a user object
 */
router.get('/profile', protect, async (req: Request, res: Response) => {
    try {
        const user = await User.findById((req as any).user).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Profil bilgisi alınamadı.', error });
    }
});

export default router;