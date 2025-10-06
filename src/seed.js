"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const Quiz_1 = __importDefault(require("./models/Quiz"));
const Question_1 = __importDefault(require("./models/Question"));
const User_1 = __importDefault(require("./models/User"));
const Answer_1 = __importDefault(require("./models/Answer"));
dotenv_1.default.config();
const quizzes = [
    {
        title: "Genel Kültür Testi",
        description: "Dünya ve Türkiye hakkında genel kültür soruları.",
        questions: [
            {
                text: "Türkiye'nin başkenti neresidir?",
                answerOptions: [
                    { id: 1, text: "İstanbul" },
                    { id: 2, text: "Ankara" },
                    { id: 3, text: "İzmir" },
                ],
                numSelections: 1,
                isSkippingAllowed: false,
            },
            {
                text: "Aşağıdaki hayvanlardan hangisi memeli değildir?",
                answerOptions: [
                    { id: 1, text: "Yunus" },
                    { id: 2, text: "Penguen" },
                    { id: 3, text: "Yarasa" },
                ],
                numSelections: 1,
                isSkippingAllowed: true,
            },
        ],
    },
    {
        title: "Yazılım Geliştirme Temelleri",
        description: "Yazılım dünyasından temel bilgiler.",
        questions: [
            {
                text: "Bir mobil uygulama geliştirmek için kullanabileceğiniz cross-platform teknolojiler hangileridir?",
                answerOptions: [
                    { id: 1, text: "Flutter" },
                    { id: 2, text: "React Native" },
                    { id: 3, text: "Android Studio" },
                ],
                numSelections: 2,
                isSkippingAllowed: false,
            },
            {
                text: "Frontend ve Backend terimlerini açıklayan en iyi seçenek hangisidir?",
                answerOptions: [
                    { id: 1, text: "Backend kullanıcı arayüzü, Frontend sunucu tarafı mantığıdır." },
                    { id: 2, text: "Frontend kullanıcı arayüzü, Backend sunucu tarafı mantığıdır." },
                ],
                numSelections: 1,
                isSkippingAllowed: false,
            },
        ],
    },
];
async function seedDatabase() {
    try {
        await mongoose_1.default.connect(process.env.MONGO_URI);
        console.log('Database connection successful.');
        // Tüm eski verileri temizle
        await User_1.default.deleteMany({});
        await Quiz_1.default.deleteMany({});
        await Question_1.default.deleteMany({});
        await Answer_1.default.deleteMany({});
        console.log('Old data was cleared.');
        for (const quizData of quizzes) {
            const savedQuestions = [];
            for (const q of quizData.questions) {
                const newQuestion = new Question_1.default(q);
                await newQuestion.save();
                savedQuestions.push(newQuestion._id);
            }
            const newQuiz = new Quiz_1.default({
                title: quizData.title,
                description: quizData.description,
                questions: savedQuestions,
            });
            await newQuiz.save();
        }
        console.log('Mock data added successfully!');
    }
    catch (error) {
        console.error('An error occurred while adding data:', error);
    }
    finally {
        await mongoose_1.default.disconnect();
    }
}
seedDatabase();
