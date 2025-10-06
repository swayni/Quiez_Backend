"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt = __importStar(require("bcryptjs"));
const User_1 = __importDefault(require("../models/User"));
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
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
router.post('/register', async (req, res) => {
    console.log("run register");
    const { email, password } = req.body;
    try {
        const existingUser = await User_1.default.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Bu email zaten kullanılıyor.' });
        }
        const user = new User_1.default({ email, password });
        await user.save();
        const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.status(201).json({ token });
    }
    catch (error) {
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
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User_1.default.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Geçersiz email veya şifre.' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Geçersiz email veya şifre.' });
        }
        const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ token });
    }
    catch (error) {
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
router.get('/profile', auth_1.protect, async (req, res) => {
    try {
        const user = await User_1.default.findById(req.user).select('-password');
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ message: 'Profil bilgisi alınamadı.', error });
    }
});
exports.default = router;
